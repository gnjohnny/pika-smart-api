import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateJwtToken } from "../utils/generateJwtToken.util";
import { generatePasswordResetToken } from "../helpers/generate_password_reset_token";
import { validateToken } from "../helpers/checkPasswordLinkValidity";

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    //check if email is valid

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    //check password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Create new user
    const newUser: UserDocument = new User({ email, password });
    await newUser.save();

    generateJwtToken(res, email);

    const {password: _, ...userWithoutPassword} = newUser.toObject();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully", userWithoutPassword });
  } catch (error: any) {
    console.log("error in /auth/sign-up route: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const signInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const user: UserDocument = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found - try again with a different email or create an account" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateJwtToken(res, email);
    return res
      .status(200)
      .json({ success: true, message: "User signed in successfully", user });
  } catch (error: any) {
    console.log("error in /auth/sign-in route: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const signOutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("pikasmart_jwt_tk");
    return res
      .status(200)
      .json({ success: true, message: "User signed out successfully" });
  } catch (error: any) {
    console.log("error in /auth/sign-out route: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const requestPasswordResetLinkController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user: UserDocument = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const passwordResetToken = generatePasswordResetToken(email);

    const resetpasswordLink = `${process.env.CLIENT_URL}/reset-password?_token=${passwordResetToken}`;

    return res.status(200).json({
      success: true,
      message: "Password reset link generated successfully",
      resetpasswordLink,
    });
  } catch (error: any) {
    console.log(
      "error in /auth/request-password-reset-link route: ",
      error.message
    );
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const token = Array.isArray(req.params.token)
      ? req.params.token[0]
      : req.params.token;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New password is required" });
    }

    const result = validateToken(token);

    if (result.valid) {
      const decoded = result.decoded as { email: string };
      const user: UserDocument = await User.findOne({ email: decoded.email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      user.password = newPassword;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    } else {
      switch (result.reason) {
        case "missing":
          return res.status(400).json({
            success: false,
            message: "No reset token found in the request",
          });
        case "invalid":
          return res.status(400).json({
            success: false,
            message: "Your link is invalid - try to generate a new one",
          });
        case "expired":
          return res.status(400).json({
            success: false,
            message: "The reset link has expired - try to generate a new one",
          });
      }
    }
  } catch (error: any) {
    console.log("error in /auth/reset-password/:token route: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
