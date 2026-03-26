import { createContext, useState } from "react"

export const TournamentContext = createContext()

export const TournamentProvider = ({ children }) => {

  const [tournaments, setTournaments] = useState([])
  const [selectedTournament, setSelectedTournament] = useState(null)

  const [players, setPlayers] = useState([])

  const [loading, setLoading] = useState(false)

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        setTournaments,

        selectedTournament,
        setSelectedTournament,

        players,
        setPlayers,

        loading,
        setLoading
      }}
    >
      {children}
    </TournamentContext.Provider>
  )
}