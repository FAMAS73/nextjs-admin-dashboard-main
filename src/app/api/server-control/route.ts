import { NextRequest, NextResponse } from "next/server";
import { accServerManager } from "@/lib/acc-server-manager";

// Use real ACC server manager instead of mock data

export async function GET(request: NextRequest) {
  try {
    // Get real server status from ACC server manager
    const status = accServerManager.getStatus();
    
    // Add installation validation
    const validation = accServerManager.validateInstallation();

    return NextResponse.json({
      success: true,
      data: {
        ...status,
        uptimeFormatted: formatUptime(status.uptime),
        // Add some mock performance data for now (would come from system monitoring in production)
        memoryUsage: status.isRunning ? Math.floor(Math.random() * 500) + 800 : 0, // MB
        cpuUsage: status.isRunning ? Math.floor(Math.random() * 20) + 5 : 0, // %
        networkIn: status.isRunning ? Math.floor(Math.random() * 50) + 100 : 0, // KB/s
        networkOut: status.isRunning ? Math.floor(Math.random() * 30) + 50 : 0, // KB/s
        installation: validation,
      },
    });
  } catch (error) {
    console.error("Failed to get server status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get server status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action || !["start", "stop", "restart"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'start', 'stop', or 'restart'" },
        { status: 400 }
      );
    }

    // Validate ACC server installation first
    const validation = accServerManager.validateInstallation();
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: `ACC server installation invalid: ${validation.message}` },
        { status: 400 }
      );
    }

    // Execute the real server operation
    let result;
    switch (action) {
      case "start":
        result = await accServerManager.startServer();
        break;
      case "stop":
        result = await accServerManager.stopServer();
        break;
      case "restart":
        result = await accServerManager.restartServer();
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Unknown action" },
          { status: 400 }
        );
    }

    if (result.success && result.status) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          ...result.status,
          uptimeFormatted: formatUptime(result.status.uptime),
          installation: validation,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Server control error:", error);
    return NextResponse.json(
      { success: false, error: "Server operation failed" },
      { status: 500 }
    );
  }
}

function formatUptime(ms: number): string {
  if (ms === 0) return "Not running";
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}