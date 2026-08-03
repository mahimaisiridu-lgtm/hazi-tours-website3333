import React, { useState, useEffect } from "react";
import { SRI_LANKA_EVENTS } from "../data/events";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Maximize2, Calendar, MapPin, Heart, Image } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface EventGalleryPageProps {
  eventId: string;
  onBack: () => void;
  onScrollToSection: (id: string) => void;
  onOpenEnquiry?: (tourName?: string) => void;
}

export default function EventGalleryPage({ eventId, onBack, onScrollToSection, onOpenEnquiry }: EventGalleryPageProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<Record<string, boolean>>({});

  // Find the current event
  const currentEvent = SRI_LANKA_EVENTS.find((e) => e.id === eventId);

  // Scroll to top when this page is loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [eventId]);

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-offwhite flex flex-col items-center justify-center pt-24 text-center px-4">
        <Navbar
          onOpenEnquiry={onOpenEnquiry || (() => {})}
          onScrollToSection={onScrollToSection}
          onEventsClick={onBack}
        />
        <h2 className="font-serif text-2xl font-bold text-forest mt-20">Event Not Found</h2>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2.5 bg-forest text-offwhite hover:bg-gold hover:text-forest font-bold rounded-xl transition-all cursor-pointer"
        >
          Return to Events
        </button>
      </div>
    );
  }

  const images = currentEvent.galleryImages || [currentEvent.image];

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! - 1 + images.length) % images.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! + 1) % images.length);
  };

  const toggleLike = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedImages((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedIdx(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, images]);

  return (
    <div className="min-h-screen bg-offwhite flex flex-col relative z-10">
      {/* Reused Home Page Header / Navbar */}
      <Navbar
        onOpenEnquiry={onOpenEnquiry || (() => {})}
        onScrollToSection={onScrollToSection}
        onEventsClick={onBack}
      />

      {/* Navigation and Back bar */}
      <div className="bg-forest pt-28 sm:pt-32 pb-4 border-b border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gold hover:text-offwhite transition-all text-xs font-bold uppercase tracking-widest cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Events</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-[10px] uppercase tracking-wider text-offwhite/50 font-medium">
            <span>Home</span>
            <span>/</span>
            <span>What's On</span>
            <span>/</span>
            <span className="text-gold font-bold">Event Photos</span>
          </div>
        </div>
      </div>

      {/* Decorative Header */}
      <div className="bg-forest text-offwhite relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img
            src={currentEvent.image}
            alt={currentEvent.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/90 to-transparent"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="bg-gold/20 text-gold border border-gold/30 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full">
              {currentEvent.category}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-offwhite uppercase">
            {currentEvent.title} Gallery
          </h1>
          <p className="text-offwhite/80 max-w-2xl mx-auto text-xs sm:text-sm font-light leading-relaxed">
            Immerse yourself in beautiful captures and historic celebration moments from {currentEvent.title}. Explore the magical sights, stunning vibrant colors, and authentic cultural heritage of Sri Lanka.
          </p>
          <div className="flex flex-wrap gap-4 items-center justify-center text-[11px] text-offwhite/60 font-semibold pt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              {currentEvent.dateDay} {currentEvent.dateMonthName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              {currentEvent.location}
            </span>
          </div>
        </div>
      </div>

      {/* Photos Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => setSelectedIdx(idx)}
              className="break-inside-avoid relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 group cursor-pointer bg-white"
            >
              <img
                src={img}
                alt={`${currentEvent.title} capture ${idx + 1}`}
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={(e) => toggleLike(idx, e)}
                    className="w-8.5 h-8.5 bg-white/15 backdrop-blur-md hover:bg-gold/20 hover:text-gold rounded-full flex items-center justify-center text-white transition-all shadow-md"
                  >
                    <Heart className={`w-4.5 h-4.5 ${likedImages[idx] ? "fill-gold text-gold" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gold font-bold">
                      {currentEvent.category}
                    </p>
                    <p className="text-xs font-semibold truncate max-w-[180px]">
                      {currentEvent.title} — Photo #{idx + 1}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gold hover:bg-white text-forest rounded-full flex items-center justify-center shadow-md transition-all">
                    <Maximize2 className="w-3.5 h-3.5 font-bold" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <div className="fixed inset-0 z-50 bg-forest/95 backdrop-blur-md flex items-center justify-center p-4">
            {/* Close trigger overlay */}
            <div className="absolute inset-0" onClick={() => setSelectedIdx(null)}></div>

            {/* Main content container */}
            <div className="relative w-full max-w-5xl max-h-[85vh] z-10 flex flex-col items-center">
              {/* Image box */}
              <div className="relative w-full flex items-center justify-center select-none flex-grow overflow-hidden">
                <motion.img
                  key={selectedIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  src={images[selectedIdx]}
                  alt={`${currentEvent.title} zoomed view`}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/5"
                  referrerPolicy="no-referrer"
                />

                {/* Left Arrow button */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 bg-black/40 hover:bg-gold text-white hover:text-forest w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md border border-white/5 hover:scale-105"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow button */}
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 bg-black/40 hover:bg-gold text-white hover:text-forest w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md border border-white/5 hover:scale-105"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Top controls */}
              <div className="absolute top-[-45px] right-0 flex items-center space-x-3 text-white">
                <button
                  onClick={(e) => toggleLike(selectedIdx, e)}
                  className="bg-black/30 hover:bg-gold/20 hover:text-gold border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${likedImages[selectedIdx] ? "fill-gold text-gold" : ""}`} />
                  <span>{likedImages[selectedIdx] ? "Liked" : "Like"}</span>
                </button>
                <button
                  onClick={() => setSelectedIdx(null)}
                  className="bg-black/40 hover:bg-gold text-white hover:text-forest w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom stats/title bar */}
              <div className="w-full text-center mt-4 text-white/90">
                <p className="text-sm font-medium font-serif tracking-wide">
                  {currentEvent.title} — Capture {selectedIdx + 1} of {images.length}
                </p>
                <p className="text-[11px] text-gold uppercase tracking-widest font-bold mt-1">
                  {currentEvent.category} • {currentEvent.location}
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <Footer onScrollToSection={onScrollToSection} />
    </div>
  );
}
