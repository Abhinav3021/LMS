import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string; role: string };

    req.user = decoded;

    next();
  } catch {
    next(new AppError("Invalid token", 401));
  }
};

export default authMiddleware;