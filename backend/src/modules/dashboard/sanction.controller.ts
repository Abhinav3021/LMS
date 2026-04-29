import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import Loan from "../loan/loan.model";

export const getAppliedLoans = asyncHandler(
  async (_req: Request, res: Response) => {
    const loans = await Loan.find({
      status: "APPLIED",
    })
      .populate(
        "borrowerId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: loans.length,
      data: loans,
    });
  }
);

export const approveLoan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const loan = await Loan.findById(id);

    if (!loan) {
      throw new AppError(
        "Loan not found",
        404
      );
    }

    if (
      loan.status !==
      "APPLIED"
    ) {
      throw new AppError(
        "Only APPLIED loans can be sanctioned",
        400
      );
    }

    loan.status =
      "SANCTIONED";

    await loan.save();

    res.json({
      success: true,
      message:
        "Loan sanctioned successfully",
      data: loan,
    });
  }
);

export const rejectLoan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } =
      req.body;

    if (!reason) {
      throw new AppError(
        "Rejection reason is required",
        400
      );
    }

    const loan = await Loan.findById(id);

    if (!loan) {
      throw new AppError(
        "Loan not found",
        404
      );
    }

    if (
      loan.status !==
      "APPLIED"
    ) {
      throw new AppError(
        "Only APPLIED loans can be rejected",
        400
      );
    }

    loan.status =
      "REJECTED";

    loan.rejectionReason =
      reason;

    await loan.save();

    res.json({
      success: true,
      message:
        "Loan rejected successfully",
      data: loan,
    });
  }
);