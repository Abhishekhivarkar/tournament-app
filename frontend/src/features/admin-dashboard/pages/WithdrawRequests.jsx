import { useEffect } from "react"
import AdminLayout from "../components/AdminLayout"
import { useAdminDashboard } from "../hooks/useAdminDashboard"

export default function WithdrawRequests() {

  const {
    withdrawRequests,
    loading,
    handleGetWithdrawRequests
  } = useAdminDashboard()

  useEffect(()=>{
    handleGetWithdrawRequests()
  },[])

  return (

    <AdminLayout>

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-cyan-400 mb-6">
          Withdraw Requests
        </h1>

        <div className="bg-[#0f172a] rounded-xl border border-blue-900/40 overflow-hidden">

          {loading ? (

            <p className="p-6 text-gray-400">
              Loading requests...
            </p>

          ) : withdrawRequests.length === 0 ? (

            <p className="p-6 text-gray-400">
              No withdraw requests
            </p>

          ) : (

            <table className="w-full text-left">

              <thead className="bg-[#020617] border-b border-blue-900/40">

                <tr>

                  <th className="p-4 text-gray-400">User</th>
                  <th className="p-4 text-gray-400">Email</th>
                  <th className="p-4 text-gray-400">Amount</th>
                  <th className="p-4 text-gray-400">Wallet</th>
                  <th className="p-4 text-gray-400">Date</th>

                </tr>

              </thead>

              <tbody>

                {withdrawRequests.map((req)=> (

                  <tr
                  key={req._id}
                  className="border-b border-blue-900/20 hover:bg-[#020617]"
                  >

                    <td className="p-4">
                      {req.user?.name}
                    </td>

                    <td className="p-4 text-gray-400">
                      {req.user?.email}
                    </td>

                    <td className="p-4 text-green-400">
                      ₹{req.amount}
                    </td>

                    <td className="p-4">
                      ₹{req.user?.withdrawBalance}
                    </td>

                    <td className="p-4 text-gray-400">
                      {new Date(req.createdAt).toLocaleString()}
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