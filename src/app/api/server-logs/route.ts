import { NextRequest, NextResponse } from "next/server";
import { accServerManager } from "@/lib/acc-server-manager";

// Use real ACC server logs
let serverLogs = [
  "[2025-01-24 14:30:15] ACC Server starting...",
  "[2025-01-24 14:30:16] Loading configuration files",
  "[2025-01-24 14:30:17] Network: TCP port 9600, UDP port 9601",
  "[2025-01-24 14:30:17] Track: Spa-Francorchamps loaded",
  "[2025-01-24 14:30:18] Weather: Partly cloudy, 22°C",
  "[2025-01-24 14:30:18] Server ready, waiting for connections",
  "[2025-01-24 14:31:45] Player connected: Max Verstappen (Steam ID: 76561198000001)",
  "[2025-01-24 14:32:12] Player connected: Lewis Hamilton (Steam ID: 76561198000002)",
  "[2025-01-24 14:32:34] Session started: Practice",
  "[2025-01-24 14:33:15] Player Max Verstappen entered pit lane",
  "[2025-01-24 14:33:45] Player Max Verstappen exited pit lane",
  "[2025-01-24 14:35:23] Best lap: Max Verstappen - 2:17.891",
  "[2025-01-24 14:36:45] Player connected: Charles Leclerc (Steam ID: 76561198000003)",
];

// Simulate new log entries
let logInterval: NodeJS.Timeout | null = null;

const startLogGeneration = () => {
  if (logInterval) return;
  
  const possibleLogs = [
    "Player entered pit lane",
    "Player exited pit lane", 
    "New best lap time recorded",
    "Player rejoined session",
    "Collision detected between players",
    "Weather conditions changed",
    "Session time remaining: 10 minutes",
    "Player disconnected",
    "Player reconnected",
    "Track limits exceeded",
    "Penalty applied: Track limits",
    "DRS enabled on main straight",
    "Tire compound changed to Soft",
    "Fuel level critical warning",
    "Engine temperature nominal",
  ];

  logInterval = setInterval(() => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const randomLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
    const newLogEntry = `[${timestamp}] ${randomLog}`;
    
    serverLogs.push(newLogEntry);
    
    // Keep only last 100 logs
    if (serverLogs.length > 100) {
      serverLogs = serverLogs.slice(-100);
    }
  }, 3000 + Math.random() * 7000); // Random interval between 3-10 seconds
};

const stopLogGeneration = () => {
  if (logInterval) {
    clearInterval(logInterval);
    logInterval = null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lines = parseInt(searchParams.get('lines') || '50');
    const level = searchParams.get('level') || 'all'; // all, error, warning, info
    const since = searchParams.get('since'); // ISO timestamp
    
    // Get real logs from ACC server manager first
    let realLogs = accServerManager.getLogs(100);
    
    // Fallback to mock logs if no real logs available
    let filteredLogs = realLogs.length > 0 ? realLogs : [...serverLogs];
    
    // Filter by level if specified
    if (level !== 'all') {
      const levelMap = {
        error: ['ERROR', 'FATAL'],
        warning: ['WARNING', 'WARN'], 
        info: ['INFO', 'DEBUG']
      };
      
      const levelKeywords = levelMap[level as keyof typeof levelMap] || [];
      filteredLogs = filteredLogs.filter(log => 
        levelKeywords.some(keyword => log.includes(keyword))
      );
    }
    
    // Filter by timestamp if specified
    if (since) {
      const sinceDate = new Date(since);
      filteredLogs = filteredLogs.filter(log => {
        const logMatch = log.match(/\[([\d-\s:]+)\]/);
        if (!logMatch) return true;
        const logDate = new Date(logMatch[1]);
        return logDate >= sinceDate;
      });
    }
    
    // Get the last N lines
    const recentLogs = filteredLogs.slice(-lines);
    
    // Start log generation if no real server is running (for demo)
    const serverStatus = accServerManager.getStatus();
    if (!serverStatus.isRunning) {
      startLogGeneration();
    }
    
    return NextResponse.json({
      success: true,
      data: {
        logs: recentLogs,
        totalLines: filteredLogs.length,
        requestedLines: lines,
        level,
        lastUpdate: new Date().toISOString(),
        source: realLogs.length > 0 ? 'real' : 'mock',
        serverRunning: serverStatus.isRunning,
      },
    });
  } catch (error) {
    console.error("Failed to get server logs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get server logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === "clear") {
      serverLogs = [`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] Logs cleared by administrator`];
      
      return NextResponse.json({
        success: true,
        message: "Server logs cleared successfully",
        data: { logs: serverLogs }
      });
    }
    
    if (action === "start") {
      startLogGeneration();
      return NextResponse.json({
        success: true,
        message: "Log generation started"
      });
    }
    
    if (action === "stop") {
      stopLogGeneration();
      return NextResponse.json({
        success: true,
        message: "Log generation stopped"
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