import { ServerStatus } from "@/types/acc-config";

async function getServerStatus(): Promise<ServerStatus> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/live-data?type=all`, {
      cache: 'no-store'
    });
    const result = await response.json();
    
    if (result.success && result.data) {
      const data = result.data;
      const sessionInfo = data.sessionInfo;
      const serverStats = data.serverStats;
      
      return {
        isOnline: sessionInfo?.isActive || result.source === 'real' || false,
        uptime: Math.floor(Date.now() / 1000 - new Date(sessionInfo?.sessionStartTime || Date.now()).getTime() / 1000),
        currentSession: sessionInfo ? {
          type: sessionInfo.type === 'Practice' ? 'P' : sessionInfo.type === 'Qualifying' ? 'Q' : 'R',
          track: sessionInfo.track || 'Unknown',
          timeRemaining: sessionInfo.timeRemaining || 0,
          sessionStartTime: new Date(sessionInfo.sessionStartTime || Date.now())
        } : null,
        connectedDrivers: data.drivers?.length || serverStats?.connectedDrivers || 0,
        maxDrivers: serverStats?.maxDrivers || 26,
        spectators: serverStats?.spectators || 0,
      };
    }
  } catch (error) {
    console.error('Failed to fetch server status:', error);
  }
  
  // Return default offline status
  return {
    isOnline: false,
    uptime: 0,
    currentSession: null,
    connectedDrivers: 0,
    maxDrivers: 26,
    spectators: 0,
  };
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatTimeRemaining(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getTrackDisplayName(trackKey: string): string {
  const trackNames: Record<string, string> = {
    spa: "Spa-Francorchamps",
    "Spa-Francorchamps": "Spa-Francorchamps",
    monza: "Monza",
    silverstone: "Silverstone",
    nurburgring: "Nürburgring",
    // Add more track mappings as needed
  };
  return trackNames[trackKey] || trackKey.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getSessionTypeDisplayName(type: string): string {
  const sessionTypes: Record<string, string> = {
    P: "Practice",
    Q: "Qualifying", 
    R: "Race",
    Practice: "Practice",
    Qualifying: "Qualifying",
    Race: "Race"
  };
  return sessionTypes[type] || type;
}

export async function ServerStatusCards() {
  const status = await getServerStatus();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Server Status */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Server Status</p>
            <p className="text-2xl font-bold text-dark dark:text-white">
              {status.isOnline ? "Online" : "Offline"}
            </p>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Uptime: {formatUptime(status.uptime)}
            </p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
            status.isOnline ? "bg-green/10" : "bg-red/10"
          }`}>
            <div className={`h-3 w-3 rounded-full ${
              status.isOnline ? "bg-green animate-pulse" : "bg-red"
            }`} />
          </div>
        </div>
      </div>

      {/* Current Session */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Current Session</p>
            {status.currentSession ? (
              <>
                <p className="text-2xl font-bold text-dark dark:text-white">
                  {getSessionTypeDisplayName(status.currentSession.type)}
                </p>
                <p className="text-sm text-dark-5 dark:text-dark-6">
                  {getTrackDisplayName(status.currentSession.track)}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-dark-5 dark:text-dark-6">No Active Session</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue/10">
            <svg className="h-6 w-6 text-blue" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25zM2.75 12a9.25 9.25 0 1118.5 0 9.25 9.25 0 01-18.5 0z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.69l3.22 3.22a.75.75 0 11-1.06 1.06L11.47 12.28a.75.75 0 01-.22-.53V6a.75.75 0 01.75-.75z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Connected Drivers */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Connected Drivers</p>
            <p className="text-2xl font-bold text-dark dark:text-white">
              {status.connectedDrivers}/{status.maxDrivers}
            </p>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              {status.spectators} spectators
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Time Remaining */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Time Remaining</p>
            {status.currentSession ? (
              <>
                <p className="text-2xl font-bold text-dark dark:text-white">
                  {formatTimeRemaining(status.currentSession.timeRemaining)}
                </p>
                <p className="text-sm text-dark-5 dark:text-dark-6">Session time</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-dark-5 dark:text-dark-6">--:--</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-dark/10">
            <svg className="h-6 w-6 text-yellow-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}