import { useEffect } from "react"
import { useTournament } from "../hooks/useTournament"
import TournamentCard from "../components/TournamentCard"

export default function Tournaments() {

  const {
    tournaments,
    loading,
    handleGetAllTournaments
  } = useTournament()


  useEffect(() => {

    handleGetAllTournaments()

  }, [])


  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#0e1324] to-[#020617] text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-cyan-400">
            BGMI Tournaments
          </h1>

          <p className="text-gray-400">
            Join competitive BGMI matches and win prizes
          </p>

        </div>


        {/* Tournament list */}

        {loading ? (

          <p className="text-gray-400">
            Loading tournaments...
          </p>

        ) : tournaments.length === 0 ? (

          <p className="text-gray-400">
            No tournaments available
          </p>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {tournaments.map((tournament) => (

              <TournamentCard
                key={tournament._id}
                tournament={tournament}
              />

            ))}

          </div>

        )}

      </div>

    </div>

  )
}