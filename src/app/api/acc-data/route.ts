import { NextRequest, NextResponse } from "next/server";
import { accServerManager } from "@/lib/acc-server-manager";

// Get real ACC server data from the server installation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'all';

    const response: any = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {}
    };

    switch (dataType) {
      case 'session':
        // Get real current session data
        response.data = accServerManager.getRealSessionData();
        break;

      case 'results':
        // Get real race results from results directory
        response.data = {
          recentResults: accServerManager.getRealRaceResults(),
          totalResults: accServerManager.getRealRaceResults().length
        };
        break;

      case 'drivers':
        // Get real driver data from entrylist
        response.data = {
          drivers: accServerManager.getRealDriverData(),
          totalDrivers: accServerManager.getRealDriverData().length
        };
        break;

      case 'status':
        // Get enhanced server status with real data
        response.data = accServerManager.getEnhancedStatus();
        break;

      case 'all':
      default:
        // Get all real ACC server data
        const sessionData = accServerManager.getRealSessionData();
        const raceResults = accServerManager.getRealRaceResults();
        const drivers = accServerManager.getRealDriverData();
        const serverStatus = accServerManager.getEnhancedStatus();

        response.data = {
          session: sessionData,
          results: {
            recent: raceResults.slice(0, 5), // Last 5 races
            total: raceResults.length
          },
          drivers: {
            entries: drivers,
            count: drivers.length
          },
          server: serverStatus,
          summary: {
            serverRunning: serverStatus.isRunning,
            currentTrack: sessionData?.sessionInfo?.track || 'Unknown',
            sessionType: sessionData?.sessionInfo?.sessionType || 'Unknown',
            playersOnline: sessionData?.connectedPlayers || 0,
            totalRaces: raceResults.length,
            registeredDrivers: drivers.length
          }
        };
        break;
    }

    // Add installation validation
    const validation = accServerManager.validateInstallation();
    response.installation = validation;

    // If no real data available, provide fallback information
    if (!response.data || Object.keys(response.data).length === 0) {
      response.data = {
        message: "No real ACC server data available. Server may not be configured or running.",
        fallback: true
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error("Failed to get ACC server data:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to retrieve ACC server data",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Update/refresh ACC server data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'refresh':
        // Force refresh of all cached data
        const refreshedData = {
          session: accServerManager.getRealSessionData(),
          results: accServerManager.getRealRaceResults(),
          drivers: accServerManager.getRealDriverData(),
          status: accServerManager.getEnhancedStatus()
        };

        return NextResponse.json({
          success: true,
          message: "ACC server data refreshed",
          data: refreshedData,
          timestamp: new Date().toISOString()
        });

      case 'validate':
        // Validate ACC installation and data availability
        const validation = accServerManager.validateInstallation();
        const sessionData = accServerManager.getRealSessionData();
        const hasResults = accServerManager.getRealRaceResults().length > 0;
        const hasDrivers = accServerManager.getRealDriverData().length > 0;

        return NextResponse.json({
          success: true,
          validation: {
            ...validation,
            dataAvailability: {
              sessionData: sessionData !== null,
              raceResults: hasResults,
              driverEntries: hasDrivers,
              serverLogs: accServerManager.getLogs(1).length > 0
            }
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action. Use 'refresh' or 'validate'" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Failed to process ACC data request:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process ACC data request",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}