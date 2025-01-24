import express, { Router } from "express";
import { signup, googleAuth, validuser } from "../controllers/user.controller";
import { validateToken } from "../middlewares/validateToken";

const userRouter: Router = express.Router();

// Define the signup route
userRouter.post("/signup", signup);
userRouter.post("/auth/google", googleAuth);
userRouter.get(
  "/validUser",
  validateToken as express.RequestHandler,
  validuser
);

export default userRouter;
