"use client";

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

interface ServerStatusPanelProps {
  serverStatus: ServerStatus | null;
  liveData: LiveData | null;
}

export function ServerStatusPanel({ serverStatus, liveData }: ServerStatusPanelProps) {
  const getStatusColor = () => {
    if (!serverStatus) return 'bg-gray-400';
    
    switch (serverStatus.status) {
      case 'running': return 'bg-green';
      case 'starting': return 'bg-yellow-dark animate-pulse';
      case 'stopping': return 'bg-orange-light animate-pulse';
      case 'stopped': return 'bg-gray-400';
      case 'error': return 'bg-red';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    if (!serverStatus) return 'Unknown';
    
    switch (serverStatus.status) {
      case 'running': return 'Running';
      case 'starting': return 'Starting...';
      case 'stopping': return 'Stopping...';
      case 'stopped': return 'Stopped';
      case 'error': return 'Error';
      default: return serverStatus.status;
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        Server Status
      </h3>

      {/* Status Indicator */}
      <div className="mb-6 flex items-center space-x-3">
        <div className={`h-4 w-4 rounded-full ${getStatusColor()}`}></div>
        <div>
          <div className="text-lg font-semibold text-dark dark:text-white">
            {getStatusText()}
          </div>
          {serverStatus?.uptime ? (
            <div className="text-sm text-dark-5 dark:text-dark-6">
              Uptime: {serverStatus.uptimeFormatted}
            </div>
          ) : (
            <div className="text-sm text-dark-5 dark:text-dark-6">
              Not running
            </div>
          )}
        </div>
      </div>

      {/* Server Details */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-dark-4 dark:text-dark-7">Process ID:</span>
          <span className="font-mono font-medium text-dark dark:text-white">
            {serverStatus?.processId || 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-dark-4 dark:text-dark-7">Start Time:</span>
          <span className="font-mono font-medium text-dark dark:text-white">
            {serverStatus?.startTime 
              ? new Date(serverStatus.startTime).toLocaleString()
              : 'N/A'
            }
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-dark-4 dark:text-dark-7">Connected Drivers:</span>
          <span className="font-medium text-dark dark:text-white">
            {liveData?.serverStats.connectedDrivers || 0} / {liveData?.serverStats.maxDrivers || 26}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-dark-4 dark:text-dark-7">Spectators:</span>
          <span className="font-medium text-dark dark:text-white">
            {liveData?.serverStats.spectators || 0}
          </span>
        </div>
      </div>

      {/* Current Session */}
      {liveData?.sessionInfo.isActive && (
        <div className="mt-6 rounded-lg bg-gray-1 p-4 dark:bg-dark-2">
          <h4 className="mb-2 text-sm font-semibold text-dark dark:text-white">
            Current Session
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-4 dark:text-dark-7">Type:</span>
              <span className="font-medium text-dark dark:text-white">
                {liveData.sessionInfo.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-4 dark:text-dark-7">Track:</span>
              <span className="font-medium text-dark dark:text-white capitalize">
                {liveData.sessionInfo.track.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-4 dark:text-dark-7">Status:</span>
              <span className="inline-flex items-center rounded-full bg-green/10 px-2 py-1 text-xs font-medium text-green">
                <div className="mr-1 h-1.5 w-1.5 rounded-full bg-green animate-pulse"></div>
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Connected Drivers List */}
      {liveData?.drivers && liveData.drivers.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-2 text-sm font-semibold text-dark dark:text-white">
            Connected Drivers ({liveData.drivers.length})
          </h4>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {liveData.drivers.slice(0, 5).map((driver) => (
              <div key={driver.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {driver.carNumber}
                  </div>
                  <span className="font-medium text-dark dark:text-white truncate">
                    {driver.driverName}
                  </span>
                </div>
                <span className={`inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  driver.connectionStatus === 'Connected' 
                    ? 'bg-green/10 text-green'
                    : 'bg-red/10 text-red'
                }`}>
                  {driver.connectionStatus}
                </span>
              </div>
            ))}
            {liveData.drivers.length > 5 && (
              <div className="text-center text-xs text-dark-5 dark:text-dark-6">
                +{liveData.drivers.length - 5} more drivers
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Session Active */}
      {!liveData?.sessionInfo.isActive && serverStatus?.isRunning && (
        <div className="mt-6 rounded-lg bg-yellow-dark/10 p-4">
          <div className="flex">
            <svg className="mr-2 h-4 w-4 text-yellow-dark" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-yellow-dark">
              <p className="font-medium">No active session</p>
              <p>Server is running but no racing session is currently active.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}