"use client";

import { useState, useEffect } from "react";

interface ServerMetric {
  label: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
}

interface ServerStats {
  serverLoad: number;
  networkIn: number;
  networkOut: number;
  memoryUsage: number;
  connectedDrivers: number;
  maxDrivers: number;
}

export function ServerMetrics() {
  const [serverStats, setServerStats] = useState<ServerStats>({
    serverLoad: 0,
    networkIn: 0,
    networkOut: 0,
    memoryUsage: 0,
    connectedDrivers: 0,
    maxDrivers: 26
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServerMetrics = async () => {
      try {
        const response = await fetch('/api/live-data?type=stats');
        const result = await response.json();
        
        if (result.success && result.data) {
          setServerStats({
            serverLoad: result.data.serverLoad || 0,
            networkIn: result.data.networkIn || 0,
            networkOut: result.data.networkOut || 0,
            memoryUsage: result.data.memoryUsage || 0,
            connectedDrivers: result.data.connectedDrivers || 0,
            maxDrivers: result.data.maxDrivers || 26
          });
        }
      } catch (error) {
        console.error('Failed to fetch server metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServerMetrics();
    
    // Update every 5 seconds
    const interval = setInterval(fetchServerMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const metrics: ServerMetric[] = [
    { 
      label: "Server Load", 
      value: `${serverStats.serverLoad.toFixed(1)}%`, 
      trend: serverStats.serverLoad > 50 ? "High" : "Normal",
      trendPositive: serverStats.serverLoad <= 50
    },
    { 
      label: "Memory Usage", 
      value: `${(serverStats.memoryUsage / 1024).toFixed(1)} GB`,
      trend: serverStats.memoryUsage > 1500 ? "High" : "Normal",
      trendPositive: serverStats.memoryUsage <= 1500
    },
    { 
      label: "Network In", 
      value: `${serverStats.networkIn} KB/s`,
      trendPositive: true
    },
    { 
      label: "Network Out", 
      value: `${serverStats.networkOut} KB/s`,
      trendPositive: true
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Server Performance
        </h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-20 rounded bg-gray-3 dark:bg-dark-4"></div>
                  <div className="mt-1 h-6 w-16 rounded bg-gray-3 dark:bg-dark-4"></div>
                </div>
                <div className="h-6 w-12 rounded-full bg-gray-3 dark:bg-dark-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        Server Performance
      </h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-4 dark:text-dark-7">{metric.label}</p>
              <p className="text-xl font-semibold text-dark dark:text-white">{metric.value}</p>
            </div>
            {metric.trend && (
              <div className={`rounded-full px-2 py-1 text-xs font-medium ${
                metric.trendPositive 
                  ? "bg-green/10 text-green" 
                  : "bg-red/10 text-red"
              }`}>
                {metric.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-dark-4 dark:text-dark-7">Server Capacity</span>
          <span className="text-dark dark:text-white">
            {serverStats.connectedDrivers}/{serverStats.maxDrivers} drivers
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-3 dark:bg-dark-4">
          <div 
            className="h-2 rounded-full bg-blue transition-all duration-1000" 
            style={{ width: `${(serverStats.connectedDrivers / serverStats.maxDrivers) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}