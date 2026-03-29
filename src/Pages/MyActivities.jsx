import { useActivities } from "../context/ActivityContext";
import { useAuth } from "../context/AuthContext";

export default function MyActivities() {
  const { activities } = useActivities();
  const { user } = useAuth();

  // Redirect if not logged in
  if (!user || !user.name) {
    return (
      <div className="bg-red-100 p-4 rounded">
        <p className="text-red-700">Error: User not logged in. Please log in first.</p>
      </div>
    );
  }

  const myActivities = activities.filter(
    (a) => a.employeeId === user.employeeId || a.employeeName === user.name
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">My Activity History</h2>

      {myActivities.length === 0 && (
        <p className="text-gray-500">No activities submitted yet</p>
      )}

      <div className="space-y-3">
        {myActivities.map((a) => (
          <div
            key={a.id}
            className="border p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <p className="font-semibold text-lg">{a.date}</p>
                  {a.projectName && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                      {a.projectName}
                    </span>
                  )}
                  {a.projectPhase && (
                    <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
                      {a.projectPhase}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-gray-700 font-medium">Work Description:</p>
                    <p className="text-gray-600">{a.description}</p>
                  </div>
                  
                  {a.projectDescription && (
                    <div>
                      <p className="text-gray-700 font-medium">Project Description:</p>
                      <p className="text-gray-600">{a.projectDescription}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {a.hoursWorked && (
                    <span>Hours: {a.hoursWorked}</span>
                  )}
                  {a.projectDeadline && (
                    <span>Deadline: {a.projectDeadline}</span>
                  )}
                </div>

                {a.remarks && (
                  <p className="text-sm text-red-600 mt-2">
                    Remarks: {a.remarks}
                  </p>
                )}
              </div>

              <span
                className={`text-sm px-3 py-1 rounded font-medium ${
                  a.status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : a.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
