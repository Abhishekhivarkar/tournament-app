import Tournament from "../models/Tournament.model.js"

export const getProfileService = (user)=>{
return user
}

export const getJoinedMatchesService = async(userId)=>{

const tournaments = await Tournament.find(
{ joinedPlayers:userId },
{
title:1,
map:1,
roomId:1,
roomPassword:1,
startTime:1,
status:1
}
).sort({startTime:-1})



return tournaments
}