import { Metadata } from "next";
import { RaceScheduleDashboard } from "./_components/race-schedule-dashboard";

export const metadata: Metadata = {
  title: "Race Schedule",
  description: "Upcoming races, practice sessions, and championship events for your ACC server.",
};

export default function RaceSchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Race Schedule
        </h1>
        <p className="mt-2 text-body-sm text-dark-5 dark:text-dark-6">
          Manage upcoming races, practice sessions, and championship events
        </p>
      </div>

      <RaceScheduleDashboard />
    </div>
  );
}