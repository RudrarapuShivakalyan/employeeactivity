import { useState, useEffect } from "react";

export default function ApprovalHistoryAndAudit() {
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    loadApprovalHistory();
  }, [filterYear, filterMonth]);

  const loadApprovalHistory = () => {
    const mockHistory = [
      {
        id: 1,
        activityId: 101,
        employeeName: "John Doe",
        action: "Approved",
        date: "2026-03-20",
        time: "10:30 AM",
        approvedBy: "Mike Manager",
        reason: "Within project scope",
        conditions: ["Follow-up meeting scheduled", "Hours limit: 8h"],
        duration: "2 minutes",
      },
      {
        id: 2,
        activityId: 102,
        employeeName: "Jane Smith",
        action: "Rejected",
        date: "2026-03-20",
        time: "11:15 AM",
        approvedBy: "Mike Manager",
        reason: "Exceeds budget allocation",
        conditions: [],
        duration: "5 minutes",
      },
      {
        id: 3,
        activityId: 103,
        employeeName: "Carol White",
        action: "Approved with Conditions",
        date: "2026-03-19",
        time: "02:45 PM",
        approvedBy: "Mike Manager",
        reason: "Project critical, needs documentation",
        conditions: ["Must provide detailed report", "Executive sign-off required"],
        duration: "8 minutes",
      },
      {
        id: 4,
        activityId: 104,
        employeeName: "David Brown",
        action: "Approved",
        date: "2026-03-18",
        time: "09:00 AM",
        approvedBy: "Mike Manager",
        reason: "Standard approval",
        conditions: [],
        duration: "1 minute",
      },
    ];
    setApprovalHistory(mockHistory);
  };

  const getActionColor = (action) => {
    switch (action) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Approved with Conditions":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "Approved":
        return "✅";
      case "Rejected":
        return "❌";
      case "Approved with Conditions":
        return "⚠️";
      default:
        return "📋";
    }
  };

  const stats = {
    totalApprovals: approvalHistory.length,
    approved: approvalHistory.filter((r) => r.action === "Approved").length,
    rejected: approvalHistory.filter((r) => r.action === "Rejected").length,
    withConditions: approvalHistory.filter((r) => r.action === "Approved with Conditions").length,
    avgDuration: "3.5 minutes",
  };

  const filteredHistory = approvalHistory.filter((r) => {
    if (filterType === "all") return true;
    return r.action.includes(filterType) || r.action === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">Total Approvals</p>
          <p className="text-2xl font-bold">{stats.totalApprovals}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">Approved</p>
          <p className="text-2xl font-bold">{stats.approved}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">Rejected</p>
          <p className="text-2xl font-bold">{stats.rejected}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">With Conditions</p>
          <p className="text-2xl font-bold">{stats.withConditions}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">Avg Duration</p>
          <p className="text-2xl font-bold">{stats.avgDuration}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex gap-3 flex-wrap">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Actions</option>
          <option value="Approved">Approved Only</option>
          <option value="Rejected">Rejected Only</option>
          <option value="Conditions">With Conditions</option>
        </select>
        <input
          type="month"
          value={`2026-${String(filterMonth).padStart(2, "0")}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split("-");
            setFilterYear(parseInt(year));
            setFilterMonth(parseInt(month));
          }}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-6 text-gray-800">Approval Timeline</h3>

        <div className="space-y-4">
          {filteredHistory.map((record, idx) => (
            <div key={record.id} className="relative">
              {/* Timeline Line */}
              {idx < filteredHistory.length - 1 && (
                <div className="absolute left-4 top-10 w-1 h-12 bg-gray-300"></div>
              )}

              {/* Timeline Item */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center text-sm ${getActionColor(record.action)}`}>
                    {getActionIcon(record.action)}
                  </div>
                </div>

                <div className="flex-1 pb-4">
                  <button
                    onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                    className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition cursor-pointer border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{record.employeeName}</p>
                        <p className="text-sm text-gray-600">Activity #{record.activityId}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(record.action)}`}>
                          {record.action}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{record.duration}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{record.reason}</p>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{record.date} at {record.time}</span>
                      <span>By: {record.approvedBy}</span>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {selectedRecord?.id === record.id && record.conditions.length > 0 && (
                    <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="font-semibold text-blue-900 mb-2">Conditions Applied:</p>
                      <ul className="space-y-1">
                        {record.conditions.map((condition, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-blue-800">
                            <span>✓</span>
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
          📥 Export as PDF
        </button>
        <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
          📊 Export as CSV
        </button>
        <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2">
          📧 Email Report
        </button>
      </div>
    </div>
  );
}
