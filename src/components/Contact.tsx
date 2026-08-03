import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageSquare, AlertCircle, CheckCircle, Sparkles, Send } from "lucide-react";
import { trackWhatsAppBackground, trackWhatsAppAndNavigate } from "../tracker";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full Name is required";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!phone.trim()) errs.phone = "Phone Number is required";
    if (!message.trim()) errs.message = "Please write a message";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Formulate pre-encoded WhatsApp message according to standard format:
    const waTemplate = `Hello Hazi Tour and Transport,

I have a general contact enquiry.

Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}

Thank you.`;

    const encoded = encodeURIComponent(waTemplate);
    const ownerNumber = "94752890560";
    trackWhatsAppAndNavigate(`https://wa.me/${ownerNumber}?text=${encoded}`, {
      fullName: name.trim(),
      email: email.trim(),
      phoneNumber: phone.trim(),
      tourPackage: "General Contact Enquiry",
      numberOfTravelers: 1,
      travelDate: "Flexible",
      pickupLocation: "N/A",
      vehicleSelection: "N/A",
      gpsLocationUrl: "",
      specialRequirements: message.trim(),
      status: "Pending"
    });
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate real high-end agency server email submit
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setErrors({});
      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 805);
  };

  return (
    <section id="contact" className="py-24 bg-offwhite relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">Contact Center</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest mt-2 mb-4 leading-tight">
            Start Your Expedition
          </h2>
          <p className="text-gray-500 text-sm font-normal leading-relaxed">
            Reach out via phone, direct email, or use our pre-formatted WhatsApp chat to book airport transfers or bespoke multi-day itineraries instantly.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Block: Business details Card */}
          <div className="lg:col-span-5 bg-forest text-offwhite p-8 sm:p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-2xl" />
            
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Local Headquarters</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-offwhite mt-1 mb-8">
                Hazi Tour and Transport
              </h3>

              <div className="space-y-6">
                
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-gold border border-white/10">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gold font-bold">Our Location</h4>
                    <p className="text-xs sm:text-sm text-offwhite/80 mt-1 font-light leading-relaxed">
                      Thiranagama, 80240, Sri Lanka
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-gold border border-white/10">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gold font-bold">Direct Phone</h4>
                    <a
                      href="tel:+94752890560"
                      className="text-xs sm:text-sm text-offwhite hover:text-gold block mt-1 font-light transition-colors"
                    >
                      +94 75 289 0560
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-gold border border-white/10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gold font-bold">Corporate Email</h4>
                    <a
                      href="mailto:hasindusachindika155@gmail.com"
                      className="text-xs sm:text-sm text-offwhite hover:text-gold block mt-1 font-light transition-colors break-all"
                    >
                      hasindusachindika155@gmail.com
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Instant Click to Chat helper */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <span className="text-[10px] text-offwhite/50 uppercase tracking-widest block font-medium mb-3">
                Live Chat Support
              </span>
              <a
                href="https://wa.me/94752890560"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsAppBackground()}
                style={{ pointerEvents: 'auto', position: 'relative', zIndex: 30 }}
                className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg transition-all relative z-30 pointer-events-auto touch-manipulation cursor-pointer"
              >
                <MessageSquare className="w-4.5 h-4.5 fill-white text-[#25D366]" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Block: Message Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
            {submitSuccess ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 bg-forest rounded-full flex items-center justify-center text-gold mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <Sparkles className="w-4 h-4 text-gold animate-pulse mb-1.5" />
                <h3 className="font-serif text-2xl font-bold text-forest">Enquiry Sent Successfully</h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xs font-light">
                  Thank you for contacting Hazi Tour and Transport. Our team will review your message and email you shortly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendViaWhatsApp} className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-forest mb-2">Write Us a Message</h3>
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
                    Full Name <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className={`w-full px-4 py-3 rounded-xl border bg-offwhite text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                      errors.name ? "border-terracotta" : "border-gray-200"
                    }`}
                  />
                  {errors.name && (
                    <span className="text-xs text-terracotta flex items-center mt-1">
                      <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
                      Email Address <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. eleanor@example.com"
                      className={`w-full px-4 py-3 rounded-xl border bg-offwhite text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                        errors.email ? "border-terracotta" : "border-gray-200"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-terracotta flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +44 7911 123456"
                      className={`w-full px-4 py-3 rounded-xl border bg-offwhite text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all ${
                        errors.phone ? "border-terracotta" : "border-gray-200"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-xs text-terracotta flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-forest font-semibold mb-1">
                    Your Message <span className="text-terracotta">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Write details about your requested destinations, vehicle preferences, or custom timing..."
                    className={`w-full px-4 py-3 rounded-xl border bg-offwhite text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all resize-none ${
                      errors.message ? "border-terracotta" : "border-gray-200"
                    }`}
                  />
                  {errors.message && (
                    <span className="text-xs text-terracotta flex items-center mt-1">
                      <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 relative z-20">
                  
                  {/* Option 1: Normal Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ pointerEvents: 'auto', position: 'relative', zIndex: 30 }}
                    className="w-full bg-forest hover:bg-gold text-offwhite hover:text-forest py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer relative z-30 pointer-events-auto touch-manipulation"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SUBMIT VIA WHATS APP</span>
                      </>
                    )}
                  </button>

                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
