import React, { useState, useEffect } from "react";
import { TOUR_PACKAGES } from "../data";
import { Tour } from "../types";
import { MapPin, Clock, Star, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, X, Calendar, ArrowLeft, Compass, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CustomTourBuilder from "./CustomTourBuilder";
import { useLanguage } from "../context/LanguageContext";
import { getTranslatedTour } from "../i18n/translations";

interface ToursProps {
  onOpenEnquiry: (tourName: string) => void;
  isFullPage?: boolean;
  onBack?: () => void;
  onSeeMore?: () => void;
  activeFilter?: string;
  onChangeFilter?: (filter: string) => void;
}

export default function Tours({ 
  onOpenEnquiry, 
  isFullPage = false, 
  onBack, 
  onSeeMore,
  activeFilter: propActiveFilter,
  onChangeFilter
}: ToursProps) {
  const [selectedDetailedTour, setSelectedDetailedTour] = useState<Tour | null>(null);
  const [localActiveFilter, setLocalActiveFilter] = useState<string>("All Tours");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { language, t } = useLanguage();

  const activeFilter = propActiveFilter !== undefined ? propActiveFilter : localActiveFilter;
  const setActiveFilter = (filter: string) => {
    if (onChangeFilter) {
      onChangeFilter(filter);
    } else {
      setLocalActiveFilter(filter);
    }
  };

  const getSeeMoreButtonText = (filter: string) => {
    switch (filter) {
      case "1 Day Tours":
        return "See More 1 Day Tours";
      case "2 Day Tours":
        return "See More 2 Day Tours";
      case "Multi Day Tours":
        return "See More Multi Day Tours";
      case "Custom Tours":
        return "Build Your Custom Tour";
      default:
        return "See More Tours";
    }
  };

  // Scroll to top when loaded as a full page
  useEffect(() => {
    if (isFullPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isFullPage]);

  const filterOptions = [
    "All Tours",
    "1 Day Tours",
    "2 Day Tours",
    "Multi Day Tours",
    "Custom Tours"
  ];

  const isOneDayTour = (dur: string) => {
    return (
      dur === "One Day Tours" ||
      dur === "1 Day Tours" ||
      dur === "Full Day" ||
      dur === "Half Day" ||
      dur === "5-6 Hours"
    );
  };

  const isTwoDayTour = (dur: string) => {
    return (
      dur === "2 Day Tours" ||
      dur === "1 Night / 2 Days" ||
      dur === "1 Nights / 2 Days" ||
      dur === "2 Days"
    );
  };

  const filteredTours = TOUR_PACKAGES.filter((tour) => {
    // 1. Duration filter check
    if (activeFilter === "1 Day Tours" && !isOneDayTour(tour.duration)) return false;
    if (activeFilter === "2 Day Tours" && !isTwoDayTour(tour.duration)) return false;
    if (activeFilter === "Multi Day Tours" && (isOneDayTour(tour.duration) || isTwoDayTour(tour.duration))) return false;
    if (activeFilter === "Custom Tours") return false;

    // 2. Keyword / Destination search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = tour.name.toLowerCase().includes(q);
      const matchLocation = tour.location.toLowerCase().includes(q);
      const matchDescription = tour.description.toLowerCase().includes(q);
      const matchHighlights = tour.highlights.some((h) => h.toLowerCase().includes(q));
      const matchDetails = tour.details?.some((d) => d.toLowerCase().includes(q));

      if (!matchName && !matchLocation && !matchDescription && !matchHighlights && !matchDetails) {
        return false;
      }
    }

    return true;
  });

  const displayedTours = (isFullPage || searchQuery.trim() !== "") ? filteredTours : filteredTours.slice(0, 6);

  useEffect(() => {
    if (selectedDetailedTour) {
      document.body.style.overflow = "hidden";
      window.history.pushState({ modalType: "tour-details", tourId: selectedDetailedTour.id }, "", window.location.search);

      const handlePopState = (e: PopStateEvent) => {
        if (!e.state || e.state.modalType !== "tour-details") {
          setSelectedDetailedTour(null);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [selectedDetailedTour]);

  const handleCloseDetails = () => {
    setSelectedDetailedTour(null);
    if (window.history.state?.modalType === "tour-details") {
      window.history.back();
    }
  };

  const handleBookAndEnquire = () => {
    const tourName = selectedDetailedTour?.name || "";
    setSelectedDetailedTour(null);
    if (window.history.state?.modalType === "tour-details") {
      window.history.back();
      setTimeout(() => {
        onOpenEnquiry(tourName);
      }, 50);
    } else {
      onOpenEnquiry(tourName);
    }
  };

  return (
    <div className={isFullPage ? "min-h-screen bg-[#faf9f6] text-[#1c2e24] font-sans" : ""}>
      {isFullPage && (
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
              <Compass className="w-5 h-5 text-gold" />
              <span className="font-serif font-bold text-lg text-forest tracking-tight">Hazi Tours Collection</span>
            </div>

            <div className="text-xs text-gray-400 font-mono hidden md:block">
              {TOUR_PACKAGES.length} CURATED JOURNEYS
            </div>
          </div>
        </nav>
      )}

      <section 
        id={isFullPage ? undefined : "tours"} 
        className={`py-24 bg-offwhite relative overflow-hidden ${isFullPage ? 'pt-16 pb-24' : ''}`}
      >
        {/* Background Ornaments */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">Luxury Collection</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest mt-2 mb-4 leading-tight">
            Curated Sri Lanka Journeys
          </h2>
          <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
            Select one of our meticulously planned itineraries or consult us to completely customize an adventure tailored to your personal pace and desires.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8 px-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tours or destinations (e.g. Ella, Yala, Sigiriya, Safari)..."
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200/90 rounded-full text-sm text-forest placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-forest hover:bg-gray-100 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery.trim() !== "" && (
            <div className="mt-2.5 text-center text-xs text-forest/70 font-medium flex items-center justify-center gap-2">
              <span>Found <strong className="text-forest font-bold">{filteredTours.length}</strong> {filteredTours.length === 1 ? "tour package" : "tour packages"} matching "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-gold hover:underline font-bold text-[11px] uppercase tracking-wider ml-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-4 mb-12 max-w-4xl mx-auto px-2">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  if (filter === "Custom Tours") {
                    setTimeout(() => {
                      const el = document.getElementById("custom-tour-builder");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }, 50);
                  }
                }}
                className={`relative px-5 py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? "text-gold border-gold/40 shadow-sm scale-105"
                    : "bg-white text-forest border-gray-200/60 hover:border-gold/40 hover:text-gold hover:shadow-md"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTourFilterBg"
                    className="absolute inset-0 bg-forest rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            );
          })}
        </div>

        {/* Tours Content / Custom Tour Builder */}
        {activeFilter === "Custom Tours" ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="-mx-4 sm:-mx-6 lg:-mx-8 my-4"
          >
            <CustomTourBuilder />
          </motion.div>
        ) : filteredTours.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto my-8">
            {searchQuery.trim() !== "" ? (
              <>
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-forest mb-2">No Matching Tours Found</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  We couldn't find any tours matching "<span className="font-semibold text-forest">{searchQuery}</span>" in {activeFilter}. Try searching for another destination or clear your filter.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center space-x-2 bg-gold text-forest hover:bg-forest hover:text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Clear Search</span>
                  </button>
                  {activeFilter !== "All Tours" && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveFilter("All Tours");
                      }}
                      className="inline-flex items-center space-x-2 bg-gray-100 text-forest hover:bg-gray-200 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                    >
                      <span>Search All Tours</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-bold text-forest mb-3">Create Your Own Sri Lanka Tour</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Select your favourite destinations, choose your travel duration and vehicle, then create your personalized Sri Lanka travel experience using our Custom Tour Builder.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter("Custom Tours");
                    setTimeout(() => {
                      const el = document.getElementById("custom-tour-builder");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }, 50);
                  }}
                  className="inline-flex items-center space-x-2 bg-gold text-forest hover:bg-forest hover:text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
                >
                  <span>Open Custom Tour Builder</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {displayedTours.map((rawTour) => {
                const tour = getTranslatedTour(rawTour, language);
                return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={tour.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100/80 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Tour Image with Price Tag */}
                  <div className="relative h-64 overflow-hidden">
                    {tour.secondaryImage ? (
                      <div className="w-full h-full flex relative transition-transform duration-700 group-hover:scale-105">
                        <div className="w-1/2 h-full relative overflow-hidden">
                          <img
                            src={tour.image}
                            alt={`${tour.name} - Surfing`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                            🏄 Surfing Lesson
                          </div>
                        </div>
                        <div className="w-1/2 h-full relative overflow-hidden border-l-2 border-white/30">
                          <img
                            src={tour.secondaryImage}
                            alt={`${tour.name} - Tea Factory`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                            🍃 Tea Factory
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={tour.image}
                        alt={tour.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    
                    {/* Visual Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4 bg-forest text-offwhite text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-gold/40">
                      {tour.duration === 'Full Day' || tour.duration === 'One Day Tours' || tour.duration === '1 Day Tours' ? "📅 Full Day" : tour.duration}
                    </div>

                    <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-gold">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span className="text-white text-xs font-semibold ml-1">5.0</span>
                    </div>
                  </div>

                  {/* Tour Details */}
                  <div className="p-6 flex flex-col flex-grow relative z-10 pointer-events-auto">
                    <h3 className="font-serif text-2xl font-bold text-forest mb-2 leading-tight group-hover:text-gold transition-colors duration-300">
                      {tour.name}
                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-3 mb-4 flex-grow">
                      {tour.description}
                    </p>

                    <div className="flex items-start space-x-1.5 text-xs text-gold font-semibold mb-2">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span className={tour.location.startsWith("📍") ? "normal-case text-[11px] leading-relaxed font-semibold text-gold" : "uppercase tracking-wider"}>
                        {tour.location}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs text-gray-600 font-semibold mb-6">
                      <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{tour.duration === 'Full Day' || tour.duration === 'One Day Tours' || tour.duration === '1 Day Tours' ? "Full Day Tour" : tour.duration}</span>
                    </div>

                    {/* Primary CTA actions */}
                    <div className="border-t border-gray-100 pt-5 mt-auto flex items-center justify-end relative z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDetailedTour(tour);
                        }}
                        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 30 }}
                        className="text-xs font-bold text-gold hover:text-forest flex items-center space-x-1.5 transition-colors cursor-pointer relative z-30 pointer-events-auto touch-manipulation"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Enquiry Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEnquiry(tour.name);
                      }}
                      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 30 }}
                      className="w-full mt-4 bg-forest text-offwhite hover:bg-gold hover:text-forest text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all duration-300 shadow-md active:scale-95 cursor-pointer relative z-30 pointer-events-auto touch-manipulation"
                    >
                      Send Enquiry
                    </button>

                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Centered "See More" Button for Home Page Section */}
        {!isFullPage && activeFilter !== "Custom Tours" && filteredTours.length > 6 && (
          <div id="all_category_see_more_buttons" className="mt-16 flex justify-center">
            <button
              onClick={onSeeMore}
              className="inline-flex items-center space-x-2.5 bg-forest text-offwhite border border-forest hover:bg-gold hover:text-forest hover:border-gold px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
            >
              <span>{getSeeMoreButtonText(activeFilter)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tour Detail Modal Backdrop */}
      {selectedDetailedTour && (
        <div className="fixed inset-0 bg-forest/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-offwhite rounded-3xl overflow-hidden shadow-2xl border border-white/15 my-8">
            
            {/* Header image cover inside modal */}
            <div className="relative h-60 sm:h-72">
              {selectedDetailedTour.secondaryImage ? (
                <div className="w-full h-full flex relative">
                  <div className="w-1/2 h-full relative overflow-hidden">
                    <img
                      src={selectedDetailedTour.image}
                      alt={`${selectedDetailedTour.name} - Surfing`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded border border-white/20">
                      🏄 Morning Surfing Lesson
                    </div>
                  </div>
                  <div className="w-1/2 h-full relative overflow-hidden border-l-2 border-white/30">
                    <img
                      src={selectedDetailedTour.secondaryImage}
                      alt={`${selectedDetailedTour.name} - Tea Factory`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded border border-white/20">
                      🍃 Handunugoda Tea Factory
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={selectedDetailedTour.image}
                  alt={selectedDetailedTour.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={handleCloseDetails}
                className="absolute top-4 right-4 bg-black/40 hover:bg-gold text-white hover:text-forest w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <span className={`text-gold font-bold flex items-start text-xs ${selectedDetailedTour.location.startsWith("📍") ? 'normal-case leading-relaxed' : 'uppercase tracking-widest'}`}>
                  <MapPin className="w-3.5 h-3.5 mr-1 mt-0.5 shrink-0" />
                  <span>{selectedDetailedTour.location}</span>
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-offwhite mt-1 leading-tight">
                  {selectedDetailedTour.name}
                </h3>
              </div>
            </div>

            {/* Modal Scrollable Contents */}
            <div className="p-6 sm:p-8 max-h-[calc(100vh-320px)] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-5 gap-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <Clock className="w-4.5 h-4.5 text-gold" />
                    <span className="font-semibold">{selectedDetailedTour.duration === 'Full Day' || selectedDetailedTour.duration === 'One Day Tours' || selectedDetailedTour.duration === '1 Day Tours' ? "📅 Full Day" : selectedDetailedTour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-gold text-sm">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="font-bold">5.0 Star Guide</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-normal">
                {selectedDetailedTour.description}
              </p>

              {/* Grid: Highlights vs Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-3 flex items-center">
                    <ShieldCheck className="w-4.5 h-4.5 mr-1.5" />
                    Journey Highlights
                  </h4>
                  <ul className="space-y-2">
                    {selectedDetailedTour.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-600 font-normal">
                        <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mr-2 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-3 flex items-center">
                    <ShieldCheck className="w-4.5 h-4.5 mr-1.5" />
                    What's Included
                  </h4>
                  <ul className="space-y-2">
                    {selectedDetailedTour.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-600 font-normal">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mr-2 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 relative z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookAndEnquire();
                  }}
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 30 }}
                  className="flex-1 bg-forest text-offwhite hover:bg-gold hover:text-forest py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-center transition-all duration-300 cursor-pointer relative z-30 pointer-events-auto touch-manipulation"
                >
                  Book & Send Enquiry
                </button>
                <button
                  type="button"
                  onClick={handleCloseDetails}
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 30 }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer relative z-30 pointer-events-auto touch-manipulation"
                >
                  Close Details
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  </div>
  );
}
