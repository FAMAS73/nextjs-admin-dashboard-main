"use client";

import { useState, useEffect } from "react";
import { RankingTable } from "./ranking-table";
import { LeaderboardFilters } from "./leaderboard-filters";
import { ChampionshipStandings } from "./championship-standings";
import { TopDrivers } from "./top-drivers";

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

// Mock leaderboard data
const mockDrivers: Driver[] = [
  {
    id: "1",
    rank: 1,
    previousRank: 2,
    steamId: "76561198123456789",
    driverName: "Max Verstappen",
    nationality: "NL",
    eloRating: 2247,
    totalRaces: 45,
    wins: 18,
    podiums: 32,
    points: 892,
    averageFinish: 2.1,
    bestLapTime: "2:15.847",
    totalLaps: 1247,
    cleanRacePercentage: 87.5,
    lastActive: "2025-08-25",
    trend: "up"
  },
  {
    id: "2",
    rank: 2,
    previousRank: 1,
    steamId: "76561198987654321",
    driverName: "Lewis Hamilton",
    nationality: "GB",
    eloRating: 2198,
    totalRaces: 52,
    wins: 15,
    podiums: 38,
    points: 934,
    averageFinish: 2.3,
    bestLapTime: "2:16.123",
    totalLaps: 1456,
    cleanRacePercentage: 91.2,
    lastActive: "2025-08-24",
    trend: "down"
  },
  {
    id: "3",
    rank: 3,
    previousRank: 3,
    steamId: "76561198456789123",
    driverName: "Charles Leclerc",
    nationality: "MC",
    eloRating: 2156,
    totalRaces: 41,
    wins: 12,
    podiums: 28,
    points: 756,
    averageFinish: 2.8,
    bestLapTime: "2:16.445",
    totalLaps: 1123,
    cleanRacePercentage: 84.7,
    lastActive: "2025-08-25",
    trend: "stable"
  },
  {
    id: "4",
    rank: 4,
    previousRank: 5,
    steamId: "76561198789123456",
    driverName: "Lando Norris",
    nationality: "GB",
    eloRating: 2089,
    totalRaces: 38,
    wins: 8,
    podiums: 22,
    points: 623,
    averageFinish: 3.2,
    bestLapTime: "2:17.234",
    totalLaps: 987,
    cleanRacePercentage: 88.9,
    lastActive: "2025-08-23",
    trend: "up"
  },
  {
    id: "5",
    rank: 5,
    previousRank: 4,
    steamId: "76561198321654987",
    driverName: "George Russell",
    nationality: "GB",
    eloRating: 2034,
    totalRaces: 43,
    wins: 6,
    podiums: 19,
    points: 587,
    averageFinish: 3.7,
    bestLapTime: "2:17.567",
    totalLaps: 1089,
    cleanRacePercentage: 85.3,
    lastActive: "2025-08-24",
    trend: "down"
  }
];

