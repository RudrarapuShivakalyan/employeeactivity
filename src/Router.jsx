import { createBrowserRouter } from "react-router-dom";
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import Manager from "./Pages/Manager";
import Employee from "./Pages/Employee";
import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/NotFound";
import RouteError from "./Pages/RouteError";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <RouteError />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <Admin />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute roles={["manager", "admin"]}>
        <Manager />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute roles={["admin", "manager"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute roles={["employee", "manager", "admin"]}>
        <Employee />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <RouteError />,
  },
]);

export default router;
