import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  LogOut,
  Home,
  Users,
  FileText,
  Settings,
  Bell,
  User,
  BarChart3,
  ChevronDown,
  PieChart,
} from "lucide-react";
import { showToast } from "../utils/toast";
import Button from "../components/common/Button";

const MainLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const menuItems = {
    admin: [
      { icon: Home, label: "Dashboard", href: "/admin" },
      { icon: Users, label: "Employees", href: "/admin/employees" },
      { icon: BarChart3, label: "Activity Logs", href: "/admin/activities" },
      { icon: FileText, label: "Audit Logs", href: "/admin/audit-logs" },
      { icon: PieChart, label: "Loan Management", href: "/admin/loans" },
    ],
    manager: [
      { icon: Home, label: "Dashboard", href: "/manager" },
      { icon: FileText, label: "Approvals", href: "/manager/approvals" },
      { icon: Users, label: "Team", href: "/manager/team" },
    ],
    employee: [
      { icon: Home, label: "My Dashboard", href: "/employee" },
      { icon: FileText, label: "My Activities", href: "/employee/activities" },
      { icon: Users, label: "Profile", href: "/employee/profile" },
    ],
  };

  const currentMenuItems = menuItems[user.role] || menuItems.employee;

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showToast.success("You have been logged out");
    navigate("/login");
    setShowUserMenu(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-blue-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}
      >
        {/* Logo */}
        <div className="h-18 flex items-center justify-between px-4 border-b border-blue-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-base font-bold text-blue-900">EMS</span>
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold whitespace-nowrap">
                Employee System
              </span>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-blue-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-3">
          {currentMenuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isActive(item.href)
                  ? "bg-blue-100 text-blue-900 shadow-lg"
                  : "text-blue-100 hover:bg-blue-800"
              }`}
            >
              <item.icon size={22} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-base">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-blue-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-3 hover:bg-blue-800 rounded-lg transition-colors flex items-center justify-center"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-18 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} className="text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-base font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-base font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <button
                    onClick={() => navigate("/employee/profile")}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-base"
                  >
                    <User size={20} className="text-gray-600" />
                    <span className="text-gray-900 font-medium">View Profile</span>
                  </button>
                  <button
                    onClick={() => navigate("/settings")}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-base"
                  >
                    <Settings size={20} className="text-gray-600" />
                    <span className="text-gray-900 font-medium">Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition-colors text-red-600 text-base"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
