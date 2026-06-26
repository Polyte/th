import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Router, type Page } from "./components/Router";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="min-h-screen">
      <Header currentPage={currentPage} />
      <Router currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Footer />
    </div>
  );
}