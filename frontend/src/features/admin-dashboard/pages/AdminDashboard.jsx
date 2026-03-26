import { useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import AdminLayout from "../components/AdminLayout"
export default function AdminDashboard() {

  const { user } = useAuth();

  const {
    users,
    tournaments,
    withdrawRequests,
    handleGetAllUsers,
    handleGetAllTournaments,
    handleGetWithdrawRequests,
    loading
  } = useAdminDashboard();


  useEffect(() => {

    handleGetAllUsers();
    handleGetAllTournaments();
    handleGetWithdrawRequests();

  }, []);


  return (
     <AdminLayout>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">

          <div>
         
            <h1 className="text-3xl font-bold text-cyan-400">
              Admin Dashboard
            </h1>

            <p className="text-gray-400">
              Welcome {user?.name}
            </p>
            
          </div>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* Users */}
          <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">
            <h3 className="text-gray-400 text-sm mb-2">
              Total Users
            </h3>

            <p className="text-3xl font-bold text-blue-400">
              {users.length}
            </p>
          </div>


          {/* Tournaments */}
          <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">
            <h3 className="text-gray-400 text-sm mb-2">
              Total Tournaments
            </h3>

            <p className="text-3xl font-bold text-green-400">
              {tournaments.length}
            </p>
          </div>


          {/* Withdraw Requests */}
          <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">
            <h3 className="text-gray-400 text-sm mb-2">
              Withdraw Requests
            </h3>

            <p className="text-3xl font-bold text-yellow-400">
              {withdrawRequests.length}
            </p>
          </div>

        </div>


        {/* Recent Tournaments */}
        <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">

          <h2 className="text-xl font-bold text-blue-400 mb-4">
            Recent Tournaments
          </h2>

          {loading ? (

            <p className="text-gray-400">
              Loading tournaments...
            </p>

          ) : tournaments.length === 0 ? (

            <p className="text-gray-400">
              No tournaments available.
            </p>

          ) : (

            <div className="grid md:grid-cols-2 gap-4">

              {tournaments.slice(0, 6).map((tournament) => (

                <div
                  key={tournament._id}
                  className="bg-[#020617] border border-blue-900/40 rounded-lg p-4"
                >

                  <h3 className="font-semibold text-blue-300">
                    {tournament.title}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    Entry Fee: ₹{tournament.entryFee}
                  </p>

                  <p className="text-gray-400 text-sm">
                    Players: {tournament.joinedPlayers?.length || 0}/{tournament.maxPlayers}
                  </p>

                  <p className="text-gray-400 text-sm">
                    Status: {tournament.status}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </AdminLayout>
  );
}