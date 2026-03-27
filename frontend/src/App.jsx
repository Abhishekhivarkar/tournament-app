import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { UserDashboardProvider } from "./features/user_dashboard/UserDashboard.context";
import { AdminDashboardProvider } from "./features/admin-dashboard/AdminDashboard.context.jsx";
import { TournamentProvider } from "./features/tournament/Tournament.context.jsx";
import { TransactionProvider } from "./features/transaction/transaction.context.jsx";

function App() {
  return (
    <AuthProvider>
      <AdminDashboardProvider>
        <UserDashboardProvider>
          <TournamentProvider>
            <TransactionProvider>
              <RouterProvider router={router} />
            </TransactionProvider>
          </TournamentProvider>
        </UserDashboardProvider>
      </AdminDashboardProvider>
    </AuthProvider>
  );
}

export default App;