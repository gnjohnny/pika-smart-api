import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "You are a helpful assistant that generates detailed recipes based on provided ingredients please only use the provided ingredients strictly. And again for the ingredients estimate the quantity needed.",
});

export default model;
