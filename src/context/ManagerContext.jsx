import { createContext, useContext, useEffect, useState } from "react";

const ManagerContext = createContext();
export const useManagers = () => useContext(ManagerContext);

export const ManagerProvider = ({ children }) => {
  const [managers, setManagers] = useState(() => {
    const saved = localStorage.getItem("managers");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("managers", JSON.stringify(managers));
  }, [managers]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/managers", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          console.warn("Failed to fetch managers from server", res.status);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setManagers(data);
        }
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagers();
  }, []);

  const addManager = (manager) => {
    setManagers((prev) => [
      ...prev,
      {
        ...manager,
        id: Date.now(),
        employeeId: manager.employeeId || `MGR${Date.now()}`,
        joiningDate: manager.joiningDate || new Date().toISOString().split('T')[0],
        salary: manager.salary || 0,
        yearsOfExperience: manager.yearsOfExperience || 0,
        status: "Active",
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    ]);
  };

  const toggleStatus = (id) => {
    setManagers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" }
          : m
      )
    );
  };

  const deleteManager = (id) => {
    setManagers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <ManagerContext.Provider value={{ managers, addManager, toggleStatus, deleteManager }}>
      {children}
    </ManagerContext.Provider>
  );
};
