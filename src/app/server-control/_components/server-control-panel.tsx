"use client";

interface ServerStatus {
  isRunning: boolean;
  processId: number | null;
  startTime: Date | null;
  status: "starting" | "running" | "stopping" | "stopped" | "error";
  uptime: number;
  uptimeFormatted: string;
}

interface ServerControlPanelProps {
  serverStatus: ServerStatus | null;
  onServerAction: (action: 'start' | 'stop' | 'restart') => Promise<void>;
}

export function ServerControlPanel({ serverStatus, onServerAction }: ServerControlPanelProps) {
  const handleAction = async (action: 'start' | 'stop' | 'restart') => {
    const confirmMessage = `Are you sure you want to ${action} the server?`;
    if (action === 'stop' || action === 'restart') {
      if (!confirm(confirmMessage)) return;
    }
    await onServerAction(action);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green bg-green/10';
      case 'starting':
        return 'text-yellow-dark bg-yellow-dark/10';
      case 'stopping':
        return 'text-orange-light bg-orange-light/10';
      case 'error':
        return 'text-red bg-red/10';
      default:
        return 'text-dark-5 bg-gray-1 dark:bg-dark-2';
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        Server Control
      </h3>

      {/* Current Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-dark-5 dark:text-dark-6">Current Status:</span>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(serverStatus?.status || 'stopped')}`}>
            {serverStatus?.status?.toUpperCase() || 'STOPPED'}
          </span>
        </div>
        
        {serverStatus?.isRunning && serverStatus.processId && (
          <div className="mt-2 text-xs text-dark-5 dark:text-dark-6">
            Process ID: {serverStatus.processId}
          </div>
        )}
        
        {serverStatus?.uptimeFormatted && (
          <div className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            Uptime: {serverStatus.uptimeFormatted}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleAction('start')}
          disabled={serverStatus?.isRunning || serverStatus?.status === 'starting'}
          className="w-full inline-flex items-center justify-center rounded-md bg-green px-4 py-2 text-sm font-medium text-white hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1M13 16H9m0 0v-4" />
          </svg>
          {serverStatus?.status === 'starting' ? 'Starting...' : 'Start Server'}
        </button>

        <button
          onClick={() => handleAction('restart')}
          disabled={!serverStatus?.isRunning || serverStatus?.status !== 'running'}
          className="w-full inline-flex items-center justify-center rounded-md bg-yellow-dark px-4 py-2 text-sm font-medium text-white hover:bg-yellow-dark/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Restart Server
        </button>

        <button
          onClick={() => handleAction('stop')}
          disabled={!serverStatus?.isRunning || serverStatus?.status === 'stopping'}
          className="w-full inline-flex items-center justify-center rounded-md bg-red px-4 py-2 text-sm font-medium text-white hover:bg-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
          </svg>
          {serverStatus?.status === 'stopping' ? 'Stopping...' : 'Stop Server'}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 border-t border-stroke pt-4 dark:border-stroke-dark">
        <h4 className="mb-3 text-sm font-medium text-dark dark:text-white">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="inline-flex items-center justify-center rounded-md border border-stroke px-3 py-2 text-xs font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark">
            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Logs
          </button>
          <button className="inline-flex items-center justify-center rounded-md border border-stroke px-3 py-2 text-xs font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark">
            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}