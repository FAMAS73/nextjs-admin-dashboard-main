"use client";

interface Driver {
  id: string;
  position: number;
  carNumber: number;
  driverName: string;
  carModel: string;
  currentLapTime?: string;
  bestLapTime?: string;
  lastLapTime?: string;
  gap: string;
  sector1: string;
  sector2: string;
  sector3: string;
  currentSector: number;
  laps: number;
  isInPit: boolean;
  connectionStatus: "Connected" | "Disconnected" | "Spectating";
}

interface TimingTableProps {
  drivers: Driver[];
}

export function TimingTable({ drivers }: TimingTableProps) {
  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case "Connected": return "bg-green/10 text-green";
      case "Disconnected": return "bg-red/10 text-red";
      case "Spectating": return "bg-yellow-dark/10 text-yellow-dark";
      default: return "bg-gray/10 text-gray";
    }
  };

  const getSectorColor = (sectorNum: number, currentSector: number, isInPit: boolean) => {
    if (isInPit) return "text-dark-4 dark:text-dark-7";
    if (sectorNum === currentSector) return "text-primary font-semibold";
    if (sectorNum < currentSector) return "text-green";
    return "text-dark-4 dark:text-dark-7";
  };

  const getPositionChange = (position: number) => {
    // Mock position change data - in real implementation this would track position changes
    const changes = [0, +1, -1, +2, 0]; // Position changes for first 5 drivers
    const change = changes[position - 1] || 0;
    
    if (change > 0) return { icon: "↗", color: "text-green", text: `+${change}` };
    if (change < 0) return { icon: "↘", color: "text-red", text: `${change}` };
    return { icon: "→", color: "text-dark-4 dark:text-dark-7", text: "=" };
  };

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <div className="border-b border-stroke p-6 dark:border-stroke-dark">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Live Timing ({drivers.length} Drivers)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-stroke bg-gray-1 dark:border-stroke-dark dark:bg-dark-2">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Pos
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Driver
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Car
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Current
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Best
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Last
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Gap
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                S1
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                S2
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                S3
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Laps
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-7">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-stroke-dark">
            {drivers.map((driver) => {
              const positionChange = getPositionChange(driver.position);
              return (
                <tr 
                  key={driver.id}
                  className={`transition-colors hover:bg-gray-1 dark:hover:bg-dark-2 ${
                    driver.isInPit ? 'bg-yellow-dark/5 dark:bg-yellow-dark/10' : ''
                  }`}
                >
                  {/* Position */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-dark dark:text-white">
                        {driver.position}
                      </span>
                      <div className={`flex items-center text-xs ${positionChange.color}`}>
                        <span>{positionChange.icon}</span>
                      </div>
                    </div>
                  </td>

                  {/* Driver */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
                        driver.position === 1 ? 'bg-yellow-dark' :
                        driver.position === 2 ? 'bg-gray-400' :
                        driver.position === 3 ? 'bg-orange-400' :
                        'bg-primary'
                      }`}>
                        {driver.carNumber}
                      </div>
                      <div>
                        <div className="font-medium text-dark dark:text-white">
                          {driver.driverName}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Car */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-dark-5 dark:text-dark-6">
                      {driver.carModel}
                    </span>
                  </td>

                  {/* Current Lap */}
                  <td className="px-4 py-3">
                    <span className={`font-mono text-sm ${
                      driver.currentLapTime 
                        ? 'font-semibold text-primary' 
                        : 'text-dark-4 dark:text-dark-7'
                    }`}>
                      {driver.currentLapTime || (driver.isInPit ? 'PIT' : '--:---.---')}
                    </span>
                  </td>

                  {/* Best Lap */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-semibold text-dark dark:text-white">
                      {driver.bestLapTime || '--:---.---'}
                    </span>
                  </td>

                  {/* Last Lap */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-dark-5 dark:text-dark-6">
                      {driver.lastLapTime || '--:---.---'}
                    </span>
                  </td>

                  {/* Gap */}
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${
                      driver.gap === 'Leader' 
                        ? 'text-green' 
                        : 'text-dark dark:text-white'
                    }`}>
                      {driver.gap}
                    </span>
                  </td>

                  {/* Sector 1 */}
                  <td className="px-4 py-3">
                    <span className={`font-mono text-sm ${getSectorColor(1, driver.currentSector, driver.isInPit)}`}>
                      {driver.sector1}
                    </span>
                  </td>

                  {/* Sector 2 */}
                  <td className="px-4 py-3">
                    <span className={`font-mono text-sm ${getSectorColor(2, driver.currentSector, driver.isInPit)}`}>
                      {driver.sector2}
                    </span>
                  </td>

                  {/* Sector 3 */}
                  <td className="px-4 py-3">
                    <span className={`font-mono text-sm ${getSectorColor(3, driver.currentSector, driver.isInPit)}`}>
                      {driver.sector3}
                    </span>
                  </td>

                  {/* Laps */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {driver.laps}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getConnectionStatusColor(driver.connectionStatus)}`}>
                        {driver.connectionStatus}
                      </span>
                      {driver.isInPit && (
                        <span className="inline-flex rounded-full bg-orange-light/10 px-2 py-1 text-xs font-medium text-orange-light">
                          PIT
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="border-t border-stroke p-4 dark:border-stroke-dark">
        <div className="flex items-center justify-between text-sm text-dark-5 dark:text-dark-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green"></div>
              <span>Current sector</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Live timing</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-orange-light"></div>
              <span>In pit</span>
            </div>
          </div>
          <div>
            Auto-refresh: <span className="font-medium text-green">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}