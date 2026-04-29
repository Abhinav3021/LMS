import { Router } from "express";

import healthRoute from "./health.route";
import authRoute from "../modules/auth/auth.route";
import borrowerRoute from "../modules/borrower/borrower.route";
import loanRoute from "../modules/loan/loan.route";
import dashboardRoute from "../modules/dashboard/dashboard.route";

const router = Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use("/borrower", borrowerRoute);
router.use("/loan", loanRoute);
router.use("/dashboard", dashboardRoute);

export default router;