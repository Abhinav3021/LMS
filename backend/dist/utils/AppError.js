"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
