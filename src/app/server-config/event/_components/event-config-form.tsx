"use client";

import { useState, useEffect } from "react";
import { AccEvent, SessionType } from "@/types/acc-config";
import { PushToServerButton } from "@/components/ui/push-to-server-button";

const defaultEvent: AccEvent = {
  track: "misano",
  eventType: "E_3h",
  preRaceWaitingTimeSeconds: 80,
  sessionOverTimeSeconds: 120,
  ambientTemp: 22,
  cloudLevel: 0.1,
  rain: 0.0,
  weatherRandomness: 1,
  configVersion: 1,
  sessions: [
    {
      hourOfDay: 12,
      dayOfWeekend: 2,
      timeMultiplier: 1,
      sessionType: "P" as SessionType,
      sessionDurationMinutes: 45
    },
    {
      hourOfDay: 13,
      dayOfWeekend: 2,
      timeMultiplier: 1,
      sessionType: "Q" as SessionType,
      sessionDurationMinutes: 15
    },
    {
      hourOfDay: 14,
      dayOfWeekend: 2,
      timeMultiplier: 1,
      sessionType: "R" as SessionType,
      sessionDurationMinutes: 20
    }
  ]
};

const trackNames: Record<string, string> = {
  spa: "Spa-Francorchamps",
  monza: "Monza",
  silverstone: "Silverstone",
  nurburgring: "Nürburgring",
  imola: "Imola",
  brands_hatch: "Brands Hatch",
  misano: "Misano",
  paul_ricard: "Paul Ricard",
  hungaroring: "Hungaroring",
  zolder: "Zolder",
  barcelona: "Barcelona",
  kyalami: "Kyalami",
  mount_panorama: "Mount Panorama",
  suzuka: "Suzuka",
  laguna_seca: "Laguna Seca",
  snetterton: "Snetterton",
  oulton_park: "Oulton Park",
  donington: "Donington Park",
  valencia: "Valencia",
  watkins_glen: "Watkins Glen",
  cota: "Circuit of the Americas"
};

const sessionTypeNames: Record<SessionType, string> = {
  P: "Practice",
  Q: "Qualifying", 
  R: "Race"
};

const eventTypes = [
  { value: "E_3h", name: "3 Hour Endurance" },
  { value: "E_6h", name: "6 Hour Endurance" },
  { value: "E_12h", name: "12 Hour Endurance" },
  { value: "E_24h", name: "24 Hour Endurance" },
  { value: "Sprint", name: "Sprint Race" },
  { value: "Championship", name: "Championship Event" }
];

