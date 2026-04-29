"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const authorize_middleware_1 = __importDefault(require("../../middlewares/authorize.middleware"));
const sales_controller_1 = require("./sales.controller");
const sanction_controller_1 = require("./sanction.controller");
const disbursement_controller_1 = require("./disbursement.controller");
const collection_controller_1 = require("./collection.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
/* SALES */
router.get("/sales", (0, authorize_middleware_1.default)("SALES"), sales_controller_1.getSalesLeads);
/* SANCTION */
router.get("/sanction", (0, authorize_middleware_1.default)("SANCTION"), sanction_controller_1.getAppliedLoans);
router.patch("/sanction/:id/approve", (0, authorize_middleware_1.default)("SANCTION"), sanction_controller_1.approveLoan);
router.patch("/sanction/:id/reject", (0, authorize_middleware_1.default)("SANCTION"), sanction_controller_1.rejectLoan);
/* DISBURSEMENT */
router.get("/disbursement", (0, authorize_middleware_1.default)("DISBURSEMENT"), disbursement_controller_1.getSanctionedLoans);
router.patch("/disbursement/:id/release", (0, authorize_middleware_1.default)("DISBURSEMENT"), disbursement_controller_1.disburseLoan);
/* COLLECTION */
router.get("/collection", (0, authorize_middleware_1.default)("COLLECTION"), collection_controller_1.getCollectionLoans);
router.post("/collection/:id/pay", (0, authorize_middleware_1.default)("COLLECTION"), collection_controller_1.recordPayment);
router.get("/collection/:id/payments", (0, authorize_middleware_1.default)("COLLECTION"), collection_controller_1.getLoanPayments);
exports.default = router;
