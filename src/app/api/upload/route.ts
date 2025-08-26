import { NextRequest, NextResponse } from "next/server";

// Handle file uploads for ACC configuration files
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];
    
    for (const file of files) {
      try {
        // Validate file type
        if (!file.name.endsWith('.json')) {
          errors.push(`${file.name}: Only JSON files are supported`);
          continue;
        }
        
        // Read file content
        const content = await file.text();
        
        // Parse JSON
        let parsedContent;
        try {
          parsedContent = JSON.parse(content);
        } catch (parseError) {
          errors.push(`${file.name}: Invalid JSON format`);
          continue;
        }
        
        // Determine configuration type based on filename or content structure
        const configType = determineConfigType(file.name, parsedContent);
        
        if (!configType) {
          errors.push(`${file.name}: Unable to determine configuration type`);
          continue;
        }
        
        // Validate configuration structure
        const validation = validateConfiguration(configType, parsedContent);
        if (!validation.isValid) {
          errors.push(`${file.name}: ${validation.error}`);
          continue;
        }
        
        // Store configuration (in production, this would update actual files)
        const storeResult = await storeConfiguration(configType, parsedContent);
        
        results.push({
          filename: file.name,
          type: configType,
          size: file.size,
          status: 'success',
          message: `Successfully imported ${configType} configuration`
        });
        
      } catch (error) {
        errors.push(`${file.name}: Processing error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return NextResponse.json({
      success: errors.length === 0,
      results,
      errors,
      summary: {
        totalFiles: files.length,
        successful: results.length,
        failed: errors.length
      }
    });
    
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { success: false, error: "File upload processing failed" },
      { status: 500 }
    );
  }
}

function determineConfigType(filename: string, content: any): string | null {
  const name = filename.toLowerCase();
  
  // Check filename patterns
  if (name.includes('configuration')) return 'configuration';
  if (name.includes('settings')) return 'settings';
  if (name.includes('event') && !name.includes('rules')) return 'event';
  if (name.includes('eventrules') || name.includes('event_rules')) return 'eventRules';
  if (name.includes('assistrules') || name.includes('assist_rules')) return 'assistRules';
  if (name.includes('entrylist') || name.includes('entry_list')) return 'entrylist';
  
  // Check content structure
  if (content.tcpPort !== undefined && content.udpPort !== undefined) return 'configuration';
  if (content.serverName !== undefined && content.maxCarSlots !== undefined) return 'settings';
  if (content.track !== undefined && content.sessions !== undefined) return 'event';
  if (content.qualifyStandingType !== undefined && content.mandatoryPitstopCount !== undefined) return 'eventRules';
  if (content.stabilityControlLevelMin !== undefined) return 'assistRules';
  if (content.entries !== undefined && Array.isArray(content.entries)) return 'entrylist';
  
  return null;
}

function validateConfiguration(type: string, content: any): { isValid: boolean; error?: string } {
  try {
    switch (type) {
      case 'configuration':
        if (!content.tcpPort || !content.udpPort) {
          return { isValid: false, error: "Missing required ports (tcpPort, udpPort)" };
        }
        if (content.tcpPort === content.udpPort) {
          return { isValid: false, error: "TCP and UDP ports cannot be the same" };
        }
        break;
        
      case 'settings':
        if (!content.maxCarSlots || content.maxCarSlots < 1 || content.maxCarSlots > 82) {
          return { isValid: false, error: "maxCarSlots must be between 1 and 82" };
        }
        break;
        
      case 'event':
        if (!content.track) {
          return { isValid: false, error: "Track is required" };
        }
        if (!content.sessions || !Array.isArray(content.sessions) || content.sessions.length === 0) {
          return { isValid: false, error: "At least one session must be configured" };
        }
        break;
        
      case 'entrylist':
        if (!content.entries || !Array.isArray(content.entries)) {
          return { isValid: false, error: "Entries array is required" };
        }
        break;
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: "Validation error" };
  }
}

async function storeConfiguration(type: string, content: any): Promise<boolean> {
  try {
    // In production, this would write to actual ACC configuration files
    // For now, we'll simulate the storage
    
    // Simulate file write delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Here you would:
    // 1. Backup existing configuration file
    // 2. Write new configuration to file
    // 3. Validate the file was written correctly
    // 4. Update any in-memory configuration cache
    
    return true;
  } catch (error) {
    console.error(`Failed to store ${type} configuration:`, error);
    return false;
  }
}