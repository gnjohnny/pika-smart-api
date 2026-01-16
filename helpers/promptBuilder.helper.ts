/**
 * Builds a text prompt (for an LLM) that instructs a professional Kenyan home chef to create a simple recipe using only the provided ingredients.
 *
 * @param ingredients - List of ingredient objects from the recipe request body
 * @returns A multi-line prompt string containing the ingredient list and rules that require the response to be STRICT JSON with fields: `title`, `description`, `ingredients` (array of `{ name, quantity, unit }`), `instructions`, `prep_time`, `cook_time`, and `servings`
 */
export function buildRecipePromptWithIngredientsProvided(
  ingredients: RecipeRequestBody["ingredients"]
): string {
  const ingredientList = ingredients
    .map((ing) => {
      return `- ${ing.quantity} ${ing.unit} of ${ing.name}`;
    })
    .join("\n");
  return `
You are a professional Kenyan home chef.

Create a SIMPLE Kenyan-friendly recipe using ONLY the ingredients listed below.

Ingredients available:
${ingredientList}

Rules:
- Prefer common Kenyan meals and cooking styles
- No exotic ingredients
- Use simple cooking steps
- Output STRICT JSON ONLY (no markdown, no explanations)

JSON format:
{
  "title": "",
  "description": "",
  "ingredients": [
    { "name": "", "quantity": number, "unit": "" }
  ],
  "instructions": [],
  prep_time: 0,
  cook_time: 0,
  servings: 0
}
`;
}