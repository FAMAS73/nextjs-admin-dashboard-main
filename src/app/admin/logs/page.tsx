"use client";

import { useState, useEffect } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: 'user' | 'database' | 'server' | 'system';
  message: string;
  details?: any;
  user_id?: string;
  username?: string;
}

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [filters, currentPage]);

  const fetchLogs = async () => {
    try {
      const searchParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        ...filters
      });

      const response = await fetch(`/api/admin/logs?${searchParams}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'warn':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      case 'info':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      case 'debug':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'user':
        return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'database':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      case 'server':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-900';
      case 'system':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-3 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-3 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-3 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          System Logs
        </h2>
        <p className="text-gray-6">
          View and search historical system, database, and user logs
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label className="block text-sm font-medium text-gray-6 mb-1">
              Level
            </label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark dark:border-dark-3 dark:text-white"
            >
              <option value="all">All Levels</option>
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-6 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark dark:border-dark-3 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="user">User</option>
              <option value="database">Database</option>
              <option value="server">Server</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-6 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark dark:border-dark-3 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-6 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark dark:border-dark-3 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-6 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark dark:border-dark-3 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Log entries */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-dark">
        <div className="divide-y divide-stroke dark:divide-dark-3">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-gray-6">
              No logs found matching your filters
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-1 dark:hover:bg-dark-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getCategoryColor(log.category)}`}>
                        {log.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-6">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      {log.username && (
                        <span className="text-xs text-primary">
                          @{log.username}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-dark dark:text-white mb-1">
                      {log.message}
                    </div>
                    {log.details && (
                      <div className="text-xs text-gray-6 font-mono bg-gray-1 dark:bg-dark-3 p-2 rounded">
                        {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-stroke p-4 dark:border-dark-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-6">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-stroke px-3 py-1 text-sm disabled:opacity-50 dark:border-dark-3"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-stroke px-3 py-1 text-sm disabled:opacity-50 dark:border-dark-3"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}