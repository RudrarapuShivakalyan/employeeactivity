import { useState, useEffect } from "react";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const employee = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const mockStats = {
      activitiesThisMonth: 12,
      activitiesThisYear: 89,
      avgHoursPerWeek: 42,
      completionRate: 94,
      performanceScore: 8.5,
      leaveBalance: 8,
      totalProjects: 5,
      skillsAcquired: 3,
      weeklyTrend: [38, 42, 40, 43, 42, 41, 42],
      upcomingDeadlines: [
        { title: "Project Alpha Review", date: "2026-03-31", status: "On Track" },
        { title: "Training Completion", date: "2026-04-05", status: "Pending" },
        { title: "Appraisal Review", date: "2026-04-10", status: "Scheduled" },
      ],
      recentAchievements: [
        { achievement: "Completed Advanced JavaScript Course", date: "2026-03-15" },
        { achievement: "Led Team Project Successfully", date: "2026-03-10" },
        { achievement: "100% On-time Delivery This Month", date: "2026-03-01" },
      ],
    };
    setStats(mockStats);
    setLoading(false);
  }, [employee]);

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center p-8 text-red-600">Failed to load dashboard</div>;
  }

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className={`${color} p-6 rounded-lg shadow-md text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtext && <p className="text-xs opacity-80 mt-1">{subtext}</p>}
        </div>
        <div className="text-4xl opacity-40">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="This Month Activities"
          value={stats.activitiesThisMonth}
          icon="📊"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon="✅"
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Performance Score"
          value={`${stats.performanceScore}/10`}
          icon="⭐"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Leave Balance"
          value={stats.leaveBalance}
          icon="🏖️"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          title="Avg Hours/Week"
          value={`${stats.avgHoursPerWeek}h`}
          icon="⏱️"
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
        <StatCard
          title="Active Projects"
          value={stats.totalProjects}
          icon="📁"
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Skills Acquired"
          value={stats.skillsAcquired}
          icon="🏆"
          color="bg-gradient-to-br from-pink-500 to-pink-600"
        />
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Weekly Hours Trend</h3>
        <div className="flex items-end justify-around h-40 gap-2">
          {stats.weeklyTrend.map((hours, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                style={{ height: `${(hours / 45) * 100}px` }}
              ></div>
              <p className="text-xs text-gray-600 mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
              </p>
              <p className="text-xs font-bold text-gray-700">{hours}h</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines and Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-800">📅 Upcoming Deadlines</h3>
          <div className="space-y-3">
            {stats.upcomingDeadlines.map((deadline, idx) => (
              <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <div>
                  <p className="font-medium text-gray-800">{deadline.title}</p>
                  <p className="text-sm text-gray-600">{new Date(deadline.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  deadline.status === "On Track" ? "bg-green-100 text-green-700"
                  : deadline.status === "Pending" ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
                }`}>
                  {deadline.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-800">🏆 Recent Achievements</h3>
          <div className="space-y-3">
            {stats.recentAchievements.map((achievement, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="font-medium text-gray-800">{achievement.achievement}</p>
                  <p className="text-xs text-gray-600">{new Date(achievement.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
