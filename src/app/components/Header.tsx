import { Phone, Mail, Menu, X, MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { navigateToPage, type Page } from "./Router";
import logoImage from 'figma:asset/3cf648ea1ae47f19a6441680163f4098f2a83a89.png';

interface HeaderProps {
  currentPage: Page;
}

export function Header({ currentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (page: Page) => {
    navigateToPage(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-2.5 hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 group cursor-pointer hover:text-accent transition-all duration-300">
                <Phone className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">+27 78 213 1116</span>
              </div>
              <div className="flex items-center space-x-2 group cursor-pointer hover:text-accent transition-all duration-300">
                <Mail className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">admin@thmattorrneys.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-3.5 w-3.5" />
                <span>Shop No. 13, Halfway Gardens, New Rd, Midrand, 1685</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
      </div>

      {/* Main Header */}
      <header className={`bg-white/95 backdrop-blur-2xl border-b sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'shadow-2xl border-gray-200/80 py-0'
          : 'shadow-lg border-gray-100/50 py-0'
      } relative overflow-hidden group`}>
        {/* Enhanced background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/80 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/20 rounded-full blur-sm animate-float"></div>
          <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full blur-sm animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-accent/30 rounded-full blur-sm animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}>
            <div
              className="flex items-center space-x-4 cursor-pointer group/logo"
              onClick={() => handleNavigation("home")}
            >
              <div className="relative">
                <img
                  src={logoImage}
                  alt="TH Manyika Attorneys Logo"
                  className={`object-contain transition-all duration-500 ${
                    isScrolled ? 'h-14 w-14' : 'h-16 w-16'
                  }`}
                />
              </div>
              <div className="relative">
                <h1 className={`font-bold text-gray-900 transition-all duration-300 ${
                  isScrolled ? 'text-xl' : 'text-2xl'
                }`}>
                  TH Manyika Attorneys
                </h1>
                <div className={`text-xs font-medium text-gray-600 transition-all duration-300 ${
                  isScrolled ? 'opacity-0 h-0' : 'opacity-100'
                }`}>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                    <span>Your Trusted Legal Partner</span>
                  </span>
                </div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => handleNavigation("home")}
                className={`px-4 py-2 font-semibold text-sm relative group/nav transition-all duration-300 rounded-lg ${
                  currentPage === "home"
                    ? "text-primary bg-primary/5"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <span className="relative z-10">Home</span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-300 ${
                  currentPage === "home" ? "w-1/2" : "w-0 group-hover/nav:w-3/4"
                }`}></span>
              </button>
              <button
                onClick={() => handleNavigation("services")}
                className={`px-4 py-2 font-semibold text-sm relative group/nav transition-all duration-300 rounded-lg ${
                  currentPage === "services"
                    ? "text-primary bg-primary/5"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <span className="relative z-10">Services</span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-300 ${
                  currentPage === "services" ? "w-1/2" : "w-0 group-hover/nav:w-3/4"
                }`}></span>
              </button>
              <button
                onClick={() => handleNavigation("about")}
                className={`px-4 py-2 font-semibold text-sm relative group/nav transition-all duration-300 rounded-lg ${
                  currentPage === "about"
                    ? "text-primary bg-primary/5"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <span className="relative z-10">About</span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-300 ${
                  currentPage === "about" ? "w-1/2" : "w-0 group-hover/nav:w-3/4"
                }`}></span>
              </button>
              <button
                onClick={() => handleNavigation("contact")}
                className={`px-4 py-2 font-semibold text-sm relative group/nav transition-all duration-300 rounded-lg ${
                  currentPage === "contact"
                    ? "text-primary bg-primary/5"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <span className="relative z-10">Contact</span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-300 ${
                  currentPage === "contact" ? "w-1/2" : "w-0 group-hover/nav:w-3/4"
                }`}></span>
              </button>
              <button
                onClick={() => handleNavigation("appointments")}
                className={`px-4 py-2 font-semibold text-sm relative group/nav transition-all duration-300 rounded-lg flex items-center space-x-1.5 ${
                  currentPage === "appointments"
                    ? "text-primary bg-primary/5"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span className="relative z-10">Appointments</span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-300 ${
                  currentPage === "appointments" ? "w-1/2" : "w-0 group-hover/nav:w-3/4"
                }`}></span>
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation("appointments")}
                className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-accent via-yellow-400 to-accent hover:from-yellow-400 hover:via-accent hover:to-yellow-400 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group/cta"
              >
                <Calendar className="h-4 w-4 group-hover/cta:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Book Consultation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700"></div>
              </button>

              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white/98 backdrop-blur-xl animate-slide-up">
              <nav className="flex flex-col py-4 space-y-1">
                <button
                  onClick={() => handleNavigation("home")}
                  className={`px-4 py-3 font-semibold text-left transition-all duration-200 rounded-lg mx-2 ${
                    currentPage === "home"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation("services")}
                  className={`px-4 py-3 font-semibold text-left transition-all duration-200 rounded-lg mx-2 ${
                    currentPage === "services"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => handleNavigation("about")}
                  className={`px-4 py-3 font-semibold text-left transition-all duration-200 rounded-lg mx-2 ${
                    currentPage === "about"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => handleNavigation("contact")}
                  className={`px-4 py-3 font-semibold text-left transition-all duration-200 rounded-lg mx-2 ${
                    currentPage === "contact"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  Contact
                </button>
                <button
                  onClick={() => handleNavigation("appointments")}
                  className={`px-4 py-3 font-semibold text-left transition-all duration-200 rounded-lg mx-2 flex items-center space-x-2 ${
                    currentPage === "appointments"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment</span>
                </button>

                <div className="mt-4 pt-4 border-t border-gray-100 mx-2">
                  <div className="space-y-3 bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Call Us</div>
                        <div className="font-semibold text-gray-900">+27 78 213 1116</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-accent/10 p-2 rounded-lg">
                        <Mail className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Email Us</div>
                        <div className="font-semibold text-gray-900 text-sm">admin@thmattorrneys.com</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-gray-800/10 p-2 rounded-lg mt-0.5">
                        <MapPin className="h-4 w-4 text-gray-800" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Visit Us</div>
                        <div className="font-medium text-gray-900 text-sm">Shop No. 13, Halfway Gardens, Midrand</div>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
