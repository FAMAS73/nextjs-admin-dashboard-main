/**
 * ACC Server Configuration Types
 * Based on SRS.md Appendix A - Detailed Configuration File Specification
 */

// =============================================================================
// A.1 configuration.json - Core network identity of the server
// =============================================================================
export interface AccConfiguration {
  /** The TCP port for initial client connections */
  tcpPort: number;
  /** The UDP port for streaming gameplay data */
  udpPort: number;
  /** 1 for Public, 0 for Private (LAN/VPN) */
  registerToLobby: 0 | 1;
  /** Total number of connections (drivers + spectators) */
  maxConnections: number;
  /** Configuration version */
  configVersion?: number;
  /** LAN discovery enabled */
  lanDiscovery?: 0 | 1;
}

// =============================================================================
// A.2 settings.json - Server rules, name, and passwords
// =============================================================================
export interface AccSettings {
  /** The name displayed in the server list */
  serverName: string;
  /** Password for in-game admin commands */
  adminPassword: string;
  /** Password for players to join the server */
  password: string;
  /** Separate password for spectators */
  spectatorPassword: string;
  /** Restricts car class: FreeForAll, GT3, GT4, GTC, TCX, etc. */
  carGroup: "FreeForAll" | "GT3" | "GT4" | "GTC" | "TCX" | "GT2" | "ST15" | "ST21" | "CHL";
  /** Minimum track medals required to join. -1 to disable */
  trackMedalsRequirement: number;
  /** Minimum Safety Rating (SA) to join. -1 to disable */
  safetyRatingRequirement: number;
  /** Minimum Racecraft Rating (RC) to join. -1 to disable */
  racecraftRatingRequirement: number;
  /** Max number of cars on the grid */
  maxCarSlots: number;
  /** If 1, players cannot join during a Race session */
  isRaceLocked: 0 | 1;
  /** If 1, saves session results to a results folder */
  dumpLeaderboards: 0 | 1;
  /** If 1, picks a random track when server is empty */
  randomizeTrackWhenEmpty: 0 | 1;
  /** If 1, server will auto-disqualify for rule breaks */
  allowAutoDQ: 0 | 1;
  /** If 1, uses the shorter single-file formation lap */
  shortFormationLap: 0 | 1;
  /** 3=Default, 1=Free/Manual, 0=Old Limiter */
  formationLapType?: 0 | 1 | 3;
  /** Number of spectator slots */
  spectatorSlots?: number;
  /** Central entry list path */
  centralEntryListPath?: string;
  /** If 1, dumps entry list */
  dumpEntryList?: 0 | 1;
  /** If 1, server is open to public */
  isOpen?: 0 | 1;
  /** Maximum ballast in kg */
  maximumBallastKg?: number;
  /** Restrictor percentage */
  restrictorPercentage?: number;
}

// =============================================================================
// A.3 event.json - Race weekend, track, sessions, and weather
// =============================================================================
export type TrackKey = 
  | "monza" | "zolder" | "brands_hatch" | "silverstone" | "paul_ricard"
  | "misano" | "spa" | "nurburgring" | "barcelona" | "hungaroring"
  | "zandvoort" | "kyalami" | "mount_panorama" | "suzuka" | "laguna_seca"
  | "imola" | "oulton_park" | "donington" | "snetterton" | "cota"
  | "indianapolis" | "watkins_glen" | "valencia" | "nurburgring_24h";

export type SessionType = "P" | "Q" | "R"; // Practice, Qualifying, Race

export interface AccSession {
  /** In-game start time for a session (0-23) */
  hourOfDay: number;
  /** 1=Fri, 2=Sat, 3=Sun. Affects track grip */
  dayOfWeekend: 1 | 2 | 3;
  /** How fast in-game time progresses. 1=Real-time */
  timeMultiplier: number;
  /** P, Q, or R */
  sessionType: SessionType;
  /** Length of the session in minutes */
  sessionDurationMinutes: number;
}

export interface AccEvent {
  /** The track key (e.g., spa, monza) */
  track: TrackKey;
  /** Countdown time on the grid before a race */
  preRaceWaitingTimeSeconds: number;
  /** "Overtime" for players to finish their last lap */
  sessionOverTimeSeconds: number;
  /** Air temperature in Celsius */
  ambientTemp: number;
  /** 0.0=Clear, 1.0=Overcast */
  cloudLevel: number;
  /** 0.0=Dry, 1.0=Heavy Rain */
  rain: number;
  /** 0=Static, 1-4=Realistic, 5-7=Chaotic */
  weatherRandomness: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** A list defining each session (P, Q, R) */
  sessions: AccSession[];
  /** Event type */
  eventType?: string;
  /** Configuration version */
  configVersion?: number;
}

