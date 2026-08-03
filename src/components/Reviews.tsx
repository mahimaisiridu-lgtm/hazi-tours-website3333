import React, { useState, useEffect, useRef } from "react";
import { Review } from "../types";
import { SEED_REVIEWS } from "../firebase";
import { TOUR_PACKAGES } from "../data";
import { COUNTRIES } from "../data/countries";
import { Star, MessageSquareCode, Plus, Globe, X, CheckCircle, Sparkles, AlertCircle, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbziUSZ2wZud7mAm9VPY5s6S1GcxD3cGvBVJw9Utit5kh5eIKWpjNRX5Gm6IzOidBFPC/exec";


export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Mobile Carousel states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [country, setCountry] = useState("");
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const countryContainerRef = useRef<HTMLDivElement>(null);
  const [tourName, setTourName] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter countries for autocomplete
  const countryQuery = country.trim().toLowerCase();
  const filteredCountries = countryQuery
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(countryQuery)).sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(countryQuery);
        const bStarts = b.toLowerCase().startsWith(countryQuery);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      })
    : [];

  // Close country suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryContainerRef.current && !countryContainerRef.current.contains(e.target as Node)) {
        setShowCountrySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFormOpen]);

  // Mobile carousel auto-slide effect
  useEffect(() => {
    if (reviews.length === 0 || isInteracting) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (reviews.length === 0) return 0;
        return (prev + 1) % reviews.length;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [reviews.length, isInteracting]);

  // Clean up interaction timeout on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || startX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    setStartX(null);

    const threshold = 50; // swipe threshold in pixels
    if (dragOffset < -threshold) {
      // Swipe left -> next slide
      setCurrentIndex((prev) => (reviews.length > 0 ? (prev + 1) % reviews.length : 0));
    } else if (dragOffset > threshold) {
      // Swipe right -> prev slide
      setCurrentIndex((prev) => (reviews.length > 0 ? (prev - 1 + reviews.length) % reviews.length : 0));
    }

    setDragOffset(0);

    // Resume auto-sliding after 3 seconds of inactivity
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  };

  const fetchReviews = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      let data = null;
      let response = null;

      // 1. Try local Express proxy server first
      try {
        response = await fetch("/api/reviews");
        if (response.ok) {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const json = await response.json();
            if (json) {
              data = json;
            }
          }
        } else {
          console.warn(`Proxy returned status ${response.status}, will attempt direct fetch.`);
        }
      } catch (proxyErr) {
        console.warn("Express server proxy unavailable, falling back to direct browser-to-sheet fetch:", proxyErr);
      }

      // 2. Fallback: Fetch directly from Google Apps Script if proxy failed or is not hosted
      if (!data) {
        response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "GET"
        });

        if (!response.ok) {
          throw new Error(`Google Sheets API responded with status ${response.status}`);
        }

        const text = await response.text();
        
        // Check for common permission HTML redirects
        if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
          throw new Error("Google Apps Script returned an HTML page instead of JSON. Please verify that you have deployed the Web App as 'Execute as: Me' and 'Who has access: Anyone'.");
        }

        try {
          data = JSON.parse(text);
        } catch (jsonErr) {
          throw new Error("Failed to parse response from Google Sheets. Ensure your Apps Script returns valid JSON.");
        }
      }

      let rawReviewsList = [];
      if (data && data.isDemo) {
        setFetchError(data.message);
        rawReviewsList = data.reviews || [];
      } else if (Array.isArray(data)) {
        rawReviewsList = data;
      } else if (data && Array.isArray(data.reviews)) {
        rawReviewsList = data.reviews;
      } else if (data && data.status === "error") {
        throw new Error(data.message || "Error response from Google Apps Script Web App");
      } else {
        throw new Error("Invalid reviews data structure received.");
      }
      
      // Filter only approved reviews (case-insensitive status check)
      const approved = rawReviewsList
        .filter((item: any) => {
          const status = item.status || item.Status;
          return status && status.toString().trim().toLowerCase() === "approved";
        })
        .map((item: any, index: number) => {
          // Map the Google Sheet columns cleanly and fallback to beautiful default values
          const nameVal = item.name || item.customerName || item.CustomerName || "Anonymous Guest";
          const ratingVal = Number(item.rating || item.Rating || 5);
          const messageVal = item.review || item.message || item.Message || "";
          const dateVal = item.date || item.travelDate || item.TravelDate || "Recently";
          const countryVal = item.country || item.Country || "Global Traveler";
          const tourVal = item.tourName || item.tour || item.Tour || "Sri Lanka Tour Package";
          const imgVal = item.profileImage || item.profilePhoto || item.ProfileImage || "";

          const fallbackImage = imgVal.trim()
            ? imgVal
            : [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=600&q=80"
              ][index % 5];

          return {
            id: item.id || `gas-${index}-${Date.now()}`,
            customerName: nameVal,
            country: countryVal,
            tourName: tourVal,
            travelDate: dateVal,
            rating: ratingVal,
            message: messageVal,
            profileImage: fallbackImage,
            createdAt: item.createdAt || dateVal || new Date().toISOString()
          } as Review;
        });

      setReviews(approved);
    } catch (e: any) {
      console.error(e);
      setFetchError(e.message || "Could not retrieve reviews at this time.");
      // Fallback to offline premium SEED_REVIEWS so site is never empty or broken!
      setReviews(SEED_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customerName.trim()) errors.customerName = "Name is required";
    if (!customerEmail.trim()) {
      errors.customerEmail = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      errors.customerEmail = "Please enter a valid email address";
    }
    if (!country.trim()) errors.country = "Country is required";
    if (!tourName) errors.tourName = "Please select the tour you experienced";
    if (!travelDate.trim()) errors.travelDate = "Please provide travel month/year (e.g. Sept 2025)";
    if (!message.trim() || message.length < 15) {
      errors.message = "Review message must be at least 15 characters long";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    
    // Choose a default nice random profile silhouette avatar if none provided
    const fallbackImage = profileImage.trim() 
      ? profileImage 
      : [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=600&q=80"
        ][Math.floor(Math.random() * 5)];

    const payload = {
      name: customerName.trim(),
      rating,
      review: message.trim(),
      date: travelDate.trim(),
      status: "Pending",
      // Include optional fields for sheets that support them
      country: country.trim(),
      tourName,
      profileImage: fallbackImage
    };

    try {
      let success = false;
      let response = null;

      // 1. Try local Express proxy server first
      try {
        response = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const result = await response.json();
            if (result && result.status === "success") {
              success = true;
            } else if (result && result.status === "error") {
              throw new Error(result.message);
            }
          }
        }
      } catch (proxyError: any) {
        console.warn("Express server proxy post failed, attempting direct sheet POST:", proxyError);
        if (proxyError.message && !proxyError.message.includes("fetch")) {
          throw proxyError; // Propagate validation/server errors
        }
      }

      // 2. Fallback: Submit directly to Google Apps Script Web App
      if (!success) {
        // IMPORTANT: We use text/plain to bypass CORS preflight OPTIONS check in browsers
        response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Google Apps Script API responded with status ${response.status}`);
        }

        const text = await response.text();
        
        // Handle common HTML redirects/error pages from Google Accounts permissions
        if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
          throw new Error("Google Apps Script returned an HTML page instead of JSON. Ensure you deployed the script with 'Execute as: Me' and 'Who has access: Anyone'.");
        }

        let result;
        try {
          result = JSON.parse(text);
        } catch {
          result = { status: "success" }; // Standard success fallback if non-JSON status text returned
        }

        if (result.status === "error") {
          throw new Error(result.message || "Submission was rejected by Google Sheets.");
        }
      }

      // Trigger EmailJS notifications
      try {
        const emailJSParams = {
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          rating: rating.toString(),
          review: message.trim()
        };

        const [res1, res2] = await Promise.all([
          fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              service_id: "service_gc418ch",
              template_id: "template_0vg0agd",
              user_id: "UxDTUbo1xpBHho_Xp",
              template_params: emailJSParams
            })
          }),
          fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              service_id: "service_gc418ch",
              template_id: "template_2ex1zo6",
              user_id: "UxDTUbo1xpBHho_Xp",
              template_params: emailJSParams
            })
          })
        ]);

        if (!res1.ok) {
          const errText1 = await res1.text();
          console.warn("EmailJS customer confirmation failed:", errText1);
        }
        if (!res2.ok) {
          const errText2 = await res2.text();
          console.warn("EmailJS owner notification failed:", errText2);
        }
      } catch (emailErr) {
        console.error("Error sending EmailJS notifications:", emailErr);
      }

      // Success triggers
      setSubmitSuccess(true);
      
      // Reset form
      setCustomerName("");
      setCustomerEmail("");
      setCountry("");
      setTourName("");
      setTravelDate("");
      setRating(5);
      setMessage("");
      setProfileImage("");
      setFormErrors({});

      setTimeout(() => {
        setIsFormOpen(false);
        setSubmitSuccess(false);
        // Refresh the reviews list to show approved reviews if any (since this is pending, it won't show yet, but it keeps list fresh)
        fetchReviews();
      }, 3500);

    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <section id="reviews" className="py-24 bg-white relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-forest/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pointer-events-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6 relative z-10 pointer-events-auto">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">Client Verdicts</span>
              <span className="text-gray-300">•</span>
              <span id="live-reviews-badge" className="inline-flex items-center space-x-1 bg-gold/10 text-gold px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider transition-all duration-300">
                <span>⭐ {reviews.length} Customer Reviews</span>
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest mt-1">
              Testimonials of Serenity
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-xl font-normal">
              Read real stories from our global guests who embarked on private custom journeys with Hazi Tour and Transport.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="self-start md:self-end bg-forest hover:bg-gold text-offwhite hover:text-forest px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md active:scale-95 flex items-center space-x-2 shrink-0 cursor-pointer relative z-20 pointer-events-auto touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Error State with Apps Script Permission Guide */}
        {fetchError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl mb-10 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-amber-900">Google Sheets Connection Notice</p>
                <p className="text-xs mt-1 leading-relaxed text-amber-800">{fetchError}</p>
                
                {fetchError.includes("permissions") || fetchError.includes("HTML") || fetchError.includes("403") ? (
                  <div className="mt-4 bg-white/60 p-4 rounded-xl border border-amber-200/50 text-xs text-amber-900 space-y-2">
                    <p className="font-bold">🛠️ How to configure Google Apps Script permissions:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-1 text-amber-800">
                      <li>Open your Google Apps Script project editor.</li>
                      <li>Click the <strong className="text-amber-900">Deploy</strong> button (top right) &gt; <strong className="text-amber-900">Manage deployments</strong>.</li>
                      <li>Select your Web App active deployment or click <strong className="text-amber-900">New deployment</strong>.</li>
                      <li>Set <strong>Execute as:</strong> <strong className="text-amber-900">Me (your-email@gmail.com)</strong>.</li>
                      <li>Set <strong>Who has access:</strong> <strong className="text-amber-900">Anyone</strong> (this is critical so the server can fetch reviews).</li>
                      <li>Click <strong className="text-amber-900">Deploy</strong> (and complete <strong>Authorize access</strong> if prompted).</li>
                    </ol>
                    <p className="mt-2 text-[10px] opacity-75 font-mono">
                      *Note: Beautiful premium offline testimonials have been loaded below automatically so your site is never broken!
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-offwhite rounded-3xl border border-gray-100 p-8 max-w-xl mx-auto shadow-sm">
            <MessageSquareCode className="w-12 h-12 text-gold/40 mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-forest">No Approved Reviews Yet</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto font-light">
              Be the first to share your beautiful Sri Lankan travel story! Your feedback helps us maintain our premium service standard.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-6 inline-flex bg-forest hover:bg-gold text-offwhite hover:text-forest px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
            >
              Write a Review
            </button>
          </div>
        ) : (
          /* Public Review layout. Responsive grid + Mobile Swipe carousel overflow */
          <div className="w-full relative z-10">
            {/* Native Mobile Swipe Carousel (Automatic Live Carousel with Smooth TranslateX) */}
            <div 
              className="md:hidden overflow-hidden pb-6 relative z-20 pointer-events-auto w-full select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(7.5vw - ${currentIndex} * 85vw - ${currentIndex * 20}px + ${dragOffset}px))`,
                  width: `${reviews.length * 85}vw`
                }}
              >
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="shrink-0 w-[85vw] bg-offwhite p-6 rounded-2xl border border-gray-100 flex flex-col justify-between relative z-30 pointer-events-auto mr-5"
                  >
                    <div>
                      <Quote className="w-8 h-8 text-gold/30 mb-2" />
                      
                      {/* Stars */}
                      <div className="flex items-center space-x-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "text-gold fill-gold" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-gray-600 text-xs sm:text-sm italic leading-relaxed mb-4 line-clamp-5">
                        "{rev.message}"
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200/50">
                      <img
                        src={rev.profileImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"}
                        alt={rev.customerName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-gold/20"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-forest text-sm">{rev.customerName}</h4>
                        <div className="flex items-center space-x-1.5 text-[9px] text-gray-400 font-medium">
                          <Globe className="w-3 h-3 text-gold" />
                          <span>{rev.country}</span>
                          <span>•</span>
                          <span>{rev.tourName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots/Indicators for slide position */}
              <div className="flex justify-center space-x-1.5 mt-4">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsInteracting(true);
                      if (interactionTimeoutRef.current) {
                        clearTimeout(interactionTimeoutRef.current);
                      }
                      interactionTimeoutRef.current = setTimeout(() => {
                        setIsInteracting(false);
                      }, 4000);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-6 bg-gold" : "w-1.5 bg-gray-200"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Tablet (2 cols) & Desktop (3 cols) Layout */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {reviews.slice(0, visibleCount).map((rev, index) => (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.08 }}
                    className="bg-offwhite p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gold/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Quote className="w-10 h-10 text-gold/25" />
                        
                        {/* Stars */}
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating ? "text-gold fill-gold" : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm italic leading-relaxed mb-6 font-normal">
                        "{rev.message}"
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 pt-5 border-t border-gray-200/50">
                      <img
                        src={rev.profileImage}
                        alt={rev.customerName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-gold/10"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-forest text-base leading-tight">
                          {rev.customerName}
                        </h4>
                        <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-medium mt-1">
                          <Globe className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span className="truncate max-w-[80px]">{rev.country}</span>
                          <span>•</span>
                          <span className="truncate max-w-[120px]" title={rev.tourName}>
                            {rev.tourName}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{rev.travelDate}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* See More Reviews Button */}
            {visibleCount < reviews.length && (
              <div className="flex justify-center mt-12">
                <button
                  id="see-more-reviews-btn"
                  onClick={handleSeeMore}
                  className="bg-transparent hover:bg-forest border-2 border-forest hover:border-forest text-forest hover:text-offwhite px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md active:scale-95 cursor-pointer flex items-center space-x-2"
                >
                  <span>See More Reviews</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Review Submission Form Modal Backdrop */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-forest/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden pointer-events-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg bg-offwhite rounded-3xl overflow-hidden shadow-2xl border border-white/10 my-auto pointer-events-auto max-h-[85vh] md:max-h-[90vh] flex flex-col"
              >
              
              {/* Submission Success Screen */}
              {submitSuccess ? (
                <div className="p-10 text-center flex flex-col items-center justify-center min-h-[400px] relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setSubmitSuccess(false);
                    }}
                    className="absolute top-4 right-4 bg-gray-100 hover:bg-gold text-gray-500 hover:text-forest w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-16 h-16 rounded-full bg-forest flex items-center justify-center text-gold mb-6 shadow-xl animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <Sparkles className="w-5 h-5 text-gold animate-pulse mb-2" />
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                    Review Submitted!
                  </h3>
                  <p className="text-gray-600 text-sm mt-3 max-w-xs font-light">
                    Thank you for sharing your travel experience with Hazi Tour and Transport. Your feedback has been saved!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setSubmitSuccess(false);
                    }}
                    className="mt-8 bg-forest hover:bg-gold text-offwhite hover:text-forest font-bold px-6 py-2.5 rounded-xl uppercase tracking-widest text-xs transition-all duration-300 shadow-md cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* The Actual Submission Form */
                <form onSubmit={handleReviewSubmit} className="p-6 md:p-6 space-y-4 md:space-y-3 overflow-y-auto flex-1 [overscroll-behavior:contain] [webkit-overflow-scrolling:touch]">
                  <div className="sticky -top-6 bg-offwhite z-10 -mx-6 px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between mb-4 md:mb-3">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                        Share Your Sri Lanka Adventure
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5 font-light">
                        Help future travelers choose their perfect private itinerary.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="bg-gray-100 hover:bg-gold text-gray-500 hover:text-forest w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ml-4"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start space-x-2 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Submission failed</p>
                        <p className="opacity-90">{submitError}</p>
                      </div>
                    </div>
                  )}

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1 md:mb-0.5">
                      Your Full Name <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className={`w-full px-4 py-2.5 md:py-2 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                        formErrors.customerName ? "border-terracotta" : "border-gray-200"
                      }`}
                    />
                    {formErrors.customerName && (
                      <span className="text-xs text-terracotta flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {formErrors.customerName}
                      </span>
                    )}
                  </div>

                  {/* Customer Email */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1 md:mb-0.5">
                      Your Email Address <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. eleanor@example.com"
                      className={`w-full px-4 py-2.5 md:py-2 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                        formErrors.customerEmail ? "border-terracotta" : "border-gray-200"
                      }`}
                    />
                    {formErrors.customerEmail && (
                      <span className="text-xs text-terracotta flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {formErrors.customerEmail}
                      </span>
                    )}
                  </div>

                  {/* Country & Month of travel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-3">
                    <div className="relative" ref={countryContainerRef}>
                      <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1 md:mb-0.5">
                        Country <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          setShowCountrySuggestions(true);
                        }}
                        onFocus={() => {
                          if (country.trim().length > 0) {
                            setShowCountrySuggestions(true);
                          }
                        }}
                        placeholder="e.g. United Kingdom"
                        autoComplete="off"
                        className={`w-full px-4 py-2.5 md:py-2 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                          formErrors.country ? "border-terracotta" : "border-gray-200"
                        }`}
                      />
                      {showCountrySuggestions && filteredCountries.length > 0 && (
                        <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 text-sm">
                          {filteredCountries.map((c) => (
                            <li
                              key={c}
                              onClick={() => {
                                setCountry(c);
                                setShowCountrySuggestions(false);
                              }}
                              className={`px-4 py-2.5 hover:bg-gold/15 hover:text-forest cursor-pointer transition-colors flex items-center justify-between text-xs font-medium ${
                                country.trim().toLowerCase() === c.toLowerCase()
                                  ? "bg-gold/10 text-forest font-bold"
                                  : "text-gray-700"
                              }`}
                            >
                              <span>{c}</span>
                              {country.trim().toLowerCase() === c.toLowerCase() && (
                                <span className="text-gold font-bold">✓</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      {formErrors.country && (
                        <span className="text-xs text-terracotta flex items-center mt-1">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          {formErrors.country}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1 md:mb-0.5">
                        Travel Date <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        placeholder="e.g. September 2025"
                        className={`w-full px-4 py-2.5 md:py-2 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                          formErrors.travelDate ? "border-terracotta" : "border-gray-200"
                        }`}
                      />
                      {formErrors.travelDate && (
                        <span className="text-xs text-terracotta flex items-center mt-1">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          {formErrors.travelDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tour Experienced & Rating */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1 md:mb-0.5">
                        Experienced Tour <span className="text-terracotta">*</span>
                      </label>
                      <select
                        value={tourName}
                        onChange={(e) => setTourName(e.target.value)}
                        className={`w-full px-4 py-2.5 md:py-2 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                          formErrors.tourName ? "border-terracotta" : "border-gray-200"
                        }`}
                      >
                        <option value="">-- Select Tour --</option>
                        {TOUR_PACKAGES.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                        <option value="Bespoke Tailor-made Route">Custom Tailor-made Route</option>
                        <option value="Private Airport Transport">Private Chauffeur Transport</option>
                      </select>
                      {formErrors.tourName && (
                        <span className="text-xs text-terracotta flex items-center mt-1">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          {formErrors.tourName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1.5 md:mb-1">
                        Your Rating <span className="text-terracotta">*</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setRating(i + 1)}
                            className="focus:outline-none transition-transform active:scale-125"
                          >
                            <Star
                              className={`w-7 h-7 md:w-6 md:h-6 cursor-pointer ${
                                i < rating ? "text-gold fill-gold" : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Profile Image url (Optional) */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1 md:mb-0.5">
                      Profile Photo URL <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="e.g. https://drive.google.com/file/d/..."
                      className="w-full px-4 py-2.5 md:py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1 md:mb-0.5">
                      Your Experience Message <span className="text-terracotta">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Share your honest thoughts about our service quality, safety, vehicles, driver responsiveness, etc..."
                      className={`w-full px-4 py-2.5 md:py-2 rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all resize-none md:h-20 ${
                        formErrors.message ? "border-terracotta" : "border-gray-200"
                      }`}
                    />
                    {formErrors.message && (
                      <span className="text-xs text-terracotta flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {formErrors.message}
                      </span>
                    )}
                  </div>

                  {/* Submission triggers */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-forest hover:bg-gold text-offwhite hover:text-forest font-bold py-4 md:py-3 rounded-xl uppercase tracking-widest text-xs transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer mt-4 md:mt-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                </form>
              )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