export function LeaderboardDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"all-time" | "season" | "month">("all-time");
  const [selectedCategory, setSelectedCategory] = useState<"overall" | "gt3" | "gt4" | "gt2">("overall");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<"rankings" | "championship" | "statistics">("rankings");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [championshipStandings, setChampionshipStandings] = useState<Driver[]>([]);
  const [topDrivers, setTopDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  // Fetch real leaderboard data from API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const categoryParam = selectedCategory === 'overall' ? 'all' : selectedCategory.toUpperCase();
        const response = await fetch(`/api/leaderboard?sortBy=elo&category=${categoryParam}&timeRange=${selectedPeriod}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          // Transform API data to match component interface
          const transformedDrivers: Driver[] = data.data.leaderboard.map((driver: any) => ({
            id: driver.id,
            rank: driver.rank,
            previousRank: driver.rank + (driver.trend === 'up' ? 1 : driver.trend === 'down' ? -1 : 0),
            steamId: driver.steamId || driver.id,
            driverName: `${driver.firstName} ${driver.lastName}`,
            nationality: 'UN', // Default nationality
            eloRating: driver.elo,
            totalRaces: driver.totalRaces,
            wins: driver.wins,
            podiums: driver.podiums,
            points: driver.points,
            averageFinish: driver.averagePosition || 0,
            bestLapTime: formatTime(driver.bestLapTime || 0),
            totalLaps: driver.totalLaps || 0,
            cleanRacePercentage: driver.cleanRaces > 0 && driver.totalRaces > 0 ? (driver.cleanRaces / driver.totalRaces * 100) : 0,
            lastActive: new Date().toISOString().split('T')[0], // Today as default
            trend: driver.trend as "up" | "down" | "stable"
          }));

          const transformedChampionship: Driver[] = data.data.championship.map((driver: any) => ({
            id: driver.id,
            rank: driver.position,
            previousRank: driver.position,
            steamId: driver.steamId || driver.id,
            driverName: `${driver.firstName} ${driver.lastName}`,
            nationality: 'UN',
            eloRating: driver.elo,
            totalRaces: driver.totalRaces,
            wins: driver.wins,
            podiums: driver.podiums,
            points: driver.points,
            averageFinish: driver.averagePosition || 0,
            bestLapTime: formatTime(driver.bestLapTime || 0),
            totalLaps: driver.totalLaps || 0,
            cleanRacePercentage: driver.cleanRaces > 0 && driver.totalRaces > 0 ? (driver.cleanRaces / driver.totalRaces * 100) : 0,
            lastActive: new Date().toISOString().split('T')[0],
            trend: 'stable' as const
          }));

          const transformedTopDrivers: Driver[] = data.data.topDrivers.map((driver: any) => ({
            id: driver.id,
            rank: driver.rank,
            previousRank: driver.rank,
            steamId: driver.steamId || driver.id,
            driverName: `${driver.firstName} ${driver.lastName}`,
            nationality: 'UN',
            eloRating: driver.elo,
            totalRaces: driver.totalRaces,
            wins: driver.wins,
            podiums: driver.podiums,
            points: driver.points,
            averageFinish: driver.averagePosition || 0,
            bestLapTime: formatTime(driver.bestLapTime || 0),
            totalLaps: driver.totalLaps || 0,
            cleanRacePercentage: driver.winPercentage || 0,
            lastActive: new Date().toISOString().split('T')[0],
            trend: 'stable' as const
          }));

          setDrivers(transformedDrivers);
          setChampionshipStandings(transformedChampionship);
          setTopDrivers(transformedTopDrivers);
          setStats(data.data.stats);
        } else {
          // No data available
          setDrivers([]);
          setChampionshipStandings([]);
          setTopDrivers([]);
          setStats({
            totalDrivers: 0,
            totalRaces: 0,
            activeDrivers: 0,
            categories: []
          });
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
        setDrivers([]);
        setChampionshipStandings([]);
        setTopDrivers([]);
        setStats({ totalDrivers: 0, totalRaces: 0, activeDrivers: 0, categories: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [selectedCategory, selectedPeriod]);

  // Helper function to format time in milliseconds to readable format
  const formatTime = (ms: number) => {
    if (!ms || ms === 0) return 'No time';
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
  };

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(driver =>
    driver.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Leaderboard Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentView("rankings")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === "rankings"
                ? "bg-primary text-white"
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            ELO Rankings
          </button>
          <button
            onClick={() => setCurrentView("championship")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === "championship"
                ? "bg-primary text-white"
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            Championship
          </button>
          <button
            onClick={() => setCurrentView("statistics")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === "statistics"
                ? "bg-primary text-white"
                : "bg-gray-1 text-dark hover:bg-gray-2 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            }`}
          >
            Statistics
          </button>
        </div>

        <LeaderboardFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Top 3 Drivers Showcase */}
      {currentView === "rankings" && !loading && (
        topDrivers.length > 0 ? (
          <TopDrivers drivers={topDrivers} />
        ) : (
          <div className="rounded-lg border border-stroke bg-white p-8 shadow-card dark:border-stroke-dark dark:bg-gray-dark text-center">
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">No Drivers Available</h3>
            <p className="text-dark-5 dark:text-dark-6">Configure your entry list to see driver rankings.</p>
          </div>
        )
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {currentView === "rankings" && (
          <RankingTable 
            drivers={filteredDrivers}
            period={selectedPeriod}
            category={selectedCategory}
          />
        )}
        {currentView === "championship" && (
          loading ? (
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-3 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-3 rounded"></div>
                      <div className="h-3 bg-gray-3 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ChampionshipStandings 
              drivers={championshipStandings}
              period={selectedPeriod}
            />
          )
        )}
        {currentView === "statistics" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Total Drivers</h4>
                  <p className="text-2xl font-bold text-dark dark:text-white">{stats?.totalDrivers || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue/10 text-blue">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Total Races</h4>
                  <p className="text-2xl font-bold text-dark dark:text-white">{stats?.totalRaces || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green/10 text-green">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Active Drivers</h4>
                  <p className="text-2xl font-bold text-dark dark:text-white">{stats?.activeDrivers || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow/10 text-yellow">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Categories</h4>
                  <p className="text-2xl font-bold text-dark dark:text-white">{stats?.categories?.length || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4z"/>
                  </svg>
                </div>
              </div>
            </div>

            {loading && (
              <div className="col-span-full">
                <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-3 rounded mb-4"></div>
                    <div className="h-4 bg-gray-3 rounded"></div>
                  </div>
                </div>
              </div>
            )}

            {!loading && (!stats || stats.totalDrivers === 0) && (
              <div className="col-span-full rounded-lg border border-stroke bg-white p-8 shadow-card dark:border-stroke-dark dark:bg-gray-dark text-center">
                <div className="mx-auto w-16 h-16 bg-gray-1 dark:bg-dark-2 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-dark-4 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">No Driver Statistics</h3>
                <p className="text-dark-5 dark:text-dark-6">Register drivers in your entry list to see statistics.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Total Drivers</h4>
              <p className="text-2xl font-bold text-dark dark:text-white">{mockDrivers.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue/10 text-blue">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Races Completed</h4>
              <p className="text-2xl font-bold text-dark dark:text-white">
                {mockDrivers.reduce((sum, driver) => sum + driver.totalRaces, 0)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green/10 text-green">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-dark-4 dark:text-dark-7">Avg Clean Race %</h4>
              <p className="text-2xl font-bold text-dark dark:text-white">
                {Math.round(mockDrivers.reduce((sum, driver) => sum + driver.cleanRacePercentage, 0) / mockDrivers.length)}%
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow/10 text-yellow">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}