import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Send,
  ShieldCheck,
  User as UserIcon,
  Video,
  XCircle,
} from "lucide-react";
import { getSupabase } from "../services/supabaseClient";
import { db, type Appointment, type Enquiry } from "../services/database";
import { VideoCall } from "./VideoCall";

type Tab = "overview" | "inbox" | "appointments";

export function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!session) return <AuthGate />;
  return <Dashboard session={session} onSignOut={() => getSupabase().auth.signOut()} />;
}

// ====================================================================
// Auth gate
// ====================================================================
function AuthGate() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      if (mode === "signup") {
        await db.adminSignup(email, password, name || "Admin", setupKey);
      }
      const { error } = await getSupabase().auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (e: any) {
      setErr(e.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-3">
            <ShieldCheck className="text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Admin Portal</h2>
          <p className="text-sm text-slate-500 mt-1">TH Manyika Attorneys</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`py-2 rounded-md text-sm transition ${
                mode === m ? "bg-white shadow text-slate-900" : "text-slate-500"
              }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handle} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label>Setup Key</Label>
                <Input type="password" value={setupKey} onChange={(e) => setSetupKey(e.target.value)} required />
              </div>
            </>
          )}
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">{err}</div>
          )}
          <Button type="submit" disabled={busy} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Admin Account"}
          </Button>
        </form>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Admin access only. New accounts require the server setup key.
        </p>
      </Card>
    </div>
  );
}

// ====================================================================
// Dashboard
// ====================================================================
function Dashboard({ session, onSignOut }: { session: any; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeCall, setActiveCall] = useState<{ appointment: Appointment; mode: "video" | "phone" } | null>(null);
  const [refreshError, setRefreshError] = useState("");

  async function refresh() {
    try {
      const [s, a, e] = await Promise.all([db.getStats(), db.listAppointments(), db.listEnquiries()]);
      setStats(s);
      setAppointments(a);
      setEnquiries(e);
      setRefreshError("");
    } catch (err) {
      console.log("Refresh error:", err);
      setRefreshError(err instanceof Error ? err.message : "Could not load dashboard data.");
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, []);

  if (activeCall) {
    return (
      <VideoCall
        roomId={`appt_${activeCall.appointment.id}`}
        displayName={session.user.user_metadata?.name || "Attorney"}
        role="lawyer"
        audioOnly={activeCall.mode === "phone"}
        meta={{
          counterpartyName: activeCall.appointment.clientName,
          subject: activeCall.appointment.legalMatter,
        }}
        onLeave={() => {
          setActiveCall(null);
          refresh();
        }}
      />
    );
  }

  const unread = enquiries.filter((e) => e.status === "new").length;
  const pending = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">Admin Console</h1>
              <p className="text-xs text-slate-500">{session.user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onSignOut} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex gap-2">
          <TabBtn active={tab === "overview"} onClick={() => setTab("overview")} icon={<LayoutDashboard className="w-4 h-4" />}>
            Overview
          </TabBtn>
          <TabBtn active={tab === "inbox"} onClick={() => setTab("inbox")} icon={<Inbox className="w-4 h-4" />} badge={unread}>
            Inbox
          </TabBtn>
          <TabBtn active={tab === "appointments"} onClick={() => setTab("appointments")} icon={<Calendar className="w-4 h-4" />} badge={pending}>
            Appointments
          </TabBtn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {refreshError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {refreshError}
          </div>
        )}
        {tab === "overview" && <Overview stats={stats} appointments={appointments} enquiries={enquiries} />}
        {tab === "inbox" && <InboxView enquiries={enquiries} onChange={refresh} />}
        {tab === "appointments" && (
          <AppointmentsView appointments={appointments} onChange={refresh} onCall={(appt, mode) => setActiveCall({ appointment: appt, mode })} />
        )}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, badge, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition text-sm ${
        active ? "border-amber-600 text-amber-700 font-medium" : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {icon}
      {children}
      {badge ? <Badge className="bg-red-500 text-white ml-1">{badge}</Badge> : null}
    </button>
  );
}

// ====================================================================
// Overview
// ====================================================================
function Overview({ stats, appointments, enquiries }: any) {
  const s = stats?.appointments || {};
  const e = stats?.enquiries || {};
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Calendar />} label="Today" value={s.today ?? 0} tone="amber" />
        <StatCard icon={<Clock />} label="Pending Approvals" value={s.pending ?? 0} tone="orange" />
        <StatCard icon={<Mail />} label="Unread Enquiries" value={e.unread ?? 0} tone="blue" />
        <StatCard icon={<DollarSign />} label="Revenue (R)" value={(s.revenue ?? 0).toLocaleString()} tone="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Latest Appointments" icon={<Calendar className="w-4 h-4" />}>
          {appointments.slice(0, 5).map((a: Appointment) => (
            <div key={a.id} className="flex justify-between items-center py-3 border-b last:border-0">
              <div>
                <p className="font-medium text-slate-900 text-sm">{a.clientName}</p>
                <p className="text-xs text-slate-500">{a.date} · {a.time} · {a.type}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
          {appointments.length === 0 && <p className="text-sm text-slate-400 py-6 text-center">No appointments yet.</p>}
        </Panel>
        <Panel title="Recent Enquiries" icon={<Mail className="w-4 h-4" />}>
          {enquiries.slice(0, 5).map((e: Enquiry) => (
            <div key={e.id} className="py-3 border-b last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{e.firstName} {e.lastName}</p>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{e.subject || e.message}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
            </div>
          ))}
          {enquiries.length === 0 && <p className="text-sm text-slate-400 py-6 text-center">No enquiries yet.</p>}
        </Panel>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, tone }: any) {
  const tones: any = {
    amber: "from-amber-500 to-amber-700",
    orange: "from-orange-500 to-red-600",
    blue: "from-blue-500 to-blue-700",
    green: "from-emerald-500 to-emerald-700",
  };
  return (
    <Card className="p-5 overflow-hidden relative">
      <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br ${tones[tone]} opacity-10`} />
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tones[tone]} flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
    </Card>
  );
}

