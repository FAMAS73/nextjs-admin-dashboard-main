import { NextRequest, NextResponse } from "next/server";
import { accServerManager } from "@/lib/acc-server-manager";

// Mock live data - in production this would connect to ACC server via UDP/TCP
let liveSessionData = {
  sessionInfo: {
    type: "Race" as "Practice" | "Qualifying" | "Race",
    track: "Spa-Francorchamps",
    timeRemaining: 2847000, // milliseconds
    totalTime: 3600000, // 1 hour
    weatherConditions: {
      temperature: 22,
      trackTemp: 28,
      weather: "Partly Cloudy",
      windSpeed: 8
    },
    sessionStartTime: new Date(Date.now() - 13 * 60 * 1000), // Started 13 minutes ago
    isActive: true,
  },
  drivers: [
    {
      id: "76561198000001",
      position: 1,
      carNumber: 33,
      driverName: "Max Verstappen",
      carModel: "Audi R8 LMS Evo",
      currentLapTime: "2:18.456",
      bestLapTime: "2:17.891",
      lastLapTime: "2:18.234",
      gap: "Leader",
      sector1: "43.521",
      sector2: "49.876",
      sector3: "44.634",
      currentSector: 2,
      laps: 12,
      isInPit: false,
      connectionStatus: "Connected" as "Connected" | "Disconnected" | "Spectating",
      trackPosition: { x: 25, y: 60, sector: 2, speed: 287 }
    },
    {
      id: "76561198000002",
      position: 2,
      carNumber: 44,
      driverName: "Lewis Hamilton",
      carModel: "Mercedes-AMG GT3",
      currentLapTime: "2:19.123",
      bestLapTime: "2:18.045",
      lastLapTime: "2:18.456",
      gap: "+2.543",
      sector1: "43.789",
      sector2: "50.123",
      sector3: "44.801",
      currentSector: 1,
      laps: 12,
      isInPit: false,
      connectionStatus: "Connected" as "Connected" | "Disconnected" | "Spectating",
      trackPosition: { x: 15, y: 45, sector: 1, speed: 245 }
    },
    {
      id: "76561198000003",
      position: 3,
      carNumber: 16,
      driverName: "Charles Leclerc",
      carModel: "Ferrari 488 GT3 Evo",
      currentLapTime: "2:19.789",
      bestLapTime: "2:18.234",
      lastLapTime: "2:19.012",
      gap: "+5.123",
      sector1: "43.956",
      sector2: "50.234",
      sector3: "45.012",
      currentSector: 3,
      laps: 12,
      isInPit: false,
      connectionStatus: "Connected" as "Connected" | "Disconnected" | "Spectating",
      trackPosition: { x: 70, y: 30, sector: 3, speed: 198 }
    }
  ],
  serverStats: {
    connectedDrivers: 3,
    maxDrivers: 26,
    spectators: 0,
    maxSpectators: 5,
    serverLoad: 15.6, // CPU usage percentage
    networkIn: 125, // KB/s
    networkOut: 89, // KB/s
    memoryUsage: 1024, // MB
  }
};

// Simulate live data updates
const updateLiveData = () => {
  // Update session time
  if (liveSessionData.sessionInfo.isActive && liveSessionData.sessionInfo.timeRemaining > 0) {
    liveSessionData.sessionInfo.timeRemaining = Math.max(0, liveSessionData.sessionInfo.timeRemaining - 1000);
  }

  // Update driver data
  liveSessionData.drivers.forEach(driver => {
    // Update current lap times (simulate ongoing laps)
    if (!driver.isInPit) {
      const baseTime = parseFloat(driver.bestLapTime?.replace(':', '') || '217891');
      const variation = (Math.random() - 0.5) * 2000; // ±1 second variation
      const newTime = baseTime + variation;
      const minutes = Math.floor(newTime / 60000);
      const seconds = ((newTime % 60000) / 1000).toFixed(3);
      driver.currentLapTime = `${minutes}:${seconds.padStart(6, '0')}`;
    }

    // Update track positions
    if (driver.trackPosition) {
      driver.trackPosition.x = Math.max(5, Math.min(95, driver.trackPosition.x + (Math.random() - 0.5) * 3));
      driver.trackPosition.y = Math.max(5, Math.min(95, driver.trackPosition.y + (Math.random() - 0.5) * 3));
      
      if (!driver.isInPit) {
        driver.trackPosition.speed = Math.max(150, Math.min(320, driver.trackPosition.speed + (Math.random() - 0.5) * 15));
      } else {
        driver.trackPosition.speed = Math.max(0, Math.min(80, Math.random() * 50));
      }
    }

    // Randomly put drivers in/out of pit
    if (Math.random() < 0.005) { // 0.5% chance per update
      driver.isInPit = !driver.isInPit;
      if (driver.isInPit) {
        driver.currentLapTime = "PIT";
      }
    }
  });

  // Update server stats
  liveSessionData.serverStats.serverLoad = Math.max(5, Math.min(50, liveSessionData.serverStats.serverLoad + (Math.random() - 0.5) * 2));
  liveSessionData.serverStats.networkIn = Math.max(50, Math.min(200, liveSessionData.serverStats.networkIn + (Math.random() - 0.5) * 10));
  liveSessionData.serverStats.networkOut = Math.max(30, Math.min(150, liveSessionData.serverStats.networkOut + (Math.random() - 0.5) * 8));
  liveSessionData.serverStats.memoryUsage = Math.max(800, Math.min(1500, liveSessionData.serverStats.memoryUsage + (Math.random() - 0.5) * 20));
};

