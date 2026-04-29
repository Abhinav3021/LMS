import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/authorize.middleware";

import { getSalesLeads } from "./sales.controller";
import {
  getAppliedLoans,
  approveLoan,
  rejectLoan,
} from "./sanction.controller";

import {
  getSanctionedLoans,
  disburseLoan,
} from "./disbursement.controller";

import {
  getCollectionLoans,
  recordPayment,
  getLoanPayments,
} from "./collection.controller";

const router = Router();

router.use(authMiddleware);

/* SALES */
router.get(
  "/sales",
  authorize("SALES"),
  getSalesLeads
);

/* SANCTION */
router.get(
  "/sanction",
  authorize("SANCTION"),
  getAppliedLoans
);

router.patch(
  "/sanction/:id/approve",
  authorize("SANCTION"),
  approveLoan
);

router.patch(
  "/sanction/:id/reject",
  authorize("SANCTION"),
  rejectLoan
);

/* DISBURSEMENT */
router.get(
  "/disbursement",
  authorize("DISBURSEMENT"),
  getSanctionedLoans
);

router.patch(
  "/disbursement/:id/release",
  authorize("DISBURSEMENT"),
  disburseLoan
);

/* COLLECTION */
router.get(
  "/collection",
  authorize("COLLECTION"),
  getCollectionLoans
);

router.post(
  "/collection/:id/pay",
  authorize("COLLECTION"),
  recordPayment
);

router.get(
  "/collection/:id/payments",
  authorize("COLLECTION"),
  getLoanPayments
);

export default router;