import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AccServerManager } from '@/lib/acc-server-manager';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get active drivers (logged in within last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { count: activeDrivers } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', weekAgo.toISOString());

    const { count: totalDrivers } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true });

    // Get total races
    const { count: totalRaces } = await supabase
      .from('race_results')
      .select('*', { count: 'exact', head: true });

    // Calculate growth rates (comparing to previous week)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const { count: previousWeekDrivers } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', twoWeeksAgo.toISOString())
      .lt('updated_at', weekAgo.toISOString());

    const driversGrowthRate = previousWeekDrivers 
      ? ((activeDrivers || 0) - previousWeekDrivers) / previousWeekDrivers * 100
      : 0;

    // Get server uptime (simplified)
    const serverManager = new AccServerManager();
    let serverUptime = 0;
    try {
      const sessionData = await serverManager.getRealSessionData();
      serverUptime = sessionData.length > 0 ? 1 : 0; // 1 if online, 0 if offline
    } catch (error) {
      console.error('Error checking server status:', error);
    }

    // Calculate average ELO rating
    const { data: avgEloData } = await supabase
      .from('drivers')
      .select('elo_rating');

    const avgRating = avgEloData?.length 
      ? avgEloData.reduce((sum, driver) => sum + (driver.elo_rating || 1500), 0) / avgEloData.length
      : 1500;

    return NextResponse.json({
      activeDrivers: {
        value: activeDrivers || 0,
        growthRate: Math.round(driversGrowthRate * 100) / 100,
      },
      totalRaces: {
        value: totalRaces || 0,
        growthRate: 0, // Could calculate race growth rate similarly
      },
      serverUptime: {
        value: serverUptime,
        growthRate: 0,
      },
      avgRating: {
        value: Math.round(avgRating),
        growthRate: 0,
      },
    });

  } catch (error) {
    console.error('Error fetching overview stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overview statistics' },
      { status: 500 }
    );
  }
}