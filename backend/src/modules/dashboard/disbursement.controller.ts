import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import Loan from "../loan/loan.model";

export const getSanctionedLoans =
  asyncHandler(
    async (
      _req: Request,
      res: Response
    ) => {
      const loans =
        await Loan.find({
          status:
            "SANCTIONED",
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
        count:
          loans.length,
        data: loans,
      });
    }
  );

export const disburseLoan =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { id } =
        req.params;

      const loan =
        await Loan.findById(
          id
        );

      if (!loan) {
        throw new AppError(
          "Loan not found",
          404
        );
      }

      if (
        loan.status !==
        "SANCTIONED"
      ) {
        throw new AppError(
          "Only sanctioned loans can be disbursed",
          400
        );
      }

      loan.status =
        "DISBURSED";

      loan.disbursedAt =
        new Date();

      await loan.save();

      res.json({
        success: true,
        message:
          "Loan disbursed successfully",
        data: loan,
      });
    }
  );