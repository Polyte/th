import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Award, Users, Clock, MapPin, CheckCircle, Star } from "lucide-react";
import { AdvancedCard } from "./AdvancedCard";
import { ScrollReveal } from "./ScrollReveal";

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

export function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-x-1/2"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 mb-6">
                <Star className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">About Our Firm</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                Excellence in Legal 
                <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent"> Representation</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Established in the heart of Midrand, TH Attorneys has been the cornerstone of legal excellence 
                in the Gauteng community for over 15 years. Our firm is built on an unshakeable foundation 
                of trust, integrity, and unwavering commitment to our clients' success.
              </p>
              <p>
                We understand that navigating legal complexities can be daunting. That's why our seasoned team 
                of legal professionals takes a deeply personalized approach to each case, ensuring you receive 
                not just expert representation, but also the individual attention and care you deserve.
              </p>
              <p>
                Our strategic location in Midrand positions us perfectly to serve clients across Johannesburg, 
                Pretoria, and the greater Gauteng region with unparalleled efficiency and local expertise.
              </p>
            </div>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{achievement}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-12">
              {stats.map((stat, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <AdvancedCard variant="glow" className="text-center">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} p-3 mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </AdvancedCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1642911353098-42efaae7f6d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGZlbWFsZSUyMGxhd3llciUyMHByb2Zlc3Npb25hbCUyMG9mZmljZXxlbnwxfHx8fDE3NTgwMDgwNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional black female lawyer"
                className="relative w-full h-72 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1696861273647-92dfe8bb697c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMGxlZ2FsfGVufDF8fHx8MTc1NzYyOTA4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Business handshake"
                className="relative w-full h-72 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Client testimonial card */}
            <div className="bg-gradient-to-br from-primary to-blue-700 p-6 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-blue-100 mb-4 italic">
                  "TH Attorneys provided exceptional service during our complex corporate merger. 
                  Their expertise and dedication were invaluable."
                </p>
                <div className="text-sm">
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-blue-200">CEO, Tech Innovations Ltd</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}