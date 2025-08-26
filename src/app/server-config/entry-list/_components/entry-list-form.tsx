"use client";

import { useState } from "react";
import { AccEntryList, EntryListEntry, CAR_MODELS } from "@/types/acc-config";

// Car data with human-readable names
const CAR_DATA = [
  // GT3 Cars
  { id: 0, brand: "Porsche", model: "991 GT3 R", category: "GT3" },
  { id: 1, brand: "Mercedes-AMG", model: "GT3", category: "GT3" },
  { id: 2, brand: "Ferrari", model: "488 GT3", category: "GT3" },
  { id: 3, brand: "Audi", model: "R8 LMS", category: "GT3" },
  { id: 4, brand: "Lamborghini", model: "Huracán GT3", category: "GT3" },
  { id: 5, brand: "McLaren", model: "650S GT3", category: "GT3" },
  { id: 6, brand: "Nissan", model: "GT-R Nismo GT3", category: "GT3" },
  { id: 7, brand: "BMW", model: "M6 GT3", category: "GT3" },
  { id: 8, brand: "Bentley", model: "Continental GT3", category: "GT3" },
  { id: 15, brand: "Lexus", model: "RC F GT3", category: "GT3" },
  { id: 16, brand: "Lamborghini", model: "Huracán Evo", category: "GT3" },
  { id: 17, brand: "Honda", model: "NSX GT3", category: "GT3" },
  { id: 19, brand: "Audi", model: "R8 LMS Evo", category: "GT3" },
  { id: 20, brand: "Aston Martin", model: "V8 Vantage", category: "GT3" },
  { id: 21, brand: "Honda", model: "NSX Evo", category: "GT3" },
  { id: 22, brand: "McLaren", model: "720S GT3", category: "GT3" },
  { id: 23, brand: "Porsche", model: "991.2 GT3 R", category: "GT3" },
  { id: 24, brand: "Ferrari", model: "488 GT3 Evo", category: "GT3" },
  { id: 25, brand: "Mercedes-AMG", model: "GT3 2020", category: "GT3" },
  { id: 30, brand: "BMW", model: "M4 GT3", category: "GT3" },
  { id: 31, brand: "Audi", model: "R8 LMS Evo II", category: "GT3" },
  { id: 32, brand: "Ferrari", model: "296 GT3", category: "GT3" },
  { id: 33, brand: "Lamborghini", model: "Huracán Evo2", category: "GT3" },
  { id: 34, brand: "Porsche", model: "992 GT3 R", category: "GT3" },
  { id: 35, brand: "McLaren", model: "720S GT3 Evo", category: "GT3" },
  { id: 36, brand: "Ford", model: "Mustang GT3", category: "GT3" },
  
  // GT4 Cars
  { id: 50, brand: "Alpine", model: "A110 GT4", category: "GT4" },
  { id: 51, brand: "Aston Martin", model: "V8 Vantage GT4", category: "GT4" },
  { id: 52, brand: "Audi", model: "R8 LMS GT4", category: "GT4" },
  { id: 53, brand: "BMW", model: "M4 GT4", category: "GT4" },
  { id: 55, brand: "Chevrolet", model: "Camaro GT4", category: "GT4" },
  { id: 56, brand: "Ginetta", model: "G55 GT4", category: "GT4" },
  { id: 57, brand: "KTM", model: "X-Bow GT4", category: "GT4" },
  { id: 58, brand: "Maserati", model: "MC GT4", category: "GT4" },
  { id: 59, brand: "McLaren", model: "570S GT4", category: "GT4" },
  { id: 60, brand: "Mercedes-AMG", model: "GT4", category: "GT4" },
  { id: 61, brand: "Porsche", model: "718 Cayman GT4", category: "GT4" },
  
  // GT2 Cars
  { id: 80, brand: "Audi", model: "R8 LMS GT2", category: "GT2" },
  { id: 82, brand: "KTM", model: "X-Bow GT2", category: "GT2" },
  { id: 83, brand: "Maserati", model: "MC20 GT2", category: "GT2" },
  { id: 84, brand: "Mercedes-AMG", model: "GT2", category: "GT2" },
  { id: 85, brand: "Porsche", model: "911 GT2 RS CS Evo", category: "GT2" },
  { id: 86, brand: "Porsche", model: "935", category: "GT2" },
  
  // GTC & TCX
  { id: 9, brand: "Porsche", model: "991.2 GT3 Cup", category: "GTC" },
  { id: 18, brand: "Lamborghini", model: "Huracán Super Trofeo", category: "GTC" },
  { id: 26, brand: "Ferrari", model: "488 Challenge Evo", category: "GTC" },
  { id: 27, brand: "BMW", model: "M2 CS Racing", category: "TCX" },
  { id: 28, brand: "Porsche", model: "911 GT3 Cup 992", category: "GTC" },
  { id: 29, brand: "Lamborghini", model: "Huracán Super Trofeo Evo2", category: "GTC" },
];

