"use client";

import { useState } from "react";

interface DownloadOption {
  id: string;
  name: string;
  description: string;
  type: 'single' | 'bundle' | 'custom';
  configTypes?: string[];
  format?: string;
}

const downloadOptions: DownloadOption[] = [
  {
    id: 'bundle-all',
    name: 'Complete Configuration Bundle',
    description: 'Download all configuration files in a single bundle',
    type: 'bundle',
    format: 'json'
  },
  {
    id: 'single-configuration',
    name: 'Network Configuration',
    description: 'TCP/UDP ports and connection settings',
    type: 'single',
    configTypes: ['configuration']
  },
  {
    id: 'single-settings',
    name: 'Server Settings',
    description: 'Server name, passwords, and player requirements',
    type: 'single',
    configTypes: ['settings']
  },
  {
    id: 'single-event',
    name: 'Event Configuration',
    description: 'Track, weather, and session schedule',
    type: 'single',
    configTypes: ['event']
  },
  {
    id: 'single-eventrules',
    name: 'Race Rules',
    description: 'Pit stops, stint times, and race regulations',
    type: 'single',
    configTypes: ['eventRules']
  },
  {
    id: 'single-assistrules',
    name: 'Driving Assists',
    description: 'Allowed driving assistance systems',
    type: 'single',
    configTypes: ['assistRules']
  },
  {
    id: 'single-entrylist',
    name: 'Entry List',
    description: 'Driver entries and car assignments',
    type: 'single',
    configTypes: ['entrylist']
  }
];

export function FileDownloadManager() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [customSelection, setCustomSelection] = useState<string[]>([]);
  const [customName, setCustomName] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleDownload = async (option: DownloadOption) => {
    setIsDownloading(option.id);
    
    try {
      let url: string;
      
      if (option.type === 'bundle') {
        url = `/api/download?bundle=true&format=${option.format || 'json'}`;
      } else if (option.type === 'single' && option.configTypes?.[0]) {
        url = `/api/download?type=${option.configTypes[0]}&format=json`;
      } else {
        throw new Error('Invalid download option');
      }
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.click();
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleCustomDownload = async () => {
    if (customSelection.length === 0) {
      alert('Please select at least one configuration type');
      return;
    }
    
    setIsDownloading('custom');
    
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          types: customSelection,
          format: 'json',
          customName: customName || undefined
        })
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const result = await response.json();
      
      if (result.success && result.download) {
        // Create blob and download
        const blob = new Blob([result.download.content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.download.filename;
        link.click();
        URL.revokeObjectURL(url);
        
        // Reset custom selection
        setCustomSelection([]);
        setCustomName('');
        setShowCustom(false);
      }
      
    } catch (error) {
      console.error('Custom download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(null);
    }
  };

  const toggleCustomSelection = (configType: string) => {
    setCustomSelection(prev => 
      prev.includes(configType)
        ? prev.filter(t => t !== configType)
        : [...prev, configType]
    );
  };

  const configTypeNames: Record<string, string> = {
    configuration: 'Network Configuration',
    settings: 'Server Settings',
    event: 'Event Configuration',
    eventRules: 'Race Rules',
    assistRules: 'Driving Assists',
    entrylist: 'Entry List'
  };

  return (
    <div className="space-y-6">
      {/* Quick Downloads */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Download Configuration Files
          </h3>
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="text-sm text-primary hover:text-primary/80"
          >
            {showCustom ? 'Show Quick Downloads' : 'Custom Selection'}
          </button>
        </div>

        {!showCustom ? (
          /* Quick Download Options */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {downloadOptions.map((option) => (
              <div key={option.id} className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-stroke-dark dark:bg-dark-2">
                <div className="mb-3">
                  <h4 className="font-medium text-dark dark:text-white">{option.name}</h4>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{option.description}</p>
                </div>
                
                <button
                  onClick={() => handleDownload(option)}
                  disabled={isDownloading === option.id}
                  className="w-full inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {isDownloading === option.id ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      Download
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Custom Selection */
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Custom Bundle Name (optional)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., my-server-config"
                className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:ring-1 focus:ring-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Select Configuration Types
              </label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {Object.entries(configTypeNames).map(([type, name]) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customSelection.includes(type)}
                      onChange={() => toggleCustomSelection(type)}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-dark dark:text-white">{name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleCustomDownload}
                disabled={isDownloading === 'custom' || customSelection.length === 0}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {isDownloading === 'custom' ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating Bundle...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Download Custom Bundle ({customSelection.length})
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Download Info */}
      <div className="rounded-lg border border-blue/20 bg-blue/5 p-4 dark:bg-blue/10">
        <div className="flex">
          <svg className="mr-3 h-5 w-5 text-blue" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue">
            <p className="font-medium mb-1">Download Information</p>
            <ul className="space-y-1 text-xs">
              <li>• Configuration files are downloaded in JSON format</li>
              <li>• Bundles contain all selected configurations in a single file</li>
              <li>• Files can be imported back using the upload feature</li>
              <li>• Use custom selection for partial configurations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}