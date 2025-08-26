import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "SERVER MANAGEMENT",
    items: [
      {
        title: "Server Dashboard",
        icon: Icons.ServerIcon,
        items: [
          {
            title: "Overview",
            url: "/",
          },
        ],
      },
      {
        title: "Server Configuration",
        icon: Icons.ConfigIcon,
        items: [
          {
            title: "Network Settings",
            url: "/server-config/network",
          },
          {
            title: "Server Rules",
            url: "/server-config/rules",
          },
          {
            title: "Event & Weather",
            url: "/server-config/event",
          },
          {
            title: "Race Rules",
            url: "/server-config/race-rules",
          },
          {
            title: "Driving Assists",
            url: "/server-config/assists",
          },
          {
            title: "Entry List",
            url: "/server-config/entry-list",
          },
        ],
      },
      {
        title: "Server Control",
        url: "/server-control",
        icon: Icons.ControlIcon,
        items: [],
      },
      {
        title: "Live Timing",
        url: "/live-timing",
        icon: Icons.TimingIcon,
        items: [],
      },
    ],
  },
  {
    label: "RACING COMMUNITY",
    items: [
      {
        title: "Race Schedule",
        url: "/race-schedule",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Race Results",
        icon: Icons.RaceFlag,
        items: [
          {
            title: "Recent Results",
            url: "/race-results",
          },
          {
            title: "Media Gallery",
            url: "/race-results/media",
          },
        ],
      },
      {
        title: "Leaderboard",
        url: "/leaderboard",
        icon: Icons.TrophyIcon,
        items: [],
      },
      {
        title: "Driver Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Admin Panel",
        icon: Icons.AdminIcon,
        items: [
          {
            title: "User Management",
            url: "/admin/users",
          },
          {
            title: "System Logs",
            url: "/admin/logs",
          },
          {
            title: "Settings",
            url: "/admin/settings",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];
