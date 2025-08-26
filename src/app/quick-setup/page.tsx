"use client";

import { useState } from "react";
import { Stepper, StepperContent, StepperActions, Step } from "@/components/ui/stepper";
import { AccEvent, AccSettings, AccConfiguration } from "@/types/acc-config";

// Step Components
import { BasicConfigStep } from "./_components/basic-config-step";
import { ServerSettingsStep } from "./_components/server-settings-step";
import { EventConfigStep } from "./_components/event-config-step";
import { ReviewStep } from "./_components/review-step";

const steps: Step[] = [
  {
    id: "basic",
    title: "Basic Configuration",
    description: "Server name, password, and network settings"
  },
  {
    id: "server",
    title: "Server Settings",
    description: "Race rules, assists, and gameplay settings"
  },
  {
    id: "event",
    title: "Event Setup",
    description: "Track selection, weather, and session configuration"
  },
  {
    id: "review",
    title: "Review & Deploy",
    description: "Review configuration and start the server"
  }
];

// Default configurations
const defaultConfiguration: AccConfiguration = {
  tcpPort: 9232,
  udpPort: 9231,
  maxConnections: 26,
  registerToLobby: 1,
  password: "",
  adminPassword: "",
  spectatorPassword: "",
  centralEntryListPath: "",
  allowAutoDQ: 1,
  shortFormationLap: 1,
  dumpLeaderboards: 1,
  dumpEntryList: 1,
  isRaceLocked: 0,
  randomizeTrackWhenEmpty: 1,
  configVersion: 1
};

const defaultSettings: AccSettings = {
  serverName: "My ACC Server",
  password: "",
  adminPassword: "admin123",
  carGroup: "GT3",
  trackMedals: 0,
  safetyRating: 0,
  racecraftRating: 0,
  maxCarSlots: 30,
  spectatorSlots: 5,
  dumpLeaderboards: 1,
  randomizeTrackWhenEmpty: 1,
  allowAutoDQ: 1,
  shortFormationLap: 1,
  configVersion: 1
};

const defaultEvent: AccEvent = {
  track: "misano",
  eventType: "E_3h",
  preRaceWaitingTimeSeconds: 80,
  sessionOverTimeSeconds: 120,
  ambientTemp: 22,
  cloudLevel: 0.1,
  rain: 0.0,
  weatherRandomness: 1,
  configVersion: 1,
  sessions: [
    {
      hourOfDay: 12,
      dayOfWeekend: 2,
      timeMultiplier: 1,
      sessionType: "P",
      sessionDurationMinutes: 45
    },
    {
      hourOfDay: 13,
      dayOfWeekend: 2,
      timeMultiplier: 1,
      sessionType: "Q",
      sessionDurationMinutes: 15
    },
    {
      hourOfDay: 14,
      dayOfWeekend: 2,
      timeMultiplier: 1,
      sessionType: "R",
      sessionDurationMinutes: 20
    }
  ]
};

export default function QuickSetupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Configuration state
  const [configuration, setConfiguration] = useState<AccConfiguration>(defaultConfiguration);
  const [settings, setSettings] = useState<AccSettings>(defaultSettings);
  const [event, setEvent] = useState<AccEvent>(defaultEvent);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      "This will:\n" +
      "1. Save configuration to database\n" +
      "2. Update server configuration files\n" +
      "3. Start the ACC server\n\n" +
      "Are you sure you want to proceed?"
    );

    if (!confirmed) {
      setIsDeploying(false);
      return;
    }

    try {
      // Step 1: Save to database
      console.log("Saving configuration to database...");
      await fetch('/api/setup/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configuration,
          settings,
          event
        })
      });

      // Step 2: Push to server configuration files
      console.log("Updating server configuration files...");
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'all',
          config: {
            configuration,
            settings,
            event
          }
        })
      });

      // Step 3: Start server
      console.log("Starting ACC server...");
      const startResponse = await fetch('/api/admin/server-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });

      if (startResponse.ok) {
        alert("Server setup completed successfully!\nYour ACC server is now starting.");
        // Redirect to dashboard
        window.location.href = "/";
      } else {
        throw new Error('Failed to start server');
      }

    } catch (error) {
      console.error('Setup failed:', error);
      alert(`Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicConfigStep
            configuration={configuration}
            settings={settings}
            onChange={(updates) => {
              if ('tcpPort' in updates) {
                setConfiguration({ ...configuration, ...updates });
              } else {
                setSettings({ ...settings, ...updates });
              }
            }}
          />
        );
      case 1:
        return (
          <ServerSettingsStep
            settings={settings}
            onChange={setSettings}
          />
        );
      case 2:
        return (
          <EventConfigStep
            event={event}
            onChange={setEvent}
          />
        );
      case 3:
        return (
          <ReviewStep
            configuration={configuration}
            settings={settings}
            event={event}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-8">
        <h1 className="text-heading-3 font-bold text-dark dark:text-white">
          Quick Server Setup
        </h1>
        <p className="mt-2 text-body-sm text-dark-5 dark:text-dark-6">
          Set up your ACC server in a few simple steps. Configure basic settings, 
          server rules, and event details, then deploy everything at once.
        </p>
      </div>

      <Stepper steps={steps} currentStep={currentStep} className="mb-8" />

      <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <StepperContent className="p-6">
          {renderStepContent()}
        </StepperContent>

        <StepperActions className="border-t border-stroke px-6 py-4 dark:border-stroke-dark">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-gray-1 disabled:opacity-50 disabled:cursor-not-allowed dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2"
          >
            Previous
          </button>

          <div className="flex items-center space-x-3">
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="flex items-center space-x-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeploying && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <span>{isDeploying ? 'Deploying...' : 'Deploy & Start Server'}</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                Next
              </button>
            )}
          </div>
        </StepperActions>
      </div>
    </div>
  );
}