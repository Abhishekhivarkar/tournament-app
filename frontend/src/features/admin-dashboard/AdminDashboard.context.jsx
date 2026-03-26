import { useState } from "react";
import { createContext } from "react";

export const AdminDashboardContext = createContext()

export const AdminDashboardProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [tournaments, setTournaments] = useState([])
    const [registeredUsers, setRegisteredUsers] = useState([])
    const [collection, setCollection] = useState(null)
    const [withdrawRequests, setWithdrawRequests] = useState([])

    return (
        <AdminDashboardContext.Provider value={{ loading, setLoading, users, setUsers, tournaments, setTournaments, registeredUsers, setRegisteredUsers, collection, setCollection, withdrawRequests, setWithdrawRequests }}>
            {children}
        </AdminDashboardContext.Provider>
    )
}