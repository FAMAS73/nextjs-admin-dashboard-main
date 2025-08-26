"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRaces: number;
  serverStatus: 'online' | 'offline';
  lastRace: string;
}

export default function AdminDashboard() {
  const { driver } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRaces: 0,
    serverStatus: 'offline',
    lastRace: 'Never'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
              <div className="h-4 bg-gray-3 rounded mb-4"></div>
              <div className="h-8 bg-gray-3 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Total Races",
      value: stats.totalRaces,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Server Status",
      value: stats.serverStatus,
      color: stats.serverStatus === 'online' ? "text-green-500" : "text-red-500",
      bgColor: stats.serverStatus === 'online' ? "bg-green-500/10" : "bg-red-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          Welcome back, {driver?.display_name}
        </h2>
        <p className="text-gray-6">
          Here's what's happening with your ACC server
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {typeof card.value === 'string' ? card.value : card.value.toLocaleString()}
                </p>
              </div>
              <div className={`rounded-full p-3 ${card.bgColor}`}>
                <div className={`h-6 w-6 ${card.color}`}>
                  {/* Icon placeholder */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stroke pb-2 dark:border-dark-3">
              <span className="text-sm text-gray-6">Last Race</span>
              <span className="text-sm font-medium text-dark dark:text-white">
                {stats.lastRace}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-stroke pb-2 dark:border-dark-3">
              <span className="text-sm text-gray-6">Server Uptime</span>
              <span className="text-sm font-medium text-dark dark:text-white">
                {stats.serverStatus === 'online' ? '2h 34m' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-6">Active Sessions</span>
              <span className="text-sm font-medium text-dark dark:text-white">
                {stats.activeUsers}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full rounded-lg bg-primary px-4 py-2 text-left text-sm font-medium text-white hover:bg-primary/90">
              Start Server
            </button>
            <button className="w-full rounded-lg bg-red-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-red-500/90">
              Stop Server
            </button>
            <button className="w-full rounded-lg bg-yellow-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-yellow-500/90">
              Restart Server
            </button>
            <button className="w-full rounded-lg border border-stroke px-4 py-2 text-left text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3">
              View Server Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}