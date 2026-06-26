import { Scale, Building, Users, FileText, ShieldCheck, Home, ArrowRight, CheckCircle, Star, Award, Clock, Target, Gavel, Heart, UserCheck } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { navigateToPage } from "../components/Router";
import { ScrollReveal } from "../components/ScrollReveal";
import { PageHeader } from "../components/PageHeader";
import { ProfessionalCard } from "../components/ProfessionalCard";
import { ProfessionalButton } from "../components/ProfessionalButton";

const services = [
  {
    icon: Building,
    title: "Corporate Law",
    description: "Comprehensive business legal services including formation, compliance, mergers & acquisitions, and corporate governance.",
    features: ["Business Formation", "Compliance Management", "Mergers & Acquisitions", "Corporate Governance", "Commercial Contracts"],
    gradient: "from-primary to-blue-700"
  },
  {
    icon: Users,
    title: "Employment Law", 
    description: "Expert guidance on workplace disputes, employment contracts, labor relations, and compliance matters.",
    features: ["Employment Contracts", "Workplace Disputes", "Labor Relations", "HR Compliance", "Disciplinary Procedures"],
    gradient: "from-accent to-yellow-500"
  },
  {
    icon: Home,
    title: "Property Law",
    description: "Complete property legal services including conveyancing, disputes, lease agreements, and real estate transactions.",
    features: ["Conveyancing", "Property Disputes", "Lease Agreements", "Real Estate Transactions", "Property Development"],
    gradient: "from-gray-800 to-gray-600"
  },
  {
    icon: FileText,
    title: "Contract Law",
    description: "Professional contract services covering drafting, review, negotiation, and comprehensive dispute resolution.",
    features: ["Contract Drafting", "Legal Review", "Negotiation Support", "Dispute Resolution", "Breach of Contract"],
    gradient: "from-primary to-blue-700"
  },
  {
    icon: ShieldCheck,
    title: "Litigation",
    description: "Skilled courtroom representation for civil litigation, commercial disputes, and all forms of legal proceedings.",
    features: ["Civil Litigation", "Commercial Disputes", "Court Representation", "Legal Proceedings", "Settlement Negotiations"],
    gradient: "from-accent to-yellow-500"
  },
  {
    icon: Scale,
    title: "Legal Compliance",
    description: "Comprehensive compliance services including regulatory assessment, risk management, and ongoing advisory support.",
    features: ["Regulatory Compliance", "Risk Assessment", "Legal Advisory", "Policy Development", "Compliance Training"],
    gradient: "from-gray-800 to-gray-600"
  },
  {
    icon: Gavel,
    title: "Criminal Law",
    description: "Expert criminal defense representation and legal counsel for all criminal matters with dedicated courtroom advocacy.",
    features: ["Criminal Defense", "Court Representation", "Bail Applications", "Appeals", "Legal Counsel"],
    gradient: "from-red-700 to-red-900"
  },
  {
    icon: UserCheck,
    title: "Civil Law",
    description: "Comprehensive civil litigation services including personal injury claims, debt recovery, and general dispute resolution.",
    features: ["Civil Litigation", "Personal Injury Claims", "Debt Recovery", "Dispute Resolution", "Settlement Negotiations"],
    gradient: "from-blue-600 to-indigo-700"
  },
  {
    icon: Heart,
    title: "Family Law",
    description: "Compassionate legal support for family matters including divorce, custody, protection orders, and domestic issues.",
    features: ["Divorce Proceedings", "Child Custody", "Protection Orders", "Child Maintenance", "Family Disputes", "Domestic Issues"],
    gradient: "from-pink-600 to-rose-700"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "CEO, Tech Innovations Ltd",
    content: "TH Attorneys provided exceptional service during our complex corporate merger. Their expertise and dedication were invaluable.",
    rating: 5
  },
  {
    name: "Michael Chen",
    title: "Property Developer",
    content: "Professional, thorough, and reliable. They handled our property acquisition seamlessly and kept us informed throughout.",
    rating: 5
  },
  {
    name: "Lisa Williams",
    title: "HR Director",
    content: "Their employment law expertise helped us navigate complex workplace issues. Highly recommend their services.",
    rating: 5
  }
];

