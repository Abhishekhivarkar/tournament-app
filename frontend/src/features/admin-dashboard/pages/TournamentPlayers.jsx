import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAdminDashboard } from "../hooks/useAdminDashboard"
import AdminLayout from "../components/AdminLayout"

export default function TournamentPlayers() {

  const { id } = useParams()

  const {
    registeredUsers,
    handleGetRegisteredUsers
  } = useAdminDashboard()

  useEffect(() => {
    handleGetRegisteredUsers(id)
  }, [])

  return (

    <AdminLayout>

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-cyan-400 mb-6">
          Tournament Players
        </h1>

        <div className="bg-[#0f172a] rounded-xl border border-blue-900/40 overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-[#020617] border-b border-blue-900/40">

              <tr>

                <th className="p-4 text-gray-400">Name</th>
                <th className="p-4 text-gray-400">Email</th>
                <th className="p-4 text-gray-400">BGMI ID</th>
                <th className="p-4 text-gray-400">Phone</th>

              </tr>

            </thead>

            <tbody>

              {registeredUsers.map((u) => (

                <tr
                  key={u._id}
                  className="border-b border-blue-900/20"
                >

                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.bgmiGameId}</td>
                  <td className="p-4">{u.phoneNumber}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>

  )
}