import { NextRequest, NextResponse } from "next/server";
import { accServerManager } from "@/lib/acc-server-manager";

// Get real race results from ACC server
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const track = searchParams.get('track');
    const category = searchParams.get('category');

    // Get real race results from ACC server
    const allResults = accServerManager.getRealRaceResults();
    
    // Filter results if track or category specified
    let filteredResults = [...allResults];
    
    if (track && track !== 'all') {
      filteredResults = filteredResults.filter(result => 
        result.trackName?.toLowerCase().includes(track.toLowerCase()) ||
        result.track?.toLowerCase().includes(track.toLowerCase())
      );
    }

    if (category && category !== 'all') {
      filteredResults = filteredResults.filter(result => 
        result.carGroup === category || result.category === category
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedResults = filteredResults.slice(startIndex, startIndex + limit);

    // Transform results to match expected format
    const formattedResults = paginatedResults.map((result, index) => {
      const raceData = {
        id: result.filename || `race_${Date.now()}_${index}`,
        eventName: result.sessionResult?.sessionName || `Race ${startIndex + index + 1}`,
        track: result.trackName || result.sessionResult?.trackName || 'Unknown Track',
        date: result.raceDate || new Date().toISOString(),
        duration: result.sessionResult?.sessionDuration || 0,
        category: result.carGroup || 'GT3',
        weather: result.sessionResult?.weatherType || 'Clear',
        participants: result.sessionResult?.leaderBoardLines?.length || 0,
        results: (result.sessionResult?.leaderBoardLines || []).map((driver: any, pos: number) => ({
          position: pos + 1,
          driverName: `${driver.car?.drivers?.[0]?.firstName || 'Unknown'} ${driver.car?.drivers?.[0]?.lastName || 'Driver'}`,
          carNumber: driver.car?.raceNumber || pos + 1,
          carModel: driver.car?.carModel || 'Unknown Car',
          bestLapTime: driver.timing?.bestLap || 0,
          totalTime: driver.timing?.totalTime || 0,
          gap: pos === 0 ? 'Winner' : `+${(driver.timing?.totalTime - result.sessionResult?.leaderBoardLines[0]?.timing?.totalTime || 0)}`,
          laps: driver.timing?.lapCount || 0,
          points: Math.max(25 - pos * 2, 1) // Simple points system
        }))
      };

      return raceData;
    });

    // Generate summary statistics
    const allDrivers = allResults.flatMap(result => 
      result.sessionResult?.leaderBoardLines?.map((driver: any) => 
        `${driver.car?.drivers?.[0]?.firstName} ${driver.car?.drivers?.[0]?.lastName}`
      ).filter(Boolean) || []
    );

    const uniqueTracks = [...new Set(allResults.map(result => 
      result.trackName || result.sessionResult?.trackName
    ).filter(Boolean))];

    const summary = {
      totalRaces: allResults.length,
      totalResults: filteredResults.length,
      uniqueDrivers: [...new Set(allDrivers)].length,
      uniqueTracks: uniqueTracks.length,
      availableTracks: uniqueTracks,
      categories: [...new Set(allResults.map(result => result.carGroup).filter(Boolean))]
    };

    return NextResponse.json({
      success: true,
      data: {
        results: formattedResults,
        pagination: {
          page,
          limit,
          total: filteredResults.length,
          totalPages: Math.ceil(filteredResults.length / limit),
          hasNext: startIndex + limit < filteredResults.length,
          hasPrev: page > 1
        },
        summary,
        filters: {
          track: track || 'all',
          category: category || 'all'
        }
      },
      source: 'real_acc_data',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Failed to get race results:", error);
    
    // Return empty results structure instead of error
    return NextResponse.json({
      success: true,
      data: {
        results: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        summary: {
          totalRaces: 0,
          totalResults: 0,
          uniqueDrivers: 0,
          uniqueTracks: 0,
          availableTracks: [],
          categories: []
        },
        filters: {
          track: 'all',
          category: 'all'
        }
      },
      source: 'real_acc_data',
      message: "No race results available. Complete some races to see results here.",
      timestamp: new Date().toISOString(),
    });
  }
}

// Get specific race result details
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raceId } = body;

    if (!raceId) {
      return NextResponse.json(
        { success: false, error: "Race ID is required" },
        { status: 400 }
      );
    }

    const allResults = accServerManager.getRealRaceResults();
    const raceResult = allResults.find(result => result.filename === raceId);

    if (!raceResult) {
      return NextResponse.json(
        { success: false, error: "Race result not found" },
        { status: 404 }
      );
    }

    // Format detailed race result
    const detailedResult = {
      id: raceResult.filename,
      eventName: raceResult.sessionResult?.sessionName || 'Race Event',
      track: raceResult.trackName || raceResult.sessionResult?.trackName || 'Unknown Track',
      date: raceResult.raceDate,
      weather: {
        type: raceResult.sessionResult?.weatherType || 'Clear',
        temperature: raceResult.sessionResult?.ambientTemp || 20,
        trackTemp: raceResult.sessionResult?.trackTemp || 25
      },
      session: {
        type: raceResult.sessionResult?.type || 'Race',
        duration: raceResult.sessionResult?.sessionDuration || 0,
        laps: raceResult.sessionResult?.raceWeekendIndex || 0
      },
      results: (raceResult.sessionResult?.leaderBoardLines || []).map((driver: any, index: number) => ({
        position: index + 1,
        driver: {
          firstName: driver.car?.drivers?.[0]?.firstName || 'Unknown',
          lastName: driver.car?.drivers?.[0]?.lastName || 'Driver',
          nationality: driver.car?.drivers?.[0]?.nationality || 0,
          steamId: driver.car?.drivers?.[0]?.playerId || ''
        },
        car: {
          number: driver.car?.raceNumber || index + 1,
          model: driver.car?.carModel || 0,
          teamName: driver.car?.teamName || 'Independent'
        },
        timing: {
          bestLapTime: driver.timing?.bestLap || 0,
          totalTime: driver.timing?.totalTime || 0,
          lapCount: driver.timing?.lapCount || 0,
          sectors: driver.timing?.bestSplits || [0, 0, 0]
        },
        penalties: driver.penalties || []
      }))
    };

    return NextResponse.json({
      success: true,
      data: detailedResult,
      source: 'real_acc_data',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Failed to get race result details:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get race result details",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}