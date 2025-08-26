# Software Requirements Specification (SRS)

## ACC Web Server Manager

**Version 1.2**

---

### 1. Introduction

#### 1.1. Project Overview

This document outlines the requirements for the ACC Web Server Manager, a web-based application designed to simplify the creation, configuration, and management of Assetto Corsa Competizione (ACC) dedicated servers. The application will provide a user-friendly interface to replace manual JSON file editing, offer live server monitoring, and introduce community features such as driver profiles, statistics, and leaderboards.

#### 1.2. Target Audience

The primary users are ACC players, league administrators, and community organizers who wish to host private or public races without the technical overhead of command-line tools and manual file management.

---

### 2. Functional Requirements

#### 2.1. User & Profile Management

* **FR-01: Steam Authentication:** All users must log in to the website using their official Steam account (OAuth). Public pages like the leaderboard will be viewable without a login, but any action requiring user identity (e.g., uploading content, managing a server) will require authentication.
* **FR-02: Driver Profile:** Authenticated users will have a personal driver profile.
* **FR-03: Profile Editing:** Users must be able to edit their profile information, including their display name, short name (3-letter abbreviation), and nationality.
* **FR-04: Steam Account Linking:** The user's Steam ID and name will be automatically linked to their driver profile upon first login.

#### 2.2. Server Configuration

* **FR-05: Graphical Configuration Interface:** The system will provide a user-friendly web interface for managing all server settings. A detailed specification for every parameter across all configuration files can be found in **Appendix A**.
* **FR-06: File Import/Export:** Users must be able to upload their existing five `.json` configuration files (`configuration.json`, `settings.json`, `event.json`, `eventRules.json`, `assistRules.json`) to populate the web interface. They must also be able to download the configuration as a valid set of `.json` files.
* **FR-07: Configuration Presets:** Users can save a complete server configuration as a named "preset" to their account. These presets will be stored in the database.
* **FR-08: Preset Loading:** Users must be able to load a saved preset with a single click, instantly populating all fields in the configuration interface.

#### 2.3. Server Control & Monitoring

* **FR-09: Core Server Control:** The interface must provide buttons to **Start**, **Stop**, and **Restart** the `accServer.exe` process on the host machine.
* **FR-10: Live Server Log:** A section of the dashboard must display a live, auto-scrolling feed of the server's console output.
* **FR-11: Live Timing:** When a session is active, the interface must display a live timing table showing all connected drivers, their current position, car model, best lap, and last lap.
* **FR-12: Access Control (Single Controller):** Only one user can actively control the server at a time. The primary admin can generate a temporary, unique "control key" (a secure string) to delegate server management permissions to another trusted user. This key can be revoked at any time.

#### 2.4. Community & Statistics

* **FR-13: Results & Media Upload:** After a race session is completed, authenticated users who participated in the race can upload related media (screenshots, replay video files) to the session's results page.
* **FR-14: Driver Statistics Page:** Each user will have a dedicated statistics page (`/profile/{steamID}`) showing their personal racing history.
* **FR-15: ELO Ranking System:** The backend will automatically process saved race results (`dumpLeaderboards` must be enabled) to calculate a driver's ELO rating.
* **FR-16: Leaderboard:** A public leaderboard page will display all drivers ranked by their calculated ELO rating.

#### 2.5. Administration

* **FR-17: Admin Dashboard:** A separate, secure administration panel will be available to the primary administrator.
* **FR-18: Log Viewer:** The admin dashboard must provide a way to view and search historical User, Database, and Server logs.
* **FR-19: User Management:** The administrator must be able to view a list of all registered users and manage their roles or permissions.

---

### 3. Non-Functional Requirements

* **NFR-01: UI Framework:** The UI will be built using the **NextAdmin** template and **MUI (Material-UI)**.
* **NFR-02: Responsive Design:** The website must be fully responsive.
* **NFR-03: Internationalization (i18n):** The UI must support language switching between **English (en)** and **Thai (th)**.
* **NFR-04: Real-time Updates:** Live elements/telemetry will update in near real-time using WebSockets.
* **NFR-05: Page Load Speed:** The application will be optimized for fast initial page loads.
* **NFR-06: Hosting:** The web application and ACC server will be hosted on a home PC.
* **NFR-07: Database:** Data will be stored in a cloud-hosted **Supabase** project.
* **NFR-08: Backend Communication:** A backend agent on the host PC will manage the `accServer.exe` process and stream data to the web UI.
* **NFR-09: Authentication:** User identity will be managed via Supabase Auth with Steam.
* **NFR-10: Authorization:** Server control will be managed by the single-controller key system.
* **NFR-11: Codebase:** The codebase will be well-documented and structured.
* **NFR-12: Extensibility:** The system should be designed with the potential to manage multiple server instances.

