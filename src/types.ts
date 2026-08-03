export type Language = "en" | "de" | "fr" | "es";

export interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  description: string;
  price: string;
  image: string;
  secondaryImage?: string;
  details: string[];
  highlights: string[];
}

export interface Review {
  id: string;
  customerName: string;
  country: string;
  profileImage?: string;
  tourName: string;
  travelDate: string;
  rating: number;
  message: string;
  createdAt: string;
}

export interface Enquiry {
  fullName: string;
  email: string;
  phone: string;
  selectedTour: string;
  travelers: number;
  travelDate: string;
  arrivalDate?: string;
  departureDate?: string;
  pickupLocation: string;
  message: string;
  adults?: number;
  children?: number;
  selectedVehicle?: string;
}

export interface SriLankaEvent {
  id: string;
  title: string;
  category: "Cultural" | "Wildlife & Nature" | "Adventure & Sports" | "Food & Drink" | "Arts & Music";
  location: string;
  dateMonthName: string; // e.g. "August" for filtering
  dateDay: string;      // e.g. "12"
  dateMonth: string;    // e.g. "AUG"
  description: string;
  image: string;
  priceText: string;     // e.g. "Free Entry" or "$25 USD"
  isTicketed: boolean;   // true for Ticketed, false for Free
  galleryImages?: string[];
}

