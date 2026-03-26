import { useAuth } from "../../auth/hooks/useAuth"

export default function AdminNavbar() {

  const { user, handleLogout } = useAuth()

  return (

    <header className="h-16 flex items-center justify-between px-6 border-b border-blue-900/40 bg-[#0f172a]">

      <h1 className="text-lg text-gray-300">
        Admin Panel
      </h1>

      <div className="flex items-center gap-4">

        <span className="text-gray-400">
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>

      </div>

    </header>

  )
}