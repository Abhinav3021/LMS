"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const authorize = (...allowedRoles) => (req, _res, next) => {
    if (!req.user) {
        return next(new AppError_1.default("Unauthorized", 401));
    }
    const userRole = req.user.role;
    if (userRole ===
        "ADMIN") {
        return next();
    }
    if (!allowedRoles.includes(userRole)) {
        return next(new AppError_1.default("Forbidden: Access denied", 403));
    }
    next();
};
exports.default = authorize;