---

### Appendix A: Detailed Configuration File Specification

This appendix provides a detailed breakdown of every parameter for the JSON files used to configure an ACC server, as documented in the Server Admin Handbook.

#### A.1 `configuration.json`

*Purpose: Defines the core network identity of the server. Rarely changed.*

| Parameter | Type | Description | UI Control |
| :--- | :--- | :--- | :--- |
| `tcpPort` | Integer | The TCP port for initial client connections. | Number Input |
| `udpPort` | Integer | The UDP port for streaming gameplay data. | Number Input |
| `registerToLobby` | Integer (0/1) | `1` for Public, `0` for Private (LAN/VPN). | Switch |
| `maxConnections` | Integer | Total number of connections (drivers + spectators). | Number Input |

#### A.2 `settings.json`

*Purpose: Defines the server's rules, name, and passwords.*

| Parameter | Type | Description | UI Control |
| :--- | :--- | :--- | :--- |
| `serverName` | String | The name displayed in the server list. | Text Input |
| `adminPassword` | String | Password for in-game admin commands. | Password Input |
| `password` | String | Password for players to join the server. | Password Input |
| `spectatorPassword` | String | Separate password for spectators. | Password Input |
| `carGroup` | String | Restricts car class. `FreeForAll`, `GT3`, `GT4`, etc. | Dropdown |
| `trackMedalsRequirement` | Integer (0-3) | Minimum track medals required to join. -1 to disable. | Slider |
| `safetyRatingRequirement` | Integer (0-99) | Minimum Safety Rating (SA) to join. -1 to disable. | Slider |
| `racecraftRatingRequirement` | Integer (0-99) | Minimum Racecraft Rating (RC) to join. -1 to disable. | Slider |
| `maxCarSlots` | Integer | Max number of cars on the grid. | Number Input |
| `isRaceLocked` | Integer (0/1) | If `1`, players cannot join during a Race session. | Switch |
| `dumpLeaderboards` | Integer (0/1) | If `1`, saves session results to a `results` folder. | Switch |
| `randomizeTrackWhenEmpty` | Integer (0/1) | If `1`, picks a random track when server is empty. | Switch |
| `allowAutoDQ` | Integer (0/1) | If `1`, server will auto-disqualify for rule breaks. | Switch |
| `shortFormationLap` | Integer (0/1) | If `1`, uses the shorter single-file formation lap. | Switch |
| `formationLapType` | Integer | `3`=Default, `1`=Free/Manual, `0`=Old Limiter. | Dropdown |

#### A.3 `event.json`

*Purpose: Defines the specific race weekend, including track, sessions, and weather.*

| Parameter | Type | Description | UI Control |
| :--- | :--- | :--- | :--- |
| `track` | String | The track key (e.g., `spa`, `monza`). | Dropdown with images |
| `preRaceWaitingTimeSeconds` | Integer | Countdown time on the grid before a race. | Number Input |
| `sessionOverTimeSeconds` | Integer | "Overtime" for players to finish their last lap. | Number Input |
| `ambientTemp` | Integer | Air temperature in Celsius. | Slider |
| `cloudLevel` | Float (0.0-1.0) | `0.0`=Clear, `1.0`=Overcast. | Slider |
| `rain` | Float (0.0-1.0) | `0.0`=Dry, `1.0`=Heavy Rain. | Slider |
| `weatherRandomness` | Integer (0-7) | `0`=Static, `1-4`=Realistic, `5-7`=Chaotic. | Slider |
| `sessions` | Array of Objects | A list defining each session (P, Q, R). | Session Builder UI |
| `hourOfDay` | Integer (0-23) | In-game start time for a session. | Time Input |
| `dayOfWeekend` | Integer (1-3) | `1`=Fri, `2`=Sat, `3`=Sun. Affects track grip. | Dropdown |
| `timeMultiplier` | Integer | How fast in-game time progresses. `1`=Real-time. | Number Input |
| `sessionType` | String | `P`, `Q`, or `R`. | Dropdown |
| `sessionDurationMinutes` | Integer | Length of the session in minutes. | Number Input |

