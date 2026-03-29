import { useNavigate } from "react-router-dom";

export default function RouteError({ error }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️ Error</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-4">
          Page Error!
        </p>
        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-6 text-left">
            <p className="text-red-800 font-mono text-sm break-words">
              {error.message || error.toString()}
            </p>
            {error.status && (
              <p className="text-red-700 text-xs mt-2">Status: {error.status}</p>
            )}
          </div>
        )}
        <p className="text-gray-600 mb-6">
          The page you're trying to access encountered an error. Please try again or go back to login.
        </p>
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
