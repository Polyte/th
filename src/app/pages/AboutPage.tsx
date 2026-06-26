import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Award, Users, Clock, MapPin, CheckCircle, Star, Target, Heart, Shield, Lightbulb, ArrowRight } from "lucide-react";
import { navigateToPage } from "../components/Router";
import { ScrollReveal } from "../components/ScrollReveal";
import { PageHeader } from "../components/PageHeader";
import { ProfessionalCard } from "../components/ProfessionalCard";
import { ProfessionalButton } from "../components/ProfessionalButton";
import logoImage from 'figma:asset/3cf648ea1ae47f19a6441680163f4098f2a83a89.png';

const stats = [
  { icon: Award, number: "15+", label: "Years Experience", gradient: "from-accent to-yellow-500" },
  { icon: Users, number: "500+", label: "Clients Served", gradient: "from-primary to-blue-700" },
  { icon: Clock, number: "24/7", label: "Support Available", gradient: "from-gray-800 to-gray-600" },
  { icon: MapPin, number: "1", label: "Midrand Office", gradient: "from-accent to-yellow-500" }
];

const achievements = [
  "Recognized as Top Legal Firm in Midrand",
  "97% Client Satisfaction Rate", 
  "Award-Winning Legal Team",
  "Certified Legal Excellence"
];

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We uphold the highest ethical standards in all our legal practices and client interactions."
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for exceptional results and continuous improvement in our legal services."
  },
  {
    icon: Heart,
    title: "Client-Focused",
    description: "Our clients' success and satisfaction are at the heart of everything we do."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace modern legal solutions while respecting traditional legal principles."
  }
];

const team = [
  {
    name: "Thabo H. Manyika",
    title: "Senior Partner & Founder",
    specialization: "Corporate Law & Litigation",
    experience: "20+ Years",
    description: "Leading expert in corporate law with extensive experience in complex commercial litigation and business strategy."
  },
  {
    name: "Dr. Helen Richards",
    title: "Partner",
    specialization: "Employment & Property Law",
    experience: "15+ Years", 
    description: "Specialist in employment law and property transactions with a Ph.D. in Legal Studies and extensive courtroom experience."
  },
  {
    name: "Michael Nkomo",
    title: "Associate Attorney",
    specialization: "Contract Law & Compliance",
    experience: "8+ Years",
    description: "Expert in contract drafting and regulatory compliance across multiple industries with a focus on risk management."
  }
];

