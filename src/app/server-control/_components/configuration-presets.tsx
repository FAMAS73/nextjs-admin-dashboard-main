"use client";

import { useState, useEffect } from "react";

interface ConfigurationPreset {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  configurations: {
    configuration: any;
    settings: any;
    event: any;
    eventRules: any;
    assistRules: any;
    entrylist: any;
  };
}

interface ConfigurationPresetsProps {
  onPresetLoaded?: () => void;
}

export function ConfigurationPresets({ onPresetLoaded }: ConfigurationPresetsProps) {
  const [presets, setPresets] = useState<ConfigurationPreset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savePresetName, setSavePresetName] = useState("");
  const [savePresetDescription, setSavePresetDescription] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // Load presets on component mount
  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/config-presets');
      const data = await response.json();
      
      if (data.success) {
        setPresets(data.data);
      } else {
        console.error('Failed to load presets:', data.error);
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentConfiguration = async () => {
    if (!savePresetName.trim()) {
      alert("Please enter a preset name");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/config-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          name: savePresetName.trim(),
          description: savePresetDescription.trim() || "Configuration preset"
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadPresets();
        setShowSaveDialog(false);
        setSavePresetName("");
        setSavePresetDescription("");
        alert("Configuration preset saved successfully!");
      } else {
        alert(`Failed to save preset: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to save preset. Please try again.");
      console.error('Save preset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = async (presetId: string) => {
    if (!presetId) return;

    if (!confirm("This will overwrite your current server configuration. Are you sure?")) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/config-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'load',
          presetId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Configuration preset loaded successfully!");
        if (onPresetLoaded) {
          onPresetLoaded();
        }
      } else {
        alert(`Failed to load preset: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to load preset. Please try again.");
      console.error('Load preset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePreset = async (presetId: string, presetName: string) => {
    if (!confirm(`Are you sure you want to delete the preset "${presetName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/config-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          presetId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadPresets();
        setSelectedPreset("");
        alert("Preset deleted successfully!");
      } else {
        alert(`Failed to delete preset: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to delete preset. Please try again.");
      console.error('Delete preset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Configuration Presets
        </h3>
        <button
          onClick={() => setShowSaveDialog(true)}
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Save Current
        </button>
      </div>

      {/* Preset Selection */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
          Select Preset
        </label>
        <div className="flex gap-2">
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark placeholder:text-dark-5 focus:border-primary focus:outline-none dark:border-stroke-dark dark:text-white dark:placeholder:text-dark-6"
          >
            <option value="">Choose a preset...</option>
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => loadPreset(selectedPreset)}
            disabled={!selectedPreset || isLoading}
            className="inline-flex items-center rounded-md bg-green px-3 py-2 text-sm font-medium text-white hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Load
          </button>
        </div>
      </div>

      {/* Preset Details */}
      {selectedPreset && (
        <div className="mb-4">
          {(() => {
            const preset = presets.find(p => p.id === selectedPreset);
            if (!preset) return null;
            
            return (
              <div className="rounded-md border border-stroke p-3 dark:border-stroke-dark">
                <div className="mb-2">
                  <h4 className="font-medium text-dark dark:text-white">{preset.name}</h4>
                  <p className="text-sm text-dark-5 dark:text-dark-6">{preset.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-dark-4 dark:text-dark-5">
                  <span>
                    Created: {new Date(preset.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deletePreset(preset.id, preset.name)}
                    disabled={isLoading}
                    className="text-red hover:text-red/80 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Preset List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-dark dark:text-white">
            Saved Presets ({presets.length})
          </h4>
          <button
            onClick={loadPresets}
            disabled={isLoading}
            className="text-sm text-primary hover:text-primary/80 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="mr-1 h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Loading...
              </span>
            ) : (
              "Refresh"
            )}
          </button>
        </div>

        <div className="max-h-48 space-y-1 overflow-y-auto">
          {presets.length === 0 ? (
            <p className="py-4 text-center text-sm text-dark-5 dark:text-dark-6">
              No presets saved yet. Click "Save Current" to create your first preset.
            </p>
          ) : (
            presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between rounded-md border border-stroke/50 p-2 hover:bg-gray-1 dark:border-stroke-dark/50 dark:hover:bg-gray-dark/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-dark dark:text-white">
                    {preset.name}
                  </p>
                  <p className="truncate text-xs text-dark-5 dark:text-dark-6">
                    {preset.description}
                  </p>
                </div>
                <div className="ml-2 flex items-center space-x-1">
                  <button
                    onClick={() => setSelectedPreset(preset.id)}
                    className="rounded-md p-1 text-dark-4 hover:bg-primary hover:text-white dark:text-dark-5"
                    title="Select preset"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save Preset Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Save Configuration Preset
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white">
                  Preset Name *
                </label>
                <input
                  type="text"
                  value={savePresetName}
                  onChange={(e) => setSavePresetName(e.target.value)}
                  placeholder="e.g., GT3 Sprint Race"
                  className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark placeholder:text-dark-5 focus:border-primary focus:outline-none dark:border-stroke-dark dark:text-white dark:placeholder:text-dark-6"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white">
                  Description (optional)
                </label>
                <textarea
                  value={savePresetDescription}
                  onChange={(e) => setSavePresetDescription(e.target.value)}
                  placeholder="Describe this configuration preset..."
                  rows={3}
                  className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm text-dark placeholder:text-dark-5 focus:border-primary focus:outline-none dark:border-stroke-dark dark:text-white dark:placeholder:text-dark-6"
                  maxLength={200}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setSavePresetName("");
                  setSavePresetDescription("");
                }}
                disabled={isLoading}
                className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 disabled:opacity-50 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentConfiguration}
                disabled={isLoading || !savePresetName.trim()}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Preset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}