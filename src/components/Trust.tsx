import React, { useEffect, useState, useRef } from "react";
import { TRUST_STATS } from "../data";
import { Smile, Compass, MapPin, Star, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion, useInView } from "motion/react";

interface StatCounterProps {
  value: string;
}

export function StatCounter({ value }: StatCounterProps) {
  const [current, setCurrent] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    // Parse numeric value
    const numericMatch = value.replace(/,/g, "").match(/[\d.]+/);
    if (!numericMatch) return;

    const target = parseFloat(numericMatch[0]);
    const isDecimal = numericMatch[0].includes(".");
    
    let start = 0;
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    let animationFrameId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * target;

      setCurrent(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value]);

  const renderFormatted = () => {
    const numericMatch = value.replace(/,/g, "").match(/[\d.]+/);
    if (!numericMatch) return value;

    const rawNumString = numericMatch[0];
    const prefix = value.substring(0, value.indexOf(rawNumString));
    const suffix = value.substring(value.indexOf(rawNumString) + rawNumString.length);

    let formattedNum = "";
    if (rawNumString.includes(".")) {
      formattedNum = current.toFixed(2);
    } else {
      formattedNum = Math.floor(current).toLocaleString();
    }

    return `${prefix}${formattedNum}${suffix}`;
  };

  return (
    <span ref={elementRef} className="tabular-nums">
      {renderFormatted()}
    </span>
  );
}

export default function Trust() {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Smile className="w-8 h-8 text-gold" />;
      case 1: return <Compass className="w-8 h-8 text-gold animate-spin-slow" />;
      case 2: return <MapPin className="w-8 h-8 text-gold" />;
      default: return <Star className="w-8 h-8 text-gold fill-gold" />;
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 16,
      },
    },
  };

  return (
    <section className="py-24 bg-forest text-offwhite relative overflow-hidden">
      {/* Decorative luxury foliage or light leaks */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Statistics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {TRUST_STATS.map((stat, idx) => (
            <motion.div
              key={stat.id}
              variants={cardVariants}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-between text-center md:text-left hover:bg-white/10 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex justify-center md:justify-start mb-6">
                <div className="w-14 h-14 bg-gold/15 border border-gold/30 rounded-2xl flex items-center justify-center">
                  {getIcon(idx)}
                </div>
              </div>

              <div>
                <span className="text-4xl sm:text-5xl font-serif font-bold text-offwhite tracking-tight block">
                  <StatCounter value={stat.value} />
                </span>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mt-2">
                  {stat.label}
                </h4>
                <p className="text-xs text-offwhite/60 mt-2 leading-relaxed font-light">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Big Assurance quote at the bottom of statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 p-8 sm:p-12 rounded-3xl bg-white/5 border border-white/10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center shrink-0 border border-gold/40">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-offwhite leading-snug">
                Travel With absolute peace of Mind
              </h3>
              <p className="text-xs text-offwhite/70 mt-1 max-w-xl font-normal leading-relaxed">
                Hazi Tour and Transport belongs to the Tourist Guide Association of Sri Lanka. We strictly provide full comprehensive passenger vehicle insurance and never engage in unsolicited commission shopping stops.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 bg-gold text-forest px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg">
            <HeartHandshake className="w-4.5 h-4.5" />
            <span>Guaranteed Local Prices</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
