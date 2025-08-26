"use client";

import { useEffect, useState } from "react";

interface SystemInfo {
  accServerManager: {
    installation: {
      isValid: boolean;
      message: string;
      paths: any;
    };
    dataAvailability: {
      sessionData: boolean;
      raceResults: boolean;
      drivers: boolean;
      serverLogs: boolean;
    };
  };
  environment: {
    accServerPath: string;
    nodeEnv: string;
  };
}

export default function SetupPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await fetch('/api/info');
        const data = await response.json();
        
        if (data.success) {
          setSystemInfo(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch system info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-dark-5 dark:text-dark-6">Loading system information...</p>
        </div>
      </div>
    );
  }

  const isConfigured = systemInfo?.accServerManager.installation.isValid;
  const hasRealData = systemInfo && (
    systemInfo.accServerManager.dataAvailability.sessionData ||
    systemInfo.accServerManager.dataAvailability.raceResults ||
    systemInfo.accServerManager.dataAvailability.drivers
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          ACC Server Manager Setup
        </h1>
        <p className="mt-2 text-body-sm text-dark-5 dark:text-dark-6">
          Configure your ACC server integration to use real server data
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* ACC Server Status */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              ACC Server
            </h3>
            <div className={`h-3 w-3 rounded-full ${isConfigured ? 'bg-green' : 'bg-orange-light'}`}></div>
          </div>
          <p className={`text-sm ${isConfigured ? 'text-green' : 'text-orange-light'}`}>
            {isConfigured ? 'Configured' : 'Not Configured'}
          </p>
          <p className="mt-2 text-xs text-dark-5 dark:text-dark-6">
            {systemInfo?.environment.accServerPath || 'No path set'}
          </p>
        </div>

        {/* Real Data Status */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Real Data
            </h3>
            <div className={`h-3 w-3 rounded-full ${hasRealData ? 'bg-green' : 'bg-gray-4'}`}></div>
          </div>
          <p className={`text-sm ${hasRealData ? 'text-green' : 'text-dark-5 dark:text-dark-6'}`}>
            {hasRealData ? 'Available' : 'Using Mock Data'}
          </p>
          <p className="mt-2 text-xs text-dark-5 dark:text-dark-6">
            {hasRealData ? 'Reading from ACC files' : 'Demo mode active'}
          </p>
        </div>

        {/* Environment */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Environment
            </h3>
            <div className="h-3 w-3 rounded-full bg-blue"></div>
          </div>
          <p className="text-sm text-dark dark:text-white">
            {systemInfo?.environment.nodeEnv || 'Unknown'}
          </p>
          <p className="mt-2 text-xs text-dark-5 dark:text-dark-6">
            Node.js Environment
          </p>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
          Setup Instructions
        </h2>

        <div className="space-y-6">
          {/* Step 1: Environment Configuration */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-dark dark:text-white mb-2">
              1. Configure ACC Server Path
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6 mb-3">
              Set the ACC_SERVER_PATH environment variable to point to your ACC server directory:
            </p>
            <div className="bg-gray-1 dark:bg-dark-2 rounded-md p-3">
              <code className="text-sm text-primary">
                ACC_SERVER_PATH=Z:\SteamLibrary\steamapps\common\Assetto Corsa Competizione Dedicated Server\server
              </code>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 mt-2">
              Add this to your .env.local file in the project root
            </p>
          </div>

          {/* Step 2: Directory Structure */}
          <div className="border-l-4 border-yellow-dark pl-4">
            <h3 className="font-semibold text-dark dark:text-white mb-2">
              2. Required Directory Structure
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6 mb-3">
              Your ACC server directory should contain these folders:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green"></div>
                  <span className="text-sm text-dark dark:text-white">cfg/ - Configuration files</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green"></div>
                  <span className="text-sm text-dark dark:text-white">log/ - Server logs</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green"></div>
                  <span className="text-sm text-dark dark:text-white">results/ - Race results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green"></div>
                  <span className="text-sm text-dark dark:text-white">accServer.exe - Executable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Usage */}
          <div className="border-l-4 border-green pl-4">
            <h3 className="font-semibold text-dark dark:text-white mb-2">
              3. Using Real ACC Server Data
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">Configure Server</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">Use /server-config to set up your ACC server settings</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">Start Server</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">Use /server-control to start your ACC server</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">Monitor & Race</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">View real-time data at /live-timing and results at /race-results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Status */}
      {systemInfo && (
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            Current Status
          </h2>

          <div className="space-y-4">
            {/* Installation Status */}
            <div className="flex items-center justify-between p-3 rounded-md bg-gray-1 dark:bg-dark-2">
              <span className="text-sm font-medium text-dark dark:text-white">
                ACC Server Installation
              </span>
              <span className={`text-sm ${isConfigured ? 'text-green' : 'text-orange-light'}`}>
                {systemInfo.accServerManager.installation.message}
              </span>
            </div>

            {/* Data Availability */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`h-4 w-4 rounded-full mx-auto mb-1 ${systemInfo.accServerManager.dataAvailability.sessionData ? 'bg-green' : 'bg-gray-4'}`}></div>
                <p className="text-xs text-dark-5 dark:text-dark-6">Session Data</p>
              </div>
              <div className="text-center">
                <div className={`h-4 w-4 rounded-full mx-auto mb-1 ${systemInfo.accServerManager.dataAvailability.raceResults ? 'bg-green' : 'bg-gray-4'}`}></div>
                <p className="text-xs text-dark-5 dark:text-dark-6">Race Results</p>
              </div>
              <div className="text-center">
                <div className={`h-4 w-4 rounded-full mx-auto mb-1 ${systemInfo.accServerManager.dataAvailability.drivers ? 'bg-green' : 'bg-gray-4'}`}></div>
                <p className="text-xs text-dark-5 dark:text-dark-6">Driver Data</p>
              </div>
              <div className="text-center">
                <div className={`h-4 w-4 rounded-full mx-auto mb-1 ${systemInfo.accServerManager.dataAvailability.serverLogs ? 'bg-green' : 'bg-gray-4'}`}></div>
                <p className="text-xs text-dark-5 dark:text-dark-6">Server Logs</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <a
          href="/server-config"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Configure Server
        </a>
        <a
          href="/server-control"
          className="inline-flex items-center rounded-md border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
        >
          Server Control
        </a>
        <a
          href="/live-timing"
          className="inline-flex items-center rounded-md border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
        >
          Live Timing
        </a>
      </div>
    </div>
  );
}