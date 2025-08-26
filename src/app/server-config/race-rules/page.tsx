import { Metadata } from "next";
import { RaceRulesForm } from "./_components/race-rules-form";

export const metadata: Metadata = {
  title: "Race Rules Configuration",
  description: "Configure pit stops, stint times, and race regulations for your ACC server.",
};

export default function RaceRulesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Race Rules Configuration
        </h1>
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          Configure pit stop requirements, stint time limits, and other race regulations.
        </p>
      </div>

      <RaceRulesForm />
    </div>
  );
}