// =============================================================================
// A.4 eventRules.json - Advanced rules for pitstops and stints
// =============================================================================
export interface AccEventRules {
  /** 1=Fastest Lap, 2=Reversed, 3=Random */
  qualifyStandingType: 1 | 2 | 3;
  /** Defines a mandatory pit window duration. -1 to disable */
  pitWindowLengthSec: number;
  /** Max time a driver can be on track before pitting. -1 to disable */
  driverStintTimeSec: number;
  /** Number of mandatory pitstops required in a race */
  mandatoryPitstopCount: number;
  /** Maximum total driving time per driver (-1 = no limit) */
  maxTotalDrivingTime: number;
  /** Maximum number of drivers allowed in one car entry */
  maxDriversCount: number;
  /** true allows refuelling in race pitstops */
  isRefuellingAllowedInRace: boolean;
  /** If true, refueling time is fixed rather than realistic */
  isRefuellingTimeFixed: boolean;
  /** If true, at least one refuel is mandatory */
  isRefuellingRequiredInRace: boolean;
  /** If true, refueling is required during mandatory pitstops */
  isMandatoryPitstopRefuelRequired: boolean;
  /** true forces tyre changes during mandatory stops */
  isMandatoryPitstopTyreChangeRequired: boolean;
  /** true forces driver swaps during mandatory stops */
  isMandatoryPitstopSwapDriverRequired: boolean;
  /** Number of tire sets each driver gets for the event */
  tyreSetCount: number;
}

// =============================================================================
// A.5 assistRules.json - Forces specific driving assists
// =============================================================================
export interface AccAssistRules {
  /** Sets the maximum % of Stability Control allowed (0-100) */
  stabilityControlLevelMax: number;
  /** Sets the minimum % of Stability Control allowed (0-100) */
  stabilityControlLevelMin?: number;
  /** If 1, disables steering aid for gamepads */
  disableAutosteer: 0 | 1 | 2;
  /** If 1, forces auto-lights off */
  disableAutoLights: 0 | 1 | 2;
  /** If 1, forces auto-wipers off */
  disableAutoWiper: 0 | 1 | 2;
  /** If 1, forces auto-engine start off */
  disableAutoEngineStart: 0 | 1 | 2;
  /** If 1, forces auto-pit limiter off */
  disableAutoPitLimiter: 0 | 1 | 2;
  /** If 1, forces auto-gears off */
  disableAutoGear: 0 | 1 | 2;
  /** If 1, forces auto-clutch off */
  disableAutoClutch: 0 | 1 | 2;
  /** If 1, forces the ideal racing line off */
  disableIdealLine: 0 | 1 | 2;
}

// =============================================================================
// A.6 entrylist.json - Driver management and car assignments
// =============================================================================
export interface AccDriver {
  /** The driver's Steam64 ID (prefixed with "S") */
  playerID?: string;
  /** The driver's player ID */
  playerId?: string;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Short name (3-letter abbreviation) */
  shortName: string;
  /** Nationality code */
  nationality?: number;
  /** Driver category: 0=Bronze, 1=Silver, 2=Gold, 3=Platinum */
  driverCategory?: 0 | 1 | 2 | 3;
}

export interface AccCarEntry {
  /** List of drivers in a car entry (for driver swaps) */
  drivers: AccDriver[];
  /** The car's race number */
  raceNumber: number;
  /** Forces the driver to use a specific car model ID */
  forcedCarModel: number;
  /** If 1, uses the names from this file, not the player's */
  overrideDriverInfo: 0 | 1;
  /** Custom car livery/skin */
  customCar: string;
  /** Adds ballast weight (in kg) to this specific car (0-100) */
  ballastKg: number;
  /** Adds engine restrictor (%) to this specific car (0-20) */
  restrictor: number;
  /** Override driver info */
  overrideCarModelForCustomCar: number;
  /** If 1, this driver has server admin privileges */
  isServerAdmin?: 0 | 1;
  /** Default grid position (-1 for automatic) */
  defaultGridPosition?: number;
}

export interface AccEntryList {
  /** If 1, only players in this list can join the server */
  forceEntryList: 0 | 1;
  /** A list defining each car entry on the server */
  entries: AccCarEntry[];
  /** Configuration version */
  configVersion?: number;
}

