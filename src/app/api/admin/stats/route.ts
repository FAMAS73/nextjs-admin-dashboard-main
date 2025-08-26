import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AccServerManager } from '@/lib/acc-server-manager';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total users count
    const { count: totalUsers } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true });

    // Get active users (logged in within last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { count: activeUsers } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', yesterday.toISOString());

    // Get total races from race results
    const { count: totalRaces } = await supabase
      .from('race_results')
      .select('*', { count: 'exact', head: true });

    // Check server status
    const serverManager = new AccServerManager();
    let serverStatus: 'online' | 'offline' = 'offline';
    let lastRace = 'Never';

    try {
      const sessionData = await serverManager.getRealSessionData();
      serverStatus = sessionData.length > 0 ? 'online' : 'offline';
      
      // Get last race from race results
      const { data: lastRaceData } = await supabase
        .from('race_results')
        .select('session_date')
        .order('session_date', { ascending: false })
        .limit(1)
        .single();

      if (lastRaceData) {
        lastRace = new Date(lastRaceData.session_date).toLocaleDateString();
      }
    } catch (error) {
      console.error('Error checking server status:', error);
    }

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalRaces: totalRaces || 0,
      serverStatus,
      lastRace
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}