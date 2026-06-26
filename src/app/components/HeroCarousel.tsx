import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ArrowRight,
  Award,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Scale,
  Shield,
  Star,
} from "lucide-react";
import { navigateToPage } from "./Router";

const slides = [
  {
    id: 1,
    type: "video",
    videoUrl: "https://www.youtube.com/embed/VfojV7Urg3U",
    image:
      "https://images.unsplash.com/photo-1588283643362-10f386c2b118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXclMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTc2MjkwODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "Featured",
    title: "Watch Our",
    highlight: "Legal Expertise",
    subtitle: "Discover how TH Manyika Attorneys transforms legal challenges into success stories",
    description:
      "Experience our professional approach to legal services. Watch how our dedicated team delivers exceptional results for our clients across all practice areas.",
    primaryAction: "Book Appointment Now",
    secondaryAction: "Watch Full Video",
  },
  {
    id: 2,
    type: "video",
    videoUrl: "https://www.youtube.com/embed/Asylmg8PPCg",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMG9mZmljZSUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3NTc2MzAwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "Consultation",
    title: "Professional Legal",
    highlight: "Consultation",
    subtitle: "Experience our commitment to excellence in legal representation",
    description:
      "See firsthand how TH Manyika Attorneys provides personalized legal solutions. Our experienced team is dedicated to achieving the best possible outcomes for every client.",
    primaryAction: "Book Your Consultation",
    secondaryAction: "Watch Full Video",
  },
  {
    id: 3,
    type: "image",
    image:
      "https://images.unsplash.com/photo-1588283643362-10f386c2b118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXclMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTc2MjkwODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "Our Firm",
    title: "Expert Legal Services in",
    highlight: "Midrand",
    subtitle: "Comprehensive legal solutions with over 15 years of experience",
    description:
      "TH Manyika Attorneys delivers unmatched expertise across all legal domains. We're dedicated to protecting your interests and securing optimal outcomes for every client.",
    primaryAction: "Book Appointment Now",
    secondaryAction: "Explore Our Services",
  },
  {
    id: 4,
    type: "image",
    image:
      "https://images.unsplash.com/photo-1619806677949-cbae91e82cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3VydGhvdXNlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc1NzU4ODM0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "Corporate",
    title: "Corporate Legal",
    highlight: "Excellence",
    subtitle: "Strategic business solutions for modern enterprises",
    description:
      "Navigate complex corporate challenges with confidence. Our specialized team provides comprehensive business law services, from formation to mergers and acquisitions.",
    primaryAction: "Learn About Corporate Law",
    secondaryAction: "Contact Our Team",
  },
  {
    id: 5,
    type: "image",
    image:
      "https://images.unsplash.com/photo-1596574027151-2ce81d85af3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGNvbnN1bHRhdGlvbiUyMG1lZXRpbmd8ZW58MXx8fHwxNzU3NjI5OTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "Personal",
    title: "Personalized Legal",
    highlight: "Consultation",
    subtitle: "Your success is our priority",
    description:
      "Experience personalized legal guidance tailored to your unique situation. Our client-focused approach ensures you receive the individual attention you deserve.",
    primaryAction: "Book Consultation Now",
    secondaryAction: "View Success Stories",
  },
];

