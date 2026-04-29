import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not defined in .env file");
}

const genAI = new GoogleGenerativeAI(apiKey || "missing_key");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: `Return ONLY JSON:
{
  "stressLevel": "LOW" | "MEDIUM" | "HIGH",
  "stressScore": number (1-10),
  "emotionalState": "string",
  "insight": "string",
  "suggestions": ["string", "string", "string"],
  "affirmation": "string"
}`
});

export const analyzeStress = async (text) => {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  try {
    const result = await model.generateContent(text);
    const response = await result.response;
    const textOutput = response.text();
    
    // Clean potential markdown formatting
    const cleanedText = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to analyze text. Please try again.");
  }
};
