import { NextRequest, NextResponse } from "next/server";
import { AccConfigPreset } from "@/types/acc-config";
import { createServerSupabaseClient } from '@/lib/supabase';

// Legacy mock presets for fallback - will migrate to Supabase
const legacyPresets: AccConfigPreset[] = [
  {
    id: "preset-1",
    name: "Beginner Friendly Sprint",
    description: "Perfect for newcomers to ACC with driving assists and shorter races",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-22"),
    userId: "admin",
    isPublic: true,
    tags: ["beginner", "sprint", "assists"],
    config: {
      configuration: {
        tcpPort: 9600,
        udpPort: 9601,
        registerToLobby: 1,
        maxConnections: 26,
        configVersion: 1
      },
      settings: {
        serverName: "Beginner Friendly Sprint Server",
        adminPassword: "",
        spectatorPassword: "",
        password: "",
        maxCarSlots: 20,
        carGroup: "GT3",
        trackMedalsRequirement: 0,
        safetyRatingRequirement: -1,
        racecraftRatingRequirement: -1,
        spectatorSlots: 5,
        isRaceLocked: 0,
        randomizeTrackWhenEmpty: 1,
        centralEntryListPath: "",
        shortFormationLap: 1,
        allowAutoDQ: 0,
        dumpLeaderboards: 1,
        dumpEntryList: 1,
        isOpen: 1,
        maximumBallastKg: 0,
        restrictorPercentage: 0
      },
      event: {
        track: "silverstone",
        eventType: "Sprint",
        preRaceWaitingTimeSeconds: 30,
        sessionOverTimeSeconds: 60,
        ambientTemp: 25,
        cloudLevel: 0.1,
        rain: 0.0,
        weatherRandomness: 1,
        configVersion: 1,
        sessions: [
          {
            hourOfDay: 14,
            dayOfWeekend: 2,
            timeMultiplier: 1,
            sessionType: "P",
            sessionDurationMinutes: 15
          },
          {
            hourOfDay: 15,
            dayOfWeekend: 2,
            timeMultiplier: 1,
            sessionType: "Q",
            sessionDurationMinutes: 10
          },
          {
            hourOfDay: 16,
            dayOfWeekend: 2,
            timeMultiplier: 1,
            sessionType: "R",
            sessionDurationMinutes: 20
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
        isRefuellingTimeFixed: true,
        isRefuellingRequiredInRace: false,
        isMandatoryPitstopRefuelRequired: false,
        isMandatoryPitstopTyreChangeRequired: false,
        isMandatoryPitstopSwapDriverRequired: false,
        tyreSetCount: 50
      },
      assistRules: {
        stabilityControlLevelMin: 0,
        stabilityControlLevelMax: 100,
        disableAutosteer: 0,
        disableAutoLights: 2, // Forced ON
        disableAutoWiper: 2, // Forced ON
        disableAutoEngineStart: 2, // Forced ON
        disableAutoPitLimiter: 2, // Forced ON
        disableAutoGear: 0,
        disableAutoClutch: 0,
        disableIdealLine: 0
      },
      entrylist: {
        entries: [],
        forceEntryList: 0,
        configVersion: 1
      }
    }
  },
  {
    id: "preset-2",
    name: "Competitive Endurance",
    description: "3-hour endurance racing with mandatory pit stops and limited assists",
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date("2025-01-23"),
    userId: "admin",
    isPublic: true,
    tags: ["endurance", "competitive", "no-assists"],
    config: {
      configuration: {
        tcpPort: 9600,
        udpPort: 9601,
        registerToLobby: 1,
        maxConnections: 32,
        configVersion: 1
      },
      settings: {
        serverName: "Competitive Endurance Championship",
        adminPassword: "",
        spectatorPassword: "",
        password: "racing123",
        maxCarSlots: 30,
        carGroup: "GT3",
        trackMedalsRequirement: 2, // Silver or higher
        safetyRatingRequirement: 75,
        racecraftRatingRequirement: 65,
        spectatorSlots: 10,
        isRaceLocked: 1,
        randomizeTrackWhenEmpty: 0,
        centralEntryListPath: "",
        shortFormationLap: 0,
        allowAutoDQ: 1,
        dumpLeaderboards: 1,
        dumpEntryList: 1,
        isOpen: 0,
        maximumBallastKg: 20,
        restrictorPercentage: 2
      },
      event: {
        track: "spa",
        eventType: "E_3h",
        preRaceWaitingTimeSeconds: 180,
        sessionOverTimeSeconds: 300,
        ambientTemp: 18,
        cloudLevel: 0.6,
        rain: 0.2,
        weatherRandomness: 4,
        configVersion: 1,
        sessions: [
          {
            hourOfDay: 10,
            dayOfWeekend: 1,
            timeMultiplier: 3,
            sessionType: "P",
            sessionDurationMinutes: 90
          },
          {
            hourOfDay: 14,
            dayOfWeekend: 2,
            timeMultiplier: 1,
            sessionType: "Q",
            sessionDurationMinutes: 20
          },
          {
            hourOfDay: 15,
            dayOfWeekend: 2,
            timeMultiplier: 5,
            sessionType: "R",
            sessionDurationMinutes: 180
          }
        ]
      },
      eventRules: {
        qualifyStandingType: 1,
        pitWindowLengthSec: 3600, // 1 hour pit window
        driverStintTimeSec: 3600, // 1 hour max stint
        mandatoryPitstopCount: 2,
        maxTotalDrivingTime: 7200, // 2 hours max per driver
        maxDriversCount: 2,
        isRefuellingAllowedInRace: true,
        isRefuellingTimeFixed: false,
        isRefuellingRequiredInRace: true,
        isMandatoryPitstopRefuelRequired: true,
        isMandatoryPitstopTyreChangeRequired: true,
        isMandatoryPitstopSwapDriverRequired: false,
        tyreSetCount: 3
      },
      assistRules: {
        stabilityControlLevelMin: 0,
        stabilityControlLevelMax: 15,
        disableAutosteer: 1, // Forbidden
        disableAutoLights: 0,
        disableAutoWiper: 0,
        disableAutoEngineStart: 0,
        disableAutoPitLimiter: 0,
        disableAutoGear: 0,
        disableAutoClutch: 0,
        disableIdealLine: 1 // Forbidden
      },
      entrylist: {
        entries: [],
        forceEntryList: 1,
        configVersion: 1
      }
    }
  },
  {
    id: "preset-3",
    name: "GT4 Championship",
    description: "GT4 class racing with balanced performance and medium assists",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-24"),
    userId: "admin",
    isPublic: true,
    tags: ["gt4", "championship", "balanced"],
    config: {
      configuration: {
        tcpPort: 9600,
        udpPort: 9601,
        registerToLobby: 1,
        maxConnections: 24,
        configVersion: 1
      },
      settings: {
        serverName: "GT4 Championship Series",
        adminPassword: "",
        spectatorPassword: "",
        password: "",
        maxCarSlots: 24,
        carGroup: "GT4",
        trackMedalsRequirement: 1, // Bronze or higher
        safetyRatingRequirement: 50,
        racecraftRatingRequirement: 40,
        spectatorSlots: 6,
        isRaceLocked: 1,
        randomizeTrackWhenEmpty: 0,
        centralEntryListPath: "",
        shortFormationLap: 1,
        allowAutoDQ: 0,
        dumpLeaderboards: 1,
        dumpEntryList: 1,
        isOpen: 1,
        maximumBallastKg: 30,
        restrictorPercentage: 5
      },
      event: {
        track: "brands_hatch",
        eventType: "Championship",
        preRaceWaitingTimeSeconds: 120,
        sessionOverTimeSeconds: 180,
        ambientTemp: 20,
        cloudLevel: 0.3,
        rain: 0.0,
        weatherRandomness: 2,
        configVersion: 1,
        sessions: [
          {
            hourOfDay: 13,
            dayOfWeekend: 2,
            timeMultiplier: 2,
            sessionType: "P",
            sessionDurationMinutes: 45
          },
          {
            hourOfDay: 15,
            dayOfWeekend: 2,
            timeMultiplier: 1,
            sessionType: "Q",
            sessionDurationMinutes: 20
          },
          {
            hourOfDay: 16,
            dayOfWeekend: 2,
            timeMultiplier: 2,
            sessionType: "R",
            sessionDurationMinutes: 45
          }
        ]
      },
      eventRules: {
        qualifyStandingType: 1,
        pitWindowLengthSec: -1,
        driverStintTimeSec: -1,
        mandatoryPitstopCount: 1,
        maxTotalDrivingTime: -1,
        maxDriversCount: 1,
        isRefuellingAllowedInRace: true,
        isRefuellingTimeFixed: false,
        isRefuellingRequiredInRace: false,
        isMandatoryPitstopRefuelRequired: false,
        isMandatoryPitstopTyreChangeRequired: true,
        isMandatoryPitstopSwapDriverRequired: false,
        tyreSetCount: 5
      },
      assistRules: {
        stabilityControlLevelMin: 0,
        stabilityControlLevelMax: 50,
        disableAutosteer: 1, // Forbidden
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
    }
  }
];

// GET - Retrieve presets from Supabase (FR-07, FR-08)
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const presetId = searchParams.get('id');
  const includePublic = searchParams.get('public') === 'true';
  
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Return only public presets for unauthenticated users
      if (includePublic || presetId) {
        let query = supabase
          .from('configuration_presets')
          .select('*')
          .eq('is_public', true);
          
        if (presetId) {
          query = query.eq('id', presetId).single();
          const { data: preset, error } = await query;
          
          if (error || !preset) {
            return NextResponse.json(
              { success: false, error: "Preset not found" },
              { status: 404 }
            );
          }
          
          return NextResponse.json({
            success: true,
            data: preset,
          });
        } else {
          const { data: presets, error } = await query.order('created_at', { ascending: false });
          
          return NextResponse.json({
            success: true,
            data: presets || [],
            total: presets?.length || 0,
          });
        }
      }
      
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (presetId) {
      // Get specific preset (user's own or public)
      const { data: preset, error } = await supabase
        .from('configuration_presets')
        .select('*')
        .or(`id.eq.${presetId}`)
        .or(`created_by.eq.${user.id},is_public.eq.true`)
        .single();

      if (error || !preset) {
        return NextResponse.json(
          { success: false, error: "Preset not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: preset,
      });
    }
    
    // Get user's presets + public presets if requested
    let query = supabase
      .from('configuration_presets')
      .select('*')
      .order('created_at', { ascending: false });

    if (includePublic) {
      query = query.or(`created_by.eq.${user.id},is_public.eq.true`);
    } else {
      query = query.eq('created_by', user.id);
    }

    const { data: presets, error } = await query;
    
    if (error) {
      console.error('Presets fetch error:', error);
      return NextResponse.json(
        { success: false, error: "Failed to get presets" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: presets || [],
      total: presets?.length || 0,
    });
    
  } catch (error) {
    console.error('Presets API error:', error);
    return NextResponse.json(
      { success: false, error: "Failed to get presets" },
      { status: 500 }
    );
  }
}

// POST - Create new preset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, config, userId, isPublic, tags } = body;
    
    if (!name || !config || !userId) {
      return NextResponse.json(
        { success: false, error: "Name, config, and userId are required" },
        { status: 400 }
      );
    }
    
    // Validate config structure
    const requiredConfigKeys = ['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'];
    const configKeys = Object.keys(config);
    const missingKeys = requiredConfigKeys.filter(key => !configKeys.includes(key));
    
    if (missingKeys.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing configuration sections: ${missingKeys.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create new preset
    const newPreset: AccConfigPreset = {
      id: `preset-${Date.now()}`,
      name,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      config,
      userId,
      isPublic: isPublic || false,
      tags: tags || [],
    };
    
    configPresets.push(newPreset);
    
    return NextResponse.json({
      success: true,
      message: "Preset created successfully",
      data: newPreset,
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create preset" },
      { status: 500 }
    );
  }
}

// PUT - Update preset
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const presetId = searchParams.get('id');
    
    if (!presetId) {
      return NextResponse.json(
        { success: false, error: "Preset ID is required" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, description, config, isPublic, tags } = body;
    
    const presetIndex = configPresets.findIndex(p => p.id === presetId);
    if (presetIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Preset not found" },
        { status: 404 }
      );
    }
    
    // Update preset
    const preset = configPresets[presetIndex];
    if (name) preset.name = name;
    if (description !== undefined) preset.description = description;
    if (config) preset.config = config;
    if (isPublic !== undefined) preset.isPublic = isPublic;
    if (tags) preset.tags = tags;
    preset.updatedAt = new Date();
    
    return NextResponse.json({
      success: true,
      message: "Preset updated successfully",
      data: preset,
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update preset" },
      { status: 500 }
    );
  }
}

// DELETE - Delete preset
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const presetId = searchParams.get('id');
    
    if (!presetId) {
      return NextResponse.json(
        { success: false, error: "Preset ID is required" },
        { status: 400 }
      );
    }
    
    const presetIndex = configPresets.findIndex(p => p.id === presetId);
    if (presetIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Preset not found" },
        { status: 404 }
      );
    }
    
    const deletedPreset = configPresets.splice(presetIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      message: "Preset deleted successfully",
      data: deletedPreset,
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete preset" },
      { status: 500 }
    );
  }
}