"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const multer_1 = __importDefault(require("../../config/multer"));
const borrower_controller_1 = require("./borrower.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.get("/me", borrower_controller_1.getMyProfile);
router.post("/profile", borrower_controller_1.saveProfile);
router.post("/bre-check", borrower_controller_1.breCheck);
router.post("/upload-slip", multer_1.default.single("file"), borrower_controller_1.uploadSalarySlip);
exports.default = router;
