import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily if key is available
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

// API: Generate AI Wishes and Captions
app.post("/api/gemini/generate-wishes", async (req, res) => {
  try {
    const { eventTitle, category } = req.body;
    if (!eventTitle) {
      return res.status(400).json({ error: "Event title is required" });
    }

    const client = getGeminiClient();
    const prompt = `
      You are an expert copywriter fluent in Bengali and English, specializing in writing festival greetings and wishes.
      The user is celebrating or commemorating the following special day:
      Event Title: "${eventTitle}"
      Category: "${category || "general"}"

      Generate custom creative wishes, social media captions, and messages.
      You MUST respond ONLY with a JSON object containing the exact following keys:
      - "wishesBn": Array of 3 beautiful, highly respectful, and touching wishes/messages in Bengali.
      - "wishesEn": Array of 3 beautiful wishes/messages in English.
      - "fbCaption": A catchy Facebook caption (with appropriate emojis) mixing Bengali and English if appropriate, or purely Bengali.
      - "waMessage": A warm, neatly spaced WhatsApp message for sharing with family and friends.
      - "xPost": A concise Twitter/X post under 250 characters with appropriate hashtags.
      - "hashtags": Array of 4-5 relevant trending hashtags (no '#' prefix in the array items).

      Do not wrap the JSON response in backticks or markdown formatting. Produce raw valid JSON.
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini Wishes Error:", error);
    return res.status(500).json({ 
      error: "Failed to generate wishes via AI", 
      details: error.message 
    });
  }
});

// API: Generate Poster Design Concept & Custom Quote
app.post("/api/gemini/generate-poster-concept", async (req, res) => {
  try {
    const { eventTitle } = req.body;
    if (!eventTitle) {
      return res.status(400).json({ error: "Event title is required" });
    }

    const client = getGeminiClient();
    const prompt = `
      Create a stunning digital poster concept for the special day: "${eventTitle}".
      Provide recommendations for visual elements to render on a canvas.
      
      You MUST respond ONLY with a JSON object containing the exact following keys:
      - "quoteBn": A deep, meaningful, or spiritual quote related to the day in Bengali (max 100 characters).
      - "quoteEn": Same quote translated or adapted in English (max 100 characters).
      - "bgType": "gradient" or "solid" or "ambient"
      - "bgStartColor": Hex code of a beautiful, premium starting color (e.g., "#1e1b4b" or "#fff7ed")
      - "bgEndColor": Hex code of a beautiful ending color (e.g., "#311042" or "#fed7aa")
      - "textColor": Hex code for the primary title text (e.g., "#ffffff" or "#431407")
      - "accentColor": Hex code for highlight borders/decorations (e.g., "#f59e0b" or "#16a34a")
      - "layoutStyle": "minimal", "festive", "technical", or "editorial"
      - "decorations": A list of 2-3 visual design suggestions (e.g., "Mandalas at borders", "Golden lights", "Leaf patterns")
      
      Do not wrap in backticks. Return raw JSON.
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini Poster Concept Error:", error);
    return res.status(500).json({ 
      error: "Failed to generate poster concept", 
      details: error.message 
    });
  }
});

// Setup Vite Dev server or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
