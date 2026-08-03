import React, { useState, useEffect } from "react";
import { MessageSquare, Compass, X, Sparkles, MapPin, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExitIntentModalProps {
  onViewTours?: () => void;
}

export default function ExitIntentModal({ onViewTours }: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);

  useEffect(() => {
    // Check if user already dismissed it during this session
    const dismissed = sessionStorage.getItem("hazi_exit_intent_dismissed");
    if (dismissed) {
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves out of top of browser viewport
      if (e.clientY <= 5 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    // Optional desktop fallback timer (e.g., if user stays idle for 45s without leaving)
    const idleTimer = setTimeout(() => {
      if (!hasTriggered && !sessionStorage.getItem("hazi_exit_intent_dismissed")) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    }, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(idleTimer);
    };
  }, [hasTriggered]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hazi_exit_intent_dismissed", "true");
  };

  const handleWhatsApp = () => {
    handleClose();
    window.open(
      "https://wa.me/94752890560?text=Hello%20Hazi%20Tours!%20I%20am%20looking%20for%20help%20planning%20my%20trip%20to%20Sri%20Lanka.",
      "_blank"
    );
  };

  const handleViewToursClick = () => {
    handleClose();
    if (onViewTours) {
      onViewTours();
    } else {
      const toursSection = document.getElementById("tours");
      if (toursSection) {
        toursSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold/30 z-10 my-auto"
          >
            {/* Top Decorative Banner */}
            <div className="bg-forest text-offwhite p-6 sm:p-8 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gold/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-offwhite hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center space-x-1.5 bg-gold/20 border border-gold/40 px-3.5 py-1 rounded-full mb-3 text-gold text-[11px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wait, Before You Go!</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                Need help planning your trip?
              </h3>
              <p className="text-white/80 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                Let our local Sri Lanka travel experts craft a bespoke itinerary tailored perfectly to your schedule & budget.
              </p>
            </div>

            {/* Modal Body & Buttons */}
            <div className="p-6 sm:p-8 bg-white text-center space-y-6">
              <div className="grid grid-cols-2 gap-3 text-left bg-offwhite p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-2 text-xs text-forest font-semibold">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span>Custom Routes</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-forest font-semibold">
                  <HeartHandshake className="w-4 h-4 text-gold shrink-0" />
                  <span>100% Private Transfers</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>WhatsApp Now</span>
                </button>

                <button
                  onClick={handleViewToursClick}
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-forest hover:bg-gold hover:text-forest text-offwhite font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>View Tours</span>
                </button>
              </div>

              <button
                onClick={handleClose}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest font-semibold cursor-pointer underline"
              >
                No thanks, I'll explore on my own
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
