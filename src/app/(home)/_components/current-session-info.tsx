"use client";

import { useState, useEffect } from "react";

interface CarPosition {
  id: string;
  driverName: string;
  carNumber: number;
  position: { x: number; y: number }; // Percentage coordinates on track
  sector: number;
}

interface SessionData {
  sessionInfo: {
    type: string;
    track: string;
    timeRemaining: number;
    totalTime: number;
    isActive: boolean;
    weatherConditions: {
      temperature: number;
      trackTemp: number;
      weather: string;
      windSpeed: number;
    };
  } | null;
  drivers: Array<{
    id: string;
    driverName: string;
    carNumber: number;
    trackPosition?: { x: number; y: number; sector: number; speed: number };
  }>;
}

function getTrackLayout(trackKey: string): { path: string; sectors: Array<{x: number, y: number, label: string}> } {
  const trackLayouts: Record<string, { path: string; sectors: Array<{x: number, y: number, label: string}> }> = {
    spa: {
      path: "M50 150 C70 120, 100 100, 130 80 C160 60, 190 50, 220 60 C240 70, 250 90, 240 110 C230 130, 200 140, 180 150 C160 160, 140 170, 120 160 C100 150, 80 140, 70 160 C60 180, 70 200, 50 150",
      sectors: [
        { x: 130, y: 80, label: "S1" },
        { x: 240, y: 110, label: "S2" }
      ]
    },
    monza: {
      path: "M50 100 L200 100 C220 100, 230 110, 230 130 L230 170 C230 190, 220 200, 200 200 L70 200 C50 200, 40 190, 40 170 L40 130 C40 110, 50 100, 50 100",
      sectors: [
        { x: 125, y: 100, label: "S1" },
        { x: 230, y: 150, label: "S2" }
      ]
    },
    silverstone: {
      path: "M60 140 C80 120, 120 100, 160 120 C200 140, 220 160, 200 180 C180 200, 140 190, 120 170 C100 150, 90 140, 110 130 C130 120, 150 130, 170 140 C190 150, 180 160, 160 150 C140 140, 120 150, 100 160 C80 170, 60 160, 60 140",
      sectors: [
        { x: 160, y: 120, label: "S1" },
        { x: 170, y: 140, label: "S2" }
      ]
    },
    nurburgring: {
      path: "M80 150 C100 130, 140 120, 180 140 C200 150, 210 170, 190 180 C170 190, 150 180, 130 170 C110 160, 100 150, 120 140 C140 130, 160 140, 180 150 C200 160, 190 170, 170 160 C150 150, 130 160, 110 170 C90 180, 80 170, 80 150",
      sectors: [
        { x: 180, y: 140, label: "S1" },
        { x: 180, y: 150, label: "S2" }
      ]
    },
    imola: {
      path: "M70 140 C90 120, 130 110, 170 130 C190 140, 200 160, 180 170 C160 180, 140 170, 120 160 C100 150, 90 140, 110 135 C130 130, 150 135, 170 140 C185 145, 175 155, 160 150 C145 145, 130 150, 115 155 C100 160, 85 155, 70 140",
      sectors: [
        { x: 170, y: 130, label: "S1" },
        { x: 170, y: 140, label: "S2" }
      ]
    },
    brands_hatch: {
      path: "M80 140 C100 120, 140 115, 180 135 C200 145, 210 165, 190 175 C170 185, 150 175, 130 165 C110 155, 100 145, 120 140 C140 135, 160 140, 180 145 C195 150, 185 160, 170 155 C155 150, 140 155, 125 160 C110 165, 95 160, 80 140",
      sectors: [
        { x: 180, y: 135, label: "S1" },
        { x: 180, y: 145, label: "S2" }
      ]
    }
  };
  
  return trackLayouts[trackKey] || trackLayouts.spa;
}

