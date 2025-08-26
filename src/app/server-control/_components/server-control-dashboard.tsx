"use client";

import { useState, useEffect } from "react";
import { ServerStatusPanel } from "./server-status-panel";
import { ServerControlPanel } from "./server-control-panel";
import { PerformanceMonitor } from "./performance-monitor";
import { LiveLogsViewer } from "./live-logs-viewer";
import { ConfigurationPresets } from "./configuration-presets";

interface ServerStatus {
  isRunning: boolean;
  processId: number | null;
  startTime: Date | null;
  status: "starting" | "running" | "stopping" | "stopped" | "error";
  uptime: number;
  uptimeFormatted: string;
  memoryUsage: number;
  cpuUsage: number;
  networkIn: number;
  networkOut: number;
  connectedDrivers: number;
}

interface LiveData {
  sessionInfo: {
    type: string;
    track: string;
    isActive: boolean;
  };
  drivers: Array<{
    id: string;
    driverName: string;
    carNumber: number;
    connectionStatus: string;
  }>;
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

export function ServerControlDashboard() {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch server status
  const fetchServerStatus = async () => {
    try {
      const response = await fetch('/api/server-control');
      const data = await response.json();
      
      if (data.success) {
        setServerStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch server status:', error);
    }
  };

  // Fetch live data
  const fetchLiveData = async () => {
    try {
      const response = await fetch('/api/live-data');
      const data = await response.json();
      
      if (data.success) {
        setLiveData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([fetchServerStatus(), fetchLiveData()]);
      setIsLoading(false);
      setLastUpdate(new Date());
    };

    loadInitialData();
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      await Promise.all([fetchServerStatus(), fetchLiveData()]);
      setLastUpdate(new Date());
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleServerAction = async (action: 'start' | 'stop' | 'restart') => {
    try {
      const response = await fetch('/api/server-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Immediately refresh status
        await fetchServerStatus();
      } else {
        alert(`Failed to ${action} server: ${data.error}`);
      }
    } catch (error) {
      alert(`Failed to ${action} server. Please try again.`);
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const manualRefresh = async () => {
    setIsLoading(true);
    await Promise.all([fetchServerStatus(), fetchLiveData()]);
    setIsLoading(false);
    setLastUpdate(new Date());
  };

  if (isLoading && !serverStatus) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-dark-5 dark:text-dark-6">Loading server status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${
              serverStatus?.isRunning ? 'bg-green animate-pulse' : 'bg-red'
            }`}></div>
            <span className="text-sm font-medium text-dark dark:text-white">
              {serverStatus?.isRunning ? 'Server Online' : 'Server Offline'}
            </span>
          </div>
          <div className="text-xs text-dark-5 dark:text-dark-6">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleAutoRefresh}
            className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition ${
              autoRefresh
                ? 'bg-green/10 text-green hover:bg-green/20'
                : 'bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3'
            }`}
          >
            <div className={`mr-1 h-2 w-2 rounded-full ${autoRefresh ? 'bg-green animate-pulse' : 'bg-dark-4'}`}></div>
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
          
          <button
            onClick={manualRefresh}
            disabled={isLoading}
            className="inline-flex items-center rounded-md border border-stroke px-3 py-1 text-xs font-medium text-dark hover:bg-gray-1 disabled:opacity-50 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
          >
            <svg className={`mr-1 h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 lg:grid-cols-2">
        {/* Server Status */}
        <div className="xl:col-span-1 lg:col-span-1">
          <ServerStatusPanel 
            serverStatus={serverStatus}
            liveData={liveData}
          />
        </div>

        {/* Server Controls */}
        <div className="xl:col-span-1 lg:col-span-1">
          <ServerControlPanel
            serverStatus={serverStatus}
            onServerAction={handleServerAction}
          />
        </div>

        {/* Configuration Presets */}
        <div className="xl:col-span-1 lg:col-span-2">
          <ConfigurationPresets onPresetLoaded={fetchServerStatus} />
        </div>

        {/* Performance Monitor */}
        <div className="xl:col-span-1 lg:col-span-2">
          <PerformanceMonitor
            serverStatus={serverStatus}
            liveData={liveData}
          />
        </div>
      </div>

      {/* Live Logs */}
      <div className="grid grid-cols-1">
        <LiveLogsViewer />
      </div>
    </div>
  );
}