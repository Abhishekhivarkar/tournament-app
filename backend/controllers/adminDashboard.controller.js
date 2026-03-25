import {
  getAllUsersService,
  getAllTournamentsService,
  getRegisteredUsersService,
  getTotalCollectionOfTournamentService,
  getWithdrawRequestsService,
  getAdminProfileService
} from "../services/adminDashboard.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.log("GET ALL USERS ERROR : ", error);
    next(error);
  }
};

export const getAllTournaments = async (req, res, next) => {
  try {
    const tournaments = await getAllTournamentsService();

    res.json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });
  } catch (error) {
    console.log("GET ALL TOURNAMENT ERROR : ", error);
    next(error);
  }
};

export const getRegisteredUsers = async (req, res, next) => {
  try {
    const players = await getRegisteredUsersService(req.params.id);

    res.status(200).json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    console.log("GET REGISTERED USERS ERROR:", error);
    next(error);
  }
};

export const getTotalCollectionOfTournament = async (req, res, next) => {
  try {
    const data = await getTotalCollectionOfTournamentService(req.params.id);

    res.status(200).json({
      success: true,
      title: data.title,
      entryFee: data.entryFee,
      totalCash: data.totalCash
    });
  } catch (error) {
    next(error);
  }
};

export const getWithdrawRequests = async (req, res, next) => {
  try {
    const requests = await getWithdrawRequestsService();

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error("GET WITHDRAW REQUESTS ERROR:", error);
    next(error);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {

    const admin = await getAdminProfileService(req.user._id)

    res.status(200).json({
      success: true,
      data: admin
    })

  } catch (error) {

    console.log("GET ADMIN PROFILE ERROR:", error)
    next(error)

  }
}