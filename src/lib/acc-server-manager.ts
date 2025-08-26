// ACC Server Manager - Real server process control
import { spawn, ChildProcess } from 'child_process';
import { existsSync, writeFileSync, readFileSync, mkdirSync, watchFile } from 'fs';
import path from 'path';

interface ServerStatus {
  isRunning: boolean;
  processId?: number;
  uptime: number;
  lastStarted?: string;
  playersOnline: number;
  sessionType: string;
  track: string;
  logs: string[];
}

interface AccConfiguration {
  tcpPort: number;
  udpPort: number;
  registerToLobby: 0 | 1;
  maxConnections: number;
  configVersion?: number;
}

class AccServerManager {
  private serverProcess: ChildProcess | null = null;
  private serverPath: string;
  private configPath: string;
  private logPath: string;
  private resultsPath: string;
  private startTime: Date | null = null;
  private serverLogs: string[] = [];
  private logWatcher: any = null;
  private sessionData: any = null;

  constructor() {
    // Use the provided ACC server path
    this.serverPath = process.env.ACC_SERVER_PATH || 'Z:\\SteamLibrary\\steamapps\\common\\Assetto Corsa Competizione Dedicated Server\\server';
    this.configPath = path.join(this.serverPath, 'cfg');
    this.logPath = path.join(this.serverPath, 'log');
    this.resultsPath = path.join(this.serverPath, 'results');
    
    // Ensure directories exist
    this.ensureDirectories();
    
    // Start watching log files and results
    this.setupLogWatching();
    this.setupResultsWatching();
  }

  private readAccJson(filePath: string): any {
    try {
      // ACC JSON files are in UTF-16 LE format per ServerAdminHandbook
      // Try different approaches to handle BOM and encoding
      let rawData = readFileSync(filePath);
      let jsonString: string;
      
      // Check for UTF-16 LE BOM (FF FE)
      if (rawData[0] === 0xFF && rawData[1] === 0xFE) {
        // Has UTF-16 LE BOM, read as utf16le
        jsonString = rawData.toString('utf16le');
      } else if (rawData[0] === 0xFE && rawData[1] === 0xFF) {
        // Has UTF-16 BE BOM, read as utf16be (unlikely for ACC but just in case)
        jsonString = rawData.toString('utf16le'); // Try utf16le anyway
      } else {
        // No BOM detected, try utf16le first, then fallback to utf8
        try {
          jsonString = rawData.toString('utf16le');
          // Quick validation - if it starts with non-printable characters, it's probably not utf16le
          if (jsonString.charCodeAt(0) > 127 && jsonString.charCodeAt(0) !== 0xFEFF) {
            throw new Error('Invalid UTF-16 LE encoding detected');
          }
        } catch {
          // Fallback to UTF-8
          jsonString = rawData.toString('utf8');
        }
      }
      
      // Remove BOM if present at the start of the string
      if (jsonString.charCodeAt(0) === 0xFEFF) {
        jsonString = jsonString.slice(1);
      }
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error(`Failed to read ACC JSON file ${filePath}:`, error);
      throw error;
    }
  }

  private ensureDirectories(): void {
    if (!existsSync(this.configPath)) {
      mkdirSync(this.configPath, { recursive: true });
    }
    if (!existsSync(this.logPath)) {
      mkdirSync(this.logPath, { recursive: true });
    }
    if (!existsSync(this.resultsPath)) {
      mkdirSync(this.resultsPath, { recursive: true });
    }
  }

  private setupLogWatching(): void {
    const logFile = path.join(this.logPath, 'server.log');
    
    if (existsSync(logFile)) {
      this.logWatcher = watchFile(logFile, (curr, prev) => {
        this.readLatestLogs();
      });
      
      // Read initial logs
      this.readLatestLogs();
    }
  }

