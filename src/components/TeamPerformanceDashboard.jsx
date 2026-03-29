import { useState, useEffect } from "react";

export default function TeamPerformanceDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const manager = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/employees/team-stats?department=${encodeURIComponent(manager?.department)}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setStats(getMockStats());
        }
      } catch (error) {
        console.error("Error fetching team stats:", error);
        setStats(getMockStats());
      } finally {
        setLoading(false);
      }
    };

    if (manager?.department) {
      fetchTeamStats();
    }
  }, [manager?.department]);

  const getMockStats = () => ({
    totalTeamMembers: 12,
    activeMembers: 11,
    onLeave: 1,
    performanceScore: 8.5,
    activitiesThisWeek: 45,
    approvalRate: 94,
    averageResponseTime: "2.3 hrs",
    memberPerformance: [
      { name: "John Doe", score: 9.2, activities: 12 },
      { name: "Jane Smith", score: 8.8, activities: 10 },
      { name: "Mike Johnson", score: 7.5, activities: 8 },
    ],
  });

  if (loading) {
    return <div className="p-6 bg-white rounded-lg shadow text-center">Loading team performance...</div>;
  }

  if (!stats) {
    return <div className="p-6 bg-white rounded-lg shadow text-red-600">Failed to load team statistics</div>;
  }

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className={`${color} p-6 rounded-lg shadow-md text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtext && <p className="text-xs opacity-80 mt-1">{subtext}</p>}
        </div>
        <div className="text-4xl opacity-40">{icon}</div>
      </div>
    </div>
  );

  const PerformanceBar = ({ name, score, activities }) => (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-800">{name}</span>
        <span className="text-sm font-bold text-blue-600">{score}/10</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600 mt-1">Activities this week: {activities}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Team Members"
          value={stats.totalTeamMembers}
          icon="👥"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          subtext={`${stats.activeMembers} active`}
        />
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          icon="🏖️"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          title="Performance"
          value={`${stats.performanceScore}/10`}
          icon="⭐"
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          icon="✅"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <StatCard
          title="Activities This Week"
          value={stats.activitiesThWeek}
          icon="📊"
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Avg Response Time"
          value={stats.averageResponseTime}
          icon="⏱️"
          color="bg-gradient-to-br from-pink-500 to-pink-600"
        />
      </div>

      {/* Team Member Performance */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Top Performers</h3>
        <div className="space-y-2">
          {stats.memberPerformance && stats.memberPerformance.map((member, idx) => (
            <PerformanceBar key={idx} name={member.name} score={member.score} activities={member.activities} />
          ))}
        </div>
      </div>

      {/* Activity Distribution Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Weekly Activity Trend</h3>
        <div className="flex items-end justify-around h-32 gap-2">
          {[45, 52, 48, 61, 55, 58, 63].map((value, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                style={{ height: `${(value / 65) * 100}px` }}
              ></div>
              <p className="text-xs text-gray-600 mt-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][idx]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
