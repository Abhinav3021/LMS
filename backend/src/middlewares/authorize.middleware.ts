import { Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { AuthRequest } from "./auth.middleware";

const authorize =
  (...allowedRoles: string[]) =>
  (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new AppError(
          "Unauthorized",
          401
        )
      );
    }

    const userRole =
      req.user.role;

    if (
      userRole ===
      "ADMIN"
    ) {
      return next();
    }

    if (
      !allowedRoles.includes(
        userRole
      )
    ) {
      return next(
        new AppError(
          "Forbidden: Access denied",
          403
        )
      );
    }

    next();
  };

export default authorize;