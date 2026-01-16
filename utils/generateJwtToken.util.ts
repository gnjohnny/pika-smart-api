import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateJwtToken = (res: Response, email: string) => {
  try {
    const pikasmart_jwt_tk = jwt.sign(
      { email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );
    res.cookie("pikasmart_jwt_tk", pikasmart_jwt_tk, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  } catch (error) {
    throw new Error("Failed to generate JWT token");
  }
};
