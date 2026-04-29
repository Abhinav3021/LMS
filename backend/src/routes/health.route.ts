import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API healthy",
  });
});

router.get(
  "/protected",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "Protected route access granted",
    });
  }
);

export default router;