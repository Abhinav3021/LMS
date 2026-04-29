"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const loan_controller_1 = require("./loan.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.post("/apply", loan_controller_1.applyLoan);
router.get("/my-loans", loan_controller_1.getMyLoans);
exports.default = router;
