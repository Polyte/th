import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient as createSupabaseClient } from "jsr:@supabase/supabase-js@2";
import { createClient as createTursoClient } from "npm:@tursodatabase/serverless/compat";

const app = new Hono();

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const BASE = "/make-server-2f11e106";

const supabase = createSupabaseClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const tursoUrl = Deno.env.get("TURSO_DATABASE_URL");
const tursoAuthToken = Deno.env.get("TURSO_AUTH_TOKEN");
if (!tursoUrl || !tursoAuthToken) {
  console.log("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN. Database routes will fail until configured.");
}

let turso: ReturnType<typeof createTursoClient> | null = null;

const id = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

function json(value: unknown) {
  return JSON.stringify(value ?? null);
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function requireAdmin(c: any): Promise<{ ok: boolean; userId?: string; error?: string }> {
  const auth = c.req.header("Authorization");
  const token = auth?.split(" ")[1];
  if (!token) return { ok: false, error: "Missing auth token" };
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return { ok: false, error: error?.message || "Invalid token" };
    const role = data.user.user_metadata?.role;
    if (role !== "admin") return { ok: false, error: "Admin role required" };
    return { ok: true, userId: data.user.id };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

async function exec(sql: string, args: any[] = []) {
  if (!tursoUrl || !tursoAuthToken) {
    throw new Error("Turso is not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.");
  }
  turso ||= createTursoClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });
  return await turso.execute({ sql, args });
}

