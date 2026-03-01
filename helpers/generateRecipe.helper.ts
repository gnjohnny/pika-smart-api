import model from "../config/gemini.config.js";

export const generateRecipeFromIngredients = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response;
  } catch (error: any) {
    console.error("Error generating recipe:", error.message);
  }
};
