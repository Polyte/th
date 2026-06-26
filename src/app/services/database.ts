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
    const { lawyers } = await jsonFetch<{ lawyers: Lawyer[] }>(`/lawyers`);
    return lawyers;
  }

  async getLawyerById(id: string): Promise<Lawyer | null> {
    const lawyers = await this.getLawyers();
    return lawyers.find((l) => l.id === id) || null;
  }

  // ---------------- Slots ----------------
  async getAvailableTimeSlots(lawyerId: string, date: string): Promise<TimeSlot[]> {
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
    const { appointment } = await jsonFetch<{ appointment: Appointment }>(`/appointments`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return appointment;
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
    const { appointments } = await jsonFetch<{ appointments: Appointment[] }>(`/appointments`, {}, "session");
    return appointments;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const { appointment } = await jsonFetch<{ appointment: Appointment }>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }, "session");
    return appointment;
  }

  // ---------------- Enquiries ----------------
  async createEnquiry(input: Partial<Enquiry> & { email: string; message: string }): Promise<Enquiry> {
    const { enquiry } = await jsonFetch<{ enquiry: Enquiry }>(`/enquiries`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return enquiry;
  }

  async listEnquiries(): Promise<Enquiry[]> {
    const { enquiries } = await jsonFetch<{ enquiries: Enquiry[] }>(`/enquiries`, {}, "session");
    return enquiries;
  }

  async updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    const { enquiry } = await jsonFetch<{ enquiry: Enquiry }>(`/enquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }, "session");
    return enquiry;
  }

  // ---------------- Admin ----------------
  async adminSignup(email: string, password: string, name: string): Promise<void> {
    await jsonFetch(`/admin/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async getStats(): Promise<any> {
    const { stats } = await jsonFetch<{ stats: any }>(`/admin/stats`, {}, "session");
    return stats;
  }
}

export const db = new API();
