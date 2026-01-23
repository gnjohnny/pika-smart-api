import { Schema } from "mongoose";

export const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);
