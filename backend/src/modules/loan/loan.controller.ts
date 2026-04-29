import { Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { AuthRequest } from "../../middlewares/auth.middleware";
import Loan from "./loan.model";

const RATE = 12;

const calculateInterest = (
  amount: number,
  days: number
) => {
  return (
    (amount *
      RATE *
      days) /
    (365 * 100)
  );
};

export const applyLoan =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const borrowerId =
        req.user?.userId;

      const {
        amount,
        tenureDays,
      } = req.body;

      if (
        amount < 50000 ||
        amount > 500000
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Amount must be between ₹50K and ₹5L",
          });
      }

      if (
        tenureDays < 30 ||
        tenureDays > 365
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Tenure must be 30 to 365 days",
          });
      }

      const interest =
        calculateInterest(
          amount,
          tenureDays
        );

      const total =
        amount +
        interest;

      const loan =
        await Loan.create({
          borrowerId,
          amount,
          tenureDays,
          interestRate:
            RATE,
          interestAmount:
            Number(
              interest.toFixed(
                2
              )
            ),
          totalRepayment:
            Number(
              total.toFixed(
                2
              )
            ),
          outstandingAmount:
            Number(
              total.toFixed(
                2
              )
            ),
          status:
            "APPLIED",
        });

      res.status(201).json({
        success: true,
        message:
          "Loan applied successfully",
        data: loan,
      });
    }
  );

export const getMyLoans =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const loans =
        await Loan.find({
          borrowerId:
            req.user
              ?.userId,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        data: loans,
      });
    }
  );