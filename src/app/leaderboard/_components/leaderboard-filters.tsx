"use client";

interface LeaderboardFiltersProps {
  selectedPeriod: "all-time" | "season" | "month";
  onPeriodChange: (period: "all-time" | "season" | "month") => void;
  selectedCategory: "overall" | "gt3" | "gt4" | "gt2";
  onCategoryChange: (category: "overall" | "gt3" | "gt4" | "gt2") => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function LeaderboardFilters({
  selectedPeriod,
  onPeriodChange,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}: LeaderboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search drivers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-48 rounded-lg border border-stroke bg-white px-4 py-2 pl-10 text-sm outline-none transition focus:border-primary dark:border-stroke-dark dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-4 dark:text-dark-7"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Time Period Filter */}
      <select
        value={selectedPeriod}
        onChange={(e) => onPeriodChange(e.target.value as "all-time" | "season" | "month")}
        className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm outline-none transition focus:border-primary dark:border-stroke-dark dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      >
        <option value="all-time">All Time</option>
        <option value="season">Current Season</option>
        <option value="month">This Month</option>
      </select>

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as "overall" | "gt3" | "gt4" | "gt2")}
        className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm outline-none transition focus:border-primary dark:border-stroke-dark dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      >
        <option value="overall">All Categories</option>
        <option value="gt3">GT3 Only</option>
        <option value="gt4">GT4 Only</option>
        <option value="gt2">GT2 Only</option>
      </select>

      {/* Export Button */}
      <button className="flex items-center space-x-2 rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span>Export</span>
      </button>
    </div>
  );
}