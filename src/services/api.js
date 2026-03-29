const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  const response = await fetch(url, {
    ...options,
    headers,
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