import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { UserDashboardProvider } from "./features/user_dashboard/UserDashboard.context";

function App() {
  return (
    <AuthProvider>
      <UserDashboardProvider>
        <RouterProvider router={router} />
      </UserDashboardProvider>
    </AuthProvider>
  );
}

export default App;