const defaultEntry: EntryListEntry = {
  drivers: [
    {
      firstName: "",
      lastName: "",
      shortName: "",
      playerId: ""
    }
  ],
  raceNumber: 1,
  forcedCarModel: -1,
  overrideDriverInfo: 0,
  overrideCarModelForCustomCar: 0,
  isServerAdmin: 0,
  defaultGridPosition: -1,
  ballastKg: 0,
  restrictor: 0,
  customCar: ""
};

const defaultEntryList: AccEntryList = {
  entries: [{ ...defaultEntry }],
  forceEntryList: 0,
  configVersion: 1
};

export function EntryListForm() {
  const [entryList, setEntryList] = useState<AccEntryList>(defaultEntryList);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Entry list saved:", entryList);
    } catch (error) {
      console.error("Failed to save entry list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            setEntryList({ ...defaultEntryList, ...imported });
          } catch (error) {
            console.error("Invalid JSON file:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(entryList, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "entrylist.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const addEntry = () => {
    const nextRaceNumber = Math.max(...entryList.entries.map(e => e.raceNumber), 0) + 1;
    setEntryList({
      ...entryList,
      entries: [
        ...entryList.entries,
        { ...defaultEntry, raceNumber: nextRaceNumber }
      ]
    });
  };

  const removeEntry = (index: number) => {
    setEntryList({
      ...entryList,
      entries: entryList.entries.filter((_, i) => i !== index)
    });
  };

  const updateEntry = (index: number, updates: Partial<EntryListEntry>) => {
    setEntryList({
      ...entryList,
      entries: entryList.entries.map((entry, i) => 
        i === index ? { ...entry, ...updates } : entry
      )
    });
  };

  const addDriverToEntry = (entryIndex: number) => {
    const entry = entryList.entries[entryIndex];
    if (entry.drivers.length < 4) {
      updateEntry(entryIndex, {
        drivers: [
          ...entry.drivers,
          {
            firstName: "",
            lastName: "",
            shortName: "",
            playerId: ""
          }
        ]
      });
    }
  };

  const removeDriverFromEntry = (entryIndex: number, driverIndex: number) => {
    const entry = entryList.entries[entryIndex];
    if (entry.drivers.length > 1) {
      updateEntry(entryIndex, {
        drivers: entry.drivers.filter((_, i) => i !== driverIndex)
      });
    }
  };

  const updateDriver = (entryIndex: number, driverIndex: number, updates: Partial<EntryListEntry['drivers'][0]>) => {
    const entry = entryList.entries[entryIndex];
    updateEntry(entryIndex, {
      drivers: entry.drivers.map((driver, i) => 
        i === driverIndex ? { ...driver, ...updates } : driver
      )
    });
  };

  const getCarName = (carId: number) => {
    const car = CAR_DATA.find(c => c.id === carId);
    return car ? `${car.brand} ${car.model}` : "Any Car";
  };

  const filteredCarModels = CAR_DATA.filter(car =>
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Entry List Settings */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Entry List Settings
        </h3>
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={entryList.forceEntryList === 1}
              onChange={(e) => setEntryList({ ...entryList, forceEntryList: e.target.checked ? 1 : 0 })}
              className="mr-2 text-primary focus:ring-primary"
            />
            <span className="text-sm text-dark dark:text-white">Force Entry List</span>
          </label>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            When enabled, only drivers in this list can join the server
          </p>
        </div>
      </div>

      {/* Add Entry Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Driver Entries ({entryList.entries.length})
        </h3>
        <button
          onClick={addEntry}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Entry
        </button>
      </div>

      {/* Driver Entries */}
      <div className="space-y-4">
        {entryList.entries.map((entry, entryIndex) => (
          <div key={entryIndex} className="rounded-lg border border-stroke bg-white p-6 shadow-card dark:border-stroke-dark dark:bg-gray-dark">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-medium text-dark dark:text-white">
                Entry #{entry.raceNumber}
              </h4>
              <button
                onClick={() => removeEntry(entryIndex)}
                className="text-red hover:text-red-dark"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Entry Details */}
              <div>
                <h5 className="mb-3 font-medium text-dark dark:text-white">Entry Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                      Race Number
                    </label>
                    <input
                      type="number"
                      value={entry.raceNumber}
                      onChange={(e) => updateEntry(entryIndex, { raceNumber: parseInt(e.target.value) || 1 })}
                      min="1"
                      max="999"
                      className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                      Grid Position
                    </label>
                    <input
                      type="number"
                      value={entry.defaultGridPosition === -1 ? "" : entry.defaultGridPosition}
                      onChange={(e) => updateEntry(entryIndex, { defaultGridPosition: e.target.value ? parseInt(e.target.value) : -1 })}
                      min="-1"
                      placeholder="Auto"
                      className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                    Forced Car Model
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search cars..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                    />
                  </div>
                  <select
                    value={entry.forcedCarModel}
                    onChange={(e) => updateEntry(entryIndex, { forcedCarModel: parseInt(e.target.value) })}
                    className="mt-1 w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                  >
                    <option value={-1}>Any Car</option>
                    {filteredCarModels.slice(0, 20).map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.model} ({car.category})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                    Current: {getCarName(entry.forcedCarModel)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                      Ballast (kg)
                    </label>
                    <input
                      type="number"
                      value={entry.ballastKg}
                      onChange={(e) => updateEntry(entryIndex, { ballastKg: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="100"
                      className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-dark dark:text-white">
                      Restrictor (%)
                    </label>
                    <input
                      type="number"
                      value={entry.restrictor}
                      onChange={(e) => updateEntry(entryIndex, { restrictor: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="50"
                      className="w-full rounded border border-stroke bg-white px-2 py-1 text-sm text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={entry.isServerAdmin === 1}
                      onChange={(e) => updateEntry(entryIndex, { isServerAdmin: e.target.checked ? 1 : 0 })}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-dark dark:text-white">Server Administrator</span>
                  </label>
                </div>
              </div>

              {/* Drivers */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h5 className="font-medium text-dark dark:text-white">
                    Drivers ({entry.drivers.length}/4)
                  </h5>
                  {entry.drivers.length < 4 && (
                    <button
                      onClick={() => addDriverToEntry(entryIndex)}
                      className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                    >
                      Add Driver
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {entry.drivers.map((driver, driverIndex) => (
                    <div key={driverIndex} className="rounded border border-stroke bg-gray-1 p-3 dark:border-stroke-dark dark:bg-dark-2">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-dark dark:text-white">
                          Driver {driverIndex + 1}
                        </span>
                        {entry.drivers.length > 1 && (
                          <button
                            onClick={() => removeDriverFromEntry(entryIndex, driverIndex)}
                            className="text-red hover:text-red-dark"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            placeholder="First Name"
                            value={driver.firstName}
                            onChange={(e) => updateDriver(entryIndex, driverIndex, { firstName: e.target.value })}
                            className="w-full rounded border border-stroke bg-white px-2 py-1 text-xs text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={driver.lastName}
                            onChange={(e) => updateDriver(entryIndex, driverIndex, { lastName: e.target.value })}
                            className="w-full rounded border border-stroke bg-white px-2 py-1 text-xs text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            placeholder="Short Name (3 chars)"
                            value={driver.shortName}
                            onChange={(e) => updateDriver(entryIndex, driverIndex, { shortName: e.target.value.slice(0, 3) })}
                            maxLength={3}
                            className="w-full rounded border border-stroke bg-white px-2 py-1 text-xs text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Player ID / Steam ID"
                            value={driver.playerId}
                            onChange={(e) => updateDriver(entryIndex, driverIndex, { playerId: e.target.value })}
                            className="w-full rounded border border-stroke bg-white px-2 py-1 text-xs text-dark focus:border-primary dark:border-stroke-dark dark:bg-dark dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Entry List Summary */}
      <div className="rounded-lg border border-stroke bg-gray-1 p-6 dark:border-stroke-dark dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Entry List Summary
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="text-2xl font-bold text-primary">{entryList.entries.length}</div>
            <div className="text-sm text-dark-5 dark:text-dark-6">Total Entries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green">
              {entryList.entries.reduce((total, entry) => total + entry.drivers.length, 0)}
            </div>
            <div className="text-sm text-dark-5 dark:text-dark-6">Total Drivers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-dark">
              {entryList.entries.filter(e => e.isServerAdmin === 1).length}
            </div>
            <div className="text-sm text-dark-5 dark:text-dark-6">Administrators</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isLoading ? "Saving..." : "Save Entry List"}
        </button>
        <button
          onClick={handleImport}
          className="inline-flex items-center rounded-md border border-stroke px-6 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Import JSON
        </button>
        <button
          onClick={handleExport}
          className="inline-flex items-center rounded-md border border-stroke px-6 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 7l3 3m0 0l3-3m-3 3V4" />
          </svg>
          Export JSON
        </button>
        <button
          onClick={() => {
            // Generate 10 sample entries
            const sampleEntries = Array.from({ length: 10 }, (_, i) => ({
              ...defaultEntry,
              raceNumber: i + 1,
              drivers: [{
                firstName: `Driver`,
                lastName: `${i + 1}`,
                shortName: `D${i + 1}`,
                playerId: `76561198000000${String(i + 1).padStart(3, '0')}`
              }]
            }));
            setEntryList({ ...entryList, entries: sampleEntries });
          }}
          className="inline-flex items-center rounded-md border border-stroke px-6 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-dark"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Generate Sample Data
        </button>
      </div>
    </div>
  );
}