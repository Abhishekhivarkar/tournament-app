import { useEffect } from "react"
import { useAdminDashboard } from "../hooks/useAdminDashboard"
import AdminLayout from "../components/AdminLayout"
import { Link } from "react-router-dom"

export default function Tournaments() {

  const {
    tournaments,
    loading,
    handleGetAllTournaments
  } = useAdminDashboard()

  useEffect(() => {
    handleGetAllTournaments()
  }, [])

  return (
    <AdminLayout>

      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex justify-between items-center">

  <div>
    <h1 className="text-3xl font-bold text-cyan-400">
      Tournaments
    </h1>

    <p className="text-gray-400">
      Manage all tournaments
    </p>
  </div>

  <Link
    to="/admin/create-tournament"
    className="bg-cyan-500 px-4 py-2 rounded font-semibold"
  >
    Create Tournament
  </Link>

</div>
        <div className="bg-[#0f172a] rounded-xl border border-blue-900/40 overflow-hidden">

          {loading ? (

            <p className="p-6 text-gray-400">
              Loading tournaments...
            </p>

          ) : tournaments.length === 0 ? (

            <p className="p-6 text-gray-400">
              No tournaments found
            </p>

          ) : (

            <table className="w-full text-left">

              <thead className="bg-[#020617] border-b border-blue-900/40">
                <tr>

                  <th className="p-4 text-gray-400">Title</th>
                  <th className="p-4 text-gray-400">Entry Fee</th>
                  <th className="p-4 text-gray-400">Players</th>
                  <th className="p-4 text-gray-400">Status</th>
                  <th className="p-4 text-gray-400">Start Time</th>
                  <th className="p-4 text-gray-400">Actions</th>

                </tr>
              </thead>

              <tbody>

                {tournaments.map((t) => (

                  <tr
                    key={t._id}
                    className="border-b border-blue-900/20 hover:bg-[#020617]"
                  >

                    <td className="p-4">{t.title}</td>

                    <td className="p-4 text-green-400">
                      ₹{t.entryFee}
                    </td>

                    <td className="p-4">
                      {t.joinedPlayers?.length || 0}/{t.maxPlayers}
                    </td>

                    <td className="p-4 text-blue-400">
                      {t.status}
                    </td>

                    <td className="p-4 text-gray-400">
                      {new Date(t.startTime).toLocaleString()}
                    </td>

                    <td className="p-4 flex gap-3">

                      <Link
                        to={`/admin/tournaments/${t._id}/players`}
                        className="text-blue-400 hover:underline"
                      >
                        Players
                      </Link>

                      <Link
                        to={`/admin/tournaments/${t._id}`}
                        className="text-cyan-400 hover:underline"
                      >
                        Manage
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </AdminLayout>
  )
}