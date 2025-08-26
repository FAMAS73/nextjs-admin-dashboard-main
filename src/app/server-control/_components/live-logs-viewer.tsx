"use client";

import { useState, useEffect, useRef } from "react";

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: string;
  message: string;
  id: string;
}

export function LiveLogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Simulate fetching logs
  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/server-logs');
      const data = await response.json();
      
      if (data.success && data.logs) {
        setLogs(data.logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
          id: log.id || `${Date.now()}-${Math.random()}`
        })));
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLogs();
  }, []);

  // Live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // In a real implementation, this would use WebSockets or Server-Sent Events
      fetchLogs();
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Auto scroll to bottom
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Handle scroll to detect manual scrolling
  const handleScroll = () => {
    if (!logsContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    
    if (!isAtBottom && autoScroll) {
      setAutoScroll(false);
    } else if (isAtBottom && !autoScroll) {
      setAutoScroll(true);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red bg-red/10 border-red/20';
      case 'warning':
        return 'text-yellow-dark bg-yellow-dark/10 border-yellow-dark/20';
      case 'info':
        return 'text-blue bg-blue/10 border-blue/20';
      case 'debug':
        return 'text-dark-5 bg-gray-1 border-stroke dark:bg-dark-2 dark:border-stroke-dark';
      default:
        return 'text-dark bg-gray-1 border-stroke dark:bg-dark-2 dark:border-stroke-dark';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'all' && log.level !== filterLevel) return false;
    if (filterCategory !== 'all' && log.category !== filterCategory) return false;
    return true;
  });

  const categories = Array.from(new Set(logs.map(log => log.category))).sort();

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs?')) {
      setLogs([]);
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      {/* Header */}
      <div className="border-b border-stroke p-4 dark:border-stroke-dark">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Live Server Logs
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green animate-pulse' : 'bg-red'}`}></div>
              <span className="text-xs text-dark-5 dark:text-dark-6">
                {isLive ? 'Live' : 'Paused'} • {filteredLogs.length} entries
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Live Toggle */}
            <button
              onClick={() => setIsLive(!isLive)}
              className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition ${
                isLive
                  ? 'bg-green/10 text-green hover:bg-green/20'
                  : 'bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3'
              }`}
            >
              {isLive ? (
                <>
                  <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Resume
                </>
              )}
            </button>

            {/* Auto Scroll Toggle */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition ${
                autoScroll
                  ? 'bg-blue/10 text-blue hover:bg-blue/20'
                  : 'bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3'
              }`}
            >
              <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Auto-scroll
            </button>

            {/* Clear Logs */}
            <button
              onClick={clearLogs}
              className="inline-flex items-center rounded-md border border-stroke px-3 py-1 text-xs font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
            >
              <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-xs text-dark-5 dark:text-dark-6">Level:</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="rounded border border-stroke bg-white px-2 py-1 text-xs text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              <option value="all">All</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-dark-5 dark:text-dark-6">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded border border-stroke bg-white px-2 py-1 text-xs text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              <option value="all">All</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Display */}
      <div 
        ref={logsContainerRef}
        onScroll={handleScroll}
        className="h-96 overflow-y-auto p-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="mb-2 h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="text-xs text-dark-5 dark:text-dark-6">Loading logs...</p>
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-dark-4 dark:text-dark-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">No logs to display</p>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                {logs.length === 0 ? 'Start the server to see logs' : 'Adjust filters to see more logs'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`rounded-lg border p-3 transition-colors ${getLevelColor(log.level)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getLevelIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium uppercase">
                          {log.level}
                        </span>
                        <span className="text-xs text-current opacity-75">
                          [{log.category}]
                        </span>
                      </div>
                      <span className="text-xs text-current opacity-75">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-current">
                      {log.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}