const SLIDE_DURATION = 8000;

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState<{ [key: number]: boolean }>({});
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);

  const playing = isAutoPlaying && !isHovered;

  // Per-slide progress + auto-advance
  useEffect(() => {
    setProgress(0);
    progressRef.current = 0;
    if (!playing) return;

    const step = 50;
    const interval = setInterval(() => {
      progressRef.current += (step / SLIDE_DURATION) * 100;
      if (progressRef.current >= 100) {
        setCurrentSlide((p) => (p + 1) % slides.length);
      } else {
        setProgress(progressRef.current);
      }
    }, step);

    return () => clearInterval(interval);
  }, [playing, currentSlide]);

  useEffect(() => {
    const slide = slides[currentSlide];
    if (slide.type === "video") {
      const timer = setTimeout(() => {
        setShowVideo((prev) => ({ ...prev, [currentSlide]: true }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      else if (e.key === "ArrowRight") nextSlide();
      else if (e.key === " ") {
        e.preventDefault();
        setIsAutoPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);
  const handleVideoPlay = (slideIndex: number) => {
    setShowVideo((prev) => ({ ...prev, [slideIndex]: true }));
    setIsAutoPlaying(false);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
    >
      {/* Background layers with Ken Burns */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            index === currentSlide ? "opacity-100 z-[1]" : "opacity-0 z-0"
          }`}
        >
          {slide.type === "video" && index === currentSlide && showVideo[index] ? (
            <div className="w-full h-full relative">
              <iframe
                src={`${slide.videoUrl}?autoplay=1&mute=1&controls=0&rel=0&enablejsapi=1&modestbranding=1&showinfo=0&loop=1&playlist=${slide.videoUrl.split("/embed/")[1]}`}
                className="w-full h-full object-cover scale-110"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="TH Manyika Attorneys Video"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-primary/40 pointer-events-none"></div>
            </div>
          ) : (
            <>
              <div
                className={`absolute inset-0 ${
                  index === currentSlide ? "animate-kenburns" : ""
                }`}
              >
                <ImageWithFallback
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-primary/50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

              {/* Subtle pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />

              {slide.type === "video" && index === currentSlide && !showVideo[index] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => handleVideoPlay(index)}
                    className="group relative bg-white/15 hover:bg-white/25 border border-white/30 rounded-full p-7 backdrop-blur-md transition-all duration-300 hover:scale-110"
                    aria-label="Play video"
                  >
                    <Play className="h-12 w-12 text-white ml-1 group-hover:scale-110 transition-transform" />
                    <div className="absolute -inset-4 border border-white/20 rounded-full animate-pulse"></div>
                    <div className="absolute -inset-8 border-2 border-accent/40 rounded-full animate-spin-slow"></div>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {/* Side nav arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-accent hover:text-black backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-2xl transition-all duration-300 group hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:text-black group-hover:-translate-x-0.5 transition-all" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-accent hover:text-black backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-2xl transition-all duration-300 group hover:scale-110"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:text-black group-hover:translate-x-0.5 transition-all" />
      </button>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-20 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div key={currentSlide} className="lg:col-span-7 text-white space-y-7 animate-hero-in">
            {/* Slide counter + tag */}
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/40 backdrop-blur-sm">
                <Award className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold tracking-wide">
                  {currentSlideData.tag} · 15+ Years
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-white/60 text-sm font-mono">
                <span className="text-accent font-bold">
                  {String(currentSlide + 1).padStart(2, "0")}
                </span>
                <span>/</span>
                <span>{String(slides.length).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              <span className="block text-white/95">{currentSlideData.title}</span>
              <span className="block mt-2 bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                {currentSlideData.highlight}
              </span>
            </h1>

            {/* Accent rule */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-16 bg-gradient-to-r from-accent to-transparent rounded-full"></div>
              <p className="text-accent font-semibold text-sm uppercase tracking-widest">
                TH Manyika Attorneys
              </p>
            </div>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl">
              {currentSlideData.description}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => navigateToPage("appointments")}
                className="relative bg-gradient-to-r from-accent via-yellow-400 to-accent text-black hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all duration-500 font-bold group overflow-hidden px-8 h-14"
              >
                <span className="relative z-10 flex items-center">
                  {currentSlideData.primaryAction}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  if (
                    currentSlideData.type === "video" &&
                    currentSlideData.secondaryAction === "Watch Full Video"
                  ) {
                    handleVideoPlay(currentSlide);
                  } else {
                    navigateToPage("services");
                  }
                }}
                className="text-white border-2 border-white/40 hover:bg-white hover:text-primary backdrop-blur-md transition-all duration-300 font-semibold group h-14 px-8"
              >
                <span className="flex items-center">
                  {currentSlideData.type === "video" &&
                  currentSlideData.secondaryAction === "Watch Full Video" ? (
                    <Play className="mr-2 h-5 w-5 group-hover:scale-125 transition-transform" />
                  ) : null}
                  {currentSlideData.secondaryAction}
                </span>
              </Button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                  ))}
                </div>
                <span className="text-sm text-gray-300">
                  <span className="font-bold text-white">4.9</span> · 500+ reviews
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Shield className="h-4 w-4 text-accent" />
                <span>Confidential & Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="h-4 w-4 text-accent" />
                <span>24/7 Emergency Support</span>
              </div>
            </div>
          </div>

          {/* Right side feature card */}
          <div
            className={`hidden lg:block lg:col-span-5 transition-opacity duration-500 ${
              currentSlideData.type === "video" && showVideo[currentSlide]
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
          >
            <div
              key={`card-${currentSlide}`}
              className="relative animate-hero-in-right"
            >
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-3xl blur-2xl opacity-60"></div>

              <div className="relative rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center shadow-lg">
                    <Scale className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-accent font-bold">
                      Why Choose Us
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {currentSlideData.subtitle.split(" ").slice(0, 4).join(" ")}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Proven Track Record",
                      desc: "Over 15 years of successful legal representation",
                    },
                    {
                      title: "Personalized Service",
                      desc: "Tailored legal solutions for every client",
                    },
                    {
                      title: "Local Expertise",
                      desc: "Deep knowledge of Gauteng legal landscape",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group/item"
                    >
                      <div className="bg-gradient-to-br from-accent to-yellow-500 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                        <span className="text-black font-bold">{i + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-0.5 group-hover/item:text-accent transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/15">
                  {[
                    { v: "97%", l: "Success" },
                    { v: "500+", l: "Clients" },
                    { v: "9", l: "Practices" },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-accent">{s.v}</div>
                      <div className="text-xs text-gray-300 uppercase tracking-wide">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom control bar: indicators + play/pause + progress */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="container mx-auto px-4 md:px-8 pb-8">
          <div className="flex items-center justify-between gap-6">
            {/* Play/Pause */}
            <button
              onClick={() => setIsAutoPlaying((p) => !p)}
              aria-label={isAutoPlaying ? "Pause carousel" : "Play carousel"}
              className="bg-white/10 hover:bg-accent hover:text-black border border-white/20 backdrop-blur-md text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            {/* Indicators (segmented progress) */}
            <div className="flex-1 flex items-center gap-2 md:gap-3">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className="group relative flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden hover:h-2 transition-all duration-300"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-yellow-300 rounded-full transition-all"
                    style={{
                      width:
                        index < currentSlide
                          ? "100%"
                          : index === currentSlide
                          ? `${progress}%`
                          : "0%",
                      transitionDuration: index === currentSlide ? "50ms" : "300ms",
                    }}
                  />
                  {slide.type === "video" && (
                    <Play className="absolute -top-4 left-1/2 -translate-x-1/2 h-2.5 w-2.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>

            {/* Slide counter */}
            <div className="hidden md:flex items-center gap-1 text-white font-mono text-sm flex-shrink-0">
              <span className="text-accent font-bold text-lg">
                {String(currentSlide + 1).padStart(2, "0")}
              </span>
              <span className="text-white/40">/ {String(slides.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center text-white/60 animate-bounce-slow pointer-events-none">
        <span className="text-xs uppercase tracking-[0.3em] mb-2">Scroll</span>
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-accent rounded-full animate-scroll-dot"></div>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-24 right-24 w-40 h-40 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-32 left-24 w-32 h-32 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-full blur-2xl animate-float pointer-events-none" style={{ animationDelay: "1s" }}></div>

      {/* Local styles for animations */}
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1.05) translate(0, 0); }
          100% { transform: scale(1.18) translate(-1%, -1%); }
        }
        .animate-kenburns { animation: kenburns ${SLIDE_DURATION}ms ease-out both; }

        @keyframes hero-in {
          0% { opacity: 0; transform: translateY(24px); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-hero-in > * { animation: hero-in 0.8s ease-out both; }
        .animate-hero-in > *:nth-child(1) { animation-delay: 0.05s; }
        .animate-hero-in > *:nth-child(2) { animation-delay: 0.18s; }
        .animate-hero-in > *:nth-child(3) { animation-delay: 0.28s; }
        .animate-hero-in > *:nth-child(4) { animation-delay: 0.38s; }
        .animate-hero-in > *:nth-child(5) { animation-delay: 0.48s; }
        .animate-hero-in > *:nth-child(6) { animation-delay: 0.58s; }

        @keyframes hero-in-right {
          0% { opacity: 0; transform: translateX(40px) scale(0.95); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-hero-in-right { animation: hero-in-right 0.9s 0.3s ease-out both; }

        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }

        @keyframes scroll-dot {
          0% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
        .animate-scroll-dot { animation: scroll-dot 1.8s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
