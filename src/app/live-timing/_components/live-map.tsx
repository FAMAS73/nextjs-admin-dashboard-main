"use client";

interface Driver {
  id: string;
  position: number;
  carNumber: number;
  driverName: string;
  carModel: string;
  isInPit: boolean;
  connectionStatus: "Connected" | "Disconnected" | "Spectating";
}

interface TrackPosition {
  driverId: string;
  position: { x: number; y: number };
  sector: number;
  speed: number;
}

interface LiveMapProps {
  drivers: Driver[];
  trackPositions: TrackPosition[];
  track: string;
}

export function LiveMap({ drivers, trackPositions, track }: LiveMapProps) {
  const getTrackLayout = (trackKey: string) => {
    const trackLayouts: Record<string, { path: string; sectors: Array<{x: number, y: number, label: string}> }> = {
      "spa-francorchamps": {
        path: "M50 150 C70 120, 100 100, 130 80 C160 60, 190 50, 220 60 C240 70, 250 90, 240 110 C230 130, 200 140, 180 150 C160 160, 140 170, 120 160 C100 150, 80 140, 70 160 C60 180, 70 200, 50 150",
        sectors: [
          { x: 130, y: 80, label: "S1" },
          { x: 240, y: 110, label: "S2" }
        ]
      },
      monza: {
        path: "M50 100 L200 100 C220 100, 230 110, 230 130 L230 170 C230 190, 220 200, 200 200 L70 200 C50 200, 40 190, 40 170 L40 130 C40 110, 50 100, 50 100",
        sectors: [
          { x: 125, y: 100, label: "S1" },
          { x: 230, y: 150, label: "S2" }
        ]
      }
    };
    
    const trackLower = track.toLowerCase().replace(/[\s-]/g, "-");
    return trackLayouts[trackLower] || trackLayouts["spa-francorchamps"];
  };

  const trackLayout = getTrackLayout(track);

  const getDriverInfo = (driverId: string) => {
    return drivers.find(d => d.id === driverId);
  };

  const getSpeedColor = (speed: number) => {
    if (speed === 0) return "bg-gray-400"; // Stopped/Pit
    if (speed < 100) return "bg-red-400"; // Very slow
    if (speed < 200) return "bg-yellow-400"; // Medium
    if (speed < 280) return "bg-green-400"; // Fast
    return "bg-blue-400"; // Very fast
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return "bg-yellow-dark border-yellow-dark";
    if (position === 2) return "bg-gray-400 border-gray-400";
    if (position === 3) return "bg-orange-400 border-orange-400";
    if (position <= 5) return "bg-green border-green";
    if (position <= 10) return "bg-blue border-blue";
    return "bg-primary border-primary";
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Live Map */}
      <div className="lg:col-span-3">
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Live Track Map - {track}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-dark-5 dark:text-dark-6">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green"></div>
              <span>Live positions</span>
            </div>
          </div>

          <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-gray-1 dark:bg-dark-2">
            {/* Track Layout */}
            <svg 
              className="absolute inset-0 h-full w-full text-dark-3 dark:text-dark-6" 
              fill="none" 
              viewBox="0 0 300 200"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Track outline */}
              <path 
                d={trackLayout.path}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                opacity="0.6"
              />
              
              {/* Start/Finish line */}
              <line x1="50" y1="140" x2="50" y2="160" stroke="currentColor" strokeWidth="6" />
              <text x="30" y="155" className="fill-current text-xs font-semibold">S/F</text>
              
              {/* Sector markers */}
              {trackLayout.sectors.map((sector, index) => (
                <g key={index}>
                  <circle cx={sector.x} cy={sector.y} r="4" fill="yellow" opacity="0.8" />
                  <text x={sector.x - 8} y={sector.y - 8} className="fill-current text-xs font-semibold">{sector.label}</text>
                </g>
              ))}

              {/* Pit Lane */}
              <path 
                d="M40 140 L60 140 L60 170 L40 170 Z" 
                fill="currentColor" 
                opacity="0.2"
              />
              <text x="42" y="158" className="fill-current text-xs">PIT</text>
            </svg>

            {/* Driver Positions */}
            {trackPositions.map((trackPos) => {
              const driver = getDriverInfo(trackPos.driverId);
              if (!driver) return null;

              return (
                <div
                  key={trackPos.driverId}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
                  style={{ 
                    left: `${trackPos.position.x}%`, 
                    top: `${trackPos.position.y}%` 
                  }}
                >
                  <div className="group relative flex flex-col items-center">
                    {/* Car dot */}
                    <div 
                      className={`h-4 w-4 rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-150 ${getPositionColor(driver.position)}`}
                    >
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                        {driver.position}
                      </div>
                    </div>

                    {/* Speed indicator */}
                    <div className={`mt-1 h-1 w-6 rounded-full opacity-75 ${getSpeedColor(trackPos.speed)}`}></div>

                    {/* Tooltip */}
                    <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 transform rounded bg-black/90 px-2 py-1 text-xs text-white group-hover:block">
                      <div className="whitespace-nowrap">
                        <div className="font-semibold">#{driver.carNumber} {driver.driverName}</div>
                        <div>P{driver.position} • {trackPos.speed} km/h</div>
                        <div>Sector {trackPos.sector}</div>
                        {driver.isInPit && <div className="text-orange-300">In Pit Lane</div>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs lg:grid-cols-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-yellow-dark"></div>
              <span className="text-dark-5 dark:text-dark-6">P1 (Leader)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
              <span className="text-dark-5 dark:text-dark-6">P2 (2nd)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-orange-400"></div>
              <span className="text-dark-5 dark:text-dark-6">P3 (3rd)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span className="text-dark-5 dark:text-dark-6">Others</span>
            </div>
          </div>
        </div>
      </div>

      {/* Position List & Stats */}
      <div className="space-y-6">
        {/* Quick Position List */}
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <h4 className="mb-3 text-sm font-semibold text-dark dark:text-white">Live Positions</h4>
          <div className="space-y-2">
            {drivers.slice(0, 10).map((driver) => {
              const trackPos = trackPositions.find(p => p.driverId === driver.id);
              return (
                <div key={driver.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`h-6 w-6 rounded-full text-xs font-bold text-white flex items-center justify-center ${getPositionColor(driver.position)}`}>
                      {driver.position}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-dark dark:text-white">{driver.driverName}</div>
                      <div className="text-xs text-dark-5 dark:text-dark-6">#{driver.carNumber}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-dark dark:text-white">
                      {trackPos?.speed || 0} km/h
                    </div>
                    <div className="text-xs text-dark-5 dark:text-dark-6">
                      S{trackPos?.sector || 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Speed Stats */}
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <h4 className="mb-3 text-sm font-semibold text-dark dark:text-white">Speed Analysis</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-dark-5 dark:text-dark-6">Fastest on track:</span>
              <span className="font-medium text-dark dark:text-white">
                {Math.max(...trackPositions.map(p => p.speed))} km/h
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-dark-5 dark:text-dark-6">Average speed:</span>
              <span className="font-medium text-dark dark:text-white">
                {Math.round(trackPositions.reduce((acc, p) => acc + p.speed, 0) / trackPositions.length)} km/h
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-dark-5 dark:text-dark-6">Cars in pit:</span>
              <span className="font-medium text-dark dark:text-white">
                {drivers.filter(d => d.isInPit).length}
              </span>
            </div>
          </div>

          {/* Speed Legend */}
          <div className="mt-4 space-y-1">
            <div className="text-xs font-medium text-dark dark:text-white">Speed Colors:</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                <span className="text-dark-5 dark:text-dark-6">&lt;100</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                <span className="text-dark-5 dark:text-dark-6">100-200</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-dark-5 dark:text-dark-6">200-280</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-dark-5 dark:text-dark-6">&gt;280</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}