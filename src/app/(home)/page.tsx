import { Suspense } from "react";
import { ServerStatusCards } from "./_components/server-status-cards";
import { ServerStatusSkeleton } from "./_components/server-status-skeleton";
import { CurrentSessionInfo } from "./_components/current-session-info";
import { ConnectedDriversList } from "./_components/connected-drivers";
import { ServerMetrics } from "./_components/server-metrics";
import { ServerActions } from "./_components/server-actions";

export default function ServerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          ACC Server Dashboard
        </h1>
        <p className="mt-2 text-body-sm text-dark-5 dark:text-dark-6">
          Monitor and control your Assetto Corsa Competizione server in real-time
        </p>
      </div>

      {/* Server Status Cards */}
      <Suspense fallback={<ServerStatusSkeleton />}>
        <ServerStatusCards />
      </Suspense>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current Session Info */}
        <div className="lg:col-span-2">
          <CurrentSessionInfo />
        </div>

        {/* Server Actions */}
        <div>
          <ServerActions />
        </div>
      </div>

      {/* Server Metrics and Connected Drivers */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Server Performance Metrics */}
        <ServerMetrics />

        {/* Connected Drivers */}
        <ConnectedDriversList />
      </div>

      {/* Quick Links */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/server-config"
            className="flex items-center space-x-3 rounded-lg border border-stroke p-4 transition hover:bg-gray-1 dark:border-stroke-dark dark:hover:bg-dark-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-dark dark:text-white">Configuration</p>
              <p className="text-sm text-dark-4 dark:text-dark-7">Server settings</p>
            </div>
          </a>

          <a
            href="/live-timing"
            className="flex items-center space-x-3 rounded-lg border border-stroke p-4 transition hover:bg-gray-1 dark:border-stroke-dark dark:hover:bg-dark-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green/10">
              <svg className="h-5 w-5 text-green" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25zM2.75 12a9.25 9.25 0 1118.5 0 9.25 9.25 0 01-18.5 0z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.69l3.22 3.22a.75.75 0 11-1.06 1.06L11.47 12.28a.75.75 0 01-.22-.53V6a.75.75 0 01.75-.75z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-dark dark:text-white">Live Timing</p>
              <p className="text-sm text-dark-4 dark:text-dark-7">Real-time data</p>
            </div>
          </a>

          <a
            href="/race-results"
            className="flex items-center space-x-3 rounded-lg border border-stroke p-4 transition hover:bg-gray-1 dark:border-stroke-dark dark:hover:bg-dark-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-dark/10">
              <svg className="h-5 w-5 text-yellow-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 2.75a.75.75 0 00-1.5 0v18.5a.75.75 0 001.5 0v-7.939l1.22-.305c1.074-.269 2.156-.269 3.23 0l.55.138c1.074.268 2.156.268 3.23 0l.55-.138c1.074-.268 2.156-.268 3.23 0l.55.138c1.074.268 2.156.268 3.23 0l1.22-.305V2.75a.75.75 0 00-.95-.728l-.895.224c-1.074.268-2.156.268-3.23 0l-.55-.138c-1.074-.268-2.156-.268-3.23 0l-.55.138c-1.074.268-2.156.268-3.23 0L4.95 2.022A.75.75 0 004 2.75z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-dark dark:text-white">Race Results</p>
              <p className="text-sm text-dark-4 dark:text-dark-7">Session history</p>
            </div>
          </a>

          <a
            href="/leaderboard"
            className="flex items-center space-x-3 rounded-lg border border-stroke p-4 transition hover:bg-gray-1 dark:border-stroke-dark dark:hover:bg-dark-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-light/10">
              <svg className="h-5 w-5 text-orange-light" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9L17 13.14L18.18 21L12 17.77L5.82 21L7 13.14L2 9L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-dark dark:text-white">Leaderboard</p>
              <p className="text-sm text-dark-4 dark:text-dark-7">Driver rankings</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
