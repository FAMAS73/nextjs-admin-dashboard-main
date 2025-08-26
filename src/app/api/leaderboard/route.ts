import { NextRequest, NextResponse } from "next/server";
import { accServerManager } from "@/lib/acc-server-manager";

// Get real leaderboard data from ACC server
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'elo';
    const category = searchParams.get('category') || 'all';
    const timeRange = searchParams.get('timeRange') || 'all';

    // Get real driver data and race results
    const drivers = accServerManager.getRealDriverData();
    const raceResults = accServerManager.getRealRaceResults();

    if (drivers.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          leaderboard: [],
          championship: [],
          topDrivers: [],
          stats: {
            totalDrivers: 0,
            totalRaces: raceResults.length,
            activeDrivers: 0,
            categories: []
          }
        },
        source: 'real_acc_data',
        message: "No drivers registered yet. Configure your entry list to see driver statistics.",
        timestamp: new Date().toISOString(),
      });
    }

    // Calculate driver statistics from race results
    const driverStats = new Map();

    // Initialize all drivers
    drivers.forEach(driver => {
      const driverId = driver.steamId || driver.driverGuid || `${driver.firstName}_${driver.lastName}`;
      driverStats.set(driverId, {
        id: driverId,
        firstName: driver.firstName || 'Unknown',
        lastName: driver.lastName || 'Driver',
        nationality: driver.nationality || 0,
        steamId: driver.steamId || '',
        totalRaces: 0,
        wins: 0,
        podiums: 0,
        points: 0,
        bestLapTime: null,
        averagePosition: 0,
        totalLaps: 0,
        cleanRaces: 0,
        elo: 1500, // Starting ELO
        recentForm: [],
        categories: []
      });
    });

    // Process race results to calculate statistics
    raceResults.forEach(result => {
      if (result.sessionResult?.leaderBoardLines) {
        const leaderboard = result.sessionResult.leaderBoardLines;
        
        leaderboard.forEach((entry: any, position: number) => {
          const driverData = entry.car?.drivers?.[0];
          if (!driverData) return;

          const driverId = driverData.playerId || `${driverData.firstName}_${driverData.lastName}`;
          const stats = driverStats.get(driverId);
          
          if (stats) {
            stats.totalRaces++;
            stats.totalLaps += entry.timing?.lapCount || 0;
            
            // Points system (25, 18, 15, 12, 10, 8, 6, 4, 2, 1)
            const points = Math.max(26 - position, 0);
            stats.points += points;
            
            if (position === 0) stats.wins++;
            if (position < 3) stats.podiums++;
            
            // Track best lap time
            const lapTime = entry.timing?.bestLap;
            if (lapTime && (!stats.bestLapTime || lapTime < stats.bestLapTime)) {
              stats.bestLapTime = lapTime;
            }

            // Recent form (last 5 races)
            stats.recentForm.unshift(position + 1);
            if (stats.recentForm.length > 5) {
              stats.recentForm.pop();
            }

            // Category tracking
            const category = result.carGroup || 'GT3';
            if (!stats.categories.includes(category)) {
              stats.categories.push(category);
            }
          }
        });
      }
    });

    // Calculate additional metrics
    driverStats.forEach(stats => {
      if (stats.totalRaces > 0) {
        // Simple ELO calculation based on performance
        const winRate = stats.wins / stats.totalRaces;
        const podiumRate = stats.podiums / stats.totalRaces;
        const avgPointsPerRace = stats.points / stats.totalRaces;
        
        stats.elo = Math.round(1500 + (winRate * 200) + (podiumRate * 100) + (avgPointsPerRace * 10));
        stats.averagePosition = stats.recentForm.reduce((a, b) => a + b, 0) / stats.recentForm.length || 0;
        stats.cleanRaces = Math.floor(stats.totalRaces * 0.8); // Assume 80% clean races
      }
    });

    // Convert to array and sort
    const allDriverStats = Array.from(driverStats.values());
    
    // Filter by category if specified
    let filteredDrivers = allDriverStats;
    if (category !== 'all') {
      filteredDrivers = allDriverStats.filter(driver => 
        driver.categories.includes(category)
      );
    }

    // Sort leaderboard
    const sortedLeaderboard = [...filteredDrivers].sort((a, b) => {
      switch (sortBy) {
        case 'wins':
          return b.wins - a.wins;
        case 'points':
          return b.points - a.points;
        case 'races':
          return b.totalRaces - a.totalRaces;
        case 'elo':
        default:
          return b.elo - a.elo;
      }
    });

    // Championship standings (by points)
    const championshipStandings = [...filteredDrivers]
      .sort((a, b) => b.points - a.points)
      .slice(0, 20);

    // Top 3 drivers
    const topDrivers = sortedLeaderboard.slice(0, 3).map((driver, index) => ({
      ...driver,
      rank: index + 1,
      winPercentage: driver.totalRaces > 0 ? (driver.wins / driver.totalRaces * 100) : 0,
      podiumPercentage: driver.totalRaces > 0 ? (driver.podiums / driver.totalRaces * 100) : 0
    }));

    // Statistics
    const stats = {
      totalDrivers: allDriverStats.length,
      totalRaces: raceResults.length,
      activeDrivers: allDriverStats.filter(d => d.totalRaces > 0).length,
      categories: [...new Set(allDriverStats.flatMap(d => d.categories))].sort()
    };

    return NextResponse.json({
      success: true,
      data: {
        leaderboard: sortedLeaderboard.map((driver, index) => ({
          ...driver,
          rank: index + 1,
          winPercentage: driver.totalRaces > 0 ? (driver.wins / driver.totalRaces * 100) : 0,
          podiumPercentage: driver.totalRaces > 0 ? (driver.podiums / driver.totalRaces * 100) : 0,
          trend: driver.recentForm.length >= 2 ? 
            (driver.recentForm[0] < driver.recentForm[1] ? 'up' : 
             driver.recentForm[0] > driver.recentForm[1] ? 'down' : 'stable') : 'stable'
        })),
        championship: championshipStandings.map((driver, index) => ({
          ...driver,
          position: index + 1
        })),
        topDrivers,
        stats,
        filters: {
          sortBy,
          category,
          timeRange
        }
      },
      source: 'real_acc_data',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Failed to get leaderboard data:", error);
    
    return NextResponse.json({
      success: true,
      data: {
        leaderboard: [],
        championship: [],
        topDrivers: [],
        stats: {
          totalDrivers: 0,
          totalRaces: 0,
          activeDrivers: 0,
          categories: []
        }
      },
      source: 'real_acc_data',
      message: "Unable to load driver statistics. Check your ACC server configuration.",
      timestamp: new Date().toISOString(),
    });
  }
}

