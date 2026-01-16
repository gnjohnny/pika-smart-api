import { Schema, model, type InferSchemaType } from "mongoose";
import { ingredientSchema } from "./ingredients.model";

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ingredients: [ingredientSchema],
    instructions: {
      type: [String],
      required: true,
    },
    prep_time: {
      type: Number,
      required: true,
      min: 0,
    },
    cook_time: {
      type: Number,
      required: true,
      min: 0,
    },
    servings: {
      type: Number,
      required: true,
      min: 1,
    },
    generated_by_AI: {
      type: Boolean,
      default: true,
    },
    favourited: {
      type: Boolean,
      default: false,
    },
    trashed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export type RecipeType = InferSchemaType<typeof recipeSchema>;

export const RecipeModel = model<RecipeType>("Recipe", recipeSchema);
