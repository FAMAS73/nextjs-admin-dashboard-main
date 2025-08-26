"use client";

import { useState, useEffect } from "react";
import { ResultsList } from "./results-list";
import { RaceDetails } from "./race-details";
import { MediaGallery } from "./media-gallery";
import { ResultsFilters } from "./results-filters";

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
  media?: Array<{
    id: string;
    type: "image" | "video";
    url: string;
    thumbnail: string;
    title: string;
    uploadedBy: string;
    uploadDate: string;
  }>;
}

// Mock race results data
const mockRaceResults: RaceResult[] = [
  {
    id: "1",
    raceTitle: "GT3 Championship - Spa Weekend",
    track: "Spa-Francorchamps",
    date: "2025-08-24",
    time: "20:00",
    duration: 90,
    carGroup: "GT3",
    weather: "mixed",
    participants: 24,
    fastestLap: {
      time: "2:15.847",
      driver: "Max Verstappen",
      car: "Audi R8 LMS Evo"
    },
    raceResults: [
      {
        position: 1,
        driverName: "Max Verstappen",
        carModel: "Audi R8 LMS Evo",
        carNumber: 33,
        totalTime: "2:34:15.847",
        bestLapTime: "2:15.847",
        laps: 67,
        gap: "Winner",
        points: 25,
        nationality: "NL"
      },
      {
        position: 2,
        driverName: "Lewis Hamilton", 
        carModel: "Mercedes-AMG GT3",
        carNumber: 44,
        totalTime: "2:34:18.392",
        bestLapTime: "2:16.123",
        laps: 67,
        gap: "+2.545",
        points: 20,
        nationality: "GB"
      },
      {
        position: 3,
        driverName: "Charles Leclerc",
        carModel: "Ferrari 488 GT3 Evo",
        carNumber: 16,
        totalTime: "2:34:25.671",
        bestLapTime: "2:16.445",
        laps: 67,
        gap: "+9.824",
        points: 16,
        nationality: "MC"
      },
      {
        position: 4,
        driverName: "Lando Norris",
        carModel: "McLaren 720S GT3",
        carNumber: 4,
        totalTime: "2:34:32.156",
        bestLapTime: "2:17.234",
        laps: 67,
        gap: "+16.309",
        points: 12,
        nationality: "GB"
      },
      {
        position: 5,
        driverName: "George Russell",
        carModel: "Mercedes-AMG GT3",
        carNumber: 63,
        totalTime: "2:34:45.892",
        bestLapTime: "2:17.567",
        laps: 67,
        gap: "+30.045",
        points: 10,
        nationality: "GB"
      }
    ],
    media: [
      {
        id: "1",
        type: "image",
        url: "/images/races/spa-podium.jpg",
        thumbnail: "/images/races/spa-podium-thumb.jpg", 
        title: "Podium Celebration - Spa GT3",
        uploadedBy: "Race Official",
        uploadDate: "2025-08-24"
      },
      {
        id: "2", 
        type: "video",
        url: "/videos/races/spa-highlights.mp4",
        thumbnail: "/images/races/spa-video-thumb.jpg",
        title: "Race Highlights - 90 Minutes at Spa",
        uploadedBy: "Broadcast Team",
        uploadDate: "2025-08-24"
      }
    ]
  },
  {
    id: "2",
    raceTitle: "GT4 Championship - Brands Hatch",
    track: "Brands Hatch",
    date: "2025-08-22",
    time: "19:30",
    duration: 75,
    carGroup: "GT4", 
    weather: "rainy",
    participants: 28,
    fastestLap: {
      time: "1:28.456",
      driver: "Sebastian Vettel",
      car: "Porsche 718 Cayman GT4"
    },
    raceResults: [
      {
        position: 1,
        driverName: "Sebastian Vettel",
        carModel: "Porsche 718 Cayman GT4",
        carNumber: 5,
        totalTime: "2:05:12.345",
        bestLapTime: "1:28.456",
        laps: 85,
        gap: "Winner",
        points: 25,
        nationality: "DE"
      },
      {
        position: 2,
        driverName: "Fernando Alonso",
        carModel: "Alpine A110 GT4",
        carNumber: 14,
        totalTime: "2:05:18.789",
        bestLapTime: "1:28.987",
        laps: 85,
        gap: "+6.444",
        points: 20,
        nationality: "ES"
      },
      {
        position: 3,
        driverName: "Kimi Räikkönen",
        carModel: "BMW M4 GT4",
        carNumber: 7,
        totalTime: "2:05:25.123",
        bestLapTime: "1:29.234",
        laps: 85,
        gap: "+12.778",
        points: 16,
        nationality: "FI"
      }
    ]
  }
];

