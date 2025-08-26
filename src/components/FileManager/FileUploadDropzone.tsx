"use client";

import { useState, useCallback } from "react";

interface FileUploadResult {
  filename: string;
  type: string;
  size: number;
  status: string;
  message: string;
}

interface FileUploadDropzoneProps {
  onUploadComplete?: (results: FileUploadResult[]) => void;
  onUploadError?: (errors: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export function FileUploadDropzone({
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSize = 5
}: FileUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    // Validate files
    const errors: string[] = [];
    const validFiles: File[] = [];

    files.forEach(file => {
      // Check file type
      if (!file.name.toLowerCase().endsWith('.json')) {
        errors.push(`${file.name}: Only JSON files are supported`);
        return;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds ${maxSize}MB limit`);
        return;
      }

      validFiles.push(file);
    });

    // Check max files limit
    if (validFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (errors.length > 0 && onUploadError) {
      onUploadError(errors);
      return;
    }

    setSelectedFiles(validFiles);
  }, [maxFiles, maxSize, onUploadError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, [handleFiles]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success || result.results?.length > 0) {
        if (onUploadComplete) {
          onUploadComplete(result.results || []);
        }
        setSelectedFiles([]);
      }

      if (result.errors?.length > 0 && onUploadError) {
        onUploadError(result.errors);
      }

    } catch (error) {
      if (onUploadError) {
        onUploadError(['Upload failed. Please try again.']);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-stroke hover:border-primary/50 dark:border-stroke-dark'
        }`}
      >
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-1 dark:bg-dark-2 flex items-center justify-center">
          <svg className="h-6 w-6 text-dark-4 dark:text-dark-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-dark dark:text-white">
          Upload Configuration Files
        </h3>
        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          Drag and drop your ACC configuration JSON files here, or click to select
        </p>
        
        <input
          type="file"
          multiple
          accept=".json"
          onChange={handleFileSelect}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-dark-5 dark:text-dark-6">
          <span>Supported: JSON files</span>
          <span>•</span>
          <span>Max size: {maxSize}MB each</span>
          <span>•</span>
          <span>Max files: {maxFiles}</span>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-dark dark:text-white">
              Selected Files ({selectedFiles.length})
            </h4>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-xs text-red hover:text-red-dark"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded bg-gray-1 p-2 dark:bg-dark-2">
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-dark dark:text-white">{file.name}</div>
                    <div className="text-xs text-dark-5 dark:text-dark-6">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-dark-4 hover:text-red dark:text-dark-7"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Files
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}