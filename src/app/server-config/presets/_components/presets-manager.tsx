"use client";

import { useState, useEffect } from "react";
import { AccConfigPreset } from "@/types/acc-config";
import { PresetCard } from "./preset-card";
import { CreatePresetModal } from "./create-preset-modal";

export function PresetsManager() {
  const [presets, setPresets] = useState<AccConfigPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "created" | "name">("updated");
  const [filterPublic, setFilterPublic] = useState<"all" | "public" | "private">("all");

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/presets');
      const data = await response.json();
      
      if (data.success) {
        setPresets(data.data);
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    if (!confirm('Are you sure you want to delete this preset?')) return;
    
    try {
      const response = await fetch(`/api/presets?id=${presetId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPresets(prev => prev.filter(p => p.id !== presetId));
      }
    } catch (error) {
      console.error('Failed to delete preset:', error);
    }
  };

  const handleLoadPreset = async (preset: AccConfigPreset) => {
    try {
      // Apply each configuration section
      const configSections = ['configuration', 'settings', 'event', 'eventRules', 'assistRules', 'entrylist'];
      
      for (const section of configSections) {
        if (preset.config[section as keyof typeof preset.config]) {
          await fetch(`/api/config?type=${section}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preset.config[section as keyof typeof preset.config]),
          });
        }
      }
      
      alert(`Preset "${preset.name}" loaded successfully! You can now start your server with these settings.`);
    } catch (error) {
      console.error('Failed to load preset:', error);
      alert('Failed to load preset. Please try again.');
    }
  };

  const handleCreatePreset = async (presetData: Partial<AccConfigPreset>) => {
    try {
      // Get current configuration
      const response = await fetch('/api/config');
      const configData = await response.json();
      
      if (!configData.success) {
        alert('Failed to get current configuration');
        return;
      }
      
      const newPreset = {
        ...presetData,
        config: configData.data,
        userId: 'admin', // In production, this would be the logged-in user
      };
      
      const createResponse = await fetch('/api/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreset),
      });
      
      if (createResponse.ok) {
        const createdPreset = await createResponse.json();
        setPresets(prev => [createdPreset.data, ...prev]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Failed to create preset:', error);
    }
  };

  // Get all unique tags
  const allTags = Array.from(new Set(presets.flatMap(p => p.tags))).sort();

  // Filter and sort presets
  const filteredPresets = presets.filter(preset => {
    // Text search
    const matchesSearch = searchTerm === '' || 
      preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tag filter
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => preset.tags.includes(tag));
    
    // Public/private filter
    const matchesPublic = filterPublic === 'all' ||
      (filterPublic === 'public' && preset.isPublic) ||
      (filterPublic === 'private' && !preset.isPublic);
    
    return matchesSearch && matchesTags && matchesPublic;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'updated':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Manage Presets
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Preset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
              Search Presets
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-stroke bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full rounded border border-stroke bg-white px-3 py-2 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Public/Private Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
              Visibility
            </label>
            <select
              value={filterPublic}
              onChange={(e) => setFilterPublic(e.target.value as typeof filterPublic)}
              className="w-full rounded border border-stroke bg-white px-3 py-2 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              <option value="all">All Presets</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
              Filter by Tags
            </label>
            <div className="max-h-16 overflow-y-auto rounded border border-stroke bg-white p-2 dark:border-stroke-dark dark:bg-dark">
              {allTags.map(tag => (
                <label key={tag} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags(prev => [...prev, tag]);
                      } else {
                        setSelectedTags(prev => prev.filter(t => t !== tag));
                      }
                    }}
                    className="mr-1 text-primary focus:ring-primary"
                  />
                  <span className="text-dark dark:text-white">{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedTags.length > 0 || filterPublic !== 'all') && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-dark dark:text-white">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center rounded-full bg-blue/10 px-2 py-1 text-xs font-medium text-blue">
                Search: &quot;{searchTerm}&quot;
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-blue-dark"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center rounded-full bg-green/10 px-2 py-1 text-xs font-medium text-green">
                {tag}
                <button
                  onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                  className="ml-1 hover:text-green-dark"
                >
                  ×
                </button>
              </span>
            ))}
            {filterPublic !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-yellow-dark/10 px-2 py-1 text-xs font-medium text-yellow-dark">
                {filterPublic === 'public' ? 'Public' : 'Private'} only
                <button
                  onClick={() => setFilterPublic('all')}
                  className="ml-1 hover:text-yellow-dark/80"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-primary">{presets.length}</div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Total Presets</div>
        </div>
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-green">{presets.filter(p => p.isPublic).length}</div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Public Presets</div>
        </div>
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-yellow-dark">{allTags.length}</div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Unique Tags</div>
        </div>
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-blue">{filteredPresets.length}</div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Filtered Results</div>
        </div>
      </div>

      {/* Presets Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-dark-5 dark:text-dark-6">Loading presets...</p>
          </div>
        </div>
      ) : filteredPresets.length === 0 ? (
        <div className="rounded-lg border border-stroke bg-white p-12 text-center shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-1 dark:bg-dark-2 flex items-center justify-center">
            <svg className="h-6 w-6 text-dark-4 dark:text-dark-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark dark:text-white">No presets found</h3>
          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            {presets.length === 0 
              ? "Create your first configuration preset to get started."
              : "Try adjusting your filters to see more presets."
            }
          </p>
          {presets.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Create Your First Preset
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onLoad={() => handleLoadPreset(preset)}
              onDelete={() => handleDeletePreset(preset.id)}
            />
          ))}
        </div>
      )}

      {/* Create Preset Modal */}
      {showCreateModal && (
        <CreatePresetModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePreset}
          existingTags={allTags}
        />
      )}
    </div>
  );
}