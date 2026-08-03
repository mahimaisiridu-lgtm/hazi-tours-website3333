import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language } from "../types";
import { translations, SUPPORTED_LANGUAGES, LanguageOption } from "../i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  currentLanguageOption: LanguageOption;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/de/") || pathname === "/de") return "de";
      if (pathname.startsWith("/fr/") || pathname === "/fr") return "fr";
      if (pathname.startsWith("/es/") || pathname === "/es") return "es";
      if (pathname.startsWith("/en/") || pathname === "/en") return "en";
    }
    return "en";
  });

  // Sync document attribute and title language
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      let detectedLang: Language = "en";
      if (pathname.startsWith("/de/") || pathname === "/de") detectedLang = "de";
      else if (pathname.startsWith("/fr/") || pathname === "/fr") detectedLang = "fr";
      else if (pathname.startsWith("/es/") || pathname === "/es") detectedLang = "es";
      else if (pathname.startsWith("/en/") || pathname === "/en") detectedLang = "en";

      if (detectedLang !== language) {
        setLanguageState(detectedLang);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [language]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;

      // Remove existing lang prefix if any (/en, /de, /fr, /es)
      let cleanPath = currentPath.replace(/^\/(en|de|fr|es)(\/|$)/, "/");
      if (!cleanPath.startsWith("/")) {
        cleanPath = "/" + cleanPath;
      }

      // Format new localized URL
      const newPathPrefix = newLang === "en" ? "/en" : `/${newLang}`;
      let newUrl = cleanPath === "/" ? `${newPathPrefix}/` : `${newPathPrefix}${cleanPath}`;
      if (currentSearch) {
        newUrl += currentSearch;
      }

      window.history.pushState({ lang: newLang }, "", newUrl);
      document.documentElement.lang = newLang;
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = translations["en"];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return defaultText || key;
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
