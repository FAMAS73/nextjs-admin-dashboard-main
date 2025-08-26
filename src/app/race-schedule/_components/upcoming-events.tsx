"use client";

interface RaceEvent {
  id: string;
  title: string;
  track: string;
  date: string;
  time: string;
  duration: number;
  type: "practice" | "qualifying" | "race" | "championship";
  carGroup: "FreeForAll" | "GT3" | "GT4" | "GT2" | "GTC" | "TCX";
  maxEntries: number;
  currentEntries: number;
  weather: "sunny" | "cloudy" | "rainy" | "mixed";
  status: "upcoming" | "registration" | "full" | "cancelled" | "completed";
  description?: string;
}

interface UpcomingEventsProps {
  events: RaceEvent[];
  onEventSelect: (event: RaceEvent) => void;
}

export function UpcomingEvents({ events, onEventSelect }: UpcomingEventsProps) {
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "practice": return "🏃";
      case "qualifying": return "⏱️";
      case "race": return "🏁";
      case "championship": return "🏆";
      default: return "📅";
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "sunny": return "☀️";
      case "cloudy": return "☁️";
      case "rainy": return "🌧️";
      case "mixed": return "⛅";
      default: return "🌤️";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registration": return "bg-green/10 text-green border-green/20";
      case "full": return "bg-red/10 text-red border-red/20";
      case "upcoming": return "bg-blue/10 text-blue border-blue/20";
      case "cancelled": return "bg-gray/10 text-gray border-gray/20";
      case "completed": return "bg-dark-4/10 text-dark-4 border-dark-4/20";
      default: return "bg-gray/10 text-gray border-gray/20";
    }
  };

  const formatDate = (dateStr: string, timeStr: string) => {
    const eventDate = new Date(dateStr + "T" + timeStr);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    return eventDate.toLocaleDateString();
  };

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <div className="border-b border-stroke p-6 dark:border-stroke-dark">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Upcoming Events ({events.length})
        </h3>
        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          Click on an event to view details and register
        </p>
      </div>

      <div className="divide-y divide-stroke dark:divide-stroke-dark">
        {events.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h4 className="text-lg font-medium text-dark dark:text-white mb-2">
              No Events Scheduled
            </h4>
            <p className="text-dark-5 dark:text-dark-6">
              Check back later for upcoming races and practice sessions.
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventSelect(event)}
              className="cursor-pointer p-6 transition-colors hover:bg-gray-1 dark:hover:bg-dark-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Event Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                    {getEventTypeIcon(event.type)}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-dark dark:text-white">
                        {event.title}
                      </h4>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex items-center space-x-4 text-sm text-dark-5 dark:text-dark-6">
                      <span className="flex items-center space-x-1">
                        <span>🏁</span>
                        <span>{event.track}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>{getWeatherIcon(event.weather)}</span>
                        <span className="capitalize">{event.weather}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>🏎️</span>
                        <span>{event.carGroup}</span>
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-dark-4 dark:text-dark-7">
                      {formatDate(event.date, event.time)} at {event.time} • {event.duration} minutes
                    </div>
                  </div>
                </div>

                {/* Entry Status */}
                <div className="text-right">
                  <div className="text-lg font-bold text-dark dark:text-white">
                    {event.currentEntries}/{event.maxEntries}
                  </div>
                  <div className="text-xs text-dark-5 dark:text-dark-6">entries</div>
                  
                  {/* Progress Bar */}
                  <div className="mt-2 w-20">
                    <div className="h-1 w-full rounded-full bg-gray-3 dark:bg-dark-4">
                      <div
                        className={`h-1 rounded-full transition-all ${
                          (event.currentEntries / event.maxEntries) >= 0.9
                            ? 'bg-red'
                            : (event.currentEntries / event.maxEntries) >= 0.7
                            ? 'bg-yellow'
                            : 'bg-green'
                        }`}
                        style={{ width: `${(event.currentEntries / event.maxEntries) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-dark-4 dark:text-dark-7">
                  <span className="capitalize">{event.type}</span>
                  <span>•</span>
                  <span>{event.carGroup} Series</span>
                </div>
                
                <div className="flex space-x-2">
                  {event.status === "registration" && (
                    <button className="rounded bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20">
                      Register
                    </button>
                  )}
                  <button className="rounded bg-gray-1 px-3 py-1 text-xs font-medium text-dark transition hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}