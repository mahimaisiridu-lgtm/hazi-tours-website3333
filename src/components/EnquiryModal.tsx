import React, { useState, useEffect, useRef } from "react";
import { TOUR_PACKAGES } from "../data";
import { Enquiry } from "../types";
import { X, Send, Compass, MessageSquare, AlertCircle, Sparkles, Calendar, MapPin } from "lucide-react";
import { trackWhatsAppAndNavigate, EnquiryData } from "../tracker";
import { useLanguage } from "../context/LanguageContext";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTour?: string;
}

export default function EnquiryModal({ isOpen, onClose, preselectedTour }: EnquiryModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Enquiry>({
    fullName: "",
    email: "",
    phone: "",
    selectedTour: preselectedTour || "",
    travelers: 1,
    travelDate: "",
    arrivalDate: "",
    departureDate: "",
    pickupLocation: "",
    message: ""
  });

  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("Car");

  const [errors, setErrors] = useState<Partial<Record<keyof Enquiry, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'detecting' | 'success' | 'error'>('idle');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Sync preselected tour when prop changes
  useEffect(() => {
    if (preselectedTour) {
      setFormData((prev) => ({ ...prev, selectedTour: preselectedTour }));
    }
  }, [preselectedTour, isOpen]);

  // Sync adults & children to total travelers, and run vehicle recommendations
  useEffect(() => {
    const total = adults + children;
    
    setFormData((prev) => {
      if (prev.travelers !== total) {
        return { ...prev, travelers: total };
      }
      return prev;
    });

    if (total > 4) {
      if (selectedVehicle !== "Van") {
        setSelectedVehicle("Van");
      }
    } else if (total === 4) {
      if (selectedVehicle === "Three Wheel" || !selectedVehicle) {
        setSelectedVehicle("Car");
      }
    } else if (total <= 3) {
      if (selectedVehicle === "Van") {
        setSelectedVehicle("Three Wheel");
      }
    }
  }, [adults, children, selectedVehicle]);

  // Lock body scroll and reset scroll position of modal content to top when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        if (modalContainerRef.current) {
          modalContainerRef.current.scrollTop = 0;
        }
      }, 0);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTodayDateString = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleAdultChange = (change: number) => {
    setAdults((prev) => Math.max(1, prev + change));
  };

  const handleChildrenChange = (change: number) => {
    setChildren((prev) => Math.max(0, prev + change));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsError('Unable to detect your location. Please enter your pickup location manually.');
      return;
    }

    setGpsStatus('detecting');
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setGpsStatus('success');
        
        // Populate the pickupLocation text input field with "Current Customer Location" (or keep if already customized)
        setFormData((prev) => ({
          ...prev,
          pickupLocation: "Current Customer Location"
        }));
        
        // Clear any validation errors for the pickupLocation field
        if (errors.pickupLocation) {
          setErrors((prev) => ({ ...prev, pickupLocation: "" }));
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGpsStatus('error');
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError("Location permission denied. Please enter your pickup location manually.");
        } else {
          setGpsError("Unable to detect your location. Please enter your pickup location manually.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Enquiry, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.selectedTour) newErrors.selectedTour = "Please select a tour package";
    
    const total = adults + children;
    if (total < 1) newErrors.travelers = "Number of travelers must be at least 1";
    
    const todayStr = getTodayDateString();
    if (!formData.arrivalDate || formData.arrivalDate < todayStr) {
      newErrors.arrivalDate = "Please select a valid arrival date.";
    }
    if (!formData.departureDate || (formData.arrivalDate && formData.departureDate < formData.arrivalDate)) {
      newErrors.departureDate = "Please select a valid departure date.";
    }
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = "Pickup location is required";

    // Validate selected vehicle suitability
    if (!selectedVehicle) {
      newErrors.selectedVehicle = "Please select a vehicle option";
    } else if (selectedVehicle === "Car" && total > 4) {
      newErrors.selectedVehicle = "Car is not available for more than 4 travelers. Please select Van.";
    } else if (selectedVehicle === "Three Wheel" && total > 3) {
      newErrors.selectedVehicle = "Three Wheel is not available for more than 3 travelers. Please select Car or Van.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for field
    if (errors[name as keyof Enquiry]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const total = adults + children;
    let vehiclePriceDetail = "";
    if (selectedVehicle === "Car") {
      vehiclePriceDetail = "Standard Rate (Included)";
    } else if (selectedVehicle === "Van") {
      vehiclePriceDetail = "Van (+ $30 USD additional)";
    } else if (selectedVehicle === "Three Wheel") {
      vehiclePriceDetail = "Three Wheel (- $10 USD discount)";
    }

    const activeTour = TOUR_PACKAGES.find((t) => t.name === formData.selectedTour);
    const isCustomTour = formData.selectedTour === "Tailor-made Custom Itinerary";
    const pricePerPerson = activeTour ? parseInt(activeTour.price.replace(/[^0-9]/g, "")) || 0 : 0;
    const totalPrice = pricePerPerson * total;

    const priceText = "Custom Quote Provided on Request (Free Consultation)";

    const gpsLocationUrl = (latitude !== null && longitude !== null && gpsStatus === 'success')
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : '';

    const gpsInfoBlock = gpsLocationUrl
      ? `\nGPS Coordinates: ${latitude},${longitude}\nGoogle Maps Location: ${gpsLocationUrl}`
      : '';

    const dateFormatted = formData.arrivalDate && formData.departureDate
      ? `${formData.arrivalDate} to ${formData.departureDate}`
      : formData.arrivalDate || formData.travelDate || "";

    const enquiryPayload: EnquiryData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      phoneNumber: formData.phone.trim(),
      tourPackage: formData.selectedTour,
      numberOfTravelers: total,
      travelDate: dateFormatted,
      pickupLocation: formData.pickupLocation.trim(),
      vehicle: selectedVehicle,
      vehicleSelection: selectedVehicle,
      gpsLocationUrl: gpsLocationUrl,
      specialRequirements: formData.message ? formData.message.trim() : "None",
      status: "Pending"
    };

    // Formulate pre-encoded WhatsApp message according to standard format:
    const messageTemplate = `Hello Hazi Tour and Transport,

I have a travel enquiry.

Customer Name: ${formData.fullName}
Email: ${formData.email}
Phone Number: ${formData.phone}
Interested Tour: ${formData.selectedTour}

Travelers Breakdown:
- Adults: ${adults}
- Children: ${children}
Total Travelers: ${total}

Selected Vehicle: ${selectedVehicle} (${vehiclePriceDetail})

Arrival Date: ${formData.arrivalDate}
Departure Date: ${formData.departureDate}
Pickup Location: ${formData.pickupLocation}${gpsInfoBlock}
Message: ${formData.message || "None"}

-------------------------------------
Estimated Price: ${priceText}
-------------------------------------

Thank you.`;

    const encodedMessage = encodeURIComponent(messageTemplate);
    const ownerNumber = "94752890560"; // Standardized owner number

    // Open WhatsApp Click to Chat
    const waUrl = `https://wa.me/${ownerNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp Click to Chat immediately to ensure popup blocker does not trigger
    setIsSubmitting(false);
    trackWhatsAppAndNavigate(waUrl, enquiryPayload);
    onClose();
  };

  const activeTour = TOUR_PACKAGES.find((t) => t.name === formData.selectedTour);
  const hasTourSelected = !!formData.selectedTour;
  const isCustomTour = formData.selectedTour === "Tailor-made Custom Itinerary";
  const pricePerPerson = activeTour ? parseInt(activeTour.price.replace(/[^0-9]/g, "")) || 0 : 0;
  const totalTravelers = adults + children;
  const totalBasePrice = pricePerPerson * totalTravelers;

  return (
    <div className="fixed inset-0 bg-forest/80 backdrop-blur-md z-[100] flex sm:items-center sm:justify-center sm:p-4 overflow-hidden pointer-events-auto">
      {/* Floating Close Button: Circular, Fixed at top-right corner, always visible while scrolling, with custom styling */}
      <button
        type="button"
        onClick={onClose}
        style={{ pointerEvents: 'auto', position: 'fixed', zIndex: 110 }}
        className="fixed top-4 right-4 sm:absolute sm:top-6 sm:right-6 bg-forest/90 hover:bg-gold text-offwhite hover:text-forest w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer z-[110] shadow-lg border border-white/10 touch-manipulation pointer-events-auto"
        aria-label="Close modal"
      >
        <X className="w-5 h-5 sm:w-4.5 sm:h-4.5" />
      </button>

      <div
        ref={modalContainerRef}
        className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-xl bg-offwhite rounded-none sm:rounded-3xl overflow-y-auto scroll-smooth shadow-2xl border-0 sm:border border-white/10 flex flex-col pointer-events-auto relative z-10"
      >
        
        {/* Banner header for Luxury Feel */}
        <div className="bg-forest px-6 py-8 sm:px-8 sm:py-10 text-center relative overflow-hidden shrink-0">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold/15 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gold/5 rounded-full blur-2xl" />

          <div className="flex justify-center mb-2">
            <Sparkles className="w-6 h-6 text-gold animate-pulse" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-offwhite leading-tight">
            Send Travel Enquiry
          </h3>
          <p className="text-offwhite/70 text-xs sm:text-sm font-light mt-1">
            Fill in your details and connect directly with our specialist over WhatsApp.
          </p>
        </div>

        {/* Enquiry Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4 pb-24 sm:pb-8 relative z-10 pointer-events-auto">
          
          {/* Row 1: Full Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
              Full Name <span className="text-terracotta">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Eleanor Vance"
              className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                errors.fullName ? "border-terracotta" : "border-gray-200"
              }`}
            />
            {errors.fullName && (
              <span className="text-xs text-terracotta flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Row 2: Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
                Email Address <span className="text-terracotta">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. eleanor@example.com"
                className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                  errors.email ? "border-terracotta" : "border-gray-200"
                }`}
              />
              {errors.email && (
                <span className="text-xs text-terracotta flex items-center mt-1">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
                Phone Number <span className="text-terracotta">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +44 7911 123456"
                className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                  errors.phone ? "border-terracotta" : "border-gray-200"
                }`}
              />
              {errors.phone && (
                <span className="text-xs text-terracotta flex items-center mt-1">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          {/* Row 3: Selected Tour */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
              Select Tour Package <span className="text-terracotta">*</span>
            </label>
            <select
              name="selectedTour"
              value={formData.selectedTour}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                errors.selectedTour ? "border-terracotta" : "border-gray-200"
              }`}
            >
              <option value="">-- Choose Your Dream Tour --</option>
              {TOUR_PACKAGES.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
              <option value="Tailor-made Custom Itinerary">Custom Itinerary (Fully Tailored)</option>
            </select>
            {errors.selectedTour && (
              <span className="text-xs text-terracotta flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.selectedTour}
              </span>
            )}
          </div>

          {/* Row 4: Travelers & Travel Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Traveler Counter Section */}
            <div className="space-y-3 bg-forest/[0.03] p-4 rounded-2xl border border-forest/10">
              <span className="block text-xs uppercase tracking-wider text-forest font-bold">
                No. of Travelers <span className="text-terracotta">*</span>
              </span>
              
              {/* Adults Counter */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-forest block">Adults</span>
                  <span className="text-[10px] text-gray-400 font-medium">Ages 12+</span>
                </div>
                <div className="flex items-center space-x-3 bg-white px-2 py-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleAdultChange(-1)}
                    disabled={adults <= 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-forest bg-forest/[0.04] hover:bg-gold hover:text-forest disabled:opacity-40 disabled:pointer-events-none transition-colors font-bold select-none cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-5 text-center text-forest select-none">{adults}</span>
                  <button
                    type="button"
                    onClick={() => handleAdultChange(1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-forest bg-forest/[0.04] hover:bg-gold hover:text-forest transition-colors font-bold select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children Counter */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-forest block">Children</span>
                  <span className="text-[10px] text-gray-400 font-medium">Ages 2-11</span>
                </div>
                <div className="flex items-center space-x-3 bg-white px-2 py-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleChildrenChange(-1)}
                    disabled={children <= 0}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-forest bg-forest/[0.04] hover:bg-gold hover:text-forest disabled:opacity-40 disabled:pointer-events-none transition-colors font-bold select-none cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-5 text-center text-forest select-none">{children}</span>
                  <button
                    type="button"
                    onClick={() => handleChildrenChange(1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-forest bg-forest/[0.04] hover:bg-gold hover:text-forest transition-colors font-bold select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Calculated Total Travelers Display */}
              <div className="text-right pt-2 border-t border-forest/10 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Total:</span>
                <span className="font-bold text-forest bg-gold/10 text-gold px-2.5 py-0.5 rounded-md">
                  {formData.travelers} {formData.travelers === 1 ? "Traveler" : "Travelers"}
                </span>
              </div>
            </div>

          {/* Arrival & Departure Dates Vertical Stack */}
          <div className="space-y-4">
            {/* Arrival Date */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
                Arrival Date <span className="text-terracotta">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="date"
                  name="arrivalDate"
                  min={getTodayDateString()}
                  value={formData.arrivalDate || ""}
                  placeholder="mm/dd/yyyy"
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                    errors.arrivalDate ? "border-terracotta" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.arrivalDate && (
                <span className="text-xs text-terracotta flex items-center mt-1">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                  {errors.arrivalDate}
                </span>
              )}
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
                Departure Date <span className="text-terracotta">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="date"
                  name="departureDate"
                  min={formData.arrivalDate || getTodayDateString()}
                  value={formData.departureDate || ""}
                  placeholder="mm/dd/yyyy"
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                    errors.departureDate ? "border-terracotta" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.departureDate && (
                <span className="text-xs text-terracotta flex items-center mt-1">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                  {errors.departureDate}
                </span>
              )}
            </div>
          </div>
          </div>

          {/* Vehicle Selection Section */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs uppercase tracking-wider text-forest font-bold">
              Vehicle Selection <span className="text-terracotta">*</span>
            </label>
            
            {/* Recommendation info / banner */}
            <div className="bg-forest/[0.04] border border-gold/30 rounded-xl p-3 flex items-center justify-between text-xs text-forest">
              <span className="flex items-center space-x-2 font-bold">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span>
                  {formData.travelers <= 3
                    ? "Recommended vehicle for your group: Three Wheel"
                    : formData.travelers === 4
                    ? "Recommended vehicle for your group: Car"
                    : "Van is recommended for groups larger than 4 travelers."}
                </span>
              </span>
              <span className="bg-forest text-gold px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider shrink-0 ml-2">
                {selectedVehicle}
              </span>
            </div>

            {/* 3 Vehicle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: Three Wheel */}
              <button
                type="button"
                disabled={formData.travelers > 3}
                onClick={() => {
                  setSelectedVehicle("Three Wheel");
                  if (errors.selectedVehicle) {
                    setErrors((prev) => ({ ...prev, selectedVehicle: "" }));
                  }
                }}
                className={`group relative text-left rounded-2xl border-2 transition-all flex flex-col justify-between h-full cursor-pointer overflow-hidden ${
                  formData.travelers > 3
                    ? "border-gray-100 bg-gray-50/50 opacity-40 cursor-not-allowed"
                    : selectedVehicle === "Three Wheel"
                    ? "border-gold bg-gold/5 shadow-md ring-1 ring-gold/50"
                    : "border-gray-200 bg-white hover:border-gold/40 hover:bg-gray-50/30"
                }`}
              >
                {/* Recommended Badge */}
                {formData.travelers <= 3 && (
                  <span className="absolute top-2 right-2 z-10 bg-gold text-forest font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                    ★ Best Choice
                  </span>
                )}
                
                <div className="w-full">
                  <div className="w-full h-28 sm:h-32 overflow-hidden bg-gray-100 relative">
                    <img
                      src="https://lh3.googleusercontent.com/d/1GT_bN9_ssUDiALa02TnMCIc_JBLkjr0u"
                      alt="Sri Lankan Three Wheel Tuk Tuk"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="block font-bold text-sm text-forest">Three Wheel</span>
                      <span className="text-sm">🚕</span>
                    </div>
                    <span className="block text-[10px] text-gray-400 font-medium leading-relaxed">
                      Recommended for 1-3 travelers
                    </span>
                  </div>
                </div>
              </button>

              {/* Card 2: Car */}
              <button
                type="button"
                disabled={formData.travelers > 4}
                onClick={() => {
                  setSelectedVehicle("Car");
                  if (errors.selectedVehicle) {
                    setErrors((prev) => ({ ...prev, selectedVehicle: "" }));
                  }
                }}
                className={`group relative text-left rounded-2xl border-2 transition-all flex flex-col justify-between h-full cursor-pointer overflow-hidden ${
                  formData.travelers > 4
                    ? "border-gray-100 bg-gray-50/50 opacity-40 cursor-not-allowed"
                    : selectedVehicle === "Car"
                    ? "border-gold bg-gold/5 shadow-md ring-1 ring-gold/50"
                    : "border-gray-200 bg-white hover:border-gold/40 hover:bg-gray-50/30"
                }`}
              >
                {/* Recommended Badge */}
                {formData.travelers <= 4 && (
                  <span className="absolute top-2 right-2 z-10 bg-gold text-forest font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                    ★ Recommended
                  </span>
                )}
                
                <div className="w-full">
                  <div className="w-full h-28 sm:h-32 overflow-hidden bg-gray-100 relative">
                    <img
                      src="https://lh3.googleusercontent.com/d/1x7phINQakH2d2Ddm_psYnKSLr0mn7xFW"
                      alt="Executive Luxury Tour Sedan Car"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="block font-bold text-sm text-forest">Car</span>
                      <span className="text-sm">🚗</span>
                    </div>
                    <span className="block text-[10px] text-gray-400 font-medium leading-relaxed">
                      Recommended for 1-4 travelers
                    </span>
                  </div>
                </div>
              </button>

              {/* Card 3: Van */}
              <button
                type="button"
                onClick={() => {
                  setSelectedVehicle("Van");
                  if (errors.selectedVehicle) {
                    setErrors((prev) => ({ ...prev, selectedVehicle: "" }));
                  }
                }}
                className={`group relative text-left rounded-2xl border-2 transition-all flex flex-col justify-between h-full cursor-pointer overflow-hidden ${
                  selectedVehicle === "Van"
                    ? "border-gold bg-gold/5 shadow-md ring-1 ring-gold/50"
                    : "border-gray-200 bg-white hover:border-gold/40 hover:bg-gray-50/30"
                }`}
              >
                {/* Recommended Badge */}
                {formData.travelers > 4 && (
                  <span className="absolute top-2 right-2 z-10 bg-gold text-forest font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                    ★ Recommended
                  </span>
                )}
                
                <div className="w-full">
                  <div className="w-full h-28 sm:h-32 overflow-hidden bg-gray-100 relative">
                    <img
                      src="https://lh3.googleusercontent.com/d/1Ho_CgtkgN2PyIy8cbMnPlOTvmdcp3B6P"
                      alt="Tourist Passenger Van"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="block font-bold text-sm text-forest">KDH van</span>
                      <span className="text-sm">🚐</span>
                    </div>
                    <span className="block text-[10px] text-gray-400 font-medium leading-relaxed">
                      Recommended for 5-12 travelers
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Custom selection error display */}
            {errors.selectedVehicle && (
              <span className="text-xs text-terracotta flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.selectedVehicle}
              </span>
            )}
          </div>

          {/* Row 5: Pickup Location with GPS support */}
          <div id="hazi_tours_gps_pickup_location_system" className="space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
                Pickup Location <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                placeholder="Enter hotel, airport, villa, or location"
                className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                  errors.pickupLocation ? "border-terracotta" : "border-gray-200"
                }`}
              />
              {errors.pickupLocation && (
                <span className="text-xs text-terracotta flex items-center mt-1">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.pickupLocation}
                </span>
              )}
            </div>

            {/* GPS Location Trigger */}
            <div className="flex flex-col items-start pt-1">
              <button
                type="button"
                disabled={gpsStatus === 'detecting'}
                onClick={handleGetLocation}
                className="inline-flex items-center space-x-2 bg-forest text-offwhite border border-forest hover:bg-gold hover:text-forest hover:border-gold px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm hover:shadow active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {gpsStatus === 'detecting' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-offwhite border-t-transparent rounded-full animate-spin shrink-0"></span>
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <span>📍 Use My Current Location</span>
                )}
              </button>

              {/* Geolocation Success Card */}
              {gpsStatus === 'success' && latitude !== null && longitude !== null && (
                <div className="w-full bg-forest/[0.02] border border-gold/30 rounded-2xl p-4 space-y-3 mt-3 animate-fade-in text-left">
                  <div className="flex items-center space-x-2 text-forest font-bold text-xs">
                    <span className="text-emerald-600 font-extrabold text-sm">✓</span>
                    <span>Location detected successfully</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs">
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Pickup Location</span>
                      <span className="font-bold text-forest">Current Location Detected</span>
                    </div>
                    
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs">
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">GPS Coordinates</span>
                      <div className="space-y-0.5 text-forest font-medium">
                        <div><span className="text-gray-400 font-normal">Latitude:</span> {latitude}</div>
                        <div><span className="text-gray-400 font-normal">Longitude:</span> {longitude}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-xs shadow-xs">
                    <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Google Maps Location</span>
                    <a 
                      href={`https://maps.google.com/?q=${latitude},${longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gold font-bold hover:underline break-all flex items-center space-x-1"
                    >
                      <span>https://maps.google.com/?q={latitude},{longitude}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Geolocation Error Card */}
              {gpsStatus === 'error' && gpsError && (
                <div className="w-full bg-terracotta/5 border border-terracotta/20 rounded-xl p-3.5 space-y-2 mt-3 text-xs text-terracotta text-left">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-terracotta" />
                    <span className="font-medium">{gpsError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="bg-terracotta/10 hover:bg-terracotta/20 text-terracotta font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px]"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Row 6: Special Requirements Message */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
              Special Requirements / Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              placeholder="Tell us about special requests (e.g. luxury options, hotel standards, dietary needs)..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all resize-none"
            />
          </div>

          {/* Tour Price Summary Section */}
          <div className="bg-forest/[0.03] border border-gold/30 rounded-2xl p-5 space-y-3 mt-2">
            <div className="flex items-center justify-between border-b border-gold/10 pb-2">
              <span className="text-xs uppercase tracking-wider text-forest font-bold flex items-center">
                Tour Price Summary
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                USD ($)
              </span>
            </div>

            {!hasTourSelected ? (
              <p className="text-xs text-gray-500 italic text-center py-2">
                Please select a tour package above to proceed with enquiry.
              </p>
            ) : (
              <div className="space-y-1">
                <span className="block font-serif text-base font-bold text-forest">
                  {formData.selectedTour}
                </span>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your tour price is tailored to your personalized choices and group size. No upfront fee — our specialist will provide a free custom quote over WhatsApp!
                </p>
                <div className="pt-2 flex justify-between items-center border-t border-forest/10 mt-2">
                  <span className="text-xs text-gray-400 font-medium">Pricing:</span>
                  <span className="text-sm font-bold text-gold uppercase tracking-wider">Custom Quote on Request</span>
                </div>
              </div>
            )}
          </div>

          {/* Submission Button: Direct to WhatsApp */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 999 }}
            className="w-full cursor-pointer bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center space-x-2 mt-4 touch-manipulation relative z-[999]"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <MessageSquare className="w-5 h-5 fill-white text-[#25D366]" />
                <span>Send Enquiry on WhatsApp</span>
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-gray-400 font-medium mt-2">
            No credit card required. Clicking redirects instantly to official WhatsApp Web/App.
          </p>

        </form>
      </div>
    </div>
  );
}
