import User from "../models/User.model.js";
import Tournament from "../models/Tournament.model.js";
import Transaction from "../models/Transaction.model.js";
import Admin from "../models/Admin.model.js"
export const getAllUsersService = async () => {
  const users = await User.find().select("-password -__v");
  return users;
};

export const getAllTournamentsService = async () => {
  const tournaments = await Tournament.find();
  return tournaments;
};

export const getRegisteredUsersService = async (tournamentId) => {

  const tournament = await Tournament.findById(tournamentId).populate(
    "joinedPlayers",
    "name email phoneNumber walletBalance isBanned"
  );

  if (!tournament) {
    const err = new Error("Tournament not found");
    err.statusCode = 404;
    throw err;
  }

  return tournament.joinedPlayers;
};

export const getTotalCollectionOfTournamentService = async (tournamentId) => {

  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) {
    const err = new Error("Tournament not found");
    err.statusCode = 404;
    throw err;
  }

  const playersCount = tournament.joinedPlayers?.length || 0; 
  

  const totalCash = tournament.entryFee * playersCount;

  return {
    title: tournament.title,
    entryFee: tournament.entryFee,
    totalCash
  };
};

export const getWithdrawRequestsService = async () => {

  const requests = await Transaction.find({
    type: "WITHDRAW",
    status: "PENDING"
  })
    .populate("user", "name email phoneNumber withdrawBalance")
    .sort({ createdAt: -1 });

  return requests;
};



export const getAdminProfileService = async (adminId) => {

  const admin = await Admin.findById(adminId)
    .select("-password -__v")

  if (!admin) {
    const err = new Error("Admin not found")
    err.statusCode = 404
    throw err
  }

  return admin
}