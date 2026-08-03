import React, { useState, useEffect } from "react";
import { GALLERY_IMAGES } from "../data";
import { ArrowLeft, X, ChevronLeft, ChevronRight, ZoomIn, Heart, Share2, Compass, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DedicatedGalleryProps {
  onBack: () => void;
}

export default function DedicatedGallery({ onBack }: DedicatedGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<Record<string, boolean>>({});

  // Scroll to top when this page is loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredImages = GALLERY_IMAGES;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! + 1) % filteredImages.length);
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedImages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Listen to keyboard arrows for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedIdx(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, filteredImages]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1c2e24] font-sans pb-24">
      {/* Album Top bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-forest hover:text-gold transition-colors font-medium text-sm group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Explorer</span>
          </button>

          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-gold" />
            <span className="font-serif font-bold text-lg text-forest tracking-tight">Hazi tours photos</span>
          </div>

          <div className="text-xs text-gray-400 font-mono hidden md:block">
            {GALLERY_IMAGES.length} CAPTURED MOMENTS
          </div>
        </div>
      </nav>

      {/* Hero Banner / Header */}
      <header className="py-12 md:py-16 bg-gradient-to-b from-white to-[#faf9f6] border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">THE COMPLETE PHOTO ALBUM</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest mt-2 tracking-tight">
            Sri Lanka Travel Album
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            A high-definition photographic journal of our private expeditions across golden coasts, sacred sanctuaries, historic citadels, and misty tea plantations.
          </p>

          {/* Album Stats Badge */}
          <div className="flex justify-center items-center gap-6 mt-8 text-xs font-mono text-gray-500 uppercase tracking-widest bg-white py-3 px-6 rounded-full shadow-sm max-w-md mx-auto border border-gray-100">
            <div>📸 {GALLERY_IMAGES.length} Photos</div>
            <div className="h-4 w-px bg-gray-200"></div>
            <div>🌟 HD Quality</div>
          </div>
        </div>
      </header>

      {/* Main Album Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, idx) => {
              // find actual index of this image in GALLERY_IMAGES so lightbox is consistent
              const absoluteIdx = GALLERY_IMAGES.findIndex(g => g.id === img.id);
              const isLiked = likedImages[img.id];

              return (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedIdx(idx)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer aspect-[4/5] sm:aspect-[3/4]"
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Photo itself */}
                  <img
                    src={img.url}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4" />

                  {/* Content shown on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 text-white">
                    <span className="text-[9px] uppercase tracking-widest text-gold font-bold">
                      {img.category}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base font-bold mt-0.5 leading-tight text-white drop-shadow-sm">
                      {img.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-[9px] text-white/80 mt-2">
                      <ZoomIn className="w-3.5 h-3.5 text-gold" />
                      <span>Enlarge Frame</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-24 text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto mt-12">
            <Compass className="w-12 h-12 text-gold mx-auto mb-4 animate-pulse" />
            <p className="font-serif text-lg font-semibold text-forest">No frames discovered yet</p>
            <p className="text-sm text-gray-400 mt-1">Check back later or try selecting another category.</p>
          </div>
        )}
      </main>

      {/* Lightbox / Fullscreen Modal View */}
      <AnimatePresence>
        {selectedIdx !== null && filteredImages[selectedIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4 sm:p-6"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Top Bar inside modal */}
            <div className="flex items-center justify-between text-white w-full max-w-7xl mx-auto pt-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gold border border-white/10">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                    {filteredImages[selectedIdx].category}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                    {filteredImages[selectedIdx].title}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedIdx(null)}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-forest transition-all border border-white/10"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Middle Image Preview Screen */}
            <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full my-4">
              
              {/* Image with Slide Transition Animation */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={filteredImages[selectedIdx].id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={filteredImages[selectedIdx].url}
                  alt={filteredImages[selectedIdx].title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              {/* Navigation: Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 p-3 sm:p-4 bg-white/10 hover:bg-gold hover:text-forest rounded-full text-white transition-all z-20 hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Navigation: Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 p-3 sm:p-4 bg-white/10 hover:bg-gold hover:text-forest rounded-full text-white transition-all z-20 hover:scale-105"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Bottom Status Counter */}
            <div className="text-center text-white/50 text-xs tracking-wider pb-2">
              Frame {selectedIdx + 1} of {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
