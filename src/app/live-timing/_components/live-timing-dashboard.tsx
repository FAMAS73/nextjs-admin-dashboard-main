"use client";

import { useState, useEffect } from "react";
import { SessionInfo } from "./session-info";
import { TimingTable } from "./timing-table";
import { LiveMap } from "./live-map";
import { SessionHistory } from "./session-history";

interface LiveTimingData {
  sessionInfo: {
    type: "Practice" | "Qualifying" | "Race";
    track: string;
    timeRemaining: number;
    totalTime: number;
    weatherConditions: {
      temperature: number;
      trackTemp: number;
      weather: string;
      windSpeed: number;
    };
  };
  drivers: Array<{
    id: string;
    position: number;
    carNumber: number;
    driverName: string;
    carModel: string;
    currentLapTime?: string;
    bestLapTime?: string;
    lastLapTime?: string;
    gap: string;
    sector1: string;
    sector2: string;
    sector3: string;
    currentSector: number;
    laps: number;
    isInPit: boolean;
    connectionStatus: "Connected" | "Disconnected" | "Spectating";
    trackPosition?: { x: number; y: number; sector: number; speed: number };
  }>;
  trackPositions: Array<{
    driverId: string;
    position: { x: number; y: number };
    sector: number;
    speed: number;
  }>;
}

const DEFAULT_SESSION_DATA: LiveTimingData = {
  sessionInfo: {
    type: "Practice",
    track: "No Session Active",
    timeRemaining: 0,
    totalTime: 0,
    weatherConditions: {
      temperature: 20,
      trackTemp: 25,
      weather: "Clear",
      windSpeed: 0
    }
  },
  drivers: [],
  trackPositions: []
};

export function LiveTimingDashboard() {
  const [liveData, setLiveData] = useState<LiveTimingData>(DEFAULT_SESSION_DATA);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<"timing" | "map" | "history">("timing");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real live data from ACC server
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch('/api/live-data?type=all');
        const result = await response.json();
        
        if (result.success && result.data) {
          const sessionInfo = result.data.sessionInfo || DEFAULT_SESSION_DATA.sessionInfo;
          const drivers = result.data.drivers || [];
          
          // Transform ACC server data to component format
          const transformedDrivers = drivers.map((driver: any, index: number) => ({
            id: driver.id || `driver_${index}`,
            position: driver.position || index + 1,
            carNumber: driver.carNumber || index + 1,
            driverName: driver.driverName || `${driver.firstName || 'Driver'} ${driver.lastName || index + 1}`,
            carModel: driver.carModel || 'Unknown Car',
            currentLapTime: driver.currentLapTime,
            bestLapTime: driver.bestLapTime,
            lastLapTime: driver.lastLapTime,
            gap: driver.gap || (index === 0 ? 'Leader' : `+${index * 2.5}s`),
            sector1: driver.sector1 || '0.000',
            sector2: driver.sector2 || '0.000', 
            sector3: driver.sector3 || '0.000',
            currentSector: driver.currentSector || 1,
            laps: driver.laps || 0,
            isInPit: driver.isInPit || false,
            connectionStatus: driver.connectionStatus || "Connected" as const,
            trackPosition: driver.trackPosition
          }));

          const transformedData: LiveTimingData = {
            sessionInfo: {
              type: sessionInfo.type || "Practice",
              track: sessionInfo.track || "No Session Active",
              timeRemaining: sessionInfo.timeRemaining || 0,
              totalTime: sessionInfo.totalTime || 0,
              weatherConditions: {
                temperature: sessionInfo.weatherConditions?.temperature || 20,
                trackTemp: sessionInfo.weatherConditions?.trackTemp || 25,
                weather: sessionInfo.weatherConditions?.weather || "Clear",
                windSpeed: sessionInfo.weatherConditions?.windSpeed || 0
              }
            },
            drivers: transformedDrivers,
            trackPositions: result.data.trackPositions || transformedDrivers.map(driver => ({
              driverId: driver.id,
              position: driver.trackPosition ? { x: driver.trackPosition.x, y: driver.trackPosition.y } : { x: 0, y: 0 },
              sector: driver.trackPosition?.sector || 1,
              speed: driver.trackPosition?.speed || 0
            }))
          };

          setLiveData(transformedData);
          setIsConnected(result.source === 'real' || transformedDrivers.length > 0);
        } else {
          setLiveData(DEFAULT_SESSION_DATA);
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Failed to fetch live data:', error);
        setLiveData(DEFAULT_SESSION_DATA);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
        setLastUpdate(new Date());
      }
    };

    fetchLiveData();
    
    // Set up real-time updates every 2 seconds
    const interval = setInterval(fetchLiveData, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green animate-pulse' : 'bg-red'}`}></div>
            <span className="text-sm font-medium text-dark dark:text-white">
              {isLoading ? 'Connecting...' : (isConnected ? 'Connected to ACC Server' : 'No Active Session')}
            </span>
          </div>
          <div className="text-xs text-dark-5 dark:text-dark-6">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
          {!isConnected && !isLoading && (
            <div className="text-xs text-dark-4 dark:text-dark-7 bg-yellow-dark/10 px-2 py-1 rounded">
              Start an ACC session to see live data
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedView("timing")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              selectedView === "timing" 
                ? "bg-primary text-white" 
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            Timing
          </button>
          <button
            onClick={() => setSelectedView("map")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              selectedView === "map" 
                ? "bg-primary text-white" 
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            Live Map
          </button>
          <button
            onClick={() => setSelectedView("history")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              selectedView === "history" 
                ? "bg-primary text-white" 
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Session Info */}
      <SessionInfo sessionInfo={liveData.sessionInfo} />

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {selectedView === "timing" && (
          <TimingTable drivers={liveData.drivers} />
        )}
        {selectedView === "map" && (
          <LiveMap 
            drivers={liveData.drivers} 
            trackPositions={liveData.trackPositions}
            track={liveData.sessionInfo.track}
          />
        )}
        {selectedView === "history" && (
          <SessionHistory drivers={liveData.drivers} />
        )}
      </div>
    </div>
  );
}