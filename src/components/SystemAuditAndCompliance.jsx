import { useState, useEffect } from "react";

export default function SystemAuditAndCompliance() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const mockLogs = [
      {
        id: 1,
        timestamp: "2026-03-29 14:32:15",
        user: "Admin User",
        action: "Employee Added",
        target: "John Smith (EMP-2026-042)",
        status: "Success",
        ipAddress: "192.168.1.100",
        details: "New employee record created in IT department",
      },
      {
        id: 2,
        timestamp: "2026-03-29 12:45:22",
        user: "Admin User",
        action: "Salary Updated",
        target: "Sarah Johnson (EMP-2026-010)",
        status: "Success",
        ipAddress: "192.168.1.100",
        details: "Annual salary updated from 600000 to 750000",
      },
      {
        id: 3,
        timestamp: "2026-03-28 16:20:08",
        user: "Admin User",
        action: "Employee Deleted",
        target: "Mike Wilson (EMP-2026-001)",
        status: "Success",
        ipAddress: "192.168.1.100",
        details: "Employee record permanently deleted",
      },
      {
        id: 4,
        timestamp: "2026-03-28 10:15:45",
        user: "Admin User",
        action: "Loan Approved",
        target: "Personal Loan - Emily Davis",
        status: "Success",
        ipAddress: "192.168.1.100",
        details: "Loan amount 50000 approved by admin",
      },
      {
        id: 5,
        timestamp: "2026-03-27 15:08:30",
        user: "Admin User",
        action: "Failed Login",
        target: "Unknown User",
        status: "Failed",
        ipAddress: "203.0.113.42",
        details: "Invalid credentials from external IP",
      },
      {
        id: 6,
        timestamp: "2026-03-27 09:22:12",
        user: "Admin User",
        action: "Data Export",
        target: "Employee Records (March 2026)",
        status: "Success",
        ipAddress: "192.168.1.100",
        details: "42 employee records exported to CSV",
      },
    ];
    setAuditLogs(mockLogs);
  }, []);

  const getActionColor = (action) => {
    if (action.includes("Added") || action.includes("Approved")) return "bg-green-100 text-green-700";
    if (action.includes("Updated") || action.includes("Modified")) return "bg-blue-100 text-blue-700";
    if (action.includes("Deleted")) return "bg-red-100 text-red-700";
    if (action.includes("Export")) return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status) => {
    return status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const filteredLogs = filterType === "all" ? auditLogs : auditLogs.filter((log) => log.status === filterType);

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterType === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setFilterType("Success")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterType === "Success"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Successful ({auditLogs.filter((l) => l.status === "Success").length})
        </button>
        <button
          onClick={() => setFilterType("Failed")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterType === "Failed"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Failed ({auditLogs.filter((l) => l.status === "Failed").length})
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
              <th className="px-4 py-3 text-left font-semibold">Target</th>
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">IP Address</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-700 font-medium">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{log.target}</td>
                <td className="px-4 py-3 text-gray-700">{log.user}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{log.ipAddress}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed View */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Recent Activity Details</h2>
        <div className="space-y-4">
          {filteredLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mt-2">{log.target}</p>
                  <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{log.timestamp}</p>
                  <p className="text-xs text-gray-500 mt-2">IP: {log.ipAddress}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <p className="text-green-700 font-medium">✓ System Compliance</p>
          <p className="text-3xl font-bold text-green-700 mt-2">98%</p>
          <p className="text-xs text-green-600 mt-2">No critical violations</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <p className="text-blue-700 font-medium">🔒 Data Integrity</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">100%</p>
          <p className="text-xs text-blue-600 mt-2">All records verified</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <p className="text-purple-700 font-medium">🛡️ Security Status</p>
          <p className="text-3xl font-bold text-purple-700 mt-2">GOOD</p>
          <p className="text-xs text-purple-600 mt-2">All systems secure</p>
        </div>
      </div>
    </div>
  );
}
