"use client";

import { useState } from "react";

interface Driver {
  id: string;
  position: number;
  carNumber: number;
  driverName: string;
  carModel: string;
  bestLapTime?: string;
  laps: number;
}

interface SessionHistoryProps {
  drivers: Driver[];
}

interface LapRecord {
  lap: number;
  driver: string;
  carNumber: number;
  lapTime: string;
  gap: string;
  sector1: string;
  sector2: string;
  sector3: string;
  timestamp: string;
}

// Mock historical data
const mockLapHistory: LapRecord[] = [
  { lap: 12, driver: "Max Verstappen", carNumber: 33, lapTime: "2:17.891", gap: "Leader", sector1: "43.521", sector2: "49.876", sector3: "44.494", timestamp: "14:32:15" },
  { lap: 12, driver: "Lewis Hamilton", carNumber: 44, lapTime: "2:18.045", gap: "+0.154", sector1: "43.789", sector2: "49.903", sector3: "44.353", timestamp: "14:32:17" },
  { lap: 11, driver: "Max Verstappen", carNumber: 33, lapTime: "2:18.234", gap: "Leader", sector1: "43.654", sector2: "50.123", sector3: "44.457", timestamp: "14:30:12" },
  { lap: 11, driver: "Lewis Hamilton", carNumber: 44, lapTime: "2:18.456", gap: "+0.222", sector1: "43.823", sector2: "50.234", sector3: "44.399", timestamp: "14:30:15" },
  { lap: 11, driver: "Charles Leclerc", carNumber: 16, lapTime: "2:18.567", gap: "+0.333", sector1: "43.901", sector2: "50.345", sector3: "44.321", timestamp: "14:30:18" },
  { lap: 10, driver: "Max Verstappen", carNumber: 33, lapTime: "2:18.567", gap: "Leader", sector1: "43.789", sector2: "50.234", sector3: "44.544", timestamp: "14:28:05" },
  { lap: 10, driver: "Lewis Hamilton", carNumber: 44, lapTime: "2:18.789", gap: "+0.222", sector1: "43.956", sector2: "50.456", sector3: "44.377", timestamp: "14:28:08" },
];

export function SessionHistory({ drivers }: SessionHistoryProps) {
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"lap" | "time" | "gap">("lap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredHistory = selectedDriver === "all" 
    ? mockLapHistory 
    : mockLapHistory.filter(record => record.driver === selectedDriver);

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "lap":
        comparison = a.lap - b.lap;
        break;
      case "time":
        comparison = a.lapTime.localeCompare(b.lapTime);
        break;
      case "gap":
        if (a.gap === "Leader" && b.gap !== "Leader") comparison = -1;
        else if (a.gap !== "Leader" && b.gap === "Leader") comparison = 1;
        else if (a.gap === "Leader" && b.gap === "Leader") comparison = 0;
        else comparison = parseFloat(a.gap.replace("+", "")) - parseFloat(b.gap.replace("+", ""));
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const getBestSectorTimes = () => {
    const bestS1 = Math.min(...mockLapHistory.map(r => parseFloat(r.sector1)));
    const bestS2 = Math.min(...mockLapHistory.map(r => parseFloat(r.sector2)));
    const bestS3 = Math.min(...mockLapHistory.map(r => parseFloat(r.sector3)));
    return { s1: bestS1.toFixed(3), s2: bestS2.toFixed(3), s3: bestS3.toFixed(3) };
  };

  const bestSectors = getBestSectorTimes();

  const isBestSector = (time: string, sector: 's1' | 's2' | 's3') => {
    return parseFloat(time) === parseFloat(bestSectors[sector]);
  };

  const getBestLapOverall = () => {
    return mockLapHistory.reduce((best, current) => 
      current.lapTime < best.lapTime ? current : best
    );
  };

  const bestLap = getBestLapOverall();

  return (
    <div className="space-y-6">
      {/* Session Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-primary">{bestLap.lapTime}</div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Best Lap Overall</div>
          <div className="mt-1 text-xs text-dark dark:text-white">
            #{bestLap.carNumber} {bestLap.driver}
          </div>
        </div>
        
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-green">{bestSectors.s1}s</div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Best Sector 1</div>
        </div>
        
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-yellow-dark">{bestSectors.s2}s</div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Best Sector 2</div>
        </div>
        
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-red">{bestSectors.s3}s</div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Best Sector 3</div>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
              Filter by Driver
            </label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="rounded border border-stroke bg-white px-3 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              <option value="all">All Drivers</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.driverName}>
                  #{driver.carNumber} {driver.driverName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "lap" | "time" | "gap")}
              className="rounded border border-stroke bg-white px-3 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              <option value="lap">Lap Number</option>
              <option value="time">Lap Time</option>
              <option value="gap">Gap to Leader</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="rounded border border-stroke bg-white px-3 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lap History Table */}
      <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="border-b border-stroke p-4 dark:border-stroke-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Lap History ({sortedHistory.length} records)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-stroke bg-gray-1 dark:border-stroke-dark dark:bg-dark-2">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                  Lap
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                  Driver
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                  Gap
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                  S1
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                  S2
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                  S3
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-stroke-dark">
              {sortedHistory.map((record, index) => {
                const isBestLap = record.lapTime === bestLap.lapTime;
                return (
                  <tr 
                    key={index}
                    className={`transition-colors hover:bg-gray-1 dark:hover:bg-dark-2 ${
                      isBestLap ? 'bg-primary/5 dark:bg-primary/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-dark dark:text-white">
                        {record.lap}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono text-sm font-semibold ${
                          isBestLap ? 'text-primary' : 'text-dark dark:text-white'
                        }`}>
                          {record.lapTime}
                        </span>
                        {isBestLap && (
                          <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            Best
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                          {record.carNumber}
                        </div>
                        <span className="text-sm font-medium text-dark dark:text-white">
                          {record.driver}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        record.gap === 'Leader' 
                          ? 'text-green' 
                          : 'text-dark dark:text-white'
                      }`}>
                        {record.gap}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`font-mono text-sm ${
                        isBestSector(record.sector1, 's1') 
                          ? 'font-bold text-green' 
                          : 'text-dark-5 dark:text-dark-6'
                      }`}>
                        {record.sector1}
                        {isBestSector(record.sector1, 's1') && (
                          <span className="ml-1 text-xs">🏆</span>
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`font-mono text-sm ${
                        isBestSector(record.sector2, 's2') 
                          ? 'font-bold text-yellow-dark' 
                          : 'text-dark-5 dark:text-dark-6'
                      }`}>
                        {record.sector2}
                        {isBestSector(record.sector2, 's2') && (
                          <span className="ml-1 text-xs">🏆</span>
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`font-mono text-sm ${
                        isBestSector(record.sector3, 's3') 
                          ? 'font-bold text-red' 
                          : 'text-dark-5 dark:text-dark-6'
                      }`}>
                        {record.sector3}
                        {isBestSector(record.sector3, 's3') && (
                          <span className="ml-1 text-xs">🏆</span>
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-dark-5 dark:text-dark-6">
                        {record.timestamp}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedHistory.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-dark-5 dark:text-dark-6">
              No lap data available for the selected driver.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}