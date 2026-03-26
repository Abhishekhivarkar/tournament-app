import { useEffect } from "react";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import AdminLayout from "../components/AdminLayout"
export default function Users() {

  const {
    users,
    loading,
    handleGetAllUsers
  } = useAdminDashboard();


  useEffect(() => {

    handleGetAllUsers();

  }, []);


  return (
    <AdminLayout>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
           
          <h1 className="text-3xl font-bold text-cyan-400">
            Users
          </h1>

          <p className="text-gray-400">
            Manage all platform users
          </p>
         
        </div>


        {/* Table */}
        <div className="bg-[#0f172a] rounded-xl border border-blue-900/40 overflow-hidden">

          {loading ? (

            <p className="p-6 text-gray-400">
              Loading users...
            </p>

          ) : users.length === 0 ? (

            <p className="p-6 text-gray-400">
              No users found.
            </p>

          ) : (

            <table className="w-full text-left">

              <thead className="bg-[#020617] border-b border-blue-900/40">
                <tr>

                  <th className="p-4 text-sm text-gray-400">
                    Name
                  </th>

                  <th className="p-4 text-sm text-gray-400">
                    Email
                  </th>
                    <th className="p-4 text-sm text-gray-400">
                        BGMI ID
                    </th>
                  <th className="p-4 text-sm text-gray-400">
                    Phone
                  </th>

                  <th className="p-4 text-sm text-gray-400">
                    Wallet
                  </th>

                  <th className="p-4 text-sm text-gray-400">
                    Status
                  </th>

                </tr>
              </thead>


              <tbody>

                {users.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b border-blue-900/20 hover:bg-[#020617]"
                  >

                    <td className="p-4">
                      {user.name}
                    </td>

                    <td className="p-4 text-gray-400">
                      {user.email}
                    </td>

                    <td className="p-4 text-gray-400">
                       {user.bgmiGameId}
                    </td>
                    <td className="p-4 text-gray-400">
                      {user.phoneNumber}
                    </td>

                    <td className="p-4 text-green-400">
                      ₹{user.walletBalance}
                    </td>

                    <td className="p-4">

                      {user.isBanned ? (

                        <span className="text-red-400">
                          Banned
                        </span>

                      ) : (

                        <span className="text-green-400">
                          Active
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </AdminLayout>
  );
}