export function CurrentSessionInfo() {
  const [showCarPositions, setShowCarPositions] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData>({
    sessionInfo: null,
    drivers: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const trackKey = sessionData.sessionInfo?.track?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'spa';
  const trackLayout = getTrackLayout(trackKey);
  
  const trackNames: Record<string, string> = {
    spa: "Spa-Francorchamps",
    "spa-francorchamps": "Spa-Francorchamps", 
    monza: "Monza",
    silverstone: "Silverstone",
    nurburgring: "Nürburgring",
    imola: "Imola",
    brands_hatch: "Brands Hatch"
  };

  // Get track display name
  const getTrackDisplayName = (track: string) => {
    const key = track?.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return trackNames[key] || track || 'Unknown Track';
  };

  // Fetch real session data
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch('/api/live-data?type=all');
        const result = await response.json();
        
        if (result.success && result.data) {
          setSessionData({
            sessionInfo: result.data.sessionInfo,
            drivers: result.data.drivers || []
          });
        } else {
          setSessionData({
            sessionInfo: null,
            drivers: []
          });
        }
      } catch (error) {
        console.error('Failed to fetch session data:', error);
        setSessionData({
          sessionInfo: null,
          drivers: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
    
    // Update every 3 seconds
    const interval = setInterval(fetchSessionData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Transform drivers to car positions
  const carPositions: CarPosition[] = sessionData.drivers
    .filter(driver => driver.trackPosition)
    .map(driver => ({
      id: driver.id,
      driverName: driver.driverName,
      carNumber: driver.carNumber,
      position: { 
        x: driver.trackPosition!.x, 
        y: driver.trackPosition!.y 
      },
      sector: driver.trackPosition!.sector
    }));

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Current Session
        </h3>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${
          sessionData.sessionInfo?.isActive 
            ? 'bg-green/10 text-green' 
            : 'bg-gray/10 text-gray'
        }`}>
          {isLoading 
            ? 'Loading...' 
            : sessionData.sessionInfo?.isActive 
              ? `${sessionData.sessionInfo.type} Active`
              : 'No Active Session'
          }
        </span>
      </div>

      {/* Main Session Info Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Session Details */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-dark-4 dark:text-dark-7">Track</p>
              <div className="flex items-center space-x-2">
                <p className="text-lg font-semibold text-dark dark:text-white">
                  {sessionData.sessionInfo ? getTrackDisplayName(sessionData.sessionInfo.track) : 'No Track Selected'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-dark-4 dark:text-dark-7">Weather</p>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                </svg>
                <p className="text-sm font-semibold text-dark dark:text-white">
                  {sessionData.sessionInfo?.weatherConditions?.weather || 'Clear'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-dark-4 dark:text-dark-7">Temperature</p>
              <div className="flex items-center space-x-1">
                <p className="text-lg font-semibold text-dark dark:text-white">
                  {sessionData.sessionInfo?.weatherConditions?.temperature || 20}°C
                </p>
                <span className="text-xs text-dark-4 dark:text-dark-7">
                  Track: {sessionData.sessionInfo?.weatherConditions?.trackTemp || 25}°C
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-dark-4 dark:text-dark-7">Session Type</p>
              <p className="text-lg font-semibold text-dark dark:text-white">
                {sessionData.sessionInfo?.type || 'No Session'}
              </p>
            </div>
          </div>

          {/* Session Progress */}
          <div className="mt-4 rounded-lg bg-gray-1 p-4 dark:bg-dark-2">
            <p className="mb-2 text-sm font-medium text-dark dark:text-white">Session Progress</p>
            {sessionData.sessionInfo && sessionData.sessionInfo.totalTime > 0 ? (
              <>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-dark-4 dark:text-dark-7">
                    {Math.floor(sessionData.sessionInfo.timeRemaining / 60000)}:{String(Math.floor((sessionData.sessionInfo.timeRemaining % 60000) / 1000)).padStart(2, '0')} remaining
                  </span>
                  <span className="text-dark-4 dark:text-dark-7">
                    {Math.round(((sessionData.sessionInfo.totalTime - sessionData.sessionInfo.timeRemaining) / sessionData.sessionInfo.totalTime) * 100)}% complete
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-3 dark:bg-dark-4">
                  <div 
                    className="h-2 rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${((sessionData.sessionInfo.totalTime - sessionData.sessionInfo.timeRemaining) / sessionData.sessionInfo.totalTime) * 100}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <div className="text-center text-dark-4 dark:text-dark-7 py-4">
                No active session
              </div>
            )}
          </div>
        </div>

        {/* Track Layout & Live Positions */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium text-dark dark:text-white">Track Layout</h4>
            <button
              onClick={() => setShowCarPositions(!showCarPositions)}
              className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20 transition-colors"
            >
              {showCarPositions ? "Hide Cars" : "Show Cars"}
            </button>
          </div>
          
          <div className="relative flex-1 min-h-[200px] rounded-lg bg-gray-1 dark:bg-dark-2 p-4">
            {/* Track Layout */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-full h-full max-w-[300px] max-h-[200px] text-dark-3 dark:text-dark-6" 
                  fill="none" 
                  viewBox="0 0 300 200"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  {/* Dynamic track outline */}
                  <path 
                    d={trackLayout.path}
                    fill="none"
                  />
                  
                  {/* Start/Finish line */}
                  <line x1="50" y1="140" x2="50" y2="160" stroke="currentColor" strokeWidth="4" />
                  <text x="35" y="155" className="text-xs fill-current">S/F</text>
                  
                  {/* Dynamic sector markers */}
                  {trackLayout.sectors.map((sector, index) => (
                    <g key={index}>
                      <circle cx={sector.x} cy={sector.y} r="3" fill="yellow" />
                      <text x={sector.x - 5} y={sector.y - 5} className="text-xs fill-current">{sector.label}</text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Live Car Positions */}
              {showCarPositions && carPositions.map((car) => (
                <div
                  key={car.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{ 
                    left: `${car.position.x}%`, 
                    top: `${car.position.y}%` 
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white animate-pulse"
                      title={`${car.driverName} (#${car.carNumber})`}
                    >
                      {car.carNumber}
                    </div>
                    <div className="mt-1 px-1 py-0.5 bg-black/75 text-white text-[8px] rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      {car.driverName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Driver List */}
          {showCarPositions && carPositions.length > 0 && (
            <div className="mt-3 space-y-1">
              <h5 className="text-xs font-medium text-dark-4 dark:text-dark-7">Live Positions ({carPositions.length} drivers)</h5>
              <div className="flex flex-wrap gap-2">
                {carPositions.slice(0, 4).map((car, index) => (
                  <div key={car.id} className="flex items-center space-x-1 text-xs">
                    <span className="text-dark-4 dark:text-dark-7">P{index + 1}</span>
                    <div className="w-3 h-3 rounded-full bg-primary text-white flex items-center justify-center text-[8px]">
                      {car.carNumber}
                    </div>
                    <span className="text-dark dark:text-white truncate max-w-16">
                      {car.driverName.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* No drivers message */}
          {showCarPositions && carPositions.length === 0 && !isLoading && (
            <div className="mt-3 text-center text-xs text-dark-4 dark:text-dark-7 py-2">
              No live positions available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}