import {
  createTournamentService,
  updateTournamentStatusService,
  cancelTournamentService,
  getAllTournamentsService,
  getTournamentByIdService,
  joinTournamentService,
  setRoomDetailsService,
  declareWinnersService,
  refundOnCancelService,
} from "../services/tournament.service.js";

export const createTournament = async (req, res, next) => {
  try {
    const tournament = await createTournamentService(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("CREATE TOURNAMENT ERROR:", error);
    next(error);
  }
};

export const updateTournamentStatus = async (req, res, next) => {
  try {
    const tournament = await updateTournamentStatusService(
      req.params.id,
      req.body.status,
    );

    res.json({
      success: true,
      message: "Tournament status updated",
      data: tournament,
    });
  } catch (error) {
    console.error("UPDATE TOURNAMENT STATUS ERROR", error);
    next(error);
  }
};

export const cancelTournament = async (req, res, next) => {
  try {
    const tournament = await cancelTournamentService(req.params.id);

    res.json({
      success: true,
      message: "Tournament cancelled successfully",
      data: tournament,
    });
  } catch (error) {
    console.error("CANCLE TOURNAMENT ERROR : ", error);
    next(error);
  }
};

export const getAllTournaments = async (req, res, next) => {
  try {
    const tournaments = await getAllTournamentsService(req.query);

    res.status(200).json({
      success: true,
      count: tournaments.length,
      data: tournaments,
    });
  } catch (error) {
    console.error("GET ALL TOURNAMENTS ERROR : ", error);
    next(error);
  }
};

export const getTournamentById = async (req, res, next) => {
  try {
    const tournament = await getTournamentByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    console.error("GET TOURNAMENT BY ID ERROR : ", error);
    next(error);
  }
};

export const joinTournament = async (req, res, next) => {
  try {
    const result = await joinTournamentService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Successfully joined the tournament",
      data: result,
    });
  } catch (error) {
    console.error("JOIN TOURNAMENT ERROR:", error);
    next(error);
  }
};

export const setRoomDetails = async (req, res, next) => {
  try {
    const result = await setRoomDetailsService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Room details updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("SET ROOM DETAILS : ", error);
    next(error);
  }
};

export const declareWinners = async (req, res, next) => {
  try {
    const winners = await declareWinnersService(
      req.params.id,
      req.body.winners,
    );

    res.status(200).json({
      success: true,
      message: "Winners declared successfully",
      data: winners,
    });
  } catch (error) {
    console.error("DECLARE WINNER ERROR:", error);
    next(error);
  }
};

export const refundOnCancel = async (req, res, next) => {
  try {
    const result = await refundOnCancelService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refundedUsers: result.refundedUsers,
      refunds: result.refunds,
    });
  } catch (error) {
    console.error("REFUND ON CANCLE ERROR : ", error);
    next(error);
  }
};
