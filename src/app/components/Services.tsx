import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Scale, Building, Users, FileText, ShieldCheck, Home, ArrowRight, Gavel, Heart, UserCheck } from "lucide-react";
import { AdvancedCard } from "./AdvancedCard";
import { ScrollReveal } from "./ScrollReveal";

const services = [
  {
    icon: Building,
    title: "Corporate Law",
    description: "Business formation, compliance, mergers & acquisitions, and corporate governance.",
    gradient: "from-primary to-blue-700"
  },
  {
    icon: Users,
    title: "Employment Law",
    description: "Workplace disputes, contracts, labor relations, and employment compliance.",
    gradient: "from-accent to-yellow-500"
  },
  {
    icon: Home,
    title: "Property Law",
    description: "Conveyancing, property disputes, lease agreements, and real estate transactions.",
    gradient: "from-gray-800 to-gray-600"
  },
  {
    icon: FileText,
    title: "Contract Law",
    description: "Contract drafting, review, negotiation, and dispute resolution.",
    gradient: "from-primary to-blue-700"
  },
  {
    icon: ShieldCheck,
    title: "Litigation",
    description: "Civil litigation, commercial disputes, and courtroom representation.",
    gradient: "from-accent to-yellow-500"
  },
  {
    icon: Scale,
    title: "Legal Compliance",
    description: "Regulatory compliance, risk assessment, and legal advisory services.",
    gradient: "from-gray-800 to-gray-600"
  },
  {
    icon: Gavel,
    title: "Criminal Law",
    description: "Expert criminal defense representation and legal counsel for all criminal matters.",
    gradient: "from-red-700 to-red-900"
  },
  {
    icon: UserCheck,
    title: "Civil Law",
    description: "Civil litigation, personal injury claims, debt recovery, and general civil dispute resolution.",
    gradient: "from-blue-600 to-indigo-700"
  },
  {
    icon: Heart,
    title: "Family Law",
    description: "Divorce proceedings, family disputes, protection orders, custody of children, domestic issues, and child maintenance.",
    gradient: "from-pink-600 to-rose-700"
  }
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <Scale className="h-4 w-4 mr-2" />
            <span className="text-sm font-semibold">Legal Excellence</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
            Our Legal <span className="bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We offer comprehensive legal services across multiple practice areas, 
            ensuring expert representation and innovative solutions for individuals and businesses.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <AdvancedCard
                variant="glass"
                className="h-full"
                icon={
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                }
                title={service.title}
              >
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center text-primary font-semibold group-hover:text-accent transition-colors cursor-pointer">
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </AdvancedCard>
            </ScrollReveal>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary via-blue-700 to-primary p-8 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Need Specialized Legal Assistance?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Our experienced team is ready to provide personalized legal solutions tailored to your specific needs.
              </p>
              <button className="bg-accent hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                Schedule Your Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}