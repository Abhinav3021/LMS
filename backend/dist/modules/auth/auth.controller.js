"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const user_model_1 = __importDefault(require("./user.model"));
const auth_service_1 = require("./auth.service");
exports.register = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser) {
        throw new AppError_1.default("Email already exists", 400);
    }
    const hashedPassword = await (0, auth_service_1.hashPassword)(password);
    const user = await user_model_1.default.create({
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
});
exports.login = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.default("Invalid credentials", 401);
    }
    const isMatch = await (0, auth_service_1.comparePassword)(password, user.password);
    if (!isMatch) {
        throw new AppError_1.default("Invalid credentials", 401);
    }
    const token = (0, auth_service_1.generateToken)(user._id.toString(), user.role);
    res.json({
        success: true,
        message: "Login successful",
        data: {
            token,
        },
    });
});
exports.getMe = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.userId).select("-password");
    res.json({
        success: true,
        data: user,
    });
});
