import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import tournamentRoutes from "./routes/tournament.routes.js"
import { errorMiddleware } from "./middlewares/error.middleware.js"
import adminDashboardRoutes from "./routes/adminDashboard.routes.js"
import userDashboardRoutes from "./routes/userDashboard.routes.js"
import transactionRoutes from "./routes/transaction.routes.js"
const app = express();
app.disable("x-powered-by");
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api",authRoutes)
app.use("/api",tournamentRoutes)
app.use("/api",userDashboardRoutes)
app.use("/api",adminDashboardRoutes)
app.use("/api",transactionRoutes)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BGMI Tournament API is running 🚀"
  });
});
app.use(errorMiddleware)



export default app;