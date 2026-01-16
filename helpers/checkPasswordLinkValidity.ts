import jwt from "jsonwebtoken";

export const validateToken = (token: string): TokenReturnType => {
  if (!token) return { valid: false, reason: "missing" };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    return { valid: true, decoded };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, reason: "expired" };
    }
    return { valid: false, reason: "invalid" };
  }
};
