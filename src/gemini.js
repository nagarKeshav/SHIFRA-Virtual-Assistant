import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// ✅ Use your Gemini API key
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// ✅ Use V1 endpoint
const genAI = new GoogleGenerativeAI(apiKey, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1",
});

export default async function run(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash-latest", // ✅ Updated to latest Gemini model
    });

    const result = await model.generateContent([prompt]);
    const response = result.response;
    const text = response.text();

    console.log("Gemini Response:", response);
    console.log("Generated Text:", text);

    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, something went wrong.";
  }
}
