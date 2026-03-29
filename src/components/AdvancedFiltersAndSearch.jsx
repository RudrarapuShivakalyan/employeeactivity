import { useState, useEffect } from "react";

export default function AdvancedFiltersAndSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    dateRange: "all",
    department: "all",
    minPerformance: 0,
  });
  const [searching, setSearching] = useState(false);

  // Search function
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setTimeout(() => {
      // Mock search results
      const mockResults = [
        {
          id: 1,
          type: "Employee",
          title: "John Doe",
          category: "Senior Developer",
          department: "Engineering",
          status: "Active",
          date: "2026-03-20",
        },
        {
          id: 2,
          type: "Activity",
          title: "Project Alpha - Database Optimization",
          category: "Project Work",
          department: "Engineering",
          status: "Approved",
          date: "2026-03-19",
        },
        {
          id: 3,
          type: "Goal",
          title: "Q1 Performance Target",
          category: "Team Goal",
          department: "Sales",
          status: "In Progress",
          date: "2026-03-15",
        },
        {
          id: 4,
          type: "Report",
          title: "March Weekly Summary",
          category: "Analytics",
          department: "All",
          status: "Completed",
          date: "2026-03-20",
        },
      ];

      const filtered = mockResults.filter((result) => {
        const matchesQuery =
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = filters.type === "all" || result.type === filters.type;
        const matchesStatus = filters.status === "all" || result.status === filters.status;
        const matchesDept = filters.department === "all" || result.department === filters.department;

        return matchesQuery && matchesType && matchesStatus && matchesDept;
      });

      setSearchResults(filtered);
      setSearching(false);
    }, 300);
  };

  const handleClearFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      dateRange: "all",
      department: "all",
      minPerformance: 0,
    });
    setSearchQuery("");
    setSearchResults([]);
  };

  const resultTypeIcon = (type) => {
    switch (type) {
      case "Employee":
        return "👤";
      case "Activity":
        return "📋";
      case "Goal":
        return "🎯";
      case "Report":
        return "📊";
      default:
        return "📄";
    }
  };

  const resultStatusColor = (status) => {
    switch (status) {
      case "Active":
      case "Approved":
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Inactive":
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees, activities, goals, reports..."
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
          >
            <span>🔍</span> Search
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Advanced Filters</h3>
          <button
            onClick={handleClearFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Employee">Employee</option>
              <option value="Activity">Activity</option>
              <option value="Goal">Goal</option>
              <option value="Report">Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Performance</label>
            <input
              type="range"
              min="0"
              max="10"
              value={filters.minPerformance}
              onChange={(e) => setFilters({ ...filters, minPerformance: parseFloat(e.target.value) })}
              className="w-full cursor-pointer"
            />
            <p className="text-xs text-gray-600 mt-1">{filters.minPerformance.toFixed(1)}/10</p>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          {searching ? "Searching..." : `Results (${searchResults.length})`}
        </h3>

        {searchResults.length === 0 && searchQuery && !searching && (
          <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
            <p className="text-lg">No results found for "{searchQuery}"</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {searchResults.length === 0 && !searchQuery && (
          <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
            <p className="text-lg">Enter a search query to get started</p>
          </div>
        )}

        <div className="space-y-3">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <span className="text-3xl">{resultTypeIcon(result.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{result.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{result.category}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {result.department}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${resultStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(result.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
