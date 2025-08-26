"use client";

interface RaceResult {
  id: string;
  raceTitle: string;
  track: string;
  date: string;
  time: string;
  duration: number;
  carGroup: "FreeForAll" | "GT3" | "GT4" | "GT2" | "GTC" | "TCX";
  weather: "sunny" | "cloudy" | "rainy" | "mixed";
  participants: number;
  fastestLap: {
    time: string;
    driver: string;
    car: string;
  };
  raceResults: Array<{
    position: number;
    driverName: string;
    carModel: string;
    carNumber: number;
    totalTime: string;
    bestLapTime: string;
    laps: number;
    gap: string;
    points: number;
    nationality: string;
  }>;
}

interface ResultsListProps {
  races: RaceResult[];
  onRaceSelect: (race: RaceResult) => void;
  selectedRace: RaceResult | null;
}

export function ResultsList({ races, onRaceSelect, selectedRace }: ResultsListProps) {
  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "sunny": return "☀️";
      case "cloudy": return "☁️";
      case "rainy": return "🌧️";
      case "mixed": return "⛅";
      default: return "🌤️";
    }
  };

  const formatDate = (dateStr: string, timeStr: string) => {
    const eventDate = new Date(dateStr + "T" + timeStr);
    return eventDate.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCountryFlag = (nationality: string) => {
    const flags: Record<string, string> = {
      "NL": "🇳🇱", "GB": "🇬🇧", "MC": "🇲🇨", "DE": "🇩🇪", 
      "ES": "🇪🇸", "FI": "🇫🇮"
    };
    return flags[nationality] || "🏁";
  };

  return (
    <div className="space-y-4">
      {races.map((race) => (
        <div
          key={race.id}
          onClick={() => onRaceSelect(race)}
          className={`cursor-pointer rounded-lg border p-6 transition-all hover:shadow-lg ${
            selectedRace?.id === race.id
              ? 'border-primary bg-primary/5 shadow-lg dark:bg-primary/10'
              : 'border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark hover:border-primary/50'
          }`}
        >
          {/* Race Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {race.raceTitle}
              </h3>
              <div className="mt-1 flex items-center space-x-4 text-sm text-dark-5 dark:text-dark-6">
                <span className="flex items-center space-x-1">
                  <span>🏁</span>
                  <span>{race.track}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>{getWeatherIcon(race.weather)}</span>
                  <span className="capitalize">{race.weather}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🏎️</span>
                  <span>{race.carGroup}</span>
                </span>
                <span>{race.participants} drivers</span>
              </div>
            </div>
            <div className="text-right text-sm text-dark-5 dark:text-dark-6">
              <div>{formatDate(race.date, race.time)}</div>
              <div>{race.duration} minutes</div>
            </div>
          </div>

          {/* Podium Finishers */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-dark-4 dark:text-dark-7">Podium Finishers</h4>
            <div className="space-y-2">
              {race.raceResults.slice(0, 3).map((result) => (
                <div key={result.position} className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">
                    {result.position === 1 && '🥇'}
                    {result.position === 2 && '🥈'}
                    {result.position === 3 && '🥉'}
                  </div>
                  <span className="text-lg">{getCountryFlag(result.nationality)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-dark dark:text-white">
                      {result.driverName}
                    </div>
                    <div className="text-xs text-dark-5 dark:text-dark-6">
                      {result.carModel} #{result.carNumber}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-mono text-dark dark:text-white">
                      {result.totalTime}
                    </div>
                    <div className="text-xs text-dark-5 dark:text-dark-6">
                      Best: {result.bestLapTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Race Statistics */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex space-x-6">
              <div>
                <div className="text-dark-4 dark:text-dark-7">Fastest Lap</div>
                <div className="font-mono font-semibold text-primary">
                  {race.fastestLap.time}
                </div>
                <div className="text-xs text-dark-5 dark:text-dark-6">
                  {race.fastestLap.driver}
                </div>
              </div>
              <div>
                <div className="text-dark-4 dark:text-dark-7">Winner</div>
                <div className="font-medium text-dark dark:text-white">
                  {race.raceResults[0]?.driverName}
                </div>
                <div className="text-xs text-dark-5 dark:text-dark-6">
                  {race.raceResults[0]?.gap}
                </div>
              </div>
            </div>
            
            <button className="rounded bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20">
              View Full Results
            </button>
          </div>
        </div>
      ))}
      
      {races.length === 0 && (
        <div className="rounded-lg border border-stroke bg-white p-8 text-center shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-6xl mb-4">🏁</div>
          <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
            No Race Results Found
          </h3>
          <p className="text-dark-5 dark:text-dark-6">
            Try adjusting your filters or check back later for new results.
          </p>
        </div>
      )}
    </div>
  );
}