function Panel({ title, icon, children }: any) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
        {icon} {title}
      </div>
      <div>{children}</div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700",
    accepted: "bg-blue-100 text-blue-700",
    "in-progress": "bg-purple-100 text-purple-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-slate-200 text-slate-600",
    new: "bg-red-100 text-red-700",
    in_progress: "bg-blue-100 text-blue-700",
    replied: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-200 text-slate-600",
  };
  return <Badge className={`${map[status] || "bg-slate-100 text-slate-700"} border-0 text-xs`}>{status}</Badge>;
}

// ====================================================================
// Inbox
// ====================================================================
function InboxView({ enquiries, onChange }: { enquiries: Enquiry[]; onChange: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(enquiries[0]?.id || null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return [e.firstName, e.lastName, e.email, e.subject, e.message].some((v) => (v || "").toLowerCase().includes(q));
    });
  }, [enquiries, filter, query]);

  const selected = filtered.find((e) => e.id === selectedId) || filtered[0] || null;

  useEffect(() => {
    setReply(selected?.reply || "");
  }, [selected?.id]);

  async function send(status: Enquiry["status"]) {
    if (!selected) return;
    setBusy(true);
    try {
      await db.updateEnquiry(selected.id, { reply, status });
      await onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 h-[calc(100vh-220px)]">
      <Card className="p-0 overflow-hidden flex flex-col">
        <div className="p-3 border-b space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search enquiries…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {["all", "new", "in_progress", "replied", "closed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-2 py-1 rounded ${filter === f ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {filtered.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedId(e.id)}
              className={`w-full text-left p-3 border-b hover:bg-slate-50 transition ${
                selected?.id === e.id ? "bg-amber-50" : ""
              }`}
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm text-slate-900 truncate">{e.firstName} {e.lastName}</span>
                <StatusBadge status={e.status} />
              </div>
              <p className="text-xs text-slate-500 truncate">{e.subject || "(no subject)"}</p>
              <p className="text-xs text-slate-400 truncate mt-1">{e.message}</p>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-sm text-slate-400 text-center py-12">No enquiries.</p>}
        </div>
      </Card>

      <Card className="p-6 flex flex-col">
        {selected ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selected.firstName} {selected.lastName}</h3>
                <div className="flex gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selected.email}</span>
                  {selected.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selected.phone}</span>}
                </div>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            {selected.subject && <p className="font-medium text-slate-800 mb-2">Subject: {selected.subject}</p>}
            <div className="bg-slate-50 p-4 rounded text-sm text-slate-700 mb-4 whitespace-pre-wrap">{selected.message}</div>

            <Label className="mb-2">Reply</Label>
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your response…"
              className="flex-1 min-h-[160px] mb-4"
            />
            <div className="flex gap-2 flex-wrap">
              <Button disabled={busy || !reply} onClick={() => send("replied")} className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                <Send className="w-4 h-4" /> Send Reply
              </Button>
              <Button variant="outline" disabled={busy} onClick={() => send("in_progress")}>Mark In Progress</Button>
              <Button variant="outline" disabled={busy} onClick={() => send("closed")}>Close</Button>
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-center my-auto">Select an enquiry to view.</p>
        )}
      </Card>
    </div>
  );
}

