import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import User from "./user.model";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        email: user.email,
      },
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await comparePassword(
      password,
      user.password
    );

    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
      },
    });
  }
);

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(
      req.user?.userId
    ).select("-password");

    res.json({
      success: true,
      data: user,
    });
  }
);