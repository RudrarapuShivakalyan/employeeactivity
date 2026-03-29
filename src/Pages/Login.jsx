import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const ROLES = ["admin", "manager", "employee"];
const DEPTS = ["IT", "HR", "Sales", "Finance", "Support", "Marketing"];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "pass123",
  });

  const [error, setError] = useState("");

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  // ✅ Set Role
  const setRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setError("");
  };

  // 🔥 FIXED LOGIN FUNCTION WITH JWT
  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      console.log("🔄 Logging in with:", email);

      // ✅ Use API service with fallback handling
      const data = await authAPI.login(email, password);
      console.log("✅ Login successful:", data);

      // ✅ Store token and user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Update Auth Context (this also stores in context state)
      await login(email, password);

      // 🚀 Redirect based on user role (default to employee)
      const roleRoute = data.user.role || "employee";
      console.log("🚀 Redirecting to:", `/${roleRoute}`);
      navigate(`/${roleRoute}`);

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100">
        
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">
          Welcome Back
        </h2>

        {/* ❌ Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full border border-slate-300 p-2.5 rounded-lg"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="w-full border border-slate-300 p-2.5 rounded-lg"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg mt-4"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}