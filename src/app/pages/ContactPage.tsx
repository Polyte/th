import { useState } from "react";
import { Contact } from "../components/Contact";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Calendar,
  ArrowRight,
  CheckCircle,
  Video,
  MessageSquare,
  ChevronDown,
  Scale,
  Briefcase,
  Heart,
  Building,
  FileText,
  Users,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { ScrollReveal } from "../components/ScrollReveal";
import { PageHeader } from "../components/PageHeader";
import { ProfessionalCard } from "../components/ProfessionalCard";
import { ProfessionalButton } from "../components/ProfessionalButton";
import { navigateToPage } from "../components/Router";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    desc: "Speak directly to our team",
    action: "+27 78 213 1116",
    href: "tel:+27782131116",
    accent: "from-blue-500 to-primary",
    badge: "Fastest",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp",
    desc: "Chat with us instantly",
    action: "Start Chat",
    href: "https://wa.me/27782131116",
    accent: "from-green-500 to-emerald-600",
    badge: "24/7",
  },
  {
    icon: Mail,
    title: "Email Us",
    desc: "Detailed inquiries welcome",
    action: "admin@thmanyika.co.za",
    href: "mailto:admin@thmanyika.co.za",
    accent: "from-purple-500 to-fuchsia-600",
    badge: "< 2 hrs",
  },
  {
    icon: Video,
    title: "Video Call",
    desc: "Secure online consultation",
    action: "Book Session",
    href: "#appointments",
    accent: "from-accent to-yellow-500",
    badge: "New",
  },
];

const directory = [
  { icon: Briefcase, name: "Corporate Law", contact: "Thabo H. Manyika", email: "corporate@thmanyika.co.za" },
  { icon: Heart, name: "Family Law", contact: "Dr. Helen Richards", email: "family@thmanyika.co.za" },
  { icon: Scale, name: "Criminal & Civil", contact: "Michael Nkomo", email: "litigation@thmanyika.co.za" },
  { icon: Building, name: "Property Law", contact: "Dr. Helen Richards", email: "property@thmanyika.co.za" },
  { icon: FileText, name: "Contracts", contact: "Michael Nkomo", email: "contracts@thmanyika.co.za" },
  { icon: Users, name: "Employment", contact: "Dr. Helen Richards", email: "employment@thmanyika.co.za" },
];

const socialLinks = [
  {
    icon: Linkedin,
    name: "LinkedIn",
    handle: "TH Manyika Attorneys",
    href: "https://www.linkedin.com/search/results/companies/?keywords=TH%20Manyika%20Attorneys",
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: Facebook,
    name: "Facebook",
    handle: "TH Manyika Attorneys",
    href: "https://www.facebook.com/search/top?q=TH%20Manyika%20Attorneys",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Twitter,
    name: "Twitter",
    handle: "TH Manyika Attorneys",
    href: "https://twitter.com/search?q=TH%20Manyika%20Attorneys",
    color: "from-sky-500 to-sky-600",
  },
  {
    icon: Instagram,
    name: "Instagram",
    handle: "TH Manyika Attorneys",
    href: "https://www.instagram.com/explore/search/keyword/?q=TH%20Manyika%20Attorneys",
    color: "from-pink-500 via-purple-500 to-orange-400",
  },
];

