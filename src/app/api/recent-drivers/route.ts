import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get recent drivers (last 24 hours activity)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentDrivers, error } = await supabase
      .from('drivers')
      .select('id, username, display_name, avatar_url, elo_rating, updated_at, is_online')
      .gte('updated_at', yesterday.toISOString())
      .order('updated_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent drivers:', error);
      return NextResponse.json([], { status: 200 });
    }

    // Transform to chat-like format for the dashboard component
    const transformedDrivers = recentDrivers?.map(driver => ({
      name: driver.display_name || driver.username,
      profile: driver.avatar_url || '/images/user/user-03.png',
      isActive: driver.is_online || false,
      lastMessage: {
        content: `ELO: ${driver.elo_rating}`,
        type: 'text',
        timestamp: driver.updated_at,
        isRead: true,
      },
      unreadCount: 0,
    })) || [];

    return NextResponse.json(transformedDrivers);

  } catch (error) {
    console.error('Error fetching recent drivers:', error);
    return NextResponse.json([], { status: 200 });
  }
}