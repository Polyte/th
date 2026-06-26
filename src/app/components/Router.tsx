import { useState, useEffect } from "react";
import { HomePage } from "../pages/HomePage";
import { ServicesPage } from "../pages/ServicesPage";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { AppointmentBooking } from "./AppointmentBooking";
import { AdminDashboard } from "./AdminDashboard";

export type Page = "home" | "services" | "about" | "contact" | "appointments" | "admin";

interface RouterProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export function Router({ currentPage, setCurrentPage }: RouterProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as Page;
      if (["home", "services", "about", "contact", "appointments", "admin"].includes(hash)) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentPage(hash);
          setIsTransitioning(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 150);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    
    // Handle initial load
    const initialHash = window.location.hash.slice(1) as Page;
    if (["home", "services", "about", "contact", "appointments", "admin"].includes(initialHash)) {
      setCurrentPage(initialHash);
    } else {
      window.location.hash = "home";
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [setCurrentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "services":
        return <ServicesPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "appointments":
        return <AppointmentBooking />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {renderPage()}
    </div>
  );
}

export function navigateToPage(page: Page) {
  if (window.location.hash.slice(1) !== page) {
    window.location.hash = page;
  }
}