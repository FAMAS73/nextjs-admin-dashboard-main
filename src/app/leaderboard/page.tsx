import { Metadata } from "next";
import { LeaderboardDashboard } from "./_components/leaderboard-dashboard";

export const metadata: Metadata = {
  title: "Driver Leaderboard",
  description: "ELO rankings, championship standings, and driver statistics for your ACC server community.",
};

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Driver Leaderboard
        </h1>
        <p className="mt-2 text-body-sm text-dark-5 dark:text-dark-6">
          Community rankings, championship standings, and driver performance statistics
        </p>
      </div>

      <LeaderboardDashboard />
    </div>
  );
}