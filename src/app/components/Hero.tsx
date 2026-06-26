import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, Award, Users, Clock } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1588283643362-10f386c2b118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXclMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTc2MjkwODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Professional law office building"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30 backdrop-blur-sm">
                <Award className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">15+ Years of Excellence</span>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Expert Legal Services in{" "}
              <span className="bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">
                Midrand
              </span>
            </h1>
            
            <p className="text-xl text-gray-200 leading-relaxed max-w-xl">
              TH Attorneys delivers comprehensive legal solutions with unmatched expertise. 
              We're dedicated to protecting your interests and securing optimal outcomes for every client.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-accent to-yellow-500 text-black hover:from-yellow-500 hover:to-accent transition-all duration-300 shadow-xl hover:shadow-2xl font-bold group"
              >
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-2 border-white/30 hover:bg-white hover:text-black backdrop-blur-sm transition-all duration-300 font-semibold"
              >
                Explore Our Services
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-gray-300">500+ Clients Served</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-5 w-5 text-accent" />
                <span className="text-gray-300">24/7 Support</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Why Choose TH Attorneys?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-accent rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Proven Track Record</h4>
                      <p className="text-gray-300 text-sm">Over 15 years of successful legal representation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-accent rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Personalized Service</h4>
                      <p className="text-gray-300 text-sm">Tailored legal solutions for every client</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-accent rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Local Expertise</h4>
                      <p className="text-gray-300 text-sm">Deep knowledge of Gauteng legal landscape</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
    </section>
  );
}