"use client";

import { useState } from "react";

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

interface ScheduleCalendarProps {
  events: RaceEvent[];
  onEventSelect: (event: RaceEvent) => void;
}

export function ScheduleCalendar({ events, onEventSelect }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  const daysInMonth = lastDayOfMonth.getDate();
  const daysInPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  const calendarDays = [];

  // Previous month's trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      date: daysInPreviousMonth - i,
      isCurrentMonth: false,
      isToday: false,
      events: []
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(event => event.date === dateString);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

    calendarDays.push({
      date: day,
      isCurrentMonth: true,
      isToday,
      events: dayEvents
    });
  }

  // Next month's leading days
  const remainingDays = 42 - calendarDays.length; // 6 rows * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      date: day,
      isCurrentMonth: false,
      isToday: false,
      events: []
    });
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "practice": return "bg-blue text-white";
      case "qualifying": return "bg-yellow text-black";
      case "race": return "bg-green text-white";
      case "championship": return "bg-red text-white";
      default: return "bg-gray text-white";
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      {/* Calendar Header */}
      <div className="border-b border-stroke p-6 dark:border-stroke-dark">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={previousMonth}
              className="rounded p-2 text-dark transition hover:bg-gray-1 dark:text-white dark:hover:bg-dark-2"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={nextMonth}
              className="rounded p-2 text-dark transition hover:bg-gray-1 dark:text-white dark:hover:bg-dark-2"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Labels */}
        <div className="mb-4 grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-xs font-semibold text-dark-4 dark:text-dark-7">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] border border-gray-3 p-2 dark:border-dark-4 ${
                day.isCurrentMonth 
                  ? 'bg-white dark:bg-gray-dark' 
                  : 'bg-gray-1 dark:bg-dark-2'
              } ${
                day.isToday 
                  ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                  : ''
              }`}
            >
              <div className={`text-sm font-medium ${
                day.isCurrentMonth 
                  ? day.isToday 
                    ? 'text-primary' 
                    : 'text-dark dark:text-white'
                  : 'text-dark-4 dark:text-dark-7'
              }`}>
                {day.date}
              </div>
              
              {/* Events */}
              <div className="mt-1 space-y-1">
                {day.events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventSelect(event)}
                    className={`cursor-pointer rounded px-1 py-0.5 text-xs font-medium transition hover:opacity-80 ${getEventTypeColor(event.type)}`}
                    title={`${event.title} - ${event.track}`}
                  >
                    <div className="truncate">
                      {event.time} {event.title}
                    </div>
                  </div>
                ))}
                
                {day.events.length > 3 && (
                  <div className="text-xs text-dark-4 dark:text-dark-7">
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
          <span className="text-dark-4 dark:text-dark-7">Event Types:</span>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded bg-blue"></div>
            <span className="text-dark dark:text-white">Practice</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded bg-yellow"></div>
            <span className="text-dark dark:text-white">Qualifying</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded bg-green"></div>
            <span className="text-dark dark:text-white">Race</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded bg-red"></div>
            <span className="text-dark dark:text-white">Championship</span>
          </div>
        </div>
      </div>
    </div>
  );
}