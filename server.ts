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
      You are an expert copywriter fluent in Bengali, English, and Hindi, specializing in writing festival greetings and wishes.
      The user is celebrating or commemorating the following special day:
      Event Title: "${eventTitle}"
      Category: "${category || "general"}"

      Generate custom creative wishes, social media captions, and messages.
      You MUST respond ONLY with a JSON object containing the exact following keys:
      - "wishesBn": Array of 3 beautiful, highly respectful, and touching wishes/messages in Bengali.
      - "wishesEn": Array of 3 beautiful wishes/messages in English.
      - "wishesHi": Array of 3 beautiful wishes/messages in Hindi.
      - "fbCaption": A catchy Facebook caption (with appropriate emojis) mixing Bengali/Hindi/English as appropriate.
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

// API: Generate Direct AI Image via Imagen / Gemini
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const { prompt, apiKey: clientApiKey, aspectRatio = "1:1", style = "festive" } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;
    if (!apiKeyToUse) {
      return res.status(401).json({ error: "Gemini API Key is required. Please enter your API key in the UI." });
    }

    // Attempt Imagen 3 REST API call with provided API Key
    const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKeyToUse}`;
    
    const response = await fetch(imagenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: aspectRatio,
          outputMimeType: "image/png"
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
        const mime = data.predictions[0].mimeType || "image/png";
        const imageUrl = `data:${mime};base64,${data.predictions[0].bytesBase64Encoded}`;
        return res.json({ imageUrl, success: true });
      }
    }

    // Fallback attempt: gemini-3.1-flash-lite-image or gemini-2.5-flash generateContent
    const genaiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKeyToUse}`;
    const genRes = await fetch(genaiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"]
        }
      })
    });

    if (genRes.ok) {
      const genData = await genRes.json();
      const parts = genData.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          const imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          return res.json({ imageUrl, success: true });
        }
      }
    }

    // If API responded with error message
    const errText = await response.text();
    return res.status(400).json({ error: "Image generation failed", details: errText });
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    return res.status(500).json({ 
      error: "Failed to generate image via Gemini AI", 
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
