import React, { useState, useEffect, useRef } from "react";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tours from "./components/Tours";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Trust from "./components/Trust";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import EnquiryModal from "./components/EnquiryModal";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ExitIntentModal from "./components/ExitIntentModal";
import DedicatedGallery from "./components/DedicatedGallery";
import EventsPage from "./components/EventsPage";
import EventGalleryPage from "./components/EventGalleryPage";
import SEOHead from "./components/SEOHead";
import { SRI_LANKA_EVENTS } from "./data/events";
import { motion, AnimatePresence } from "motion/react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

function AppMain() {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedTourForEnquiry, setSelectedTourForEnquiry] = useState<string>("");
  const [currentView, setCurrentView] = useState<"home" | "gallery" | "events" | "event-gallery" | "tours">("home");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [activeTourFilter, setActiveTourFilter] = useState<string>("All Tours");

  const hasVisitedHome = useRef(false);

  // Mark if we've visited home in this session
  if (currentView === "home") {
    hasVisitedHome.current = true;
  }

  // Initial State setup based on URL query param or route path
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    const pathname = window.location.pathname;

    const isEventsGalleryPath = pathname.includes("/events/") && pathname.endsWith("/gallery");
    const isEventsPath = pathname === "/events" || pathname.endsWith("/events");
    const isToursPath = pathname === "/tours" || pathname.endsWith("/tours");

    let initialView: "home" | "gallery" | "events" | "event-gallery" | "tours" = "home";
    let eventIdFromPath = "";

    if (viewParam === "event-gallery") {
      initialView = "event-gallery";
      eventIdFromPath = params.get("eventId") || "";
    } else if (isEventsGalleryPath) {
      initialView = "event-gallery";
      const match = pathname.match(/\/events\/([^/]+)\/gallery/);
      if (match) {
        const slug = match[1];
        const found = SRI_LANKA_EVENTS.find((e) => {
          const derived = e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return derived === slug;
        });
        if (found) {
          eventIdFromPath = found.id;
        }
      }
    } else if (viewParam === "gallery") {
      initialView = "gallery";
    } else if (viewParam === "events" || isEventsPath) {
      initialView = "events";
    } else if (viewParam === "tours" || isToursPath) {
      initialView = "tours";
    }

    setCurrentView(initialView);
    if (eventIdFromPath) {
      setSelectedEventId(eventIdFromPath);
    }

    const search = initialView === "gallery"
      ? "?view=gallery"
      : initialView === "event-gallery"
        ? `?view=event-gallery&eventId=${eventIdFromPath}`
        : initialView === "events"
          ? "?view=events"
          : initialView === "tours"
            ? "?view=tours"
            : "";

    const path = initialView === "event-gallery"
      ? (() => {
          const found = SRI_LANKA_EVENTS.find((e) => e.id === eventIdFromPath);
          const slug = found ? found.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "event";
          return `/events/${slug}/gallery`;
        })()
      : initialView === "events"
        ? "/events"
        : initialView === "tours"
          ? "/tours"
          : "/";

    window.history.replaceState({ view: initialView, eventId: eventIdFromPath, modalOpen: false }, "", path + search);
  }, []);

  // Sync state with Popstate
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        setIsEnquiryOpen(!!state.modalOpen);
        if (state.view) {
          setCurrentView(state.view);
          if (state.eventId) {
            setSelectedEventId(state.eventId);
          }
        }
      } else {
        setCurrentView("home");
        setIsEnquiryOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateToView = (view: "home" | "gallery" | "events" | "tours") => {
    setCurrentView(view);
    const search = view === "gallery" ? "?view=gallery" : view === "events" ? "?view=events" : view === "tours" ? "?view=tours" : "";
    const path = view === "events" ? "/events" : view === "tours" ? "/tours" : "/";
    window.history.pushState({ view, eventId: "", modalOpen: false }, "", path + search);
  };

  const navigateToEventGallery = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView("event-gallery");

    const found = SRI_LANKA_EVENTS.find((e) => e.id === eventId);
    const slug = found ? found.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "event";
    const path = `/events/${slug}/gallery`;
    const search = `?view=event-gallery&eventId=${eventId}`;

    window.history.pushState({ view: "event-gallery", eventId, modalOpen: false }, "", path + search);
  };

  const handleOpenEnquiry = (tourName?: string) => {
    setSelectedTourForEnquiry(tourName || "");
    setIsEnquiryOpen(true);
    window.history.pushState({ view: currentView, eventId: selectedEventId, modalOpen: true }, "", window.location.search || window.location.pathname);
  };

  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false);
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  const handleBackFromGallery = () => {
    if (hasVisitedHome.current) {
      window.history.back();
    } else {
      setCurrentView("home");
      window.history.pushState({ view: "home", eventId: "", modalOpen: false }, "", "/");
    }
  };

  const handleBackFromTours = () => {
    if (hasVisitedHome.current) {
      window.history.back();
    } else {
      setCurrentView("home");
      window.history.pushState({ view: "home", eventId: "", modalOpen: false }, "", "/");
    }
  };

  const handleBackFromEvents = () => {
    if (hasVisitedHome.current) {
      window.history.back();
    } else {
      setCurrentView("home");
      window.history.pushState({ view: "home", eventId: "", modalOpen: false }, "", "/");
    }
  };

  const handleBackFromEventGallery = () => {
    if (hasVisitedHome.current) {
      window.history.back();
    } else {
      setCurrentView("events");
      window.history.pushState({ view: "events", eventId: "", modalOpen: false }, "", "/events?view=events");
    }
  };

  const handleScrollToSection = (id: string) => {
    if (currentView !== "home") {
      navigateToView("home");
      // Give a tiny timeout for state change rendering before scrolling
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
       const App = () => {
        const PAYMENT_PENDING = true;
  if (PAYMENT_PENDING) {
    return <MaintenancePopup />;
  }

  return (
    <div className="min-h-screen bg-offwhite text-dark font-sans selection:bg-gold/30 selection:text-forest">
           
      <SEOHead
        currentView={currentView}
        eventTitle={SRI_LANKA_EVENTS.find((e) => e.id === selectedEventId)?.title}
      />
      {isLoading && <SplashScreen onComplete={() => setIsLoading(false)} />}

      <AnimatePresence mode="wait">
        {currentView === "home" ? (
          <motion.div
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. Fixed Premium Navigation */}
            <Navbar
              onOpenEnquiry={handleOpenEnquiry}
              onScrollToSection={handleScrollToSection}
              onEventsClick={() => navigateToView("events")}
            />

            {/* 2. Panoramic Hero Screen */}
            <Hero
              onOpenEnquiry={() => handleOpenEnquiry()}
              onScrollToTours={() => handleScrollToSection("tours")}
            />

            {/* 3. Detailed Tour Packages */}
            <Tours 
              onOpenEnquiry={handleOpenEnquiry} 
              onSeeMore={() => navigateToView("tours")} 
              activeFilter={activeTourFilter}
              onChangeFilter={setActiveTourFilter}
            />

            {/* 4. Brand Storytelling */}
            <About />

            {/* 5. Destination Chronicles (Gallery) */}
            <Gallery onSeeMoreClick={() => navigateToView("gallery")} />

            {/* 6. Happy Travelers Trust Metrics */}
            <Trust />

            {/* 7. Live Customer Testimonials */}
            <Reviews />

            {/* 8. Frequently Asked Questions */}
            <FAQ onOpenEnquiry={handleOpenEnquiry} />

            {/* 9. Contact Center & WhatsApp Dispatch */}
            <Contact />

            {/* 9. Footnote Copyright */}
            <Footer onScrollToSection={handleScrollToSection} />
          </motion.div>
        ) : currentView === "gallery" ? (
          <motion.div
            key="gallery-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <DedicatedGallery onBack={handleBackFromGallery} />
          </motion.div>
        ) : currentView === "event-gallery" ? (
          <motion.div
            key="event-gallery-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <EventGalleryPage
              eventId={selectedEventId}
              onBack={handleBackFromEventGallery}
              onScrollToSection={handleScrollToSection}
              onOpenEnquiry={handleOpenEnquiry}
            />
          </motion.div>
        ) : currentView === "tours" ? (
          <motion.div
            key="tours-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Tours
              onOpenEnquiry={handleOpenEnquiry}
              isFullPage={true}
              onBack={handleBackFromTours}
              activeFilter={activeTourFilter}
              onChangeFilter={setActiveTourFilter}
            />
          </motion.div>
        ) : (
          <motion.div
            key="events-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <EventsPage
              onBack={handleBackFromEvents}
              onScrollToSection={handleScrollToSection}
              onViewEventGallery={navigateToEventGallery}
              onOpenEnquiry={handleOpenEnquiry}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 10. Floating Interactive Booking Form Overlay */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={handleCloseEnquiry}
        preselectedTour={selectedTourForEnquiry}
      />

      {/* 11. Persistent Floating WhatsApp Support Dispatcher */}
      <FloatingWhatsApp />

      {/* 12. Exit Intent Contact Popup */}
      <ExitIntentModal
        onViewTours={() => {
          if (currentView !== "home") {
            setCurrentView("home");
            setTimeout(() => {
              const el = document.getElementById("tours");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
          } else {
            const el = document.getElementById("tours");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppMain />
    </LanguageProvider>
  );
}
