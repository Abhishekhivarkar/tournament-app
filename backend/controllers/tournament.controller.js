import Tournament from "../models/Tournament.model.js";
import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js"
import mongoose from "mongoose"
export const createTournament = async (req, res, next) => {
  try {
    const {
      title,
      entryFee,
      maxPlayers,
      prizePoolPercentage,
      prizeDistribution,
      startTime,
      map
    } = req.body;

    const tournament = await Tournament.create({
      title,
      entryFee,
      maxPlayers,
      prizePoolPercentage,
      prizeDistribution,
      startTime,
      map, 
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament
    });
  } catch (error) {
    console.error("CREATE TOURNAMENT ERROR:", error);
    next(error); 
  }
};


export const updateTournamentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const status = req.body.status?.toLowerCase();

    const allowed = ["upcoming", "ongoing", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    if (tournament.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled tournament cannot be updated"
      });
    }

    tournament.status = status;
    await tournament.save();

    res.json({
      success: true,
      message: "Tournament status updated",
      data: tournament
    });
  } catch (error) {
    console.error("UPDATE TOURNAMENT STATUS ERROR",error)
    next(error);
  }
};


export const cancelTournament = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    if (tournament.status !== "upcoming") {
      return res.status(400).json({
        success: false,
        message: "Only upcoming tournaments can be cancelled"
      });
    }

    tournament.status = "cancelled";
    tournament.isCancelled = true;

    await tournament.save();

    res.json({
      success: true,
      message: "Tournament cancelled successfully",
      data: tournament
    });
  } catch (error) {
    console.error("CANCLE TOURNAMENT ERROR : ",error)
    next(error);
  }
};

export const getAllTournaments = async (req, res, next) => {
  try {
    const { status, map } = req.query;

    const filter = {};

    if (status) filter.status = status.toLowerCase();
    if (map) filter.map = map.toLowerCase();

    const tournaments = await Tournament.find(filter)
      .sort({ startTime: 1 })
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });
  } catch (error) {
    console.error("GET ALL TOURNAMENTS ERROR : ",error)
    next(error);
  }
};


export const getTournamentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id)
      .populate("joinedPlayers", "name bgmiGameId")
      .populate("createdBy", "name");

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    res.status(200).json({
      success: true,
      data: tournament
    });
  } catch (error) {
    console.error("GET TOURNAMENT BY ID ERROR : ",error)
    next(error);
  }
};


export const joinTournament = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const userId = req.user._id;
    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    if (tournament.status !== "upcoming") {
      return res.status(400).json({
        success: false,
        message: "Tournament is not open for joining"
      });
    }

    if (tournament.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Tournament is cancelled"
      });
    }

    if (tournament.joinedPlayers.some(
  (playerId) => playerId.toString() === userId.toString()
)) {
  return res.status(400).json({
    success: false,
    message: "You already joined this tournament"
  });
}

    if (tournament.joinedPlayers.length >= tournament.maxPlayers) {
      return res.status(400).json({
        success: false,
        message: "Tournament is full"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.walletBalance < tournament.entryFee) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance"
      });
    }

    // 🔒 START ATOMIC TRANSACTION
    session.startTransaction();

    // Wallet deduct
    user.walletBalance -= tournament.entryFee;
    user.totalMatches += 1
    await user.save({ session });

    // Transaction log
    await Transaction.create(
      [{
        user: user._id,
        type: "ENTRY_FEE",
        amount: tournament.entryFee,
        tournament: tournament._id,
        status: "SUCCESS",
        notes: "Tournament entry fee paid"
      }],
      { session }
    );

    // Join tournament
    
    tournament.joinedPlayers.push(userId);

    if (tournament.joinedPlayers.length === tournament.maxPlayers) {
      tournament.status = "ongoing";
    }

    await tournament.save({ session });

    // COMMIT
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Successfully joined the tournament",
      data: {
        tournamentId: tournament._id,
        userId: user._id,
        remainingBalance: user.walletBalance
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("JOIN TOURNAMENT ERROR:", error);
    next(error);
  }
};


export const setRoomDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomId, roomPassword } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    if (tournament.status !== "ongoing") {
      return res.status(400).json({
        success: false,
        message: "Room details can be set only for ongoing tournaments"
      });
    }

    if (tournament.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Tournament is cancelled"
      });
    }

    tournament.roomId = roomId;
    tournament.roomPassword = roomPassword;

    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Room details updated successfully",
      data: {
        tournamentId: tournament._id,
        roomId: tournament.roomId
      }
    });
  } catch (error) {
    console.error("SET ROOM DETAILS : ",error)
    next(error);
  }
};


export const declareWinners = async (req, res, next) => {
  const session =await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params;
    const { winners } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    if (tournament.status !== "ongoing") {
      return res.status(400).json({
        success: false,
        message: "Winners can be declared only for ongoing tournaments"
      });
    }

    if (tournament.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Cancelled tournament has no winners"
      });
    }

    if (tournament.winners.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Winners already declared"
      });
    }

    const totalCollection =
      tournament.joinedPlayers.length * tournament.entryFee;

    const prizePool =
      (totalCollection * tournament.prizePoolPercentage) / 100;

    const finalWinners = [];

    for (const winner of winners) {
      const isJoined = tournament.joinedPlayers.some(
        (playerId) => playerId.toString() === winner.userId
      );

      if (!isJoined) {
        throw new Error("Winner must be a joined player");
      }

      const prizeRule = tournament.prizeDistribution.find(
        (p) => p.position === winner.position
      );

      if (!prizeRule) {
  throw new Error(`No prize rule for position ${winner.position}`);
}

      const winAmount =
        (prizePool * prizeRule.percentage) / 100;

      const user = await User.findById(winner.userId);
      if (!user) continue;

    
      user.withdrawBalance += winAmount;
      user.totalWinAmount += winAmount;
      user.totalWins += 1
      await user.save({session});
      
      await Transaction.create([{
        type:"WIN",
        user:user._id,
        tournament:tournament._id,
        status:"SUCCESS",
        amount:winAmount,
        notes:`Prize for position ${winner.position}`
      }],{session})
      
      finalWinners.push({
        user: user._id,
        position: winner.position,
        winAmount
      });
    }

    tournament.winners = finalWinners;
    tournament.status = "completed";

    await tournament.save({session});
await session.commitTransaction()
session.endSession()
    res.status(200).json({
      success: true,
      message: "Winners declared successfully",
      data: tournament.winners
    });
  } catch (error) {
  await session.abortTransaction();
  session.endSession();
  console.error("DECLARE WINNER ERROR:", error);
  next(error);
}
}

export const refundOnCancel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    if (tournament.status !== "cancelled" || !tournament.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Refund allowed only for cancelled tournaments"
      });
    }
    
    if (tournament.refundProcessed) {
      return res.status(400).json({
        success: false,
        message: "Refund already processed"
      });
    }

    const refunds = [];

    for (const userId of tournament.joinedPlayers) {
      const user = await User.findById(userId);
      if (!user) continue;

      user.walletBalance += tournament.entryFee;
      await user.save();
      
      await Transaction.create({
        user:user._id,
        tournament:tournament._id,
        amount:tournament.entryFee,
        status:"SUCCESS",
        type:"REFUND",
        notes:"Tournament cancelled refund"
      })


      refunds.push({
        userId: user._id,
        amount: tournament.entryFee
      });
    }

    tournament.refundProcessed = true;
    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refundedUsers: refunds.length,
      refunds
    });
    
  } catch (error) {
    console.error("REFUND ON CANCLE ERROR : ",error)
    next(error);
  }
};