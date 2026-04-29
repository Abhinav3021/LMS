"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyLoans = exports.applyLoan = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const loan_model_1 = __importDefault(require("./loan.model"));
const RATE = 12;
const calculateInterest = (amount, days) => {
    return ((amount *
        RATE *
        days) /
        (365 * 100));
};
exports.applyLoan = (0, asyncHandler_1.default)(async (req, res) => {
    const borrowerId = req.user?.userId;
    const { amount, tenureDays, } = req.body;
    if (amount < 50000 ||
        amount > 500000) {
        return res
            .status(400)
            .json({
            success: false,
            message: "Amount must be between ₹50K and ₹5L",
        });
    }
    if (tenureDays < 30 ||
        tenureDays > 365) {
        return res
            .status(400)
            .json({
            success: false,
            message: "Tenure must be 30 to 365 days",
        });
    }
    const interest = calculateInterest(amount, tenureDays);
    const total = amount +
        interest;
    const loan = await loan_model_1.default.create({
        borrowerId,
        amount,
        tenureDays,
        interestRate: RATE,
        interestAmount: Number(interest.toFixed(2)),
        totalRepayment: Number(total.toFixed(2)),
        outstandingAmount: Number(total.toFixed(2)),
        status: "APPLIED",
    });
    res.status(201).json({
        success: true,
        message: "Loan applied successfully",
        data: loan,
    });
});
exports.getMyLoans = (0, asyncHandler_1.default)(async (req, res) => {
    const loans = await loan_model_1.default.find({
        borrowerId: req.user
            ?.userId,
    }).sort({
        createdAt: -1,
    });
    res.json({
        success: true,
        data: loans,
    });
});
