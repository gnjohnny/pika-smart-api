import { Schema } from "mongoose";

export const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: [
        "grams",
        "ml",
        "cups",
        "tablespoons",
        "teaspoons",
        "pieces",
        "kg",
        "liters",
      ],
    },
  },
  { _id: false }
);
