import User from "../models/User.model.js"
import Tournament from "../models/Tournament.model.js"
import Transaction from "../models/Transaction.model.js"
export const getAllUsers =async (req,res,next) =>{
  try{
    const user =await User.find().select("-password -__v")
    res.json({
      success:true,
      count:user.length,
      data:user
    })
  }catch(error){
    console.log("GET ALL USERS ERROR : ",error)
    next(error)
  }
}


export const getAllTournaments =async (req,res,next) =>{
  try{
    const tournament =await Tournament.find()
    
    res.json({
      success:true,
      count:tournament.length,
      data:tournament,
    })
    
  }catch(error){
    console.log("GET ALL TOURNAMENT ERROR : ",error)
    next(error)
  }
}


export const getRegisteredUsers = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id).populate(
      "joinedPlayers",
      "name email phoneNumber walletBalance isBanned"
    );

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    const players = tournament.joinedPlayers;

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


export const getTotalCollectionOfTournament =async (req,res,next) =>{
  try{
  const { id } = req.params;

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    const totalCash =
      tournament.entryFee * tournament.joinedPlayers.length;

    res.status(200).json({
      success: true,
      title: tournament.title,
      entryFee: tournament.entryFee,
      totalCash:totalCash
    });
  }catch(error){
    next(error)
  }
}


export const getWithdrawRequests = async (req, res, next) => {
  try {
    const requests = await Transaction.find({
      type: "WITHDRAW",
      status: "PENDING"
    })
      .populate("user", "name email phoneNumber withdrawBalance")
      .sort({ createdAt: -1 });

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