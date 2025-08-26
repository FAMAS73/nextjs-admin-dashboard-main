"use client";

import { AccConfiguration, AccSettings } from "@/types/acc-config";

interface BasicConfigStepProps {
  configuration: AccConfiguration;
  settings: AccSettings;
  onChange: (updates: Partial<AccConfiguration & AccSettings>) => void;
}

export function BasicConfigStep({ configuration, settings, onChange }: BasicConfigStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Basic Configuration
        </h2>
        <p className="text-sm text-dark-5 dark:text-dark-6 mb-6">
          Configure the basic server settings including network ports and server identification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Server Name */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Server Name
          </label>
          <input
            type="text"
            value={settings.serverName}
            onChange={(e) => onChange({ serverName: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            placeholder="My ACC Server"
          />
        </div>

        {/* Server Password */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Server Password
            <span className="ml-1 text-xs text-dark-5 dark:text-dark-6">(Optional)</span>
          </label>
          <input
            type="password"
            value={settings.password}
            onChange={(e) => onChange({ password: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            placeholder="Leave empty for open server"
          />
        </div>

        {/* Admin Password */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Admin Password
          </label>
          <input
            type="password"
            value={settings.adminPassword}
            onChange={(e) => onChange({ adminPassword: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            placeholder="admin123"
          />
        </div>

        {/* Max Connections */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Max Connections
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={configuration.maxConnections}
            onChange={(e) => onChange({ maxConnections: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          />
        </div>

        {/* TCP Port */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            TCP Port
          </label>
          <input
            type="number"
            min="1024"
            max="65535"
            value={configuration.tcpPort}
            onChange={(e) => onChange({ tcpPort: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          />
        </div>

        {/* UDP Port */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            UDP Port
          </label>
          <input
            type="number"
            min="1024"
            max="65535"
            value={configuration.udpPort}
            onChange={(e) => onChange({ udpPort: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          />
        </div>
      </div>

      {/* Register to Lobby */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="registerToLobby"
          checked={configuration.registerToLobby === 1}
          onChange={(e) => onChange({ registerToLobby: e.target.checked ? 1 : 0 })}
          className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-stroke-dark"
        />
        <label htmlFor="registerToLobby" className="text-sm font-medium text-dark dark:text-white">
          Register to Public Lobby
        </label>
      </div>
    </div>
  );
}