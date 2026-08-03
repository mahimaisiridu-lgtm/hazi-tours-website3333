import React, { useEffect } from "react";

interface SEOHeadProps {
  currentView: "home" | "gallery" | "events" | "event-gallery" | "tours";
  eventTitle?: string;
}

export default function SEOHead({ currentView, eventTitle }: SEOHeadProps) {
  useEffect(() => {
    let title = "Hazi Tours & Transport Sri Lanka | Private Driver & Tour Packages";
    let description = "Hazi Tours & Transport is Sri Lanka's top-rated private tour operator in Hikkaduwa. Book luxury private chauffeur tours, Yala safaris, Sigiriya, Kandy, Ella train trips, and 24/7 Colombo airport transfers.";

    if (currentView === "tours") {
      title = "Sri Lanka Tour Packages & Private Chauffeur Itineraries | Hazi Tours & Transport";
      description = "Explore custom multi-day Sri Lanka tour packages. Private driver tours to Sigiriya, Kandy, Nuwara Eliya, Ella, Yala safari, Mirissa, and Galle with Hazi Tours & Transport.";
    } else if (currentView === "events") {
      title = "Sri Lanka Festivals, Cultural Events & Local Celebrations | Hazi Tours & Transport";
      description = "Discover famous Sri Lankan festivals and events including Esala Perahera in Kandy, Duruthu Perahera, and coastal cultural celebrations with Hazi Tours & Transport.";
    } else if (currentView === "gallery") {
      title = "Sri Lanka Travel Photo & Video Gallery | Hazi Tours & Transport";
      description = "Browse real photos and moments of travelers exploring Sri Lanka with Hazi Tours & Transport.";
    } else if (currentView === "event-gallery" && eventTitle) {
      title = `${eventTitle} Gallery & Festival Highlights | Hazi Tours & Transport`;
      description = `Photo gallery and cultural highlights from ${eventTitle} in Sri Lanka. Experience local traditions with Hazi Tours & Transport.`;
    }

    // Update Document Title
    document.title = title;

    // Helper to update or create meta tags
    const updateMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, nameOrProperty);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMeta("description", description);
    updateMeta("title", title);
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);

  }, [currentView, eventTitle]);

  return null;
}
