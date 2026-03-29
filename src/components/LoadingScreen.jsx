export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🚀 Employee Activity Management System
        </h2>
        <p className="text-gray-600 text-lg font-semibold mb-6">
          Loading application...
        </p>
        <div className="flex justify-center gap-2">
          <div
            className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="h-2 w-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
