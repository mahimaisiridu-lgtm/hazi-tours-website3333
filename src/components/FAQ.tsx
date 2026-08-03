import React, { useState } from "react";
import { HelpCircle, Plus, Minus, MessageSquare, PhoneCall, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do I book a tour?",
    answer:
      "Booking a tour with Hazi Tours is effortless. You can select your preferred itinerary on our website and click 'Inquire / Book Now', submit a request through our Custom Tour Builder, or send us a direct message on WhatsApp (+94 75 289 0560). Our travel specialists will confirm dates, answer your questions, and provide a detailed quotation promptly.",
    category: "Booking"
  },
  {
    question: "Do you provide airport pickup?",
    answer:
      "Yes! We offer 24/7 private airport pick-up and drop-off services from Bandaranaike International Airport (CMB) in Colombo or Mattala Rajapaksa International Airport (HRI) in Hambantota. Your personal English-speaking driver-guide will greet you in the arrivals hall with a name board and assist you with your luggage in a comfortable, air-conditioned vehicle.",
    category: "Transfers"
  },
  {
    question: "Can I customize my tour?",
    answer:
      "A hundred percent yes. Every traveler is unique, so all our itineraries can be completely customized to fit your travel dates, preferred pace, hotel budget, and specific interests (such as wildlife safaris, tea plantations, ancient heritage, or beach relaxation). Use our interactive Custom Tour Builder or tell us your ideas, and we will tailor the perfect route for you.",
    category: "Customization"
  },
  {
    question: "What payment methods are available?",
    answer:
      "We offer flexible and hassle-free payment options. You can pay via direct Bank Wire Transfer, online Credit/Debit Card, or pay in Cash (USD, EUR, GBP, or LKR) directly to your driver-guide upon arrival in Sri Lanka. We will provide full documentation and receipts for your booking.",
    category: "Payment"
  },
  {
    question: "Are tours private?",
    answer:
      "Yes, all Hazi Tours itineraries are 100% private. You will never be merged with large group tours or strangers. You will have a private luxury vehicle (sedan, SUV, or luxury van) with a dedicated, licensed English-speaking driver-guide exclusively for you and your travel companions throughout your journey.",
    category: "Service"
  }
];

interface FAQProps {
  onOpenEnquiry?: (tourName?: string) => void;
}

export default function FAQ({ onOpenEnquiry }: FAQProps) {
  // Controlled accordion state: Store only the active FAQ index (single open item)
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveFAQ((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-offwhite via-white to-offwhite/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-12 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-12 right-10 w-96 h-96 bg-forest/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 px-4 py-1.5 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-forest">
              Help & Assistance
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest mb-4 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Everything you need to know about booking private tours, airport transfers, payment terms, and custom itineraries with Hazi Tours Sri Lanka.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = activeFAQ === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-gold/60 shadow-lg shadow-gold/5 ring-1 ring-gold/30"
                    : "border-gray-200/80 hover:border-gold/40 shadow-sm hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none group select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`mt-0.5 p-2 rounded-xl transition-colors duration-300 ${
                        isOpen
                          ? "bg-forest text-gold"
                          : "bg-gold/10 text-forest group-hover:bg-gold group-hover:text-forest"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                    </div>

                    <div>
                      {faq.category && (
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gold/90 mb-1 block">
                          {faq.category}
                        </span>
                      )}
                      <h3
                        className={`font-serif text-base sm:text-lg font-bold transition-colors duration-200 ${
                          isOpen ? "text-forest" : "text-gray-900 group-hover:text-forest"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* Plus / Minus toggle icon with smooth rotation animation */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`p-2 rounded-full transition-colors duration-300 shrink-0 ${
                      isOpen
                        ? "bg-gold text-forest"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gold/20 group-hover:text-forest"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-gray-100/80 mt-1">
                        <p className="text-gray-600 text-sm leading-relaxed sm:text-base pt-4 pl-11">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Still Have Questions CTA Box */}
        <div className="mt-14 bg-forest rounded-3xl p-8 sm:p-10 text-offwhite text-center relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center mb-4 text-gold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 text-offwhite">
              Still Have Questions?
            </h3>
            <p className="text-offwhite/80 text-sm sm:text-base mb-8 leading-relaxed">
              Our local Sri Lankan tour experts are ready 24/7 to help you plan your itinerary, provide instant answers, and craft your custom travel experience.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/94752890560?text=Hello%20Hazi%20Tours!%20I%20have%20a%20question%20about%20your%20tours."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>

              {onOpenEnquiry && (
                <button
                  onClick={() => onOpenEnquiry()}
                  className="inline-flex items-center space-x-2 bg-gold hover:bg-offwhite text-forest font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Send Tour Inquiry</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

