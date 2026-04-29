import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import upload from "../../config/multer";

import {
  saveProfile,
  getMyProfile,
  uploadSalarySlip,
  breCheck
} from "./borrower.controller";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMyProfile);

router.post(
  "/profile",
  saveProfile
);

router.post(
  "/bre-check",
  breCheck
);


router.post(
  "/upload-slip",
  upload.single("file"),
  uploadSalarySlip
);

export default router;