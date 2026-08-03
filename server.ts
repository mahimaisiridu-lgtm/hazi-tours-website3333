import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const SEED_REVIEWS = [
  {
    id: "seed-1",
    customerName: "Eleanor Vance",
    country: "United Kingdom",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    tourName: "Sigiriya Cultural Tour",
    travelDate: "September 2025",
    rating: 5,
    message: "Hazi Tour and Transport provided an absolute dream experience. Climbing Sigiriya at sunrise was breathtaking, and our driver was incredibly knowledgeable, safe, and friendly. Standard of luxury was exceptional!",
    createdAt: "2025-09-15T00:00:00.000Z",
    status: "Approved"
  },
  {
    id: "seed-2",
    customerName: "Renee Chokshi",
    country: "Germany",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    tourName: "Ella Adventure Tour",
    travelDate: "December 2025",
    rating: 5,
    message: "The Nine Arch Bridge and Little Adam's Peak were stunning. Hazi made sure we got the best views, the smoothest transport, and delicious local food. Highly recommend their professional private guiding service!",
    createdAt: "2025-12-28T00:00:00.000Z",
    status: "Approved"
  },
  {
    id: "seed-3",
    customerName: "Sadil Marasingha",
    country: "Australia",
    profileImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    tourName: "Honeymoon Tour Packages",
    travelDate: "March 2026",
    rating: 5,
    message: "We booked our Sri Lanka honeymoon with Hazi, and it exceeded every expectation. From luxury stays in Mirissa to the scenic train ride to Ella, every detail was carefully curated. +94 75 289 0560 is a magic number!",
    createdAt: "2026-03-10T00:00:00.000Z",
    status: "Approved"
  },
  {
    id: "seed-4",
    customerName: "Yuki Tanaka",
    country: "Japan",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    tourName: "Wildlife Safari",
    travelDate: "June 2026",
    rating: 5,
    message: "We saw herds of elephants and even a leopard at Yala! The custom tour vehicle was extremely comfortable and our guide has an amazing eye for wildlife spotting. Absolutely perfect transport service.",
    createdAt: "2026-06-04T00:00:00.000Z",
    status: "Approved"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

  // API endpoints
  app.get("/api/reviews", async (req, res) => {
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyah_5FHLkRR2LnWBv4p1ZlMQEUoqrjXnJmr5TVcyNun-UwOY-uyOzf7fLaSW13XjlI/exec");
      
      if (response.status === 403) {
        return res.status(200).json({
          status: "success",
          isDemo: true,
          message: "Google Apps Script permissions are not set to 'Anyone'. Please deploy your Apps Script Web App with 'Execute as: Me' and 'Who has access: Anyone'.",
          reviews: SEED_REVIEWS
        });
      }

      if (!response.ok) {
        throw new Error(`Google Apps Script API responded with status: ${response.status}`);
      }
      
      const text = await response.text();
      
      // If the response is HTML, it's likely a Google login/permission redirect
      if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
        return res.status(200).json({
          status: "success",
          isDemo: true,
          message: "Google Apps Script returned an HTML page instead of JSON. Please deploy your Apps Script Web App with 'Execute as: Me' and 'Who has access: Anyone'.",
          reviews: SEED_REVIEWS
        });
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response from Google Apps Script Web App`);
      }
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      res.status(200).json({ 
        status: "success",
        isDemo: true,
        message: `Could not connect to Google Sheets API: ${error.message || "Unknown error"}. Showing offline fallback reviews.`,
        reviews: SEED_REVIEWS 
      });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const { name, rating, review, date, status, country, tourName, profileImage } = req.body;
      
      const payload = {
        name: name || "Anonymous Guest",
        rating: rating || 5,
        review: review || "",
        date: date || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        status: status || "Pending",
        country: country || "",
        tourName: tourName || "",
        profileImage: profileImage || ""
      };

      const response = await fetch("https://script.google.com/macros/s/AKfycbyah_5FHLkRR2LnWBv4p1ZlMQEUoqrjXnJmr5TVcyNun-UwOY-uyOzf7fLaSW13XjlI/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 403) {
        return res.status(200).json({
          status: "error",
          errorType: "PERMISSION_DENIED",
          message: "Google Apps Script permissions are not set to 'Anyone'. Please deploy your Apps Script Web App with 'Execute as: Me' and 'Who has access: Anyone'."
        });
      }

      if (!response.ok) {
        throw new Error(`Google Apps Script API responded with status: ${response.status}`);
      }

      const text = await response.text();
      
      if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
        return res.status(200).json({
          status: "error",
          errorType: "PERMISSION_DENIED",
          message: "Google Apps Script returned an HTML page instead of JSON. Please deploy your Apps Script Web App with 'Execute as: Me' and 'Who has access: Anyone'."
        });
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { result: "success", raw: text };
      }

      res.json(data);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      res.status(200).json({ 
        status: "error",
        errorType: "SERVER_ERROR",
        message: error.message || "Failed to submit review" 
      });
    }
  });

  app.post("/api/track-whatsapp", async (req, res) => {
    try {
      const { date, time, url, device, browser, referrer, country } = req.body;

      // Leverage edge or GFE headers for country if available
      const cfCountry = req.headers["cf-ipcountry"] || req.headers["x-appengine-country"];
      const finalCountry = cfCountry ? String(cfCountry) : (country || "Unknown");

      const payload = {
        date: date || new Date().toLocaleDateString("en-US"),
        time: time || new Date().toLocaleTimeString("en-US"),
        url: url || "",
        device: device || "Desktop",
        browser: browser || "",
        referrer: referrer || "Direct",
        country: finalCountry
      };

      const response = await fetch("https://script.google.com/macros/s/AKfycbw2gaHNchHc9POEqOi703mP_z4ioyXw3je-sw0sOxMbT21HTWyfpkWKLEvcTsPcd8U/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Google Apps Script API responded with status: ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { result: "success", raw: text };
      }

      res.json(data);
    } catch (error: any) {
      console.error("Error tracking WhatsApp click:", error);
      res.status(200).json({
        status: "error",
        message: error.message || "Failed to log WhatsApp click tracking"
      });
    }
  });

  // SEO: Serve robots.txt directly
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(
`User-agent: *
Allow: /
Sitemap: https://hazitours.com/sitemap.xml
`
    );
  });

  // SEO: Serve XML Sitemap directly
  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    const today = new Date().toISOString().split('T')[0];
    const languages = ["en", "de", "fr", "es"];
    const routes = ["", "tours", "events", "gallery"];
    
    let xmlUrls = "";
    languages.forEach((lang) => {
      routes.forEach((route) => {
        const urlPath = route ? `/${lang}/${route}` : `/${lang}/`;
        const priority = route === "" ? "1.0" : "0.8";
        xmlUrls += `
  <url>
    <loc>https://hazitours.com${urlPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
      });
    });

    res.send(
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlUrls}
</urlset>`
    );
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
