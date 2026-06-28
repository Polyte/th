// Supabase-backed API client.
// Preserves the previous DatabaseService surface so existing components keep working.

import { SERVER_BASE, publicAnonKey, getSupabase } from "./supabaseClient";

export interface Lawyer {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  experience: string;
  availability?: string[];
  image: string;
  pricePerHour: number;
  email: string;
  phone: string;
  bio: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface TimeSlot {
  id: string;
  lawyerId: string;
  date: string;
  time: string;
  isAvailable: boolean;
  type: "video" | "phone" | "chat" | "in-person";
  duration: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  lawyerId: string;
  date: string;
  time: string;
  type: "video" | "phone" | "chat" | "in-person";
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  legalMatter: string;
  urgency: "normal" | "urgent" | "emergency";
  duration: number;
  price: number;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: "client" | "lawyer";
  message: string;
  timestamp: string;
  type?: "text" | "file";
}

export interface Enquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "replied" | "closed";
  reply: string;
  repliedAt: string;
  createdAt: string;
  updatedAt: string;
}

const fallbackLawyers: Lawyer[] = [
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
  },
];

const baseTimes = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

function isToday(date: string) {
  return date === new Date().toISOString().split("T")[0];
}

function fallbackSlots(lawyerId: string, date: string): TimeSlot[] {
  const nowHour = new Date().getHours();
  return baseTimes
    .filter((time) => !isToday(date) || parseInt(time.split(":")[0], 10) > nowHour)
    .map((time, i) => ({
      id: `${lawyerId}_${date}_${time}_${i}`,
      lawyerId,
      date,
      time,
      isAvailable: true,
      type: "video",
      duration: 30,
    }));
}

function createLocalAppointment(input: Partial<Appointment> & {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  lawyerId: string;
  date: string;
  time: string;
  type: Appointment["type"];
  legalMatter: string;
}): Appointment {
  const createdAt = new Date().toISOString();
  const appointment: Appointment = {
    id: `local_${Date.now().toString(36)}`,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    clientPhone: input.clientPhone,
    lawyerId: input.lawyerId,
    date: input.date,
    time: input.time,
    type: input.type,
    status: "pending",
    legalMatter: input.legalMatter,
    urgency: input.urgency || "normal",
    duration: input.duration || 30,
    price: input.price || 0,
    notes: "",
    adminNotes: "Created locally because the booking API was unavailable.",
    createdAt,
    updatedAt: createdAt,
  };

  try {
    const stored = JSON.parse(localStorage.getItem("local_appointments") || "[]");
    localStorage.setItem("local_appointments", JSON.stringify([appointment, ...stored]));
  } catch (error) {
    console.log("Could not store local appointment:", error);
  }

  return appointment;
}

function createLocalEnquiry(input: Partial<Enquiry> & { email: string; message: string }): Enquiry {
  const createdAt = new Date().toISOString();
  const enquiry: Enquiry = {
    id: `local_enq_${Date.now().toString(36)}`,
    firstName: input.firstName || "",
    lastName: input.lastName || "",
    email: input.email,
    phone: input.phone || "",
    subject: input.subject || "",
    message: input.message,
    status: "new",
    reply: "",
    repliedAt: "",
    createdAt,
    updatedAt: createdAt,
  };

  try {
    const stored = JSON.parse(localStorage.getItem("local_enquiries") || "[]");
    localStorage.setItem("local_enquiries", JSON.stringify([enquiry, ...stored]));
  } catch (error) {
    console.log("Could not store local enquiry:", error);
  }

  return enquiry;
}

function getLocalAppointments(): Appointment[] {
  try {
    return JSON.parse(localStorage.getItem("local_appointments") || "[]");
  } catch {
    return [];
  }
}

function getLocalEnquiries(): Enquiry[] {
  try {
    return JSON.parse(localStorage.getItem("local_enquiries") || "[]");
  } catch {
    return [];
  }
}

function updateLocalItem<T extends { id: string; updatedAt: string }>(key: string, id: string, updates: Partial<T>): T | null {
  try {
    const items = JSON.parse(localStorage.getItem(key) || "[]") as T[];
    const next = items.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item));
    localStorage.setItem(key, JSON.stringify(next));
    return next.find((item) => item.id === id) || null;
  } catch {
    return null;
  }
}

async function jsonFetch<T>(path: string, init: RequestInit = {}, useAuth: "anon" | "session" = "anon"): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (useAuth === "session") {
    const sb = getSupabase();
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Not authenticated. Please sign in.");
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["Authorization"] = `Bearer ${publicAnonKey}`;
  }

  const res = await fetch(`${SERVER_BASE}${path}`, { ...init, headers });
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { error: text };
  }
  if (!res.ok) {
    const errMsg = body?.error || `Request failed (${res.status})`;
    console.log(`API error on ${path}:`, errMsg);
    throw new Error(errMsg);
  }
  return body as T;
}

class API {
  // ---------------- Lawyers ----------------
  async getLawyers(): Promise<Lawyer[]> {
    try {
      const { lawyers } = await jsonFetch<{ lawyers: Lawyer[] }>(`/lawyers`);
      return lawyers.length > 0 ? lawyers : fallbackLawyers;
    } catch (error) {
      console.log("Using fallback lawyers because the booking API is unavailable:", error);
      return fallbackLawyers;
    }
  }

