"use client";

import { AccConfiguration, AccSettings, AccEvent } from "@/types/acc-config";

interface ReviewStepProps {
  configuration: AccConfiguration;
  settings: AccSettings;
  event: AccEvent;
}

const trackNames: Record<string, string> = {
  spa: "Spa-Francorchamps",
  monza: "Monza",
  silverstone: "Silverstone",
  nurburgring: "Nürburgring",
  imola: "Imola",
  brands_hatch: "Brands Hatch",
  misano: "Misano",
  paul_ricard: "Paul Ricard",
  hungaroring: "Hungaroring",
  zandvoort: "Zandvoort",
  barcelona: "Barcelona",
  kyalami: "Kyalami",
  mount_panorama: "Mount Panorama",
  suzuka: "Suzuka",
  laguna_seca: "Laguna Seca"
};

export function ReviewStep({ configuration, settings, event }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Review & Deploy
        </h2>
        <p className="text-sm text-dark-5 dark:text-dark-6 mb-6">
          Review your server configuration before deploying. This will save your settings, update the server files, and start your ACC server.
        </p>
      </div>

      {/* Server Overview */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="text-md font-semibold text-dark dark:text-white mb-4">
          Server Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Server Name:</span>
            <p className="text-sm font-medium text-dark dark:text-white">{settings.serverName}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Track:</span>
            <p className="text-sm font-medium text-dark dark:text-white">
              {trackNames[event.track] || event.track}
            </p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Max Players:</span>
            <p className="text-sm font-medium text-dark dark:text-white">{configuration.maxConnections}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Car Group:</span>
            <p className="text-sm font-medium text-dark dark:text-white">{settings.carGroup}</p>
          </div>
        </div>
      </div>

      {/* Network Configuration */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="text-md font-semibold text-dark dark:text-white mb-4">
          Network Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">TCP Port:</span>
            <p className="text-sm font-medium text-dark dark:text-white">{configuration.tcpPort}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">UDP Port:</span>
            <p className="text-sm font-medium text-dark dark:text-white">{configuration.udpPort}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Public Lobby:</span>
            <p className="text-sm font-medium text-dark dark:text-white">
              {configuration.registerToLobby ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Weather & Event */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="text-md font-semibold text-dark dark:text-white mb-4">
          Weather & Event Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Temperature:</span>
            <p className="text-sm font-medium text-dark dark:text-white">{event.ambientTemp}°C</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Event Type:</span>
            <p className="text-sm font-medium text-dark dark:text-white">{event.eventType}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Cloud Level:</span>
            <p className="text-sm font-medium text-dark dark:text-white">{(event.cloudLevel * 100).toFixed(0)}%</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Rain Level:</span>
            <p className="text-sm font-medium text-dark dark:text-white">{(event.rain * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Session Schedule */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="text-md font-semibold text-dark dark:text-white mb-4">
          Session Schedule
        </h3>
        
        <div className="space-y-3">
          {event.sessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-stroke last:border-b-0 dark:border-stroke-dark">
              <div className="flex items-center space-x-4">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white ${
                  session.sessionType === 'P' ? 'bg-blue-500' :
                  session.sessionType === 'Q' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}>
                  {session.sessionType}
                </span>
                <span className="text-sm font-medium text-dark dark:text-white">
                  {session.sessionType === 'P' ? 'Practice' :
                   session.sessionType === 'Q' ? 'Qualifying' :
                   'Race'}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-dark-5 dark:text-dark-6">
                <span>{session.sessionDurationMinutes} min</span>
                <span>{session.hourOfDay}:00</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Actions */}
      <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 dark:bg-yellow-900/20 dark:border-yellow-800">
        <div className="flex">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Ready to Deploy
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>Clicking "Deploy & Start Server" will:</p>
              <ul className="mt-1 list-disc pl-5">
                <li>Save your configuration to the database</li>
                <li>Update ACC server configuration files</li>
                <li>Start your ACC dedicated server</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}