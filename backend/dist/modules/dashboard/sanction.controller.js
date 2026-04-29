"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectLoan = exports.approveLoan = exports.getAppliedLoans = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const loan_model_1 = __importDefault(require("../loan/loan.model"));
exports.getAppliedLoans = (0, asyncHandler_1.default)(async (_req, res) => {
    const loans = await loan_model_1.default.find({
        status: "APPLIED",
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
exports.approveLoan = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const loan = await loan_model_1.default.findById(id);
    if (!loan) {
        throw new AppError_1.default("Loan not found", 404);
    }
    if (loan.status !==
        "APPLIED") {
        throw new AppError_1.default("Only APPLIED loans can be sanctioned", 400);
    }
    loan.status =
        "SANCTIONED";
    await loan.save();
    res.json({
        success: true,
        message: "Loan sanctioned successfully",
        data: loan,
    });
});
exports.rejectLoan = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) {
        throw new AppError_1.default("Rejection reason is required", 400);
    }
    const loan = await loan_model_1.default.findById(id);
    if (!loan) {
        throw new AppError_1.default("Loan not found", 404);
    }
    if (loan.status !==
        "APPLIED") {
        throw new AppError_1.default("Only APPLIED loans can be rejected", 400);
    }
    loan.status =
        "REJECTED";
    loan.rejectionReason =
        reason;
    await loan.save();
    res.json({
        success: true,
        message: "Loan rejected successfully",
        data: loan,
    });
});
