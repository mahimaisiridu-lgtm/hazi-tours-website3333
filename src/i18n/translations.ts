import { Language, Tour, SriLankaEvent } from "../types";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  pathPrefix: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", pathPrefix: "/en" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", pathPrefix: "/de" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", pathPrefix: "/fr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", pathPrefix: "/es" }
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.tours": "Tours",
    "nav.events": "Events",
    "nav.about": "About",
    "nav.gallery": "Gallery",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.enquire": "Send Enquiry",
    "nav.direct_contact": "Direct Contact",
    "nav.book_enquiry": "Book / Send Enquiry",
    
    // Hero
    "hero.badge": "Rated #1 Private Chauffeur & Tour Specialist in Hikkaduwa",
    "hero.headline_1": "Discover Sri Lanka in",
    "hero.headline_2": "Pure Luxury Comfort",
    "hero.sub": "Tailor-made private chauffeur tours, airport transfers, Yala safaris, and island escapes. Driven by English-speaking local experts with zero hidden costs.",
    "hero.btn_tours": "Explore Tour Packages",
    "hero.btn_custom": "Design Custom Itinerary",
    "hero.stat_reviews": "5.0 ★ Google Rating",
    "hero.stat_reviews_sub": "128+ Verified Reviews",
    "hero.stat_safety": "100% Private & Safe",
    "hero.stat_safety_sub": "Licensed Luxury Vehicles",

    // Quick Search / Tabs
    "hero.tab_tours": "Tour Packages",
    "hero.tab_transfers": "Airport Transfer",
    "hero.tab_custom": "Custom Itinerary",
    "hero.search_tour_placeholder": "Where do you want to go in Sri Lanka?",
    "hero.search_btn": "Search Tours",
    "hero.transfer_from": "Pick-up Location",
    "hero.transfer_to": "Drop-off Location",
    "hero.transfer_btn": "Get Transfer Quote",

    // Tours Section
    "tours.title": "Curated Sri Lanka Private Tours",
    "tours.subtitle": "Handcrafted itineraries combining ancient heritage, lush tea mountains, wild safaris, and golden beaches.",
    "tours.filter_all": "All Tours",
    "tours.filter_day": "Day Tours",
    "tours.filter_multiday": "Multi-Day Tours",
    "tours.duration": "Duration",
    "tours.location": "Route",
    "tours.btn_itinerary": "View Itinerary",
    "tours.btn_book": "Book This Tour",
    "tours.highlights": "Key Highlights",
    "tours.includes": "Includes",
    "tours.custom_banner_title": "Want a Custom Route Unique to You?",
    "tours.custom_banner_sub": "Tell us your dream destinations, dates, and vehicle preference. We will build a customized private itinerary instantly.",
    "tours.custom_banner_btn": "Build My Custom Tour",

    // Vehicles Section
    "vehicles.title": "Our Luxury Chauffeur Fleet",
    "vehicles.subtitle": "Clean, air-conditioned, fully insured vehicles driven by professional licensed English-speaking local drivers.",
    "vehicles.sedan": "Executive Sedan",
    "vehicles.sedan_desc": "Ideal for couples and solo travelers seeking air-conditioned comfort.",
    "vehicles.van": "Luxury Van (KDH / HiAce)",
    "vehicles.van_desc": "Spacious seating with high roof and large luggage room for families and groups.",
    "vehicles.suv": "4x4 Safari Jeep / SUV",
    "vehicles.suv_desc": "Rugged performance for national park safaris and mountain terrain.",
    "vehicles.minibus": "Luxury Coaster Mini Bus",
    "vehicles.minibus_desc": "Maximum space and comfort for large group tours and events.",
    "vehicles.passengers": "Passengers",
    "vehicles.luggage": "Luggage Bags",
    "vehicles.ac": "Dual A/C Included",
    "vehicles.driver": "English Driver-Guide",
    "vehicles.select": "Select Vehicle",

    // Custom Tour Builder
    "builder.title": "Custom Sri Lanka Tour Builder",
    "builder.subtitle": "Select your favorite places, travel duration, and vehicle. We will calculate the optimal route for you.",
    "builder.step_1": "1. Select Destinations",
    "builder.step_2": "2. Duration & Travelers",
    "builder.step_3": "3. Choose Vehicle",
    "builder.step_4": "4. Contact Details",
    "builder.search_destinations": "Search places (e.g. Sigiriya, Ella, Yala)...",
    "builder.selected_places": "Selected Places",
    "builder.days_label": "Number of Days",
    "builder.travelers_label": "Number of Guests",
    "builder.vehicle_label": "Preferred Vehicle",
    "builder.submit_btn": "Send Custom Itinerary Request",
    "builder.whatsapp_btn": "Get Quick Quote on WhatsApp",

    // Enquiry Modal & Forms
    "enquiry.title": "Book Your Sri Lanka Tour / Transfer",
    "enquiry.subtitle": "Fill in your details below. We reply within 15 minutes with complete transparent pricing.",
    "enquiry.full_name": "Full Name",
    "enquiry.email": "Email Address",
    "enquiry.whatsapp": "WhatsApp Number (with country code)",
    "enquiry.tour_selected": "Selected Tour / Service",
    "enquiry.travel_date": "Planned Travel Date",
    "enquiry.guests": "Number of Travelers",
    "enquiry.pickup": "Pickup Location / Hotel",
    "enquiry.special_notes": "Special Requests / Hotel Preferences",
    "enquiry.submit": "Submit Enquiry Now",
    "enquiry.success_title": "Enquiry Received Successfully!",
    "enquiry.success_msg": "Thank you! Our travel consultant will contact you on WhatsApp or email shortly.",
    "enquiry.close": "Close Window",

    // About
    "about.badge": "Thiranagama, Hikkaduwa - Sri Lanka",
    "about.title": "Local Expertise. Authentic Hospitality.",
    "about.sub": "Hazi Tours & Transport was founded with a passion for showing travelers the genuine heart and soul of Sri Lanka.",
    "about.p1": "With over 14 years of driving and guiding experience across every corner of Ceylon, we take pride in offering safe, comfortable, and unforgettable private tours.",
    "about.p2": "Whether you want to climb Sigiriya at dawn, take the scenic train to Ella, or spot leopards in Yala, we handle every detail with genuine warmth.",

    // Trust & Reviews
    "trust.title": "Why Travelers Choose Hazi Tours & Transport",
    "trust.stat1_label": "Happy Travelers",
    "trust.stat2_label": "Custom Routes",
    "trust.stat3_label": "Years Experience",
    "trust.stat4_label": "Google Rating",
    "reviews.title": "Guest Testimonials & Reviews",
    "reviews.sub": "Real stories from travelers who explored Sri Lanka with Hazi Tours & Transport.",

    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.sub": "Everything you need to know about booking private chauffeur tours in Sri Lanka.",

    // Events
    "events.title": "Sri Lanka Cultural Events & Festivals",
    "events.sub": "Experience vibrant traditions, sacred processions, and island celebrations during your visit.",
    "events.btn_gallery": "View Event Photos",

    // Gallery
    "gallery.title": "Memories from Ceylon",
    "gallery.sub": "Snapshots of happy guests, scenic routes, and breathtaking landscapes.",

    // Contact & Footer
    "contact.title": "Get in Touch with Us",
    "contact.sub": "Direct 24/7 assistance via WhatsApp, phone, or email.",
    "contact.address_title": "Office Address",
    "contact.address_val": "Galle Road, Thiranagama, Hikkaduwa 80240, Sri Lanka",
    "contact.phone_title": "Phone / WhatsApp",
    "contact.email_title": "Email Address",
    "footer.rights": "All Rights Reserved. Hazi Tours & Transport Sri Lanka.",
    "footer.tagline": "Your Trusted Private Chauffeur & Tour Operator in Sri Lanka."
  },

  de: {
    // Nav
    "nav.home": "Startseite",
    "nav.tours": "Touren",
    "nav.events": "Events",
    "nav.about": "Über uns",
    "nav.gallery": "Galerie",
    "nav.faq": "FAQ",
    "nav.contact": "Kontakt",
    "nav.enquire": "Anfrage senden",
    "nav.direct_contact": "Direkter Kontakt",
    "nav.book_enquiry": "Buchen / Anfrage",

    // Hero
    "hero.badge": "Nr. 1 Privater Chauffeur & Tour-Spezialist in Hikkaduwa",
    "hero.headline_1": "Entdecken Sie Sri Lanka in",
    "hero.headline_2": "Purem Luxus & Komfort",
    "hero.sub": "Maßgeschneiderte private Chauffeur-Touren, Flughafentransfers, Yala-Safaris und Inselausflüge. Geführt von deutsch/englischsprachigen lokalen Experten ohne versteckte Kosten.",
    "hero.btn_tours": "Tour-Pakete Entdecken",
    "hero.btn_custom": "Eigene Route Gestalten",
    "hero.stat_reviews": "5.0 ★ Google Bewertung",
    "hero.stat_reviews_sub": "128+ Verifizierte Bewertungen",
    "hero.stat_safety": "100% Privat & Sicher",
    "hero.stat_safety_sub": "Lizensierte Luxusfahrzeuge",

    // Quick Search / Tabs
    "hero.tab_tours": "Tour-Pakete",
    "hero.tab_transfers": "Flughafentransfer",
    "hero.tab_custom": "Individuelle Route",
    "hero.search_tour_placeholder": "Wohin möchten Sie in Sri Lanka reisen?",
    "hero.search_btn": "Touren Suchen",
    "hero.transfer_from": "Abholort",
    "hero.transfer_to": "Zielort",
    "hero.transfer_btn": "Transfer-Angebot",

    // Tours Section
    "tours.title": "Exklusive Sri Lanka Privat-Touren",
    "tours.subtitle": "Handverlesene Routen, die antikes Kulturerbe, grüne Teeberge, wilde Safaris und goldene Strände verbinden.",
    "tours.filter_all": "Alle Touren",
    "tours.filter_day": "Tagestouren",
    "tours.filter_multiday": "Mehrtagestouren",
    "tours.duration": "Dauer",
    "tours.location": "Route",
    "tours.btn_itinerary": "Reiseverlauf Sehen",
    "tours.btn_book": "Diese Tour Buchen",
    "tours.highlights": "Highlights",
    "tours.includes": "Inklusive",
    "tours.custom_banner_title": "Wünschen Sie eine maßgeschneiderte Route?",
    "tours.custom_banner_sub": "Nennen Sie uns Ihre Traumziele, Reisedaten und Fahrzeugwünsche. Wir erstellen Ihnen sofort ein individuelles Angebot.",
    "tours.custom_banner_btn": "Eigene Tour Zusammenstellen",

    // Vehicles Section
    "vehicles.title": "Unsere Luxus-Chauffeur-Flotte",
    "vehicles.subtitle": "Saubere, voll klimatisierte, versicherte Fahrzeuge mit professionellen lizenzierten Fahrern.",
    "vehicles.sedan": "Exekutiv-Limousine",
    "vehicles.sedan_desc": "Ideal für Paare und Einzelreisende, die klimatisierten Komfort schätzen.",
    "vehicles.van": "Luxus-Van (KDH / HiAce)",
    "vehicles.van_desc": "Großzügiger Raum mit hohem Dach und viel Gepäckplatz für Familien und Gruppen.",
    "vehicles.suv": "4x4 Safari-Geländewagen / SUV",
    "vehicles.suv_desc": "Perfekte Leistung für Nationalpark-Safaris und Bergstraßen.",
    "vehicles.minibus": "Luxus-Kleinbus (Coaster)",
    "vehicles.minibus_desc": "Maximaler Platz und Komfort für große Reisegruppen.",
    "vehicles.passengers": "Passagiere",
    "vehicles.luggage": "Gepäckstücke",
    "vehicles.ac": "Klimaanlage Inklusive",
    "vehicles.driver": "Englisch/Deutsch Chauffeur",
    "vehicles.select": "Fahrzeug Auswählen",

    // Custom Tour Builder
    "builder.title": "Individueller Sri Lanka Tour-Konfigurator",
    "builder.subtitle": "Wählen Sie Ihre Lieblingsorte, Reisedauer und Fahrzeug aus. Wir berechnen die optimale Route.",
    "builder.step_1": "1. Reiseziele Auswählen",
    "builder.step_2": "2. Dauer & Personen",
    "builder.step_3": "3. Fahrzeug Wählen",
    "builder.step_4": "4. Kontaktdaten",
    "builder.search_destinations": "Orte suchen (z. B. Sigiriya, Ella, Yala)...",
    "builder.selected_places": "Ausgewählte Orte",
    "builder.days_label": "Anzahl der Tage",
    "builder.travelers_label": "Anzahl der Gäste",
    "builder.vehicle_label": "Bevorzugtes Fahrzeug",
    "builder.submit_btn": "Individuelle Anfrage Senden",
    "builder.whatsapp_btn": "Schnellangebot auf WhatsApp",

    // Enquiry Modal & Forms
    "enquiry.title": "Buchen Sie Ihre Sri Lanka Tour / Transfer",
    "enquiry.subtitle": "Füllen Sie Ihre Daten aus. Wir antworten innerhalb von 15 Minuten mit transparenten Festpreisen.",
    "enquiry.full_name": "Vollständiger Name",
    "enquiry.email": "E-Mail-Adresse",
    "enquiry.whatsapp": "WhatsApp-Nummer (mit Landesvorwahl)",
    "enquiry.tour_selected": "Gewählte Tour / Service",
    "enquiry.travel_date": "Geplantes Reisedatum",
    "enquiry.guests": "Anzahl Reisetilnehmer",
    "enquiry.pickup": "Abholort / Hotel",
    "enquiry.special_notes": "Besondere Wünsche / Hotelpräferenzen",
    "enquiry.submit": "Anfrage Jetzt Absenden",
    "enquiry.success_title": "Anfrage Erfolgreich Empfangen!",
    "enquiry.success_msg": "Vielen Dank! Unser Reiseberater wird Sie in Kürze per WhatsApp oder E-Mail kontaktieren.",
    "enquiry.close": "Fenster Schließen",

    // About
    "about.badge": "Thiranagama, Hikkaduwa - Sri Lanka",
    "about.title": "Lokale Expertise. Authentische Gastfreundschaft.",
    "about.sub": "Hazi Tours & Transport wurde gegründet, um Reisenden das echte Herz Sri Lankas zu zeigen.",
    "about.p1": "Mit über 14 Jahren Fahr- und Führungserfahrung in allen Ecken Ceylons bieten wir sichere, komfortable und unvergessliche Privattouren.",
    "about.p2": "Egal ob Sie Sigiriya bei Sonnenaufgang besteigen, den Panoramazug nach Ella nehmen oder Leoparden in Yala beobachten möchten – wir kümmern uns um jedes Detail.",

    // Trust & Reviews
    "trust.title": "Warum Reisende Hazi Tours & Transport Wählen",
    "trust.stat1_label": "Zufriedene Gäste",
    "trust.stat2_label": "Maßgeschneiderte Routen",
    "trust.stat3_label": "Jahre Erfahrung",
    "trust.stat4_label": "Google Bewertung",
    "reviews.title": "Gästebewertungen & Erfahrungen",
    "reviews.sub": "Echte Berichte von Reisenden, die Sri Lanka mit Hazi Tours & Transport entdeckt haben.",

    // FAQ
    "faq.title": "Häufig Gestellte Fragen",
    "faq.sub": "Alles, was Sie über die Buchung privater Chauffeur-Touren in Sri Lanka wissen müssen.",

    // Events
    "events.title": "Kulturelle Events & Feste in Sri Lanka",
    "events.sub": "Erleben Sie farbenfrohe Traditionen, heilige Prozessionen und Inselfeste.",
    "events.btn_gallery": "Event-Fotos Ansehen",

    // Gallery
    "gallery.title": "Impressionen aus Ceylon",
    "gallery.sub": "Schnappschüsse von glücklichen Gästen, malerischen Routen und atemberaubenden Landschaften.",

    // Contact & Footer
    "contact.title": "Kontaktieren Sie Uns",
    "contact.sub": "Direkte 24/7 Unterstützung via WhatsApp, Telefon oder E-Mail.",
    "contact.address_title": "Büroadresse",
    "contact.address_val": "Galle Road, Thiranagama, Hikkaduwa 80240, Sri Lanka",
    "contact.phone_title": "Telefon / WhatsApp",
    "contact.email_title": "E-Mail-Adresse",
    "footer.rights": "Alle Rechte vorbehalten. Hazi Tours & Transport Sri Lanka.",
    "footer.tagline": "Ihr vertrauenswürdiger privater Chauffeur & Reiseveranstalter in Sri Lanka."
  },

  fr: {
    // Nav
    "nav.home": "Accueil",
    "nav.tours": "Circuits",
    "nav.events": "Événements",
    "nav.about": "À propos",
    "nav.gallery": "Galerie",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.enquire": "Demander un devis",
    "nav.direct_contact": "Contact Direct",
    "nav.book_enquiry": "Réserver / Devis",

    // Hero
    "hero.badge": "Chauffeur privé & Spécialiste N°1 des circuits à Hikkaduwa",
    "hero.headline_1": "Découvrez le Sri Lanka en",
    "hero.headline_2": "Pur Confort & Luxe",
    "hero.sub": "Circuits privatifs sur mesure, transferts aéroport, safaris à Yala et escapades insulaires. Accompagnés par des chauffeurs-guides locaux expérimentés sans frais cachés.",
    "hero.btn_tours": "Explorer les Circuits",
    "hero.btn_custom": "Créer mon Itinéraire",
    "hero.stat_reviews": "5.0 ★ Note Google",
    "hero.stat_reviews_sub": "128+ Avis Vérifiés",
    "hero.stat_safety": "100% Privé & Sûr",
    "hero.stat_safety_sub": "Véhicules de Luxe Agréés",

    // Quick Search / Tabs
    "hero.tab_tours": "Circuits Proposés",
    "hero.tab_transfers": "Transferts Aéroport",
    "hero.tab_custom": "Itinéraire Sur Mesure",
    "hero.search_tour_placeholder": "Où souhaitez-vous aller au Sri Lanka ?",
    "hero.search_btn": "Rechercher",
    "hero.transfer_from": "Lieu de prise en charge",
    "hero.transfer_to": "Destination",
    "hero.transfer_btn": "Devis Transfert",

    // Tours Section
    "tours.title": "Circuits Privés d'Exception au Sri Lanka",
    "tours.subtitle": "Des itinéraires soigneusement conçus alliant patrimoine ancien, montagnes de thé, safaris sauvages et plages dorées.",
    "tours.filter_all": "Tous les circuits",
    "tours.filter_day": "Excursions d'un jour",
    "tours.filter_multiday": "Circuits plusieurs jours",
    "tours.duration": "Durée",
    "tours.location": "Itinéraire",
    "tours.btn_itinerary": "Voir le programme",
    "tours.btn_book": "Réserver ce circuit",
    "tours.highlights": "Points forts",
    "tours.includes": "Inclus dans le prix",
    "tours.custom_banner_title": "Vous souhaitez un itinéraire personnalisé ?",
    "tours.custom_banner_sub": "Indiquez-nous vos destinations rêvées, vos dates et le véhicule souhaité. Nous préparons votre devis sur mesure.",
    "tours.custom_banner_btn": "Créer mon circuit privé",

    // Vehicles Section
    "vehicles.title": "Notre Flotte de Véhicules de Luxe",
    "vehicles.subtitle": "Véhicules récents, climatisés et assurés, conduits par des chauffeurs anglophones certifiés.",
    "vehicles.sedan": "Berline Exécutive",
    "vehicles.sedan_desc": "Parfait pour couples et voyageurs solos cherchant le confort climatisé.",
    "vehicles.van": "Van de Luxe (KDH / HiAce)",
    "vehicles.van_desc": "Grand espace avec toit surélevé et coffre volumineux pour familles et groupes.",
    "vehicles.suv": "4x4 Safari / SUV",
    "vehicles.suv_desc": "Performances idéales pour les safaris dans les parcs nationaux et les montagnes.",
    "vehicles.minibus": "Minibus de Luxe (Coaster)",
    "vehicles.minibus_desc": "Espace maximal et confort pour grands groupes et événements.",
    "vehicles.passengers": "Passagers",
    "vehicles.luggage": "Bagages",
    "vehicles.ac": "Climatisation Incluse",
    "vehicles.driver": "Chauffeur Anglophone",
    "vehicles.select": "Choisir ce véhicule",

    // Custom Tour Builder
    "builder.title": "Configurateur de Circuit au Sri Lanka",
    "builder.subtitle": "Sélectionnez vos lieux préférés, la durée et le véhicule. Nous calculons votre itinéraire optimal.",
    "builder.step_1": "1. Choisir les destinations",
    "builder.step_2": "2. Durée & Voyageurs",
    "builder.step_3": "3. Choisir le véhicule",
    "builder.step_4": "4. Vos Coordonnées",
    "builder.search_destinations": "Rechercher (ex: Sigiriya, Ella, Yala)...",
    "builder.selected_places": "Lieux sélectionnés",
    "builder.days_label": "Nombre de jours",
    "builder.travelers_label": "Nombre de voyageurs",
    "builder.vehicle_label": "Véhicule souhaité",
    "builder.submit_btn": "Envoyer la demande d'itinéraire",
    "builder.whatsapp_btn": "Devis rapide sur WhatsApp",

    // Enquiry Modal & Forms
    "enquiry.title": "Réservez votre Circuit / Transfert au Sri Lanka",
    "enquiry.subtitle": "Remplissez vos informations. Réponse sous 15 minutes avec tarifs transparents.",
    "enquiry.full_name": "Nom complet",
    "enquiry.email": "Adresse E-mail",
    "enquiry.whatsapp": "Numéro WhatsApp (avec indicatif)",
    "enquiry.tour_selected": "Circuit / Service sélectionné",
    "enquiry.travel_date": "Date de voyage prévue",
    "enquiry.guests": "Nombre de participants",
    "enquiry.pickup": "Lieu de prise en charge / Hôtel",
    "enquiry.special_notes": "Demandes particulières / Préférences d'hôtels",
    "enquiry.submit": "Envoyer la demande",
    "enquiry.success_title": "Demande reçue avec succès !",
    "enquiry.success_msg": "Merci ! Notre conseiller vous contactera très rapidement sur WhatsApp ou par email.",
    "enquiry.close": "Fermer la fenêtre",

    // About
    "about.badge": "Thiranagama, Hikkaduwa - Sri Lanka",
    "about.title": "Expertise Locale. Hospitalité Authentique.",
    "about.sub": "Hazi Tours & Transport a été créée pour faire découvrir l'âme véritable du Sri Lanka.",
    "about.p1": "Forts de plus de 14 ans d'expérience sur les routes de Ceylan, nous sommes fiers de vous offrir des voyages privés sûrs et inoubliables.",
    "about.p2": "Que vous souhaitiez gravir le rocher de Sigiriya à l'aube, prendre le train panoramique d'Ella ou observer les léopards à Yala, nous nous occupons de tout.",

    // Trust & Reviews
    "trust.title": "Pourquoi Choisir Hazi Tours & Transport",
    "trust.stat1_label": "Voyageurs Heureux",
    "trust.stat2_label": "Itinéraires Sur Mesure",
    "trust.stat3_label": "Années d'Expérience",
    "trust.stat4_label": "Note Google",
    "reviews.title": "Témoignages & Avis Voyageurs",
    "reviews.sub": "Découvrez les retours d'expérience de nos clients ayant exploré le Sri Lanka avec Hazi Tours & Transport.",

    // FAQ
    "faq.title": "Foire Aux Questions",
    "faq.sub": "Tout ce que vous devez savoir pour réserver votre chauffeur privé au Sri Lanka.",

    // Events
    "events.title": "Événements Culturels & Festivals au Sri Lanka",
    "events.sub": "Vivez les traditions locales, processions sacrées et fêtes insulaires durant votre séjour.",
    "events.btn_gallery": "Voir les photos d'événements",

    // Gallery
    "gallery.title": "Souvenirs de Ceylan",
    "gallery.sub": "Découvrez les plus beaux clichés de nos voyageurs et paysages époustouflants.",

    // Contact & Footer
    "contact.title": "Contactez-nous",
    "contact.sub": "Assistance directe 24/7 par WhatsApp, téléphone ou email.",
    "contact.address_title": "Adresse de l'agence",
    "contact.address_val": "Galle Road, Thiranagama, Hikkaduwa 80240, Sri Lanka",
    "contact.phone_title": "Téléphone / WhatsApp",
    "contact.email_title": "Adresse E-mail",
    "footer.rights": "Tous droits réservés. Hazi Tours & Transport Sri Lanka.",
    "footer.tagline": "Votre chauffeur privé et agence de confiance au Sri Lanka."
  },

  es: {
    // Nav
    "nav.home": "Inicio",
    "nav.tours": "Tours",
    "nav.events": "Eventos",
    "nav.about": "Sobre Nosotros",
    "nav.gallery": "Galería",
    "nav.faq": "Preguntas",
    "nav.contact": "Contacto",
    "nav.enquire": "Solicitar Consulta",
    "nav.direct_contact": "Contacto Directo",
    "nav.book_enquiry": "Reservar / Consultar",

    // Hero
    "hero.badge": "#1 Chófer Privado y Especialista en Tours en Hikkaduwa",
    "hero.headline_1": "Descubra Sri Lanka con",
    "hero.headline_2": "Lujo y Confort Exclusivo",
    "hero.sub": "Tours privados a medida, traslados desde el aeropuerto, safaris en Yala y escapadas a la playa. Guiados por expertos locales con precios transparentes.",
    "hero.btn_tours": "Explorar Tours",
    "hero.btn_custom": "Diseñar Itinerario Privado",
    "hero.stat_reviews": "5.0 ★ Valoración Google",
    "hero.stat_reviews_sub": "128+ Opiniones Verificadas",
    "hero.stat_safety": "100% Privado y Seguro",
    "hero.stat_safety_sub": "Vehículos de Lujo Homologados",

    // Quick Search / Tabs
    "hero.tab_tours": "Paquetes de Tours",
    "hero.tab_transfers": "Traslado Aeropuerto",
    "hero.tab_custom": "Ruta Personalizada",
    "hero.search_tour_placeholder": "¿A dónde desea viajar en Sri Lanka?",
    "hero.search_btn": "Buscar Tours",
    "hero.transfer_from": "Lugar de Recogida",
    "hero.transfer_to": "Destino",
    "hero.transfer_btn": "Presupuesto Traslado",

    // Tours Section
    "tours.title": "Exclusivos Tours Privados en Sri Lanka",
    "tours.subtitle": "Itinerarios diseñados para combinar patrimonio antiguo, montañas de té, safaris y playas paradisíacas.",
    "tours.filter_all": "Todos los Tours",
    "tours.filter_day": "Tours de 1 Día",
    "tours.filter_multiday": "Tours de Varios Días",
    "tours.duration": "Duración",
    "tours.location": "Ruta",
    "tours.btn_itinerary": "Ver Itinerario",
    "tours.btn_book": "Reservar Este Tour",
    "tours.highlights": "Puntos Destacados",
    "tours.includes": "Incluye",
    "tours.custom_banner_title": "¿Desea un itinerario 100% personalizado?",
    "tours.custom_banner_sub": "Indíquenos sus destinos deseados, fechas y preferencias de vehículo. Le enviaremos una propuesta inmediata.",
    "tours.custom_banner_btn": "Crear Mi Tour a Medida",

    // Vehicles Section
    "vehicles.title": "Nuestra Flota de Chóferes de Lujo",
    "vehicles.subtitle": "Vehículos modernos, con aire acondicionado y seguro total, conducidos por chóferes profesionales.",
    "vehicles.sedan": "Sedán Ejecutivo",
    "vehicles.sedan_desc": "Ideal para parejas y viajeros individuales que buscan máxima comodidad.",
    "vehicles.van": "Van de Lujo (KDH / HiAce)",
    "vehicles.van_desc": "Espacioso con techo alto y amplio equipaje para familias y grupos.",
    "vehicles.suv": "Todoterreno 4x4 / SUV",
    "vehicles.suv_desc": "Rendimiento idóneo para safaris en parques nacionales y rutas de montaña.",
    "vehicles.minibus": "Minibús de Lujo (Coaster)",
    "vehicles.minibus_desc": "Máximo espacio y confort para grandes grupos y eventos.",
    "vehicles.passengers": "Pasajeros",
    "vehicles.luggage": "Equipaje",
    "vehicles.ac": "Aire Acondicionado Incluido",
    "vehicles.driver": "Chófer en Inglés/Español",
    "vehicles.select": "Seleccionar Vehículo",

    // Custom Tour Builder
    "builder.title": "Diseñador de Tours Personalizados",
    "builder.subtitle": "Elija sus lugares favoritos, días de viaje y vehículo. Calculamos su ruta óptima.",
    "builder.step_1": "1. Seleccionar Destinos",
    "builder.step_2": "2. Días y Pasajeros",
    "builder.step_3": "3. Elegir Vehículo",
    "builder.step_4": "4. Datos de Contacto",
    "builder.search_destinations": "Buscar lugares (ej: Sigiriya, Ella, Yala)...",
    "builder.selected_places": "Lugares seleccionados",
    "builder.days_label": "Número de días",
    "builder.travelers_label": "Número de viajeros",
    "builder.vehicle_label": "Vehículo preferido",
    "builder.submit_btn": "Enviar Solicitud de Ruta",
    "builder.whatsapp_btn": "Presupuesto Rápido por WhatsApp",

    // Enquiry Modal & Forms
    "enquiry.title": "Reserve su Tour / Traslado en Sri Lanka",
    "enquiry.subtitle": "Rellene sus datos a continuación. Le responderemos en 15 minutos con precios finales.",
    "enquiry.full_name": "Nombre Completo",
    "enquiry.email": "Correo Electrónico",
    "enquiry.whatsapp": "Número de WhatsApp (con prefijo)",
    "enquiry.tour_selected": "Tour / Servicio Seleccionado",
    "enquiry.travel_date": "Fecha Estimada de Viaje",
    "enquiry.guests": "Número de Pasajeros",
    "enquiry.pickup": "Lugar de Recogida / Hotel",
    "enquiry.special_notes": "Peticiones Especiales / Preferencia de Hoteles",
    "enquiry.submit": "Enviar Solicitud Ahora",
    "enquiry.success_title": "¡Solicitud Recibida con Éxito!",
    "enquiry.success_msg": "¡Gracias! Nuestro asesor de viajes se pondrá en contacto pronto por WhatsApp o correo.",
    "enquiry.close": "Cerrar Ventana",

    // About
    "about.badge": "Thiranagama, Hikkaduwa - Sri Lanka",
    "about.title": "Experiencia Local. Hospitalidad Auténtica.",
    "about.sub": "Hazi Tours & Transport nació para mostrar el alma auténtica de Sri Lanka a los viajeros.",
    "about.p1": "Con más de 14 años de experiencia conduciendo por todo Ceilán, ofrecemos viajes privados seguros y memorables.",
    "about.p2": "Ya sea subir a Sigiriya al amanecer, tomar el tren panorámico a Ella o avistar leopardos en Yala, cuidamos cada detalle.",

    // Trust & Reviews
    "trust.title": "Por qué Elegir Hazi Tours & Transport",
    "trust.stat1_label": "Viajeros Felices",
    "trust.stat2_label": "Rutas a Medida",
    "trust.stat3_label": "Años de Experiencia",
    "trust.stat4_label": "Valoración en Google",
    "reviews.title": "Opiniones y Experiencias de Clientes",
    "reviews.sub": "Reseñas reales de viajeros que exploraron Sri Lanka con Hazi Tours & Transport.",

    // FAQ
    "faq.title": "Preguntas Frecuentes",
    "faq.sub": "Todo lo que necesita saber para reservar un chófer privado en Sri Lanka.",

    // Events
    "events.title": "Eventos Culturales y Festivales en Sri Lanka",
    "events.sub": "Viva las tradiciones locales, procesiones sagradas y festividades de la isla.",
    "events.btn_gallery": "Ver Fotos de Eventos",

    // Gallery
    "gallery.title": "Recuerdos de Ceilán",
    "gallery.sub": "Imágenes de clientes felices, rutas panorámicas y paisajes inolvidables.",

    // Contact & Footer
    "contact.title": "Póngase en Contacto",
    "contact.sub": "Atención directa 24/7 por WhatsApp, teléfono o correo.",
    "contact.address_title": "Oficina Principal",
    "contact.address_val": "Galle Road, Thiranagama, Hikkaduwa 80240, Sri Lanka",
    "contact.phone_title": "Teléfono / WhatsApp",
    "contact.email_title": "Correo Electrónico",
    "footer.rights": "Todos los derechos reservados. Hazi Tours & Transport Sri Lanka.",
    "footer.tagline": "Su chófer privado y operador de confianza en Sri Lanka."
  }
};

