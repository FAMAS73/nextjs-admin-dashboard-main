import { NextRequest, NextResponse } from "next/server";
import { accServerManager } from "@/lib/acc-server-manager";
import fs from 'fs/promises';
import path from 'path';

// Configuration preset storage (in production this would use a proper database)
const PRESETS_FILE = path.join(process.cwd(), 'data', 'config-presets.json');

interface ConfigurationPreset {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  configurations: {
    configuration: any;
    settings: any;
    event: any;
    eventRules: any;
    assistRules: any;
    entrylist: any;
  };
}

// Ensure data directory and presets file exist
async function ensurePresetsFile() {
  try {
    const dataDir = path.dirname(PRESETS_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    // Check if file exists
    try {
      await fs.access(PRESETS_FILE);
    } catch {
      // Create empty presets file
      await fs.writeFile(PRESETS_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Failed to ensure presets file:', error);
  }
}

// Load presets from file
async function loadPresets(): Promise<ConfigurationPreset[]> {
  try {
    await ensurePresetsFile();
    const data = await fs.readFile(PRESETS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load presets:', error);
    return [];
  }
}

// Save presets to file
async function savePresets(presets: ConfigurationPreset[]): Promise<void> {
  try {
    await ensurePresetsFile();
    await fs.writeFile(PRESETS_FILE, JSON.stringify(presets, null, 2));
  } catch (error) {
    console.error('Failed to save presets:', error);
    throw error;
  }
}

// Get all configuration presets
export async function GET(request: NextRequest) {
  try {
    const presets = await loadPresets();
    
    return NextResponse.json({
      success: true,
      data: presets,
      count: presets.length
    });
  } catch (error) {
    console.error("Failed to get configuration presets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get configuration presets" },
      { status: 500 }
    );
  }
}

// Create or update configuration preset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, presetId, name, description } = body;

    if (action === "save") {
      // Save current configuration as a preset
      if (!name) {
        return NextResponse.json(
          { success: false, error: "Preset name is required" },
          { status: 400 }
        );
      }

      // Load current configurations from ACC server manager
      const configTypes = ['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'];
      const configurations: any = {};

      for (const type of configTypes) {
        const result = await accServerManager.readConfigurationFile(type as any);
        if (result.success) {
          configurations[type] = result.data;
        } else {
          return NextResponse.json(
            { success: false, error: `Failed to read ${type} configuration: ${result.message}` },
            { status: 500 }
          );
        }
      }

      const presets = await loadPresets();
      const timestamp = new Date().toISOString();

      if (presetId) {
        // Update existing preset
        const index = presets.findIndex(p => p.id === presetId);
        if (index === -1) {
          return NextResponse.json(
            { success: false, error: "Preset not found" },
            { status: 404 }
          );
        }

        presets[index] = {
          ...presets[index],
          name,
          description: description || presets[index].description,
          updatedAt: timestamp,
          configurations
        };
      } else {
        // Create new preset
        const newPreset: ConfigurationPreset = {
          id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name,
          description: description || "Configuration preset",
          createdAt: timestamp,
          updatedAt: timestamp,
          configurations
        };

        presets.push(newPreset);
      }

      await savePresets(presets);

      return NextResponse.json({
        success: true,
        message: presetId ? "Preset updated successfully" : "Preset created successfully",
        data: presets
      });
    }

    if (action === "load") {
      // Load and apply a configuration preset
      if (!presetId) {
        return NextResponse.json(
          { success: false, error: "Preset ID is required" },
          { status: 400 }
        );
      }

      const presets = await loadPresets();
      const preset = presets.find(p => p.id === presetId);

      if (!preset) {
        return NextResponse.json(
          { success: false, error: "Preset not found" },
          { status: 404 }
        );
      }

      // Apply each configuration file
      const configTypes = ['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'];
      const results: { [key: string]: any } = {};

      for (const type of configTypes) {
        if (preset.configurations[type]) {
          const result = await accServerManager.writeConfigurationFile(type as any, preset.configurations[type]);
          results[type] = result;
          
          if (!result.success) {
            console.error(`Failed to apply ${type} configuration:`, result.message);
          }
        }
      }

      // Check if all configurations were applied successfully
      const failedConfigs = Object.entries(results)
        .filter(([_, result]) => !result.success)
        .map(([type, _]) => type);

      if (failedConfigs.length > 0) {
        return NextResponse.json({
          success: false,
          error: `Failed to apply configurations: ${failedConfigs.join(', ')}`,
          partialResults: results
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Configuration preset applied successfully",
        data: {
          preset,
          appliedConfigurations: Object.keys(results)
        }
      });
    }

    if (action === "delete") {
      // Delete a configuration preset
      if (!presetId) {
        return NextResponse.json(
          { success: false, error: "Preset ID is required" },
          { status: 400 }
        );
      }

      const presets = await loadPresets();
      const index = presets.findIndex(p => p.id === presetId);

      if (index === -1) {
        return NextResponse.json(
          { success: false, error: "Preset not found" },
          { status: 404 }
        );
      }

      presets.splice(index, 1);
      await savePresets(presets);

      return NextResponse.json({
        success: true,
        message: "Preset deleted successfully",
        data: presets
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'save', 'load', or 'delete'" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Configuration preset operation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process preset operation" },
      { status: 500 }
    );
  }
}