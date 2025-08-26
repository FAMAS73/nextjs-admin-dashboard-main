import { Metadata } from "next";
import { EventConfigForm } from "./_components/event-config-form";

export const metadata: Metadata = {
  title: "Event & Weather Configuration",
  description: "Configure track selection, weather conditions, and session schedule for your ACC server.",
};

export default function EventConfigPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Event & Weather Configuration
        </h1>
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          Configure track selection, weather conditions, and session schedule for your racing events.
        </p>
      </div>

      <EventConfigForm />
    </div>
  );
}