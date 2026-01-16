import { RecipeType } from "../models/recipe.model";
import { UserType } from "../models/user.model";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
  type UserDocument = HydratedDocument<UserType>;
  type TokenReturnType =
    | { valid: true; decoded: any }
    | { valid: false; reason: "expired" | "invalid" | "missing" };

  type RecipeDocument = HydratedDocument<RecipeType>;
}
