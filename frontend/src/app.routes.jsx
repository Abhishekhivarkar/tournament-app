import { createBrowserRouter } from "react-router-dom"

import Login from "./features/auth/pages/Login"
import UserRegister from "./features/auth/pages/UserRegister"
import AdminRegister from "./features/auth/pages/AdminRegister"

import { Protected, PublicRoute } from "./features/auth/components/Protected"
import ForgotPassword from "./features/auth/pages/ForgotPassword"
import ResetPassword from "./features/auth/pages/ResetPassword"
import CheckEmail from "./features/auth/pages/CheckEmail"
import UserDashboard from "./features/user_dashboard/pages/UserDashboard"

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
        path: "/check-email",
        element: (
            <PublicRoute>
                <CheckEmail />
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
        path: "/forgot-password",
        element: (
            <PublicRoute>
                <ForgotPassword />
            </PublicRoute>
        )
    },

    {
        path: "/reset-password/:token",
        element: (
            <PublicRoute>
                <ResetPassword />
            </PublicRoute>
        )
    },
   

    {
        path: "/admin/dashboard",
        element: (
            <Protected>
                <AdminDashboard />
            </Protected>
        )
    },

    // user dashboard routes
 {
        path: "/user/dashboard",
        element: (
            <Protected>
                <UserDashboard />
            </Protected>
        )
    },

])