import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import User from "../auth/user.model";
import Loan from "../loan/loan.model";

export const getSalesLeads = asyncHandler(
  async (req: Request, res: Response) => {
    const search =
      (req.query.search as string) || "";

    const loanBorrowers =
      await Loan.distinct(
        "borrowerId"
      );

    const query: any = {
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

    const leads =
      await User.find(query)
        .select(
          "name email createdAt"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      count:
        leads.length,
      data: leads,
    });
  }
);