import { Scale, Phone, Mail, MapPin, ArrowUp, Linkedin, Twitter, Facebook } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-accent to-yellow-500 p-3 rounded-xl">
                <Scale className="h-8 w-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">TH Manyika Attorneys</h3>
                <p className="text-sm text-gray-400 font-medium">Midrand Legal Excellence</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              TH Manyika Attorneys has been providing expert legal services in Midrand and throughout Gauteng 
              for over 15 years. Your trusted legal partner committed to delivering exceptional results and professional excellence.
            </p>
            <div className="flex space-x-4">
              <div className="bg-white/10 p-2 rounded-lg hover:bg-accent/20 transition-colors cursor-pointer">
                <Linkedin className="h-5 w-5" />
              </div>
              <div className="bg-white/10 p-2 rounded-lg hover:bg-accent/20 transition-colors cursor-pointer">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="bg-white/10 p-2 rounded-lg hover:bg-accent/20 transition-colors cursor-pointer">
                <Facebook className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-accent">Legal Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Corporate Law</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Employment Law</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Property Law</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Contract Law</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Litigation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Legal Compliance</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-accent">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Home</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Services</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">About</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Contact</a></li>
              <li><a href="#appointments" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Online Appointments</a></li>
              <li><a href="#admin" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium text-xs opacity-70">Admin Dashboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-accent">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-accent/20 p-2 rounded-lg mt-1">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">22 Century Blvd Riversands</p>
                  <p className="text-gray-400 text-sm">Johannesburg, 1684</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">+27 78 213 1116</p>
                  <p className="text-gray-400 text-sm">Main office line</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 p-2 rounded-lg">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">admin@thmattorrneys.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © 2025 TH Manyika Attorneys. All rights reserved. | 
                <span className="ml-2 text-accent">Licensed to practice law in South Africa</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Professional Legal Services • Midrand • Gauteng
              </p>
            </div>
            
            <Button
              onClick={scrollToTop}
              className="bg-gradient-to-r from-accent to-yellow-500 text-black hover:from-yellow-500 hover:to-accent transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <ArrowUp className="h-4 w-4 mr-2 group-hover:-translate-y-1 transition-transform" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}