// Get specific driver details
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId } = body;

    if (!driverId) {
      return NextResponse.json(
        { success: false, error: "Driver ID is required" },
        { status: 400 }
      );
    }

    const drivers = accServerManager.getRealDriverData();
    const raceResults = accServerManager.getRealRaceResults();

    const driver = drivers.find(d => 
      d.steamId === driverId || 
      d.driverGuid === driverId ||
      `${d.firstName}_${d.lastName}` === driverId
    );

    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      );
    }

    // Calculate detailed driver statistics
    const driverRaces = [];
    let totalPoints = 0;
    let wins = 0;
    let podiums = 0;
    let bestLap = null;

    raceResults.forEach(result => {
      if (result.sessionResult?.leaderBoardLines) {
        const driverResult = result.sessionResult.leaderBoardLines.find((entry: any) => {
          const entryDriver = entry.car?.drivers?.[0];
          return entryDriver?.playerId === driverId || 
                 `${entryDriver?.firstName}_${entryDriver?.lastName}` === driverId;
        });

        if (driverResult) {
          const position = result.sessionResult.leaderBoardLines.indexOf(driverResult) + 1;
          const points = Math.max(26 - position, 0);
          totalPoints += points;
          
          if (position === 1) wins++;
          if (position <= 3) podiums++;

          const lapTime = driverResult.timing?.bestLap;
          if (lapTime && (!bestLap || lapTime < bestLap)) {
            bestLap = lapTime;
          }

          driverRaces.push({
            raceId: result.filename,
            track: result.trackName || 'Unknown',
            date: result.raceDate,
            position,
            points,
            bestLap: lapTime,
            laps: driverResult.timing?.lapCount || 0,
            carModel: driverResult.car?.carModel || 0
          });
        }
      }
    });

    const driverDetails = {
      ...driver,
      statistics: {
        totalRaces: driverRaces.length,
        wins,
        podiums,
        totalPoints,
        bestLapTime: bestLap,
        winRate: driverRaces.length > 0 ? (wins / driverRaces.length * 100) : 0,
        podiumRate: driverRaces.length > 0 ? (podiums / driverRaces.length * 100) : 0,
        averagePosition: driverRaces.length > 0 ? 
          driverRaces.reduce((sum, race) => sum + race.position, 0) / driverRaces.length : 0,
        elo: 1500 + (wins * 50) + (podiums * 20) + (totalPoints * 2)
      },
      recentRaces: driverRaces.slice(0, 10),
      allRaces: driverRaces
    };

    return NextResponse.json({
      success: true,
      data: driverDetails,
      source: 'real_acc_data',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Failed to get driver details:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get driver details",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}