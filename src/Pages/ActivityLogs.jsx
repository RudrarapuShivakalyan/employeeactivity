import { useActivities } from "../context/ActivityContext";
import { useState } from "react";

export default function ActivityLogs() {
  const { activities } = useActivities();

  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = activities.filter((a) => {
    const deptOk =
      deptFilter === "ALL" || a.department === deptFilter;
    const statusOk =
      statusFilter === "ALL" || a.status === statusFilter;
    return deptOk && statusOk;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">All Activity Logs</h2>

      <div className="flex gap-3 mb-4">
        <select
          className="border p-2 rounded"
          value={deptFilter}
          onChange={(e) => {
            setDeptFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Support">Support</option>
        </select>

        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {paginated.length === 0 && (
        <p className="text-gray-500">No activities found</p>
      )}

      <div className="space-y-3">
        {paginated.map((a) => (
          <div
            key={a.id}
            className="border p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-lg">
                    {a.employeeName}{" "}
                    <span className="text-sm text-gray-500">
                      ({a.department})
                    </span>
                  </p>
                  {a.projectName && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                      Project: {a.projectName}
                    </span>
                  )}
                  {a.projectPhase && (
                    <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
                      {a.projectPhase}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-2">{a.date}</p>

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
                    <span>Hours Worked: {a.hoursWorked}</span>
                  )}
                  {a.projectDeadline && (
                    <span>Project Deadline: {a.projectDeadline}</span>
                  )}
                </div>

                {a.remarks && (
                  <p className="text-sm text-red-600 mt-2">
                    Remarks: {a.remarks}
                  </p>
                )}
              </div>

              <span
                className={`h-fit text-xs px-3 py-1 rounded font-medium ${
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

      
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
