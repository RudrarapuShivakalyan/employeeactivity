import { useState, useEffect } from "react";

export default function ActivityAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState("week");
  const manager = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchAnalytics();
  }, [filterPeriod, manager?.department]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/analytics/activities?period=${filterPeriod}&department=${encodeURIComponent(manager?.department)}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        setAnalytics(getMockAnalytics());
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const getMockAnalytics = () => ({
    totalActivities: 245,
    approvedActivities: 230,
    rejectedActivities: 8,
    pendingActivities: 7,
    approvalRate: 93.9,
    avgCompletionTime: "3.2 days",
    byType: [
      { type: "Meeting", count: 85, percentage: 35 },
      { type: "Project Work", count: 92, percentage: 38 },
      { type: "Training", count: 42, percentage: 17 },
      { type: "Leave", count: 26, percentage: 10 },
    ],
    byStatus: {
      approved: 230,
      rejected: 8,
      pending: 7,
    },
    dailyTrend: [12, 15, 18, 22, 25, 28, 31],
    topEmployees: [
      { name: "Alice Johnson", activities: 28 },
      { name: "Bob Smith", activities: 24 },
      { name: "Carol White", activities: 22 },
      { name: "David Brown", activities: 20 },
    ],
  });

  if (loading) {
    return <div className="text-center p-4">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center p-4 text-red-600">Failed to load analytics</div>;
  }

  const StatBox = ({ label, value, subtext, bgColor }) => (
    <div className={`${bgColor} p-4 rounded-lg text-white`}>
      <p className="text-sm opacity-90">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtext && <p className="text-xs opacity-80 mt-1">{subtext}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filter Period */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="font-medium text-gray-700">Select Period:</label>
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="ml-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox
          label="Total Activities"
          value={analytics.totalActivities}
          bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatBox
          label="Approved"
          value={analytics.approvedActivities}
          subtext="93.9%"
          bgColor="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatBox
          label="Rejected"
          value={analytics.rejectedActivities}
          bgColor="bg-gradient-to-br from-red-500 to-red-600"
        />
        <StatBox
          label="Pending"
          value={analytics.pendingActivities}
          bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Activity Type Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Activity Type Distribution</h3>
          <div className="space-y-3">
            {analytics.byType?.map((type, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">{type.type}</span>
                  <span className="text-sm font-bold text-blue-600">{type.count} ({type.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Status Summary</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="flex-1">Approved</span>
              <span className="font-bold">{analytics.byStatus.approved}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="flex-1">Rejected</span>
              <span className="font-bold">{analytics.byStatus.rejected}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span className="flex-1">Pending</span>
              <span className="font-bold">{analytics.byStatus.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Trend */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Daily Activity Trend</h3>
        <div className="flex items-end justify-around h-40 gap-2">
          {analytics.dailyTrend?.map((value, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-8 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t"
                style={{ height: `${(value / 35) * 100}px` }}
              ></div>
              <p className="text-xs text-gray-600 mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Top Contributors</h3>
        <div className="space-y-2">
          {analytics.topEmployees?.map((emp, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-blue-600">#{idx + 1}</span>
                <span className="font-medium">{emp.name}</span>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {emp.activities} activities
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