// ====================================================================
// Appointments
// ====================================================================
function AppointmentsView({
  appointments,
  onChange,
  onCall,
}: {
  appointments: Appointment[];
  onChange: () => void;
  onCall: (a: Appointment, mode: "video" | "phone") => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = appointments.filter((a) => (filter === "all" ? true : a.status === filter));

  async function update(a: Appointment, updates: Partial<Appointment>) {
    setBusyId(a.id);
    try {
      await db.updateAppointment(a.id, updates);
      await onChange();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "accepted", "in-progress", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-1.5 rounded-lg ${filter === f ? "bg-amber-600 text-white" : "bg-white border text-slate-600 hover:bg-slate-50"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{a.clientName}</h3>
                    <p className="text-xs text-slate-500">{a.clientEmail} · {a.clientPhone}</p>
                  </div>
                  <StatusBadge status={a.status} />
                  {a.urgency !== "normal" && (
                    <Badge className={`${a.urgency === "emergency" ? "bg-red-500" : "bg-orange-500"} text-white border-0`}>
                      {a.urgency}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-600 mb-3">
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-amber-600" /> {a.date}</div>
                  <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-600" /> {a.time}</div>
                  <div className="flex items-center gap-1 capitalize">
                    {a.type === "video" ? <Video className="w-4 h-4 text-amber-600" /> : a.type === "phone" ? <Phone className="w-4 h-4 text-amber-600" /> : <MessageSquare className="w-4 h-4 text-amber-600" />}
                    {a.type}
                  </div>
                  <div className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-amber-600" /> R{a.price}</div>
                </div>

                <p className="text-sm text-slate-700 bg-slate-50 rounded p-3">{a.legalMatter}</p>
              </div>

              <div className="flex flex-col gap-2 lg:w-48">
                {a.status === "pending" && (
                  <>
                    <Button disabled={busyId === a.id} onClick={() => update(a, { status: "accepted" })} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                      <CheckCircle className="w-4 h-4" /> Accept
                    </Button>
                    <Button disabled={busyId === a.id} onClick={() => update(a, { status: "cancelled" })} variant="outline" className="gap-2 text-red-600 border-red-200">
                      <XCircle className="w-4 h-4" /> Decline
                    </Button>
                  </>
                )}
                {a.status === "accepted" && (a.type === "video" || a.type === "phone") && (
                  <Button onClick={() => onCall(a, a.type as "video" | "phone")} className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                    {a.type === "video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />} Start {a.type === "video" ? "Video" : "Voice"} Call
                  </Button>
                )}
                {a.status === "accepted" && (
                  <Button variant="outline" disabled={busyId === a.id} onClick={() => update(a, { status: "completed" })}>
                    Mark Completed
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {list.length === 0 && (
          <Card className="p-12 text-center text-slate-400">No appointments in this view.</Card>
        )}
      </div>
    </div>
  );
}
