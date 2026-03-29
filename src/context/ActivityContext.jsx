import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ActivityContext = createContext();
export const useActivities = () => useContext(ActivityContext);

export const ActivityProvider = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("activities");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Load activities each time user logs in or changes
  useEffect(() => {
    const loadActivities = async () => {
      if (!user || !user.employeeId) {
        setActivities([]);
        localStorage.removeItem("activities");
        console.log("⏭️ No user logged in — clearing activities");
        return;
      }

      const token = localStorage.getItem("token");

      try {
        console.log("📥 Fetching activities for user:", user.name);
        const response = await fetch(
          `http://localhost:5000/api/employees/activities?employeeId=${encodeURIComponent(user.employeeId)}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (response.status === 401) {
          console.warn("⚠️ Unauthorized - user session may have expired");
          setActivities([]);
          return;
        }

        if (!response.ok) {
          console.warn("⚠️ Activities fetch failed", response.status);
          return;
        }

        const data = await response.json();
        console.log("✅ Activities loaded:", data.length);
        setActivities(data);
      } catch (error) {
        console.error("⚠️ Could not fetch activities from backend", error);
      }
    };

    loadActivities();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = ({ employeeName, department, date, description, projectName, projectDescription, projectPhase, hoursWorked, projectDeadline }) => {
    setActivities((prev) => [
      ...prev,
      {
        id: Date.now(),
        employeeName,
        department,
        date,
        description,
        projectName,
        projectDescription,
        projectPhase,
        hoursWorked,
        projectDeadline,
        status: "PENDING",
        remarks: "",
      },
    ]);
  };

  const approveActivity = (id) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a))
    );
  };

  const rejectActivity = (id, remarks) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "REJECTED", remarks } : a
      )
    );
  };

  return (
    <ActivityContext.Provider
      value={{ activities, addActivity, approveActivity, rejectActivity }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
