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

const router = Router();

//get user details route adn check if user is authenticated
router.get("/me", checkAuthMiddleware, (req: Request, res: Response) => {
  try {
    const me = req.user;
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