function rowToLawyer(row: any) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    specialties: parseJson<string[]>(row.specialties, []),
    rating: Number(row.rating || 0),
    experience: row.experience,
    availability: parseJson<string[]>(row.availability, []),
    image: row.image,
    pricePerHour: Number(row.price_per_hour || 0),
    email: row.email,
    phone: row.phone,
    bio: row.bio,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToAppointment(row: any) {
  return {
    id: row.id,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    lawyerId: row.lawyer_id,
    date: row.date,
    time: row.time,
    type: row.type,
    status: row.status,
    legalMatter: row.legal_matter,
    urgency: row.urgency,
    duration: Number(row.duration || 30),
    price: Number(row.price || 0),
    notes: row.notes || "",
    adminNotes: row.admin_notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToEnquiry(row: any) {
  return {
    id: row.id,
    firstName: row.first_name || "",
    lastName: row.last_name || "",
    email: row.email,
    phone: row.phone || "",
    subject: row.subject || "",
    message: row.message,
    status: row.status,
    reply: row.reply || "",
    repliedAt: row.replied_at || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function ensureSchema() {
  await exec(`
    CREATE TABLE IF NOT EXISTS lawyers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      specialties TEXT NOT NULL DEFAULT '[]',
      rating REAL NOT NULL DEFAULT 0,
      experience TEXT NOT NULL,
      availability TEXT NOT NULL DEFAULT '[]',
      image TEXT NOT NULL,
      price_per_hour INTEGER NOT NULL DEFAULT 0,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      bio TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  await exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      lawyer_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      legal_matter TEXT NOT NULL,
      urgency TEXT NOT NULL DEFAULT 'normal',
      duration INTEGER NOT NULL DEFAULT 30,
      price INTEGER NOT NULL DEFAULT 0,
      notes TEXT NOT NULL DEFAULT '',
      admin_notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (lawyer_id) REFERENCES lawyers(id)
    )
  `);
  await exec("CREATE INDEX IF NOT EXISTS idx_appointments_lawyer_date ON appointments(lawyer_id, date, status)");
  await exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL DEFAULT '',
      last_name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      reply TEXT NOT NULL DEFAULT '',
      replied_at TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  await exec("CREATE INDEX IF NOT EXISTS idx_enquiries_status_created ON enquiries(status, created_at)");
}

async function ensureSeeded() {
  await ensureSchema();
  const existing = await exec("SELECT COUNT(*) AS count FROM lawyers");
  if (Number(existing.rows[0]?.count || 0) > 0) return;

  const lawyers = [
    {
      id: "lawyer_001",
      name: "Thabo H. Manyika",
      title: "Senior Partner & Founder",
      specialties: ["Corporate Law", "Litigation", "Mergers & Acquisitions"],
      rating: 4.9,
      experience: "20+ years",
      pricePerHour: 750,
      email: "thabo@thmanyika.co.za",
      phone: "+27 78 213 1116",
      bio: "Leading expert in corporate law with extensive experience in complex commercial litigation.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "lawyer_002",
      name: "Dr. Helen Richards",
      title: "Partner",
      specialties: ["Employment Law", "Property Law", "Family Law"],
      rating: 4.8,
      experience: "15+ years",
      pricePerHour: 600,
      email: "helen@thmanyika.co.za",
      phone: "+27 78 213 1117",
      bio: "Specialist in employment and property law with Ph.D. in Legal Studies.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "lawyer_003",
      name: "Michael Nkomo",
      title: "Associate Attorney",
      specialties: ["Contract Law", "Compliance", "Criminal Defense", "Civil Law"],
      rating: 4.9,
      experience: "8+ years",
      pricePerHour: 450,
      email: "michael@thmanyika.co.za",
      phone: "+27 78 213 1118",
      bio: "Expert in contract drafting and regulatory compliance across multiple industries.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
  ];

  for (const l of lawyers) {
    await exec(
      `INSERT INTO lawyers (
        id, name, title, specialties, rating, experience, availability, image,
        price_per_hour, email, phone, bio, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        l.id,
        l.name,
        l.title,
        json(l.specialties),
        l.rating,
        l.experience,
        json(["Mon", "Tue", "Wed", "Thu", "Fri"]),
        l.image,
        l.pricePerHour,
        l.email,
        l.phone,
        l.bio,
        now(),
        now(),
      ],
    );
  }
  console.log("Seeded Turso lawyers");
}

ensureSeeded().catch((e) => console.log("Turso seed error:", e));

app.get(`${BASE}/health`, async (c) => {
  try {
    await ensureSchema();
    return c.json({ status: "ok", database: "turso", time: now() });
  } catch (e: any) {
    return c.json({ status: "error", database: "turso", error: e.message, time: now() }, 500);
  }
});

app.get(`${BASE}/lawyers`, async (c) => {
  try {
    await ensureSchema();
    const result = await exec("SELECT * FROM lawyers WHERE is_active = 1 ORDER BY name");
    return c.json({ lawyers: result.rows.map(rowToLawyer) });
  } catch (e: any) {
    console.log("Error listing lawyers:", e);
    return c.json({ error: `Failed to list lawyers: ${e.message}` }, 500);
  }
});

app.get(`${BASE}/lawyers/:id/slots`, async (c) => {
  try {
    await ensureSchema();
    const lawyerId = c.req.param("id");
    const date = c.req.query("date");
    if (!date) return c.json({ error: "date query parameter required" }, 400);

    const lawyer = await exec("SELECT id FROM lawyers WHERE id = ? AND is_active = 1", [lawyerId]);
    if (lawyer.rows.length === 0) return c.json({ error: "Lawyer not found" }, 404);

    const baseTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
    const todayStr = new Date().toISOString().split("T")[0];
    const minHour = date === todayStr ? new Date().getHours() : -1;
    const available = baseTimes.filter((t) => parseInt(t.split(":")[0], 10) > minHour);

    const bookedRows = await exec(
      "SELECT time FROM appointments WHERE lawyer_id = ? AND date = ? AND status != 'cancelled'",
      [lawyerId, date],
    );
    const booked = bookedRows.rows.map((row: any) => row.time);
    const slots = available
      .filter((t) => !booked.includes(t))
      .map((time) => ({ time, available: true, duration: 30 }));

    return c.json({ slots });
  } catch (e: any) {
    console.log("Error listing slots:", e);
    return c.json({ error: `Failed to get slots: ${e.message}` }, 500);
  }
});

app.post(`${BASE}/appointments`, async (c) => {
  try {
    await ensureSchema();
    const body = await c.req.json();
    const required = ["clientName", "clientEmail", "clientPhone", "lawyerId", "date", "time", "type", "legalMatter"];
    for (const k of required) {
      if (!body[k]) return c.json({ error: `Missing field: ${k}` }, 400);
    }

    const appt = {
      id: `appt_${id()}`,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      lawyerId: body.lawyerId,
      date: body.date,
      time: body.time,
      type: body.type,
      legalMatter: body.legalMatter,
      urgency: body.urgency || "normal",
      duration: body.duration || 30,
      price: body.price || 0,
      status: "pending",
      notes: "",
      adminNotes: "",
      createdAt: now(),
      updatedAt: now(),
    };

    await exec(
      `INSERT INTO appointments (
        id, client_name, client_email, client_phone, lawyer_id, date, time, type,
        status, legal_matter, urgency, duration, price, notes, admin_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appt.id,
        appt.clientName,
        appt.clientEmail,
        appt.clientPhone,
        appt.lawyerId,
        appt.date,
        appt.time,
        appt.type,
        appt.status,
        appt.legalMatter,
        appt.urgency,
        appt.duration,
        appt.price,
        appt.notes,
        appt.adminNotes,
        appt.createdAt,
        appt.updatedAt,
      ],
    );
    return c.json({ appointment: appt });
  } catch (e: any) {
    console.log("Error creating appointment:", e);
    return c.json({ error: `Failed to create appointment: ${e.message}` }, 500);
  }
});

app.get(`${BASE}/appointments`, async (c) => {
  const guard = await requireAdmin(c);
  if (!guard.ok) return c.json({ error: `Authorization error: ${guard.error}` }, 401);
  try {
    await ensureSchema();
    const result = await exec("SELECT * FROM appointments ORDER BY created_at DESC");
    return c.json({ appointments: result.rows.map(rowToAppointment) });
  } catch (e: any) {
    return c.json({ error: `Failed to list appointments: ${e.message}` }, 500);
  }
});

app.get(`${BASE}/appointments/:id`, async (c) => {
  try {
    await ensureSchema();
    const result = await exec("SELECT * FROM appointments WHERE id = ?", [c.req.param("id")]);
    if (result.rows.length === 0) return c.json({ error: "Not found" }, 404);
    return c.json({ appointment: rowToAppointment(result.rows[0]) });
  } catch (e: any) {
    return c.json({ error: `Failed: ${e.message}` }, 500);
  }
});

app.patch(`${BASE}/appointments/:id`, async (c) => {
  const guard = await requireAdmin(c);
  if (!guard.ok) return c.json({ error: `Authorization error: ${guard.error}` }, 401);
  try {
    await ensureSchema();
    const apptId = c.req.param("id");
    const existing = await exec("SELECT * FROM appointments WHERE id = ?", [apptId]);
    if (existing.rows.length === 0) return c.json({ error: "Not found" }, 404);
    const updates = await c.req.json();
    const current = rowToAppointment(existing.rows[0]);
    const merged = { ...current, ...updates, updatedAt: now() };
    await exec(
      `UPDATE appointments SET
        client_name = ?, client_email = ?, client_phone = ?, lawyer_id = ?, date = ?, time = ?,
        type = ?, status = ?, legal_matter = ?, urgency = ?, duration = ?, price = ?,
        notes = ?, admin_notes = ?, updated_at = ?
      WHERE id = ?`,
      [
        merged.clientName,
        merged.clientEmail,
        merged.clientPhone,
        merged.lawyerId,
        merged.date,
        merged.time,
        merged.type,
        merged.status,
        merged.legalMatter,
        merged.urgency,
        merged.duration,
        merged.price,
        merged.notes || "",
        merged.adminNotes || "",
        merged.updatedAt,
        apptId,
      ],
    );
    return c.json({ appointment: merged });
  } catch (e: any) {
    return c.json({ error: `Failed to update appointment: ${e.message}` }, 500);
  }
});

app.post(`${BASE}/enquiries`, async (c) => {
  try {
    await ensureSchema();
    const body = await c.req.json();
    if (!body.email || !body.message) {
      return c.json({ error: "email and message are required" }, 400);
    }
    const enq = {
      id: `enq_${id()}`,
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      email: body.email,
      phone: body.phone || "",
      subject: body.subject || "",
      message: body.message,
      status: "new",
      reply: "",
      repliedAt: "",
      createdAt: now(),
      updatedAt: now(),
    };
    await exec(
      `INSERT INTO enquiries (
        id, first_name, last_name, email, phone, subject, message, status, reply, replied_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [enq.id, enq.firstName, enq.lastName, enq.email, enq.phone, enq.subject, enq.message, enq.status, enq.reply, enq.repliedAt, enq.createdAt, enq.updatedAt],
    );
    return c.json({ enquiry: enq });
  } catch (e: any) {
    console.log("Error creating enquiry:", e);
    return c.json({ error: `Failed to create enquiry: ${e.message}` }, 500);
  }
});

app.get(`${BASE}/enquiries`, async (c) => {
  const guard = await requireAdmin(c);
  if (!guard.ok) return c.json({ error: `Authorization error: ${guard.error}` }, 401);
  try {
    await ensureSchema();
    const result = await exec("SELECT * FROM enquiries ORDER BY created_at DESC");
    return c.json({ enquiries: result.rows.map(rowToEnquiry) });
  } catch (e: any) {
    return c.json({ error: `Failed to list enquiries: ${e.message}` }, 500);
  }
});

app.patch(`${BASE}/enquiries/:id`, async (c) => {
  const guard = await requireAdmin(c);
  if (!guard.ok) return c.json({ error: `Authorization error: ${guard.error}` }, 401);
  try {
    await ensureSchema();
    const enqId = c.req.param("id");
    const existing = await exec("SELECT * FROM enquiries WHERE id = ?", [enqId]);
    if (existing.rows.length === 0) return c.json({ error: "Not found" }, 404);
    const updates = await c.req.json();
    const current = rowToEnquiry(existing.rows[0]);
    const merged = {
      ...current,
      ...updates,
      repliedAt: updates.reply && updates.reply !== current.reply ? now() : current.repliedAt,
      status: updates.reply && !updates.status ? "replied" : updates.status || current.status,
      updatedAt: now(),
    };
    await exec(
      `UPDATE enquiries SET
        first_name = ?, last_name = ?, email = ?, phone = ?, subject = ?, message = ?,
        status = ?, reply = ?, replied_at = ?, updated_at = ?
      WHERE id = ?`,
      [
        merged.firstName,
        merged.lastName,
        merged.email,
        merged.phone,
        merged.subject,
        merged.message,
        merged.status,
        merged.reply,
        merged.repliedAt,
        merged.updatedAt,
        enqId,
      ],
    );
    return c.json({ enquiry: merged });
  } catch (e: any) {
    return c.json({ error: `Failed to update enquiry: ${e.message}` }, 500);
  }
});

app.post(`${BASE}/admin/signup`, async (c) => {
  try {
    const { email, password, name, setupKey } = await c.req.json();
    if (!email || !password) return c.json({ error: "Email and password required" }, 400);
    const expectedSetupKey = Deno.env.get("ADMIN_SETUP_KEY");
    if (!expectedSetupKey) return c.json({ error: "Admin signup is disabled until ADMIN_SETUP_KEY is configured." }, 403);
    if (setupKey !== expectedSetupKey) return c.json({ error: "Invalid admin setup key." }, 403);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || "Admin", role: "admin" },
      email_confirm: true,
    });
    if (error) {
      console.log("Admin signup error:", error.message);
      return c.json({ error: `Signup failed: ${error.message}` }, 400);
    }
    return c.json({ user: data.user });
  } catch (e: any) {
    console.log("Admin signup error (catch):", e);
    return c.json({ error: `Signup failed: ${e.message}` }, 500);
  }
});

app.get(`${BASE}/admin/stats`, async (c) => {
  const guard = await requireAdmin(c);
  if (!guard.ok) return c.json({ error: `Authorization error: ${guard.error}` }, 401);
  try {
    await ensureSchema();
    const [appts, enqs] = await Promise.all([
      exec("SELECT * FROM appointments"),
      exec("SELECT * FROM enquiries"),
    ]);
    const a = appts.rows.map(rowToAppointment);
    const e = enqs.rows.map(rowToEnquiry);
    const today = new Date().toISOString().split("T")[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    return c.json({
      stats: {
        appointments: {
          total: a.length,
          pending: a.filter((x) => x.status === "pending").length,
          accepted: a.filter((x) => x.status === "accepted").length,
          completed: a.filter((x) => x.status === "completed").length,
          today: a.filter((x) => x.date === today).length,
          thisMonth: a.filter((x) => (x.date || "").startsWith(thisMonth)).length,
          revenue: a.filter((x) => x.status === "completed").reduce((s, x) => s + (x.price || 0), 0),
        },
        enquiries: {
          total: e.length,
          unread: e.filter((x) => x.status === "new").length,
          replied: e.filter((x) => x.status === "replied").length,
        },
      },
    });
  } catch (err: any) {
    return c.json({ error: `Failed to get stats: ${err.message}` }, 500);
  }
});

Deno.serve(app.fetch);
