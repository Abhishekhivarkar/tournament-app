import { createBrowserRouter } from "react-router-dom"

import Login from "./features/auth/pages/Login"
import UserRegister from "./features/auth/pages/UserRegister"
import AdminRegister from "./features/auth/pages/AdminRegister"

import { Protected, PublicRoute } from "./features/auth/components/Protected"

const UserDashboard = () => <div className="text-white p-6">Dashboard</div>
const AdminDashboard = () => <div className="text-white p-6">Admin Dashboard</div>

export const router = createBrowserRouter([

 {
  path: "/login",
  element: (
   <PublicRoute>
    <Login />
   </PublicRoute>
  )
 },

 {
  path: "/register/user",
  element: (
   <PublicRoute>
    <UserRegister />
   </PublicRoute>
  )
 },

 {
  path: "/register/admin",
  element: (
   <PublicRoute>
    <AdminRegister />
   </PublicRoute>
  )
 },

 {
  path: "/user/dashboard",
  element: (
   <Protected>
    <UserDashboard />
   </Protected>
  )
 },

 {
  path: "/admin/dashboard",
  element: (
   <Protected>
    <AdminDashboard />
   </Protected>
  )
 }

])