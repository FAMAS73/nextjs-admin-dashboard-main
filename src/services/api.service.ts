// API Service for ACC Server Manager
// This service provides typed interfaces to all backend API endpoints

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

interface ServerStatus {
  isRunning: boolean;
  processId: number | null;
  startTime: Date | null;
  lastHeartbeat: Date | null;
  status: "starting" | "running" | "stopping" | "stopped" | "error";
  connectedDrivers: number;
  currentSession: any;
  serverLogs: string[];
  uptime: number;
  uptimeFormatted: string;
  memoryUsage: number;
  cpuUsage: number;
  networkIn: number;
  networkOut: number;
}

interface LiveSessionData {
  sessionInfo: {
    type: "Practice" | "Qualifying" | "Race";
    track: string;
    timeRemaining: number;
    totalTime: number;
    weatherConditions: {
      temperature: number;
      trackTemp: number;
      weather: string;
      windSpeed: number;
    };
    sessionStartTime: string;
    isActive: boolean;
  };
  drivers: Array<{
    id: string;
    position: number;
    carNumber: number;
    driverName: string;
    carModel: string;
    currentLapTime?: string;
    bestLapTime?: string;
    lastLapTime?: string;
    gap: string;
    sector1: string;
    sector2: string;
    sector3: string;
    currentSector: number;
    laps: number;
    isInPit: boolean;
    connectionStatus: "Connected" | "Disconnected" | "Spectating";
    trackPosition: {
      x: number;
      y: number;
      sector: number;
      speed: number;
    };
  }>;
  serverStats: {
    connectedDrivers: number;
    maxDrivers: number;
    spectators: number;
    maxSpectators: number;
    serverLoad: number;
    networkIn: number;
    networkOut: number;
    memoryUsage: number;
  };
}

class ApiService {
  private baseUrl = '/api';

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Server Control APIs
  async getServerStatus(): Promise<ApiResponse<ServerStatus>> {
    return this.fetchApi<ServerStatus>('/server-control');
  }

  async controlServer(action: 'start' | 'stop' | 'restart'): Promise<ApiResponse<ServerStatus>> {
    return this.fetchApi<ServerStatus>('/server-control', {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  // Configuration APIs
  async getConfiguration(type?: string): Promise<ApiResponse<any>> {
    const endpoint = type ? `/config?type=${type}` : '/config';
    return this.fetchApi<any>(endpoint);
  }

  async updateConfiguration(type: string, data: any): Promise<ApiResponse<any>> {
    return this.fetchApi<any>(`/config?type=${type}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async exportConfigurations(): Promise<ApiResponse<any>> {
    return this.fetchApi<any>('/config', {
      method: 'POST',
      body: JSON.stringify({ action: 'export' }),
    });
  }

  async importConfigurations(data: any): Promise<ApiResponse<any>> {
    return this.fetchApi<any>('/config', {
      method: 'POST',
      body: JSON.stringify({ action: 'import', data }),
    });
  }

  async validateConfiguration(): Promise<ApiResponse<{ valid: boolean; errors: string[]; warnings: string[]; }>> {
    return this.fetchApi('/config', {
      method: 'POST',
      body: JSON.stringify({ action: 'validate' }),
    });
  }

  async resetConfiguration(configType: string): Promise<ApiResponse<any>> {
    return this.fetchApi<any>('/config', {
      method: 'POST',
      body: JSON.stringify({ action: 'reset', configType }),
    });
  }

  // Live Data APIs
  async getLiveData(type: 'all' | 'session' | 'drivers' | 'positions' | 'stats' = 'all'): Promise<ApiResponse<LiveSessionData | any>> {
    const endpoint = type === 'all' ? '/live-data' : `/live-data?type=${type}`;
    return this.fetchApi<LiveSessionData | any>(endpoint);
  }

  async startLiveDataUpdates(): Promise<ApiResponse<any>> {
    return this.fetchApi<any>('/live-data', {
      method: 'POST',
      body: JSON.stringify({ action: 'start' }),
    });
  }

  async stopLiveDataUpdates(): Promise<ApiResponse<any>> {
    return this.fetchApi<any>('/live-data', {
      method: 'POST',
      body: JSON.stringify({ action: 'stop' }),
    });
  }

  async resetSessionData(): Promise<ApiResponse<LiveSessionData>> {
    return this.fetchApi<LiveSessionData>('/live-data', {
      method: 'POST',
      body: JSON.stringify({ action: 'reset' }),
    });
  }

  // Server Logs API
  async getServerLogs(lines?: number): Promise<ApiResponse<{ logs: string[] }>> {
    const endpoint = lines ? `/server-logs?lines=${lines}` : '/server-logs';
    return this.fetchApi<{ logs: string[] }>(endpoint);
  }

  // Configuration Presets API
  async getPresets(): Promise<ApiResponse<any>> {
    return this.fetchApi<any>('/presets');
  }

  async savePreset(name: string, description: string): Promise<ApiResponse<any>> {
    return this.fetchApi<any>('/presets', {
      method: 'POST',
      body: JSON.stringify({ action: 'save', name, description }),
    });
  }

  async loadPreset(presetId: string): Promise<ApiResponse<any>> {
    return this.fetchApi<any>('/presets', {
      method: 'POST',
      body: JSON.stringify({ action: 'load', presetId }),
    });
  }

  async deletePreset(presetId: string): Promise<ApiResponse<any>> {
    return this.fetchApi<any>('/presets', {
      method: 'DELETE',
      body: JSON.stringify({ presetId }),
    });
  }

  // File Upload/Download APIs
  async uploadFile(file: File, type: 'config' | 'media'): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.fetchApi<any>('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async downloadConfiguration(format: 'json' | 'zip' = 'json'): Promise<Response> {
    return fetch(`${this.baseUrl}/download?type=config&format=${format}`);
  }

  // Utility Methods
  createLiveDataStream(type: 'all' | 'session' | 'drivers' | 'positions' | 'stats' = 'all', intervalMs = 1000) {
    let interval: NodeJS.Timeout;
    let isActive = false;

    return {
      start: (callback: (data: ApiResponse<any>) => void) => {
        if (isActive) return;
        isActive = true;
        
        // Initial fetch
        this.getLiveData(type).then(callback);
        
        // Set up polling
        interval = setInterval(() => {
          if (isActive) {
            this.getLiveData(type).then(callback);
          }
        }, intervalMs);
      },
      
      stop: () => {
        isActive = false;
        if (interval) {
          clearInterval(interval);
        }
      },
      
      isActive: () => isActive,
    };
  }

  createServerStatusStream(intervalMs = 2000) {
    let interval: NodeJS.Timeout;
    let isActive = false;

    return {
      start: (callback: (data: ApiResponse<ServerStatus>) => void) => {
        if (isActive) return;
        isActive = true;
        
        // Initial fetch
        this.getServerStatus().then(callback);
        
        // Set up polling
        interval = setInterval(() => {
          if (isActive) {
            this.getServerStatus().then(callback);
          }
        }, intervalMs);
      },
      
      stop: () => {
        isActive = false;
        if (interval) {
          clearInterval(interval);
        }
      },
      
      isActive: () => isActive,
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

// Export types for use in components
export type { 
  ApiResponse, 
  ServerStatus, 
  LiveSessionData 
};