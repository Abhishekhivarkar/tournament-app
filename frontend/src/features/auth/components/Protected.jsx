import { useAuth } from "../hooks/useAuth.js"
import { Navigate } from "react-router-dom"

export const Protected = ({ children }) => {

 const { loading, user } = useAuth()

 if (loading) {
  return (
   <main className="flex items-center justify-center min-h-screen text-white">
    <p>Loading...</p>
   </main>
  )
 }

 if (!user) {
  return <Navigate to="/login" replace />
 }

 return children
}



export const PublicRoute = ({ children }) => {

 const { loading, user } = useAuth()

 if (loading) {
  return (
   <main className="flex items-center justify-center min-h-screen text-white">
    <p>Loading...</p>
   </main>
  )
 }

 if (user) {
  return <Navigate to="/dashboard" replace />
 }

 return children
}