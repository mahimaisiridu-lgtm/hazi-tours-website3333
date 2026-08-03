import React, { useState, useMemo } from "react";
import { SRI_LANKA_EVENTS } from "../data/events";
import { SriLankaEvent } from "../types";
import { MapPin, Calendar, ArrowLeft, ArrowRight, Grid, List, Tag, X, HelpCircle, Ticket, Image } from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface EventsPageProps {
  onBack: () => void;
  onScrollToSection: (id: string) => void;
  onViewEventGallery: (eventId: string) => void;
  onOpenEnquiry?: (tourName?: string) => void;
}

export default function EventsPage({ onBack, onScrollToSection, onViewEventGallery, onOpenEnquiry }: EventsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPricing, setSelectedPricing] = useState<"All" | "Free" | "Ticketed">("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeEventModal, setActiveEventModal] = useState<SriLankaEvent | null>(null);

  const categories = ["All", "Cultural", "Wildlife & Nature", "Adventure & Sports", "Food & Drink", "Arts & Music"];
  const pricingOptions = ["All", "Free", "Ticketed"];
  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  // Filter events based on criteria
  const filteredEvents = useMemo(() => {
    return SRI_LANKA_EVENTS.filter((evt) => {
      const matchCategory = selectedCategory === "All" || evt.category === selectedCategory;
      const matchPricing =
        selectedPricing === "All" ||
        (selectedPricing === "Free" && !evt.isTicketed) ||
        (selectedPricing === "Ticketed" && evt.isTicketed);
      const matchMonth = selectedMonth === "All" || evt.dateMonthName === selectedMonth;
      return matchCategory && matchPricing && matchMonth;
    });
  }, [selectedCategory, selectedPricing, selectedMonth]);

  const handleInquireEvent = (eventTitle: string) => {
    setActiveEventModal(null);
    const text = encodeURIComponent(
      `Hello Hazi Tour and Transport, I am interested in planning a trip to experience the event "${eventTitle}". Can you please assist me with custom transfer, guide, and hotel arrangements?`
    );
    window.open(`https://wa.me/94752890560?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-offwhite flex flex-col relative z-10">
      
      {/* Reused Home Page Header / Navbar */}
      <Navbar
        onOpenEnquiry={onOpenEnquiry || (() => {})}
        onScrollToSection={onScrollToSection}
        onEventsClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      {/* Top Hero Section */}
      <div className="bg-forest text-offwhite relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Decorative patterns */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
            alt="Sri Lanka Culture Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/90 to-transparent"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold block animate-fade-in">
            What's On
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-offwhite uppercase">
            Events & Festivals
          </h1>
          <div className="w-16 h-[1.5px] bg-gold mx-auto my-3"></div>
          <p className="text-sm sm:text-base md:text-lg font-light text-offwhite/80 max-w-2xl mx-auto leading-relaxed">
            Sri Lanka's calendar brims with colour, from ancient temple processions to beach music festivals. Explore the vibrant soul of the island.
          </p>
        </div>
      </div>

      {/* Filters and Search Area */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[77px] z-30 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-5">
          
          {/* Main Category Filter Row */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              Category
            </span>
            <div className="flex items-center overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-forest border-forest text-offwhite shadow-md shadow-forest/10"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gold/50 hover:text-forest"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Filters and controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 border-t border-gray-50">
            
            {/* Pricing Pillar selection */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                Admission:
              </span>
              <div className="flex bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                {pricingOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPricing(opt as any)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      selectedPricing === opt
                        ? "bg-white text-forest shadow-sm font-bold"
                        : "text-gray-500 hover:text-forest"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Month & Layout Toggles */}
            <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
              
              {/* Month Dropdown Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                  Month:
                </span>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium px-4 py-2 pr-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gold transition-all cursor-pointer"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m === "All" ? "All Months" : m}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-forest shadow-sm"
                      : "text-gray-400 hover:text-forest"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-forest shadow-sm"
                      : "text-gray-400 hover:text-forest"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Main Events Grid / List Section */}
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Results counter */}
        <div className="flex items-center justify-between mb-8 text-xs text-gray-500 font-light">
          <span>
            Showing <strong className="font-semibold text-forest">{filteredEvents.length}</strong> events
          </span>
          {(selectedCategory !== "All" || selectedPricing !== "All" || selectedMonth !== "All") && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedPricing("All");
                setSelectedMonth("All");
              }}
              className="text-gold hover:underline font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredEvents.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest">No Events Found</h3>
            <p className="text-gray-500 text-sm font-light">
              We couldn't find any events matching your selected filter combination. Try adjusting your category, pricing, or month options.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedPricing("All");
                setSelectedMonth("All");
              }}
              className="px-5 py-2.5 bg-forest text-offwhite rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-forest transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW: 3 columns on desktop, 1 on mobile */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Card Top Image & Badges */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 shadow-md flex flex-col items-center justify-center min-w-[50px] text-center border border-gray-100">
                    <span className="text-sm font-black text-forest leading-none tracking-tight">
                      {evt.dateDay}
                    </span>
                    <span className="text-[9px] font-bold text-gold uppercase tracking-wider mt-0.5">
                      {evt.dateMonth}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <span className="absolute bottom-4 left-4 bg-forest/90 text-offwhite text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border border-white/10">
                    {evt.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-forest group-hover:text-gold transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center text-xs text-gray-500 font-medium space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="line-clamp-1">{evt.location}</span>
                    </div>

                    <p className="text-gray-500 text-xs font-light leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    {/* Divider & Pricing / Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs font-bold text-forest">
                        {evt.isTicketed ? (
                          <Ticket className="w-4 h-4 text-gold shrink-0" />
                        ) : (
                          <Tag className="w-4 h-4 text-gold shrink-0" />
                        )}
                        <span className={evt.isTicketed ? "text-gray-700" : "text-emerald-700 font-bold"}>
                          {evt.priceText}
                        </span>
                      </div>

                      <button
                        onClick={() => setActiveEventModal(evt)}
                        className="text-xs font-bold uppercase tracking-wider text-gold hover:text-forest transition-colors flex items-center space-x-1 cursor-pointer group/btn"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW: Side-by-side on tablet/desktop, stacked on mobile */
          <div className="flex flex-col space-y-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row overflow-hidden group"
              >
                {/* Image panel */}
                <div className="relative w-full md:w-80 h-56 md:h-auto shrink-0 overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 shadow-md flex flex-col items-center justify-center min-w-[50px] text-center border border-gray-100">
                    <span className="text-sm font-black text-forest leading-none tracking-tight">
                      {evt.dateDay}
                    </span>
                    <span className="text-[9px] font-bold text-gold uppercase tracking-wider mt-0.5">
                      {evt.dateMonth}
                    </span>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="bg-forest/10 text-forest text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md">
                        {evt.category}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold">•</span>
                      <span className="text-xs text-gray-400 font-semibold">{evt.dateMonthName} Event</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest group-hover:text-gold transition-colors">
                      {evt.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-xs text-gray-500 font-medium space-x-1.5">
                      <MapPin className="w-4 h-4 text-gold shrink-0" />
                      <span>{evt.location}</span>
                    </div>

                    <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed max-w-3xl">
                      {evt.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-1 text-sm font-bold text-forest">
                      {evt.isTicketed ? (
                        <Ticket className="w-4.5 h-4.5 text-gold shrink-0" />
                      ) : (
                        <Tag className="w-4.5 h-4.5 text-gold shrink-0" />
                      )}
                      <span className={evt.isTicketed ? "text-gray-700" : "text-emerald-700 font-bold"}>
                        {evt.priceText}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveEventModal(evt)}
                      className="px-5 py-2.5 bg-forest text-offwhite hover:bg-gold hover:text-forest text-xs font-bold uppercase tracking-widest rounded-xl transition-all inline-flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Interactive Modal popup */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop Blur overlay */}
          <div
            className="absolute inset-0 bg-forest/80 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveEventModal(null)}
          ></div>

          {/* Modal Container */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative z-10 border border-white/10 animate-fade-in">
            {/* Image Header with floating items */}
            <div className="relative h-64 sm:h-72 shrink-0">
              <img
                src={activeEventModal.image}
                alt={activeEventModal.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Close Button */}
              <button
                onClick={() => setActiveEventModal(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-gold text-white hover:text-forest w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Category */}
              <span className="absolute bottom-4 left-6 bg-gold text-forest text-[10px] uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-md">
                {activeEventModal.category}
              </span>
            </div>

            {/* Scrollable details area */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gold">
                  {activeEventModal.dateMonthName} • Annual Festival
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-forest">
                  {activeEventModal.title}
                </h2>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-forest/5 flex items-center justify-center text-forest">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Date Info</span>
                    <span className="text-xs font-bold text-gray-700">{activeEventModal.dateDay} {activeEventModal.dateMonthName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-forest/5 flex items-center justify-center text-forest">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Location Venue</span>
                    <span className="text-xs font-bold text-gray-700 line-clamp-1">{activeEventModal.location}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:col-span-2">
                  <div className="w-9 h-9 rounded-xl bg-forest/5 flex items-center justify-center text-forest">
                    {activeEventModal.isTicketed ? <Ticket className="w-4.5 h-4.5" /> : <Tag className="w-4.5 h-4.5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Admission / Price</span>
                    <span className="text-xs font-bold text-gray-700">{activeEventModal.priceText}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap pb-1">
                  <h4 className="text-xs uppercase tracking-wider text-forest font-black">About the Festival</h4>
                  <button
                    onClick={() => {
                      setActiveEventModal(null);
                      onViewEventGallery(activeEventModal.id);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-forest text-gold border border-gold/35 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-forest hover:border-gold transition-all duration-300 shadow-md cursor-pointer group shrink-0"
                  >
                    <Image className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>See More Photos</span>
                  </button>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-line">
                  {activeEventModal.description}
                </p>
                <p className="text-gray-400 text-xs font-light leading-relaxed">
                  Hazi Tours offers customizable chauffeured transfers, guided packages, and boutique hotel bookings to help visitors experience this spectacular event with full comfort and safety.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleInquireEvent(activeEventModal.title)}
                  className="flex-grow bg-forest text-offwhite hover:bg-gold hover:text-forest py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-widest text-center transition-all duration-300 cursor-pointer shadow-md"
                >
                  Plan Trip & Inquire via WhatsApp
                </button>
                <button
                  onClick={() => setActiveEventModal(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-widest text-center transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrated Brand Footer */}
      <Footer onScrollToSection={onScrollToSection} />

    </div>
  );
}
