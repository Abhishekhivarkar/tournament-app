import { Link } from "react-router-dom"

export default function AdminSidebar() {

  return (

    <aside className="w-64 bg-[#020617] border-r border-blue-900/40 p-6">

      <h2 className="text-2xl font-bold text-cyan-400 mb-10">
        BattleNex
      </h2>

      <nav className="flex flex-col gap-4">

        <Link
          to="/admin/dashboard"
          className="text-gray-300 hover:text-blue-400"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/dashboard/all-users"
          className="text-gray-300 hover:text-blue-400"
        >
          Users
        </Link>

        <Link
          to="/admin/tournaments"
          className="text-gray-300 hover:text-blue-400"
        >
          Tournaments
        </Link>

        <Link
          to="/admin/withdraw-requests"
          className="text-gray-300 hover:text-blue-400"
        >
          Withdraw Requests
        </Link>

      </nav>

    </aside>

  )
}