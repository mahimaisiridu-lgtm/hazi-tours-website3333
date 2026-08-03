import React from "react";
import { WHY_CHOOSE_US } from "../data";
import { ShieldCheck, Award, HeartHandshake, Leaf } from "lucide-react";
import Logo from "./Logo";

export default function About() {
  return (
    <section id="about" className="py-24 bg-forest text-offwhite relative overflow-hidden">
      {/* Decorative luxury circles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Storytelling Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Block: Image Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/10">
              <img
                src="https://lh3.googleusercontent.com/d/1wsKwHzDHKeCIRQYzMc-Purun3mcM5UCf"
                alt="Hazi Tour and Transport group of happy travelers"
                referrerPolicy="no-referrer"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />
            </div>

            {/* Overlapping Floating Card */}
            <div className="absolute -bottom-6 -right-6 z-20 bg-gold text-forest p-6 rounded-2xl shadow-xl max-w-xs border border-white/10 hidden sm:block">
              <span className="font-serif text-3xl font-bold block">14+</span>
              <span className="text-xs uppercase tracking-wider font-bold block mt-1">Years of Local Guiding</span>
              <p className="text-forest/85 text-xs mt-2 font-normal leading-relaxed">
                Registered tour guides providing custom private transportation and hospitality across all of Sri Lanka.
              </p>
            </div>
          </div>

          {/* Right Block: Brand Narrative */}
          <div className="lg:col-span-7">
            <div className="flex items-center space-x-4 mb-4">
              <Logo variant="icon" size={64} light={true} />
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold block">The Hazi Narrative</span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-offwhite/50 block font-semibold mt-0.5">Official Registered Tour Operator</span>
              </div>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-offwhite mt-2 mb-6 leading-tight">
              Crafting Personalized Adventures with Authentic Soul
            </h2>
            
            <p className="text-offwhite/80 font-normal text-sm sm:text-base leading-relaxed mb-6">
              Hazi Tour and Transport is a boutique Sri Lankan travel agency founded on a passion for authentic storytelling and executive travel comfort. Headquartered in the beautiful coastal region of Thiranagama, Hikkaduwa, we specialize in high-end private passenger transport and bespoke multi-day itineraries.
            </p>

            <p className="text-offwhite/70 font-normal text-sm leading-relaxed mb-8">
              We do not believe in rigid group tour packages that force you into rushed schedules. Our luxury sedans, SUVs, and dedicated drivers belong completely to you. We empower you to explore Sri Lanka's historical fortresses, tea fields, and raw elephant safaris at a pace that honors your freedom and serenity.
            </p>

            {/* Why Choose Us Icons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wide text-offwhite">Bespoke Curation</h4>
                  <p className="text-xs text-offwhite/60 mt-1 leading-relaxed">Every routing is personalized from airport greeting to beach sunset.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wide text-offwhite">100% Secure & Licensed</h4>
                  <p className="text-xs text-offwhite/60 mt-1 leading-relaxed">Verified tourist drivers, premium air-conditioned luxury fleets.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wide text-offwhite">Local Island Experts</h4>
                  <p className="text-xs text-offwhite/60 mt-1 leading-relaxed">Hailing from Galle, we unlock hidden gems of the true south.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wide text-offwhite">Eco-Hospitality Focus</h4>
                  <p className="text-xs text-offwhite/60 mt-1 leading-relaxed">Supporting rural local communities and ethical wildlife reserves.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bento Grid: Core Strengths */}
        <div className="mt-24 pt-12 border-t border-white/10">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">Uncompromising Quality</span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-offwhite mt-1">
              Why Discerning Travelers Choose Us
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((strength, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-gold/30 transition-all duration-300"
              >
                <div className="font-mono text-xs text-gold/60 font-bold mb-4">
                  0{index + 1}
                </div>
                <h4 className="text-base font-semibold tracking-wide text-offwhite mb-2">
                  {strength.title}
                </h4>
                <p className="text-xs text-offwhite/70 leading-relaxed font-light">
                  {strength.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
