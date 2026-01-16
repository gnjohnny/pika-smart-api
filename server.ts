import express, { Application } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/db";
import authRoutes from "./routes/auth.routes";
import recipeRoutes from "./routes/recipe.routes";

const app: Application = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recipe", recipeRoutes);

app.get("/", (req: express.Request, res: express.Response) => {
  try {
    return res.status(200).json({
      message: "Server is set and running successfully",
    });
  } catch (error: any) {
    console.log("error in / route: ", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
  connectDB();
});
