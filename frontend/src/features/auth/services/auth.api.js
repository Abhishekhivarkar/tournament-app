import axios from "axios"

const api = axios.create({
 baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api"
})

api.interceptors.request.use((config) => {

 const token = localStorage.getItem("token")

 if (token) {
  config.headers.Authorization = `Bearer ${token}`
 }

 return config

})



export const registerUser = async ({
 name,
 email,
 phoneNumber,
 bgmiGameId,
 password
}) => {

 try {

  const response = await api.post("/auth/user-register", {
   name,
   email,
   phoneNumber,
   bgmiGameId,
   password
  })

  return response.data

 } catch (err) {

  return{
    error:true,
    message:err.response?.data?.message
  }

}
}



export const registerAdmin = async ({
 name,
 email,
 phoneNumber,
 password,
 secretKey
}) => {

 try {

  const response = await api.post("/auth/admin-register", {
   name,
   email,
   phoneNumber,
   password,
   secretKey
  })

  return response.data

 } catch (err) {

  return{
    error:true,
    message:err.response?.data?.message
  }

 }

}



export const login = async ({ email, password }) => {

 try {

  const response = await api.post("/auth/login", {
   email,
   password
  })

  if (response.data?.token) {
   localStorage.setItem("token", response.data.token)
  }

  return response.data

 } catch (err) {

  return{
    error:true,
    message:err.response?.data?.message
  }

 }

}



export const logout = async () => {

 try {

  const response = await api.post("/auth/logout")

  localStorage.removeItem("token")

  return response.data

 } catch (err) {

  return{
    error:true,
    message:err.response?.data?.message
  }

 }

}



export const forgotPassword = async ({ email }) => {

 try {

  const response = await api.post("/auth/forgot-password", {
   email
  })

  return response.data

 } catch (err) {

  return{
    error:true,
    message:err.response?.data?.message
  }

 }

}



export const resetPassword = async ({
 token,
 newPassword,
 confirmPassword
}) => {

 try {

  const response = await api.post(
   `/auth/reset-password/${token}`,
   {
    newPassword,
    confirmPassword
   }
  )

  return response.data

 } catch (err) {

  return{
    error:true,
    message:err.response?.data?.message
  }

 }

}

export const getMe = async () => {

 try {

  const response = await api.get("/user/dashboard/profile")
  return response.data

 } catch {

  try {

   const response = await api.get("/admin/dashboard/profile")
   return response.data

  } catch {

   return{
    error:true,
    message:err.response?.data?.message
  }

  }

 }
}

