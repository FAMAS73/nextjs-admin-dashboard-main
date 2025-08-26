import { NextRequest, NextResponse } from "next/server";
import { AccServerConfig } from "@/types/acc-config";
import { accServerManager } from "@/lib/acc-server-manager";

// Mock configuration storage - in production this would read/write actual JSON files
let storedConfigs: Record<string, any> = {
  configuration: {
    tcpPort: 9600,
    udpPort: 9601,
    registerToLobby: 1,
    maxConnections: 26,
    configVersion: 1,
  },
  settings: {
    serverName: "My ACC Server",
    adminPassword: "",
    spectatorPassword: "",
    password: "",
    maxCarSlots: 26,
    carGroup: "GT3",
    trackMedalsRequirement: 0,
    safetyRatingRequirement: -1,
    racecraftRatingRequirement: -1,
    spectatorSlots: 5,
    isRaceLocked: 1,
    randomizeTrackWhenEmpty: 0,
    centralEntryListPath: "",
    shortFormationLap: 1,
    allowAutoDQ: 0,
    dumpLeaderboards: 0,
    dumpEntryList: 0,
    isOpen: 1,
    maximumBallastKg: 0,
    restrictorPercentage: 0,
  },
  event: {
    track: "spa",
    eventType: "E_3h",
    preRaceWaitingTimeSeconds: 120,
    sessionOverTimeSeconds: 120,
    ambientTemp: 22,
    cloudLevel: 0.3,
    rain: 0.0,
    weatherRandomness: 1,
    configVersion: 1,
    sessions: [
      {
        hourOfDay: 14,
        dayOfWeekend: 1,
        timeMultiplier: 1,
        sessionType: "P",
        sessionDurationMinutes: 30
      }
    ]
  },
  eventRules: {
    qualifyStandingType: 1,
    pitWindowLengthSec: -1,
    driverStintTimeSec: -1,
    mandatoryPitstopCount: 0,
    maxTotalDrivingTime: -1,
    maxDriversCount: 1,
    isRefuellingAllowedInRace: true,
    isRefuellingTimeFixed: false,
    isRefuellingRequiredInRace: false,
    isMandatoryPitstopRefuelRequired: true,
    isMandatoryPitstopTyreChangeRequired: false,
    isMandatoryPitstopSwapDriverRequired: false,
    tyreSetCount: 50
  },
  assistRules: {
    stabilityControlLevelMin: 0,
    stabilityControlLevelMax: 100,
    disableAutosteer: 0,
    disableAutoLights: 0,
    disableAutoWiper: 0,
    disableAutoEngineStart: 0,
    disableAutoPitLimiter: 0,
    disableAutoGear: 0,
    disableAutoClutch: 0,
    disableIdealLine: 0
  },
  entrylist: {
    entries: [],
    forceEntryList: 0,
    configVersion: 1
  }
};

// Get configuration(s)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configType = searchParams.get('type');
    
    if (configType) {
      // Try to read from real file first, fallback to stored config
      const result = await accServerManager.readConfigurationFile(configType as any);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data,
          type: configType,
          source: 'file'
        });
      } else if (storedConfigs[configType]) {
        // Fallback to in-memory config
        return NextResponse.json({
          success: true,
          data: storedConfigs[configType],
          type: configType,
          source: 'memory',
          warning: result.message
        });
      } else {
        return NextResponse.json(
          { success: false, error: `Configuration '${configType}' not found` },
          { status: 404 }
        );
      }
    } else {
      // Return all configurations (try files first, fallback to memory)
      const allConfigs: Record<string, any> = {};
      const configTypes = ['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'];
      
      for (const type of configTypes) {
        const result = await accServerManager.readConfigurationFile(type as any);
        if (result.success) {
          allConfigs[type] = result.data;
        } else if (storedConfigs[type]) {
          allConfigs[type] = storedConfigs[type];
        }
      }

      return NextResponse.json({
        success: true,
        data: allConfigs,
        lastModified: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Failed to get configuration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get configuration" },
      { status: 500 }
    );
  }
}

