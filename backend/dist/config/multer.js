"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "uploads/");
    },
    filename: (_req, file, cb) => {
        const uniqueName = Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path_1.default.extname(file.originalname);
        cb(null, uniqueName);
    },
});
const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
];
const fileFilter = (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.default("Only PDF/JPG/PNG files allowed", 400));
    }
};
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter,
});
exports.default = upload;
