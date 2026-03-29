import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // If user is not logged in and not on the login page, redirect to login
    if (!user && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
    // If user is logged in, redirect to their dashboard
    else if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, location.pathname, navigate]);

  // If we're redirecting, show loading
  if ((!user && location.pathname !== "/") || user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been removed.</p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
          >
            🏠 Go to Login
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold shadow-md"
          >
            ⬅️ Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
