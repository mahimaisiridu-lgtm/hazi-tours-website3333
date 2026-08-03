/**
 * Utility to track WhatsApp clicks and forward enquiry details to Google Apps Script and EmailJS.
 */

import emailjs from "@emailjs/browser";

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2gaHNchHc9POEqOi703mP_z4ioyXw3je-sw0sOxMbT21HTWyfpkWKLEvcTsPcd8U/exec";

export interface EnquiryData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  tourPackage: string;
  numberOfTravelers?: number | string;
  travelDate: string;
  pickupLocation: string;
  vehicleSelection?: string;
  vehicle?: string;
  gpsLocationUrl?: string;
  specialRequirements?: string;
  status?: string;
}

/**
 * Fires a non-blocking tracking POST request to Google Apps Script with visitor metadata.
 */
export function trackWhatsAppBackground() {
  const payload = {
    page: window.location.pathname,
    device: navigator.userAgent,
    country: "Sri Lanka"
  };

  fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.error("WhatsApp click tracking failed:", err);
  });
}

/**
 * Saves complete customer enquiry details to the existing Google Sheet via Google Apps Script.
 */
export async function trackEnquiryToGoogleSheet(enquiryData: EnquiryData): Promise<boolean> {
  const now = new Date();
  
  // Format Date: DD/MM/YYYY
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const dateFormatted = `${dd}/${mm}/${yyyy}`;
  
  // Format Time: HH:MM:SS
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const timeFormatted = `${hh}:${min}:${ss}`;

  const phoneValue = enquiryData.phone || enquiryData.phoneNumber || "";
  const vehicleValue = enquiryData.vehicle || enquiryData.vehicleSelection || "";

  const payload = {
    // Exact requested keys
    page: window.location.pathname,
    device: navigator.userAgent,
    country: "Sri Lanka",
    fullName: enquiryData.fullName,
    email: enquiryData.email,
    phone: phoneValue,
    tourPackage: enquiryData.tourPackage,
    travelDate: enquiryData.travelDate,
    pickupLocation: enquiryData.pickupLocation,
    vehicle: vehicleValue,

    // Additional aliases for backup compatibility with script variations
    phoneNumber: phoneValue,
    vehicleSelection: vehicleValue,
    numberOfTravelers: enquiryData.numberOfTravelers || 1,
    gpsLocationUrl: enquiryData.gpsLocationUrl || "",
    specialRequirements: enquiryData.specialRequirements || "",
    status: enquiryData.status || "Pending",
    date: dateFormatted,
    time: timeFormatted,

    // Capitalized Google Sheet column header names
    "Date": dateFormatted,
    "Time": timeFormatted,
    "Page": window.location.pathname,
    "Device": navigator.userAgent,
    "Country": "Sri Lanka",
    "Full Name": enquiryData.fullName,
    "Email": enquiryData.email,
    "Phone Number": phoneValue,
    "Tour Package": enquiryData.tourPackage,
    "Travel Date": enquiryData.travelDate,
    "Pickup Location": enquiryData.pickupLocation,
    "Vehicle": vehicleValue,
    "Status": enquiryData.status || "Pending"
  };

  try {
    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (err) {
    console.error("Enquiry submission to Google Sheet failed:", err);
    return false;
  }
}

/**
 * Sends customer confirmation and internal notification emails via EmailJS.
 */
export async function sendEmailNotifications(enquiryData: EnquiryData): Promise<{ customerEmailSent: boolean; internalEmailSent: boolean }> {
  const SERVICE_ID = "service_2g5jbtz";
  const PUBLIC_KEY = "ZjVC6zOFECMis6h8B";
  const CUSTOMER_TEMPLATE_ID = "template_j32nq15";
  const INTERNAL_TEMPLATE_ID = "template_hjipnvw";

  const phoneValue = enquiryData.phone || enquiryData.phoneNumber || "";
  const vehicleValue = enquiryData.vehicle || enquiryData.vehicleSelection || "";
  const specialReqs = enquiryData.specialRequirements || "None";

  const templateParams = {
    customer_name: enquiryData.fullName,
    customer_email: enquiryData.email,
    phone: phoneValue,
    tour_package: enquiryData.tourPackage,
    travel_date: enquiryData.travelDate,
    travelers: enquiryData.numberOfTravelers || 1,
    pickup_location: enquiryData.pickupLocation,
    vehicle: vehicleValue,
    special_requirements: specialReqs,

    // Additional aliases for template flexibility
    customerName: enquiryData.fullName,
    customerEmail: enquiryData.email,
    to_name: enquiryData.fullName,
    to_email: enquiryData.email,
    reply_to: enquiryData.email,
    phoneNumber: phoneValue,
    tourPackage: enquiryData.tourPackage,
    travelDate: enquiryData.travelDate,
    numberOfTravelers: enquiryData.numberOfTravelers || 1,
    pickupLocation: enquiryData.pickupLocation,
    vehicleSelection: vehicleValue,
    specialRequirements: specialReqs,
    message: specialReqs
  };

  let customerEmailSent = false;
  let internalEmailSent = false;

  // Step 3: Send customer confirmation email
  try {
    await emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, templateParams, PUBLIC_KEY);
    customerEmailSent = true;
  } catch (err) {
    console.warn("EmailJS Customer confirmation email failed:", err);
  }

  // Step 4: Send internal notification email (Owner & Developer)
  try {
    await emailjs.send(SERVICE_ID, INTERNAL_TEMPLATE_ID, templateParams, PUBLIC_KEY);
    internalEmailSent = true;
  } catch (err) {
    console.warn("EmailJS Internal notification email failed:", err);
  }

  return { customerEmailSent, internalEmailSent };
}

/**
 * Sends tracking information, saves to Google Sheet, triggers EmailJS emails, and opens WhatsApp immediately.
 */
export function trackWhatsAppAndNavigate(whatsappUrl: string, enquiryData?: EnquiryData) {
  // 1. Open WhatsApp immediately (synchronous to user click event gesture)
  try {
    const newWindow = window.open(whatsappUrl, "_blank");
    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      // Mobile fallback if popup is blocked or returned null
      window.location.href = whatsappUrl;
    }
  } catch (err) {
    console.error("Failed to open WhatsApp window:", err);
    window.location.href = whatsappUrl;
  }

  // 2. Perform background tracking, Google Sheet saving, and EmailJS notification
  if (enquiryData) {
    trackEnquiryToGoogleSheet(enquiryData).catch((err) => {
      console.warn("Google Sheet background submission error:", err);
    });

    sendEmailNotifications(enquiryData).catch((err) => {
      console.warn("Email notification background error:", err);
    });
  } else {
    trackWhatsAppBackground();
  }
}



