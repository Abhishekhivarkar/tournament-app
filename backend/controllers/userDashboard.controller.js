import User from "../models/User.model.js"
import Tournament from "../models/Tournament.model.js"
export const getProfile = (req,res,next) =>{
  try{
    res.json({
      success:true,
      data:req.user
    })
  }catch(error){
    console.log("GET PROFILE ERROR : ",error)
    next(error)
  }
}


export const getJoinedMatches = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const tournaments = await Tournament.find(
      { joinedPlayers: userId },
      {
        title: 1,
        map: 1,
        roomId: 1,
        roomPassword: 1,
        startTime: 1,
        status: 1
      }
    ).sort({ startTime: -1 });

    if (!tournaments || tournaments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No joined tournaments found"
      });
    }

    res.json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });
  } catch (error) {
    console.error("JOINED MATCHES ERROR:", error);
    next(error);
  }
};