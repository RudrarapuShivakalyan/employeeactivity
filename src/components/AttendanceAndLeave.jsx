import { useState, useEffect } from "react";

export default function AttendanceAndLeave() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const manager = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchAttendanceRecords();
  }, [manager?.department, filterMonth]);

  const fetchAttendanceRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/attendance?department=${encodeURIComponent(manager?.department)}&month=${filterMonth}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecords(Array.isArray(data) ? data : []);
      } else {
        setRecords(getMockAttendanceRecords());
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setRecords(getMockAttendanceRecords());
    } finally {
      setLoading(false);
    }
  };

  const getMockAttendanceRecords = () => [
    { id: 1, name: "John Doe", date: "2026-03-20", status: "Present", checkIn: "09:00", checkOut: "18:00", duration: "9h" },
    { id: 2, name: "John Doe", date: "2026-03-21", status: "Present", checkIn: "09:15", checkOut: "18:30", duration: "9h" },
    { id: 3, name: "John Doe", date: "2026-03-22", status: "Leave", type: "Sick Leave", checkIn: "-", checkOut: "-", duration: "-" },
    { id: 4, name: "Jane Smith", date: "2026-03-20", status: "Present", checkIn: "08:45", checkOut: "17:45", duration: "9h" },
    { id: 5, name: "Jane Smith", date: "2026-03-21", status: "Late", checkIn: "09:45", checkOut: "18:45", duration: "9h" },
    { id: 6, name: "Mike Johnson", date: "2026-03-20", status: "Present", checkIn: "09:00", checkOut: "18:00", duration: "9h" },
    { id: 7, name: "Mike Johnson", date: "2026-03-21", status: "Leave", type: "Personal Leave", checkIn: "-", checkOut: "-", duration: "-" },
    { id: 8, name: "Carol White", date: "2026-03-20", status: "Absent", checkIn: "-", checkOut: "-", duration: "-" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      case "Late":
        return "bg-orange-100 text-orange-700";
      case "Leave":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredRecords = filterStatus === "all"
    ? records
    : records.filter((r) => r.status === filterStatus);

  // Calculate statistics
  const stats = {
    totalDays: new Set(records.map((r) => r.date)).size,
    presentDays: records.filter((r) => r.status === "Present").length,
    absentDays: records.filter((r) => r.status === "Absent").length,
    leaveDays: records.filter((r) => r.status === "Leave").length,
    lateDays: records.filter((r) => r.status === "Late").length,
  };

  if (loading) {
    return <div className="text-center p-4">Loading attendance records...</div>;
  }

  const StatBox = ({ title, value, color }) => (
    <div className={`${color} p-4 rounded-lg text-white text-center`}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md flex gap-4 flex-wrap">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Month:</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox title="Total Records" value={filteredRecords.length} color="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatBox title="Present" value={stats.presentDays} color="bg-gradient-to-br from-green-500 to-green-600" />
        <StatBox title="Absent" value={stats.absentDays} color="bg-gradient-to-br from-red-500 to-red-600" />
        <StatBox title="Leave" value={stats.leaveDays} color="bg-gradient-to-br from-purple-500 to-purple-600" />
        <StatBox title="Late" value={stats.lateDays} color="bg-gradient-to-br from-orange-500 to-orange-600" />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Check In</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Check Out</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{record.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{record.checkIn}</td>
                  <td className="px-4 py-3 text-gray-600">{record.checkOut}</td>
                  <td className="px-4 py-3 font-medium">{record.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Request Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Approve Leave Requests</h3>
        <div className="space-y-3">
          {[
            { id: 1, name: "Alice Johnson", type: "Sick Leave", days: 2, from: "2026-03-22", to: "2026-03-23" },
            { id: 2, name: "Bob Smith", type: "Personal Leave", days: 1, from: "2026-03-24", to: "2026-03-24" },
          ].map((request) => (
            <div key={request.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{request.name}</p>
                <p className="text-sm text-gray-600">
                  {request.type} • {request.days} day(s) • {request.from} to {request.to}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition">
                  Approve
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
