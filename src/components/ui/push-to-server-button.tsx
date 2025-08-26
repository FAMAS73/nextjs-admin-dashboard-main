"use client";

import { useState } from "react";

interface PushToServerButtonProps {
  configType: string;
  config: any;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function PushToServerButton({ 
  configType, 
  config, 
  onSuccess, 
  onError, 
  className = "" 
}: PushToServerButtonProps) {
  const [isPushing, setIsPushing] = useState(false);

  const handlePushToServer = async () => {
    setIsPushing(true);
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: configType,
          config
        }),
      });

      if (response.ok) {
        onSuccess?.();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to push configuration to server');
      }
    } catch (error) {
      console.error('Error pushing to server:', error);
      onError?.(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <button
      onClick={handlePushToServer}
      disabled={isPushing}
      className={`flex items-center space-x-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isPushing && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <span>{isPushing ? 'Pushing...' : 'Push to Server'}</span>
    </button>
  );
}