const faqs = [
  {
    q: "How much does a consultation cost?",
    a: "We offer a free initial consultation for new clients to discuss your legal needs and determine how we can best assist you. During this meeting, we'll provide a clear overview of our services and potential costs.",
    highlight: "No obligation consultation",
  },
  {
    q: "How quickly can I schedule a meeting?",
    a: "We typically schedule consultations within 24-48 hours. For urgent legal matters, we offer same-day appointments when possible. Emergency consultations are available outside regular business hours.",
    highlight: "Emergency appointments available",
  },
  {
    q: "What should I bring to my consultation?",
    a: "Please bring any relevant documents related to your legal matter, including contracts, correspondence, court papers, or identification documents. A list of questions you'd like to discuss is also helpful.",
    highlight: "Document checklist provided",
  },
  {
    q: "Do you offer virtual consultations?",
    a: "Yes, we provide secure video consultations for clients who cannot visit our office in person. Virtual meetings are conducted through encrypted platforms to ensure confidentiality and privacy.",
    highlight: "Secure & encrypted platform",
  },
  {
    q: "What areas of law do you practice?",
    a: "We cover 9 comprehensive practice areas including Corporate, Family, Criminal, Civil, Employment, Property, Contract, Compliance, and Litigation. Our team is equipped to handle most legal matters.",
    highlight: "9 practice areas",
  },
  {
    q: "Do you take on cases outside Gauteng?",
    a: "Yes. While our office is in Midrand, we represent clients across South Africa and offer remote consultations for clients further afield.",
    highlight: "Nationwide representation",
  },
];

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");

  function subscribeToNewsletter(e: React.FormEvent) {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setNewsletterStatus("Enter a valid email address.");
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem("newsletter_subscribers") || "[]");
      localStorage.setItem("newsletter_subscribers", JSON.stringify([{ email, createdAt: new Date().toISOString() }, ...stored]));
      setNewsletterEmail("");
      setNewsletterStatus("Thanks. You're subscribed.");
    } catch {
      setNewsletterStatus("Thanks. We'll add you to the list.");
    }
  }

  return (
    <main>
      {/* Hero Section */}
      <PageHeader
        title="Let's Discuss Your Legal Needs"
        subtitle="Contact Us"
        description="Ready to get expert legal assistance? Our experienced team is here to provide comprehensive consultation and personalized legal solutions for your unique situation."
        backgroundImage="https://images.unsplash.com/photo-1596574027151-2ce81d85af3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGNvbnN1bHRhdGlvbiUyMG9mZmljZSUyMG1lZXRpbmd8ZW58MXx8fHwxNzU3NjMwNDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        icon={<MessageCircle className="h-5 w-5" />}
      >
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <ProfessionalCard variant="ghost" className="text-center text-white bg-white/10 backdrop-blur-lg border border-white/20">
            <div className="animate-float">
              <Phone className="h-12 w-12 text-accent mx-auto mb-4" />
            </div>
            <h3 className="font-bold mb-2 text-lg">Call Us</h3>
            <p className="text-blue-200 text-lg font-medium">+27 78 213 1116</p>
          </ProfessionalCard>
          
          <ProfessionalCard variant="ghost" className="text-center text-white bg-white/10 backdrop-blur-lg border border-white/20">
            <div className="animate-float" style={{animationDelay: '0.5s'}}>
              <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
            </div>
            <h3 className="font-bold mb-2 text-lg">Email Us</h3>
            <p className="text-blue-200 text-lg font-medium">admin@thmanyika.co.za</p>
          </ProfessionalCard>
          
          <ProfessionalCard variant="ghost" className="text-center text-white bg-white/10 backdrop-blur-lg border border-white/20">
            <div className="animate-float" style={{animationDelay: '1s'}}>
              <Calendar className="h-12 w-12 text-accent mx-auto mb-4" />
            </div>
            <h3 className="font-bold mb-2 text-lg">Schedule</h3>
            <p className="text-blue-200 text-lg font-medium">Free Consultation</p>
          </ProfessionalCard>
        </div>
      </PageHeader>

      {/* Response Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-primary via-blue-700 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Clock, value: "< 2 hrs", label: "Response Time" },
              { icon: CheckCircle, value: "100%", label: "Reply Guarantee" },
              { icon: Calendar, value: "24/7", label: "Online Booking" },
              { icon: MessageCircle, value: "Free", label: "First Consultation" },
            ].map((s, i) => (
              <div key={i} className="group">
                <div className="bg-accent/20 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-accent/30 transition-all duration-300">
                  <s.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="text-3xl font-bold mb-1">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <MessageCircle className="h-4 w-4 mr-2" />
                Choose Your Method
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900">
                How Would You Like to Connect?
              </h2>
              <p className="text-lg text-gray-600">
                Pick the channel that works best for you — we'll respond on every one.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactMethods.map((m, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <a
                  href={m.href}
                  target={m.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="block group relative h-full"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-br ${m.accent} rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500`}></div>
                  <div className="relative h-full bg-white rounded-2xl p-6 border border-gray-200 group-hover:border-transparent group-hover:-translate-y-2 shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${m.accent} text-white shadow-md`}>
                      {m.badge}
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.accent} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <m.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{m.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{m.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-900 truncate">{m.action}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <Contact />
      
      {/* Map and Location Info */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Visit Our Office</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our modern office in Riversands is conveniently located with easy access from 
                Johannesburg and surrounding areas. We've designed our space to provide a comfortable 
                and professional environment for all client consultations.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Office Address</h3>
                    <p className="text-gray-600">22 Century Blvd Riversands</p>
                    <p className="text-gray-600">Johannesburg, 1684</p>
                    <p className="text-gray-600">South Africa</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-gray-600">Sunday: By Appointment Only</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-800/10 p-3 rounded-xl">
                    <Phone className="h-6 w-6 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Emergency Contact</h3>
                    <p className="text-gray-600">24/7 Emergency Hotline</p>
                    <p className="text-gray-600">082 999 8888</p>
                    <p className="text-sm text-gray-500">Additional charges may apply</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Getting Here</h2>
              
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-6 group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <iframe
                  title="TH Manyika Attorneys Office Location"
                  src="https://www.google.com/maps?q=22+Century+Blvd,+Riversands,+Midrand,+1684,+South+Africa&output=embed"
                  className="relative w-full h-full border-0 rounded-2xl"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">From Johannesburg</h4>
                  <p className="text-gray-600 text-sm">Take the N1 North, exit at Allandale Road (Exit 175), 
                  and follow signs to Riversands.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">From Pretoria</h4>
                  <p className="text-gray-600 text-sm">Take the N1 South towards Johannesburg, exit at Allandale Road (Exit 175), 
                  and follow signs to Riversands.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Parking</h4>
                  <p className="text-gray-600 text-sm">Free secure parking available on-site. 
                  Disabled parking spaces are available close to the main entrance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Area Directory */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
                <Scale className="h-4 w-4 mr-2" />
                Direct Lines
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                Reach the Right Department
              </h2>
              <p className="text-lg text-gray-600">
                Skip the queue. Contact the team that handles your matter directly.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {directory.map((d, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <a
                  href={`mailto:${d.email}`}
                  className="group block bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-accent rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <d.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{d.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{d.contact}</p>
                      <p className="text-sm text-accent font-medium truncate flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{d.email}</span>
                      </p>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl morphing-blob"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl morphing-blob" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <MessageCircle className="h-4 w-4 mr-2" />
                FAQ
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Quick answers to questions we hear most often. Still stuck? Reach out anytime.
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <ScrollReveal key={i} delay={i * 50}>
                  <div
                    className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      open ? "border-accent shadow-xl" : "border-gray-200 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      aria-expanded={open}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                            open ? "bg-accent text-black" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <h3 className={`font-bold transition-colors ${open ? "text-primary" : "text-gray-900"}`}>
                          {f.q}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                          open ? "rotate-180 text-accent" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 pl-[68px]">
                          <p className="text-gray-600 leading-relaxed mb-3">{f.a}</p>
                          <span className="inline-flex items-center text-sm text-accent font-semibold">
                            <CheckCircle className="h-4 w-4 mr-1.5" />
                            {f.highlight}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter + Social CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-primary to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
                <Mail className="h-4 w-4 mr-2" />
                Stay Informed
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Legal insights, straight to your inbox
              </h2>
              <p className="text-blue-100 leading-relaxed mb-6">
                Get monthly updates on legal developments in South Africa, plus exclusive guidance from our attorneys.
              </p>
              <form
                onSubmit={subscribeToNewsletter}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:border-accent focus:bg-white/15 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-yellow-400 text-black font-bold hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              <p className="text-xs text-blue-200 mt-3">
                {newsletterStatus || "No spam. Unsubscribe anytime. Read our privacy policy."}
              </p>
            </div>

            <div className="lg:pl-12 lg:border-l border-white/10">
              <h3 className="text-xl font-bold mb-2">Follow Our Journey</h3>
              <p className="text-blue-100 mb-6 text-sm">
                Connect with us on social media for daily legal tips and firm updates.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/40 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">{s.name}</div>
                      <div className="text-xs text-blue-200 truncate">{s.handle}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <ProfessionalButton
                  variant="accent"
                  size="lg"
                  onClick={() => navigateToPage("appointments")}
                  rightIcon={<Calendar className="h-5 w-5" />}
                  className="w-full"
                >
                  Book a Consultation
                </ProfessionalButton>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
