import express from "express"
import {
  getProfile,
  getJoinedMatches
} from "../controllers/userDashboard.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"
import {roleMiddleware} from"../middlewares/role.middleware.js"
import {ROLE} from "../config/role.js"
const router = express.Router()

router.get("/user/dashboard/profile",authMiddleware,roleMiddleware(ROLE.USER),getProfile)

router.get("/user/dashboard/joined-matches",authMiddleware,roleMiddleware(ROLE.USER),getJoinedMatches)
export default router