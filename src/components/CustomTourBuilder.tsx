import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Search, 
  Check, 
  X, 
  Calendar, 
  Users, 
  Car, 
  Compass, 
  Clock, 
  Sparkles, 
  Navigation, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Plus,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { trackWhatsAppAndNavigate, EnquiryData } from "../tracker";
import { useLanguage } from "../context/LanguageContext";

interface DestinationItem {
  id: string;
  name: string;
  category: string;
  subLocations?: string[];
}

const DESTINATIONS: DestinationItem[] = [
  // 🏔️ Central Province
  { id: "kandy", name: "Kandy", category: "Central Province", subLocations: ["Temple of the Sacred Tooth Relic", "Kandy Lake", "Royal Botanical Gardens Peradeniya"] },
  { id: "nuwara-eliya", name: "Nuwara Eliya", category: "Central Province", subLocations: ["Gregory Lake", "Tea Plantations & Factory", "Colonial Post Office"] },
  { id: "ambuluwawa", name: "Ambuluwawa Tower", category: "Central Province", subLocations: ["Gampola Biodiversity Complex", "360 Panoramic Viewpoint"] },
  { id: "ramboda", name: "Ramboda", category: "Central Province", subLocations: ["Ramboda Falls", "Highland Tea Factory"] },
  { id: "matale", name: "Matale", category: "Central Province", subLocations: ["Spice Gardens", "Aluvihare Rock Temple"] },
  { id: "knuckles", name: "Knuckles Mountain Range", category: "Central Province", subLocations: ["Cloud Forest Trekking", "Riverston Gap"] },
  { id: "sembuwatta", name: "Sembuwatta Lake", category: "Central Province", subLocations: ["Mountain Pine Forest", "Natural Spring Pool"] },

  // 🏝️ Southern Province
  { id: "galle-fort", name: "Galle Fort & Lighthouse", category: "Southern Province", subLocations: ["UNESCO Dutch Ramparts", "Historic Galle Lighthouse", "Jungle Beach"] },
  { id: "mirissa", name: "Mirissa", category: "Southern Province", subLocations: ["Coconut Tree Hill", "Secret Beach", "Mirissa Bay & Whale Watching"] },
  { id: "unawatuna", name: "Unawatuna", category: "Southern Province", subLocations: ["Unawatuna Beach", "Japanese Peace Pagoda"] },
  { id: "weligama", name: "Weligama Bay", category: "Southern Province", subLocations: ["Surfing Lessons", "Stilt Fishermen"] },
  { id: "koggala", name: "Koggala", category: "Southern Province", subLocations: ["Madu / Koggala River Safari", "Stilt Fishing Heritage"] },
  { id: "tangalle", name: "Tangalle & Hiriketiya", category: "Southern Province", subLocations: ["Horseshoe Surfing Bay", "Goyambokka Beach"] },
  { id: "hikkaduwa", name: "Hikkaduwa", category: "Southern Province", subLocations: ["Coral Reef Snorkeling", "Turtle Beach"] },
  { id: "kosgoda", name: "Kosgoda", category: "Southern Province", subLocations: ["Sea Turtle Conservation Hatchery"] },
  { id: "bentota", name: "Bentota", category: "Southern Province", subLocations: ["Bentota Water Sports", "Brief Garden"] },

  // 🌿 Uva Province
  { id: "ella", name: "Ella", category: "Uva Province", subLocations: ["Nine Arches Bridge", "Little Adam's Peak", "Ella Rock"] },
  { id: "haputale", name: "Haputale & Lipton's Seat", category: "Uva Province", subLocations: ["Lipton's Seat Viewpoint", "Dambatenne Tea Factory"] },
  { id: "diyaluma", name: "Diyaluma Falls", category: "Uva Province", subLocations: ["Upper Diyaluma Rock Pools", "Ravana Waterfall"] },
  { id: "dunhinda", name: "Dunhinda Falls", category: "Uva Province", subLocations: ["Badulla Scenic Waterfall Trek"] },
  { id: "kataragama", name: "Kataragama", category: "Uva Province", subLocations: ["Sacred Interfaith Pilgrimage City"] },

  // 🐘 Wildlife & Nature
  { id: "yala", name: "Yala National Park", category: "Wildlife & Nature", subLocations: ["Leopard Safari", "Sloth Bear & Elephant Sightings"] },
  { id: "udawalawe", name: "Udawalawe National Park", category: "Wildlife & Nature", subLocations: ["Wild Elephant Herd Safari", "Elephant Transit Home"] },
  { id: "minneriya", name: "Minneriya National Park", category: "Wildlife & Nature", subLocations: ["Famous Elephant Gathering Safari"] },
  { id: "wilpattu", name: "Wilpattu National Park", category: "Wildlife & Nature", subLocations: ["Natural Lakes (Lorus)", "Wildlife Wilderness Safari"] },
  { id: "sinharaja", name: "Sinharaja Rainforest", category: "Wildlife & Nature", subLocations: ["UNESCO Primary Tropical Rainforest Trek"] },
  { id: "pinnawala", name: "Pinnawala", category: "Wildlife & Nature", subLocations: ["Elephant Orphanage", "Ma Oya River Bathing"] },

  // 🏛️ Cultural Triangle
  { id: "sigiriya", name: "Sigiriya Lion Rock", category: "Cultural Triangle", subLocations: ["5th Century Rock Fortress", "Water Gardens", "Frescoes"] },
  { id: "pidurangala", name: "Pidurangala Rock", category: "Cultural Triangle", subLocations: ["Sunrise Viewpoint facing Sigiriya Rock"] },
  { id: "dambulla", name: "Dambulla Cave Temple", category: "Cultural Triangle", subLocations: ["Golden Cave Temple Complex", "Buddha Statues"] },
  { id: "polonnaruwa", name: "Polonnaruwa Ancient City", category: "Cultural Triangle", subLocations: ["Gal Vihara", "Royal Palace Ruins"] },
  { id: "anuradhapura", name: "Anuradhapura Sacred City", category: "Cultural Triangle", subLocations: ["Ruwanwelisaya Stupa", "Jaya Sri Maha Bodhi Tree"] },

  // 🌊 East Coast
  { id: "trincomalee", name: "Trincomalee & Nilaveli", category: "East Coast", subLocations: ["Nilaveli Beach", "Koneswaram Temple", "Pigeon Island Snorkeling"] },
  { id: "arugam-bay", name: "Arugam Bay", category: "East Coast", subLocations: ["World-class Surfing Point", "Kumana National Park Safari"] },
  { id: "pasikudah", name: "Pasikudah Bay", category: "East Coast", subLocations: ["Shallow Blue Lagoon Beach"] },

  // 🌴 North Province
  { id: "jaffna", name: "Jaffna City & Fort", category: "North Province", subLocations: ["Nallur Kandaswamy Kovil", "Colonial Dutch Fort", "Jaffna Library"] },
  { id: "delft-island", name: "Delft Island", category: "North Province", subLocations: ["Wild Horses", "Coral Walls", "Baobab Tree"] },

  // 🏖️ Colombo & Western Province
  { id: "colombo", name: "Colombo City", category: "Western Province", subLocations: ["Lotus Tower", "Gangaramaya Temple", "Galle Face Green"] },
  { id: "negombo", name: "Negombo", category: "Western Province", subLocations: ["Dutch Canal", "Fish Market", "Negombo Beach Lagoon"] },

  // 🏞️ Hidden / Adventure Places
  { id: "riverston", name: "Riverston & Pitawala Pathana", category: "Hidden / Adventure Places", subLocations: ["Mini World's End Gap", "Bambarakanda Falls"] },
  { id: "kitulgala", name: "Kitulgala", category: "Hidden / Adventure Places", subLocations: ["White Water Rafting", "Belilena Caves"] },
  { id: "adams-peak", name: "Adam's Peak (Sri Pada)", category: "Hidden / Adventure Places", subLocations: ["Sacred Mountain Sunrise Trek"] },
  { id: "meemure", name: "Meemure Village", category: "Hidden / Adventure Places", subLocations: ["Remote Mountain Village", "Lakegala Rock"] }
];

