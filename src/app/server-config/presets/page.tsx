import { Metadata } from "next";
import { PresetsManager } from "./_components/presets-manager";

export const metadata: Metadata = {
  title: "Configuration Presets",
  description: "Save, load, and manage ACC server configuration presets for quick setup.",
};

export default function PresetsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Configuration Presets
        </h1>
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          Save and manage complete server configuration presets for different racing scenarios.
        </p>
      </div>

      <PresetsManager />
    </div>
  );
}