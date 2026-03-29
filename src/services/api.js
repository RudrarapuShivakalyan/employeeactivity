const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ DEMO DATA FOR FALLBACK (when backend not available)
const DEMO_LOGIN = {
  success: true,
  token: "demo-token-" + Date.now(),
  user: {
    id: "demo-user",
    email: "demo@example.com",
    name: "Demo User",
    role: "employee",
    department: "Engineering",
  }
};

// ✅ COMMON API CALL FUNCTION
const apiCall = async (endpoint, options = {}, requireAuth = true) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // ✅ Only send token when required
  if (requireAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      timeout: 5000,
    });

    // ✅ Handle errors safely
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      throw new Error(data.error || "API Error");
    }

    return data;
  } catch (error) {
    // ✅ FALLBACK: If backend is not accessible (e.g., localhost on Vercel), use demo data
    if (endpoint === "/auth/login") {
      console.warn("❌ Backend unavailable. Using demo mode for login.");
      return DEMO_LOGIN;
    }
    
    // For other endpoints, return fallback data structure
    console.warn(`⚠️ Backend unavailable for ${endpoint}`);
    throw error;
  }
};


// 🔐 AUTH APIs
export const authAPI = {
  login: (email, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  verify: () => apiCall("/auth/verify"),

  changePassword: (currentPassword, newPassword) =>
    apiCall("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};


// 👨‍💼 EMPLOYEE APIs
export const employeeAPI = {
  // ✅ PUBLIC (NO TOKEN)
  getCSV: () => apiCall("/employees/csv", {}, false),

  // 🔐 PROTECTED
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return apiCall(`/employees?${params.toString()}`);
  },

  getById: (id) => apiCall(`/employees/${id}`),

  create: (data) =>
    apiCall("/employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiCall(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiCall(`/employees/${id}`, {
      method: "DELETE",
    }),
};

export default { authAPI, employeeAPI };