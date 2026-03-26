import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { UserDashboardProvider } from "./features/user_dashboard/UserDashboard.context";
import { AdminDashboardProvider } from "./features/admin-dashboard/AdminDashboard.context.jsx";
import { TournamentProvider } from "./features/tournament/Tournament.context.jsx";

function App() {
  return (
    <AuthProvider>
      <AdminDashboardProvider>
        <UserDashboardProvider>
          <TournamentProvider>
          <RouterProvider router={router} />
          </TournamentProvider>
        </UserDashboardProvider>
      </AdminDashboardProvider>
    </AuthProvider>
  );
}

export default App;