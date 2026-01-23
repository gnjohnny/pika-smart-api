import { Router } from "express";
import { Request, Response } from "express";
import {
  requestPasswordResetLinkController,
  resetPasswordController,
  signInController,
  signOutController,
  signUpController,
} from "../controllers/auth.controllers";
import { checkAuthMiddleware } from "../middleware/checkAuth.middleware";
import { User } from "../models/user.model";

const router = Router();

//get user details route adn check if user is authenticated
router.get("/me", checkAuthMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("UnAuthorised");
    }
    const me = await User.findOne({ email: req.user.email }).populate(
      "saved_recipes favourite_recipes trashed_recipes",
    );
    return res.status(200).json({
      user: me,
    });
  } catch (error: any) {
    console.log("error in /auth/me route: ", error.message);
  }
});

//sign up, sign in and sign out routes
router.post("/sign-up", signUpController);
router.post("/sign-in", signInController);
router.post("/sign-out", signOutController);

//forgot password routes
router.post("/request-password-reset-link", requestPasswordResetLinkController);
router.patch("/reset-password/:token", resetPasswordController);

export default router;
