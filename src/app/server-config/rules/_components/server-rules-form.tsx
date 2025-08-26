"use client";

import { useState } from "react";
import { AccSettings } from "@/types/acc-config";
import { PushToServerButton } from "@/components/ui/push-to-server-button";

const defaultSettings: AccSettings = {
  serverName: "Brogus Weekend Race",
  adminPassword: "8822",
  spectatorPassword: "",
  password: "mangakorian",
  maxCarSlots: 24,
  carGroup: "FreeForAll",
  trackMedalsRequirement: 0,
  safetyRatingRequirement: -1,
  racecraftRatingRequirement: -1,
  spectatorSlots: 5,
  isRaceLocked: 1,
  randomizeTrackWhenEmpty: 0,
  centralEntryListPath: "",
  shortFormationLap: 0,
  allowAutoDQ: 1,
  dumpLeaderboards: 1,
  dumpEntryList: 0,
  isOpen: 1,
  maximumBallastKg: 0,
  restrictorPercentage: 0,
};

export function ServerRulesForm() {
  const [settings, setSettings] = useState<AccSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Server settings saved:", settings);
      // Here you would save to your backend or download as JSON
    } catch (error) {
      console.error("Failed to save settings:", error);
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
            setSettings({ ...defaultSettings, ...imported });
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
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "settings.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Server Identity */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Server Identity
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Server Name
            </label>
            <input
              type="text"
              value={settings.serverName}
              onChange={(e) => setSettings({ ...settings, serverName: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
              placeholder="My ACC Server"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Car Group
            </label>
            <select
              value={settings.carGroup}
              onChange={(e) => setSettings({ ...settings, carGroup: e.target.value as any })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              <option value="FreeForAll">FreeForAll - Any car allowed</option>
              <option value="GT3">GT3</option>
              <option value="GT4">GT4</option>
              <option value="GT2">GT2</option>
              <option value="GTC">GTC - Cup cars (Porsche Cup, Lamborghini ST, Ferrari CHL)</option>
              <option value="TCX">TCX - BMW M2 CS Racing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Access Control */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Access Control & Passwords
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Server Password
            </label>
            <input
              type="password"
              value={settings.password}
              onChange={(e) => setSettings({ ...settings, password: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
              placeholder="Leave empty for no password"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              Players need this password to join
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Admin Password
            </label>
            <input
              type="password"
              value={settings.adminPassword}
              onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
              placeholder="Admin access password"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              Required for server administration
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Spectator Password
            </label>
            <input
              type="password"
              value={settings.spectatorPassword}
              onChange={(e) => setSettings({ ...settings, spectatorPassword: e.target.value })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
              placeholder="Leave empty for no password"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Server Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isOpen"
                  checked={settings.isOpen === 1}
                  onChange={() => setSettings({ ...settings, isOpen: 1 })}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-sm text-dark dark:text-white">Public</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isOpen"
                  checked={settings.isOpen === 0}
                  onChange={() => setSettings({ ...settings, isOpen: 0 })}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-sm text-dark dark:text-white">Private</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Player Requirements */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Player Requirements
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Track Medals Required
            </label>
            <select
              value={settings.trackMedalsRequirement}
              onChange={(e) => setSettings({ ...settings, trackMedalsRequirement: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              <option value={0}>No requirement</option>
              <option value={1}>Bronze or higher</option>
              <option value={2}>Silver or higher</option>
              <option value={3}>Gold required</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Safety Rating Required
            </label>
            <input
              type="number"
              value={settings.safetyRatingRequirement}
              onChange={(e) => setSettings({ ...settings, safetyRatingRequirement: parseInt(e.target.value) })}
              min="-1"
              max="99"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              -1 for no requirement
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Racecraft Rating Required
            </label>
            <input
              type="number"
              value={settings.racecraftRatingRequirement}
              onChange={(e) => setSettings({ ...settings, racecraftRatingRequirement: parseInt(e.target.value) })}
              min="-1"
              max="99"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              -1 for no requirement
            </p>
          </div>
        </div>
      </div>

      {/* Server Capacity */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Server Capacity & Features
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Max Car Slots
            </label>
            <input
              type="number"
              value={settings.maxCarSlots}
              onChange={(e) => setSettings({ ...settings, maxCarSlots: parseInt(e.target.value) })}
              min="1"
              max="82"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Spectator Slots
            </label>
            <input
              type="number"
              value={settings.spectatorSlots}
              onChange={(e) => setSettings({ ...settings, spectatorSlots: parseInt(e.target.value) })}
              min="0"
              max="50"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.isRaceLocked === 1}
                  onChange={(e) => setSettings({ ...settings, isRaceLocked: e.target.checked ? 1 : 0 })}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-sm text-dark dark:text-white">Lock race once started</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.shortFormationLap === 1}
                  onChange={(e) => setSettings({ ...settings, shortFormationLap: e.target.checked ? 1 : 0 })}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-sm text-dark dark:text-white">Short formation lap</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.allowAutoDQ === 1}
                  onChange={(e) => setSettings({ ...settings, allowAutoDQ: e.target.checked ? 1 : 0 })}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-sm text-dark dark:text-white">Allow auto-disqualification</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Balancing */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Performance Balancing
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Maximum Ballast (kg)
            </label>
            <input
              type="number"
              value={settings.maximumBallastKg}
              onChange={(e) => setSettings({ ...settings, maximumBallastKg: parseInt(e.target.value) })}
              min="0"
              max="100"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              0 for no ballast restrictions
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Air Restrictor (%)
            </label>
            <input
              type="number"
              value={settings.restrictorPercentage}
              onChange={(e) => setSettings({ ...settings, restrictorPercentage: parseInt(e.target.value) })}
              min="0"
              max="50"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              0 for no power restriction
            </p>
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
          configType="settings"
          config={settings}
          onSuccess={() => alert('Server settings pushed to server successfully!')}
          onError={(error) => alert(`Failed to push to server: ${error}`)}
        />
      </div>
    </div>
  );
}