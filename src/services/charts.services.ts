export async function getCarUsageData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  try {
    const response = await fetch('/api/car-usage-stats');
    if (!response.ok) {
      throw new Error('Failed to fetch car usage data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching car usage data:', error);
    // Fallback data
    return [
      {
        name: "GT3 Cars",
        percentage: 0.75,
        amount: 156,
      },
      {
        name: "GT4 Cars", 
        percentage: 0.15,
        amount: 31,
      },
      {
        name: "GT2 Cars",
        percentage: 0.08,
        amount: 17,
      },
      {
        name: "GTC Cars",
        percentage: 0.02,
        amount: 4,
      },
    ];
  }
}

export async function getRaceResultsOverTime(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  try {
    const response = await fetch(`/api/race-stats-timeline?timeFrame=${timeFrame || 'monthly'}`);
    if (!response.ok) {
      throw new Error('Failed to fetch race results data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching race results data:', error);
    // Fallback data
    if (timeFrame === "yearly") {
      return {
        races: [
          { x: 2023, y: 45 },
          { x: 2024, y: 62 },
          { x: 2025, y: 8 },
        ],
        drivers: [
          { x: 2023, y: 148 },
          { x: 2024, y: 172 },
          { x: 2025, y: 25 },
        ],
      };
    }

    return {
      races: [
        { x: "Jan", y: 0 },
        { x: "Feb", y: 2 },
        { x: "Mar", y: 3 },
        { x: "Apr", y: 4 },
        { x: "May", y: 3 },
        { x: "Jun", y: 5 },
        { x: "Jul", y: 6 },
        { x: "Aug", y: 5 },
        { x: "Sep", y: 6 },
        { x: "Oct", y: 7 },
        { x: "Nov", y: 6 },
        { x: "Dec", y: 7 },
      ],
      drivers: [
        { x: "Jan", y: 0 },
        { x: "Feb", y: 9 },
        { x: "Mar", y: 17 },
        { x: "Apr", y: 32 },
        { x: "May", y: 25 },
        { x: "Jun", y: 48 },
        { x: "Jul", y: 60 },
        { x: "Aug", y: 48 },
        { x: "Sep", y: 64 },
        { x: "Oct", y: 74 },
        { x: "Nov", y: 54 },
        { x: "Dec", y: 42 },
      ],
    };
  }
}

export async function getWeeksProfitData(timeFrame?: string) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "last week") {
    return {
      sales: [
        { x: "Sat", y: 33 },
        { x: "Sun", y: 44 },
        { x: "Mon", y: 31 },
        { x: "Tue", y: 57 },
        { x: "Wed", y: 12 },
        { x: "Thu", y: 33 },
        { x: "Fri", y: 55 },
      ],
      revenue: [
        { x: "Sat", y: 10 },
        { x: "Sun", y: 20 },
        { x: "Mon", y: 17 },
        { x: "Tue", y: 7 },
        { x: "Wed", y: 10 },
        { x: "Thu", y: 23 },
        { x: "Fri", y: 13 },
      ],
    };
  }

  return {
    sales: [
      { x: "Sat", y: 44 },
      { x: "Sun", y: 55 },
      { x: "Mon", y: 41 },
      { x: "Tue", y: 67 },
      { x: "Wed", y: 22 },
      { x: "Thu", y: 43 },
      { x: "Fri", y: 65 },
    ],
    revenue: [
      { x: "Sat", y: 13 },
      { x: "Sun", y: 23 },
      { x: "Mon", y: 20 },
      { x: "Tue", y: 8 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 27 },
      { x: "Fri", y: 15 },
    ],
  };
}

export async function getCampaignVisitorsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    total_visitors: 784_000,
    performance: -1.5,
    chart: [
      { x: "S", y: 168 },
      { x: "S", y: 385 },
      { x: "M", y: 201 },
      { x: "T", y: 298 },
      { x: "W", y: 187 },
      { x: "T", y: 195 },
      { x: "F", y: 291 },
    ],
  };
}

export async function getVisitorsAnalyticsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112, 123, 212, 270,
    190, 310, 115, 90, 380, 112, 223, 292, 170, 290, 110, 115, 290, 380, 312,
  ].map((value, index) => ({ x: index + 1 + "", y: value }));
}

export async function getCostsPerInteractionData() {
  return {
    avg_cost: 560.93,
    growth: 2.5,
    chart: [
      {
        name: "Google Ads",
        data: [
          { x: "Sep", y: 15 },
          { x: "Oct", y: 12 },
          { x: "Nov", y: 61 },
          { x: "Dec", y: 118 },
          { x: "Jan", y: 78 },
          { x: "Feb", y: 125 },
          { x: "Mar", y: 165 },
          { x: "Apr", y: 61 },
          { x: "May", y: 183 },
          { x: "Jun", y: 238 },
          { x: "Jul", y: 237 },
          { x: "Aug", y: 235 },
        ],
      },
      {
        name: "Facebook Ads",
        data: [
          { x: "Sep", y: 75 },
          { x: "Oct", y: 77 },
          { x: "Nov", y: 151 },
          { x: "Dec", y: 72 },
          { x: "Jan", y: 7 },
          { x: "Feb", y: 58 },
          { x: "Mar", y: 60 },
          { x: "Apr", y: 185 },
          { x: "May", y: 239 },
          { x: "Jun", y: 135 },
          { x: "Jul", y: 119 },
          { x: "Aug", y: 124 },
        ],
      },
    ],
  };
}