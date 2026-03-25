import Tournament from "../models/Tournament.model.js";
import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import mongoose from "mongoose";

export const createTournamentService = async (data, adminId) => {
  const tournament = await Tournament.create({
    title: data.title,
    entryFee: data.entryFee,
    maxPlayers: data.maxPlayers,
    prizePoolPercentage: data.prizePoolPercentage,
    prizeDistribution: data.prizeDistribution,
    startTime: data.startTime,
    map: data.map,
    createdBy: adminId,
  });
  return tournament;
};

export const updateTournamentStatusService = async (id, status) => {
  const allowed = ["upcoming", "ongoing", "completed"];

  status = status?.toLowerCase();

//   if (!allowed.includes(status)) {
//     const err = new Error("Invalid status");
//     err.statusCode = 400;
//     throw err;
//   }

  const tournament = await Tournament.findById(id);

  if (!tournament) {
    const err = new Error("Tournament not found");
    err.statusCode = 404;
    throw err;
  }

  if (tournament.status === "cancelled") {
    const err = new Error("Cancelled tournament cannot be updated");
    err.statusCode = 400;
    throw err;
  }

  tournament.status = status;
  await tournament.save();

  return tournament;
};

export const cancelTournamentService = async (id) => {
  const tournament = await Tournament.findById(id);

  if (!tournament) {
    const err = new Error("Tournament not found");
    err.statusCode = 404;
    throw err;
  }

  if (tournament.status !== "upcoming") {
    const err = new Error("Only upcoming tournaments can be cancelled");
    err.statusCode = 400;
    throw err;
  }

  tournament.status = "cancelled";
  tournament.isCancelled = true;

  await tournament.save();

  return tournament;
};

export const getAllTournamentsService = async (query) => {
  const { status, map } = query;

  const filter = {};

  if (status) filter.status = status.toLowerCase();
  if (map) filter.map = map.toLowerCase();

  const tournaments = await Tournament.find(filter)
    .sort({ startTime: 1 })
    .populate("createdBy", "name");

  return tournaments;
};

export const getTournamentByIdService = async (id) => {
  const tournament = await Tournament.findById(id)
    .populate("joinedPlayers", "name bgmiGameId")
    .populate("createdBy", "name");

  if (!tournament) {
    const err = new Error("Tournament not found");
    err.statusCode = 404;
    throw err;
  }

  return tournament;
};

