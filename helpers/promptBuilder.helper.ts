export function buildRecipePromptWithIngredientsProvided(
  ingredients: RecipeRequestBody["ingredients"],
): string {
  const ingredientList = ingredients
    .map((ing) => {
      return `- ${ing}`;
    })
    .join("\n");
  return `
You are a professional Kenyan home chef.

Create a SIMPLE Kenyan-friendly recipe using ONLY the ingredients listed below.

Ingredients available:
${ingredientList}

Then even if the essentials for cooking such as cooking oil salt etc are not provided just add them to the list of ingredients you are provided with.

Rules:
- Prefer common Kenyan meals and cooking styles
- No exotic ingredients
- Use simple cooking steps
- Output STRICT JSON ONLY (no markdown, no explanations)
- Remember to include everything in the json to prevent errors in my database

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

If the ingredients provided you're unable to use to generate a recipe instead of using the json format above use this instead:
{
    "reason": ' ',
}
`;
}
