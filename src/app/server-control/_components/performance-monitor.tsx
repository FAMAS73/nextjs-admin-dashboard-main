"use client";

import { useState, useEffect } from "react";

interface ServerStatus {
  memoryUsage: number;
  cpuUsage: number;
  networkIn: number;
  networkOut: number;
  connectedDrivers: number;
}

interface LiveData {
  serverStats: {
    connectedDrivers: number;
    maxDrivers: number;
    spectators: number;
    serverLoad: number;
    networkIn: number;
    networkOut: number;
    memoryUsage: number;
  };
}

interface PerformanceMonitorProps {
  serverStatus: ServerStatus | null;
  liveData: LiveData | null;
}

interface PerformanceHistory {
  timestamp: Date;
  cpu: number;
  memory: number;
  networkIn: number;
  networkOut: number;
}

export function PerformanceMonitor({ serverStatus, liveData }: PerformanceMonitorProps) {
  const [history, setHistory] = useState<PerformanceHistory[]>([]);

  // Update performance history
  useEffect(() => {
    if (serverStatus) {
      const newEntry: PerformanceHistory = {
        timestamp: new Date(),
        cpu: serverStatus.cpuUsage || 0,
        memory: serverStatus.memoryUsage || 0,
        networkIn: serverStatus.networkIn || 0,
        networkOut: serverStatus.networkOut || 0,
      };

      setHistory(prev => {
        const updated = [...prev, newEntry];
        // Keep only last 20 entries (for simple visualization)
        return updated.slice(-20);
      });
    }
  }, [serverStatus]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatBytesPerSec = (bytes: number) => {
    return formatBytes(bytes) + '/s';
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green bg-green/10';
    if (percentage < 80) return 'text-yellow-dark bg-yellow-dark/10';
    return 'text-red bg-red/10';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green';
    if (percentage < 80) return 'bg-yellow-dark';
    return 'bg-red';
  };

  const memoryUsage = liveData?.serverStats?.memoryUsage || serverStatus?.memoryUsage || 0;
  const cpuUsage = serverStatus?.cpuUsage || 0;
  const networkIn = liveData?.serverStats?.networkIn || serverStatus?.networkIn || 0;
  const networkOut = liveData?.serverStats?.networkOut || serverStatus?.networkOut || 0;

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        Performance Monitor
      </h3>

      <div className="space-y-4">
        {/* CPU Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-dark dark:text-white">CPU Usage</span>
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getUsageColor(cpuUsage)}`}>
              {cpuUsage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-1 rounded-full h-2 dark:bg-dark-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(cpuUsage)}`}
              style={{ width: `${Math.min(cpuUsage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Memory Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-dark dark:text-white">Memory Usage</span>
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getUsageColor(memoryUsage)}`}>
              {formatBytes(memoryUsage * 1024 * 1024)}
            </span>
          </div>
          <div className="w-full bg-gray-1 rounded-full h-2 dark:bg-dark-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(memoryUsage)}`}
              style={{ width: `${Math.min(memoryUsage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Network Activity */}
        <div>
          <div className="mb-2">
            <span className="text-sm font-medium text-dark dark:text-white">Network Activity</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xs text-dark-5 dark:text-dark-6">Incoming</div>
              <div className="text-sm font-medium text-green">
                <svg className="inline h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                {formatBytesPerSec(networkIn)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-dark-5 dark:text-dark-6">Outgoing</div>
              <div className="text-sm font-medium text-blue">
                <svg className="inline h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                {formatBytesPerSec(networkOut)}
              </div>
            </div>
          </div>
        </div>

        {/* Server Load */}
        {liveData?.serverStats && (
          <div>
            <div className="mb-2">
              <span className="text-sm font-medium text-dark dark:text-white">Server Load</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-dark-5 dark:text-dark-6">Connected Drivers</div>
                <div className="font-medium text-dark dark:text-white">
                  {liveData.serverStats.connectedDrivers} / {liveData.serverStats.maxDrivers}
                </div>
              </div>
              <div>
                <div className="text-xs text-dark-5 dark:text-dark-6">Spectators</div>
                <div className="font-medium text-dark dark:text-white">
                  {liveData.serverStats.spectators}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Trend */}
        {history.length > 5 && (
          <div>
            <div className="mb-2">
              <span className="text-sm font-medium text-dark dark:text-white">Performance Trend</span>
            </div>
            <div className="h-16 flex items-end space-x-1">
              {history.slice(-10).map((entry, index) => (
                <div 
                  key={index}
                  className="flex-1 bg-primary/20 rounded-t"
                  style={{ 
                    height: `${Math.max(entry.cpu, 5)}%`,
                    opacity: 0.5 + (index / 20)
                  }}
                  title={`CPU: ${entry.cpu.toFixed(1)}% at ${entry.timestamp.toLocaleTimeString()}`}
                ></div>
              ))}
            </div>
            <div className="text-xs text-dark-5 dark:text-dark-6 mt-1">
              CPU usage over time (last 10 data points)
            </div>
          </div>
        )}
      </div>

      {/* Performance Alerts */}
      {(cpuUsage > 90 || memoryUsage > 90) && (
        <div className="mt-4 rounded-lg border border-red/20 bg-red/5 p-3 dark:bg-red/10">
          <div className="flex">
            <svg className="mr-2 h-4 w-4 text-red" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-red">
              <p className="font-medium">High Resource Usage Detected</p>
              <p className="text-xs">
                {cpuUsage > 90 && `CPU usage is at ${cpuUsage.toFixed(1)}%. `}
                {memoryUsage > 90 && `Memory usage is at ${memoryUsage.toFixed(1)}%.`}
                Consider restarting the server if performance issues persist.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}