export function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <PageHeader
        title="Excellence in Legal Representation"
        subtitle="About TH Manyika Attorneys"
        description="For over 15 years, TH Manyika Attorneys has been the cornerstone of legal excellence in Midrand, providing comprehensive legal solutions with unwavering commitment to our clients' success."
        backgroundImage="https://images.unsplash.com/photo-1659277318898-9562d00c3b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsYXclMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTc2MzA0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        icon={<Star className="h-5 w-5" />}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <ProfessionalButton
            variant="accent"
            size="xl"
            onClick={() => navigateToPage("contact")}
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            Get to Know Us
          </ProfessionalButton>
          
          <div className="relative animate-float">
            <div className="absolute -inset-8 bg-gradient-to-r from-accent/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
            <img 
              src={logoImage} 
              alt="TH Manyika Attorneys Logo" 
              className="relative h-32 w-32 lg:h-48 lg:w-48 object-contain"
            />
          </div>
        </div>
      </PageHeader>

      {/* Our Story */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-x-1/2"></div>
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                  Our Story
                </h2>
                
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Established in 2009 in the heart of Midrand, TH Manyika Attorneys was founded with a simple yet powerful vision: 
                    to provide exceptional legal services that combine traditional legal excellence with modern, client-focused approaches.
                  </p>
                  <p>
                    Our founder, Thabo H. Manyika, recognized the need for a law firm that truly understood the unique challenges 
                    facing individuals and businesses in the rapidly evolving South African legal landscape. What started as 
                    a small practice has grown into one of Midrand's most trusted and respected legal firms.
                  </p>
                  <p>
                    Today, we continue to build on our reputation for integrity, innovation, and unwavering dedication to our clients' success. 
                    Our strategic location in Midrand allows us to serve clients across Johannesburg, Pretoria, and the greater Gauteng region 
                    with unparalleled efficiency and deep local expertise.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1642911353098-42efaae7f6d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGZlbWFsZSUyMGxhd3llciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTgwMTAwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="TH Manyika Attorneys professional black female lawyer"
                  className="relative w-full h-72 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <ProfessionalCard key={index} variant="elevated" className="text-center group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} p-3 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </ProfessionalCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-primary to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
                <Clock className="h-4 w-4 mr-2" />
                Our Journey
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Milestones That Define Us
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Over a decade of growth, recognition, and unwavering service to our community
              </p>
            </div>
          </ScrollReveal>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent md:-translate-x-0.5"></div>

            {[
              { year: "2009", title: "Founded in Midrand", desc: "Thabo H. Manyika opens the firm with a vision for client-first legal service." },
              { year: "2014", title: "Expanded Practice Areas", desc: "Added employment, property, and family law to our growing portfolio." },
              { year: "2018", title: "Recognized Excellence", desc: "Named among Midrand's top legal firms with 97% client satisfaction rating." },
              { year: "2022", title: "Digital Transformation", desc: "Launched secure online consultations and virtual courtroom representation." },
              { year: "2026", title: "Leading the Future", desc: "Serving 500+ clients with 9 comprehensive practice areas across Gauteng." },
            ].map((m, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className={`relative flex items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="hidden md:block w-1/2"></div>
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-accent rounded-full border-4 border-gray-900 md:-translate-x-1/2 z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  </div>
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                      <div className="text-accent font-bold text-2xl mb-2">{m.year}</div>
                      <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide every decision we make and every service we provide
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <ProfessionalCard variant="elevated" className="text-center h-full group hover:border-primary/20">
                  <div className="bg-gradient-to-br from-primary to-blue-700 w-16 h-16 rounded-2xl p-4 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                  <div className="mt-6">
                    <div className="w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </ProfessionalCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                Meet Our Legal Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experienced professionals dedicated to delivering exceptional legal representation
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <ProfessionalCard variant="elevated" className="h-full group">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary via-blue-600 to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-black" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold mb-3">{member.title}</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm">
                      {member.experience}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl group-hover:bg-primary/5 transition-colors duration-300">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                        <Target className="h-4 w-4 mr-2 text-primary" />
                        Specialization
                      </h4>
                      <p className="text-gray-600 text-sm">{member.specialization}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-accent/5 transition-colors duration-300">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Background
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{member.description}</p>
                    </div>
                  </div>
                </ProfessionalCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-24 bg-gradient-to-br from-primary via-blue-700 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Our Commitment to You
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              At TH Manyika Attorneys, we understand that legal matters can be complex and overwhelming. 
              That's why we're committed to providing clear communication, transparent processes, 
              and personalized attention to every client, regardless of case size or complexity.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bold mb-2">Confidentiality</h3>
                <p className="text-blue-200 text-sm">Your privacy and confidentiality are absolutely protected</p>
              </div>
              
              <div className="text-center">
                <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bold mb-2">Results-Driven</h3>
                <p className="text-blue-200 text-sm">We focus on achieving the best possible outcomes</p>
              </div>
              
              <div className="text-center">
                <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bold mb-2">Personal Care</h3>
                <p className="text-blue-200 text-sm">Every client receives individual attention and care</p>
              </div>
            </div>
            
            <div className="mt-12">
              <ProfessionalButton
                variant="accent"
                size="lg"
                onClick={() => navigateToPage("contact")}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Experience Our Commitment
              </ProfessionalButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}