// Helper function to translate dynamic Tour fields if language is not English
export function getTranslatedTour(tour: Tour, lang: Language): Tour {
  if (lang === "en") return tour;

  // German Translations Map
  if (lang === "de") {
    const deNameMap: Record<string, string> = {
      "kandy-heritage-gems-nature": "Kandy Kulturerbe, Edelsteine & Natur-Ausflug",
      "sigiriya-cultural": "Sigiriya Kultur- & Tempeltour",
      "galle-heritage": "Galle Festung & Welterbe Tour",
      "south-coast-explorer": "Südküste Surfen, Tee & Abenteuer Tour",
      "nature-river-tour": "Madu Fluss-Safari, Mondsteinmine & Schildkröten",
      "nuwara-eliya-highlights": "Nuwara Eliya & Hochland-Tee-Tour",
      "udawalawe-safari-tour": "Udawalawe Elefanten-Safari Tagestour",
      "sinharaja-rainforest": "Sinharaja Regenwald-Trekking & Natur",
      "colombo-city-tour": "Colombo Stadtbesichtigung & Shopping",
      "mirissa-whale-watching": "Mirissa Walbeobachtung & Strand-Ausflug",
      "ella-adventure-tour": "Ella Berg- & Eisenbahn-Abenteuer",
      "hill-country-elephant-tour": "Hochland & Elefanten-Erlebnis (2 Tage)",
      "diyaluma-falls-adventure": "Diyaluma Wasserfall & Naturpools (2 Tage)",
      "yala-safari-coastal": "Yala Safari & Südküsten-Erlebnis (2 Tage)",
      "sigiriya-kandy-escape": "Sigiriya & Kandy Kulturerbe (2 Tage)",
      "cultural-triangle-3days": "Kultur-Dreieck & Antike Reiche (3 Tage)",
      "hill-country-explorer": "Hochland Entdecker-Tour (4 Tage)",
      "south-coast-safari-4days": "Südküste & Yala Safari (4 Tage)",
      "cultural-triangle-5days": "Kultur-Dreieck & Kandy Tour (5 Tage)",
      "south-coast-ella-5days": "Südküste, Ella & Yala Tour (5 Tage)",
      "classic-sri-lanka-6days": "Klassische Sri Lanka Highlights Tour (6 Tage)",
      "best-of-sri-lanka-7days": "Das Beste von Sri Lanka Tour (7 Tage)",
      "complete-highlights-8days": "Komplette Sri Lanka Entdecker-Tour (8 Tage)",
      "east-south-adventure-9days": "Ost- & Südküste Abenteuer-Tour (9 Tage)",
      "ultimate-sri-lanka-10days": "Ultimative Sri Lanka Rundreise (10 Tage)"
    };

    const durationMap: Record<string, string> = {
      "Full Day": "Ganztägig",
      "1 Night / 2 Days": "1 Nacht / 2 Tage",
      "2 Day Tours": "2 Tage",
      "2 Nights / 3 Days": "2 Nächte / 3 Tage",
      "3 Days / 2 Nights": "3 Tage / 2 Nächte",
      "4 Days / 3 Nights": "4 Tage / 3 Nächte",
      "5 Days / 4 Nights": "5 Tage / 4 Nächte",
      "6 Days / 5 Nights": "6 Tage / 5 Nächte",
      "7 Days / 6 Nights": "7 Tage / 6 Nächte",
      "8 Days / 7 Nights": "8 Tage / 7 Nächte",
      "9 Days / 8 Nights": "9 Tage / 8 Nächte",
      "10 Days / 9 Nights": "10 Tage / 9 Nächte"
    };

    return {
      ...tour,
      name: deNameMap[tour.id] || tour.name,
      duration: durationMap[tour.duration] || tour.duration
    };
  }

  // French Translations Map
  if (lang === "fr") {
    const frNameMap: Record<string, string> = {
      "kandy-heritage-gems-nature": "Patrimoine de Kandy, Pierres Précieuses & Nature",
      "sigiriya-cultural": "Circuit Culturel Sigiriya & Sanctuaires",
      "galle-heritage": "Circuit Historique du Fort de Galle",
      "south-coast-explorer": "Aventure Surf, Thé & Côte Sud",
      "nature-river-tour": "Safari Rivière Madu, Mine de Pierre de Lune & Tortues",
      "nuwara-eliya-highlights": "Nuwara Eliya & Plantations de Thé",
      "udawalawe-safari-tour": "Safari Éléphants Udawalawe Excursion",
      "sinharaja-rainforest": "Randonnée Forêt Tropicale de Sinharaja",
      "colombo-city-tour": "Visite Guidée de Colombo & Shopping",
      "mirissa-whale-watching": "Observation des Baleines à Mirissa",
      "ella-adventure-tour": "Aventure à Ella & Train Panoramique",
      "hill-country-elephant-tour": "Montagnes & Éléphants (2 Jours)",
      "diyaluma-falls-adventure": "Cascades de Diyaluma & Piscines Naturelles (2 Jours)",
      "yala-safari-coastal": "Safari Yala & Côte Sud (2 Jours)",
      "sigiriya-kandy-escape": "Sigiriya & Kandy Patrimoine (2 Jours)",
      "cultural-triangle-3days": "Triangle Culturel & Cités Anciennes (3 Jours)",
      "hill-country-explorer": "Exploration des Montagnes du Thé (4 Jours)",
      "south-coast-safari-4days": "Côte Sud & Safari Yala (4 Jours)",
      "cultural-triangle-5days": "Triangle Culturel & Kandy (5 Jours)",
      "south-coast-ella-5days": "Côte Sud, Ella & Yala (5 Jours)",
      "classic-sri-lanka-6days": "Incontournables du Sri Lanka (6 Jours)",
      "best-of-sri-lanka-7days": "Le Meilleur du Sri Lanka (7 Jours)",
      "complete-highlights-8days": "Circuit Complet du Sri Lanka (8 Jours)",
      "east-south-adventure-9days": "Aventure Côte Est & Sud (9 Jours)",
      "ultimate-sri-lanka-10days": "Grand Tour Ultime du Sri Lanka (10 Jours)"
    };

    const durationMap: Record<string, string> = {
      "Full Day": "Journée Complète",
      "1 Night / 2 Days": "1 Nuit / 2 Jours",
      "2 Day Tours": "2 Jours",
      "2 Nights / 3 Days": "2 Nuits / 3 Jours",
      "3 Days / 2 Nights": "3 Jours / 2 Nuits",
      "4 Days / 3 Nights": "4 Jours / 3 Nuits",
      "5 Days / 4 Nights": "5 Jours / 4 Nuits",
      "6 Days / 5 Nights": "6 Jours / 5 Nuits",
      "7 Days / 6 Nights": "7 Jours / 6 Nuits",
      "8 Days / 7 Nights": "8 Jours / 7 Nuits",
      "9 Days / 8 Nights": "9 Jours / 8 Nuits",
      "10 Days / 9 Nights": "10 Jours / 9 Nuits"
    };

    return {
      ...tour,
      name: frNameMap[tour.id] || tour.name,
      duration: durationMap[tour.duration] || tour.duration
    };
  }

  // Spanish Translations Map
  if (lang === "es") {
    const esNameMap: Record<string, string> = {
      "kandy-heritage-gems-nature": "Kandy Patrimonio, Gemas y Naturaleza",
      "sigiriya-cultural": "Tour Cultural Sigiriya y Templos Antiguos",
      "galle-heritage": "Tour Histórico Fuerte de Galle",
      "south-coast-explorer": "Aventura de Surf, Té y Costa Sur",
      "nature-river-tour": "Safari en Río Madu, Mina de Piedra de Luna y Tortugas",
      "nuwara-eliya-highlights": "Nuwara Eliya y Plantaciones de Té",
      "udawalawe-safari-tour": "Safari de Elefantes en Udawalawe",
      "sinharaja-rainforest": "Senderismo en la Selva de Sinharaja",
      "colombo-city-tour": "Tour por la Ciudad de Colombo",
      "mirissa-whale-watching": "Avistamiento de Ballenas en Mirissa",
      "ella-adventure-tour": "Aventura en Ella y Tren Panorámico",
      "hill-country-elephant-tour": "Montañas de Té y Elefantes (2 Días)",
      "diyaluma-falls-adventure": "Cascada Diyaluma y Piscinas Naturales (2 Días)",
      "yala-safari-coastal": "Safari en Yala y Costa Sur (2 Días)",
      "sigiriya-kandy-escape": "Sigiriya y Kandy Patrimonio (2 Días)",
      "cultural-triangle-3days": "Triángulo Cultural y Ciudades Antiguas (3 Días)",
      "hill-country-explorer": "Explorador de las Montañas (4 Días)",
      "south-coast-safari-4days": "Costa Sur y Safari en Yala (4 Días)",
      "cultural-triangle-5days": "Triángulo Cultural y Kandy (5 Días)",
      "south-coast-ella-5days": "Costa Sur, Ella y Yala (5 Días)",
      "classic-sri-lanka-6days": "Tour Clásico Esencial de Sri Lanka (6 Días)",
      "best-of-sri-lanka-7days": "Lo Mejor de Sri Lanka (7 Días)",
      "complete-highlights-8days": "Tour Completo Sri Lanka (8 Días)",
      "east-south-adventure-9days": "Aventura Costa Este y Sur (9 Días)",
      "ultimate-sri-lanka-10days": "Gran Tour Definitivo de Sri Lanka (10 Días)"
    };

    const durationMap: Record<string, string> = {
      "Full Day": "Día Completo",
      "1 Night / 2 Days": "1 Noche / 2 Días",
      "2 Day Tours": "2 Días",
      "2 Nights / 3 Days": "2 Noches / 3 Días",
      "3 Days / 2 Nights": "3 Días / 2 Noches",
      "4 Days / 3 Nights": "4 Días / 3 Noches",
      "5 Days / 4 Nights": "5 Días / 4 Noches",
      "6 Days / 5 Nights": "6 Días / 5 Noches",
      "7 Days / 6 Nights": "7 Días / 6 Noches",
      "8 Days / 7 Nights": "8 Días / 7 Noches",
      "9 Days / 8 Nights": "9 Días / 8 Noches",
      "10 Days / 9 Nights": "10 Días / 9 Noches"
    };

    return {
      ...tour,
      name: esNameMap[tour.id] || tour.name,
      duration: durationMap[tour.duration] || tour.duration
    };
  }

  return tour;
}

