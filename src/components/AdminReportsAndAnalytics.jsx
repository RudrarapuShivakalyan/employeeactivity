import { useState, useEffect } from "react";

export default function AdminReportsAndAnalytics() {
  const [selectedReport, setSelectedReport] = useState("overview");

  const reportData = {
    overview: {
      title: "System Overview Report",
      metrics: [
        { label: "Total Active Users", value: "42", icon: "👥" },
        { label: "System Uptime", value: "99.8%", icon: "⬆️" },
        { label: "Avg Response Time", value: "145ms", icon: "⚡" },
        { label: "Data Storage", value: "2.3 GB", icon: "💾" },
      ],
    },
    hr: {
      title: "HR Analytics Report",
      metrics: [
        { label: "Recruitment Rate", value: "15%", icon: "📈" },
        { label: "Attrition Rate", value: "2.4%", icon: "📉" },
        { label: "Avg Tenure", value: "4.2 years", icon: "📅" },
        { label: "Employee Satisfaction", value: "8.5/10", icon: "😊" },
      ],
    },
    finance: {
      title: "Finance & Payroll Report",
      metrics: [
        { label: "Monthly Payroll", value: "₹26.25L", icon: "💰" },
        { label: "Budget Utilization", value: "78%", icon: "📊" },
        { label: "Pending Loans", value: "₹5.2L", icon: "🏦" },
        { label: "Cost Per Employee", value: "₹625K", icon: "📋" },
      ],
    },
  };

  const currentReport = reportData[selectedReport];

  const charts = [
    {
      title: "Employee Distribution by Department",
      data: [
        { dept: "IT", count: 12, percent: 28.6 },
        { dept: "Finance", count: 8, percent: 19 },
        { dept: "Sales", count: 10, percent: 23.8 },
        { dept: "HR", count: 5, percent: 11.9 },
        { dept: "Marketing", count: 4, percent: 9.5 },
        { dept: "Operations", count: 3, percent: 7.1 },
      ],
    },
    {
      title: "Monthly Activity Trends",
      data: [
        { month: "Jan", activities: 245, approvals: 38, leaves: 12 },
        { month: "Feb", activities: 289, approvals: 45, leaves: 15 },
        { month: "Mar", activities: 312, approvals: 52, leaves: 18 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Report Selection */}
      <div className="flex gap-3 flex-wrap">
        {["overview", "hr", "finance"].map((report) => (
          <button
            key={report}
            onClick={() => setSelectedReport(report)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedReport === report
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {report === "overview" && "📊 Overview"}
            {report === "hr" && "👥 HR Analytics"}
            {report === "finance" && "💰 Finance"}
          </button>
        ))}
      </div>

      {/* Current Report */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentReport.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentReport.metrics.map((metric, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p className="text-3xl mb-2">{metric.icon}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
              <p className="text-2xl font-bold text-blue-700 mt-2">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Distribution Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 {charts[0].title}</h2>
        <div className="space-y-3">
          {charts[0].data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-20 font-medium text-gray-700">{item.dept}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-end pr-2 text-white text-xs font-bold"
                  style={{ width: `${item.percent * 3}%` }}
                >
                  {item.count}
                </div>
              </div>
              <span className="w-16 text-right text-sm text-gray-600">{item.percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📈 {charts[1].title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Month</th>
                <th className="px-4 py-2 text-center font-semibold">Activities</th>
                <th className="px-4 py-2 text-center font-semibold">Approvals</th>
                <th className="px-4 py-2 text-center font-semibold">Leaves</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {charts[1].data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{row.month}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                      {row.activities}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                      {row.approvals}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded font-semibold">
                      {row.leaves}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📥 Export Reports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition">
            <p className="text-2xl mb-2">📄</p>
            <p className="text-sm font-medium text-blue-700">PDF</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition">
            <p className="text-2xl mb-2">📊</p>
            <p className="text-sm font-medium text-green-700">Excel</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition">
            <p className="text-2xl mb-2">📧</p>
            <p className="text-sm font-medium text-purple-700">Email</p>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition">
            <p className="text-2xl mb-2">📤</p>
            <p className="text-sm font-medium text-orange-700">Print</p>
          </button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
        <h2 className="text-lg font-bold text-indigo-900 mb-3">💡 Key Insights</h2>
        <ul className="space-y-2 text-sm text-indigo-800">
          <li>✓ Employee retention rate improved by 5% this quarter</li>
          <li>✓ Payroll costs normalized after new hiring cycle</li>
          <li>✓ IT department productivity increased by 12%</li>
          <li>✓ System performance consistently above 99.5% uptime</li>
        </ul>
      </div>
    </div>
  );
}
