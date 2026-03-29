import { useState } from "react";
import ActivityApprovals from "./ActivityApprovals";
import EmployeeProfileSearch from "./EmployeeProfileSearch";
import TeamPerformanceDashboard from "../components/TeamPerformanceDashboard";
import TeamMemberManagement from "../components/TeamMemberManagement";
import ActivityAnalytics from "../components/ActivityAnalytics";
import TeamGoalsTracking from "../components/TeamGoalsTracking";
import NotesAndComments from "../components/NotesAndComments";
import AttendanceAndLeave from "../components/AttendanceAndLeave";
import AdvancedFiltersAndSearch from "../components/AdvancedFiltersAndSearch";
import ManagerNotifications from "../components/ManagerNotifications";
import AdvancedActivityApprovals from "../components/AdvancedActivityApprovals";
import ApprovalHistoryAndAudit from "../components/ApprovalHistoryAndAudit";
import ApprovalRulesAndTemplates from "../components/ApprovalRulesAndTemplates";

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const manager = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
    { id: "performance", label: "⭐ Performance", icon: "⭐" },
    { id: "activities", label: "✅ Approvals", icon: "✅" },
    { id: "advancedApprovals", label: "⚡ Advanced Approvals", icon: "⚡" },
    { id: "approvalHistory", label: "📜 History", icon: "📜" },
    { id: "approvalRules", label: "⚙️ Rules & Templates", icon: "⚙️" },
    { id: "team", label: "👥 Team", icon: "👥" },
    { id: "analytics", label: "📈 Analytics", icon: "📈" },
    { id: "goals", label: "🎯 Goals", icon: "🎯" },
    { id: "attendance", label: "📋 Attendance", icon: "📋" },
    { id: "notes", label: "📝 Notes", icon: "📝" },
    { id: "search", label: "🔍 Search", icon: "🔍" },
    { id: "notifications", label: "🔔 Notifications", icon: "🔔" },
  ];

  const TabButton = ({ tab, isActive }) => (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={`px-3 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
      }`}
      title={tab.label}
    >
      <span className="mr-2">{tab.icon}</span>
      <span className="hidden sm:inline">{tab.label.split(" ").slice(1).join(" ")}</span>
    </button>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Manager Dashboard</h1>
              <p className="text-blue-100 text-sm mt-1">Welcome back, {manager?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Manager Portal</h2>
              <p className="text-gray-600">
                Manage your team efficiently with our comprehensive suite of tools. Use the tabs above to navigate through different sections.
              </p>
            </div>
            <TeamPerformanceDashboard />
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && <TeamPerformanceDashboard />}

        {/* Activities Tab */}
        {activeTab === "activities" && <ActivityApprovals />}

        {/* Advanced Approvals Tab */}
        {activeTab === "advancedApprovals" && <AdvancedActivityApprovals />}

        {/* Approval History Tab */}
        {activeTab === "approvalHistory" && <ApprovalHistoryAndAudit />}

        {/* Approval Rules & Templates Tab */}
        {activeTab === "approvalRules" && <ApprovalRulesAndTemplates />}

        {/* Team Management Tab */}
        {activeTab === "team" && <TeamMemberManagement />}

        {/* Analytics Tab */}
        {activeTab === "analytics" && <ActivityAnalytics />}

        {/* Goals Tab */}
        {activeTab === "goals" && <TeamGoalsTracking />}

        {/* Attendance Tab */}
        {activeTab === "attendance" && <AttendanceAndLeave />}

        {/* Notes Tab */}
        {activeTab === "notes" && <NotesAndComments />}

        {/* Search Tab */}
        {activeTab === "search" && <AdvancedFiltersAndSearch />}

        {/* Notifications Tab */}
        {activeTab === "notifications" && <ManagerNotifications />}
      </div>
    </div>
  );
}