// Alias for backward compatibility with existing forms
export type EntryListEntry = AccCarEntry;

// =============================================================================
// Car Model IDs mapping (from SRS.md)
// =============================================================================
export const CAR_MODELS = {
  // GT3
  PORSCHE_991_GT3_R: 0,
  MERCEDES_AMG_GT3: 1,
  FERRARI_488_GT3: 2,
  AUDI_R8_LMS: 3,
  LAMBORGHINI_HURACAN_GT3: 4,
  MCLAREN_650S_GT3: 5,
  NISSAN_GTR_NISMO_GT3_2018: 6,
  BMW_M6_GT3: 7,
  BENTLEY_CONTINENTAL_GT3_2018: 8,
  LEXUS_RC_F_GT3: 15,
  LAMBORGHINI_HURACAN_EVO_2019: 16,
  HONDA_NSX_GT3: 17,
  AUDI_R8_LMS_EVO_2019: 19,
  AMR_V8_VANTAGE_2019: 20,
  HONDA_NSX_EVO_2019: 21,
  MCLAREN_720S_GT3_2019: 22,
  PORSCHE_911_II_GT3_R_2019: 23,
  FERRARI_488_GT3_EVO_2020: 24,
  MERCEDES_AMG_GT3_2020: 25,
  BMW_M4_GT3: 30,
  AUDI_R8_LMS_GT3_EVO_II: 31,
  FERRARI_296_GT3: 32,
  LAMBORGHINI_HURACAN_EVO2: 33,
  PORSCHE_992_GT3_R: 34,
  MCLAREN_720S_GT3_EVO_2023: 35,
  FORD_MUSTANG_GT3: 36,

  // GT4
  ALPINE_A110_GT4: 50,
  AMR_V8_VANTAGE_GT4: 51,
  AUDI_R8_LMS_GT4: 52,
  BMW_M4_GT4: 53,
  CHEVROLET_CAMARO_GT4: 55,
  GINETTA_G55_GT4: 56,
  KTM_X_BOW_GT4: 57,
  MASERATI_MC_GT4: 58,
  MCLAREN_570S_GT4: 59,
  MERCEDES_AMG_GT4: 60,
  PORSCHE_718_CAYMAN_GT4: 61,

  // GT2
  AUDI_R8_LMS_GT2: 80,
  KTM_XBOW_GT2: 82,
  MASERATI_MC20_GT2: 83,
  MERCEDES_AMG_GT2: 84,
  PORSCHE_911_GT2_RS_CS_EVO: 85,
  PORSCHE_935: 86,

  // GTC & TCX
  PORSCHE_991_II_GT3_CUP: 9,
  LAMBORGHINI_HURACAN_SUPERTROFEO: 18,
  FERRARI_488_CHALLENGE_EVO: 26,
  BMW_M2_CS_RACING_TCX: 27,
  PORSCHE_911_GT3_CUP_992: 28,
  LAMBORGHINI_HURACAN_SUPER_TROFEO_EVO2: 29,
} as const;

export type CarModelId = typeof CAR_MODELS[keyof typeof CAR_MODELS];

// =============================================================================
// Complete server configuration bundle
// =============================================================================
export interface AccServerConfig {
  configuration: AccConfiguration;
  settings: AccSettings;
  event: AccEvent;
  eventRules: AccEventRules;
  assistRules: AccAssistRules;
  entrylist: AccEntryList;
}

// =============================================================================
// Configuration preset for saving/loading
// =============================================================================
export interface AccConfigPreset {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  config: AccServerConfig;
  userId: string; // Steam ID of the creator
  isPublic: boolean;
  tags: string[];
}

// =============================================================================
// Server status and monitoring types
// =============================================================================
export interface ServerStatus {
  isOnline: boolean;
  uptime: number;
  currentSession?: {
    type: SessionType;
    track: TrackKey;
    timeRemaining: number;
    sessionStartTime: Date;
  };
  connectedDrivers: number;
  maxDrivers: number;
  spectators: number;
}

export interface ConnectedDriver {
  steamId: string;
  displayName: string;
  carNumber: number;
  carModel: CarModelId;
  position: number;
  bestLapTime?: number;
  lastLapTime?: number;
  gaps?: {
    toLeader: number;
    toNext: number;
  };
}

export interface LiveTimingData {
  sessionInfo: {
    type: SessionType;
    track: TrackKey;
    timeRemaining: number;
    isActive: boolean;
  };
  drivers: ConnectedDriver[];
  lastUpdated: Date;
}