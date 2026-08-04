import React, { useEffect } from "react";

interface SEOHeadProps {
  currentView: "home" | "gallery" | "events" | "event-gallery" | "tours";
  eventTitle?: string;
}

export default function SEOHead({ currentView, eventTitle }: SEOHeadProps) {
  useEffect(() => {
    let title =
      "Hazi Tours | Best Travel Agency in Sri Lanka | Private Tours & Holiday Packages";

    let description =
      "Hazi Tours is a trusted travel agency in Sri Lanka offering private tours, custom Sri Lanka tour packages, Yala safari experiences, airport transfers, and unforgettable holidays with local expert drivers.";

    if (currentView === "tours") {
      title =
        "Sri Lanka Tour Packages | Private Tours & Custom Holidays | Hazi Tours";

      description =
        "Explore the best Sri Lanka tour packages with Hazi Tours. Enjoy private chauffeur tours, Sigiriya, Kandy, Ella, Nuwara Eliya, Yala safari, Galle and customized Sri Lanka holidays.";
    } 
    
    else if (currentView === "events") {
      title =
        "Sri Lanka Festivals & Cultural Events | Travel Guide | Hazi Tours";

      description =
        "Discover Sri Lanka festivals, cultural events and local celebrations with Hazi Tours. Explore Kandy Esala Perahera, traditional festivals and unique travel experiences.";
    } 
    
    else if (currentView === "gallery") {
      title =
        "Sri Lanka Travel Gallery | Tours, Adventures & Holiday Experiences | Hazi Tours";

      description =
        "View real travel photos and experiences from Hazi Tours customers exploring Sri Lanka beaches, wildlife, culture and famous destinations.";
    } 
    
    else if (currentView === "event-gallery" && eventTitle) {
      title =
        `${eventTitle} Gallery | Sri Lanka Festival Highlights | Hazi Tours`;

      description =
        `Explore ${eventTitle} photos, cultural moments and festival highlights in Sri Lanka with Hazi Tours.`;
    }


    // Update browser title
    document.title = title;


    // Update meta tags
    const updateMeta = (
      nameOrProperty: string,
      content: string,
      isProperty = false
    ) => {
      const attribute = isProperty ? "property" : "name";

      let meta = document.querySelector(
        `meta[${attribute}="${nameOrProperty}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, nameOrProperty);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };


    updateMeta("description", description);
    updateMeta("title", title);


    // Open Graph
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta(
      "og:site_name",
      "Hazi Tours & Transport Sri Lanka",
      true
    );


    // Twitter
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);


  }, [currentView, eventTitle]);

  return null;
}
