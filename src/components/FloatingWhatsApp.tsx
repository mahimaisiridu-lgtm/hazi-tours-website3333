import React from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { trackWhatsAppBackground } from "../tracker";

export default function FloatingWhatsApp() {
  const whatsappUrl = "https://wa.me/94752890560";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-auto" style={{ zIndex: 9999, pointerEvents: 'auto' }}>
      <AnimatePresence>
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppBackground()}
          initial={{ scale: 0, opacity: 0, y: 60 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 18,
            delay: 1,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 9999 }}
          className="relative flex items-center justify-center bg-[#25D366] hover:bg-[#20ba59] text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.4)] transition-colors group cursor-pointer touch-manipulation pointer-events-auto relative z-[9999]"
          aria-label="Chat with Hazi Tours on WhatsApp"
        >
          {/* Premium Ambient Pulse Glow */}
          <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 blur-md animate-pulse pointer-events-none" />

          {/* Subtle Online/Active Notification Dot */}
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gold border border-white"></span>
          </span>

          {/* WhatsApp Icon */}
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-[#25D366] transition-transform duration-300 group-hover:rotate-12" />

          {/* Premium Slide-out Text Tooltip */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 mr-2 shrink-0">
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 text-[#133E2B] font-sans font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>Chat with us</span>
            </div>
          </div>
        </motion.a>
      </AnimatePresence>
    </div>
  );
}