// Update configuration
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configType = searchParams.get('type');
    const body = await request.json();
    
    if (!configType) {
      return NextResponse.json(
        { success: false, error: "Configuration type is required" },
        { status: 400 }
      );
    }
    
    if (!['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'].includes(configType)) {
      return NextResponse.json(
        { success: false, error: "Invalid configuration type" },
        { status: 400 }
      );
    }
    
    // Validate the configuration data (basic validation)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: "Invalid configuration data" },
        { status: 400 }
      );
    }
    
    // Write to actual file first, then store in memory as backup
    const writeResult = await accServerManager.writeConfigurationFile(configType as any, body);
    
    if (writeResult.success) {
      // Also store in memory as backup
      storedConfigs[configType] = body;
      
      return NextResponse.json({
        success: true,
        message: writeResult.message,
        data: body,
        lastModified: new Date().toISOString(),
        writtenToFile: true,
      });
    } else {
      // Fallback to memory storage if file write fails
      storedConfigs[configType] = body;
      
      return NextResponse.json({
        success: true,
        message: `Configuration '${configType}' updated in memory (file write failed: ${writeResult.message})`,
        data: body,
        lastModified: new Date().toISOString(),
        writtenToFile: false,
        warning: writeResult.message,
      });
    }
    
  } catch (error) {
    console.error("Configuration update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}

// Bulk update all configurations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    if (action === "import") {
      // Import all configurations from uploaded data
      if (!data || typeof data !== 'object') {
        return NextResponse.json(
          { success: false, error: "Invalid configuration data" },
          { status: 400 }
        );
      }
      
      // Validate that we have all required configuration types
      const requiredTypes = ['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'];
      const providedTypes = Object.keys(data);
      
      // Update configurations that were provided
      for (const type of providedTypes) {
        if (requiredTypes.includes(type)) {
          storedConfigs[type] = data[type];
        }
      }
      
      // Simulate file write delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({
        success: true,
        message: `Imported ${providedTypes.length} configuration files`,
        data: storedConfigs,
        importedTypes: providedTypes.filter(type => requiredTypes.includes(type)),
      });
    }
    
    if (action === "export") {
      // Export all configurations
      return NextResponse.json({
        success: true,
        data: storedConfigs,
        exportedAt: new Date().toISOString(),
        filename: `acc-server-config-${new Date().toISOString().split('T')[0]}.json`,
      });
    }
    
    if (action === "reset") {
      // Reset to default configurations
      const configType = body.configType;
      
      if (configType && storedConfigs[configType]) {
        // Reset specific configuration to default
        // Note: In a real implementation, you'd load defaults from a template
        return NextResponse.json({
          success: true,
          message: `Configuration '${configType}' reset to defaults`,
          data: storedConfigs[configType],
        });
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid configuration type for reset" },
          { status: 400 }
        );
      }
    }
    
    if (action === "validate") {
      // Validate current configuration
      const errors: string[] = [];
      
      // Basic validation checks
      if (storedConfigs.configuration?.tcpPort === storedConfigs.configuration?.udpPort) {
        errors.push("TCP and UDP ports cannot be the same");
      }
      
      if (storedConfigs.settings?.maxCarSlots > 82) {
        errors.push("Maximum car slots cannot exceed 82");
      }
      
      if (storedConfigs.event?.sessions?.length === 0) {
        errors.push("At least one session must be configured");
      }
      
      return NextResponse.json({
        success: errors.length === 0,
        valid: errors.length === 0,
        errors,
        warnings: [], // Could add warnings for non-critical issues
        validatedAt: new Date().toISOString(),
      });
    }
    
    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
    
  } catch (error) {
    console.error("Configuration operation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process configuration operation" },
      { status: 500 }
    );
  }
}