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

interface RaceDetailsProps {
  race: RaceResult;
  onClose: () => void;
}

export function RaceDetails({ race, onClose }: RaceDetailsProps) {
  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "sunny": return "☀️";
      case "cloudy": return "☁️";
      case "rainy": return "🌧️";
      case "mixed": return "⛅";
      default: return "🌤️";
    }
  };

  const getCountryFlag = (nationality: string) => {
    const flags: Record<string, string> = {
      "NL": "🇳🇱", "GB": "🇬🇧", "MC": "🇲🇨", "DE": "🇩🇪", 
      "ES": "🇪🇸", "FI": "🇫🇮"
    };
    return flags[nationality] || "🏁";
  };

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(date + "T" + time);
    return {
      date: eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: eventDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date: formattedDate, time: formattedTime } = formatDateTime(race.date, race.time);

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stroke p-4 dark:border-stroke-dark">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Race Details
        </h3>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-dark-4 transition hover:bg-gray-1 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-2 dark:hover:text-white"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Race Info */}
        <div>
          <h4 className="font-semibold text-dark dark:text-white mb-2">
            {race.raceTitle}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🏁</span>
              <span className="text-dark-5 dark:text-dark-6">Track:</span>
              <span className="text-dark dark:text-white">{race.track}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">📅</span>
              <span className="text-dark-5 dark:text-dark-6">Date:</span>
              <span className="text-dark dark:text-white">{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">⏰</span>
              <span className="text-dark-5 dark:text-dark-6">Time:</span>
              <span className="text-dark dark:text-white">{formattedTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getWeatherIcon(race.weather)}</span>
              <span className="text-dark-5 dark:text-dark-6">Weather:</span>
              <span className="text-dark dark:text-white capitalize">{race.weather}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🏎️</span>
              <span className="text-dark-5 dark:text-dark-6">Category:</span>
              <span className="text-dark dark:text-white">{race.carGroup}</span>
            </div>
          </div>
        </div>

        {/* Race Statistics */}
        <div className="rounded-lg bg-gray-1 p-3 dark:bg-dark-2">
          <h5 className="font-medium text-dark dark:text-white mb-2">Race Statistics</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-dark-5 dark:text-dark-6">Duration:</span>
              <div className="font-medium text-dark dark:text-white">{race.duration} min</div>
            </div>
            <div>
              <span className="text-dark-5 dark:text-dark-6">Participants:</span>
              <div className="font-medium text-dark dark:text-white">{race.participants}</div>
            </div>
            <div>
              <span className="text-dark-5 dark:text-dark-6">Fastest Lap:</span>
              <div className="font-mono font-medium text-primary">{race.fastestLap.time}</div>
            </div>
            <div>
              <span className="text-dark-5 dark:text-dark-6">Total Laps:</span>
              <div className="font-medium text-dark dark:text-white">{race.raceResults[0]?.laps || 0}</div>
            </div>
          </div>
        </div>

        {/* Full Results Table */}
        <div>
          <h5 className="font-medium text-dark dark:text-white mb-3">Full Results</h5>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {race.raceResults.map((result) => (
              <div
                key={result.position}
                className={`flex items-center space-x-3 rounded p-2 text-sm ${
                  result.position <= 3 
                    ? 'bg-yellow/10 border border-yellow/20' 
                    : 'bg-gray-1 dark:bg-dark-2'
                }`}
              >
                <div className="w-8 text-center font-bold">
                  {result.position <= 3 ? (
                    <span className="text-lg">
                      {result.position === 1 && '🥇'}
                      {result.position === 2 && '🥈'}
                      {result.position === 3 && '🥉'}
                    </span>
                  ) : (
                    result.position
                  )}
                </div>
                
                <div className="flex items-center space-x-2 flex-1">
                  <span>{getCountryFlag(result.nationality)}</span>
                  <div>
                    <div className="font-medium text-dark dark:text-white">
                      {result.driverName}
                    </div>
                    <div className="text-xs text-dark-5 dark:text-dark-6">
                      {result.carModel} #{result.carNumber}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-dark dark:text-white">
                    {result.totalTime}
                  </div>
                  <div className="text-xs text-dark-5 dark:text-dark-6">
                    {result.gap}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-primary">
                    {result.bestLapTime}
                  </div>
                  <div className="text-xs text-dark-5 dark:text-dark-6">
                    {result.points} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90">
            Download Full Results
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2">
              Share Results
            </button>
            <button className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2">
              View Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}