const CATEGORIES = [
  "All Categories",
  "Central Province",
  "Southern Province",
  "Uva Province",
  "Wildlife & Nature",
  "Cultural Triangle",
  "East Coast",
  "North Province",
  "Western Province",
  "Hidden / Adventure Places"
];

const DURATION_OPTIONS = [
  "1 Day",
  "2 Days",
  "3 Days",
  "4 Days",
  "5 Days",
  "7 Days",
  "10 Days",
  "14 Days",
  "Custom Days"
];

const VEHICLE_OPTIONS = [
  {
    id: "Three Wheel",
    title: "Three Wheel",
    emoji: "🚕",
    capacity: "Recommended for 1-3 travelers",
    desc: "Agile, authentic local Sri Lankan tuk-tuk experience for short scenic trips.",
    image: "https://lh3.googleusercontent.com/d/1GT_bN9_ssUDiALa02TnMCIc_JBLkjr0u",
    alt: "Sri Lankan Three Wheel Tuk Tuk"
  },
  {
    id: "Car",
    title: "Car",
    emoji: "🚗",
    capacity: "Recommended for 1-4 travelers",
    desc: "Executive air-conditioned luxury sedan for relaxed, comfortable long journeys.",
    image: "https://lh3.googleusercontent.com/d/1x7phINQakH2d2Ddm_psYnKSLr0mn7xFW",
    alt: "Executive Luxury Tour Sedan Car"
  },
  {
    id: "Van",
    title: "KDH van",
    emoji: "🚐",
    capacity: "Recommended for 5-12 travelers",
    desc: "Spacious high-roof luxury passenger van ideal for families and group tours.",
    image: "https://lh3.googleusercontent.com/d/1Ho_CgtkgN2PyIy8cbMnPlOTvmdcp3B6P",
    alt: "Tourist Passenger Van"
  }
];

