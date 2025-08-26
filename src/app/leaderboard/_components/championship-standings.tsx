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

interface ChampionshipStandingsProps {
  drivers: Driver[];
  period: "all-time" | "season" | "month";
}

export function ChampionshipStandings({ drivers, period }: ChampionshipStandingsProps) {
  const sortedByPoints = [...drivers].sort((a, b) => b.points - a.points);
  
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

  const maxPoints = sortedByPoints[0]?.points || 1;

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <div className="border-b border-stroke p-6 dark:border-stroke-dark">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Championship Standings ({period.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())})
        </h3>
        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          Points-based championship standings with race wins and podium finishes
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {sortedByPoints.map((driver, index) => (
            <div
              key={driver.id}
              className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-1 dark:hover:bg-dark-2 ${
                index < 3 
                  ? 'border-yellow bg-yellow/5 dark:bg-yellow/10' 
                  : 'border-stroke dark:border-stroke-dark'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Position */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white bg-primary">
                  {index === 0 && '🏆'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && (index + 1)}
                </div>

                {/* Driver Info */}
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getCountryFlag(driver.nationality)}</span>
                  <div>
                    <h4 className="font-medium text-dark dark:text-white">
                      {driver.driverName}
                    </h4>
                    <p className="text-xs text-dark-5 dark:text-dark-6">
                      {driver.wins} wins • {driver.podiums} podiums
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Points Progress Bar */}
                <div className="hidden w-32 md:block">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-dark-4 dark:text-dark-7">Points</span>
                    <span className="font-medium text-dark dark:text-white">
                      {driver.points}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-3 dark:bg-dark-4">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-blue"
                      style={{ width: `${(driver.points / maxPoints) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-dark dark:text-white">
                      {driver.points}
                    </div>
                    <div className="text-xs text-dark-4 dark:text-dark-7">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green">
                      {driver.wins}
                    </div>
                    <div className="text-xs text-dark-4 dark:text-dark-7">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-yellow">
                      {driver.podiums}
                    </div>
                    <div className="text-xs text-dark-4 dark:text-dark-7">Podiums</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-dark dark:text-white">
                      {driver.totalRaces}
                    </div>
                    <div className="text-xs text-dark-4 dark:text-dark-7">Races</div>
                  </div>
                </div>

                {/* Gap to Leader */}
                {index > 0 && (
                  <div className="text-right">
                    <div className="font-mono text-sm font-medium text-red">
                      -{sortedByPoints[0].points - driver.points}
                    </div>
                    <div className="text-xs text-dark-4 dark:text-dark-7">Gap</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Championship Summary */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-gray-1 p-4 text-center dark:bg-dark-2">
            <div className="text-2xl font-bold text-dark dark:text-white">
              {sortedByPoints.reduce((sum, driver) => sum + driver.totalRaces, 0)}
            </div>
            <div className="text-sm text-dark-5 dark:text-dark-6">Total Races</div>
          </div>
          <div className="rounded-lg bg-gray-1 p-4 text-center dark:bg-dark-2">
            <div className="text-2xl font-bold text-green">
              {sortedByPoints.reduce((sum, driver) => sum + driver.wins, 0)}
            </div>
            <div className="text-sm text-dark-5 dark:text-dark-6">Total Wins</div>
          </div>
          <div className="rounded-lg bg-gray-1 p-4 text-center dark:bg-dark-2">
            <div className="text-2xl font-bold text-yellow">
              {sortedByPoints.reduce((sum, driver) => sum + driver.podiums, 0)}
            </div>
            <div className="text-sm text-dark-5 dark:text-dark-6">Total Podiums</div>
          </div>
          <div className="rounded-lg bg-gray-1 p-4 text-center dark:bg-dark-2">
            <div className="text-2xl font-bold text-primary">
              {sortedByPoints.reduce((sum, driver) => sum + driver.points, 0)}
            </div>
            <div className="text-sm text-dark-5 dark:text-dark-6">Total Points</div>
          </div>
        </div>
      </div>
    </div>
  );
}