"use client";

import { useState } from "react";
import { AccConfiguration } from "@/types/acc-config";

export default function NetworkConfigPage() {
  const [config, setConfig] = useState<AccConfiguration>({
    tcpPort: 9231,
    udpPort: 9232,
    registerToLobby: 0,
    maxConnections: 29,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Network configuration:", config);
    // TODO: Save configuration
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Network Configuration
        </h1>
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          Configure the core network identity of your ACC server. These settings control how players connect to your server.
        </p>
      </div>

      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* TCP Port */}
            <div>
              <label className="mb-2.5 block text-sm font-medium text-dark dark:text-white">
                TCP Port
              </label>
              <input
                type="number"
                min="1024"
                max="65535"
                value={config.tcpPort}
                onChange={(e) => setConfig({ ...config, tcpPort: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-stroke-dark dark:bg-gray-dark dark:text-white dark:focus:border-primary"
                placeholder="9600"
                required
              />
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                The TCP port for initial client connections (1024-65535)
              </p>
            </div>

            {/* UDP Port */}
            <div>
              <label className="mb-2.5 block text-sm font-medium text-dark dark:text-white">
                UDP Port
              </label>
              <input
                type="number"
                min="1024"
                max="65535"
                value={config.udpPort}
                onChange={(e) => setConfig({ ...config, udpPort: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-stroke-dark dark:bg-gray-dark dark:text-white dark:focus:border-primary"
                placeholder="9601"
                required
              />
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                The UDP port for streaming gameplay data (usually TCP port + 1)
              </p>
            </div>

            {/* Max Connections */}
            <div>
              <label className="mb-2.5 block text-sm font-medium text-dark dark:text-white">
                Max Connections
              </label>
              <input
                type="number"
                min="1"
                max="105"
                value={config.maxConnections}
                onChange={(e) => setConfig({ ...config, maxConnections: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-stroke-dark dark:bg-gray-dark dark:text-white dark:focus:border-primary"
                placeholder="26"
                required
              />
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                Total connections including drivers and spectators (1-105)
              </p>
            </div>

            {/* Register to Lobby */}
            <div>
              <label className="mb-2.5 block text-sm font-medium text-dark dark:text-white">
                Server Visibility
              </label>
              <select
                value={config.registerToLobby}
                onChange={(e) => setConfig({ ...config, registerToLobby: parseInt(e.target.value) as 0 | 1 })}
                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-stroke-dark dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              >
                <option value={0}>Private (LAN/VPN only)</option>
                <option value={1}>Public (Listed in server browser)</option>
              </select>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                Whether your server appears in the public server browser
              </p>
            </div>
          </div>

          {/* Configuration Preview */}
          <div className="rounded-lg bg-gray-1 p-4 dark:bg-gray-2">
            <h3 className="mb-3 font-semibold text-dark dark:text-white">
              Configuration Preview
            </h3>
            <pre className="text-xs text-dark-5 dark:text-dark-6">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Save Network Configuration
            </button>
            <button
              type="button"
              onClick={() => setConfig({
                tcpPort: 9231,
                udpPort: 9232,
                registerToLobby: 0,
                maxConnections: 29,
              })}
              className="rounded-lg border border-stroke px-6 py-3 text-sm font-medium text-dark transition hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
            >
              Reset to Defaults
            </button>
            <a
              href="/server-config"
              className="rounded-lg border border-stroke px-6 py-3 text-sm font-medium text-dark transition hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
            >
              Back to Configuration
            </a>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-6 rounded-lg border border-blue/20 bg-blue/5 p-4 dark:border-blue/30 dark:bg-blue/10">
        <h4 className="mb-2 font-semibold text-blue-dark dark:text-blue-light">
          Network Configuration Tips
        </h4>
        <ul className="space-y-1 text-sm text-blue-dark/80 dark:text-blue-light/80">
          <li>• Use consecutive ports (TCP: 9600, UDP: 9601) for easier firewall setup</li>
          <li>• Ensure both TCP and UDP ports are forwarded in your router settings</li>
          <li>• Private servers are only accessible via direct IP connection</li>
          <li>• Max connections should account for both drivers and spectators</li>
        </ul>
      </div>
    </div>
  );
}