export function EventConfigForm() {
  const [event, setEvent] = useState<AccEvent>(defaultEvent);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  // Load current configuration from server on component mount
  useEffect(() => {
    loadCurrentConfiguration();
  }, []);

  const loadCurrentConfiguration = async () => {
    setIsLoadingConfig(true);
    try {
      const response = await fetch('/api/config?type=event');
      if (response.ok) {
        const currentConfig = await response.json();
        // Merge server config with default values to ensure all required fields are present
        setEvent({ ...defaultEvent, ...currentConfig });
      } else {
        console.warn('Could not load current event configuration, using defaults');
      }
    } catch (error) {
      console.error('Error loading current configuration:', error);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'event',
          config: event
        }),
      });

      if (response.ok) {
        console.log("Event configuration saved successfully");
        // Optionally show a success notification here
      } else {
        throw new Error('Failed to save configuration to server');
      }
    } catch (error) {
      console.error("Failed to save event configuration:", error);
      // Optionally show an error notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            setEvent({ ...defaultEvent, ...imported });
          } catch (error) {
            console.error("Invalid JSON file:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(event, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "event.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const addSession = () => {
    setEvent({
      ...event,
      sessions: [
        ...event.sessions,
        {
          hourOfDay: 12,
          dayOfWeekend: 1,
          timeMultiplier: 1,
          sessionType: "P" as SessionType,
          sessionDurationMinutes: 30
        }
      ]
    });
  };

  const removeSession = (index: number) => {
    setEvent({
      ...event,
      sessions: event.sessions.filter((_, i) => i !== index)
    });
  };

  const updateSession = (index: number, updates: Partial<AccEvent['sessions'][0]>) => {
    setEvent({
      ...event,
      sessions: event.sessions.map((session, i) => 
        i === index ? { ...session, ...updates } : session
      )
    });
  };

  // Show loading state while fetching current configuration
  if (isLoadingConfig) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-dark-5 dark:text-dark-6">Loading current configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Track Selection */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Track & Event Type
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Track Selection
            </label>
            <select
              value={event.track}
              onChange={(e) => setEvent({ ...event, track: e.target.value as any })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              {Object.entries(trackNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Event Type
            </label>
            <select
              value={event.eventType}
              onChange={(e) => setEvent({ ...event, eventType: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Weather Configuration */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Weather Conditions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Ambient Temperature (°C)
            </label>
            <input
              type="number"
              value={event.ambientTemp}
              onChange={(e) => setEvent({ ...event, ambientTemp: parseInt(e.target.value) })}
              min="0"
              max="50"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Cloud Level ({Math.round(event.cloudLevel * 100)}%)
            </label>
            <input
              type="range"
              value={event.cloudLevel}
              onChange={(e) => setEvent({ ...event, cloudLevel: parseFloat(e.target.value) })}
              min="0"
              max="1"
              step="0.1"
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Rain Level ({Math.round(event.rain * 100)}%)
            </label>
            <input
              type="range"
              value={event.rain}
              onChange={(e) => setEvent({ ...event, rain: parseFloat(e.target.value) })}
              min="0"
              max="1"
              step="0.1"
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Weather Randomness
            </label>
            <input
              type="number"
              value={event.weatherRandomness}
              onChange={(e) => setEvent({ ...event, weatherRandomness: parseInt(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 })}
              min="0"
              max="7"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>
        </div>
        
        {/* Weather Preview */}
        <div className="mt-4 rounded-lg bg-gray-1 p-4 dark:bg-dark-2">
          <h4 className="mb-2 text-sm font-semibold text-dark dark:text-white">Weather Preview</h4>
          <div className="flex items-center space-x-4 text-sm text-dark-5 dark:text-dark-6">
            <span>🌡️ {event.ambientTemp}°C</span>
            <span>☁️ {Math.round(event.cloudLevel * 100)}% Clouds</span>
            <span>🌧️ {Math.round(event.rain * 100)}% Rain</span>
            <span>🎲 Randomness: {event.weatherRandomness}/7</span>
          </div>
        </div>
      </div>

      {/* Session Schedule */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Session Schedule
          </h3>
          <button
            onClick={addSession}
            className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-white hover:bg-primary/90"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Session
          </button>
        </div>
        
        <div className="space-y-4">
          {event.sessions.map((session, index) => (
            <div key={index} className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-stroke-dark dark:bg-dark-2">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-dark dark:text-white">
                  Session {index + 1} - {sessionTypeNames[session.sessionType]}
                </h4>
                {event.sessions.length > 1 && (
                  <button
                    onClick={() => removeSession(index)}
                    className="text-red hover:text-red-dark"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                    Session Type
                  </label>
                  <select
                    value={session.sessionType}
                    onChange={(e) => updateSession(index, { sessionType: e.target.value as SessionType })}
                    className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                  >
                    <option value="P">Practice</option>
                    <option value="Q">Qualifying</option>
                    <option value="R">Race</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={session.sessionDurationMinutes}
                    onChange={(e) => updateSession(index, { sessionDurationMinutes: parseInt(e.target.value) })}
                    min="1"
                    max="1440"
                    className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                    Hour of Day
                  </label>
                  <input
                    type="number"
                    value={session.hourOfDay}
                    onChange={(e) => updateSession(index, { hourOfDay: parseInt(e.target.value) })}
                    min="0"
                    max="23"
                    className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                    Day of Weekend
                  </label>
                  <select
                    value={session.dayOfWeekend}
                    onChange={(e) => updateSession(index, { dayOfWeekend: parseInt(e.target.value) as 1 | 2 | 3 })}
                    className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                  >
                    <option value={1}>Friday</option>
                    <option value={2}>Saturday</option>
                    <option value={3}>Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                    Time Multiplier
                  </label>
                  <select
                    value={session.timeMultiplier}
                    onChange={(e) => updateSession(index, { timeMultiplier: parseInt(e.target.value) })}
                    className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                  >
                    <option value={1}>1x Real Time</option>
                    <option value={2}>2x Speed</option>
                    <option value={3}>3x Speed</option>
                    <option value={5}>5x Speed</option>
                    <option value={10}>10x Speed</option>
                    <option value={18}>18x Speed</option>
                    <option value={24}>24x Speed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Timing */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Event Timing
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Pre-Race Waiting Time (seconds)
            </label>
            <input
              type="number"
              value={event.preRaceWaitingTimeSeconds}
              onChange={(e) => setEvent({ ...event, preRaceWaitingTimeSeconds: parseInt(e.target.value) })}
              min="0"
              max="300"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Session Over Time (seconds)
            </label>
            <input
              type="number"
              value={event.sessionOverTimeSeconds}
              onChange={(e) => setEvent({ ...event, sessionOverTimeSeconds: parseInt(e.target.value) })}
              min="0"
              max="300"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isLoading ? "Saving..." : "Save Configuration"}
        </button>
        <button
          onClick={handleImport}
          className="inline-flex items-center rounded-md border border-stroke px-6 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Import JSON
        </button>
        <button
          onClick={handleExport}
          className="inline-flex items-center rounded-md border border-stroke px-6 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 7l3 3m0 0l3-3m-3 3V4" />
          </svg>
          Export JSON
        </button>
        
        <PushToServerButton
          configType="event"
          config={event}
          onSuccess={() => alert('Event configuration pushed to server successfully!')}
          onError={(error) => alert(`Failed to push to server: ${error}`)}
        />
      </div>
    </div>
  );
}