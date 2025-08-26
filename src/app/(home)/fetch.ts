export async function getOverviewData() {
  try {
    const response = await fetch('/api/overview-stats');
    if (!response.ok) {
      throw new Error('Failed to fetch overview data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching overview data:', error);
    return {
      activeDrivers: {
        value: 0,
        growthRate: 0,
      },
      totalRaces: {
        value: 0,
        growthRate: 0,
      },
      serverUptime: {
        value: 0,
        growthRate: 0,
      },
      avgRating: {
        value: 1500,
        growthRate: 0,
      },
    };
  }
}

export async function getRecentDriversData() {
  try {
    const response = await fetch('/api/recent-drivers');
    if (!response.ok) {
      throw new Error('Failed to fetch recent drivers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent drivers:', error);
    return [];
  }
}