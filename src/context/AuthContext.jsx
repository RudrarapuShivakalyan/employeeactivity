import { createContext, useContext, useState, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

// 🔹 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// 🔹 Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // 🔥 FIXED LOGIN FUNCTION WITH JWT & FALLBACK
  const login = useCallback(async (email, password) => {
    try {
      console.log("🔄 Logging in with:", email);

      // Use API service which has fallback handling
      const data = await authAPI.login(email, password);
      console.log("✅ Login successful:", data);

      // ✅ Store token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return data.user;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  }, []);

  // 🔹 Logout
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
