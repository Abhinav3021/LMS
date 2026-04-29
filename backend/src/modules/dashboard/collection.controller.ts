import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import Loan from "../loan/loan.model";
import Payment from "../payment/payment.model";

export const getCollectionLoans =
  asyncHandler(
    async (
      _req: Request,
      res: Response
    ) => {
      const loans =
        await Loan.find({
          status:
            "DISBURSED",
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
        data: loans,
      });
    }
  );

export const recordPayment =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { id } =
        req.params;

      const {
        utr,
        amount,
      } = req.body;

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
        "DISBURSED"
      ) {
        throw new AppError(
          "Only disbursed loans can receive payments",
          400
        );
      }

      if (
        !utr ||
        !amount
      ) {
        throw new AppError(
          "UTR and amount required",
          400
        );
      }

      if (amount <= 0) {
        throw new AppError(
          "Invalid payment amount",
          400
        );
      }

      const exists =
        await Payment.findOne(
          { utr }
        );

      if (exists) {
        throw new AppError(
          "UTR already exists",
          400
        );
      }

      if (
        amount >
        loan.outstandingAmount
      ) {
        throw new AppError(
          "Payment exceeds outstanding balance",
          400
        );
      }

      await Payment.create({
        loanId: loan._id,
        utr,
        amount,
        paidAt:
          new Date(),
      });

      loan.paidAmount =
        Number(
          (
            loan.paidAmount +
            amount
          ).toFixed(2)
        );

      loan.outstandingAmount =
        Number(
          (
            loan.totalRepayment -
            loan.paidAmount
          ).toFixed(2)
        );

      if (
        loan.outstandingAmount <=
        0
      ) {
        loan.status =
          "CLOSED";

        loan.outstandingAmount =
          0;
      }

      await loan.save();

      res.json({
        success: true,
        message:
          "Payment recorded",
        data: loan,
      });
    }
  );

export const getLoanPayments =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { id } =
        req.params;

      const payments =
        await Payment.find({
          loanId: id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        data: payments,
      });
    }
  );