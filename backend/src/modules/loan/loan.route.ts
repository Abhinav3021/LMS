import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  applyLoan,
  getMyLoans,
} from "./loan.controller";

const router = Router();

router.use(authMiddleware);

router.post(
  "/apply",
  applyLoan
);

router.get(
  "/my-loans",
  getMyLoans
);

export default router;