  private readLatestLogs(): void {
    const logFile = path.join(this.logPath, 'server.log');
    
    if (existsSync(logFile)) {
      try {
        const content = readFileSync(logFile, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        
        // Keep last 100 lines
        this.serverLogs = lines.slice(-100).map(line => {
          const timestamp = new Date().toISOString();
          return line.includes('[') ? line : `[${timestamp}] ${line}`;
        });
      } catch (error) {
        console.error('Failed to read server logs:', error);
      }
    }
  }

  async startServer(): Promise<{ success: boolean; message: string; status?: ServerStatus }> {
    if (this.serverProcess && !this.serverProcess.killed) {
      return { success: false, message: 'Server is already running' };
    }

    if (!this.serverPath || !existsSync(this.serverPath)) {
      return { 
        success: false, 
        message: 'ACC server path not found. Please check ACC_SERVER_PATH in environment variables.' 
      };
    }

    const serverExecutable = path.join(this.serverPath, 'accServer.exe');
    
    if (!existsSync(serverExecutable)) {
      return { 
        success: false, 
        message: `ACC server executable not found at: ${serverExecutable}` 
      };
    }

    try {
      // Spawn the ACC server process
      this.serverProcess = spawn(serverExecutable, [], {
        cwd: this.serverPath,
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: false, // Show the terminal window
      });

      this.startTime = new Date();

      // Handle process output
      this.serverProcess.stdout?.on('data', (data) => {
        const logLine = `[${new Date().toISOString()}] ${data.toString().trim()}`;
        this.serverLogs.push(logLine);
        if (this.serverLogs.length > 100) {
          this.serverLogs = this.serverLogs.slice(-100);
        }
        console.log('ACC Server:', data.toString());
      });

      this.serverProcess.stderr?.on('data', (data) => {
        const logLine = `[${new Date().toISOString()}] ERROR: ${data.toString().trim()}`;
        this.serverLogs.push(logLine);
        console.error('ACC Server Error:', data.toString());
      });

      this.serverProcess.on('close', (code) => {
        const logLine = `[${new Date().toISOString()}] Server process exited with code ${code}`;
        this.serverLogs.push(logLine);
        console.log(logLine);
        this.serverProcess = null;
        this.startTime = null;
      });

      this.serverProcess.on('error', (error) => {
        const logLine = `[${new Date().toISOString()}] Server process error: ${error.message}`;
        this.serverLogs.push(logLine);
        console.error('ACC Server Process Error:', error);
        this.serverProcess = null;
        this.startTime = null;
      });

      // Wait a moment to ensure process started successfully
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (this.serverProcess && !this.serverProcess.killed) {
        return {
          success: true,
          message: 'ACC server started successfully',
          status: this.getStatus()
        };
      } else {
        return { success: false, message: 'Failed to start ACC server' };
      }

    } catch (error) {
      console.error('Failed to start ACC server:', error);
      return { 
        success: false, 
        message: `Failed to start server: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async stopServer(): Promise<{ success: boolean; message: string; status?: ServerStatus }> {
    if (!this.serverProcess || this.serverProcess.killed) {
      return { success: false, message: 'Server is not running' };
    }

    try {
      // Try graceful shutdown first
      this.serverProcess.kill('SIGTERM');
      
      // Wait for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Force kill if still running
      if (this.serverProcess && !this.serverProcess.killed) {
        this.serverProcess.kill('SIGKILL');
      }

      this.serverProcess = null;
      this.startTime = null;

      const logLine = `[${new Date().toISOString()}] Server stopped by user`;
      this.serverLogs.push(logLine);

      return {
        success: true,
        message: 'ACC server stopped successfully',
        status: this.getStatus()
      };

    } catch (error) {
      console.error('Failed to stop ACC server:', error);
      return { 
        success: false, 
        message: `Failed to stop server: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async restartServer(): Promise<{ success: boolean; message: string; status?: ServerStatus }> {
    const stopResult = await this.stopServer();
    if (!stopResult.success && this.serverProcess) {
      return stopResult;
    }

    // Wait a moment between stop and start
    await new Promise(resolve => setTimeout(resolve, 3000));

    return await this.startServer();
  }

  getStatus(): ServerStatus {
    const uptime = this.startTime ? Date.now() - this.startTime.getTime() : 0;
    
    return {
      isRunning: this.serverProcess !== null && !this.serverProcess.killed,
      processId: this.serverProcess?.pid,
      uptime,
      lastStarted: this.startTime?.toISOString(),
      playersOnline: 0, // Would need to parse from server logs or UDP data
      sessionType: 'Unknown', // Would need to parse from current session
      track: 'Unknown', // Would need to read from current event.json
      logs: [...this.serverLogs]
    };
  }

  getLogs(maxLines: number = 50): string[] {
    return this.serverLogs.slice(-maxLines);
  }

  // Configuration file management
  async writeConfigurationFile(type: 'configuration' | 'settings' | 'event' | 'eventRules' | 'assistRules' | 'entrylist', data: any): Promise<{ success: boolean; message: string }> {
    const filename = `${type}.json`;
    const filePath = path.join(this.configPath, filename);

    try {
      // Create backup of existing file
      if (existsSync(filePath)) {
        const backupPath = path.join(this.configPath, `${filename}.backup.${Date.now()}`);
        const existingContent = readFileSync(filePath, 'utf8');
        writeFileSync(backupPath, existingContent);
      }

      // Write new configuration
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

      const logLine = `[${new Date().toISOString()}] Configuration file ${filename} updated`;
      this.serverLogs.push(logLine);

      return { success: true, message: `Configuration file ${filename} written successfully` };

    } catch (error) {
      console.error(`Failed to write ${filename}:`, error);
      return { 
        success: false, 
        message: `Failed to write ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async readConfigurationFile(type: 'configuration' | 'settings' | 'event' | 'eventRules' | 'assistRules' | 'entrylist'): Promise<{ success: boolean; data?: any; message?: string }> {
    const filename = `${type}.json`;
    const filePath = path.join(this.configPath, filename);

    try {
      if (!existsSync(filePath)) {
        return { success: false, message: `Configuration file ${filename} not found` };
      }

      const content = readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      return { success: true, data };

    } catch (error) {
      console.error(`Failed to read ${filename}:`, error);
      return { 
        success: false, 
        message: `Failed to read ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  // Setup results file watching
  private setupResultsWatching(): void {
    // Watch for new race result files in the results directory
    try {
      if (existsSync(this.resultsPath)) {
        watchFile(this.resultsPath, (curr, prev) => {
          // Refresh session data when results directory changes
          this.refreshSessionData();
        });
      }
    } catch (error) {
      console.error('Failed to setup results watching:', error);
    }
  }

  // Read real session data from ACC server files
  getRealSessionData(): any {
    try {
      // Try to read current session info from event.json
      const eventConfigPath = path.join(this.configPath, 'event.json');
      let currentSession = null;

      if (existsSync(eventConfigPath)) {
        try {
          const eventData = this.readAccJson(eventConfigPath);
          currentSession = {
            track: eventData.track || 'Unknown',
            sessionType: this.determineSessionType(eventData),
            weather: {
              ambient: eventData.ambientTemp || 20,
              cloudLevel: eventData.cloudLevel || 0.3,
              rain: eventData.rain || 0.0
            },
            sessions: eventData.sessions || []
          };
        } catch (error) {
          console.error(`Failed to parse event.json:`, error);
          // Set default values if parsing fails
          currentSession = {
            track: 'Unknown',
            sessionType: 'Practice',
            weather: {
              ambient: 20,
              cloudLevel: 0.3,
              rain: 0.0
            },
            sessions: []
          };
        }
      }

      // Try to get player count from server status (if available)
      const playersOnline = this.getConnectedPlayersCount();

      return {
        sessionInfo: currentSession,
        connectedPlayers: playersOnline,
        serverRunning: this.serverProcess !== null && !this.serverProcess.killed,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to read real session data:', error);
      return null;
    }
  }

  // Get real race results from results directory
  getRealRaceResults(): any[] {
    const results = [];
    try {
      if (existsSync(this.resultsPath)) {
        const files = require('fs').readdirSync(this.resultsPath);
        const resultFiles = files.filter((file: string) => file.endsWith('.json'));

        for (const file of resultFiles.slice(-10)) { // Get last 10 results
          try {
            // ACC JSON files are in UTF-16 LE format per ServerAdminHandbook
            const resultData = this.readAccJson(path.join(this.resultsPath, file));
            results.push({
              filename: file,
              ...resultData,
              raceDate: this.extractDateFromFilename(file)
            });
          } catch (error) {
            console.error(`Failed to read result file ${file}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to read race results:', error);
    }
    return results.sort((a, b) => new Date(b.raceDate).getTime() - new Date(a.raceDate).getTime());
  }

  // Get real driver statistics from entrylist
  getRealDriverData(): any[] {
    try {
      const entryListPath = path.join(this.configPath, 'entrylist.json');
      if (existsSync(entryListPath)) {
        // ACC JSON files are in UTF-16 LE format per ServerAdminHandbook
        const entryData = this.readAccJson(entryListPath);
        return entryData.entries || [];
      }
    } catch (error) {
      console.error('Failed to read driver data:', error);
    }
    return [];
  }

  // Helper methods
  private determineSessionType(eventData: any): string {
    if (!eventData.sessions || eventData.sessions.length === 0) return 'Unknown';
    
    const currentSession = eventData.sessions[0];
    switch (currentSession.sessionType) {
      case 'P': return 'Practice';
      case 'Q': return 'Qualifying';
      case 'R': return 'Race';
      default: return 'Unknown';
    }
  }

  private getConnectedPlayersCount(): number {
    // This would require parsing real-time server data or logs
    // For now, return 0 unless we can parse it from logs
    const recentLogs = this.serverLogs.slice(-50);
    let playerCount = 0;

    // Try to extract player count from recent logs
    for (const log of recentLogs) {
      const match = log.match(/(\d+)\s+player[s]?\s+(connected|online)/i);
      if (match) {
        playerCount = Math.max(playerCount, parseInt(match[1]));
      }
    }

    return playerCount;
  }

  private extractDateFromFilename(filename: string): string {
    // ACC result files usually have timestamps in their names
    // Format: YYYYMMDD_HHMMSS or similar
    const match = filename.match(/(\d{8})_(\d{6})/);
    if (match) {
      const date = match[1]; // YYYYMMDD
      const time = match[2]; // HHMMSS
      return `${date.substring(0,4)}-${date.substring(4,6)}-${date.substring(6,8)}T${time.substring(0,2)}:${time.substring(2,4)}:${time.substring(4,6)}Z`;
    }
    return new Date().toISOString();
  }

  private refreshSessionData(): void {
    this.sessionData = this.getRealSessionData();
  }

  // Enhanced getStatus method to include real data
  getEnhancedStatus(): ServerStatus & { realData?: any } {
    const baseStatus = this.getStatus();
    const realData = this.getRealSessionData();
    
    if (realData?.sessionInfo) {
      baseStatus.track = realData.sessionInfo.track;
      baseStatus.sessionType = realData.sessionInfo.sessionType;
      baseStatus.playersOnline = realData.connectedPlayers || 0;
    }

    return {
      ...baseStatus,
      realData
    };
  }

  // Cleanup method
  cleanup(): void {
    if (this.logWatcher) {
      this.logWatcher.stop?.();
    }
    
    if (this.serverProcess && !this.serverProcess.killed) {
      this.serverProcess.kill('SIGTERM');
    }
  }

  // Get server directory paths for external access
  getServerPaths() {
    return {
      serverPath: this.serverPath,
      configPath: this.configPath,
      logPath: this.logPath
    };
  }

  // Check if ACC server installation is valid
  validateInstallation(): { isValid: boolean; message: string; paths: any } {
    const paths = this.getServerPaths();
    const serverExecutable = path.join(this.serverPath, 'accServer.exe');
    
    const checks = {
      serverPathExists: existsSync(this.serverPath),
      executableExists: existsSync(serverExecutable),
      configDirExists: existsSync(this.configPath),
      logDirExists: existsSync(this.logPath),
    };

    const isValid = Object.values(checks).every(check => check);
    
    let message = '';
    if (!checks.serverPathExists) {
      message = `Server path not found: ${this.serverPath}`;
    } else if (!checks.executableExists) {
      message = `ACC server executable not found: ${serverExecutable}`;
    } else if (isValid) {
      message = 'ACC server installation is valid';
    } else {
      message = 'ACC server installation has missing directories';
    }

    return {
      isValid,
      message,
      paths: {
        ...paths,
        serverExecutable,
        checks
      }
    };
  }
}

// Export singleton instance
export const accServerManager = new AccServerManager();
export default accServerManager;

// Export types
export type { ServerStatus };

// Cleanup on process exit
process.on('exit', () => {
  accServerManager.cleanup();
});

process.on('SIGINT', () => {
  accServerManager.cleanup();
  process.exit();
});

process.on('SIGTERM', () => {
  accServerManager.cleanup();
  process.exit();
});