"use client";

import { AccSettings } from "@/types/acc-config";

interface ServerSettingsStepProps {
  settings: AccSettings;
  onChange: (updates: Partial<AccSettings>) => void;
}

export function ServerSettingsStep({ settings, onChange }: ServerSettingsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Server Settings
        </h2>
        <p className="text-sm text-dark-5 dark:text-dark-6 mb-6">
          Configure race rules, assists, and gameplay settings for your server.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Car Group */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Car Group
          </label>
          <select
            value={settings.carGroup}
            onChange={(e) => onChange({ carGroup: e.target.value as any })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          >
            <option value="GT3">GT3</option>
            <option value="GT4">GT4</option>
            <option value="GT2">GT2</option>
            <option value="GTC">GTC</option>
            <option value="TCX">TCX</option>
          </select>
        </div>

        {/* Max Car Slots */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Max Car Slots
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={settings.maxCarSlots}
            onChange={(e) => onChange({ maxCarSlots: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          />
        </div>

        {/* Spectator Slots */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Spectator Slots
          </label>
          <input
            type="number"
            min="0"
            max="20"
            value={settings.spectatorSlots}
            onChange={(e) => onChange({ spectatorSlots: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          />
        </div>

        {/* Track Medals Requirement */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Track Medals Required
          </label>
          <select
            value={settings.trackMedals}
            onChange={(e) => onChange({ trackMedals: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          >
            <option value={0}>None</option>
            <option value={1}>Bronze or better</option>
            <option value={2}>Silver or better</option>
            <option value={3}>Gold required</option>
          </select>
        </div>

        {/* Safety Rating */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Minimum Safety Rating
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings.safetyRating}
            onChange={(e) => onChange({ safetyRating: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          />
        </div>

        {/* Racecraft Rating */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Minimum Racecraft Rating
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings.racecraftRating}
            onChange={(e) => onChange({ racecraftRating: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          />
        </div>
      </div>

      {/* Server Options */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-dark dark:text-white">
          Server Options
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="dumpLeaderboards"
              checked={settings.dumpLeaderboards === 1}
              onChange={(e) => onChange({ dumpLeaderboards: e.target.checked ? 1 : 0 })}
              className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-stroke-dark"
            />
            <label htmlFor="dumpLeaderboards" className="text-sm font-medium text-dark dark:text-white">
              Save Leaderboards
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="randomizeTrack"
              checked={settings.randomizeTrackWhenEmpty === 1}
              onChange={(e) => onChange({ randomizeTrackWhenEmpty: e.target.checked ? 1 : 0 })}
              className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-stroke-dark"
            />
            <label htmlFor="randomizeTrack" className="text-sm font-medium text-dark dark:text-white">
              Randomize Track When Empty
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="allowAutoDQ"
              checked={settings.allowAutoDQ === 1}
              onChange={(e) => onChange({ allowAutoDQ: e.target.checked ? 1 : 0 })}
              className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-stroke-dark"
            />
            <label htmlFor="allowAutoDQ" className="text-sm font-medium text-dark dark:text-white">
              Allow Auto Disqualification
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="shortFormationLap"
              checked={settings.shortFormationLap === 1}
              onChange={(e) => onChange({ shortFormationLap: e.target.checked ? 1 : 0 })}
              className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-stroke-dark"
            />
            <label htmlFor="shortFormationLap" className="text-sm font-medium text-dark dark:text-white">
              Short Formation Lap
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}