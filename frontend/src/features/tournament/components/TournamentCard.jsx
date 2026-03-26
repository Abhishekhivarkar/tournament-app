import { useTournament } from "../hooks/useTournament"
import toast from "react-hot-toast"

export default function TournamentCard({ tournament }) {

  const { handleJoinTournament, loading } = useTournament()

  const handleJoin = async () => {

    const data = await handleJoinTournament(tournament._id)

    if (!data || data.err) {
      toast.error(data?.message || "Failed to join tournament")
      return
    }

    toast.success("Successfully joined tournament 🎮")

  }

  return (

    <div className="bg-[#0f172a] border border-blue-900/40 rounded-xl p-5 flex flex-col gap-3">

      {/* Title */}
      <h2 className="text-xl font-semibold text-cyan-400">
        {tournament.title}
      </h2>

      {/* Map */}
      <p className="text-gray-400 text-sm">
        Map: {tournament.map}
      </p>

      {/* Entry fee */}
      <p className="text-green-400 font-semibold">
        Entry Fee: ₹{tournament.entryFee}
      </p>

      {/* Players */}
      <p className="text-gray-400 text-sm">
        Players: {tournament.joinedPlayers?.length || 0}/{tournament.maxPlayers}
      </p>

      {/* Start time */}
      <p className="text-gray-400 text-sm">
        Start: {new Date(tournament.startTime).toLocaleString()}
      </p>

      {/* Status */}
      <span className="text-sm text-yellow-400">
        {tournament.status}
      </span>

      {/* Join button */}
      <button
        disabled={loading || tournament.status !== "upcoming"}
        onClick={handleJoin}
        className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 py-2 rounded-lg font-semibold disabled:opacity-50"
      >
        Join Tournament
      </button>

    </div>

  )
}