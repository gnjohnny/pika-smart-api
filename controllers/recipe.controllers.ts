import { Request, Response } from "express";
import { SortOrder } from "mongoose";
import { User } from "../models/user.model";
import { buildRecipePromptWithIngredientsProvided } from "../helpers/promptBuilder.helper";
import { generateRecipeFromIngredients } from "../helpers/generateRecipe.helper";
import { RecipeModel } from "../models/recipe.model";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getAllRecipesController = async (req: Request, res: Response) => {
  try {
    const { title, sortby } = req.query;
    const pageNum = Math.max(Number(req.query.page) || 1, 1);
    const limitNum = Math.max(Number(req.query.limit) || 10, 1);

    const filter =
      typeof title === "string"
        ? { title: { $regex: escapeRegex(title), $options: "i" } }
        : {};

    const sortOption: Record<string, SortOrder> = {};
    if (sortby === "newest") sortOption.createdAt = -1;
    if (sortby === "oldest") sortOption.createdAt = 1;
    if (sortby === "title") sortOption.title = 1;

    const skip = (pageNum - 1) * limitNum;

    const recipes = await RecipeModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalRecipes = await RecipeModel.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalRecipes / limitNum), 1);

    return res.status(200).json({
      message: "All recipes fetched successfully",
      recipes,
      totalRecipes,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error: any) {
    console.log("error in getAllRecipesController:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFullRecipeInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json({
      message: "Recipe info fetched successfully",
      recipe,
    });
  } catch (error: any) {
    console.log("Error in getFullRecipeInfo: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
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

    const { title, sortby, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const recipeFilter: any = {};

    if (typeof title === "string") {
      recipeFilter.title = { $regex: escapeRegex(title), $options: "i" };
    }

    const sortOption: Record<string, SortOrder> = {};
    if (sortby === "newest") sortOption.createdAt = -1;
    if (sortby === "oldest") sortOption.createdAt = 1;
    if (sortby === "title") sortOption.title = 1;

    const userDoc = await User.findById(user._id).select("saved_recipes");
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkUser = await User.findById(user._id).populate({
      path: "saved_recipes",
      match: recipeFilter,
      options: {
        sort: sortOption,
        skip,
        limit: limitNum,
      },
    });

    const totalRecipes = await RecipeModel.countDocuments({
      _id: { $in: userDoc.saved_recipes },
      ...recipeFilter,
    });

    const totalPages = Math.max(Math.ceil(totalRecipes / limitNum), 1);

    return res.status(200).json({
      message: "User recipes fetched successfully",
      saved_recipes: checkUser?.saved_recipes,
      totalRecipes,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error: any) {
    console.log("error in getUserRecipesController:", error.message);
    return res.status(500).json({ message: "Internal server error" });
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

    const { title, sortby, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const recipeFilter: any = {};

    if (typeof title === "string") {
      recipeFilter.title = { $regex: escapeRegex(title), $options: "i" };
    }

    const sortOption: Record<string, SortOrder> = {};
    if (sortby === "newest") sortOption.createdAt = -1;
    if (sortby === "oldest") sortOption.createdAt = 1;
    if (sortby === "title") sortOption.title = 1;

    const userDoc = await User.findById(user._id).select("favourite_recipes");
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkUser: UserDocument = await User.findById(user._id).populate({
      path: "favourite_recipes",
      match: recipeFilter,
      options: {
        sort: sortOption,
        skip,
        limit: limitNum,
      },
    });

    const totalRecipes = await RecipeModel.countDocuments({
      _id: { $in: userDoc.favourite_recipes },
      ...recipeFilter,
    });
    const totalPages = Math.max(Math.ceil(totalRecipes / limitNum), 1);

    return res.status(200).json({
      message: "Favourite recipes fetched successfully",
      favourite_recipes: checkUser?.favourite_recipes,
      totalRecipes,
      totalPages,
      currentPage: pageNum,
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

    const { title, sortby, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const recipeFilter: any = {};

    if (typeof title === "string") {
      recipeFilter.title = { $regex: escapeRegex(title), $options: "i" };
    }

    let sortOption: Record<string, SortOrder> = {};

    if (sortby === "newest") sortOption.createdAt = -1;
    if (sortby === "oldest") sortOption.createdAt = 1;
    if (sortby === "title") sortOption.title = 1;

    const userDoc = await User.findById(user._id).select("trashed_recipes");
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkUser: UserDocument = await User.findById(user._id).populate({
      path: "trashed_recipes",
      match: recipeFilter,
      options: { sort: sortOption, skip, limit: limitNum },
    });

    const totalRecipes = await RecipeModel.countDocuments({
      _id: { $in: userDoc.trashed_recipes },
      ...recipeFilter,
    });

    const totalPages = Math.max(Math.ceil(totalRecipes / limitNum), 1);

    return res.status(200).json({
      message: "Trashed recipes fetched successfully",
      trashed_recipes: checkUser?.trashed_recipes,
      totalRecipes,
      totalPages,
      currentPage: pageNum,
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
      $pull: {
        saved_recipes: recipe._id,
        favourite_recipes: recipe._id,
      },
    });

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

export const restoreRecipeFromTrash = async (req: Request, res: Response) => {
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
        success: false,
        message: "User not found",
      });
    }

    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: checkUser._id, trashed_recipes: recipe._id },
      {
        $addToSet: {
          saved_recipes: recipe._id,
        },
        $pull: {
          trashed_recipes: recipe._id,
        },
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found in trash",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recipe restored successfully",
    });
  } catch (error: any) {
    console.log("Error in restoreRecipeFromTrash controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const unFavouriteRecipe = async (req: Request, res: Response) => {
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

    const updatedUser = await User.findOneAndUpdate(
      { _id: checkUser._id, favourite_recipes: recipe._id },
      {
        $pull: { favourite_recipes: recipe._id },
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found in favourites",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recipe removed from favourites successfully",
    });
  } catch (error: any) {
    console.log("Error in unfavourite recipe controller: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
