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
  prep_time: number,
  cook_time: number,
  servings: number
}
`;
}
