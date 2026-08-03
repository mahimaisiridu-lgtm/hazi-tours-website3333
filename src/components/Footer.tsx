import React from "react";
import { Mail, Phone, MapPin, ArrowUp, Send } from "lucide-react";
import Logo from "./Logo";

interface FooterProps {
  onScrollToSection: (id: string) => void;
}

export default function Footer({ onScrollToSection }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest text-offwhite border-t border-white/5 pt-20 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Logo & description Column */}
          <div className="lg:col-span-4 flex flex-col space-y-5">
            <button
              onClick={() => onScrollToSection("home")}
              className="flex items-center space-x-3 text-left self-start group cursor-pointer"
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

            <p className="text-offwhite/70 text-xs sm:text-sm font-light leading-relaxed max-w-xs">
              Registered boutique tour operator in Sri Lanka. Crafting flawless private passenger transfers and customized multi-day cultural, adventure, and beach excursions.
            </p>

            <div className="flex space-x-3 pt-2">
              {[
                { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61586300103519" },
                { name: "Instagram", href: "#" }
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target={platform.href !== "#" ? "_blank" : undefined}
                  rel={platform.href !== "#" ? "noopener noreferrer" : undefined}
                  className="text-[10px] uppercase tracking-wider font-semibold text-gold/80 hover:text-offwhite border border-gold/20 hover:border-gold px-3 py-1 rounded-md transition-all"
                >
                  {platform.name}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold font-bold">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-2.5">
              {[
                { name: "Home Collection", id: "home" },
                { name: "Tour Packages", id: "tours" },
                { name: "Our Narrative", id: "about" },
                { name: "Guest Reviews", id: "reviews" },
                { name: "Chronicle Gallery", id: "gallery" },
                { name: "FAQ", id: "faq" },
                { name: "Get in Touch", id: "contact" }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => onScrollToSection(link.id)}
                  className="text-xs text-offwhite/80 hover:text-gold text-left transition-colors cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold font-bold">
              Local Headquarters
            </h4>
            <div className="flex flex-col space-y-3 text-xs text-offwhite/80 font-light">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Thiranagama, 80240, Sri Lanka</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+94752890560" className="hover:text-gold transition-colors">
                  +94 75 289 0560
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:hasindusachindika155@gmail.com" className="hover:text-gold transition-colors break-all">
                  hasindusachindika155@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Luxury Newsletter or Note Column */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold font-bold">
              Travel Assurance
            </h4>
            <p className="text-offwhite/60 text-xs font-light leading-relaxed">
              Every vehicle is thoroughly sanitized. Licensed tourist chauffeur guides are fully insured for standard passenger operations.
            </p>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-offwhite/50 font-light">
          <div>
            &copy; {currentYear} Hazi Tour and Transport. All rights reserved. <br className="sm:hidden" />
            Design by Mahima Isiridu.
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-gold hover:text-offwhite transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
