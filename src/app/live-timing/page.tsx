import { Metadata } from "next";
import { LiveTimingDashboard } from "./_components/live-timing-dashboard";

export const metadata: Metadata = {
  title: "Live Timing & Monitoring",
  description: "Real-time timing data, driver positions, and session monitoring for your ACC server.",
};

export default function LiveTimingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Live Timing & Monitoring
        </h1>
        <p className="mt-2 text-body-sm text-dark-5 dark:text-dark-6">
          Real-time session data, driver positions, lap times, and server monitoring
        </p>
      </div>

      <LiveTimingDashboard />
    </div>
  );
}