#### A.4 `eventRules.json`

*Purpose: Defines advanced rules for pitstops and stints. Ignored by public servers.*

| Parameter | Type | Description | UI Control |
| :--- | :--- | :--- | :--- |
| `qualifyStandingType` | Integer | `1`=Fastest Lap, `2`=Average Lap. | Dropdown |
| `pitWindowLengthSec` | Integer | Defines a mandatory pit window duration. -1 to disable. | Number Input |
| `driverStintTimeSec` | Integer | Max time a driver can be on track before pitting. -1 to disable. | Number Input |
| `mandatoryPitstopCount` | Integer | Number of mandatory pitstops required in a race. | Number Input |
| `isRefuellingAllowedInRace` | Boolean | `true` allows refuelling in race pitstops. | Switch |
| `isMandatoryPitstopTyreChangeRequired` | Boolean | `true` forces tyre changes during mandatory stops. | Switch |
| `isMandatoryPitstopSwapDriverRequired` | Boolean | `true` forces driver swaps during mandatory stops. | Switch |

#### A.5 `assistRules.json`

*Purpose: Forces specific driving assists to be on or off for all players. Ignored by public servers.*

| Parameter | Type | Description | UI Control |
| :--- | :--- | :--- | :--- |
| `stabilityControlLevelMax` | Integer (0-100) | Sets the maximum % of Stability Control allowed. | Slider |
| `disableAutosteer` | Integer (0/1) | If `1`, disables steering aid for gamepads. | Switch |
| `disableAutoLights` | Integer (0/1) | If `1`, forces auto-lights off. | Switch |
| `disableAutoWiper` | Integer (0/1) | If `1`, forces auto-wipers off. | Switch |
| `disableAutoEngineStart` | Integer (0/1) | If `1`, forces auto-engine start off. | Switch |
| `disableAutoPitLimiter` | Integer (0/1) | If `1`, forces auto-pit limiter off. | Switch |
| `disableAutoGear` | Integer (0/1) | If `1`, forces auto-gears off. | Switch |
| `disableAutoClutch` | Integer (0/1) | If `1`, forces auto-clutch off. | Switch |
| `disableIdealLine` | Integer (0/1) | If `1`, forces the ideal racing line off. | Switch |

#### A.6 `entrylist.json`

*Purpose: Manages a list of registered drivers, teams, and can be used to enforce specific cars or apply penalties.*

| Parameter | Type | Description | UI Control |
| :--- | :--- | :--- | :--- |
| `forceEntryList` | Integer (0/1) | If `1`, only players in this list can join the server. | Switch |
| `entries` | Array of Objects | A list defining each car entry on the server. | Table/Grid UI |
| `drivers` | Array of Objects | List of drivers in a car entry (for driver swaps). | Modal Form |
| `playerID` | String | The driver's Steam64 ID (prefixed with "S"). | Text Input |
| `raceNumber` | Integer | The car's race number. | Number Input |
| `forcedCarModel` | Integer | Forces the driver to use a specific car model ID. | Dropdown |
| `overrideDriverInfo` | Integer (0/1) | If `1`, uses the names from this file, not the player's. | Switch |
| `ballastKg` | Integer (0-100) | Adds ballast weight (in kg) to this specific car. | Number Input |
| `restrictor` | Integer (0-20) | Adds engine restrictor (%) to this specific car. | Number Input |

### Here are the detailed explanations for the weather parameters and lists of available tracks and cars as referenced in the `ServerAdminHandbook_v8.pdf`.

***

#### Weather Parameters (`event.json`)

These four settings work together to create the entire weather simulation for your race weekend.

* **`ambientTemp`**: This is the baseline **air temperature** in Celsius. It directly affects track temperature and car performance (engine and tires).
  * **Example**: `22` creates a pleasant, optimal condition. `32` would create a hot track, causing tires to overheat more easily.

* **`cloudLevel`**: This controls the amount of **cloud cover** on a scale from `0.0` to `1.0`. It has a large impact on track temperature and the possibility of rain.
  * **`0.0`**: Perfectly clear, sunny sky. The track will be at its hottest.
  * **`0.5`**: Partly cloudy.
  * **`1.0`**: Fully overcast. The track will be cooler, and the chance of rain is much higher.

