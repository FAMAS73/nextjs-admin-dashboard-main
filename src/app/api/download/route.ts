import { NextRequest, NextResponse } from "next/server";

// Handle configuration file downloads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const format = searchParams.get('format') || 'json';
    const bundle = searchParams.get('bundle') === 'true';
    
    if (bundle) {
      // Download all configurations as a ZIP bundle
      return await downloadConfigBundle(format);
    } else if (type) {
      // Download specific configuration file
      return await downloadSingleConfig(type, format);
    } else {
      return NextResponse.json(
        { success: false, error: "Type parameter is required" },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { success: false, error: "Download failed" },
      { status: 500 }
    );
  }
}

async function downloadSingleConfig(type: string, format: string) {
  const validTypes = ['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'];
  
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { success: false, error: "Invalid configuration type" },
      { status: 400 }
    );
  }
  
  try {
    // Get configuration data (in production, this would read from actual files)
    const configResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/config?type=${type}`, {
      method: 'GET',
    });
    
    if (!configResponse.ok) {
      throw new Error('Failed to get configuration data');
    }
    
    const configData = await configResponse.json();
    
    if (!configData.success) {
      throw new Error('Configuration not found');
    }
    
    // Format the data
    let content: string;
    let mimeType: string;
    let filename: string;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(configData.data, null, 2);
        mimeType = 'application/json';
        filename = `${type}.json`;
        break;
        
      case 'yaml':
        // Convert to YAML format (simplified)
        content = jsonToYaml(configData.data);
        mimeType = 'application/x-yaml';
        filename = `${type}.yaml`;
        break;
        
      default:
        content = JSON.stringify(configData.data, null, 2);
        mimeType = 'application/json';
        filename = `${type}.json`;
    }
    
    // Create response with file download headers
    const response = new NextResponse(content);
    response.headers.set('Content-Type', mimeType);
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    response.headers.set('Content-Length', content.length.toString());
    
    return response;
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to download ${type} configuration` },
      { status: 500 }
    );
  }
}

async function downloadConfigBundle(format: string) {
  try {
    const configTypes = ['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'];
    const bundle: Record<string, any> = {};
    
    // Get all configurations
    for (const type of configTypes) {
      try {
        const configResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/config?type=${type}`, {
          method: 'GET',
        });
        
        if (configResponse.ok) {
          const configData = await configResponse.json();
          if (configData.success) {
            bundle[type] = configData.data;
          }
        }
      } catch (error) {
        console.warn(`Failed to get ${type} configuration:`, error);
        // Continue with other configurations
      }
    }
    
    if (Object.keys(bundle).length === 0) {
      return NextResponse.json(
        { success: false, error: "No configurations found" },
        { status: 404 }
      );
    }
    
    // Create bundle content
    let content: string;
    let mimeType: string;
    let filename: string;
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case 'json':
        content = JSON.stringify(bundle, null, 2);
        mimeType = 'application/json';
        filename = `acc-server-config-${timestamp}.json`;
        break;
        
      case 'yaml':
        content = jsonToYaml(bundle);
        mimeType = 'application/x-yaml';
        filename = `acc-server-config-${timestamp}.yaml`;
        break;
        
      case 'zip':
        // In a real implementation, you would create a ZIP file with individual JSON files
        // For now, we'll return a JSON bundle
        content = JSON.stringify(bundle, null, 2);
        mimeType = 'application/json';
        filename = `acc-server-config-${timestamp}.json`;
        break;
        
      default:
        content = JSON.stringify(bundle, null, 2);
        mimeType = 'application/json';
        filename = `acc-server-config-${timestamp}.json`;
    }
    
    // Create response with download headers
    const response = new NextResponse(content);
    response.headers.set('Content-Type', mimeType);
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    response.headers.set('Content-Length', content.length.toString());
    
    return response;
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create configuration bundle" },
      { status: 500 }
    );
  }
}

// Simple JSON to YAML converter (basic implementation)
function jsonToYaml(obj: any, indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';
  
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}- \n${jsonToYaml(item, indent + 1)}`;
      } else {
        yaml += `${spaces}- ${item}\n`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
  }
  
  return yaml;
}

// Handle POST requests for custom download requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { types, format, customName } = body;
    
    if (!types || !Array.isArray(types) || types.length === 0) {
      return NextResponse.json(
        { success: false, error: "Configuration types array is required" },
        { status: 400 }
      );
    }
    
    const validTypes = ['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'];
    const invalidTypes = types.filter((type: string) => !validTypes.includes(type));
    
    if (invalidTypes.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid configuration types: ${invalidTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    const bundle: Record<string, any> = {};
    
    // Get requested configurations
    for (const type of types) {
      try {
        const configResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/config?type=${type}`, {
          method: 'GET',
        });
        
        if (configResponse.ok) {
          const configData = await configResponse.json();
          if (configData.success) {
            bundle[type] = configData.data;
          }
        }
      } catch (error) {
        console.warn(`Failed to get ${type} configuration:`, error);
      }
    }
    
    if (Object.keys(bundle).length === 0) {
      return NextResponse.json(
        { success: false, error: "No configurations found" },
        { status: 404 }
      );
    }
    
    // Create custom bundle
    const content = JSON.stringify(bundle, null, 2);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = customName || `acc-custom-config-${timestamp}.json`;
    
    // Return download URL and metadata instead of direct file
    return NextResponse.json({
      success: true,
      download: {
        content,
        filename,
        size: content.length,
        types: Object.keys(bundle),
        format: format || 'json'
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create custom configuration bundle" },
      { status: 500 }
    );
  }
}