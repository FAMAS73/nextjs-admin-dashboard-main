export function ServerStatusSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-600"></div>
              <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
              <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-600"></div>
            </div>
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600"></div>
          </div>
        </div>
      ))}
    </div>
  );
}