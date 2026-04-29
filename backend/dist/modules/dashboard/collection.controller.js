"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoanPayments = exports.recordPayment = exports.getCollectionLoans = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const loan_model_1 = __importDefault(require("../loan/loan.model"));
const payment_model_1 = __importDefault(require("../payment/payment.model"));
exports.getCollectionLoans = (0, asyncHandler_1.default)(async (_req, res) => {
    const loans = await loan_model_1.default.find({
        status: "DISBURSED",
    })
        .populate("borrowerId", "name email")
        .sort({
        createdAt: -1,
    });
    res.json({
        success: true,
        data: loans,
    });
});
exports.recordPayment = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { utr, amount, } = req.body;
    const loan = await loan_model_1.default.findById(id);
    if (!loan) {
        throw new AppError_1.default("Loan not found", 404);
    }
    if (loan.status !==
        "DISBURSED") {
        throw new AppError_1.default("Only disbursed loans can receive payments", 400);
    }
    if (!utr ||
        !amount) {
        throw new AppError_1.default("UTR and amount required", 400);
    }
    if (amount <= 0) {
        throw new AppError_1.default("Invalid payment amount", 400);
    }
    const exists = await payment_model_1.default.findOne({ utr });
    if (exists) {
        throw new AppError_1.default("UTR already exists", 400);
    }
    if (amount >
        loan.outstandingAmount) {
        throw new AppError_1.default("Payment exceeds outstanding balance", 400);
    }
    await payment_model_1.default.create({
        loanId: loan._id,
        utr,
        amount,
        paidAt: new Date(),
    });
    loan.paidAmount =
        Number((loan.paidAmount +
            amount).toFixed(2));
    loan.outstandingAmount =
        Number((loan.totalRepayment -
            loan.paidAmount).toFixed(2));
    if (loan.outstandingAmount <=
        0) {
        loan.status =
            "CLOSED";
        loan.outstandingAmount =
            0;
    }
    await loan.save();
    res.json({
        success: true,
        message: "Payment recorded",
        data: loan,
    });
});
exports.getLoanPayments = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const payments = await payment_model_1.default.find({
        loanId: id,
    }).sort({
        createdAt: -1,
    });
    res.json({
        success: true,
        data: payments,
    });
});
