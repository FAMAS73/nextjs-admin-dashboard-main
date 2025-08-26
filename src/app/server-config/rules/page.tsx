import { Metadata } from "next";
import { ServerRulesForm } from "./_components/server-rules-form";

export const metadata: Metadata = {
  title: "Server Rules Configuration",
  description: "Configure your ACC server name, passwords, and access requirements.",
};

export default function ServerRulesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Server Rules Configuration
        </h1>
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          Configure server identification, passwords, and player access requirements.
        </p>
      </div>

      <ServerRulesForm />
    </div>
  );
}