export const joinTournamentService = async (id, userId) => {

  const session = await mongoose.startSession();

  try {

    const user = await User.findById(userId);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      const err = new Error("Tournament not found");
      err.statusCode = 404;
      throw err;
    }

    if (user.walletBalance < tournament.entryFee) {
      const err = new Error("Insufficient wallet balance");
      err.statusCode = 400;
      throw err;
    }

    session.startTransaction();

    const updatedTournament = await Tournament.findOneAndUpdate(
      {
        _id: id,
        status: "upcoming",
        isCancelled: false,
        joinedPlayers: { $ne: userId },
        $expr: { $lt: [{ $size: "$joinedPlayers" }, "$maxPlayers"] }
      },
      {
        $push: { joinedPlayers: userId }
      },
      { new: true, session }
    );

    if (!updatedTournament) {
      const err = new Error("Tournament full or already joined");
      err.statusCode = 400;
      throw err;
    }

    user.walletBalance -= tournament.entryFee;
    user.totalMatches += 1;

    await user.save({ session });

    await Transaction.create(
      [
        {
          user: user._id,
          type: "ENTRY_FEE",
          amount: tournament.entryFee,
          tournament: id,
          status: "SUCCESS",
          notes: "Tournament entry fee paid"
        }
      ],
      { session }
    );

    if (updatedTournament.joinedPlayers.length === updatedTournament.maxPlayers) {
      updatedTournament.status = "ongoing";
      await updatedTournament.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return {
      tournamentId: updatedTournament._id,
      userId: user._id,
      remainingBalance: user.walletBalance
    };

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const setRoomDetailsService = async (id, data) => {
  const tournament = await Tournament.findById(id);

  if (!tournament) {
    const err = new Error("Tournament not found");
    err.statusCode = 404;
    throw err;
  }

  if (tournament.status !== "ongoing") {
    const err = new Error(
      "Room details can be set only for ongoing tournaments",
    );
    err.statusCode = 400;
    throw err;
  }

  if (tournament.isCancelled) {
    const err = new Error("Tournament is cancelled");
    err.statusCode = 400;
    throw err;
  }

  tournament.roomId = data.roomId;
  tournament.roomPassword = data.roomPassword;

  await tournament.save();

  return {
    tournamentId: tournament._id,
    roomId: tournament.roomId,
  };
};

export const declareWinnersService = async (id, winners) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tournament = await Tournament.findById(id);

    if (!tournament) {
      const err = new Error("Tournament not found");
      err.statusCode = 404;
      throw err;
    }

    if (tournament.status !== "ongoing") {
      const err = new Error(
        "Winners can be declared only for ongoing tournaments",
      );
      err.statusCode = 400;
      throw err;
    }

    if (tournament.isCancelled) {
      const err = new Error("Cancelled tournament has no winners");
      err.statusCode = 400;
      throw err;
    }

    if (tournament.winners.length > 0) {
      const err = new Error("Winners already declared");
      err.statusCode = 400;
      throw err;
    }

    const totalCollection =
      tournament.joinedPlayers.length * tournament.entryFee;
    const prizePool = (totalCollection * tournament.prizePoolPercentage) / 100;

    const finalWinners = [];

    for (const winner of winners) {
      const isJoined = tournament.joinedPlayers.some(
        (p) => p.toString() === winner.userId,
      );

      if (!isJoined) {
        throw new Error("Winner must be a joined player");
      }

      const prizeRule = tournament.prizeDistribution.find(
        (p) => p.position === winner.position,
      );

      if (!prizeRule) {
        throw new Error(`No prize rule for position ${winner.position}`);
      }

      const winAmount = (prizePool * prizeRule.percentage) / 100;

      const user = await User.findById(winner.userId);

      if (!user) continue;

      user.withdrawBalance += winAmount;
      user.totalWinAmount += winAmount;
      user.totalWins += 1;
      await user.save({ session });

      await Transaction.create(
        [
          {
            type: "WIN",
            user: user._id,
            tournament: tournament._id,
            status: "SUCCESS",
            amount: winAmount,
            notes: `Prize for position ${winner.position}`,
          },
        ],
        { session },
      );

      finalWinners.push({
        user: user._id,
        position: winner.position,
        winAmount,
      });
    }

    tournament.winners = finalWinners;
    tournament.status = "completed";

    await tournament.save({ session });

    await session.commitTransaction();
    session.endSession();

    return tournament.winners;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const refundOnCancelService = async (id) => {
  const tournament = await Tournament.findById(id);

  if (!tournament) {
    const err = new Error("Tournament not found");
    err.statusCode = 404;
    throw err;
  }

  if (tournament.status !== "cancelled" || !tournament.isCancelled) {
    const err = new Error("Refund allowed only for cancelled tournaments");
    err.statusCode = 400;
    throw err;
  }

  if (tournament.refundProcessed) {
    const err = new Error("Refund already processed");
    err.statusCode = 400;
    throw err;
  }

  const refunds = [];

  for (const userId of tournament.joinedPlayers) {
    const user = await User.findById(userId);

    if (!user) continue;

    user.walletBalance += tournament.entryFee;
    await user.save();

    await Transaction.create({
      user: user._id,
      tournament: tournament._id,
      amount: tournament.entryFee,
      status: "SUCCESS",
      type: "REFUND",
      notes: "Tournament cancelled refund",
    });

    refunds.push({
      userId: user._id,
      amount: tournament.entryFee,
    });
  }

  tournament.refundProcessed = true;
  await tournament.save();

  return {
    refundedUsers: refunds.length,
    refunds,
  };
};
