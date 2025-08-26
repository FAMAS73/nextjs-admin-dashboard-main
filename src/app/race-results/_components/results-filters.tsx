"use client";

interface ResultsFiltersProps {
  filterTrack: string;
  onTrackChange: (track: string) => void;
  filterCarGroup: string;
  onCarGroupChange: (carGroup: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function ResultsFilters({
  filterTrack,
  onTrackChange,
  filterCarGroup,
  onCarGroupChange,
  searchTerm,
  onSearchChange,
}: ResultsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search races..."
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

      {/* Track Filter */}
      <select
        value={filterTrack}
        onChange={(e) => onTrackChange(e.target.value)}
        className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm outline-none transition focus:border-primary dark:border-stroke-dark dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      >
        <option value="all">All Tracks</option>
        <option value="spa">Spa-Francorchamps</option>
        <option value="monza">Monza</option>
        <option value="brands-hatch">Brands Hatch</option>
        <option value="nurburgring">Nürburgring</option>
        <option value="silverstone">Silverstone</option>
        <option value="zolder">Zolder</option>
        <option value="misano">Misano</option>
      </select>

      {/* Car Group Filter */}
      <select
        value={filterCarGroup}
        onChange={(e) => onCarGroupChange(e.target.value)}
        className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm outline-none transition focus:border-primary dark:border-stroke-dark dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      >
        <option value="all">All Categories</option>
        <option value="FreeForAll">Free For All</option>
        <option value="GT3">GT3</option>
        <option value="GT4">GT4</option>
        <option value="GT2">GT2</option>
        <option value="GTC">GTC</option>
        <option value="TCX">TCX</option>
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