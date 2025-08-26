"use client";

import { useState } from "react";
import { FileUploadDropzone } from "@/components/FileManager/FileUploadDropzone";
import { FileDownloadManager } from "@/components/FileManager/FileDownloadManager";

interface UploadResult {
  filename: string;
  type: string;
  size: number;
  status: string;
  message: string;
}

export function FileManager() {
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleUploadComplete = (results: UploadResult[]) => {
    setUploadResults(results);
    setShowResults(true);
    
    // Show success notification
    if (results.length > 0) {
      const successCount = results.filter(r => r.status === 'success').length;
      if (successCount > 0) {
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setShowResults(false);
        }, 5000);
      }
    }
  };

  const handleUploadError = (errors: string[]) => {
    setUploadErrors(errors);
    
    // Auto-clear errors after 10 seconds
    setTimeout(() => {
      setUploadErrors([]);
    }, 10000);
  };

  const clearResults = () => {
    setUploadResults([]);
    setUploadErrors([]);
    setShowResults(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConfigTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      configuration: 'bg-blue/10 text-blue',
      settings: 'bg-green/10 text-green',
      event: 'bg-yellow-dark/10 text-yellow-dark',
      eventRules: 'bg-red/10 text-red',
      assistRules: 'bg-primary/10 text-primary',
      entrylist: 'bg-orange-light/10 text-orange-light'
    };
    return colors[type] || 'bg-gray/10 text-gray';
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Import Configuration Files
        </h2>
        <FileUploadDropzone
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          maxFiles={10}
          maxSize={5}
        />
      </div>

      {/* Upload Results */}
      {(showResults && uploadResults.length > 0) && (
        <div className="rounded-lg border border-green bg-green/5 p-4 dark:bg-green/10">
          <div className="flex items-start justify-between">
            <div className="flex">
              <svg className="mr-3 h-5 w-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-green">Upload Successful</h3>
                <div className="mt-2 space-y-2">
                  {uploadResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-dark dark:text-white">{result.filename}</span>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getConfigTypeColor(result.type)}`}>
                          {result.type}
                        </span>
                        <span className="text-dark-5 dark:text-dark-6">({formatFileSize(result.size)})</span>
                      </div>
                      <span className="text-green">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={clearResults}
              className="text-green hover:text-green-dark"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <div className="rounded-lg border border-red bg-red/5 p-4 dark:bg-red/10">
          <div className="flex items-start justify-between">
            <div className="flex">
              <svg className="mr-3 h-5 w-5 text-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red">Upload Errors</h3>
                <div className="mt-2 space-y-1">
                  {uploadErrors.map((error, index) => (
                    <p key={index} className="text-sm text-red">{error}</p>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setUploadErrors([])}
              className="text-red hover:text-red-dark"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Download Section */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Export Configuration Files
        </h2>
        <FileDownloadManager />
      </div>

      {/* File Management Tips */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          File Management Tips
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-dark dark:text-white">Import Guidelines</h4>
            <ul className="space-y-1 text-sm text-dark-5 dark:text-dark-6">
              <li>• Only JSON files are supported</li>
              <li>• Files are automatically validated</li>
              <li>• Configuration type is detected automatically</li>
              <li>• Existing configurations will be overwritten</li>
              <li>• Invalid files will be rejected with error details</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-dark dark:text-white">Export Options</h4>
            <ul className="space-y-1 text-sm text-dark-5 dark:text-dark-6">
              <li>• Download individual configuration files</li>
              <li>• Create complete configuration bundles</li>
              <li>• Custom selection for specific configurations</li>
              <li>• All exports are in ACC-compatible JSON format</li>
              <li>• Use presets for frequently used configurations</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded bg-yellow-dark/10 p-3">
          <div className="flex">
            <svg className="mr-2 h-4 w-4 text-yellow-dark" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-yellow-dark">
              <p className="font-medium">Important:</p>
              <p>Always backup your existing configuration files before importing new ones. Server restart may be required for changes to take effect.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}