"use client";

import { useState } from "react";
import { AccEventRules } from "@/types/acc-config";

const defaultEventRules: AccEventRules = {
  qualifyStandingType: 1,
  pitWindowLengthSec: -1,
  driverStintTimeSec: -1,
  mandatoryPitstopCount: 0,
  maxTotalDrivingTime: -1,
  maxDriversCount: 1,
  isRefuellingAllowedInRace: true,
  isRefuellingTimeFixed: false,
  isRefuellingRequiredInRace: false,
  isMandatoryPitstopRefuelRequired: true,
  isMandatoryPitstopTyreChangeRequired: false,
  isMandatoryPitstopSwapDriverRequired: false,
  tyreSetCount: 50
};

export function RaceRulesForm() {
  const [eventRules, setEventRules] = useState<AccEventRules>(defaultEventRules);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Race rules saved:", eventRules);
    } catch (error) {
      console.error("Failed to save race rules:", error);
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
            setEventRules({ ...defaultEventRules, ...imported });
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
    const dataStr = JSON.stringify(eventRules, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "eventRules.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    if (seconds === -1) return "No limit";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Qualifying Rules */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Qualifying Rules
        </h3>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Starting Grid Order
          </label>
          <select
            value={eventRules.qualifyStandingType}
            onChange={(e) => setEventRules({ ...eventRules, qualifyStandingType: parseInt(e.target.value) as 1 | 2 | 3 })}
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          >
            <option value={1}>Fastest Lap Time</option>
            <option value={2}>Reversed Grid</option>
            <option value={3}>Random Grid</option>
          </select>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            How drivers will be positioned on the starting grid
          </p>
        </div>
      </div>

      {/* Pit Stop Rules */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Pit Stop Rules
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Mandatory Pit Stops
            </label>
            <input
              type="number"
              value={eventRules.mandatoryPitstopCount}
              onChange={(e) => setEventRules({ ...eventRules, mandatoryPitstopCount: parseInt(e.target.value) })}
              min="0"
              max="10"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              0 = No mandatory pit stops required
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Pit Window Length (seconds)
            </label>
            <input
              type="number"
              value={eventRules.pitWindowLengthSec}
              onChange={(e) => setEventRules({ ...eventRules, pitWindowLengthSec: parseInt(e.target.value) })}
              min="-1"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              -1 = No pit window restrictions ({formatTime(eventRules.pitWindowLengthSec)})
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-semibold text-dark dark:text-white">Pit Stop Requirements</h4>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={eventRules.isMandatoryPitstopRefuelRequired}
                onChange={(e) => setEventRules({ ...eventRules, isMandatoryPitstopRefuelRequired: e.target.checked })}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm text-dark dark:text-white">Refueling required during mandatory pit stops</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={eventRules.isMandatoryPitstopTyreChangeRequired}
                onChange={(e) => setEventRules({ ...eventRules, isMandatoryPitstopTyreChangeRequired: e.target.checked })}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm text-dark dark:text-white">Tire change required during mandatory pit stops</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={eventRules.isMandatoryPitstopSwapDriverRequired}
                onChange={(e) => setEventRules({ ...eventRules, isMandatoryPitstopSwapDriverRequired: e.target.checked })}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm text-dark dark:text-white">Driver swap required during mandatory pit stops</span>
            </label>
          </div>
        </div>
      </div>

      {/* Refueling Rules */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Refueling Rules
        </h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={eventRules.isRefuellingAllowedInRace}
              onChange={(e) => setEventRules({ ...eventRules, isRefuellingAllowedInRace: e.target.checked })}
              className="mr-2 text-primary focus:ring-primary"
            />
            <span className="text-sm text-dark dark:text-white">Allow refueling during race</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={eventRules.isRefuellingTimeFixed}
              onChange={(e) => setEventRules({ ...eventRules, isRefuellingTimeFixed: e.target.checked })}
              className="mr-2 text-primary focus:ring-primary"
            />
            <span className="text-sm text-dark dark:text-white">Fixed refueling time (realistic fuel flow disabled)</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={eventRules.isRefuellingRequiredInRace}
              onChange={(e) => setEventRules({ ...eventRules, isRefuellingRequiredInRace: e.target.checked })}
              className="mr-2 text-primary focus:ring-primary"
            />
            <span className="text-sm text-dark dark:text-white">Refueling required at least once during race</span>
          </label>
        </div>
      </div>

      {/* Driver & Stint Rules */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Driver & Stint Rules
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Max Drivers per Car
            </label>
            <input
              type="number"
              value={eventRules.maxDriversCount}
              onChange={(e) => setEventRules({ ...eventRules, maxDriversCount: parseInt(e.target.value) })}
              min="1"
              max="4"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Driver Stint Time (seconds)
            </label>
            <input
              type="number"
              value={eventRules.driverStintTimeSec}
              onChange={(e) => setEventRules({ ...eventRules, driverStintTimeSec: parseInt(e.target.value) })}
              min="-1"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              -1 = No limit ({formatTime(eventRules.driverStintTimeSec)})
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Max Total Driving Time (seconds)
            </label>
            <input
              type="number"
              value={eventRules.maxTotalDrivingTime}
              onChange={(e) => setEventRules({ ...eventRules, maxTotalDrivingTime: parseInt(e.target.value) })}
              min="-1"
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              -1 = No limit ({formatTime(eventRules.maxTotalDrivingTime)})
            </p>
          </div>
        </div>
      </div>

      {/* Tire Rules */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Tire Rules
        </h3>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Tire Set Count per Driver
          </label>
          <input
            type="number"
            value={eventRules.tyreSetCount}
            onChange={(e) => setEventRules({ ...eventRules, tyreSetCount: parseInt(e.target.value) })}
            min="1"
            max="100"
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
          />
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            Number of tire sets available to each driver during the event
          </p>
        </div>
      </div>

      {/* Race Summary */}
      <div className="rounded-lg border border-stroke bg-gray-1 p-6 dark:border-stroke-dark dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Race Configuration Summary
        </h3>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-dark-5 dark:text-dark-6">Mandatory Pit Stops:</span>
              <span className="font-medium text-dark dark:text-white">
                {eventRules.mandatoryPitstopCount === 0 ? "None" : eventRules.mandatoryPitstopCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-5 dark:text-dark-6">Pit Window:</span>
              <span className="font-medium text-dark dark:text-white">
                {formatTime(eventRules.pitWindowLengthSec)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-5 dark:text-dark-6">Refueling Allowed:</span>
              <span className="font-medium text-dark dark:text-white">
                {eventRules.isRefuellingAllowedInRace ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-5 dark:text-dark-6">Max Drivers per Car:</span>
              <span className="font-medium text-dark dark:text-white">{eventRules.maxDriversCount}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-dark-5 dark:text-dark-6">Driver Stint Time:</span>
              <span className="font-medium text-dark dark:text-white">
                {formatTime(eventRules.driverStintTimeSec)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-5 dark:text-dark-6">Max Driving Time:</span>
              <span className="font-medium text-dark dark:text-white">
                {formatTime(eventRules.maxTotalDrivingTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-5 dark:text-dark-6">Starting Grid:</span>
              <span className="font-medium text-dark dark:text-white">
                {eventRules.qualifyStandingType === 1 ? "Fastest Lap" : 
                 eventRules.qualifyStandingType === 2 ? "Reversed" : "Random"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-5 dark:text-dark-6">Tire Sets:</span>
              <span className="font-medium text-dark dark:text-white">{eventRules.tyreSetCount}</span>
            </div>
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
      </div>
    </div>
  );
}