  async getLawyerById(id: string): Promise<Lawyer | null> {
    const lawyers = await this.getLawyers();
    return lawyers.find((l) => l.id === id) || null;
  }

  // ---------------- Slots ----------------
  async getAvailableTimeSlots(lawyerId: string, date: string): Promise<TimeSlot[]> {
    try {
      const { slots } = await jsonFetch<{ slots: { time: string; available: boolean; duration: number }[] }>(
        `/lawyers/${lawyerId}/slots?date=${encodeURIComponent(date)}`,
      );
      return slots.map((s, i) => ({
        id: `${lawyerId}_${date}_${s.time}_${i}`,
        lawyerId,
        date,
        time: s.time,
        isAvailable: s.available,
        type: "video",
        duration: s.duration,
      }));
    } catch (error) {
      console.log("Using fallback appointment slots because the booking API is unavailable:", error);
      return fallbackSlots(lawyerId, date);
    }
  }

  // ---------------- Appointments ----------------
  async createAppointment(input: Partial<Appointment> & {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    lawyerId: string;
    date: string;
    time: string;
    type: Appointment["type"];
    legalMatter: string;
  }): Promise<Appointment> {
    try {
      const { appointment } = await jsonFetch<{ appointment: Appointment }>(`/appointments`, {
        method: "POST",
        body: JSON.stringify(input),
      });
      return appointment;
    } catch (error) {
      console.log("Creating a local pending appointment because the booking API is unavailable:", error);
      return createLocalAppointment(input);
    }
  }

  async getAppointment(id: string): Promise<Appointment | null> {
    try {
      const { appointment } = await jsonFetch<{ appointment: Appointment }>(`/appointments/${id}`);
      return appointment;
    } catch {
      return null;
    }
  }

  async listAppointments(): Promise<Appointment[]> {
    try {
      const { appointments } = await jsonFetch<{ appointments: Appointment[] }>(`/appointments`, {}, "session");
      const local = getLocalAppointments();
      return [...local, ...appointments].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } catch (error) {
      const local = getLocalAppointments();
      if (local.length > 0) return local;
      throw error;
    }
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    if (id.startsWith("local_")) {
      const appointment = updateLocalItem<Appointment>("local_appointments", id, updates);
      if (!appointment) throw new Error("Local appointment not found");
      return appointment;
    }
    const { appointment } = await jsonFetch<{ appointment: Appointment }>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }, "session");
    return appointment;
  }

  // ---------------- Enquiries ----------------
  async createEnquiry(input: Partial<Enquiry> & { email: string; message: string }): Promise<Enquiry> {
    try {
      const { enquiry } = await jsonFetch<{ enquiry: Enquiry }>(`/enquiries`, {
        method: "POST",
        body: JSON.stringify(input),
      });
      return enquiry;
    } catch (error) {
      console.log("Creating a local enquiry because the contact API is unavailable:", error);
      return createLocalEnquiry(input);
    }
  }

  async listEnquiries(): Promise<Enquiry[]> {
    try {
      const { enquiries } = await jsonFetch<{ enquiries: Enquiry[] }>(`/enquiries`, {}, "session");
      const local = getLocalEnquiries();
      return [...local, ...enquiries].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } catch (error) {
      const local = getLocalEnquiries();
      if (local.length > 0) return local;
      throw error;
    }
  }

  async updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    if (id.startsWith("local_enq_")) {
      const enquiry = updateLocalItem<Enquiry>("local_enquiries", id, updates);
      if (!enquiry) throw new Error("Local enquiry not found");
      return enquiry;
    }
    const { enquiry } = await jsonFetch<{ enquiry: Enquiry }>(`/enquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }, "session");
    return enquiry;
  }

  // ---------------- Admin ----------------
  async adminSignup(email: string, password: string, name: string, setupKey: string): Promise<void> {
    await jsonFetch(`/admin/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, name, setupKey }),
    });
  }

  async getStats(): Promise<any> {
    try {
      const { stats } = await jsonFetch<{ stats: any }>(`/admin/stats`, {}, "session");
      return stats;
    } catch (error) {
      const appointments = getLocalAppointments();
      const enquiries = getLocalEnquiries();
      if (appointments.length === 0 && enquiries.length === 0) throw error;
      const today = new Date().toISOString().split("T")[0];
      return {
        appointments: {
          total: appointments.length,
          pending: appointments.filter((a) => a.status === "pending").length,
          accepted: appointments.filter((a) => a.status === "accepted").length,
          completed: appointments.filter((a) => a.status === "completed").length,
          today: appointments.filter((a) => a.date === today).length,
          revenue: appointments.filter((a) => a.status === "completed").reduce((sum, a) => sum + (a.price || 0), 0),
        },
        enquiries: {
          total: enquiries.length,
          unread: enquiries.filter((e) => e.status === "new").length,
          replied: enquiries.filter((e) => e.status === "replied").length,
        },
      };
    }
  }
}

export const db = new API();
