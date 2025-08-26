"use client";

import { useState } from "react";
import { AccConfigPreset } from "@/types/acc-config";

interface PresetCardProps {
  preset: AccConfigPreset;
  onLoad: () => void;
  onDelete: () => void;
}

export function PresetCard({ preset, onLoad, onDelete }: PresetCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleLoad = async () => {
    setIsLoading(true);
    try {
      await onLoad();
    } finally {
      setIsLoading(false);
    }
  };

  const getPresetTypeInfo = () => {
    const { settings, event, eventRules } = preset.config;
    
    // Determine preset type based on configuration
    const carGroup = settings?.carGroup || 'GT3';
    const isEndurance = eventRules?.mandatoryPitstopCount > 0 || (event?.sessions?.find(s => s.sessionType === 'R')?.sessionDurationMinutes || 0) > 60;
    const hasMandatoryStops = eventRules?.mandatoryPitstopCount > 0;
    const isPrivate = !preset.isPublic;
    
    return {
      carGroup,
      type: isEndurance ? 'Endurance' : 'Sprint',
      difficulty: hasMandatoryStops ? 'Advanced' : 'Beginner',
      visibility: isPrivate ? 'Private' : 'Public'
    };
  };

  const getConfigSummary = () => {
    const { settings, event, eventRules } = preset.config;
    const raceSession = event?.sessions?.find(s => s.sessionType === 'R');
    
    return {
      serverName: settings?.serverName || 'Unnamed Server',
      track: event?.track || 'Unknown',
      maxDrivers: settings?.maxCarSlots || 26,
      raceDuration: raceSession ? `${raceSession.sessionDurationMinutes}min` : 'N/A',
      mandatoryPits: eventRules?.mandatoryPitstopCount || 0,
      weather: event?.rain > 0.1 ? 'Wet' : event?.cloudLevel > 0.5 ? 'Cloudy' : 'Clear'
    };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const typeInfo = getPresetTypeInfo();
  const summary = getConfigSummary();

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      {/* Header */}
      <div className="border-b border-stroke p-4 dark:border-stroke-dark">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            {preset.name}
          </h3>
          <div className="flex items-center space-x-1">
            {preset.isPublic ? (
              <svg className="h-4 w-4 text-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-dark-4 dark:text-dark-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        {preset.description && (
          <p className="text-sm text-dark-5 dark:text-dark-6 mb-3">
            {preset.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {preset.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="p-4">
        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-dark-4 dark:text-dark-7">Type:</span>
            <span className="ml-1 font-medium text-dark dark:text-white">
              {typeInfo.carGroup} {typeInfo.type}
            </span>
          </div>
          <div>
            <span className="text-dark-4 dark:text-dark-7">Track:</span>
            <span className="ml-1 font-medium text-dark dark:text-white capitalize">
              {summary.track.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-dark-4 dark:text-dark-7">Duration:</span>
            <span className="ml-1 font-medium text-dark dark:text-white">
              {summary.raceDuration}
            </span>
          </div>
          <div>
            <span className="text-dark-4 dark:text-dark-7">Max Drivers:</span>
            <span className="ml-1 font-medium text-dark dark:text-white">
              {summary.maxDrivers}
            </span>
          </div>
        </div>

        {summary.mandatoryPits > 0 && (
          <div className="mb-4 rounded bg-yellow-dark/10 p-2 text-xs">
            <span className="font-medium text-yellow-dark">
              {summary.mandatoryPits} mandatory pit stop{summary.mandatoryPits > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mb-3 flex w-full items-center justify-between rounded bg-gray-1 p-2 text-xs font-medium text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
        >
          <span>Configuration Details</span>
          <svg 
            className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mb-4 space-y-2 rounded bg-gray-1 p-3 text-xs dark:bg-dark-2">
            <div className="flex justify-between">
              <span className="text-dark-4 dark:text-dark-7">Server Name:</span>
              <span className="font-medium text-dark dark:text-white">{summary.serverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-4 dark:text-dark-7">Weather:</span>
              <span className="font-medium text-dark dark:text-white">{summary.weather}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-4 dark:text-dark-7">Created:</span>
              <span className="font-medium text-dark dark:text-white">{formatDate(preset.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-4 dark:text-dark-7">Updated:</span>
              <span className="font-medium text-dark dark:text-white">{formatDate(preset.updatedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-4 dark:text-dark-7">Author:</span>
              <span className="font-medium text-dark dark:text-white">{preset.userId}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-stroke p-4 dark:border-stroke-dark">
        <div className="flex space-x-3">
          <button
            onClick={handleLoad}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Loading...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Load Preset
              </>
            )}
          </button>
          
          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center rounded-md border border-red px-3 py-2 text-sm font-medium text-red hover:bg-red/5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="mt-3 text-xs text-dark-5 dark:text-dark-6">
          <div className="flex items-center justify-between">
            <span>
              {typeInfo.visibility} • {typeInfo.difficulty}
            </span>
            <span>
              Updated {formatDate(preset.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}