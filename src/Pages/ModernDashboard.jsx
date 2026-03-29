import { useState, useEffect } from "react";
import { useEmployees } from "../context/EmployeeContext";
import { useManagers } from "../context/ManagerContext";
import { useAdmins } from "../context/AdminContext";
import {
  Users,
  TrendingUp,
  Briefcase,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  PageHeader,
  StatCard,
  PageSection,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Badge,
} from "../components/common";

export default function DashboardPage() {
  const { employees } = useEmployees();
  const { managers } = useManagers();
  const { admins } = useAdmins();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalManagers: 0,
    totalAdmins: 0,
    activeCount: 0,
    byDepartment: {},
    recentEmployees: [],
  });

  useEffect(() => {
    const allUsers = [...employees, ...managers, ...admins];
    
    const byDept = {};
    allUsers.forEach((u) => {
      const dept = u.department || "Unassigned";
      byDept[dept] = (byDept[dept] || 0) + 1;
    });

    const activeCount = allUsers.filter((u) => u.status === "Active").length;

    setStats({
      totalEmployees: employees.length,
      totalManagers: managers.length,
      totalAdmins: admins.length,
      activeCount,
      byDepartment: byDept,
      recentEmployees: employees.slice(0, 5),
    });
  }, [employees, managers, admins]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your organization"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          trend={{ positive: true, value: "+12% from last month" }}
        />
        <StatCard
          label="Active Users"
          value={stats.activeCount}
          icon={TrendingUp}
          trend={{ positive: true, value: "+5% this week" }}
        />
        <StatCard
          label="Managers"
          value={stats.totalManagers}
          icon={Briefcase}
        />
        <StatCard
          label="Administrators"
          value={stats.totalAdmins}
          icon={BarChart3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution - Spans 2 columns */}
        <div className="lg:col-span-2">
          <PageSection title="Department Distribution" subtitle="Employee count by department">
            <div className="space-y-4">
              {Object.entries(stats.byDepartment)
                .sort((a, b) => b[1] - a[1])
                .map(([dept, count]) => {
                  const percentage = (count / stats.totalEmployees) * 100;
                  return (
                    <div key={dept}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {dept}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </PageSection>
        </div>

        {/* Quick Actions - Sidebar */}
        <PageSection title="Team Overview" subtitle="Current status">
          <div className="space-y-3">
            <div className="flex justify-between items-end p-3 bg-green-50 rounded-lg border border-green-100">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeCount}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-end p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Object.keys(stats.byDepartment).length}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-end p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalEmployees +
                    stats.totalManagers +
                    stats.totalAdmins}
                </p>
              </div>
            </div>
          </div>
        </PageSection>
      </div>

      {/* Recent Employees */}
      <PageSection
        title="Recent Employees"
        subtitle="Latest added employees in the system"
      >
        {stats.recentEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No employees yet</p>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Employee ID</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentEmployees.map((emp) => (
                <TableRow key={emp.employeeId}>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell className="capitalize">{emp.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={emp.status === "Active" ? "active" : "inactive"}
                      size="sm"
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PageSection>
    </div>
  );
}
