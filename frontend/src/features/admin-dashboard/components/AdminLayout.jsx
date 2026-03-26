import AdminSidebar from "./AdminSidebar"
import AdminNavbar from "./AdminNavbar"

export default function AdminLayout({ children }) {

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#0e1324] to-[#020617] text-white">

      <AdminSidebar />

      <div className="flex-1 flex flex-col">

        <AdminNavbar />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  )
}