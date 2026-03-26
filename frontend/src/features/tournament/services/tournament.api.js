import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true
})

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getAllTournaments = async () => {

  try {

    const res = await api.get("/tournament")

    return res.data

  } catch (err) {

    return {
      err: true,
      message: err.response?.data?.message
    }

  }

}


export const getTournamentById = async (id) => {

  try {

    const res = await api.get(`/tournament/${id}`)

    return res.data

  } catch (err) {

    return {
      err: true,
      message: err.response?.data?.message
    }

  }

}


export const joinTournament = async (id) => {

  try {

    const res = await api.post(`/tournament/${id}/join`)

    return res.data

  } catch (err) {

    return {
      err: true,
      message: err.response?.data?.message
    }

  }

}


export const createTournament = async (data) => {

  try {

    const res = await api.post("/tournament", data)

    return res.data

  } catch (err) {

    return {
      err: true,
      message: err.response?.data?.message
    }

  }

}


export const setRoomDetails = async (id, data) => {

  try {

    const res = await api.patch(`/tournament/${id}/room`, data)

    return res.data

  } catch (err) {

    return {
      err: true,
      message: err.response?.data?.message
    }

  }

}


export const declareWinners = async (id, data) => {

  try {

    const res = await api.post(`/tournament/${id}/winners`, data)

    return res.data

  } catch (err) {

    return {
      err: true,
      message: err.response?.data?.message
    }

  }

}


export const cancelTournament = async (id) => {

  try {

    const res = await api.patch(`/tournament/${id}/cancel`, {
      confirm: true
    })

    return res.data

  } catch (err) {

    return {
      err: true,
      message: err.response?.data?.message
    }

  }

}