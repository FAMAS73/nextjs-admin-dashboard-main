import { NextRequest, NextResponse } from "next/server";
import { accServerManager } from "@/lib/acc-server-manager";

// Get system information and setup instructions
export async function GET(request: NextRequest) {
  try {
    // Get ACC server installation validation
    const validation = accServerManager.validateInstallation();
    
    // Get server paths
    const paths = accServerManager.getServerPaths();
    
    // Check for real data availability
    const sessionData = accServerManager.getRealSessionData();
    const raceResults = accServerManager.getRealRaceResults();
    const drivers = accServerManager.getRealDriverData();
    
    const systemInfo = {
      accServerManager: {
        installation: validation,
        paths,
        dataAvailability: {
          sessionData: sessionData !== null,
          raceResults: raceResults.length > 0,
          drivers: drivers.length > 0,
          serverLogs: accServerManager.getLogs(1).length > 0
        }
      },
      environment: {
        accServerPath: process.env.ACC_SERVER_PATH || 'Not configured',
        nodeEnv: process.env.NODE_ENV || 'development'
      },
      setup: {
        instructions: [
          "1. Set ACC_SERVER_PATH environment variable to your ACC server directory",
          "2. Example: ACC_SERVER_PATH=Z:\\SteamLibrary\\steamapps\\common\\Assetto Corsa Competizione Dedicated Server\\server",
          "3. Configure your ACC server using the web interface at /server-config",
          "4. Start your ACC server using the controls at /server-control",
          "5. View real-time data at /live-timing and /server-control",
          "6. Race results will appear in /race-results after completing sessions"
        ],
        requiredPaths: [
          "cfg/ - Configuration files (configuration.json, settings.json, event.json, etc.)",
          "log/ - Server log files",
          "results/ - Race result files (generated after sessions)",
          "accServer.exe - ACC server executable"
        ]
      },
      features: {
        available: [
          "Real ACC server process control (start/stop/restart)",
          "Configuration management (all 6 JSON config files)", 
          "Configuration presets (save/load complete configurations)",
          "Live server monitoring and log viewing",
          "Real session data reading from event.json",
          "Race results from results/ directory",
          "Driver data from entrylist.json",
          "Steam authentication with Supabase",
          "Community features (leaderboards, race schedule)"
        ],
        dataSource: validation.isValid ? "Real ACC server data when available, mock data as fallback" : "Mock data only (ACC server not configured)"
      }
    };

    return NextResponse.json({
      success: true,
      message: "ACC Server Manager - System Information",
      data: systemInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Failed to get system info:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get system information",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}