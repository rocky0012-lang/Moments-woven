import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/generate-quotes", async (req, res) => {
    const { name, activity, place } = req.body;
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const styles = [
        "a minimalist beatnik writing on a napkin",
        "a cyberpunk hacker hiding in a neon alley",
        "a noir detective narrating a rainy night",
        "a zen monk observing a mountain peak",
        "a gritty industrial mechanic in a steam-filled room",
        "a surrealist painter describing a melting clock",
        "a brutalist architect analyzing a concrete slab",
        "a frantic wartime telegraph operator",
        "a cynical street poet watching a sunset",
        "a nostalgic analog radio host through heavy static",
        "a desert nomad reading constellations",
        "a clockmaker in a city of gears",
        "a deep-sea diver narrating the abyss"
      ];
      const style = styles[Math.floor(Math.random() * styles.length)];
      const seed = Math.random().toString(36).substring(2) + Date.now();

      const prompt = `Write a completely unique 10-to-1 countdown for ${name}.
      PRIMARY THEME: ${activity} in ${place}
      PERSONA: ${style}
      ENTROPY_SEED: ${seed}

      MANDATORY REQUIREMENTS:
      1. Every single quote MUST BE COMPLETELY UNIQUE and visceral.
      2. NEVER use the same 'imageKeyword' twice in the same list.
      3. For EACH 'imageKeyword', provide a highly specific, high-contrast visual subject (e.g., 'cracked-glacier', 'molten-copper', 'spider-silk', 'obsidian-fragment', 'stormy-horizon', 'pulsing-neon').
      4. Avoid generic keywords or repetitions of '${activity}'.
      5. The 'imageKeyword' should be 2 hyphenated words representing a distinct texture or object.

      Output JSON array of 10 objects: {number: int, text: string, type: string, imageKeyword: string}`;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction: `You are a radical literary writer who hates repetition, templates, and cliché. Your current persona is ${style}.
          NEVER use phrases like 'Just one language left', 'Syncing with the rhythm', 'Captured a fragment', or 'Your legacy'.
          Every response must be a completely new invention. Use sharp, odd, and visceral language.
          Strictly output JSON.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.INTEGER },
                text: { type: Type.STRING },
                type: { 
                  type: Type.STRING,
                  enum: ['funny', 'deep', 'short', 'motivational']
                },
                imageKeyword: { type: Type.STRING }
              },
              required: ['number', 'text', 'type', 'imageKeyword']
            }
          }
        }
      });

      const responseText = result.text;
      if (!responseText) {
        throw new Error("AI returned no text");
      }
      
      const quotes = JSON.parse(responseText.replace(/```json\n?|\n?```/g, "").trim());
      res.json(quotes);

    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ 
        error: "Generation failed", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
