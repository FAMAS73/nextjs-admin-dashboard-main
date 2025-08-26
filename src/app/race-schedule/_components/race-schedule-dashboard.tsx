"use client";

import { useState } from "react";
import { ScheduleCalendar } from "./schedule-calendar";
import { UpcomingEvents } from "./upcoming-events";
import { EventDetails } from "./event-details";

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

// Mock race schedule data
const mockEvents: RaceEvent[] = [
  {
    id: "1",
    title: "Weekend Practice Session",
    track: "Spa-Francorchamps",
    date: "2025-08-26",
    time: "19:00",
    duration: 60,
    type: "practice",
    carGroup: "FreeForAll",
    maxEntries: 30,
    currentEntries: 12,
    weather: "sunny",
    status: "registration",
    description: "Open practice session for all skill levels. Perfect for setup testing and track familiarization."
  },
  {
    id: "2", 
    title: "GT3 Championship Qualifying",
    track: "Monza",
    date: "2025-08-27",
    time: "20:00",
    duration: 30,
    type: "qualifying",
    carGroup: "GT3",
    maxEntries: 24,
    currentEntries: 18,
    weather: "cloudy",
    status: "registration",
    description: "Championship qualifying session determining grid positions for Sunday's race."
  },
  {
    id: "3",
    title: "GT3 Championship Race",
    track: "Monza",
    date: "2025-08-28",
    time: "20:00",
    duration: 90,
    type: "championship",
    carGroup: "GT3",
    maxEntries: 24,
    currentEntries: 18,
    weather: "mixed",
    status: "registration",
    description: "Championship race featuring 90 minutes of intense GT3 racing at the Temple of Speed."
  },
  {
    id: "4",
    title: "Midweek GT4 Series",
    track: "Brands Hatch",
    date: "2025-08-30",
    time: "19:30",
    duration: 75,
    type: "race",
    carGroup: "GT4",
    maxEntries: 28,
    currentEntries: 8,
    weather: "rainy",
    status: "upcoming",
    description: "Exciting GT4 racing in challenging weather conditions at the classic British circuit."
  },
  {
    id: "5",
    title: "Nordschleife Endurance",
    track: "Nürburgring",
    date: "2025-09-01",
    time: "15:00",
    duration: 180,
    type: "championship",
    carGroup: "GT3",
    maxEntries: 40,
    currentEntries: 23,
    weather: "mixed",
    status: "registration",
    description: "3-hour endurance race on the legendary Nordschleife. Team entries welcome."
  }
];

export function RaceScheduleDashboard() {
  const [selectedView, setSelectedView] = useState<"calendar" | "list">("list");
  const [selectedEvent, setSelectedEvent] = useState<RaceEvent | null>(null);
  const [filterType, setFilterType] = useState<"all" | "practice" | "qualifying" | "race" | "championship">("all");

  const filteredEvents = mockEvents.filter(event => 
    filterType === "all" || event.type === filterType
  );

  const upcomingEvents = filteredEvents.filter(event => 
    new Date(event.date + "T" + event.time) > new Date()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Schedule Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedView("list")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedView === "list"
                ? "bg-primary text-white"
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            Event List
          </button>
          <button
            onClick={() => setSelectedView("calendar")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedView === "calendar"
                ? "bg-primary text-white"
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            Calendar View
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Event Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm outline-none transition focus:border-primary dark:border-stroke-dark dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          >
            <option value="all">All Events</option>
            <option value="practice">Practice</option>
            <option value="qualifying">Qualifying</option>
            <option value="race">Races</option>
            <option value="championship">Championship</option>
          </select>

          {/* Add Event Button */}
          <button className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Schedule View */}
        <div className="lg:col-span-2">
          {selectedView === "calendar" && (
            <ScheduleCalendar 
              events={filteredEvents}
              onEventSelect={setSelectedEvent}
            />
          )}
          {selectedView === "list" && (
            <UpcomingEvents 
              events={filteredEvents}
              onEventSelect={setSelectedEvent}
            />
          )}
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-6">
          {selectedEvent ? (
            <EventDetails 
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          ) : (
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                Event Details
              </h3>
              <p className="text-center text-dark-5 dark:text-dark-6">
                Select an event to view details
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Schedule Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-dark-4 dark:text-dark-7">Upcoming Events</span>
                <span className="font-medium text-dark dark:text-white">
                  {upcomingEvents.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-4 dark:text-dark-7">This Week</span>
                <span className="font-medium text-dark dark:text-white">
                  {mockEvents.filter(event => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return eventDate >= today && eventDate <= weekFromNow;
                  }).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-4 dark:text-dark-7">Open Registration</span>
                <span className="font-medium text-green">
                  {mockEvents.filter(event => event.status === "registration").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-4 dark:text-dark-7">Championship Events</span>
                <span className="font-medium text-yellow">
                  {mockEvents.filter(event => event.type === "championship").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}