* **`rain`**: This sets the **baseline intensity of rain** if it does occur, on a scale from `0.0` to `1.0`.
  * **`0.0`**: No rain is possible (unless `weatherRandomness` is very high).
  * **`0.3`**: Light rain.
  * **`0.7`**: Heavy rain.
  * **`1.0`**: Thunderstorm conditions.

* **`weatherRandomness`**: Think of this as a **"chaos" dial** from `0` to `7`. It controls how much the weather can change and deviate from the baseline values you set.
  * **`0`**: **Static**. The weather will never change. If you set it to sunny, it will stay sunny forever.
  * **`1-4`**: **Realistic**. The weather can change gradually and plausibly. A setting of `2` or `3` is good for realistic, dynamic conditions.
  * **`5-7`**: **Chaotic**. The weather can change rapidly and dramatically, leading to unpredictable conditions like a sudden thunderstorm on a partly cloudy day.

***

#### Track List (`track` parameter)

This is the complete list of track keys you can use in your `event.json`.

* `monza`
* `zolder`
* `brands_hatch`
* `silverstone`
* `paul_ricard`
* `misano`
* `spa`
* `nurburgring`
* `barcelona`
* `hungaroring`
* `zandvoort`
* `kyalami`
* `mount_panorama`
* `suzuka`
* `laguna_seca`
* `imola`
* `oulton_park`
* `donington`
* `snetterton`
* `cota`
* `indianapolis`
* `watkins_glen`
* `valencia`
* `nurburgring_24h`

***

#### Car Model List (`forcedCarModel` parameter)

This is the list of car model IDs used in the `entrylist.json` to force a specific car.

| Car Model | ID |
| :--- | :-: |
| **GT3** | |
| Porsche 991 GT3 R | 0 |
| Mercedes-AMG GT3 | 1 |
| Ferrari 488 GT3 | 2 |
| Audi R8 LMS | 3 |
| Lamborghini Huracan GT3 | 4 |
| McLaren 650S GT3 | 5 |
| Nissan GT-R Nismo GT3 2018 | 6 |
| BMW M6 GT3 | 7 |
| Bentley Continental GT3 2018 | 8 |
| Lexus RC F GT3 | 15 |
| Lamborghini Huracan Evo (2019) | 16 |
| Honda NSX GT3 | 17 |
| Audi R8 LMS Evo (2019) | 19 |
| AMR V8 Vantage (2019) | 20 |
| Honda NSX Evo (2019) | 21 |
| McLaren 720S GT3 (2019) | 22 |
| Porsche 911 II GT3 R (2019) | 23 |
| Ferrari 488 GT3 Evo 2020 | 24 |
| Mercedes-AMG GT3 2020 | 25 |
| BMW M4 GT3 | 30 |
| Audi R8 LMS GT3 evo II | 31 |
| Ferrari 296 GT3 | 32 |
| Lamborghini Huracan Evo2 | 33 |
| Porsche 992 GT3 R | 34 |
| McLaren 720S GT3 Evo 2023 | 35 |
| Ford Mustang GT3 | 36 |
| **GT4** | |
| Alpine A110 GT4 | 50 |
| AMR V8 Vantage GT4 | 51 |
| Audi R8 LMS GT4 | 52 |
| BMW M4 GT4 | 53 |
| Chevrolet Camaro GT4 | 55 |
| Ginetta G55 GT4 | 56 |
| KTM X-Bow GT4 | 57 |
| Maserati MC GT4 | 58 |
| McLaren 570S GT4 | 59 |
| Mercedes-AMG GT4 | 60 |
| Porsche 718 Cayman GT4 | 61 |
| **GT2** | |
| Audi R8 LMS GT2 | 80 |
| KTM XBOW GT2 | 82 |
| Maserati MC20 GT2 | 83 |
| Mercedes AMG GT2 | 84 |
| Porsche 911 GT2 RS CS Evo | 85 |
| Porsche 935 | 86 |
| **GTC & TCX** | |
| Porsche 991 II GT3 Cup | 9 |
| Lamborghini Huracan SuperTrofeo | 18 |
| Ferrari 488 Challenge Evo | 26 |
| BMW M2 CS Racing (TCX) | 27 |
| Porsche 911 GT3 Cup (Type 992) | 28 |
| Lamborghini Huracán Super Trofeo EVO2 | 29 |
