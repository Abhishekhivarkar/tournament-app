import { useEffect } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { useUserDashboard } from "../hooks/useUserDashboard"
import { useNavigate } from "react-router-dom"
export default function UserDashboard() {
  const navigate = useNavigate()
  const { user, handleLogout } = useAuth()
  const { joinedMatches, loading, handleGetJoinedMatches } = useUserDashboard()

  useEffect(() => {

    handleGetJoinedMatches()

  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#0e1324] to-[#020617] text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex flex-col ">
            <h1 className="text-3xl font-bold text-blue-400">
              Welcome {user?.name}
            </h1>

            <p className="text-gray-400">
              Manage your tournaments and matches
            </p>
          </div>

        <div className="flex gap-3">

  <button
    onClick={()=>navigate("/withdraw")}
    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold"
  >
    Withdraw
  </button>

  <button
    onClick={()=>navigate("/transactions")}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold"
  >
    History
  </button>

  <button
    onClick={handleLogout}
    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold"
  >
    Logout
  </button>

</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">
            <h3 className="text-gray-400 text-sm">Joined Matches</h3>
            <p className="text-3xl font-bold text-blue-400">
              {joinedMatches.length}
            </p>
          </div>

          <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">
            <h3 className="text-gray-400 text-sm">Wallet Balance</h3>
            <p className="text-3xl font-bold text-green-400">
              ₹{user?.walletBalance || 0}
            </p>
          </div>

          <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">
            <h3 className="text-gray-400 text-sm">Total Wins</h3>
            <p className="text-3xl font-bold text-yellow-400">
              {user?.totalWins || 0}
            </p>
          </div>

          <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">
            <h3 className="text-gray-400 text-sm">Withdraw Balance</h3>
            <p className="text-3xl font-bold text-purple-400">
              ₹{user?.withdrawBalance || 0}
            </p>
          </div>
        </div>

        {/* Matches */}
        <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">

          <h2 className="text-xl font-bold text-blue-400 mb-4">
            My Matches
          </h2>

          {loading ? (

            <p className="text-gray-400">Loading matches...</p>

          ) : joinedMatches.length === 0 ? (

            <p className="text-gray-400">
              You haven't joined any matches yet.
            </p>

          ) : (

            <div className="grid md:grid-cols-2 gap-4">

              {joinedMatches.map((match) => (

                <div
                  key={match._id}
                  className="bg-[#020617] border border-blue-900/40 rounded-lg p-4"
                >

                  <h3 className="font-semibold text-blue-300">
                    {match.title}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    Map: {match.map}
                  </p>

                  <p className="text-gray-400 text-sm">
                    Start Time: {new Date(match.startTime).toLocaleString()}
                  </p>

                  <p className="text-gray-400 text-sm">
                    Status: {match.status}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  )
}