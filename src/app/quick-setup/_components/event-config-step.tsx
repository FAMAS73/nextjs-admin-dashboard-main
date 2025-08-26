"use client";

import { AccEvent } from "@/types/acc-config";

interface EventConfigStepProps {
  event: AccEvent;
  onChange: (updates: Partial<AccEvent>) => void;
}

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
  zandvoort: "Zandvoort",
  barcelona: "Barcelona",
  kyalami: "Kyalami",
  mount_panorama: "Mount Panorama",
  suzuka: "Suzuka",
  laguna_seca: "Laguna Seca"
};

export function EventConfigStep({ event, onChange }: EventConfigStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Event Configuration
        </h2>
        <p className="text-sm text-dark-5 dark:text-dark-6 mb-6">
          Configure track selection, weather conditions, and session schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Track Selection */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Track
          </label>
          <select
            value={event.track}
            onChange={(e) => onChange({ track: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          >
            {Object.entries(trackNames).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Event Type
          </label>
          <select
            value={event.eventType}
            onChange={(e) => onChange({ eventType: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          >
            <option value="E_3h">3 Hour Endurance</option>
            <option value="E_6h">6 Hour Endurance</option>
            <option value="E_12h">12 Hour Endurance</option>
            <option value="E_24h">24 Hour Endurance</option>
            <option value="Sprint">Sprint Race</option>
            <option value="Championship">Championship</option>
          </select>
        </div>
      </div>

      {/* Weather Configuration */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-dark dark:text-white">
          Weather Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Ambient Temperature (°C)
            </label>
            <input
              type="number"
              min="0"
              max="40"
              value={event.ambientTemp}
              onChange={(e) => onChange({ ambientTemp: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Cloud Level (0-1)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={event.cloudLevel}
              onChange={(e) => onChange({ cloudLevel: parseFloat(e.target.value) })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Rain Level (0-1)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={event.rain}
              onChange={(e) => onChange({ rain: parseFloat(e.target.value) })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Weather Randomness (0-7)
            </label>
            <input
              type="number"
              min="0"
              max="7"
              value={event.weatherRandomness}
              onChange={(e) => onChange({ weatherRandomness: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Session Timing */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-dark dark:text-white">
          Session Timing
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Pre-Race Waiting Time (seconds)
            </label>
            <input
              type="number"
              min="0"
              max="300"
              value={event.preRaceWaitingTimeSeconds}
              onChange={(e) => onChange({ preRaceWaitingTimeSeconds: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Session Over Time (seconds)
            </label>
            <input
              type="number"
              min="0"
              max="300"
              value={event.sessionOverTimeSeconds}
              onChange={(e) => onChange({ sessionOverTimeSeconds: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Quick Session Setup Note */}
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Session Configuration
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>Default sessions will be created: Practice (45min), Qualifying (15min), Race (20min). You can customize these later in the detailed configuration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}