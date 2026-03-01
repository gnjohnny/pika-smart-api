import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";

export const checkAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.pikasmart_jwt_tk;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing - Unauthorised",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as jwt.JwtPayload;

    if (!decoded || !decoded.email) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid authentication token" });
    }

    const userEmail = await User.findOne({ email: decoded.email });
    if (!userEmail) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    req.user = userEmail;
    next();
  } catch (error: any) {
    console.log("error in checkAuthMiddleware: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
