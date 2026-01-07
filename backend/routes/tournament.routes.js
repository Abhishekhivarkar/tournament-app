import express from "express";

import {
  createTournament,
  updateTournamentStatus,
  cancelTournament,
  getAllTournaments,
  getTournamentById,
  joinTournament,
  setRoomDetails,
  declareWinners,
  refundOnCancel
} from "../controllers/tournament.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {ROLE} from "../config/role.js"
import {
  validateBody,
  validateParams
} from "../middlewares/validate.middleware.js";

import {
  createTournamentSchema,
  updateTournamentStatusSchema,
  cancelTournamentSchema,
  setRoomDetailsSchema,
  declareWinnersSchema
} from "../validators/tournament.validate.js";

import { idParamSchema } from "../validators/common.validation.js";

const router = express.Router();

router.get("/tournament", getAllTournaments);

router.get(
  "/tournament/:id",
  validateParams(idParamSchema),
  getTournamentById
);

router.post(
  "/tournament/:id/join",
  authMiddleware,
  roleMiddleware(ROLE.USER),
  validateParams(idParamSchema),
  joinTournament
);

router.post(
  "/tournament",
  authMiddleware,
  roleMiddleware(ROLE.ADMIN),
  validateBody(createTournamentSchema),
  createTournament
);

router.patch(
  "/tournament/:id/status",
  authMiddleware,
  roleMiddleware(ROLE.ADMIN),
  validateParams(idParamSchema),
  validateBody(updateTournamentStatusSchema),
  updateTournamentStatus
);

router.patch(
  "/tournament/:id/cancel",
  authMiddleware,
  roleMiddleware(ROLE.ADMIN),
  validateParams(idParamSchema),
  validateBody(cancelTournamentSchema),
  cancelTournament
);

router.patch(
  "/tournament/:id/room",
  authMiddleware,
  roleMiddleware(ROLE.ADMIN),
  validateParams(idParamSchema),
  validateBody(setRoomDetailsSchema),
  setRoomDetails
);

router.post(
  "/tournament/:id/winners",
  authMiddleware,
  roleMiddleware(ROLE.ADMIN),
  validateParams(idParamSchema),
  validateBody(declareWinnersSchema),
  declareWinners
);

router.post(
  "/tournament/:id/refund",
  authMiddleware,
  roleMiddleware(ROLE.ADMIN),
  validateParams(idParamSchema),
  refundOnCancel
);

export default router;