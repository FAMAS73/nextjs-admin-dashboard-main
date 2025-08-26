"use client";

interface SessionInfoProps {
  sessionInfo: {
    type: "Practice" | "Qualifying" | "Race";
    track: string;
    timeRemaining: number;
    totalTime: number;
    weatherConditions: {
      temperature: number;
      trackTemp: number;
      weather: string;
      windSpeed: number;
    };
  };
}

export function SessionInfo({ sessionInfo }: SessionInfoProps) {
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((sessionInfo.totalTime - sessionInfo.timeRemaining) / sessionInfo.totalTime) * 100;
  };

  const getSessionColor = () => {
    switch (sessionInfo.type) {
      case "Practice": return "bg-blue";
      case "Qualifying": return "bg-yellow-dark";
      case "Race": return "bg-red";
      default: return "bg-primary";
    }
  };

  const getWeatherIcon = () => {
    switch (sessionInfo.weatherConditions.weather.toLowerCase()) {
      case "clear":
        return "☀️";
      case "partly cloudy":
        return "⛅";
      case "overcast":
        return "☁️";
      case "light rain":
        return "🌦️";
      case "heavy rain":
        return "🌧️";
      default:
        return "🌤️";
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Session Status */}
        <div>
          <div className="mb-4 flex items-center space-x-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${getSessionColor()}`}>
              {sessionInfo.type === "Practice" && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
              )}
              {sessionInfo.type === "Qualifying" && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              )}
              {sessionInfo.type === "Race" && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {sessionInfo.type} Session
              </h3>
              <p className="text-sm text-dark-5 dark:text-dark-6">
                {sessionInfo.track}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-dark-4 dark:text-dark-7">Time Remaining</span>
                <span className="font-mono font-medium text-dark dark:text-white">
                  {formatTime(sessionInfo.timeRemaining)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-3 dark:bg-dark-4">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${getSessionColor()}`}
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-dark-4 dark:text-dark-7">Session Progress</span>
              <span className="font-medium text-dark dark:text-white">
                {getProgressPercentage().toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Weather Information */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-dark dark:text-white">
            Weather Conditions
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getWeatherIcon()}</span>
                <span className="text-sm text-dark dark:text-white">
                  {sessionInfo.weatherConditions.weather}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-dark-4 dark:text-dark-7">Air Temp</div>
                <div className="font-medium text-dark dark:text-white">
                  {sessionInfo.weatherConditions.temperature}°C
                </div>
              </div>
              <div>
                <div className="text-dark-4 dark:text-dark-7">Track Temp</div>
                <div className="font-medium text-dark dark:text-white">
                  {sessionInfo.weatherConditions.trackTemp}°C
                </div>
              </div>
              <div>
                <div className="text-dark-4 dark:text-dark-7">Wind Speed</div>
                <div className="font-medium text-dark dark:text-white">
                  {sessionInfo.weatherConditions.windSpeed} km/h
                </div>
              </div>
              <div>
                <div className="text-dark-4 dark:text-dark-7">Conditions</div>
                <div className="font-medium text-dark dark:text-white">Stable</div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Statistics */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-dark dark:text-white">
            Session Statistics
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-dark-4 dark:text-dark-7">Elapsed Time</span>
              <span className="font-mono font-medium text-dark dark:text-white">
                {formatTime(sessionInfo.totalTime - sessionInfo.timeRemaining)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-4 dark:text-dark-7">Total Duration</span>
              <span className="font-mono font-medium text-dark dark:text-white">
                {formatTime(sessionInfo.totalTime)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-4 dark:text-dark-7">Session Status</span>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                sessionInfo.timeRemaining > 0 
                  ? 'bg-green/10 text-green' 
                  : 'bg-red/10 text-red'
              }`}>
                {sessionInfo.timeRemaining > 0 ? 'Active' : 'Finished'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-4 dark:text-dark-7">Data Updates</span>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green animate-pulse"></div>
                <span className="text-xs font-medium text-green">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}