export function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <PageHeader
        title="Comprehensive Legal Services"
        subtitle="Legal Excellence"
        description="Our experienced legal team provides expert services across multiple practice areas, ensuring comprehensive representation and optimal outcomes for every client."
        backgroundImage="https://images.unsplash.com/photo-1528747008803-f9f5cc8f1a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsZWdhbCUyMHNlcnZpY2VzfGVufDF8fHx8MTc1NzYzMDQ0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        icon={<Scale className="h-5 w-5" />}
      >
        <ProfessionalButton
          variant="accent"
          size="xl"
          onClick={() => navigateToPage("contact")}
          rightIcon={<ArrowRight className="h-5 w-5" />}
        >
          Schedule Free Consultation
        </ProfessionalButton>
      </PageHeader>

      {/* Services Grid */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 morphing-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 morphing-blob" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                Our Practice Areas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Specialized legal expertise across diverse practice areas to meet all your legal needs
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <ProfessionalCard variant="elevated" className="h-full group hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {service.description}
                    </p>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-primary" />
                        Key Services Include:
                      </h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-3 text-gray-600">
                            <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <ProfessionalButton
                      variant="primary"
                      onClick={() => navigateToPage("contact")}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                      className="w-full"
                    >
                      Get Expert Help with {service.title}
                    </ProfessionalButton>
                  </div>
                </ProfessionalCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 mb-6">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">Why Choose TH Attorneys</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                  Trusted Legal Excellence 
                  <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent"> Since 2009</span>
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Proven Success Record</h3>
                    <p className="text-gray-600">Over 15 years of successful legal representation with a 97% client satisfaction rate.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-xl mt-1">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Personalized Approach</h3>
                    <p className="text-gray-600">Every client receives individual attention with customized legal strategies tailored to their needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-800/10 p-3 rounded-xl mt-1">
                    <CheckCircle className="h-6 w-6 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Local Expertise</h3>
                    <p className="text-gray-600">Deep understanding of South African law and the unique legal landscape in Gauteng.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXd5ZXIlMjB0ZWFtJTIwb2ZmaWNlfGVufDF8fHx8MTc1NzYyOTk5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional legal team"
                className="w-full h-80 object-cover rounded-3xl shadow-2xl"
              />
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-4">
                <ProfessionalCard variant="default" className="text-center bg-gradient-to-br from-primary to-blue-700 text-white border-0">
                  <div className="text-3xl font-bold mb-1">500+</div>
                  <div className="text-sm text-blue-100">Clients Served</div>
                </ProfessionalCard>
                <ProfessionalCard variant="default" className="text-center bg-gradient-to-br from-accent to-yellow-500 text-black border-0">
                  <div className="text-3xl font-bold mb-1">97%</div>
                  <div className="text-sm">Success Rate</div>
                </ProfessionalCard>
                <ProfessionalCard variant="default" className="text-center bg-gradient-to-br from-gray-800 to-gray-600 text-white border-0">
                  <div className="text-3xl font-bold mb-1">15+</div>
                  <div className="text-sm text-gray-200">Years Experience</div>
                </ProfessionalCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it - hear from clients who have experienced our legal excellence
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <ProfessionalCard variant="elevated" className="h-full">
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                    <span className="ml-2 text-sm text-gray-500 font-medium">5.0</span>
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic leading-relaxed text-lg">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.title}</div>
                    </div>
                  </div>
                </ProfessionalCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Get Expert Legal Help?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Don't let legal challenges overwhelm you. Contact our experienced team today 
            for a comprehensive consultation and personalized legal strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <ProfessionalButton
              variant="accent"
              size="lg"
              onClick={() => navigateToPage("contact")}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Schedule Free Consultation
            </ProfessionalButton>
            <ProfessionalButton
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black"
              leftIcon={<Clock className="h-5 w-5" />}
            >
              Call Now: 011 123 4567
            </ProfessionalButton>
          </div>
        </div>
      </section>
    </main>
  );
}