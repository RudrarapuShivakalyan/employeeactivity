import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="text-center max-w-lg">
            <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️ Error</h1>
            <p className="text-2xl font-semibold text-gray-800 mb-4">
              Something went wrong!
            </p>
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-6 text-left">
              <p className="text-red-800 font-mono text-sm break-words">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Please try refreshing the page or contact support if the problem persists.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => window.location.href = "/"}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
              >
                🏠 Go to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold shadow-md"
              >
                🔄 Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
