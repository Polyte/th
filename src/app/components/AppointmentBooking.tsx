import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Loader2,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Mail,
  User,
  AlertCircle,
  Shield,
} from "lucide-react";
import { db, type Lawyer, type TimeSlot, type Appointment } from "../services/database";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type Step = "lawyer" | "datetime" | "details" | "review" | "confirmed";
type MeetType = "video" | "phone" | "chat" | "in-person";

const meetingTypes: { id: MeetType; label: string; icon: any; desc: string; color: string }[] = [
  { id: "video", label: "Video Call", icon: Video, desc: "Secure HD video consultation", color: "from-accent to-yellow-500" },
  { id: "phone", label: "Phone Call", icon: Phone, desc: "Voice consultation", color: "from-blue-500 to-primary" },
  { id: "chat", label: "Live Chat", icon: MessageSquare, desc: "Real-time messaging", color: "from-purple-500 to-fuchsia-600" },
  { id: "in-person", label: "In Office", icon: MapPin, desc: "Visit our Midrand office", color: "from-emerald-500 to-green-600" },
];

const urgencyOptions: { value: "normal" | "urgent" | "emergency"; label: string; color: string }[] = [
  { value: "normal", label: "Normal", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { value: "urgent", label: "Urgent (24-48 hrs)", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "emergency", label: "Emergency (today)", color: "bg-red-50 text-red-700 border-red-200" },
];

export function AppointmentBooking() {
  const [step, setStep] = useState<Step>("lawyer");
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [selectedType, setSelectedType] = useState<MeetType>("video");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    legalMatter: "",
    urgency: "normal" as "normal" | "urgent" | "emergency",
  });
  const [submitting, setSubmitting] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await db.getLawyers();
        setLawyers(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedLawyer || !selectedDate) return;
    setSelectedTime("");
    (async () => {
      setSlotsLoading(true);
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const data = await db.getAvailableTimeSlots(selectedLawyer.id, dateStr);
        setSlots(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setSlotsLoading(false);
      }
    })();
  }, [selectedLawyer, selectedDate]);

  const dateStr = useMemo(
    () => (selectedDate ? selectedDate.toISOString().split("T")[0] : ""),
    [selectedDate],
  );

  const totalPrice = useMemo(
    () => (selectedLawyer ? Math.round(selectedLawyer.pricePerHour * 0.5) : 0),
    [selectedLawyer],
  );

  const canProceed = {
    lawyer: !!selectedLawyer,
    datetime: !!selectedDate && !!selectedTime,
    details:
      client.name.trim().length > 1 &&
      /^\S+@\S+\.\S+$/.test(client.email) &&
      client.phone.trim().length > 5 &&
      client.legalMatter.trim().length > 5,
  };

  async function handleSubmit() {
    if (!selectedLawyer || !selectedTime) return;
    setSubmitting(true);
    setError("");
    try {
      const appt = await db.createAppointment({
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        lawyerId: selectedLawyer.id,
        date: dateStr,
        time: selectedTime,
        type: selectedType,
        legalMatter: client.legalMatter,
        urgency: client.urgency,
        duration: 30,
        price: totalPrice,
      });
      setAppointment(appt);
      setStep("confirmed");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const stepIndex = ["lawyer", "datetime", "details", "review", "confirmed"].indexOf(step);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero strip */}
      <section className="relative bg-gradient-to-br from-primary via-blue-700 to-gray-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Online Booking · Confirmed in minutes
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Book Your Consultation</h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
              Choose your attorney, pick a time, and we'll handle the rest. Free first consultation for new clients.
            </p>
          </div>
        </div>
      </section>

      {/* Stepper */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between gap-2 max-w-3xl mx-auto">
            {["Attorney", "Date & Time", "Your Details", "Review", "Done"].map((label, i) => {
              const active = i === stepIndex;
              const complete = i < stepIndex;
              return (
                <div key={label} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        complete
                          ? "bg-accent text-black scale-95"
                          : active
                          ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {complete ? <CheckCircle className="h-5 w-5" /> : i + 1}
                    </div>
                    <span
                      className={`text-[11px] md:text-xs mt-2 text-center font-semibold whitespace-nowrap ${
                        active ? "text-primary" : complete ? "text-accent" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < 4 && (
                    <div className="flex-1 h-0.5 mx-1 md:mx-2 -mt-5 bg-gray-200 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-primary transition-all duration-500"
                        style={{ width: i < stepIndex ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-6xl">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-900">Something went wrong</div>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Step: pick attorney */}
        {step === "lawyer" && (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Attorney</h2>
              <p className="text-gray-600">Pick the legal professional best suited to your matter</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lawyers.map((l) => {
                  const selected = selectedLawyer?.id === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLawyer(l)}
                      className={`group text-left relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                        selected
                          ? "border-accent shadow-2xl scale-[1.02]"
                          : "border-gray-200 hover:border-primary/40"
                      }`}
                    >
                      {selected && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-black" />
                        </div>
                      )}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <ImageWithFallback
                            src={l.image}
                            alt={l.name}
                            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-accent rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                            <Star className="h-3 w-3 text-black fill-black" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{l.name}</h3>
                          <p className="text-sm text-primary font-semibold">{l.title}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <Star className="h-3 w-3 text-accent fill-accent" />
                            <span className="font-semibold text-gray-900">{l.rating}</span>
                            <span>·</span>
                            <span>{l.experience}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{l.bio}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {l.specialties.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2 py-1 rounded-md bg-primary/5 text-primary font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-xs text-gray-500">From</div>
                          <div className="font-bold text-gray-900">
                            R{Math.round(l.pricePerHour * 0.5)}{" "}
                            <span className="text-xs text-gray-500 font-normal">/30 min</span>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 transition-all ${selected ? "text-accent translate-x-1" : "text-gray-300 group-hover:text-primary group-hover:translate-x-1"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                disabled={!canProceed.lawyer}
                onClick={() => setStep("datetime")}
                className="bg-gradient-to-r from-primary to-blue-700 text-white px-8 h-12 font-bold"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: date + time + type */}
        {step === "datetime" && selectedLawyer && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Schedule Your Meeting</h2>
              <p className="text-gray-600">
                With <span className="font-semibold text-primary">{selectedLawyer.name}</span>
              </p>
            </div>

            {/* Meeting type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Meeting Format
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {meetingTypes.map((m) => {
                  const active = selectedType === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedType(m.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                        active
                          ? "border-accent bg-gradient-to-br from-accent/10 to-yellow-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-3`}>
                        <m.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="font-bold text-gray-900 text-sm">{m.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-gray-900">Pick a Date</h3>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(d) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return d < today || d.getDay() === 0;
                  }}
                  className="rounded-md"
                />
              </div>

              {/* Time slots */}
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-gray-900">
                    Available Times{" "}
                    {selectedDate && (
                      <span className="text-sm font-normal text-gray-500">
                        ·{" "}
                        {selectedDate.toLocaleDateString("en-ZA", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </h3>
                </div>

                {slotsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                    <p>No availability for this date.</p>
                    <p className="text-sm">Try selecting another day.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-[360px] overflow-auto pr-1">
                    {slots.map((s) => {
                      const active = selectedTime === s.time;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedTime(s.time)}
                          className={`py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                            active
                              ? "bg-gradient-to-r from-accent to-yellow-400 text-black shadow-lg scale-105"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:scale-105"
                          }`}
                        >
                          {s.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" size="lg" onClick={() => setStep("lawyer")} className="h-12">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                size="lg"
                disabled={!canProceed.datetime}
                onClick={() => setStep("details")}
                className="bg-gradient-to-r from-primary to-blue-700 text-white px-8 h-12 font-bold"
              >
                Continue <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: details */}
        {step === "details" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Details</h2>
              <p className="text-gray-600">We'll use this to confirm your appointment.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-sm space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <Field icon={User} label="Full Name" value={client.name} onChange={(v) => setClient({ ...client, name: v })} placeholder="Jane Doe" />
                <Field icon={Phone} label="Phone" value={client.phone} onChange={(v) => setClient({ ...client, phone: v })} placeholder="+27 82 000 0000" />
              </div>
              <Field icon={Mail} label="Email" type="email" value={client.email} onChange={(v) => setClient({ ...client, email: v })} placeholder="jane@example.com" />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Briefly describe your legal matter</label>
                <Textarea
                  rows={4}
                  value={client.legalMatter}
                  onChange={(e) => setClient({ ...client, legalMatter: e.target.value })}
                  placeholder="Tell us a little about what you'd like to discuss..."
                  className="border-2 border-gray-200 focus:border-accent rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Urgency</label>
                <div className="grid grid-cols-3 gap-2">
                  {urgencyOptions.map((u) => {
                    const active = client.urgency === u.value;
                    return (
                      <button
                        key={u.value}
                        onClick={() => setClient({ ...client, urgency: u.value })}
                        className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                          active ? "border-primary bg-primary/10 text-primary scale-105 shadow-md" : `${u.color} hover:scale-105`
                        }`}
                      >
                        {u.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" size="lg" onClick={() => setStep("datetime")} className="h-12">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                size="lg"
                disabled={!canProceed.details}
                onClick={() => setStep("review")}
                className="bg-gradient-to-r from-primary to-blue-700 text-white px-8 h-12 font-bold"
              >
                Review <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: review */}
        {step === "review" && selectedLawyer && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Confirm</h2>
              <p className="text-gray-600">Please verify the details below.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg space-y-6">
              <SummaryRow label="Attorney" value={`${selectedLawyer.name} · ${selectedLawyer.title}`} />
              <SummaryRow label="Format" value={meetingTypes.find((m) => m.id === selectedType)?.label || ""} />
              <SummaryRow
                label="Date & Time"
                value={`${selectedDate?.toLocaleDateString("en-ZA", { weekday: "long", month: "long", day: "numeric" })} at ${selectedTime}`}
              />
              <SummaryRow label="Client" value={`${client.name} · ${client.email} · ${client.phone}`} />
              <SummaryRow label="Matter" value={client.legalMatter} multiline />
              <SummaryRow label="Urgency" value={urgencyOptions.find((u) => u.value === client.urgency)?.label || ""} />

              <div className="pt-4 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Total · 30 min consultation</div>
                  <div className="text-3xl font-bold text-gray-900">R{totalPrice}</div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-sm text-emerald-700 font-semibold">
                    <Shield className="h-4 w-4" /> No payment required now
                  </div>
                  <div className="text-xs text-gray-500">Billed after consultation</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="lg" onClick={() => setStep("details")} disabled={submitting} className="h-12">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                size="lg"
                disabled={submitting}
                onClick={handleSubmit}
                className="bg-gradient-to-r from-accent to-yellow-400 text-black px-8 h-12 font-bold shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Booking...
                  </>
                ) : (
                  <>
                    Confirm Booking <CheckCircle className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step: confirmed */}
        {step === "confirmed" && appointment && (
          <div className="max-w-2xl mx-auto text-center py-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-emerald-400/30 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-2xl">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-3">You're all booked!</h2>
            <p className="text-gray-600 text-lg mb-8">
              {appointment.id.startsWith("local_")
                ? "Your request has been captured. Please call us if you need urgent confirmation."
                : "We'll send a confirmation and the team has been notified."}{" "}
              <span className="font-semibold">{client.email}</span>
            </p>

            <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg text-left space-y-4 mb-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-semibold uppercase">Booking Reference</span>
                <Badge className="bg-accent text-black font-mono text-xs">{appointment.id}</Badge>
              </div>
              <SummaryRow label="Attorney" value={selectedLawyer?.name || ""} />
              <SummaryRow label="When" value={`${selectedDate?.toLocaleDateString("en-ZA", { weekday: "long", month: "long", day: "numeric" })} · ${selectedTime}`} />
              <SummaryRow label="Format" value={meetingTypes.find((m) => m.id === selectedType)?.label || ""} />
              <div className="pt-4 border-t border-gray-100">
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Awaiting confirmation</Badge>
                <p className="text-xs text-gray-500 mt-2">
                  {appointment.id.startsWith("local_")
                    ? "The booking API was unavailable, so this reference was created in your browser. Contact our office to confirm the slot."
                    : "Our team will contact you shortly to confirm. For video calls, you'll receive a secure room link before your session."}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setStep("lawyer");
                  setSelectedLawyer(null);
                  setSelectedTime("");
                  setAppointment(null);
                  setClient({ name: "", email: "", phone: "", legalMatter: "", urgency: "normal" });
                }}
                className="h-12"
              >
                Book Another
              </Button>
              <Button
                size="lg"
                onClick={() => (window.location.hash = "home")}
                className="bg-gradient-to-r from-primary to-blue-700 text-white h-12"
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: any;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 border-2 border-gray-200 focus:border-accent rounded-xl h-12"
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={multiline ? "block" : "flex items-start justify-between gap-4"}>
      <span className="text-sm text-gray-500 font-semibold uppercase tracking-wide flex-shrink-0">{label}</span>
      <span className={`text-gray-900 ${multiline ? "block mt-2 whitespace-pre-wrap" : "text-right font-semibold"}`}>{value}</span>
    </div>
  );
}
