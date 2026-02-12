import { Router } from "express";
import { checkAuthMiddleware } from "../middleware/checkAuth.middleware";
import {
  deleteAllTrashedRecipeController,
  favouriteRecipeController,
  generateRecipeController,
  getAllRecipesController,
  getFavouriteRecipesController,
  getTrashedRecipesController,
  getUserRecipesController,
  moveRecipeToTrashController,
  saveRecipeController,
  getFullRecipeInfo,
} from "../controllers/recipe.controllers";

const router = Router();

//this route helps to get all recipes
router.get("/all", getAllRecipesController);

//this route helps to retrieve full info about a specific recipe

router.get("/recipe-info/:id", getFullRecipeInfo);

//this route helps to get all recipes for a user from database
router.get("/my-recipes", checkAuthMiddleware, getUserRecipesController);

//this route helps to get all favourite recipes for a user from database
router.get(
  "/favourite-recipes",
  checkAuthMiddleware,
  getFavouriteRecipesController,
);

//this route helps to get trashed recipes for a user from database
router.get(
  "/trashed-recipes",
  checkAuthMiddleware,
  getTrashedRecipesController,
);

//this routes will help generate a recipe
router.post("/generate", generateRecipeController);

//this route helps to save a recipe only when authenticated
router.patch("/save/:id", checkAuthMiddleware, saveRecipeController);

//this route will help to favourite a recipe
router.patch("/favourite/:id", checkAuthMiddleware, favouriteRecipeController);

//this route will hwlp trash a recipe for later deletion
router.patch(
  "/move-to-trash/:id",
  checkAuthMiddleware,
  moveRecipeToTrashController,
);

//this route will help to delete recipe
router.delete("/delete", checkAuthMiddleware, deleteAllTrashedRecipeController);

export default router;