export default function CustomTourBuilder() {
  const { t } = useLanguage();
  // Step 1: Selected Destinations & Search
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Step 2: Duration
  const [selectedDuration, setSelectedDuration] = useState<string>("3 Days");
  const [customDaysInput, setCustomDaysInput] = useState<string>("");

  // Step 3: Vehicle
  const [selectedVehicle, setSelectedVehicle] = useState<string>("Car");

  // Step 4: Enquiry Details
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [arrivalDate, setArrivalDate] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<string>("");
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [specialRequirements, setSpecialRequirements] = useState<string>("");

  // GPS Location state
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number; url: string } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Form Validation & Submission state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper for today's date in YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const totalTravelersCount = adults + childrenCount;

  // Helper for vehicle recommendation & banner message
  const getVehicleRecommendation = (count: number) => {
    if (count <= 3) {
      return {
        recommended: "Three Wheel",
        message: "Recommended vehicle for your group: Three Wheel",
      };
    } else if (count === 4) {
      return {
        recommended: "Car",
        message: "Recommended vehicle for your group: Car",
      };
    } else {
      return {
        recommended: "Van",
        message: "Van is recommended for groups larger than 4 travelers.",
      };
    }
  };

  const vehicleRec = getVehicleRecommendation(totalTravelersCount);

  // Auto-update selected vehicle when traveler count changes
  useEffect(() => {
    if (totalTravelersCount > 4) {
      setSelectedVehicle("Van");
    } else if (totalTravelersCount === 4) {
      if (selectedVehicle === "Three Wheel") {
        setSelectedVehicle("Car");
      }
    } else if (totalTravelersCount <= 3) {
      if (selectedVehicle === "Van") {
        setSelectedVehicle("Three Wheel");
      }
    }
  }, [totalTravelersCount]);

  // Filtered destinations list
  const filteredDestinations = DESTINATIONS.filter((item) => {
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subLocations && item.subLocations.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const toggleDestination = (destName: string) => {
    if (selectedDestinations.includes(destName)) {
      setSelectedDestinations(selectedDestinations.filter(d => d !== destName));
    } else {
      setSelectedDestinations([...selectedDestinations, destName]);
    }
  };

  const removeDestination = (destName: string) => {
    setSelectedDestinations(selectedDestinations.filter(d => d !== destName));
  };

  const clearAllDestinations = () => {
    setSelectedDestinations([]);
  };

  // GPS Detection Handler
  const handleDetectLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError("Unable to detect your location. Please enter your location manually.");
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        
        setGpsData({ lat, lng, url: mapsUrl });
        setIsDetectingGps(false);

        // Auto-populate pickup location if empty or append detected tag
        if (!pickupLocation.trim()) {
          setPickupLocation(`Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        }
      },
      (error) => {
        setIsDetectingGps(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError("Location permission denied. Please enter your pickup location manually.");
        } else {
          setGpsError("Unable to detect your location. Please enter your location manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Submission handler
  const handleSubmitCustomTour = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form Validations
    if (!fullName.trim()) {
      setValidationError("Please enter your full name.");
      return;
    }

    // Email validation: accept only real valid email formats
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (!phone.trim()) {
      setValidationError("Please enter your phone number.");
      return;
    }

    if (selectedDestinations.length === 0) {
      setValidationError("Please select at least one tour destination.");
      return;
    }

    const finalDuration = selectedDuration === "Custom Days"
      ? (customDaysInput.trim() ? `${customDaysInput.trim()} Days` : "Custom Duration")
      : selectedDuration;

    // Arrival & Departure Date validation
    const todayStr = getTodayDateString();
    if (!arrivalDate || arrivalDate < todayStr) {
      setValidationError("Please select a valid arrival date.");
      return;
    }
    if (!departureDate || departureDate < arrivalDate) {
      setValidationError("Please select a departure date on or after arrival date.");
      return;
    }

    // Vehicle validation according to traveler count
    if (totalTravelersCount > 4 && selectedVehicle !== "Van") {
      setValidationError("Van is recommended for groups larger than 4 travelers.");
      return;
    }

    if (totalTravelersCount === 4 && selectedVehicle === "Three Wheel") {
      setValidationError("Three Wheel is not available for 4 travelers. Please select Car or Van.");
      return;
    }

    if (!pickupLocation.trim()) {
      setValidationError("Please enter your pickup location.");
      return;
    }

    setIsSubmitting(true);

    const totalTravelers = `${adults} Adults${childrenCount > 0 ? `, ${childrenCount} Children` : ""}`;
    const destinationListText = selectedDestinations.join(", ");
    
    // Construct Tour Package summary name for Google Sheet & Email
    const tourPackageName = `Custom Tour (${finalDuration}) - Destinations: ${destinationListText}`;

    const enquiryPayload: EnquiryData = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      phoneNumber: phone.trim(),
      tourPackage: tourPackageName,
      numberOfTravelers: totalTravelers,
      travelDate: `${arrivalDate} to ${departureDate}`,
      pickupLocation: pickupLocation.trim(),
      vehicle: selectedVehicle,
      vehicleSelection: selectedVehicle,
      gpsLocationUrl: gpsData?.url || "",
      specialRequirements: specialRequirements.trim() 
        ? `Custom Destinations: ${destinationListText}\nDuration: ${finalDuration}\nTravelers: ${totalTravelers}\nSpecial Notes: ${specialRequirements.trim()}`
        : `Custom Destinations: ${destinationListText}\nDuration: ${finalDuration}\nTravelers: ${totalTravelers}`,
      status: "Custom Enquiry"
    };

    // Format WhatsApp Message
    const ownerNumber = "94752890560";
    let formattedDestinationsList = selectedDestinations.map(d => `• ${d}`).join("\n");

    const messageLines = [
      `*New Custom Tour Enquiry - Hazi Tours*`,
      ``,
      `*Customer Name:* ${fullName.trim()}`,
      `*Customer Email:* ${email.trim()}`,
      `*Phone Number:* ${phone.trim()}`,
      ``,
      `*Selected Destinations:*`,
      `${formattedDestinationsList}`,
      ``,
      `*Tour Duration:* ${finalDuration}`,
      `*Arrival Date:* ${arrivalDate}`,
      `*Departure Date:* ${departureDate}`,
      `*Number of Travelers:* ${totalTravelers}`,
      `*Pickup Location:* ${pickupLocation.trim()}`,
      `*Vehicle:* ${selectedVehicle}`,
      gpsData?.url ? `*Google Maps Location:* ${gpsData.url}` : null,
      ``,
      `*Special Requirements:* ${specialRequirements.trim() || "None"}`
    ].filter(line => line !== null).join("\n");

    const encodedMessage = encodeURIComponent(messageLines);
    const waUrl = `https://wa.me/${ownerNumber}?text=${encodedMessage}`;

    // Execute background saving & instant WhatsApp popup navigation
    setIsSubmitting(false);
    trackWhatsAppAndNavigate(waUrl, enquiryPayload);
  };

  return (
    <section id="custom-tour-builder" className="py-20 bg-[#f4f2ec] text-[#1c2e24] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-forest/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 bg-gold/15 text-forest border border-gold/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Bespoke Travel Experience</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest mb-4 leading-tight">
            Create Your Own Sri Lanka Tour
          </h2>
          <p className="text-gray-600 font-normal text-sm sm:text-base leading-relaxed">
            Select your favourite destinations, choose your travel duration and vehicle, then create your personalized Sri Lanka travel experience.
          </p>
        </div>

        <form onSubmit={handleSubmitCustomTour} className="space-y-12">
          
          {/* ========================================== */}
          {/* STEP 1: SELECT ANY TOURS */}
          {/* ========================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 mb-6 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1">Step 1</span>
                <h3 className="font-serif text-2xl font-bold text-forest flex items-center gap-2">
                  <Compass className="w-6 h-6 text-gold shrink-0" />
                  <span>Select Any Tours & Destinations</span>
                </h3>
              </div>

              {/* Selected Count Indicator */}
              <div className="flex items-center space-x-3">
                <span className="bg-forest/10 text-forest text-xs font-bold px-3.5 py-1.5 rounded-full border border-forest/20">
                  {selectedDestinations.length} Destination{selectedDestinations.length === 1 ? "" : "s"} Selected
                </span>
                {selectedDestinations.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllDestinations}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Display Selected Badges */}
            {selectedDestinations.length > 0 && (
              <div className="mb-6 p-4 bg-offwhite/80 rounded-2xl border border-gold/20">
                <span className="text-xs font-bold text-gray-500 block mb-2 uppercase tracking-wider">
                  Your Custom Itinerary List:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDestinations.map((dest) => (
                    <span
                      key={dest}
                      className="inline-flex items-center space-x-1.5 bg-forest text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-transform hover:scale-105"
                    >
                      <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{dest}</span>
                      <button
                        type="button"
                        onClick={() => removeDestination(dest)}
                        className="ml-1 text-white/70 hover:text-white hover:bg-black/20 rounded-full p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Search Bar & Category Filters */}
            <div className="space-y-4 mb-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                        isActive
                          ? "bg-forest text-gold border-forest shadow-sm"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gold/50 hover:text-forest"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Destinations List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto p-1 pr-2 custom-scrollbar">
              {filteredDestinations.length === 0 ? (
                <div className="col-span-full py-8 text-center text-gray-400 text-sm">
                  No destinations found matching "{searchQuery}".
                </div>
              ) : (
                filteredDestinations.map((dest) => {
                  const isSelected = selectedDestinations.includes(dest.name);
                  return (
                    <div
                      key={dest.id}
                      onClick={() => toggleDestination(dest.name)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start space-x-3 select-none ${
                        isSelected
                          ? "bg-forest/5 border-gold shadow-md scale-[1.01]"
                          : "bg-white border-gray-200/80 hover:border-gold/60 hover:shadow-sm"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected ? "bg-forest border-forest text-gold" : "border-gray-300 bg-gray-50"
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-sm font-bold truncate ${isSelected ? "text-forest" : "text-gray-800"}`}>
                            {dest.name}
                          </h4>
                          <span className="text-[10px] uppercase font-semibold text-gold/80 px-2 py-0.5 bg-gold/10 rounded shrink-0">
                            {dest.category.split(" ")[0]}
                          </span>
                        </div>

                        {dest.subLocations && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-snug">
                            {dest.subLocations.join(" • ")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* STEP 2: TOUR DURATION */}
          {/* ========================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1">Step 2</span>
              <h3 className="font-serif text-2xl font-bold text-forest flex items-center gap-2">
                <Clock className="w-6 h-6 text-gold shrink-0" />
                <span>Select Number of Days</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
              {DURATION_OPTIONS.map((duration) => {
                const isSelected = selectedDuration === duration;
                return (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setSelectedDuration(duration)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? "bg-forest text-gold border-gold shadow-md scale-105"
                        : "bg-gray-50 text-forest border-gray-200 hover:border-gold/40 hover:bg-white"
                    }`}
                  >
                    {duration}
                  </button>
                );
              })}
            </div>

            {selectedDuration === "Custom Days" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 bg-offwhite rounded-2xl border border-gold/30 max-w-md"
              >
                <label className="block text-xs font-bold text-forest mb-2">
                  Specify Exact Number of Days:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6 Days or 21 Days"
                  value={customDaysInput}
                  onChange={(e) => setCustomDaysInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-gold"
                />
              </motion.div>
            )}
          </div>

          {/* ========================================== */}
          {/* STEP 3: VEHICLE SELECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
            <div className="border-b border-gray-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1">Step 3</span>
                <h3 className="font-serif text-2xl font-bold text-forest flex items-center gap-2">
                  <Car className="w-6 h-6 text-gold shrink-0" />
                  <span>Vehicle Selection</span>
                </h3>
              </div>

              {/* Recommendation Banner */}
              <div className="bg-forest/5 border border-gold/30 px-3.5 py-2 rounded-2xl flex items-center space-x-2 text-xs text-forest font-bold">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span>{vehicleRec.message}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {VEHICLE_OPTIONS.map((v) => {
                const isSelected = selectedVehicle === v.id;
                const isRecommended = vehicleRec.recommended === v.id;

                // Disabled rules according to group size:
                // > 4 travelers: Three Wheel and Car disabled (only Van enabled)
                // 4 travelers: Three Wheel disabled
                const isDisabled =
                  (totalTravelersCount > 4 && (v.id === "Three Wheel" || v.id === "Car")) ||
                  (totalTravelersCount === 4 && v.id === "Three Wheel");

                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedVehicle(v.id);
                      }
                    }}
                    className={`group rounded-2xl border-2 transition-all relative flex flex-col justify-between overflow-hidden ${
                      isDisabled
                        ? "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "bg-forest/5 border-gold shadow-md cursor-pointer"
                        : "bg-white border-gray-200 hover:border-gold/50 cursor-pointer"
                    }`}
                  >
                    {/* Recommended Tag */}
                    {isRecommended && !isDisabled && (
                      <span className="absolute top-2.5 right-2.5 z-10 bg-gold text-forest text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                        ★ Recommended
                      </span>
                    )}

                    <div>
                      <div className="w-full h-28 sm:h-32 overflow-hidden bg-gray-100 relative">
                        <img
                          src={v.image}
                          alt={v.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-forest">{v.title}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            isDisabled
                              ? "bg-gray-200 text-gray-400"
                              : isSelected
                              ? "bg-forest text-gold"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {v.emoji}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-forest mb-1">{v.capacity}</p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{v.desc}</p>
                      </div>
                    </div>

                    {isDisabled && (
                      <div className="px-4 pb-3">
                        <p className="text-[10px] font-bold text-red-500 pt-2 border-t border-gray-200">
                          {totalTravelersCount > 4
                            ? "Disabled for > 4 travelers"
                            : "Disabled for 4 travelers"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================== */}
          {/* STEP 4: CUSTOM TOUR ENQUIRY FORM */}
          {/* ========================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1">Step 4</span>
              <h3 className="font-serif text-2xl font-bold text-forest flex items-center gap-2">
                <Calendar className="w-6 h-6 text-gold shrink-0" />
                <span>Custom Tour Traveller Details</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +94 77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all"
                />
              </div>

              {/* Arrival & Departure Dates Vertical Stack */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-4">
                {/* Arrival Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                    Arrival Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      type="date"
                      required
                      min={getTodayDateString()}
                      value={arrivalDate}
                      placeholder="mm/dd/yyyy"
                      onChange={(e) => setArrivalDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all text-gray-700"
                    />
                  </div>
                </div>

                {/* Departure Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                    Departure Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      type="date"
                      required
                      min={arrivalDate || getTodayDateString()}
                      value={departureDate}
                      placeholder="mm/dd/yyyy"
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Number of Travelers */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
                {/* Adults */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                    Adults
                  </label>
                  <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-xl p-1.5">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-forest flex items-center justify-center hover:bg-gold transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-forest">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-forest flex items-center justify-center hover:bg-gold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                    Children
                  </label>
                  <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-xl p-1.5">
                    <button
                      type="button"
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-forest flex items-center justify-center hover:bg-gold transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-forest">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-forest flex items-center justify-center hover:bg-gold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Vehicle Recommendation Live Badge under Travelers */}
                <div className="col-span-2 pt-1">
                  <div className="p-3 bg-forest/5 border border-gold/30 rounded-xl text-xs font-bold text-forest flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{vehicleRec.message}</span>
                    </span>
                    <span className="bg-forest text-gold px-2 py-0.5 rounded-md text-[10px] uppercase font-extrabold tracking-wider shrink-0 ml-2">
                      {selectedVehicle} Selected
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Location with GPS Feature */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-forest">
                  Pickup Location <span className="text-red-500">*</span>
                </label>

                {/* Use Current Location Button */}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingGps}
                  className="inline-flex items-center space-x-1.5 bg-forest/10 hover:bg-forest hover:text-white text-forest px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border border-forest/20 cursor-pointer self-start sm:self-auto"
                >
                  <Navigation className={`w-3.5 h-3.5 text-gold ${isDetectingGps ? "animate-spin" : ""}`} />
                  <span>{isDetectingGps ? "Detecting Location..." : "📍 Use My Current Location"}</span>
                </button>
              </div>

              <input
                type="text"
                required
                placeholder="Enter hotel, airport, villa, or city pickup location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all"
              />

              {/* GPS Detection Success Display */}
              {gpsData && (
                <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Location detected successfully</span>
                  </div>
                  <p className="font-semibold pt-1">Current Location Detected</p>
                  <p>Latitude: <span className="font-mono font-bold">{gpsData.lat.toFixed(6)}</span></p>
                  <p>Longitude: <span className="font-mono font-bold">{gpsData.lng.toFixed(6)}</span></p>
                  <p className="pt-1">
                    Google Maps Location:{" "}
                    <a
                      href={gpsData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-emerald-700 hover:text-emerald-900 font-medium break-all"
                    >
                      {gpsData.url}
                    </a>
                  </p>
                </div>
              )}

              {/* GPS Error Display */}
              {gpsError && (
                <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{gpsError}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-amber-900 underline shrink-0 hover:text-black cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              )}
            </div>

            {/* Special Requirements / Message */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                Special Requirements / Message
              </label>
              <textarea
                rows={3}
                placeholder="Let us know if you have specific places, hotel preferences, dietary choices, or special requests..."
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center space-x-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Submit CTA Button */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-20">
              <div className="text-xs text-gray-500">
                <span className="font-bold text-forest">Hazi Tours Guarantee:</span> Instant WhatsApp consultation & free customized itinerary planning.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ pointerEvents: 'auto', position: 'relative', zIndex: 30 }}
                className="w-full sm:w-auto bg-forest text-offwhite hover:bg-gold hover:text-forest px-10 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 cursor-pointer flex items-center justify-center space-x-2 relative z-30 pointer-events-auto touch-manipulation"
              >
                <span>Send via WhatsApp</span>
              </button>
            </div>

          </div>

        </form>

      </div>
    </section>
  );
}
