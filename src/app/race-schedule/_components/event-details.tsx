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

interface EventDetailsProps {
  event: RaceEvent;
  onClose: () => void;
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
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

  const formatEventDateTime = (date: string, time: string) => {
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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const { date: formattedDate, time: formattedTime } = formatEventDateTime(event.date, event.time);
  const entryPercentage = (event.currentEntries / event.maxEntries) * 100;

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stroke p-4 dark:border-stroke-dark">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Event Details
          </h3>
        </div>
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
        {/* Event Title & Status */}
        <div>
          <h4 className="text-xl font-bold text-dark dark:text-white mb-2">
            {event.title}
          </h4>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getStatusColor(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        {/* Event Description */}
        {event.description && (
          <div className="rounded-lg bg-gray-1 p-3 dark:bg-dark-2">
            <p className="text-sm text-dark dark:text-white">
              {event.description}
            </p>
          </div>
        )}

        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🏁</span>
            <div>
              <div className="text-sm font-medium text-dark dark:text-white">Track</div>
              <div className="text-sm text-dark-5 dark:text-dark-6">{event.track}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-lg">📅</span>
            <div>
              <div className="text-sm font-medium text-dark dark:text-white">Date & Time</div>
              <div className="text-sm text-dark-5 dark:text-dark-6">
                {formattedDate}
              </div>
              <div className="text-sm text-dark-5 dark:text-dark-6">
                {formattedTime}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-lg">⏱️</span>
            <div>
              <div className="text-sm font-medium text-dark dark:text-white">Duration</div>
              <div className="text-sm text-dark-5 dark:text-dark-6">
                {formatDuration(event.duration)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-lg">{getWeatherIcon(event.weather)}</span>
            <div>
              <div className="text-sm font-medium text-dark dark:text-white">Weather</div>
              <div className="text-sm text-dark-5 dark:text-dark-6 capitalize">
                {event.weather}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-lg">🏎️</span>
            <div>
              <div className="text-sm font-medium text-dark dark:text-white">Car Group</div>
              <div className="text-sm text-dark-5 dark:text-dark-6">
                {event.carGroup}
              </div>
            </div>
          </div>
        </div>

        {/* Entry Status */}
        <div className="rounded-lg border border-stroke p-3 dark:border-stroke-dark">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-dark dark:text-white">Entries</span>
            <span className="text-dark-5 dark:text-dark-6">
              {event.currentEntries} / {event.maxEntries}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-3 dark:bg-dark-4">
            <div
              className={`h-2 rounded-full transition-all ${
                entryPercentage >= 90
                  ? 'bg-red'
                  : entryPercentage >= 70
                  ? 'bg-yellow'
                  : 'bg-green'
              }`}
              style={{ width: `${entryPercentage}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            {(100 - entryPercentage).toFixed(0)}% capacity remaining
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {event.status === "registration" && (
            <button className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90">
              Register for Event
            </button>
          )}
          {event.status === "full" && (
            <button className="w-full rounded-lg bg-gray-3 px-4 py-2 font-medium text-gray-6 cursor-not-allowed">
              Event Full - Join Waitlist
            </button>
          )}
          {event.status === "upcoming" && (
            <button className="w-full rounded-lg border border-stroke px-4 py-2 font-medium text-dark transition hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2">
              Set Reminder
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2">
              Share Event
            </button>
            <button className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2">
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}