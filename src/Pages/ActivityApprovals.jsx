import { useState, useEffect } from "react";
import { useActivities } from "../context/ActivityContext";

export default function ActivityApprovals() {
  const { approveActivity, rejectActivity } = useActivities();
  const [teamActivities, setTeamActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const manager = JSON.parse(localStorage.getItem("user") || "null");

  // Redirect if not logged in or not a manager
  if (!manager || !manager.name) {
    return (
      <div className="bg-red-100 p-4 rounded">
        <p className="text-red-700">Error: User not logged in. Please log in first.</p>
      </div>
    );
  }

  // Fetch team activities for approval
  useEffect(() => {
    const fetchTeamActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/employees/activities?department=${encodeURIComponent(manager.department)}&status=pending`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTeamActivities(data);
        } else {
          console.error("Failed to fetch team activities");
        }
      } catch (error) {
        console.error("Error fetching team activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamActivities();
  }, [manager.department]);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Team Activity Approvals</h2>
        <p className="text-gray-500">Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Team Activity Approvals</h2>

      {teamActivities.length === 0 && (
        <p className="text-gray-500">
          No pending activities for your department
        </p>
      )}

      <div className="space-y-3">
        {teamActivities.map((a) => (
          <div
            key={a.id}
            className="border p-3 rounded flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">
                {a.employeeName}{" "}
                <span className="text-sm text-gray-500">
                  ({a.department})
                </span>
              </p>
              <p className="text-sm text-gray-500">{a.startTime ? new Date(a.startTime).toLocaleDateString() : 'N/A'}</p>
              <p>{a.description}</p>
              <p className="text-sm text-blue-600">Project: {a.projectName || 'N/A'}</p>

              {a.remarks && (
                <p className="text-sm text-red-600 mt-1">
                  Remarks: {a.remarks}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  a.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : a.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {a.status}
              </span>

              {a.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        const response = await fetch(
                          `http://localhost:5000/api/employees/activities/${a.id}/approve`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                            },
                          }
                        );

                        if (response.ok) {
                          // Update local state
                          setTeamActivities(prev =>
                            prev.map(act =>
                              act.id === a.id ? { ...act, status: "approved" } : act
                            )
                          );
                        }
                      } catch (error) {
                        console.error("Error approving activity:", error);
                      }
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      const reason = prompt("Enter rejection reason");
                      if (!reason) return;

                      try {
                        const token = localStorage.getItem("token");
                        const response = await fetch(
                          `http://localhost:5000/api/employees/activities/${a.id}/reject`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                            },
                            body: JSON.stringify({ remarks: reason }),
                          }
                        );

                        if (response.ok) {
                          // Update local state
                          setTeamActivities(prev =>
                            prev.map(act =>
                              act.id === a.id ? { ...act, status: "rejected", remarks: reason } : act
                            )
                          );
                        }
                      } catch (error) {
                        console.error("Error rejecting activity:", error);
                      }
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
