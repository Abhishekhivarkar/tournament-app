import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import tournamentRoutes from "./routes/tournament.routes.js"
import { errorMiddleware } from "./middlewares/error.middleware.js"

const app = express();
app.disable("x-powered-by");
app.use(cookieParser())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api",authRoutes)
app.use("/api",tournamentRoutes)

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BGMI Tournament API is running 🚀"
  });
});
app.use(errorMiddleware)



export default app;