import mongoose from "mongoose";

const prizeDistributionSchema = new mongoose.Schema(
  {
    position: {
      type: Number,
      required: true
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  { _id: false }
);

const winnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    winAmount: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const tournamentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    game: {
      type: String,
      default: "BGMI"
    },

    map: {
  type: String,
  enum: ["erangle", "tdm", "livik"],
  default: "erangle"
},

    entryFee: {
      type: Number,
      required: true,
      min: 0
    },

    maxPlayers: {
      type: Number,
      default: 100,
      min: 1,
      max: 100
    },

    joinedPlayers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    refundProcessed: {
  type: Boolean,
  default: false
},

    prizePoolPercentage: {
      type: Number,
      default: 85,
      min: 50,
      max: 95
    },


    prizeDistribution: {
      type: [prizeDistributionSchema],
      required: true
    },

    startTime: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming"
    },

    roomId: {
      type: String,
      default: null
    },

    roomPassword: {
      type: String,
      default: null
    },

    winners: {
      type: [winnerSchema],
      default: []
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },

    isCancelled: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

tournamentSchema.pre("save", function () {
  if (!this.prizeDistribution || this.prizeDistribution.length === 0) {
    return;
  }

  const totalPercentage = this.prizeDistribution.reduce(
    (sum, item) => sum + item.percentage,
    0
  );

  if (totalPercentage !== 100) {
    throw new Error("Prize distribution percentages must total 100%");
  }
});

export default mongoose.model("Tournament", tournamentSchema);