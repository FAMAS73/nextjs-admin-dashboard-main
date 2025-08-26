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

interface TopDriversProps {
  drivers: Driver[];
}

export function TopDrivers({ drivers }: TopDriversProps) {
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

  const getPodiumStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 border-yellow-400";
      case 2: return "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 border-gray-400";
      case 3: return "bg-gradient-to-br from-orange-300 to-orange-400 text-orange-900 border-orange-400";
      default: return "bg-gray-100 text-gray-900 border-gray-300";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className={`relative overflow-hidden rounded-xl border-2 shadow-lg transition-transform hover:scale-105 ${getPodiumStyle(driver.rank)}`}
        >
          {/* Rank Badge */}
          <div className="absolute right-4 top-4 z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur-sm">
              {driver.rank === 1 && '🏆'}
              {driver.rank === 2 && '🥈'}
              {driver.rank === 3 && '🥉'}
            </div>
          </div>

          {/* Driver Info */}
          <div className="p-6">
            <div className="mb-4 flex items-center space-x-3">
              <span className="text-3xl">{getCountryFlag(driver.nationality)}</span>
              <div>
                <h3 className="text-xl font-bold">
                  {driver.driverName}
                </h3>
                <p className="text-sm opacity-80">
                  Rank #{driver.rank}
                </p>
              </div>
            </div>

            {/* ELO Rating */}
            <div className="mb-4 text-center">
              <div className="text-3xl font-bold">
                {driver.eloRating}
              </div>
              <div className="text-sm opacity-80">ELO Rating</div>
              <div className="mt-1 flex items-center justify-center text-xs">
                {driver.trend === "up" && (
                  <span className="flex items-center text-green-700">
                    ↗ Trending up
                  </span>
                )}
                {driver.trend === "down" && (
                  <span className="flex items-center text-red-700">
                    ↘ Trending down
                  </span>
                )}
                {driver.trend === "stable" && (
                  <span className="flex items-center opacity-70">
                    ─ Stable
                  </span>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="font-bold">{driver.wins}</div>
                <div className="opacity-80">Wins</div>
              </div>
              <div>
                <div className="font-bold">{driver.podiums}</div>
                <div className="opacity-80">Podiums</div>
              </div>
              <div>
                <div className="font-bold">{driver.points}</div>
                <div className="opacity-80">Points</div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="opacity-80">Win Rate:</span>
                <span className="font-semibold">
                  {((driver.wins / driver.totalRaces) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Avg Finish:</span>
                <span className="font-semibold">
                  {driver.averageFinish.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Best Lap:</span>
                <span className="font-mono font-semibold">
                  {driver.bestLapTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Clean Races:</span>
                <span className="font-semibold">
                  {driver.cleanRacePercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs">
                <span className="opacity-80">Championship Progress</span>
                <span className="font-semibold">{driver.totalRaces} races</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/30">
                <div
                  className="h-2 rounded-full bg-white/60"
                  style={{ width: `${Math.min((driver.totalRaces / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-white/10" />
          <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}