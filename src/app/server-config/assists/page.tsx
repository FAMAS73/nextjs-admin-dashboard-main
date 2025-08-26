import { Metadata } from "next";
import { AssistsConfigForm } from "./_components/assists-config-form";

export const metadata: Metadata = {
  title: "Driving Assists Configuration",
  description: "Control which driving aids are allowed or forced on your ACC server.",
};

export default function AssistsConfigPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Driving Assists Configuration
        </h1>
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          Control which driving assistance systems are allowed, forbidden, or forced for all players.
        </p>
      </div>

      <AssistsConfigForm />
    </div>
  );
}