export function RaceResultsDashboard() {
  const [selectedRace, setSelectedRace] = useState<RaceResult | null>(null);
  const [currentView, setCurrentView] = useState<"results" | "media">("results");
  const [filterTrack, setFilterTrack] = useState<string>("all");
  const [filterCarGroup, setFilterCarGroup] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  // Fetch real race results from API
  useEffect(() => {
    const fetchRaceResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/race-results?track=${filterTrack}&category=${filterCarGroup}&page=1&limit=50`);
        const data = await response.json();
        
        if (data.success && data.data.results) {
          // Transform API data to match component interface
          const transformedResults: RaceResult[] = data.data.results.map((result: any) => ({
            id: result.id,
            raceTitle: result.eventName || 'Race Event',
            track: result.track || 'Unknown Track',
            date: new Date(result.date).toLocaleDateString(),
            time: new Date(result.date).toLocaleTimeString(),
            duration: Math.round((result.duration || 0) / 60), // Convert to minutes
            carGroup: result.category || 'GT3' as any,
            weather: result.weather?.toLowerCase() || 'sunny' as any,
            participants: result.participants || 0,
            fastestLap: {
              time: formatTime(Math.min(...(result.results || []).map((r: any) => r.bestLapTime || Infinity).filter(t => t !== Infinity)) || 0),
              driver: (result.results || []).find((r: any) => r.bestLapTime === Math.min(...result.results.map((r: any) => r.bestLapTime || Infinity)))?.driverName || 'Unknown',
              car: (result.results || []).find((r: any) => r.bestLapTime === Math.min(...result.results.map((r: any) => r.bestLapTime || Infinity)))?.carModel || 'Unknown'
            },
            raceResults: (result.results || []).map((driver: any) => ({
              position: driver.position,
              driverName: driver.driverName,
              carModel: driver.carModel,
              carNumber: driver.carNumber,
              totalTime: formatTime(driver.totalTime || 0),
              bestLapTime: formatTime(driver.bestLapTime || 0),
              laps: driver.laps || 0,
              gap: driver.gap || '+0.000',
              points: driver.points || 0,
              nationality: 'UN' // Default nationality
            }))
          }));
          
          setRaceResults(transformedResults);
          setSummary(data.data.summary);
        } else {
          // No results available, show empty state
          setRaceResults([]);
          setSummary(data.data?.summary || {
            totalRaces: 0,
            totalResults: 0,
            uniqueDrivers: 0,
            uniqueTracks: 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch race results:', error);
        setRaceResults([]);
        setSummary({ totalRaces: 0, totalResults: 0, uniqueDrivers: 0, uniqueTracks: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchRaceResults();
  }, [filterTrack, filterCarGroup]);

  // Helper function to format time in milliseconds to readable format
  const formatTime = (ms: number) => {
    if (!ms || ms === 0) return '0:00.000';
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
  };

  // Filter results based on search term
  const filteredResults = raceResults.filter(race => {
    const matchesSearch = race.raceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         race.track.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Results Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentView("results")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === "results"
                ? "bg-primary text-white"
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            Race Results
          </button>
          <button
            onClick={() => setCurrentView("media")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === "media"
                ? "bg-primary text-white"
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            Media Gallery
          </button>
        </div>

        {currentView === "results" && (
          <ResultsFilters
            filterTrack={filterTrack}
            onTrackChange={setFilterTrack}
            filterCarGroup={filterCarGroup}
            onCarGroupChange={setFilterCarGroup}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Results List */}
        <div className="lg:col-span-2">
          {currentView === "results" && (
            <ResultsList 
              races={filteredResults}
              onRaceSelect={setSelectedRace}
              selectedRace={selectedRace}
            />
          )}
          {currentView === "media" && (
            <MediaGallery races={raceResults} />
          )}
        </div>

        {/* Race Details Sidebar */}
        <div>
          {selectedRace && currentView === "results" ? (
            <RaceDetails 
              race={selectedRace}
              onClose={() => setSelectedRace(null)}
            />
          ) : (
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                Race Details
              </h3>
              <p className="text-center text-dark-5 dark:text-dark-6">
                Select a race to view detailed results
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-3 rounded mb-2"></div>
                <div className="h-8 bg-gray-3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Total Races</h4>
                <p className="text-2xl font-bold text-dark dark:text-white">{summary?.totalRaces || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue/10 text-blue">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Unique Drivers</h4>
                <p className="text-2xl font-bold text-dark dark:text-white">{summary?.uniqueDrivers || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green/10 text-green">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Unique Tracks</h4>
                <p className="text-2xl font-bold text-dark dark:text-white">{summary?.uniqueTracks || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow/10 text-yellow">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Data Source</h4>
                <p className="text-lg font-bold text-primary">Real ACC</p>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  {raceResults.length > 0 ? `${raceResults.length} results loaded` : 'No results yet'}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && raceResults.length === 0 && (
        <div className="rounded-lg border border-stroke bg-white p-8 shadow-card dark:border-stroke-dark dark:bg-gray-dark text-center">
          <div className="mx-auto w-16 h-16 bg-gray-1 dark:bg-dark-2 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-dark-4 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">No Race Results Available</h3>
          <p className="text-dark-5 dark:text-dark-6 mb-4">
            Complete some races on your ACC server to see results here. Make sure your server is configured and running.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/server-config"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Configure Server
            </a>
            <a
              href="/server-control"
              className="inline-flex items-center rounded-md border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
            >
              Start Server
            </a>
          </div>
        </div>
      )}
    </div>
  );
}