import { createBrowserRouter } from "react-router-dom"

import Login from "./features/auth/pages/Login"
import UserRegister from "./features/auth/pages/UserRegister"
import AdminRegister from "./features/auth/pages/AdminRegister"

import { Protected, PublicRoute } from "./features/auth/components/Protected"
import ForgotPassword from "./features/auth/pages/ForgotPassword"
import ResetPassword from "./features/auth/pages/ResetPassword"
import CheckEmail from "./features/auth/pages/CheckEmail"
import UserDashboard from "./features/user_dashboard/pages/UserDashboard"
import AdminDashboard from "./features/admin-dashboard/pages/AdminDashboard"
import Users from "./features/admin-dashboard/pages/Users"
import AdminTournaments from "./features/admin-dashboard/pages/AdminTournaments"
import TournamentPlayers from "./features/admin-dashboard/pages/TournamentPlayers"
import TournamentDetails from "./features/admin-dashboard/pages/TournamentDetails"
import Tournaments from "./features/tournament/pages/Tournaments"
import CreateTournament from "./features/admin-dashboard/pages/CreateTournament"
import WithdrawRequests from "./features/admin-dashboard/pages/WithdrawRequests"
import Withdraw from "./features/transaction/pages/Withdraw"
import TransactionHistory from "./features/transaction/pages/TransactionHistory"
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

    {
        path: "/admin/dashboard/all-users",
        element: (
            <Protected>
                <Users />
            </Protected>
        )
    },

    {
        path: "/admin/tournaments",
        element: (
            <Protected>
                <AdminTournaments />
            </Protected>
        )
    },

    {
        path: "/admin/tournaments/:id/players",
        element: (
            <Protected>
                <TournamentPlayers />
            </Protected>
        )
    },

    {
        path: "/admin/tournaments/:id",
        element: (
            <Protected>
                <TournamentDetails />
            </Protected>
        )
    },
    {
        path: "/",
        element: (
            <Protected>
                <Tournaments />
            </Protected>
        )
    },
    {
        path: "/admin/create-tournament",
        element: (
            <Protected>
                <CreateTournament />
            </Protected>
        )
    },

    {
        path: "/admin/withdraw-requests",
        element: (
            <Protected>
                <WithdrawRequests />
            </Protected>
        )
    },
    {
        path: "/withdraw",
        element: (
            <Protected>
                <Withdraw />
            </Protected>
        )
    },

    {
        path: "/transactions",
        element: (
            <Protected>
                <TransactionHistory />
            </Protected>
        )
    }
])