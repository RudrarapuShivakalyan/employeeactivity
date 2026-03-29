import { useState, useEffect } from "react";

export default function EmployeePerformance() {
  const [performanceData, setPerformanceData] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = {
      overallRating: 8.5,
      monthlyRating: 8.7,
      quarterlyRating: 8.3,
      punctuality: 95,
      qualityOfWork: 90,
      productivity: 85,
      collaboration: 92,
      communication: 88,
      recentReviews: [
        { date: "2026-03-15", reviewer: "Mike Manager", rating: 8.5, comment: "Excellent work on project alpha" },
        { date: "2026-02-28", reviewer: "HR Department", rating: 8.3, comment: "Overall performance is good" },
        { date: "2026-01-31", reviewer: "Team Lead", rating: 8.7, comment: "Outstanding collaboration" },
      ],
      performanceTrend: [7.2, 7.5, 7.8, 8.1, 8.3, 8.5],
      monthlyMetrics: {
        tasksCompleted: 45,
        tasksPending: 2,
        completionRate: 96,
        onTimeDelivery: 98,
        qualityIssues: 1,
      },
    };
    setPerformanceData(mockData);
    setLoading(false);
  }, [filterPeriod]);

  if (loading) {
    return <div className="text-center p-8">Loading performance data...</div>;
  }

  const performanceMetrics = [
    { name: "Punctuality", score: performanceData.punctuality, color: "from-blue-500 to-blue-600" },
    { name: "Quality of Work", score: performanceData.qualityOfWork, color: "from-green-500 to-green-600" },
    { name: "Productivity", score: performanceData.productivity, color: "from-purple-500 to-purple-600" },
    { name: "Collaboration", score: performanceData.collaboration, color: "from-orange-500 to-orange-600" },
    { name: "Communication", score: performanceData.communication, color: "from-pink-500 to-pink-600" },
  ];

  const PerformanceMetric = ({ name, score, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-800">{name}</span>
        <span className="text-lg font-bold text-gray-700">{score}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="font-medium text-gray-800 mr-4">Select Period:</label>
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Overall Ratings */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md text-center">
          <p className="text-sm opacity-90">Overall Rating</p>
          <p className="text-4xl font-bold mt-2">{performanceData.overallRating}/10</p>
          <p className="text-xs opacity-80 mt-1">All time</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md text-center">
          <p className="text-sm opacity-90">Monthly Rating</p>
          <p className="text-4xl font-bold mt-2">{performanceData.monthlyRating}/10</p>
          <p className="text-xs opacity-80 mt-1">Current month</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md text-center">
          <p className="text-sm opacity-90">Quarterly Rating</p>
          <p className="text-4xl font-bold mt-2">{performanceData.quarterlyRating}/10</p>
          <p className="text-xs opacity-80 mt-1">This quarter</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {performanceMetrics.map((metric, idx) => (
          <PerformanceMetric key={idx} {...metric} />
        ))}
      </div>

      {/* Monthly Tasks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-blue-500">
          <p className="text-sm text-gray-600">Tasks Completed</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{performanceData.monthlyMetrics.tasksCompleted}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-orange-500">
          <p className="text-sm text-gray-600">Tasks Pending</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{performanceData.monthlyMetrics.tasksPending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-green-500">
          <p className="text-sm text-gray-600">Completion Rate</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{performanceData.monthlyMetrics.completionRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-purple-500">
          <p className="text-sm text-gray-600">On-Time Delivery</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{performanceData.monthlyMetrics.onTimeDelivery}%</p>
        </div>
      </div>

      {/* Performance Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📈 Performance Trend</h3>
        <div className="flex items-end justify-around h-40 gap-2">
          {performanceData.performanceTrend.map((rating, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                style={{ height: `${(rating / 10) * 100}px` }}
              ></div>
              <p className="text-xs text-gray-600 mt-2">{rating}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📝 Recent Reviews</h3>
        <div className="space-y-4">
          {performanceData.recentReviews.map((review, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">By: {review.reviewer}</p>
                  <p className="text-xs text-gray-600">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ {review.rating}/10
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
