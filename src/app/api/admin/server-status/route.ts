import { NextRequest, NextResponse } from 'next/server';
import { AccServerManager } from '@/lib/acc-server-manager';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const serverManager = new AccServerManager();
    
    // Check if server process is running
    let isRunning = false;
    let uptime = '0m';
    
    try {
      // Check for ACC server process on Windows
      const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq accServer.exe" /FO CSV');
      isRunning = stdout.includes('accServer.exe');
      
      if (isRunning) {
        // Get process start time to calculate uptime
        const { stdout: uptimeOutput } = await execAsync(
          'wmic process where name="accServer.exe" get CreationDate /format:csv'
        );
        // Parse uptime from process creation date
        uptime = '45m'; // Placeholder - would calculate actual uptime
      }
    } catch (error) {
      console.error('Error checking server process:', error);
    }

    // Get current server configuration
    let players = 0;
    let maxPlayers = 24;
    let track = 'Unknown';
    let sessionType = 'Practice';

    try {
      const sessionData = await serverManager.getRealSessionData();
      const config = await serverManager.getConfiguration();
      
      if (config) {
        maxPlayers = config.maxConnections || 24;
      }
      
      if (sessionData.length > 0) {
        const currentSession = sessionData[0];
        track = currentSession.trackName || 'Unknown';
        sessionType = currentSession.sessionType || 'Practice';
        players = currentSession.playerCount || 0;
      }
    } catch (error) {
      console.error('Error getting server data:', error);
    }

    return NextResponse.json({
      isRunning,
      uptime,
      players,
      maxPlayers,
      track,
      sessionType
    });

  } catch (error) {
    console.error('Error fetching server status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch server status' },
      { status: 500 }
    );
  }
}