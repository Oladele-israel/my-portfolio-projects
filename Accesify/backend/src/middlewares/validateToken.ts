import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";

export interface CustomRequest extends Request {
  user?: { id: string; email: string };
}

export const validateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "No tokens provided" });
  }

  try {
    // Verify the access token
    if (accessToken) {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as {
        id: string;
        email: string;
      };
      req.user = decoded; // Attach the user to the request object
      return next(); // Pass control to the next middleware or route handler
    }
  } catch (accessTokenError) {
    // Access token is expired or invalid
    if (!refreshToken) {
      return res.status(401).json({
        message: "Access token expired and no refresh token provided",
      });
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
        id: string;
        email: string;
      };

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      // Set the new access token as an HTTP-only cookie
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      req.user = decoded; // Attach the user to the request object
      return next(); // Pass control to the next middleware or route handler
    } catch (refreshTokenError) {
      console.error("Error verifying refresh token:", refreshTokenError);
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }
  }
};
