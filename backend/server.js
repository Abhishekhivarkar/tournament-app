import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { scheduleRoomRelease, scheduleTournamentStart } from "./utils/tournamentScheduler.js";
import TournamentModel from "./models/Tournament.model.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

  
    await connectDB();

   
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });


    await initSchedulers();

  } catch (error) {
    console.error("Server start error:", error);
    process.exit(1);
  }
};

const initSchedulers = async () => {
  try {

    console.log("Initializing tournament schedulers...");

    const now = new Date();

    const tournaments = await TournamentModel.find({
      status: "upcoming",
      isCancelled: false,
      startTime: { $gt: now }
    }).select("_id startTime");

    if (!tournaments.length) {
      console.log("No upcoming tournaments found for scheduling");
      return;
    }

    for (const tournament of tournaments) {

      try {

        // tournament start
        scheduleTournamentStart(
          tournament._id.toString(),
          tournament.startTime
        );

        // room release (10 min before)
        scheduleRoomRelease(
          tournament._id.toString(),
          new Date(tournament.startTime.getTime() - 10 * 60 * 1000)
        );

      } catch (error) {

        console.error(
          `Scheduler failed for tournament ${tournament._id}`,
          error
        );

      }
    }

    console.log(`${tournaments.length} tournament schedulers initialized`);

  } catch (error) {

    console.error("Scheduler initialization failed:", error);

  }
};
startServer();
