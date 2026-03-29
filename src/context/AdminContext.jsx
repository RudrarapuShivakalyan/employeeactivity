import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();
export const useAdmins = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admins, setAdmins] = useState(() => {
    const saved = localStorage.getItem("admins");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("admins", JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admins", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          console.warn("Failed to fetch admins from server", res.status);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAdmins(data);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const addAdmin = (admin) => {
    setAdmins((prev) => [
      ...prev,
      {
        ...admin,
        id: Date.now(),
        employeeId: admin.employeeId || `ADM${Date.now()}`,
        joiningDate: admin.joiningDate || new Date().toISOString().split('T')[0],
        salary: admin.salary || 0,
        yearsOfExperience: admin.yearsOfExperience || 0,
        status: "Active",
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    ]);
  };

  const toggleStatus = (id) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" }
          : a
      )
    );
  };

  const deleteAdmin = (id) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AdminContext.Provider value={{ admins, addAdmin, toggleStatus, deleteAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
