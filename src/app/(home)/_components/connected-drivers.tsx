"use client";

import { useState, useEffect } from "react";
import { ConnectedDriver } from "@/types/acc-config";

interface RealConnectedDriver {
  id: string;
  driverName: string;
  carNumber: number;
  carModel: string;
  position: number;
  bestLapTime?: string;
  lastLapTime?: string;
  gap?: string;
}

function formatLapTime(lapTimeString?: string): string {
  if (!lapTimeString || lapTimeString === '--:---.---') return "--:--";
  return lapTimeString;
}

function getCarName(carModel: string): string {
  // Handle both numeric and string car models
  if (typeof carModel === 'string' && carModel !== 'Unknown Car') {
    return carModel;
  }
  
  const carModelId = parseInt(carModel as string) || 0;
  const carNames: Record<number, string> = {
    0: "Porsche 991 GT3 R",
    1: "Mercedes-AMG GT3",
    2: "Ferrari 488 GT3", 
    3: "Audi R8 LMS",
    7: "BMW M6 GT3",
    9: "Lamborghini Gallardo",
    20: "McLaren 650S GT3",
    // Add more as needed
  };
  return carNames[carModelId] || carModel || `Car Model ${carModelId}`;
}

export function ConnectedDriversList() {
  const [drivers, setDrivers] = useState<RealConnectedDriver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConnectedDrivers = async () => {
      try {
        const response = await fetch('/api/live-data?type=drivers');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Transform API data to component format
          const transformedDrivers: RealConnectedDriver[] = result.data.map((driver: any, index: number) => ({
            id: driver.id || `driver_${index}`,
            driverName: driver.driverName || `${driver.firstName || 'Driver'} ${driver.lastName || index + 1}`,
            carNumber: driver.carNumber || index + 1,
            carModel: driver.carModel || 'Unknown Car',
            position: driver.position || index + 1,
            bestLapTime: driver.bestLapTime,
            lastLapTime: driver.lastLapTime,
            gap: driver.gap
          }));
          
          setDrivers(transformedDrivers.slice(0, 8)); // Show top 8 drivers
        } else {
          setDrivers([]);
        }
      } catch (error) {
        console.error('Failed to fetch connected drivers:', error);
        setDrivers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnectedDrivers();
    
    // Update every 3 seconds
    const interval = setInterval(fetchConnectedDrivers, 3000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Connected Drivers
          </h3>
          <a
            href="/live-timing"
            className="text-sm text-primary hover:text-primary/80"
          >
            View Live Timing →
          </a>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3 rounded-lg border border-stroke p-3 dark:border-stroke-dark">
                <div className="h-8 w-8 rounded-full bg-gray-3 dark:bg-dark-4"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 rounded bg-gray-3 dark:bg-dark-4"></div>
                  <div className="mt-1 h-3 w-24 rounded bg-gray-3 dark:bg-dark-4"></div>
                </div>
                <div className="h-4 w-16 rounded bg-gray-3 dark:bg-dark-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Connected Drivers ({drivers.length})
        </h3>
        <a
          href="/live-timing"
          className="text-sm text-primary hover:text-primary/80"
        >
          View Live Timing →
        </a>
      </div>

      <div className="space-y-3">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="flex items-center justify-between rounded-lg border border-stroke p-3 dark:border-stroke-dark"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {driver.position}
              </div>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  #{driver.carNumber} {driver.driverName}
                </p>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  {getCarName(driver.carModel)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-mono text-dark dark:text-white">
                {formatLapTime(driver.bestLapTime)}
              </p>
              {driver.gap && driver.gap !== 'Leader' && (
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  {driver.gap}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {drivers.length === 0 && (
        <div className="py-8 text-center">
          <svg className="mx-auto h-12 w-12 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            No drivers currently connected
          </p>
          <p className="mt-1 text-xs text-dark-4 dark:text-dark-7">
            Start an ACC session to see connected drivers
          </p>
        </div>
      )}
    </div>
  );
}