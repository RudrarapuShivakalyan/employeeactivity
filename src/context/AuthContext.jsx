import { createContext, useContext, useState, useCallback } from "react";

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

  // 🔥 FIXED LOGIN FUNCTION WITH JWT
  const login = useCallback(async (email, password) => {
    try {
      console.log("🔄 Logging in...");

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }

      const data = await res.json();
      console.log("✅ Login successful:", data);

      // ✅ Store token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return data.user;
    } catch (error) {
      console.error("❌ Login error:", error);
      return null;
    }
  }, []);

  // 🔹 Logout
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
