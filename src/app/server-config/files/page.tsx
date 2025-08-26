import { Metadata } from "next";
import { FileManager } from "./_components/file-manager";

export const metadata: Metadata = {
  title: "File Import/Export",
  description: "Import and export ACC server configuration files.",
};

export default function FilesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Configuration File Management
        </h1>
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          Import existing ACC configuration files or export your current settings for backup and sharing.
        </p>
      </div>

      <FileManager />
    </div>
  );
}