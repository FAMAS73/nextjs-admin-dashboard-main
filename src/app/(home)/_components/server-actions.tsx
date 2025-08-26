"use client";

import { useState } from "react";

export function ServerActions() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setIsLoading(action);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(null);
    console.log(`Server ${action} action triggered`);
  };

  const actions = [
    {
      id: "start",
      label: "Start Server",
      description: "Start the ACC server process",
      icon: "play",
      className: "bg-green hover:bg-green-dark text-white",
      disabled: false,
    },
    {
      id: "stop", 
      label: "Stop Server",
      description: "Stop the ACC server process",
      icon: "stop",
      className: "bg-red hover:bg-red-dark text-white",
      disabled: false,
    },
    {
      id: "restart",
      label: "Restart Server", 
      description: "Restart the ACC server process",
      icon: "refresh",
      className: "bg-yellow-dark hover:opacity-80 text-white",
      disabled: false,
    },
  ];

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        Server Control
      </h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            disabled={isLoading !== null || action.disabled}
            className={`w-full rounded-lg px-4 py-3 text-left transition disabled:opacity-50 disabled:cursor-not-allowed ${action.className}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{action.label}</p>
                <p className="text-sm opacity-80">{action.description}</p>
              </div>
              {isLoading === action.id ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  {action.icon === "play" && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                  {action.icon === "stop" && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h12v12H6z"/>
                    </svg>
                  )}
                  {action.icon === "refresh" && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-gray-1 p-4 dark:bg-dark-2">
        <h4 className="mb-2 text-sm font-semibold text-dark dark:text-white">Server Info</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-4 dark:text-dark-7">Server Path:</span>
            <span className="font-mono text-xs text-dark dark:text-white truncate max-w-32">
              ...Dedicated Server/server
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-4 dark:text-dark-7">Track:</span>
            <span className="font-mono text-dark dark:text-white">Paul Ricard</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-4 dark:text-dark-7">Max Connections:</span>
            <span className="font-mono text-dark dark:text-white">10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-4 dark:text-dark-7">TCP/UDP Ports:</span>
            <span className="font-mono text-dark dark:text-white">9231/9232</span>
          </div>
        </div>
      </div>
    </div>
  );
}