"use client";

import { useState } from "react";
import { AccConfigPreset } from "@/types/acc-config";

interface CreatePresetModalProps {
  onClose: () => void;
  onCreate: (preset: Partial<AccConfigPreset>) => void;
  existingTags: string[];
}

export function CreatePresetModal({ onClose, onCreate, existingTags }: CreatePresetModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleExistingTagClick = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Please enter a preset name");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onCreate(formData);
    } catch (error) {
      alert("Failed to create preset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-md rounded-lg border border-stroke bg-white shadow-xl dark:border-stroke-dark dark:bg-gray-dark">
        {/* Header */}
        <div className="border-b border-stroke p-6 dark:border-stroke-dark">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Create New Preset
            </h3>
            <button
              onClick={onClose}
              className="text-dark-4 hover:text-dark dark:text-dark-7 dark:hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
            Save your current server configuration as a reusable preset
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white">
                Preset Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Beginner Sprint Race"
                className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this configuration..."
                rows={3}
                className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
              />
            </div>

            {/* Public/Private */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-sm text-dark dark:text-white">
                  Make this preset public
                </span>
              </label>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                Public presets can be shared with other users
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white">
                Tags
              </label>
              <div className="mb-2 flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="flex-1 rounded-l-lg border border-r-0 border-stroke bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded-r-lg border border-stroke bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 dark:border-stroke-dark"
                >
                  Add
                </button>
              </div>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-primary-dark"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Existing Tags */}
              {existingTags.length > 0 && (
                <div>
                  <p className="mb-1 text-xs text-dark-5 dark:text-dark-6">
                    Click to add existing tags:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {existingTags
                      .filter(tag => !formData.tags.includes(tag))
                      .slice(0, 10)
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleExistingTagClick(tag)}
                          className="inline-flex items-center rounded-full bg-gray-1 px-2 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-4 rounded-lg bg-blue/5 p-3 dark:bg-blue/10">
            <div className="flex items-start space-x-2">
              <svg className="mt-0.5 h-4 w-4 text-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-xs text-blue">
                <p className="font-medium">Current configuration will be saved</p>
                <p>This will capture all your current server settings including network, rules, events, assists, and entry list.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                "Create Preset"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}