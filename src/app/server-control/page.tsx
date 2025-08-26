import { Metadata } from "next";
import { ServerControlDashboard } from "./_components/server-control-dashboard";

export const metadata: Metadata = {
  title: "Server Control & Monitoring",
  description: "Real-time server control, monitoring, and log viewing for your ACC server.",
};

export default function ServerControlPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Server Control & Monitoring
        </h1>
        <p className="mt-2 text-body-sm text-dark-5 dark:text-dark-6">
          Monitor server performance, control server operations, and view live logs in real-time
        </p>
      </div>

      <ServerControlDashboard />
    </div>
  );
}