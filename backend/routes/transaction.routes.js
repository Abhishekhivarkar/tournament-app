import express from "express";
import {
  requestWithdraw,
  getMyTransactions,
  updateWithdrawStatus
} from "../controllers/transaction.controller.js";

import { roleMiddleware } from "../middlewares/role.middleware.js";

import {authMiddleware} from "../middlewares/auth.middleware.js";
import { ROLE } from "../config/role.js";

const router = express.Router();

// Withdraw request
router.post("/transaction/withdraw", authMiddleware, requestWithdraw);

// User transaction history
router.get("/transaction/my", authMiddleware, getMyTransactions);

router.patch(
  "/transaction/withdraw/:id/status",
  authMiddleware,
  roleMiddleware(ROLE.ADMIN),
  updateWithdrawStatus
)
export default router;