"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disburseLoan = exports.getSanctionedLoans = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const loan_model_1 = __importDefault(require("../loan/loan.model"));
exports.getSanctionedLoans = (0, asyncHandler_1.default)(async (_req, res) => {
    const loans = await loan_model_1.default.find({
        status: "SANCTIONED",
    })
        .populate("borrowerId", "name email")
        .sort({
        createdAt: -1,
    });
    res.json({
        success: true,
        count: loans.length,
        data: loans,
    });
});
exports.disburseLoan = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const loan = await loan_model_1.default.findById(id);
    if (!loan) {
        throw new AppError_1.default("Loan not found", 404);
    }
    if (loan.status !==
        "SANCTIONED") {
        throw new AppError_1.default("Only sanctioned loans can be disbursed", 400);
    }
    loan.status =
        "DISBURSED";
    loan.disbursedAt =
        new Date();
    await loan.save();
    res.json({
        success: true,
        message: "Loan disbursed successfully",
        data: loan,
    });
});
