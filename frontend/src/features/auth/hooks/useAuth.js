import { useContext } from "react"
import { AuthContext } from "../auth.context.jsx"
import {
 login,
 registerUser,
 registerAdmin,
 logout,
 forgotPassword,
 resetPassword
} from "../services/auth.api.js"

export const useAuth = () => {

 const context = useContext(AuthContext)

 if (!context) {
  throw new Error("useAuth must be used within an AuthProvider")
 }

 const { user, setUser, loading, setLoading } = context


 const handleLogin = async ({ email, password }) => {
  try {

    setLoading(true)

    const data = await login({ email, password })

    if (data && data.token) {

      setUser({ role: data.role })

      return data.role   
    }

    return null

  } catch (err) {

    console.log(err)

  } finally {

    setLoading(false)

  }
}


 const handleRegisterUser = async ({
  name,
  email,
  phoneNumber,
  bgmiGameId,
  password
 }) => {

  try {

   setLoading(true)

   const data = await registerUser({
    name,
    email,
    phoneNumber,
    bgmiGameId,
    password
   })

   return data

  } catch (err) {

   console.log(err)

  } finally {

   setLoading(false)

  }

 }


 const handleRegisterAdmin = async ({
  name,
  email,
  phoneNumber,
  password,
  secretKey
 }) => {

  try {

   setLoading(true)

   const data = await registerAdmin({
    name,
    email,
    phoneNumber,
    password,
    secretKey
   })

   return data

  } catch (err) {

   console.log(err)

  } finally {

   setLoading(false)

  }

 }


 const handleLogout = async () => {

  try {

   setLoading(true)

   await logout()

   setUser(null)

  } catch (err) {

   console.log(err)

  } finally {

   setLoading(false)

  }

 }


 const handleForgotPassword = async ({ email }) => {

  try {

   setLoading(true)

   const data = await forgotPassword({ email })

   return data

  } catch (err) {

   console.log(err)

  } finally {

   setLoading(false)

  }

 }


 const handleResetPassword = async ({
  token,
  newPassword,
  confirmPassword
 }) => {

  try {

   setLoading(true)

   const data = await resetPassword({
    token,
    newPassword,
    confirmPassword
   })

   return data

  } catch (err) {

   console.log(err)

  } finally {

   setLoading(false)

  }

 }


 return {
  user,
  loading,
  handleLogin,
  handleLogout,
  handleRegisterUser,
  handleRegisterAdmin,
  handleForgotPassword,
  handleResetPassword
 }

}