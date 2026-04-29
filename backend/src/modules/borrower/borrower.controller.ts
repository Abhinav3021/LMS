import { Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { AuthRequest } from "../../middlewares/auth.middleware";
import BorrowerProfile from "./borrower.model";
import { runBRE } from "./bre";

export const saveProfile =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const userId =
        req.user?.userId;

      const payload = {
        userId,
        fullName:
          req.body.fullName,
        pan: req.body.pan
          .trim()
          .toUpperCase(),
        dob: req.body.dob,
        monthlySalary:
          req.body
            .monthlySalary,
        employmentMode:
          req.body
            .employmentMode,
      };

      const bre =
        runBRE(payload);

      if (!bre.passed) {
        return res
          .status(400)
          .json({
            success: false,
            reasons:
              bre.reasons,
          });
      }

      const profile =
        await BorrowerProfile.findOneAndUpdate(
          { userId },
          payload,
          {
            upsert: true,
            new: true,
          }
        );

      res.json({
        success: true,
        data: profile,
      });
    }
  );

export const getMyProfile =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const profile =
        await BorrowerProfile.findOne(
          {
            userId:
              req.user
                ?.userId,
          }
        );

      res.json({
        success: true,
        data: profile,
      });
    }
  );

export const uploadSalarySlip =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const file =
        req.file;

      if (!file) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "File required",
          });
      }

      const profile =
        await BorrowerProfile.findOneAndUpdate(
          {
            userId:
              req.user
                ?.userId,
          },
          {
            $set: {
              salarySlipUrl:
                file.filename,
            },
          },
          {
            new: true,
            upsert: true,
          }
        );

      res.json({
        success: true,
        message:
          "Salary slip uploaded",
        data: profile,
      });
    }
  );

  export const breCheck =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const {
        pan,
        dob,
        monthlySalary,
        employmentMode,
      } = req.body;

      const result =
        runBRE({
          pan: String(pan || ""),
          dob,
          monthlySalary:
            Number(
              monthlySalary
            ),
          employmentMode:
            String(
              employmentMode ||
                ""
            ),
        });

      if (!result.passed) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Eligibility failed",
            data: result,
          });
      }

      res.status(200).json({
        success: true,
        message:
          "Eligible",
        data: result,
      });
    }
  );
