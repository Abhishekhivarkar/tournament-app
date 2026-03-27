import schedule from "node-schedule";
import Tournament from "../models/Tournament.model.js";
import { sendTournamentRoomMail } from "../services/mail.service.js";

const scheduledJobs = {};

export const scheduleTournamentStart = (tournamentId, startTime) => {

  if (scheduledJobs[tournamentId]) {
    scheduledJobs[tournamentId].cancel();
  }

  const job = schedule.scheduleJob(new Date(startTime), async () => {
    try {

      const tournament = await Tournament.findById(tournamentId);

      if (!tournament) return;

      if (tournament.status === "upcoming" && !tournament.isCancelled) {
        tournament.status = "ongoing";
        await tournament.save();

        console.log(`Tournament ${tournamentId} started`);
      }

    } catch (error) {
      console.error("Tournament scheduler error:", error);
    }
  });

  scheduledJobs[tournamentId] = job;
};

export const scheduleRoomRelease = (tournamentId, releaseTime) => {

  schedule.scheduleJob(releaseTime, async () => {

    try {

      const tournament = await Tournament
        .findById(tournamentId)
        .populate("joinedPlayers", "name email");

      if (!tournament || tournament.roomReleased) return;

      tournament.roomReleased = true;
      await tournament.save();

      const players = tournament.joinedPlayers;

      for (const player of players) {

        await sendTournamentRoomMail({
          userEmail: player.email,
          userName: player.name,
          tournamentTitle: tournament.title,
          map: tournament.map,
          startTime: tournament.startTime,
          roomId: tournament.roomId,
          roomPassword: tournament.roomPassword
        });

      }

      console.log(`Room released for tournament ${tournamentId}`);

    } catch (error) {

      console.error("Room release cron error:", error);

    }

  });

};