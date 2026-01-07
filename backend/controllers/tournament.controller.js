import Tournament from "../models/Tournament.model.js";
import User from "../models/User.model.js";
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
    next(error);
  }
};


export const joinTournament = async (req, res, next) => {
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

    if (tournament.joinedPlayers.includes(userId)) {
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


    user.walletBalance -= tournament.entryFee;
    await user.save();


    tournament.joinedPlayers.push(userId);

    if (tournament.joinedPlayers.length === tournament.maxPlayers) {
      tournament.status = "ongoing";
    }

    await tournament.save();

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
    next(error);
  }
};


export const declareWinners = async (req, res, next) => {
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
        return res.status(400).json({
          success: false,
          message: "Winner must be a joined player"
        });
      }

      const prizeRule = tournament.prizeDistribution.find(
        (p) => p.position === winner.position
      );

      if (!prizeRule) {
        return res.status(400).json({
          success: false,
          message: `No prize rule for position ${winner.position}`
        });
      }

      const winAmount =
        (prizePool * prizeRule.percentage) / 100;

      const user = await User.findById(winner.userId);
      if (!user) continue;

    
      user.walletBalance += winAmount;
      user.totalWinAmount += winAmount;
      await user.save();

      finalWinners.push({
        user: user._id,
        position: winner.position,
        winAmount
      });
    }

    tournament.winners = finalWinners;
    tournament.status = "completed";

    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Winners declared successfully",
      data: tournament.winners
    });
  } catch (error) {
    next(error);
  }
};



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
      user.totalWithdrawAmount =
        (user.totalWithdrawAmount || 0); 
      await user.save();

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
    next(error);
  }
};