import axios from "axios"

const api = axios.create({
  baseURL:"http://localhost:5001/api",
  withCredentials:true
})

api.interceptors.request.use((config) =>{

  const token = localStorage.getItem("token")

  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getAllUsers = async () =>{
  try{

    const response = await api.get("/admin/dashboard/all-users")

    return response.data

  }catch(err){

    return{
      err:true,
      message:err.response?.data?.message
    }

  }
}

export const getAllTournaments = async () =>{
  try{

    const response = await api.get("/admin/dashboard/all-tournaments")

    return response.data

  }catch(err){

    return{
      err:true,
      message:err.response?.data?.message
    }

  }
}

export const getRegisteredUsers = async (id) =>{
  try{

    const response = await api.get(`/admin/dashboard/${id}/players`)

    return response.data

  }catch(err){

    return{
      err:true,
      message:err.response?.data?.message
    }

  }
}

export const getTotalCollectionOfTournament = async (id) =>{
  try{

    const response = await api.get(`/admin/dashboard/${id}/cash`)

    return response.data

  }catch(err){

    return{
      err:true,
      message:err.response?.data?.message
    }

  }
}

export const getWithdrawRequests = async () =>{
  try{

    const response = await api.get("/admin/withdraw-requests")

    return response.data

  }catch(err){

    return{
      err:true,
      message:err.response?.data?.message
    }

  }
}

export const getAdminProfile = async () =>{
  try{

    const response = await api.get("/admin/dashboard/profile")

    return response.data

  }catch(err){

    return{
      err:true,
      message:err.response?.data?.message
    }

  }
}

export const updateWithdrawStatus = async (id,status) => {

  try{

    const res = await api.patch(`/transaction/withdraw/${id}/status`,{
      status
    })

    return res.data

  }catch(err){

    return{
      err:true,
      message:err.response?.data?.message
    }

  }

}