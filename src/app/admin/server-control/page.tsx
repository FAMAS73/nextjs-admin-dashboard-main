"use client";

import { useState, useEffect } from "react";
import { AccServerManager } from "@/lib/acc-server-manager";

interface ServerStatus {
  isRunning: boolean;
  uptime: string;
  players: number;
  maxPlayers: number;
  track: string;
  sessionType: string;
}

export default function ServerControl() {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    isRunning: false,
    uptime: '0m',
    players: 0,
    maxPlayers: 24,
    track: 'Unknown',
    sessionType: 'Practice'
  });
  const [loading, setLoading] = useState(false);
  const [accessKeys, setAccessKeys] = useState<any[]>([]);

  useEffect(() => {
    fetchServerStatus();
    fetchAccessKeys();
  }, []);

  const fetchServerStatus = async () => {
    try {
      const response = await fetch('/api/admin/server-status');
      if (response.ok) {
        const data = await response.json();
        setServerStatus(data);
      }
    } catch (error) {
      console.error('Error fetching server status:', error);
    }
  };

  const fetchAccessKeys = async () => {
    try {
      const response = await fetch('/api/server-control/access-key');
      if (response.ok) {
        const data = await response.json();
        setAccessKeys(data);
      }
    } catch (error) {
      console.error('Error fetching access keys:', error);
    }
  };

  const handleServerAction = async (action: 'start' | 'stop' | 'restart') => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/server-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setTimeout(fetchServerStatus, 2000); // Refresh status after 2 seconds
      }
    } catch (error) {
      console.error(`Error ${action}ing server:`, error);
    } finally {
      setLoading(false);
    }
  };

  const generateAccessKey = async () => {
    try {
      const response = await fetch('/api/server-control/access-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `Admin-generated key ${new Date().toLocaleString()}`,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }),
      });

      if (response.ok) {
        fetchAccessKeys();
      }
    } catch (error) {
      console.error('Error generating access key:', error);
    }
  };

  const revokeAccessKey = async (keyId: string) => {
    try {
      const response = await fetch('/api/server-control/access-key', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyId }),
      });

      if (response.ok) {
        fetchAccessKeys();
      }
    } catch (error) {
      console.error('Error revoking access key:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          Server Control
        </h2>
        <p className="text-gray-6">
          Manage ACC server operations and access delegation
        </p>
      </div>

      {/* Server Status */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Server Status
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              serverStatus.isRunning ? 'text-green-500' : 'text-red-500'
            }`}>
              {serverStatus.isRunning ? 'ONLINE' : 'OFFLINE'}
            </div>
            <div className="text-sm text-gray-6">Status</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-dark dark:text-white">
              {serverStatus.uptime}
            </div>
            <div className="text-sm text-gray-6">Uptime</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {serverStatus.players}/{serverStatus.maxPlayers}
            </div>
            <div className="text-sm text-gray-6">Players</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-dark dark:text-white">
              {serverStatus.track}
            </div>
            <div className="text-sm text-gray-6">Track</div>
          </div>
        </div>

        {/* Server Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => handleServerAction('start')}
            disabled={loading || serverStatus.isRunning}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
          >
            Start Server
          </button>
          
          <button
            onClick={() => handleServerAction('stop')}
            disabled={loading || !serverStatus.isRunning}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            Stop Server
          </button>
          
          <button
            onClick={() => handleServerAction('restart')}
            disabled={loading}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-50"
          >
            Restart Server
          </button>
        </div>
      </div>

      {/* Access Key Management */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Access Key Management
          </h3>
          <button
            onClick={generateAccessKey}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Generate New Key
          </button>
        </div>

        <div className="space-y-3">
          {accessKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-6">
              No active access keys
            </div>
          ) : (
            accessKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3"
              >
                <div className="flex-1">
                  <div className="font-mono text-sm text-dark dark:text-white">
                    {key.access_key}
                  </div>
                  <div className="text-xs text-gray-6">
                    {key.description} • Expires: {new Date(key.valid_until).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    key.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {key.is_active ? 'Active' : 'Revoked'}
                  </span>
                  {key.is_active && (
                    <button
                      onClick={() => revokeAccessKey(key.id)}
                      className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}