import {getAllUsers,getAllTournaments,getRegisteredUsers,getTotalCollectionOfTournament,getWithdrawRequests, getAdminProfile} from "../controllers/adminDashboard.controller.js"
import{ authMiddleware} from "../middlewares/auth.middleware.js"
import {roleMiddleware} from "../middlewares/role.middleware.js"
import {ROLE} from "../config/role.js"
import express from "express"

const router = express.Router()

router.get("/admin/dashboard/all-users",authMiddleware,roleMiddleware(ROLE.ADMIN),getAllUsers)

router.get("/admin/dashboard/all-tournaments",authMiddleware,roleMiddleware(ROLE.ADMIN),getAllTournaments)

router.get("/admin/dashboard/:id/players",authMiddleware,roleMiddleware(ROLE.ADMIN),getRegisteredUsers)

router.get("/admin/dashboard/:id/cash",authMiddleware,roleMiddleware(ROLE.ADMIN),getTotalCollectionOfTournament)

router.get(
  "/withdraw-requests",
  authMiddleware,
  roleMiddleware("admin"),
  getWithdrawRequests
);
router.get(
  "/admin/dashboard/profile",
  authMiddleware,
  roleMiddleware(ROLE.ADMIN),
  getAdminProfile
)
export default router

