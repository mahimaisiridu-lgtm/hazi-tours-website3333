import React, { useState, useEffect } from "react";
import { ArrowRight, Shield } from "lucide-react";
import Logo from "./Logo";
import { useLanguage } from "../context/LanguageContext";

interface HeroProps {
  onOpenEnquiry: () => void;
  onScrollToTours: () => void;
}

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
    title: "Ella Nine Arch Bridge & High Country",
    tagline: "Hill Country Wonders"
  },
  {
    url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
    title: "Sigiriya Rock Fortress",
    tagline: "Sacred Ancient Ruins"
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    title: "Southern Shorelines",
    tagline: "Tropical Beach Paradises"
  },
  {
    url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80",
    title: "Minneriya Giants Safari",
    tagline: "Untamed Exotic Wildlife"
  },
  {
    url: "https://static01.nyt.com/images/2019/02/03/travel/03frugal-srilanka01/merlin_148552275_74c0d250-949c-46e0-b8a1-e6d499e992cf-superJumbo.jpg",
    title: "Scenic Hill Country Railway",
    tagline: "Breathtaking Journeys"
  },
  {
    url: "https://cdn.getyourguide.com/img/country/5c612f6df25bd.jpeg/88.jpg",
    title: "Cultural Landmarks & Heritage",
    tagline: "Timeless Wonder"
  },
  {
    url: "https://media.timeout.com/images/105367531/1372/1029/image.jpg",
    title: "Exotic Sri Lankan Landscapes",
    tagline: "Unforgettable Horizons"
  },
  {
    url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
    title: "Highland Tea Country & Cascading Waterfalls",
    tagline: "Highland Paradise"
  },
  {
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    title: "Ancient Rock Temples & Heritage Sites",
    tagline: "Cultural Treasures"
  },
  {
    url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    title: "Golden Beaches & Turquoise Waters",
    tagline: "Coastal Serenity"
  },
  {
    url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80",
    title: "Wild Elephant Safaris & Nature Reserves",
    tagline: "Exotic Wildlife"
  }
];

export default function Hero({ onOpenEnquiry, onScrollToTours }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6500); // Cinematic transition interval
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="home" className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Background Images with Zoom (Ken Burns Effect) */}
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            idx === currentIndex ? "opacity-100 z-10 scale-105" : "opacity-0 z-0 scale-100"
          } transform duration-[6500ms] ease-linear`}
          style={{
            backgroundImage: `linear-gradient(rgba(28, 58, 43, 0.45), rgba(28, 58, 43, 0.85)), url(${img.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Decorative Gradients / Luxury Borders */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-offwhite to-transparent z-20" />


      {/* Main Content Area */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20 mt-16">
        
        {/* Fine Floating Badge */}
        <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/10 pl-2.5 pr-4 py-1.5 rounded-full mb-6">
          <Logo variant="icon" size={24} light={true} />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] text-gold uppercase font-bold">
            {t("hero.badge", "Rated #1 Private Chauffeur & Tour Specialist in Hikkaduwa")}
          </span>
        </div>

        {/* Cinematic Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-offwhite tracking-tight leading-[1.1] mb-6">
          {t("hero.headline_1", "Discover Sri Lanka in")} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-ivory to-gold italic font-normal">
            {t("hero.headline_2", "Pure Luxury Comfort")}
          </span>
        </h1>

        {/* Elegant Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-offwhite/80 font-normal leading-relaxed mb-10">
          {t("hero.sub", "Tailor-made private chauffeur tours, airport transfers, Yala safaris, and island escapes. Driven by English-speaking local experts with zero hidden costs.")}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onScrollToTours}
            className="w-full sm:w-auto cursor-pointer bg-gold hover:bg-offwhite hover:text-forest text-forest px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
          >
            <span>{t("hero.btn_tours", "Explore Tour Packages")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenEnquiry}
            className="w-full sm:w-auto cursor-pointer bg-transparent hover:bg-white/10 border border-white/30 hover:border-white/60 text-offwhite px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>{t("nav.enquire", "Send Enquiry")}</span>
          </button>
        </div>

        {/* Subtle Trust Indicators */}
        <div className="mt-12 hidden sm:flex items-center justify-center space-x-8 text-xs text-offwhite/50">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gold" />
            <span>{t("hero.stat_safety", "100% Private & Safe")}</span>
          </div>
          <span>•</span>
          <div>{t("hero.stat_reviews", "5.0 ★ Google Rating")}</div>
          <span>•</span>
          <div>{t("hero.stat_safety_sub", "Licensed Luxury Vehicles")}</div>
        </div>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-gold" : "w-2.5 bg-white/40 hover:bg-white"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
