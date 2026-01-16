import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "You are a helpful assistant that generates detailed recipes based on provided ingredients please only use the provided ingredients strictly. And again let the unit of the ingredients quantity remain the same from the input to the output.",
});

export default model;
