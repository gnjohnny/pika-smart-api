import { Request, Response } from "express";
import { User } from "../models/user.model";
import { buildRecipePromptWithIngredientsProvided } from "../helpers/promptBuilder.helper";
import { generateRecipeFromIngredients } from "../helpers/generateRecipe.helper";
import { RecipeModel } from "../models/recipe.model";

export const getAllRecipesController = async (req: Request, res: Response) => {
  try {
    const recipes = await RecipeModel.find({});
    if (recipes.length === 0) {
      return res.status(404).json({
        message: "No recipes found",
      });
    }
    return res.status(200).json({
      message: "All recipes fetched successfully",
      recipes,
    });
  } catch (error: any) {
    console.log("error in getAllRecipesController: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserRecipesController = async (req: Request, res: Response) => {
  try {
    const user: UserDocument = req.user;

    if (!user?._id) {
      return res.status(401).json({
        message: "Unauthorized - please log in or create an account",
      });
    }

    const checkUser: UserDocument = await User.findById(user._id).populate({
      path: "saved_recipes",
      match: { trashed: { $ne: true } },
    });

    if (!checkUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User recipes fetched successfully",
      saved_recipes: checkUser.saved_recipes,
    });
  } catch (error: any) {
    console.log("error in getUserRecipesController: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getFavouriteRecipesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user: UserDocument = req.user;

    if (!user?._id) {
      return res.status(401).json({
        message: "Unauthorized - please log in or create an account",
      });
    }

    const checkUser: UserDocument = await User.findById(user._id).populate({
      path: "favourite_recipes",
      match: { favourited: { $ne: false } },
    });

    if (!checkUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Favourite recipes fetched successfully",
      favourite_recipes: checkUser.favourite_recipes,
    });
  } catch (error: any) {
    console.log("error in getFavouriteRecipesController: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTrashedRecipesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user: UserDocument = req.user;

    if (!user?._id) {
      return res.status(401).json({
        message: "Unauthorized - please log in or create an account",
      });
    }

    const checkUser: UserDocument = await User.findById(user._id).populate({
      path: "trashed_recipes",
      match: { trashed: { $ne: false } },
    });

    if (!checkUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Trashed recipes fetched successfully",
      trashed_recipes: checkUser.trashed_recipes,
    });
  } catch (error: any) {
    console.log("error in getTrashedRecipesController: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const generateRecipeController = async (req: Request, res: Response) => {
  try {
    const { ingredients }: RecipeRequestBody = req.body;
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        message: "Ingredients are required to generate a recipe",
      });
    }
    const prompt = buildRecipePromptWithIngredientsProvided(ingredients);
    const result = await generateRecipeFromIngredients(prompt);

    if (!result) {
      return res.status(500).json({
        message: "Failed to generate recipe",
      });
    }

    const jsonStart = result.text().indexOf("{");
    const jsonEnd = result.text().lastIndexOf("}");

    const cleanedJson = result.text().substring(jsonStart, jsonEnd + 1);
    const recipe = JSON.parse(cleanedJson);

    if (!recipe) {
      return res.status(500).json({
        message: "Failed to parse generated recipe",
      });
    }

    if (recipe.reason) {
      return res.status(200).json({
        message: "Failed to generate a recipe - invalid ingredients",
        reason: recipe.reason,
      });
    }

    const newRecipe = new RecipeModel(recipe);
    await newRecipe.save();

    return res.status(200).json({
      success: true,
      message: "Recipe generated successfully",
      newRecipe,
    });
  } catch (error: any) {
    console.log("error in generateRecipeController: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const saveRecipeController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: UserDocument = req.user;

    if (!user?._id) {
      return res.status(401).json({
        message: "Unauthorized - please log in or create an account",
      });
    }

    const checkUser: UserDocument = await User.findById(user._id);

    if (!checkUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { saved_recipes: recipe._id },
    });

    return res.status(200).json({
      message: "Recipe saved successfully",
    });
  } catch (error: any) {
    console.log("error in saveRecipeController: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const favouriteRecipeController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const user: UserDocument = req.user;

    if (!user?._id) {
      return res.status(401).json({
        message: "Unauthorized - please log in or create an account",
      });
    }

    const checkUser: UserDocument = await User.findById(user._id);

    if (!checkUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { favourite_recipes: recipe._id },
    });

    recipe.favourited = true;
    recipe.save();

    return res.status(200).json({
      message: "Recipe favourited successfully",
    });
  } catch (error: any) {
    console.log("error in favouriteRecipeController: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const moveRecipeToTrashController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const user: UserDocument = req.user;

    if (!user?._id) {
      return res.status(401).json({
        message: "Unauthorized - please log in or create an account",
      });
    }

    const checkUser: UserDocument = await User.findById(user._id);

    if (!checkUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { trashed_recipes: recipe._id },
    });

    recipe.trashed = true;
    recipe.save();

    return res.status(200).json({
      message: "Recipe moved to trash successfully",
    });
  } catch (error: any) {
    console.log("error in moveRecipeToTrashController: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteAllTrashedRecipeController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user: UserDocument = req.user;

    if (!user?._id) {
      return res.status(401).json({
        message: "Unauthorized - please log in or create an account",
      });
    }

    const checkUser: UserDocument = await User.findById(user._id);

    if (!checkUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    checkUser.trashed_recipes.length = 0;
    await checkUser.save();

    return res.status(200).json({
      message: "Recipe deleted successfully",
    });
  } catch (error: any) {
    console.log("error in deleteAllTrashedRecipeController: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
