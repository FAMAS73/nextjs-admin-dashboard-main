import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Server Configuration",
  description: "Configure your ACC server settings, network, rules, and race events.",
};

export default function ServerConfigPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Server Configuration
        </h1>
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          Configure all aspects of your ACC server including network settings, rules, events, and driver management.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Network Settings */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue/10">
              <svg className="h-6 w-6 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Network Settings
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Configure TCP/UDP ports and connection limits
            </p>
          </div>
          <a
            href="/server-config/network"
            className="inline-flex items-center text-sm font-medium text-blue hover:text-blue-dark"
          >
            Configure Network
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Server Rules */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green/10">
              <svg className="h-6 w-6 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Server Rules
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Set server name, passwords, and access requirements
            </p>
          </div>
          <a
            href="/server-config/rules"
            className="inline-flex items-center text-sm font-medium text-green hover:text-green-dark"
          >
            Configure Rules
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Event & Weather */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-dark/10">
              <svg className="h-6 w-6 text-yellow-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Event & Weather
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Choose track, configure weather and session schedule
            </p>
          </div>
          <a
            href="/server-config/event"
            className="inline-flex items-center text-sm font-medium text-yellow-dark hover:opacity-80"
          >
            Configure Event
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Race Rules */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red/10">
              <svg className="h-6 w-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Race Rules
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Configure pit stops, stint times, and race regulations
            </p>
          </div>
          <a
            href="/server-config/race-rules"
            className="inline-flex items-center text-sm font-medium text-red hover:text-red-dark"
          >
            Configure Race Rules
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Driving Assists */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Driving Assists
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Control which driving aids are allowed or forced
            </p>
          </div>
          <a
            href="/server-config/assists"
            className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
          >
            Configure Assists
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Entry List */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-light/10">
              <svg className="h-6 w-6 text-orange-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Entry List
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Manage drivers, car assignments, and restrictions
            </p>
          </div>
          <a
            href="/server-config/entry-list"
            className="inline-flex items-center text-sm font-medium text-orange-light hover:opacity-80"
          >
            Manage Drivers
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Configuration Actions */}
      <div className="mt-8 rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Configuration Management
        </h3>
        <div className="flex flex-wrap gap-4">
          <a
            href="/server-config/files"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import/Export Files
          </a>
          <a
            href="/server-config/presets"
            className="inline-flex items-center rounded-md border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Manage Presets
          </a>
        </div>
      </div>
    </div>
  );
}