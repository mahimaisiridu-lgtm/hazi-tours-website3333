import React, { useState } from "react";
import { GALLERY_IMAGES } from "../data";
import { X, ZoomIn, Compass } from "lucide-react";

interface GalleryProps {
  onSeeMoreClick: () => void;
}

export default function Gallery({ onSeeMoreClick }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["All", "Beaches", "Wildlife", "Mountains", "Culture", "Adventure"];

  const filteredImages = activeCategory === "All"
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  // Show a premium selection of 12 images on the homepage
  const displayImages = filteredImages.slice(0, 12);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + displayImages.length) % displayImages.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % displayImages.length);
  };

  return (
    <section id="gallery" className="py-24 bg-offwhite relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">Visual Splendors</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest mt-1">
              Destination Chronicles
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-xl font-normal">
              A sensory glimpse into the pristine coral shores, lush mountain peaks, ancient relics, and leopards that await you.
            </p>
          </div>

          {/* Categories Tab selector */}
          <div className="flex flex-wrap gap-2 md:self-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-forest text-offwhite shadow-md shadow-forest/10"
                    : "bg-white text-forest/70 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid with elegant masonry look */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Luxury Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" />

              {/* Hover Contents */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 text-offwhite">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                  {img.category}
                </span>
                <h4 className="font-serif text-lg font-bold mt-1 text-offwhite leading-tight">
                  {img.title}
                </h4>
                <div className="flex items-center space-x-1 text-[10px] text-offwhite/70 mt-2">
                  <ZoomIn className="w-3.5 h-3.5 text-gold" />
                  <span>Enlarge Frame</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayImages.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            No frames found in this chronicle.
          </div>
        )}

        {/* See More Photos Action Button */}
        <div className="mt-16 text-center">
          <button
            onClick={onSeeMoreClick}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-forest hover:bg-forest/95 text-white font-semibold rounded-full shadow-lg shadow-forest/10 hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group cursor-pointer"
          >
            <span className="text-sm tracking-wider uppercase">See More Photos</span>
            <span className="text-gold font-bold text-lg group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && displayImages[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-6"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white w-full max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <Compass className="w-5 h-5 text-gold animate-spin-slow" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                  {displayImages[lightboxIndex].category}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold">
                  {displayImages[lightboxIndex].title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-forest transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Core Image Slide */}
          <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full my-6">
            <img
              src={displayImages[lightboxIndex].url}
              alt={displayImages[lightboxIndex].title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-white/5"
            />

            {/* Previous Frame Arrow */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 sm:left-4 p-3 bg-white/10 hover:bg-gold hover:text-forest rounded-full text-white transition-all z-20"
            >
              <span className="text-xs uppercase font-bold tracking-widest hidden sm:inline mr-2">Prev</span>
              <span>&larr;</span>
            </button>

            {/* Next Frame Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 sm:right-4 p-3 bg-white/10 hover:bg-gold hover:text-forest rounded-full text-white transition-all z-20"
            >
              <span>&rarr;</span>
              <span className="text-xs uppercase font-bold tracking-widest hidden sm:inline ml-2">Next</span>
            </button>
          </div>

          {/* Footer controls count */}
          <div className="text-center text-white/50 text-xs tracking-wider pb-4">
            Frame {lightboxIndex + 1} of {displayImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
