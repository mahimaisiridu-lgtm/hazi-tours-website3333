import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { Review } from "./types";

// Standard seed reviews to populate the database/localStorage initially
export const SEED_REVIEWS: Review[] = [
  {
    id: "seed-1",
    customerName: "Eleanor Vance",
    country: "United Kingdom",
    profileImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    tourName: "Sigiriya Cultural Tour",
    travelDate: "September 2025",
    rating: 5,
    message: "Hazi Tour and Transport provided an absolute dream experience. Climbing Sigiriya at sunrise was breathtaking, and our driver was incredibly knowledgeable, safe, and friendly. Standard of luxury was exceptional!",
    createdAt: new Date("2025-09-15").toISOString(),
  },
  {
    id: "seed-2",
    customerName: "Renee Chokshi",
    country: "Germany",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    tourName: "Ella Adventure Tour",
    travelDate: "December 2025",
    rating: 5,
    message: "The Nine Arch Bridge and Little Adam's Peak were stunning. Hazi made sure we got the best views, the smoothest transport, and delicious local food. Highly recommend their professional private guiding service!",
    createdAt: new Date("2025-12-28").toISOString(),
  },
  {
    id: "seed-3",
    customerName: "Sadil Marasingha",
    country: "Australia",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    tourName: "Honeymoon Tour Packages",
    travelDate: "March 2026",
    rating: 5,
    message: "We booked our Sri Lanka honeymoon with Hazi, and it exceeded every expectation. From luxury stays in Mirissa to the scenic train ride to Ella, every detail was carefully curated. +94 75 289 0560 is a magic number!",
    createdAt: new Date("2026-03-10").toISOString(),
  },
  {
    id: "seed-4",
    customerName: "Yuki Tanaka",
    country: "Japan",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    tourName: "Wildlife Safari",
    travelDate: "June 2026",
    rating: 5,
    message: "We saw herds of elephants and even a leopard at Yala! The custom tour vehicle was extremely comfortable and our guide has an amazing eye for wildlife spotting. Absolutely perfect transport service.",
    createdAt: new Date("2026-06-04").toISOString(),
  }
];

// Fallback localStorage key
const LOCAL_STORAGE_KEY = "hazi_reviews_db_v5";

// Retrieve local reviews helper
function getLocalReviews(): Review[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SEED_REVIEWS;
  }
}

// Save local reviews helper
function saveLocalReview(review: Review) {
  const current = getLocalReviews();
  const updated = [review, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

// Attempt to load firebase configuration
// Since provisioning can fail on sandbox environments, we write a robust resilient client
let db: any = null;
let useFirebase = false;

// We will check for standard environment variable injection (VITE_FIREBASE_*)
// and attempt to configure. If not present, we cleanly fall back to LocalStorage.
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: metaEnv.VITE_FIREBASE_APP_ID || ""
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    useFirebase = true;
    console.log("Firebase Firestore successfully initialized for Hazi Tour and Transport");
  } catch (error) {
    console.warn("Failed to initialize Firebase, falling back to LocalStorage reviews:", error);
  }
} else {
  console.info("No Firebase configurations found. Active local database is running seamlessly.");
}

/**
 * Adds a new customer review to either Firestore or local storage fallback.
 */
export async function addCustomerReview(reviewData: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const newReview: Review = {
    ...reviewData,
    id: Math.random().toString(36).substring(2, 11),
    createdAt: new Date().toISOString()
  };

  if (useFirebase && db) {
    try {
      const docRef = await addDoc(collection(db, "reviews"), {
        customerName: newReview.customerName,
        country: newReview.country,
        profileImage: newReview.profileImage || "",
        tourName: newReview.tourName,
        travelDate: newReview.travelDate,
        rating: Number(newReview.rating),
        message: newReview.message,
        createdAt: Timestamp.fromDate(new Date(newReview.createdAt))
      });
      newReview.id = docRef.id;
      // Also write to local storage for instant sync/preview fallback consistency
      saveLocalReview(newReview);
      return newReview;
    } catch (error) {
      console.error("Error writing to Firestore, writing to LocalStorage fallback:", error);
      saveLocalReview(newReview);
      return newReview;
    }
  } else {
    saveLocalReview(newReview);
    // Artificially delay slightly for luxury hospitality loader simulation
    await new Promise((resolve) => setTimeout(resolve, 600));
    return newReview;
  }
}

/**
 * Retrieves all reviews, sorted by createdAt desc.
 */
export async function getCustomerReviews(): Promise<Review[]> {
  if (useFirebase && db) {
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const reviewsList: Review[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let createdIso = new Date().toISOString();
        if (data.createdAt) {
          createdIso = data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString()
            : new Date(data.createdAt).toISOString();
        }
        reviewsList.push({
          id: doc.id,
          customerName: data.customerName || "Valued Customer",
          country: data.country || "Explorer",
          profileImage: data.profileImage || "",
          tourName: data.tourName || "Custom Tour",
          travelDate: data.travelDate || "Recent",
          rating: Number(data.rating) || 5,
          message: data.message || "",
          createdAt: createdIso
        });
      });

      if (reviewsList.length === 0) {
        // If the Firebase collection is currently empty, seed with the premium seed reviews
        return getLocalReviews();
      }
      return reviewsList;
    } catch (error) {
      console.error("Error querying Firestore, retrieving from LocalStorage fallback:", error);
      return getLocalReviews();
    }
  } else {
    return getLocalReviews().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
