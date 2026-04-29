"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesLeads = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const user_model_1 = __importDefault(require("../auth/user.model"));
const loan_model_1 = __importDefault(require("../loan/loan.model"));
exports.getSalesLeads = (0, asyncHandler_1.default)(async (req, res) => {
    const search = req.query.search || "";
    const loanBorrowers = await loan_model_1.default.distinct("borrowerId");
    const query = {
        role: "BORROWER",
        _id: {
            $nin: loanBorrowers,
        },
    };
    if (search) {
        query.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }
    const leads = await user_model_1.default.find(query)
        .select("name email createdAt")
        .sort({
        createdAt: -1,
    });
    res.json({
        success: true,
        count: leads.length,
        data: leads,
    });
});
