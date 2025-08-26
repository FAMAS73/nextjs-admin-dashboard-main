import { Metadata } from "next";
import { RaceResultsDashboard } from "./_components/race-results-dashboard";

export const metadata: Metadata = {
  title: "Race Results & Media",
  description: "Historical race results, lap times, media uploads, and championship standings.",
};

export default function RaceResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Race Results & Media
        </h1>
        <p className="mt-2 text-body-sm text-dark-5 dark:text-dark-6">
          Browse historical race results, media uploads, and championship data
        </p>
      </div>

      <RaceResultsDashboard />
    </div>
  );
}