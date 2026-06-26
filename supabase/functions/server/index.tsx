import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

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

// ---------------- Supabase admin client (server-side) ----------------
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// ---------------- Helpers ----------------
const id = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

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

// ---------------- Seed lawyers on startup ----------------
async function ensureSeeded() {
  const existing = await kv.getByPrefix("lawyer:");
  if (existing && existing.length > 0) return;

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
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
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
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
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
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
  ];

  for (const l of lawyers) {
    await kv.set(`lawyer:${l.id}`, {
      ...l,
      isActive: true,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      createdAt: now(),
      updatedAt: now(),
    });
  }
  console.log("Seeded lawyers");
}
ensureSeeded().catch((e) => console.log("Seed error:", e));

// ---------------- Health ----------------
app.get(`${BASE}/health`, (c) => c.json({ status: "ok", time: now() }));

// ---------------- Lawyers ----------------
app.get(`${BASE}/lawyers`, async (c) => {
  try {
    const lawyers = await kv.getByPrefix("lawyer:");
    return c.json({ lawyers: lawyers.filter((l: any) => l.isActive) });
  } catch (e: any) {
    console.log("Error listing lawyers:", e);
    return c.json({ error: `Failed to list lawyers: ${e.message}` }, 500);
  }
});

// ---------------- Available slots ----------------
// Returns synthesized 30-min slots minus booked appointments for a lawyer on a date.
app.get(`${BASE}/lawyers/:id/slots`, async (c) => {
  try {
    const lawyerId = c.req.param("id");
    const date = c.req.query("date"); // YYYY-MM-DD
    if (!date) return c.json({ error: "date query parameter required" }, 400);

    const lawyer = await kv.get(`lawyer:${lawyerId}`);
    if (!lawyer) return c.json({ error: "Lawyer not found" }, 404);

    const baseTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

    // Filter past times for today
    const todayStr = new Date().toISOString().split("T")[0];
    const minHour = date === todayStr ? new Date().getHours() : -1;
    const available = baseTimes.filter((t) => parseInt(t.split(":")[0]) > minHour);

    // Exclude already-booked
    const appts = await kv.getByPrefix("appointment:");
    const booked = (appts || [])
      .filter((a: any) => a.lawyerId === lawyerId && a.date === date && a.status !== "cancelled")
      .map((a: any) => a.time);

    const slots = available
      .filter((t) => !booked.includes(t))
      .map((time) => ({ time, available: true, duration: 30 }));

    return c.json({ slots });
  } catch (e: any) {
    console.log("Error listing slots:", e);
    return c.json({ error: `Failed to get slots: ${e.message}` }, 500);
  }
});

// ---------------- Appointments ----------------
app.post(`${BASE}/appointments`, async (c) => {
  try {
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
      type: body.type, // 'video' | 'phone' | 'chat' | 'in-person'
      legalMatter: body.legalMatter,
      urgency: body.urgency || "normal",
      duration: body.duration || 30,
      price: body.price || 0,
      status: "pending", // pending -> accepted -> in-progress -> completed | cancelled
      notes: "",
      adminNotes: "",
      createdAt: now(),
      updatedAt: now(),
    };
    await kv.set(`appointment:${appt.id}`, appt);
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
    const appts = await kv.getByPrefix("appointment:");
    return c.json({ appointments: (appts || []).sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1)) });
  } catch (e: any) {
    return c.json({ error: `Failed to list appointments: ${e.message}` }, 500);
  }
});

app.get(`${BASE}/appointments/:id`, async (c) => {
  try {
    const appt = await kv.get(`appointment:${c.req.param("id")}`);
    if (!appt) return c.json({ error: "Not found" }, 404);
    return c.json({ appointment: appt });
  } catch (e: any) {
    return c.json({ error: `Failed: ${e.message}` }, 500);
  }
});

app.patch(`${BASE}/appointments/:id`, async (c) => {
  const guard = await requireAdmin(c);
  if (!guard.ok) return c.json({ error: `Authorization error: ${guard.error}` }, 401);
  try {
    const key = `appointment:${c.req.param("id")}`;
    const existing = await kv.get(key);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const updates = await c.req.json();
    const merged = { ...existing, ...updates, updatedAt: now() };
    await kv.set(key, merged);
    return c.json({ appointment: merged });
  } catch (e: any) {
    return c.json({ error: `Failed to update appointment: ${e.message}` }, 500);
  }
});

// ---------------- Enquiries (contact form) ----------------
app.post(`${BASE}/enquiries`, async (c) => {
  try {
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
      status: "new", // new | in_progress | replied | closed
      reply: "",
      repliedAt: "",
      createdAt: now(),
      updatedAt: now(),
    };
    await kv.set(`enquiry:${enq.id}`, enq);
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
    const items = await kv.getByPrefix("enquiry:");
    return c.json({ enquiries: (items || []).sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1)) });
  } catch (e: any) {
    return c.json({ error: `Failed to list enquiries: ${e.message}` }, 500);
  }
});

app.patch(`${BASE}/enquiries/:id`, async (c) => {
  const guard = await requireAdmin(c);
  if (!guard.ok) return c.json({ error: `Authorization error: ${guard.error}` }, 401);
  try {
    const key = `enquiry:${c.req.param("id")}`;
    const existing = await kv.get(key);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const updates = await c.req.json();
    if (updates.reply && updates.reply !== existing.reply) {
      updates.repliedAt = now();
      updates.status = updates.status || "replied";
    }
    const merged = { ...existing, ...updates, updatedAt: now() };
    await kv.set(key, merged);
    return c.json({ enquiry: merged });
  } catch (e: any) {
    return c.json({ error: `Failed to update enquiry: ${e.message}` }, 500);
  }
});

// ---------------- Admin signup ----------------
app.post(`${BASE}/admin/signup`, async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password) return c.json({ error: "Email and password required" }, 400);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || "Admin", role: "admin" },
      // Automatically confirm the user's email since an email server hasn't been configured.
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

// ---------------- Dashboard stats ----------------
app.get(`${BASE}/admin/stats`, async (c) => {
  const guard = await requireAdmin(c);
  if (!guard.ok) return c.json({ error: `Authorization error: ${guard.error}` }, 401);
  try {
    const [appts, enqs] = await Promise.all([
      kv.getByPrefix("appointment:"),
      kv.getByPrefix("enquiry:"),
    ]);
    const a = appts || [];
    const e = enqs || [];
    const today = new Date().toISOString().split("T")[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    return c.json({
      stats: {
        appointments: {
          total: a.length,
          pending: a.filter((x: any) => x.status === "pending").length,
          accepted: a.filter((x: any) => x.status === "accepted").length,
          completed: a.filter((x: any) => x.status === "completed").length,
          today: a.filter((x: any) => x.date === today).length,
          thisMonth: a.filter((x: any) => (x.date || "").startsWith(thisMonth)).length,
          revenue: a
            .filter((x: any) => x.status === "completed")
            .reduce((s: number, x: any) => s + (x.price || 0), 0),
        },
        enquiries: {
          total: e.length,
          unread: e.filter((x: any) => x.status === "new").length,
          replied: e.filter((x: any) => x.status === "replied").length,
        },
      },
    });
  } catch (err: any) {
    return c.json({ error: `Failed to get stats: ${err.message}` }, 500);
  }
});

Deno.serve(app.fetch);
