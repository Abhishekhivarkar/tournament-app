import { useContext } from "react"
import { TournamentContext} from "../Tournament.context"

import {
  getAllTournaments,
  getTournamentById,
  joinTournament
} from "../services/tournament.api"

export const useTournament = () => {

  const context = useContext(TournamentContext)

  if (!context) {
    throw new Error("useTournament must be used within TournamentProvider")
  }

  const {
    tournaments,
    setTournaments,
    selectedTournament,
    setSelectedTournament,
    loading,
    setLoading
  } = context


  const handleGetAllTournaments = async () => {

    try {

      setLoading(true)

      const data = await getAllTournaments()

      if (data && data.data) {
        setTournaments(data.data)
      }

    } catch (err) {

      console.log(err)

    } finally {

      setLoading(false)

    }

  }


  const handleGetTournamentById = async (id) => {

    try {

      setLoading(true)

      const data = await getTournamentById(id)

      if (data && data.data) {
        setSelectedTournament(data.data)
      }

    } catch (err) {

      console.log(err)

    } finally {

      setLoading(false)

    }

  }


  const handleJoinTournament = async (id) => {

    try {

      setLoading(true)

      const data = await joinTournament(id)

      return data

    } catch (err) {

      console.log(err)

    } finally {

      setLoading(false)

    }

  }

  return {

    tournaments,
    selectedTournament,
    loading,

    handleGetAllTournaments,
    handleGetTournamentById,
    handleJoinTournament
  }

}