// Update live data every second
let updateInterval: NodeJS.Timeout | null = null;

const startLiveDataUpdates = () => {
  if (updateInterval) return;
  
  updateInterval = setInterval(updateLiveData, 1000);
};

const stopLiveDataUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

// Start updates when the module loads
startLiveDataUpdates();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'all';
    
    // Try to get real ACC server data first
    const realSessionData = accServerManager.getRealSessionData();
    const useRealData = realSessionData && realSessionData.sessionInfo;
    
    // If no real data available, use mock data
    if (!useRealData) {
      startLiveDataUpdates();
    }
    
    switch (dataType) {
      case 'session':
        const sessionData = useRealData ? realSessionData.sessionInfo : liveSessionData.sessionInfo;
        return NextResponse.json({
          success: true,
          data: sessionData,
          source: useRealData ? 'real' : 'mock',
          timestamp: new Date().toISOString(),
        });
        
      case 'drivers':
        const driversData = useRealData ? accServerManager.getRealDriverData() : [];
        return NextResponse.json({
          success: true,
          data: driversData,
          source: useRealData ? 'real' : 'mock',
          timestamp: new Date().toISOString(),
        });
        
      case 'positions':
        const positionData = useRealData ? accServerManager.getRealDriverData().map((driver, index) => ({
          driverId: driver.steamId || driver.driverGuid || `driver_${index}`,
          carNumber: driver.raceNumber || index + 1,
          driverName: driver.firstName + ' ' + driver.lastName,
          position: index + 1,
          trackPosition: { x: 0, y: 0, sector: 1, speed: 0 }
        })) : [];
        return NextResponse.json({
          success: true,
          data: positionData,
          source: useRealData ? 'real' : 'mock',
          timestamp: new Date().toISOString(),
        });
        
      case 'stats':
        return NextResponse.json({
          success: true,
          data: liveSessionData.serverStats,
          timestamp: new Date().toISOString(),
        });
        
      case 'all':
      default:
        return NextResponse.json({
          success: true,
          data: liveSessionData,
          timestamp: new Date().toISOString(),
        });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get live data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === "start") {
      startLiveDataUpdates();
      liveSessionData.sessionInfo.isActive = true;
      
      return NextResponse.json({
        success: true,
        message: "Live data updates started",
      });
    }
    
    if (action === "stop") {
      stopLiveDataUpdates();
      liveSessionData.sessionInfo.isActive = false;
      
      return NextResponse.json({
        success: true,
        message: "Live data updates stopped",
      });
    }
    
    if (action === "reset") {
      // Reset session data
      liveSessionData.sessionInfo.timeRemaining = liveSessionData.sessionInfo.totalTime;
      liveSessionData.sessionInfo.sessionStartTime = new Date();
      liveSessionData.drivers.forEach((driver, index) => {
        driver.laps = 0;
        driver.position = index + 1;
        driver.gap = index === 0 ? "Leader" : `+${(index * 2.5).toFixed(3)}`;
        driver.isInPit = false;
        driver.currentLapTime = "0:00.000";
      });
      
      return NextResponse.json({
        success: true,
        message: "Session data reset",
        data: liveSessionData,
      });
    }
    
    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}