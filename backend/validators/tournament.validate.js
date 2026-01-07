import Joi from "joi";

export const createTournamentSchema = Joi.object({
  title: Joi.string().min(3).required(),

  map: Joi.string()
    .valid("erangle", "tdm", "livik")
    .default("erangle"),

  entryFee: Joi.number().min(0).required(),

  maxPlayers: Joi.number().min(1).max(100).default(100),

  prizePoolPercentage: Joi.number().min(50).max(95).default(85),

  prizeDistribution: Joi.array()
    .items(
      Joi.object({
        position: Joi.number().min(1).required(),
        percentage: Joi.number().min(1).max(100).required()
      })
    )
    .min(1)
    .required()
    .custom((value, helpers) => {
      const total = value.reduce((s, v) => s + v.percentage, 0);
      if (total !== 100) {
        return helpers.message("Prize distribution must total 100%");
      }

      const positions = value.map(v => v.position);
      if (new Set(positions).size !== positions.length) {
        return helpers.message("Duplicate positions not allowed");
      }

      return value;
    }),

  startTime: Joi.date().greater("now").required()
});


export const updateTournamentStatusSchema = Joi.object({
  status: Joi.string()
    .valid("upcoming", "ongoing", "completed")
    .required()
});


export const cancelTournamentSchema = Joi.object({
  confirm: Joi.boolean().valid(true).required()
});


export const setRoomDetailsSchema = Joi.object({
  roomId: Joi.string().trim().min(3).required(),
  roomPassword: Joi.string().trim().min(3).required()
});



export const declareWinnersSchema = Joi.object({
  winners: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().hex().length(24).required(),
        position: Joi.number().min(1).required()
      })
    )
    .min(1)
    .required()
    .custom((value, helpers) => {
      const users = value.map(v => v.userId);
      if (new Set(users).size !== users.length) {
        return helpers.message("Duplicate winner userId not allowed");
      }

      const positions = value.map(v => v.position);
      if (new Set(positions).size !== positions.length) {
        return helpers.message("Duplicate winner positions not allowed");
      }

      return value;
    })
});