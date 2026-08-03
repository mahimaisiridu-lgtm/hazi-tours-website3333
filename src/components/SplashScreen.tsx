import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number; // Duration in ms before starting fade out
}

export default function SplashScreen({ onComplete, duration = 5000 }: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 1200); // 1.2s cinematic exit fade-out
      return () => clearTimeout(exitTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const titleText = "HAZI TOURS";
  const titleLetters = titleText.split("");

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          id="splash-screen"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{ backgroundColor: "#123B2A" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex flex-col items-center text-center px-6 max-w-xl">
            {/* 1. Logo Icon: 2.5s fade-in with slow continuous zoom scale animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.05 }}
              transition={{
                opacity: { duration: 2.5, ease: "easeInOut" },
                scale: { duration: 6.0, ease: "linear" },
              }}
              className="relative mb-8"
            >
              <div className="relative p-5 rounded-full text-[#E2B857] filter drop-shadow-[0_0_25px_rgba(226,184,87,0.35)]">
                <Compass className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.2]" />
              </div>
            </motion.div>

            {/* 2. Main Title: HAZI TOURS - Letter by letter smooth appearance over 2 seconds */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-white tracking-[0.25em] sm:tracking-[0.32em] uppercase mb-4 flex items-center justify-center pl-[0.25em]">
              {titleLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.9,
                    delay: 0.8 + index * 0.11, // Total reveal ~2s duration
                    ease: [0.25, 0.1, 0.25, 1.0],
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h1>

            {/* 3. Subtitle: CURATED SRI LANKAN JOURNEYS - Delay after title appears, 2s fade duration */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.0, delay: 2.3, ease: "easeInOut" }}
              className="text-xs sm:text-sm font-sans tracking-[0.35em] uppercase text-[#E2B857] font-medium mb-12 pl-[0.35em]"
            >
              CURATED SRI LANKAN JOURNEYS
            </motion.p>

            {/* 4. Loading Text & Thin Animated Gold Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, delay: 3.0, ease: "easeInOut" }}
              className="flex flex-col items-center space-y-4"
            >
              <span className="text-xs sm:text-sm font-sans text-white/60 tracking-[0.2em] font-light uppercase">
                Loading your tropical escape...
              </span>

              {/* Minimal Thin Gold Line: 4s continuous smooth cycle */}
              <div className="w-48 sm:w-64 h-[1.5px] bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="absolute top-0 bottom-0 bg-[#E2B857] rounded-full"
                  initial={{ left: "-50%", width: "50%" }}
                  animate={{ left: ["-50%", "100%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4.0,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
