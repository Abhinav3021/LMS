"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.breCheck = exports.uploadSalarySlip = exports.getMyProfile = exports.saveProfile = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const borrower_model_1 = __importDefault(require("./borrower.model"));
const bre_1 = require("./bre");
exports.saveProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    const payload = {
        userId,
        fullName: req.body.fullName,
        pan: req.body.pan
            .trim()
            .toUpperCase(),
        dob: req.body.dob,
        monthlySalary: req.body
            .monthlySalary,
        employmentMode: req.body
            .employmentMode,
    };
    const bre = (0, bre_1.runBRE)(payload);
    if (!bre.passed) {
        return res
            .status(400)
            .json({
            success: false,
            reasons: bre.reasons,
        });
    }
    const profile = await borrower_model_1.default.findOneAndUpdate({ userId }, payload, {
        upsert: true,
        new: true,
    });
    res.json({
        success: true,
        data: profile,
    });
});
exports.getMyProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const profile = await borrower_model_1.default.findOne({
        userId: req.user
            ?.userId,
    });
    res.json({
        success: true,
        data: profile,
    });
});
exports.uploadSalarySlip = (0, asyncHandler_1.default)(async (req, res) => {
    const file = req.file;
    if (!file) {
        return res
            .status(400)
            .json({
            success: false,
            message: "File required",
        });
    }
    const profile = await borrower_model_1.default.findOneAndUpdate({
        userId: req.user
            ?.userId,
    }, {
        $set: {
            salarySlipUrl: file.filename,
        },
    }, {
        new: true,
        upsert: true,
    });
    res.json({
        success: true,
        message: "Salary slip uploaded",
        data: profile,
    });
});
exports.breCheck = (0, asyncHandler_1.default)(async (req, res) => {
    const { pan, dob, monthlySalary, employmentMode, } = req.body;
    const result = (0, bre_1.runBRE)({
        pan: String(pan || ""),
        dob,
        monthlySalary: Number(monthlySalary),
        employmentMode: String(employmentMode ||
            ""),
    });
    if (!result.passed) {
        return res
            .status(400)
            .json({
            success: false,
            message: "Eligibility failed",
            data: result,
        });
    }
    res.status(200).json({
        success: true,
        message: "Eligible",
        data: result,
    });
});
