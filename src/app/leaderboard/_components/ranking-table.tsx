"use client";

interface Driver {
  id: string;
  rank: number;
  previousRank: number;
  steamId: string;
  driverName: string;
  nationality: string;
  eloRating: number;
  totalRaces: number;
  wins: number;
  podiums: number;
  points: number;
  averageFinish: number;
  bestLapTime: string;
  totalLaps: number;
  cleanRacePercentage: number;
  lastActive: string;
  trend: "up" | "down" | "stable";
}

interface RankingTableProps {
  drivers: Driver[];
  period: "all-time" | "season" | "month";
  category: "overall" | "gt3" | "gt4" | "gt2";
}

export function RankingTable({ drivers, period, category }: RankingTableProps) {
  const getRankChange = (driver: Driver) => {
    const change = driver.previousRank - driver.rank;
    if (change > 0) return { type: "up", value: change };
    if (change < 0) return { type: "down", value: Math.abs(change) };
    return { type: "stable", value: 0 };
  };

  const getCountryFlag = (nationality: string) => {
    const flags: Record<string, string> = {
      "NL": "🇳🇱",
      "GB": "🇬🇧", 
      "MC": "🇲🇨",
      "DE": "🇩🇪",
      "FR": "🇫🇷",
      "ES": "🇪🇸",
      "IT": "🇮🇹"
    };
    return flags[nationality] || "🏁";
  };

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <div className="border-b border-stroke p-6 dark:border-stroke-dark">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          ELO Rankings - {category.toUpperCase()} ({period.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())})
        </h3>
        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          Driver rankings based on ELO rating system and race performance
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-stroke bg-gray-1 dark:border-stroke-dark dark:bg-dark-2">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Driver
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                ELO Rating
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Races
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Wins
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Podiums
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Points
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Avg Finish
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Best Lap
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Clean %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-stroke-dark">
            {drivers.map((driver) => {
              const rankChange = getRankChange(driver);
              return (
                <tr key={driver.id} className="transition-colors hover:bg-gray-1 dark:hover:bg-dark-2">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${driver.rank <= 3 ? 'text-yellow' : 'text-dark dark:text-white'}`}>
                        {driver.rank === 1 && '🥇'}
                        {driver.rank === 2 && '🥈'}
                        {driver.rank === 3 && '🥉'}
                        {driver.rank > 3 && driver.rank}
                      </span>
                      <div className="flex flex-col items-center text-xs">
                        {rankChange.type === "up" && (
                          <>
                            <span className="text-green">↗</span>
                            <span className="text-green">+{rankChange.value}</span>
                          </>
                        )}
                        {rankChange.type === "down" && (
                          <>
                            <span className="text-red">↘</span>
                            <span className="text-red">-{rankChange.value}</span>
                          </>
                        )}
                        {rankChange.type === "stable" && (
                          <span className="text-dark-4 dark:text-dark-7">─</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getCountryFlag(driver.nationality)}</span>
                      <div>
                        <div className="font-medium text-dark dark:text-white">
                          {driver.driverName}
                        </div>
                        <div className="text-xs text-dark-5 dark:text-dark-6">
                          Last active: {new Date(driver.lastActive).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-lg font-bold text-primary">
                        {driver.eloRating}
                      </span>
                      <div className="flex items-center text-xs">
                        {driver.trend === "up" && (
                          <span className="text-green">↗ Trending up</span>
                        )}
                        {driver.trend === "down" && (
                          <span className="text-red">↘ Trending down</span>
                        )}
                        {driver.trend === "stable" && (
                          <span className="text-dark-4 dark:text-dark-7">─ Stable</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-dark dark:text-white">{driver.totalRaces}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-dark dark:text-white">{driver.wins}</span>
                      <span className="text-xs text-dark-5 dark:text-dark-6">
                        {((driver.wins / driver.totalRaces) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-dark dark:text-white">{driver.podiums}</span>
                      <span className="text-xs text-dark-5 dark:text-dark-6">
                        {((driver.podiums / driver.totalRaces) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-dark dark:text-white">
                      {driver.points}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-dark dark:text-white">
                      {driver.averageFinish.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-primary">
                      {driver.bestLapTime}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-16 rounded-full bg-gray-3 dark:bg-dark-4">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-red via-yellow to-green"
                          style={{ width: `${driver.cleanRacePercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-dark dark:text-white">
                        {driver.cleanRacePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}