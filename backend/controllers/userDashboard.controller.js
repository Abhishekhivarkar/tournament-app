import {
getProfileService,
getJoinedMatchesService
} from "../services/userDashboard.service.js"

export const getProfile = (req,res,next)=>{
try{

const user = getProfileService(req.user)

res.json({
success:true,
data:user
})

}catch(error){
console.log("GET PROFILE ERROR : ",error)
next(error)
}
}

export const getJoinedMatches = async (req,res,next)=>{
try{

const tournaments = await getJoinedMatchesService(req.user._id)

res.json({
success:true,
count:tournaments.length,
data:tournaments
})

}catch(error){
console.error("JOINED MATCHES ERROR:",error)
next(error)
}
}