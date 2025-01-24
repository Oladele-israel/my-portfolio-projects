// types/express.d.ts
import "express";

declare module "express" {
  interface Request {
    user?: { id: string; email: string }; // Define the shape of the `user` object
  }
}
