import { HeroCarousel } from "../components/HeroCarousel";
import { Services } from "../components/Services";
import { About } from "../components/About";
import { ScrollReveal } from "../components/ScrollReveal";
import { ProfessionalCard } from "../components/ProfessionalCard";
import { ProfessionalButton } from "../components/ProfessionalButton";
import { navigateToPage } from "../components/Router";
import { ArrowRight, Scale, Award, Users, Shield, Video, Clock, MessageSquare, Phone, Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "TH Manyika Attorneys handled my corporate matter with exceptional professionalism. Their attention to detail saved my business millions.",
    name: "Lerato Mokoena",
    title: "CEO, Mokoena Holdings",
    rating: 5,
  },
  {
    quote: "Compassionate, clear, and decisive. They guided me through a difficult divorce with dignity and won me a fair settlement.",
    name: "Sandra Pillay",
    title: "Family Law Client",
    rating: 5,
  },
  {
    quote: "Best legal team in Midrand. The online consultations made everything seamless while I was working abroad.",
    name: "James Coetzee",
    title: "Property Investor",
    rating: 5,
  },
];

const highlights = [
  {
    icon: Scale,
    title: "Legal Excellence",
    description: "Over 15 years of proven track record in delivering exceptional legal services.",
    metric: "97% Success Rate"
  },
  {
    icon: Users,
    title: "Client-Focused",
    description: "Personalized attention and tailored legal strategies for every client.",
    metric: "500+ Clients"
  },
  {
    icon: Award,
    title: "Recognized Expertise",
    description: "Award-winning legal team with deep knowledge in multiple practice areas.",
    metric: "15+ Awards"
  },
  {
    icon: Shield,
    title: "Trusted Partner",
    description: "Your reliable legal partner for all business and personal legal matters.",
    metric: "24/7 Support"
  }
];

export function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />
      
      {/* Online Appointments Feature Section */}
      <section className="section-padding bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-6">
                  <Video className="h-4 w-4 mr-2" />
                  NEW: Online Consultations Available
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Meet Your Lawyer 
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Online</span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Get expert legal advice from the comfort of your home or office. Our secure video consultation platform 
                  makes it easy to connect with our experienced attorneys in real-time.
                </p>
                
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Video className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Video Calls</h4>
                    <p className="text-sm text-gray-600">Face-to-face consultation</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Phone Calls</h4>
                    <p className="text-sm text-gray-600">Voice-only consultation</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Live Chat</h4>
                    <p className="text-sm text-gray-600">Real-time messaging</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <ProfessionalButton
                    variant="primary"
                    size="lg"
                    onClick={() => navigateToPage("appointments")}
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Book Online Appointment
                  </ProfessionalButton>
                  
                  <ProfessionalButton
                    variant="outline"
                    size="lg"
                    onClick={() => navigateToPage("services")}
                  >
                    Learn More
                  </ProfessionalButton>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 relative overflow-hidden">
                  {/* Mock video call interface */}
                  <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-white text-xs font-medium">TH Manyika Attorneys • Secure Video Consultation</div>
                      <div className="flex items-center space-x-2 text-white text-xs">
                        <Clock className="h-3 w-3" />
                        <span>15:30</span>
                      </div>
                    </div>
                    
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                      <div className="text-center text-white">
                        <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Users className="h-10 w-10 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Sarah Thompson</h4>
                        <p className="text-gray-300 text-sm">Senior Partner • Corporate Law</p>
                        <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1 bg-green-600 px-2 py-1 rounded">
                            <Video className="h-3 w-3" />
                            <span>Connected</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Picture-in-picture client view */}
                      <div className="absolute bottom-4 right-4 w-24 h-18 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border-2 border-white/20">
                        <div className="text-center text-white">
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mx-auto">
                            <Users className="h-4 w-4 text-black" />
                          </div>
                          <p className="text-xs mt-1">You</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Control bar */}
                    <div className="bg-gray-900 px-4 py-3 flex items-center justify-center space-x-4">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <Video className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700 font-medium">Secure & Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Value Proposition Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose TH Manyika Attorneys?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We combine legal expertise with personalized service to deliver 
                exceptional results for our clients across all practice areas.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <ProfessionalCard variant="elevated" className="text-center h-full">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center mb-4">
                      <highlight.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{highlight.description}</p>
                    <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                      {highlight.metric}
                    </div>
                  </div>
                </ProfessionalCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <ScrollReveal>
        <Services />
      </ScrollReveal>

      {/* About Overview */}
      <ScrollReveal delay={200}>
        <About />
      </ScrollReveal>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
                <Quote className="h-4 w-4 mr-2" />
                Client Stories
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Real stories from clients we've helped navigate complex legal challenges with confidence.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <ProfessionalCard variant="elevated" className="h-full relative group hover:-translate-y-2 transition-transform duration-300">
                  <Quote className="absolute top-4 right-4 h-10 w-10 text-accent/10 group-hover:text-accent/30 transition-colors" />
                  <div className="flex items-center mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold mr-4">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.title}</div>
                    </div>
                  </div>
                </ProfessionalCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding bg-gradient-to-br from-primary via-blue-700 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Don't let legal challenges hold you back. Get expert guidance from our experienced team today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ProfessionalButton
                  variant="accent"
                  size="lg"
                  onClick={() => navigateToPage("appointments")}
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Book Online Appointment
                </ProfessionalButton>
                
                <ProfessionalButton
                  variant="outline"
                  size="lg"
                  onClick={() => navigateToPage("services")}
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  Explore Our Services
                </ProfessionalButton>
              </div>
              
              <div className="mt-8 text-sm text-blue-200">
                No obligation • Free consultation • Expert advice
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}