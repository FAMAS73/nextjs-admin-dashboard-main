import { Metadata } from "next";
import { EntryListForm } from "./_components/entry-list-form";

export const metadata: Metadata = {
  title: "Entry List Management",
  description: "Manage drivers, car assignments, and restrictions for your ACC server.",
};

export default function EntryListPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Entry List Management
        </h1>
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          Manage driver entries, car assignments, and racing numbers for your server.
        </p>
      </div>

      <EntryListForm />
    </div>
  );
}