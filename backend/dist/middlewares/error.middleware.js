"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (err, _req, res, _next) => {
    const statusCode = err.statusCode ||
        500;
    res.status(statusCode).json({
        success: false,
        message: err.message ||
            "Internal Server Error",
        statusCode,
    });
};
exports.default = errorMiddleware;
