import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, CalendarDays } from "lucide-react";
import Logo from "./Logo";
import { useLanguage } from "../context/LanguageContext";
import { Language } from "../types";

interface NavbarProps {
  onOpenEnquiry: (tourName?: string) => void;
  onScrollToSection: (id: string) => void;
  onEventsClick: () => void;
}

export default function Navbar({ onOpenEnquiry, onScrollToSection, onEventsClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(77);

  const { language, setLanguage, t, supportedLanguages } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!navbarRef.current) return;
    
    // Initial measurement
    setNavbarHeight(navbarRef.current.offsetHeight);

    const handleResize = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);

    const observer = new ResizeObserver(() => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    });
    observer.observe(navbarRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
      observer.disconnect();
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: t("nav.home", "Home"), id: "home" },
    { name: t("nav.tours", "Tours"), id: "tours" },
    { name: t("nav.events", "Events"), id: "events" },
    { name: t("nav.about", "About"), id: "about" },
    { name: t("nav.gallery", "Gallery"), id: "gallery" },
    { name: t("nav.faq", "FAQ"), id: "faq" },
    { name: t("nav.contact", "Contact"), id: "contact" },
  ];

  const handleLinkClick = (id: string) => {
    if (id === "events") {
      onEventsClick();
    } else {
      onScrollToSection(id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navbarRef}
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-forest/95 backdrop-blur-md shadow-lg border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Emblem */}
          <button
            onClick={() => handleLinkClick("home")}
            className="flex items-center space-x-3 cursor-pointer group text-left"
            id="nav-logo-btn"
          >
            <Logo variant="emblem" size={54} bg="white" />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-offwhite group-hover:text-gold transition-colors duration-300 uppercase">
                Hazi Tours
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-gold font-bold -mt-0.5">
                Hikkaduwa Sri Lanka
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8" id="nav-desktop-links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-sm font-medium tracking-wide text-offwhite/85 hover:text-gold transition-colors duration-300 relative py-1 group cursor-pointer"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Desktop Right Controls (Phone + CTA) */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+94752890560"
              className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-gold hover:text-offwhite transition-colors duration-300"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+94 75 289 0560</span>
            </a>

            <button
              onClick={() => onOpenEnquiry()}
              className="relative overflow-hidden cursor-pointer bg-gold text-forest hover:bg-offwhite hover:text-forest px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl active:scale-95"
              id="nav-cta-enquiry"
            >
              {t("nav.enquire", "Send Enquiry")}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center space-x-2.5">
            <button
              onClick={() => onOpenEnquiry()}
              className="bg-gold text-forest px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
            >
              {t("nav.enquire", "Enquire")}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-offwhite hover:text-gold focus:outline-none transition-colors ml-1"
              aria-label="Toggle menu"
              id="hamburger-btn"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-x-0 bg-forest/98 backdrop-blur-lg z-40 transition-all duration-500 ease-in-out lg:hidden ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
        }`}
        style={{
          top: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`
        }}
        id="mobile-nav-drawer"
      >
        <div className="flex flex-col h-full justify-between px-6 py-8 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {/* Mobile Language Bar */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-2">
              <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-2">
                Language / Sprache / Langue / Idioma
              </span>
              <div className="grid grid-cols-4 gap-2">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                      language === lang.code
                        ? "bg-gold text-forest border-gold shadow-md"
                        : "bg-white/5 text-offwhite border-white/10 hover:border-gold/50"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-[10px] uppercase tracking-wider mt-0.5">{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {navLinks.map((link, idx) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-xl font-serif font-medium tracking-wide text-offwhite text-left hover:text-gold py-2 border-b border-white/5 transition-all duration-300"
                style={{ transitionDelay: `${idx * 40}ms` }}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col space-y-6 border-t border-white/10 pt-6">
            <div className="flex flex-col space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold font-medium">
                {t("nav.direct_contact", "Direct Contact")}
              </span>
              <a
                href="tel:+94752890560"
                className="text-lg font-medium text-offwhite flex items-center space-x-2"
              >
                <Phone className="w-5 h-5 text-gold" />
                <span>+94 75 289 0560</span>
              </a>
              <span className="text-xs text-offwhite/50">
                Thiranagama, 80240, Sri Lanka
              </span>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full bg-gold hover:bg-offwhite text-forest font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <CalendarDays className="w-4 h-4" />
              <span>{t("nav.book_enquiry", "Book / Send Enquiry")}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

