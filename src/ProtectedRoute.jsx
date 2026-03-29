import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ role, roles, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  const allowedRoles = roles || (role ? [role] : []);

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
