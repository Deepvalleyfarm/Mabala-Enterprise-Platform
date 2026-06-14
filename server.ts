import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure local DNS resolution is fast
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent for tracking
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI queries will fall back to smart local simulation.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. AI Recommendation Engine Route (Server-Side proxy for Gemini)
app.post("/api/ai/recommend", async (req, res) => {
  const { topic, context } = req.body;

  try {
    const ai = getGeminiClient();
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Return highly structured, informative simulation if key is missing
      return res.json({
        success: true,
        text: `[Local Simulation Engine] Recommending actions for **${topic}**:\n\n1. **Optimize Input Allocation**: Based on regional metrics for ${context || "Zambia agriculture"}, prioritize nitrogen-rich organic additions early in weather cycles.\n2. **Pest & Vector Mitigation**: Maintain active surveillance vectors specifically around horticulture zones. Recommended treatment schedule: 10-day intervals.\n3. **Liquidity Management**: Balance credit buffers to cover immediate fodder/feed requirements.\n\n*Note: Configure a valid GEMINI_API_KEY in Secrets to activate full generative recommendations.*`,
        source: "Local Simulation"
      });
    }

    const systemPrompt = `You are MEAP-AI, the advanced, agricultural recommendation intelligence engine for the Mabala Enterprise Administration Platform (MEAP).
Providing advice optimized for farming operations (cereals, legumes, livestock, poultry, aquaculture, veterinary) across Zambia and sub-Saharan Africa.
Analyze user questions/contexts and output fully detailed, business-oriented, and structured professional recommendations. Keep answers elegant and formatted in clear markdown.`;

    const promptText = `User query on topic ${topic}. Context details: ${JSON.stringify(context)}. Provide detailed multi-step insights, action items, costs/risk scoring, and regional African agricultural forecasts.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || "No prompt details returned.",
      source: "Gemini 3.5 Flash"
    });
  } catch (error: any) {
    console.error("Gemini server error: ", error);
    res.status(500).json({
      success: false,
      error: error?.message || "An error occurred during AI processing."
    });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Setup Vite Development or Production Mode
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode, attaching Vite dev server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode, serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MEAP Full-stack Server listening at http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap server: ", err);
});
