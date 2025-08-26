"use client";

import { useState } from "react";
import { AccAssistRules } from "@/types/acc-config";

const defaultAssistRules: AccAssistRules = {
  stabilityControlLevelMin: 0,
  stabilityControlLevelMax: 100,
  disableAutosteer: 0,
  disableAutoLights: 0,
  disableAutoWiper: 0,
  disableAutoEngineStart: 0,
  disableAutoPitLimiter: 0,
  disableAutoGear: 0,
  disableAutoClutch: 0,
  disableIdealLine: 0
};

const assistInfo = {
  stabilityControl: {
    name: "Stability Control",
    description: "Electronic stability control system that helps prevent loss of control",
  },
  autosteer: {
    name: "Auto Steer",
    description: "Automatic steering assistance to help stay on track",
  },
  autoLights: {
    name: "Auto Lights",
    description: "Automatic headlight control based on track conditions",
  },
  autoWiper: {
    name: "Auto Wipers",
    description: "Automatic windshield wipers based on rain conditions",
  },
  autoEngineStart: {
    name: "Auto Engine Start",
    description: "Automatic engine restart after stalls",
  },
  autoPitLimiter: {
    name: "Auto Pit Limiter",
    description: "Automatic pit speed limiter activation in pit lane",
  },
  autoGear: {
    name: "Auto Transmission",
    description: "Automatic gear shifting",
  },
  autoClutch: {
    name: "Auto Clutch",
    description: "Automatic clutch operation",
  },
  idealLine: {
    name: "Ideal Racing Line",
    description: "Visual racing line guidance on track",
  }
};

