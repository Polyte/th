import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2 } from "lucide-react";
import { db } from "../services/database";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    details: ["22 Century Blvd Riversands", "Johannesburg", "South Africa 1684"],
    gradient: "from-primary to-blue-700"
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+27 78 213 1116", "Main office line"],
    gradient: "from-accent to-yellow-500"
  },
  {
    icon: Mail,
    title: "Email",
    details: ["admin@thmattorrneys.com", "Main email address"],
    gradient: "from-gray-800 to-gray-600"
  },
  {
    icon: Clock,
    title: "Hours",
    details: ["Mon - Fri: 8:00 AM - 5:00 PM", "Sat: 9:00 AM - 1:00 PM", "Sun: By Appointment"],
    gradient: "from-primary to-blue-700"
  }
];

export function Contact() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const upd = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.message) {
      setErr("Please provide your email and message.");
      return;
    }
    setBusy(true);
    try {
      await db.createEnquiry(form);
      setSent(true);
      setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
    } catch (e: any) {
      setErr(e?.message || "Could not send. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 mb-6">
            <MessageCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-semibold">Get In Touch</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
            Contact <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">Our Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to discuss your legal needs? Connect with our experienced legal professionals 
            for a comprehensive consultation. We're here to guide you through every legal challenge.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Send className="h-6 w-6 mr-3 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent</h3>
                    <p className="text-gray-600 mb-6">Thank you — our team will respond within 2 business hours.</p>
                    <Button onClick={() => setSent(false)} variant="outline">Send Another</Button>
                  </div>
                ) : (
                <form onSubmit={submit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-3 text-gray-700 font-semibold">First Name</label>
                    <Input id="firstName" value={form.firstName} onChange={upd("firstName")} placeholder="Your first name" className="border-2 border-gray-200 focus:border-accent focus:ring-accent/20 transition-all duration-300 bg-white/80" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-3 text-gray-700 font-semibold">Last Name</label>
                    <Input id="lastName" value={form.lastName} onChange={upd("lastName")} placeholder="Your last name" className="border-2 border-gray-200 focus:border-accent focus:ring-accent/20 transition-all duration-300 bg-white/80" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block mb-3 text-gray-700 font-semibold">Email *</label>
                  <Input id="email" type="email" required value={form.email} onChange={upd("email")} placeholder="your.email@example.com" className="border-2 border-gray-200 focus:border-accent focus:ring-accent/20 transition-all duration-300 bg-white/80" />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-3 text-gray-700 font-semibold">Phone</label>
                  <Input id="phone" value={form.phone} onChange={upd("phone")} placeholder="Your phone number" className="border-2 border-gray-200 focus:border-accent focus:ring-accent/20 transition-all duration-300 bg-white/80" />
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-3 text-gray-700 font-semibold">Subject</label>
                  <Input id="subject" value={form.subject} onChange={upd("subject")} placeholder="What can we help you with?" className="border-2 border-gray-200 focus:border-accent focus:ring-accent/20 transition-all duration-300 bg-white/80" />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-3 text-gray-700 font-semibold">Message *</label>
                  <Textarea id="message" required value={form.message} onChange={upd("message")} placeholder="Please describe your legal matter or question in detail..." rows={6} className="border-2 border-gray-200 focus:border-accent focus:ring-accent/20 transition-all duration-300 bg-white/80 resize-none" />
                </div>
                {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">{err}</div>}
                <Button type="submit" disabled={busy} className="w-full bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white font-bold py-4 transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  {busy ? "Sending…" : "Send Message"}
                </Button>
                </form>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 from-primary to-accent"></div>
                <CardContent className="pt-8 pb-6 relative z-10">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.gradient} p-3 group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 mb-1 leading-relaxed">{detail}</p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="bg-gradient-to-br from-accent via-yellow-400 to-accent text-black relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
              <CardContent className="pt-8 pb-6 relative z-10">
                <div className="flex items-start space-x-4">
                  <div className="bg-black/10 p-3 rounded-xl">
                    <Phone className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-3 text-lg">Emergency Legal Assistance</h3>
                    <p className="text-black/80 mb-4 leading-relaxed">
                      For urgent legal matters outside business hours, our emergency hotline 
                      is available 24/7. Professional consultation rates apply.
                    </p>
                    <Button 
                      className="bg-black text-accent hover:bg-gray-800 font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Emergency: 082 999 8888
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Additional CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 p-12 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Don't let legal challenges overwhelm you. Our expert team is standing by to provide 
                the guidance and representation you need to achieve the best possible outcome.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-accent to-yellow-500 text-black hover:from-yellow-500 hover:to-accent font-bold py-3 px-8 transition-all duration-300 hover:scale-105">
                  Schedule Free Consultation
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-black font-semibold py-3 px-8 transition-all duration-300"
                >
                  Call Now: +27 78 213 1116
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}