export function getTranslatedEvent(evt: SriLankaEvent, lang: Language): SriLankaEvent {
  if (lang === "en") return evt;

  if (lang === "de") {
    const titleMap: Record<string, string> = {
      "evt-1": "Kandy Esala Perahera Prozession",
      "evt-2": "Sinhala & Tamil Neujahr",
      "evt-3": "Vesak Vollmond-Fest",
      "evt-4": "Galle Literary & Kultur Festival",
      "evt-5": "Duruthu Perahera Kelaniya"
    };
    return { ...evt, title: titleMap[evt.id] || evt.title };
  }

  if (lang === "fr") {
    const titleMap: Record<string, string> = {
      "evt-1": "Grande Procession Kandy Esala Perahera",
      "evt-2": "Nouvel An Cinghalais & Tamoul",
      "evt-3": "Festival de Vesak",
      "evt-4": "Festival Littéraire & Culturel de Galle",
      "evt-5": "Duruthu Perahera Kelaniya"
    };
    return { ...evt, title: titleMap[evt.id] || evt.title };
  }

  if (lang === "es") {
    const titleMap: Record<string, string> = {
      "evt-1": "Gran Procesión Kandy Esala Perahera",
      "evt-2": "Año Nuevo Cingalés y Tamil",
      "evt-3": "Festival de Vesak",
      "evt-4": "Festival Literario y Cultural de Galle",
      "evt-5": "Duruthu Perahera Kelaniya"
    };
    return { ...evt, title: titleMap[evt.id] || evt.title };
  }

  return evt;
}