export function AssistsConfigForm() {
  const [assistRules, setAssistRules] = useState<AccAssistRules>(defaultAssistRules);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Driving assists saved:", assistRules);
    } catch (error) {
      console.error("Failed to save assists:", error);
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
            setAssistRules({ ...defaultAssistRules, ...imported });
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
    const dataStr = JSON.stringify(assistRules, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "assistRules.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const getAssistStatus = (disabled: number) => {
    switch (disabled) {
      case 0:
        return { text: "Player Choice", color: "text-blue", bg: "bg-blue/10" };
      case 1:
        return { text: "Forbidden", color: "text-red", bg: "bg-red/10" };
      case 2:
        return { text: "Forced ON", color: "text-green", bg: "bg-green/10" };
      default:
        return { text: "Player Choice", color: "text-blue", bg: "bg-blue/10" };
    }
  };

  const renderAssistControl = (
    key: keyof AccAssistRules,
    info: { name: string; description: string },
    isSpecial = false
  ) => {
    if (isSpecial) {
      // Special handling for stability control with min/max
      return (
        <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-stroke-dark dark:bg-dark-2">
          <div className="mb-3">
            <h4 className="font-medium text-dark dark:text-white">{info.name}</h4>
            <p className="text-xs text-dark-5 dark:text-dark-6">{info.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                Minimum Level (%)
              </label>
              <input
                type="number"
                value={assistRules.stabilityControlLevelMin}
                onChange={(e) => setAssistRules({
                  ...assistRules,
                  stabilityControlLevelMin: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                })}
                min="0"
                max="100"
                className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                Maximum Level (%)
              </label>
              <input
                type="number"
                value={assistRules.stabilityControlLevelMax}
                onChange={(e) => setAssistRules({
                  ...assistRules,
                  stabilityControlLevelMax: Math.min(100, Math.max(assistRules.stabilityControlLevelMin || 0, parseInt(e.target.value) || 0))
                })}
                min={assistRules.stabilityControlLevelMin}
                max="100"
                className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
              />
            </div>
          </div>
          <div className="mt-2">
            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getAssistStatus(0).bg} ${getAssistStatus(0).color}`}>
              Range: {assistRules.stabilityControlLevelMin}% - {assistRules.stabilityControlLevelMax}%
            </span>
          </div>
        </div>
      );
    }

    const value = assistRules[key] as number;
    const status = getAssistStatus(value);

    return (
      <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-stroke-dark dark:bg-dark-2">
        <div className="mb-3">
          <h4 className="font-medium text-dark dark:text-white">{info.name}</h4>
          <p className="text-xs text-dark-5 dark:text-dark-6">{info.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <select
            value={value}
            onChange={(e) => setAssistRules({ ...assistRules, [key]: parseInt(e.target.value) })}
            className="rounded border border-stroke bg-white px-3 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          >
            <option value={0}>Player Choice</option>
            <option value={1}>Forbidden</option>
            <option value={2}>Forced ON</option>
          </select>
          <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${status.bg} ${status.color}`}>
            {status.text}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      <div className="rounded-lg border border-blue/20 bg-blue/5 p-4">
        <div className="flex">
          <svg className="mr-3 h-5 w-5 text-blue" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-dark dark:text-white">Driving Assists Configuration</h3>
            <div className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              <p><strong>Player Choice:</strong> Players can enable/disable the assist as they prefer</p>
              <p><strong>Forbidden:</strong> Assist is disabled for all players and cannot be enabled</p>
              <p><strong>Forced ON:</strong> Assist is enabled for all players and cannot be disabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Stability */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Vehicle Stability
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {renderAssistControl('stabilityControlLevelMin', assistInfo.stabilityControl, true)}
        </div>
      </div>

      {/* Driving Assists */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Driving Assistance
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderAssistControl('disableAutosteer', assistInfo.autosteer)}
          {renderAssistControl('disableAutoGear', assistInfo.autoGear)}
          {renderAssistControl('disableAutoClutch', assistInfo.autoClutch)}
          {renderAssistControl('disableIdealLine', assistInfo.idealLine)}
        </div>
      </div>

      {/* Vehicle Systems */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Vehicle Systems
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderAssistControl('disableAutoLights', assistInfo.autoLights)}
          {renderAssistControl('disableAutoWiper', assistInfo.autoWiper)}
          {renderAssistControl('disableAutoEngineStart', assistInfo.autoEngineStart)}
          {renderAssistControl('disableAutoPitLimiter', assistInfo.autoPitLimiter)}
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="rounded-lg border border-stroke bg-gray-1 p-6 dark:border-stroke-dark dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Assists Configuration Summary
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-dark dark:text-white">Player Choice</h4>
            <div className="space-y-1">
              {Object.entries(assistRules).filter(([key, value]) => 
                !key.includes('stabilityControl') && value === 0
              ).map(([key]) => {
                const assistKey = key.replace('disable', '').toLowerCase();
                const info = Object.values(assistInfo).find(assist => 
                  assist.name.toLowerCase().replace(/[^a-z]/g, '').includes(assistKey)
                );
                return (
                  <span key={key} className="block text-xs text-dark-5 dark:text-dark-6">
                    {info?.name || key}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="mb-2 text-sm font-semibold text-red">Forbidden</h4>
            <div className="space-y-1">
              {Object.entries(assistRules).filter(([key, value]) => 
                !key.includes('stabilityControl') && value === 1
              ).map(([key]) => {
                const assistKey = key.replace('disable', '').toLowerCase();
                const info = Object.values(assistInfo).find(assist => 
                  assist.name.toLowerCase().replace(/[^a-z]/g, '').includes(assistKey)
                );
                return (
                  <span key={key} className="block text-xs text-dark-5 dark:text-dark-6">
                    {info?.name || key}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="mb-2 text-sm font-semibold text-green">Forced ON</h4>
            <div className="space-y-1">
              {Object.entries(assistRules).filter(([key, value]) => 
                !key.includes('stabilityControl') && value === 2
              ).map(([key]) => {
                const assistKey = key.replace('disable', '').toLowerCase();
                const info = Object.values(assistInfo).find(assist => 
                  assist.name.toLowerCase().replace(/[^a-z]/g, '').includes(assistKey)
                );
                return (
                  <span key={key} className="block text-xs text-dark-5 dark:text-dark-6">
                    {info?.name || key}
                  </span>
                );
              })}
              <span className="block text-xs text-dark-5 dark:text-dark-6">
                Stability Control: {assistRules.stabilityControlLevelMin}-{assistRules.stabilityControlLevelMax}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Quick Presets
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setAssistRules({
              ...assistRules,
              disableAutosteer: 1,
              disableAutoLights: 0,
              disableAutoWiper: 0,
              disableAutoEngineStart: 0,
              disableAutoPitLimiter: 0,
              disableAutoGear: 0,
              disableAutoClutch: 0,
              disableIdealLine: 1,
              stabilityControlLevelMin: 0,
              stabilityControlLevelMax: 0
            })}
            className="rounded-md bg-red/10 px-3 py-2 text-sm font-medium text-red hover:bg-red/20"
          >
            Hardcore (No Assists)
          </button>
          <button
            onClick={() => setAssistRules({
              ...assistRules,
              disableAutosteer: 0,
              disableAutoLights: 0,
              disableAutoWiper: 0,
              disableAutoEngineStart: 0,
              disableAutoPitLimiter: 0,
              disableAutoGear: 0,
              disableAutoClutch: 0,
              disableIdealLine: 0,
              stabilityControlLevelMin: 0,
              stabilityControlLevelMax: 15
            })}
            className="rounded-md bg-yellow-dark/10 px-3 py-2 text-sm font-medium text-yellow-dark hover:bg-yellow-dark/20"
          >
            Competitive
          </button>
          <button
            onClick={() => setAssistRules({
              ...assistRules,
              disableAutosteer: 0,
              disableAutoLights: 2,
              disableAutoWiper: 2,
              disableAutoEngineStart: 2,
              disableAutoPitLimiter: 2,
              disableAutoGear: 0,
              disableAutoClutch: 0,
              disableIdealLine: 0,
              stabilityControlLevelMin: 0,
              stabilityControlLevelMax: 100
            })}
            className="rounded-md bg-green/10 px-3 py-2 text-sm font-medium text-green hover:bg-green/20"
          >
            Beginner Friendly
          </button>
          <button
            onClick={() => setAssistRules(defaultAssistRules)}
            className="rounded-md bg-blue/10 px-3 py-2 text-sm font-medium text-blue hover:bg-blue/20"
          >
            Reset to Default
          </button>
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
      </div>
    </div>
  );
}