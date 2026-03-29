import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    limit: 100
  });
  const token = localStorage.getItem("token");

  // ✅ FETCH AUDIT LOGS
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let url = `http://localhost:5000/api/audit-logs?limit=${filters.limit}`;
        
        if (filters.userId) url += `&userId=${filters.userId}`;
        if (filters.action) url += `&action=${filters.action}`;

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch audit logs');

        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filters, token]);

  const actionColors = {
    'LOGIN': 'bg-blue-100 text-blue-800',
    'CREATE': 'bg-green-100 text-green-800',
    'UPDATE': 'bg-yellow-100 text-yellow-800',
    'DELETE': 'bg-red-100 text-red-800',
    'APPROVE': 'bg-purple-100 text-purple-800',
    'REJECT': 'bg-orange-100 text-orange-800',
    'EXPORT': 'bg-indigo-100 text-indigo-800'
  };

  const getActionColor = (action) => {
    return actionColors[action] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">System Audit Logs</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              placeholder="Filter by user..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Actions</option>
              {['LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'EXPORT'].map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Limit
            </label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={50}>Last 50</option>
              <option value={100}>Last 100</option>
              <option value={250}>Last 250</option>
              <option value={500}>Last 500</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ userId: '', action: '', limit: 100 })}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Timestamp</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">User</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Action</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Resource</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <div className="text-xs font-mono">{new Date(log.timestamp).toLocaleString()}</div>
                      <div className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {log.userName || log.userId}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="text-xs">
                        {log.resourceType && (
                          <div>{log.resourceType}</div>
                        )}
                        {log.resourceId && (
                          <div className="text-gray-400 font-mono">{log.resourceId}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${getStatusColor(log.status)}`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {log.details && Object.keys(log.details).length > 0 ? (
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:text-blue-800">
                            View {Object.keys(log.details).length} item(s)
                          </summary>
                          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {logs.length} audit log entries • Total shown up to {filters.limit} entries
          </p>
        </div>
      </div>
    </div>
  );
}
