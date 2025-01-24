import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pool from "./utils/db";
import userRouter from "./routes/user.routes";

dotenv.config();

const app: Application = express();

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is running successfully!" });
});

app.use("/user", userRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, async () => {
  try {
    await pool.connect();
    console.log("Connected to the database");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
});
