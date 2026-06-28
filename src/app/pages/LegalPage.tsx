import { ShieldCheck, FileText, Mail, Phone } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ProfessionalCard } from "../components/ProfessionalCard";
import { ProfessionalButton } from "../components/ProfessionalButton";

type LegalPageProps = {
  type: "privacy" | "terms";
};

const sections = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "Client Confidentiality",
    description:
      "How TH Manyika Attorneys handles personal information, legal enquiries, consultation requests, and client communications.",
    icon: <ShieldCheck className="h-5 w-5" />,
    items: [
      {
        title: "Information We Collect",
        body:
          "We collect information you submit through contact forms, appointment requests, email, phone calls, and consultation records. This can include your name, contact details, matter summary, preferred consultation format, and related documents you choose to share.",
      },
      {
        title: "How We Use Information",
        body:
          "We use your information to respond to enquiries, schedule consultations, assess legal needs, manage client relationships, meet professional duties, and keep appropriate administrative records.",
      },
      {
        title: "Confidentiality",
        body:
          "Legal enquiries are treated with professional confidentiality. Submitting a website form does not automatically create an attorney-client relationship, but we still handle your information carefully.",
      },
      {
        title: "Retention and Access",
        body:
          "We retain records only as long as needed for legal, professional, operational, and regulatory reasons. You may contact us to request access, correction, or deletion where applicable.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Website Terms",
    description:
      "The basic terms that apply when using this website, submitting enquiries, or booking consultations online.",
    icon: <FileText className="h-5 w-5" />,
    items: [
      {
        title: "Website Information",
        body:
          "Content on this website is for general information only and is not legal advice. Legal outcomes depend on the facts of each matter and the applicable law.",
      },
      {
        title: "Consultation Requests",
        body:
          "Online appointment requests are subject to attorney availability and office confirmation. Urgent matters should be confirmed by phone.",
      },
      {
        title: "No Attorney-Client Relationship",
        body:
          "Using this website, sending a form, or requesting a booking does not by itself create an attorney-client relationship. A formal engagement is confirmed separately.",
      },
      {
        title: "Acceptable Use",
        body:
          "You agree not to misuse forms, submit unlawful content, interfere with website operation, or rely on automated booking confirmations for emergency legal matters.",
      },
    ],
  },
};

export function LegalPage({ type }: LegalPageProps) {
  const page = sections[type];

  return (
    <main>
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        description={page.description}
        backgroundImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1080&q=80"
        icon={page.icon}
      />

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-5">
            {page.items.map((item) => (
              <ProfessionalCard key={item.title} variant="elevated">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h2>
                <p className="text-gray-600 leading-relaxed">{item.body}</p>
              </ProfessionalCard>
            ))}
          </div>

          <div className="mt-10 bg-gray-900 text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-3">Questions about these terms?</h2>
            <p className="text-gray-300 mb-6">
              Contact our office for clarification before submitting sensitive information or relying on a booking request.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <ProfessionalButton
                variant="accent"
                onClick={() => (window.location.href = "mailto:admin@thmanyika.co.za")}
                leftIcon={<Mail className="h-4 w-4" />}
              >
                Email the Office
              </ProfessionalButton>
              <ProfessionalButton
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
                onClick={() => (window.location.href = "tel:+27782131116")}
                leftIcon={<Phone className="h-4 w-4" />}
              >
                Call Us
              </ProfessionalButton>
              <ProfessionalButton variant="ghost" onClick={() => (window.location.hash = "contact")}>
                Contact Page
              </ProfessionalButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
