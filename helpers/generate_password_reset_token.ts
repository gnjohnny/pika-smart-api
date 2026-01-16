import jwt from "jsonwebtoken";

export const generatePasswordResetToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "10m",
  });
  return token;
};
