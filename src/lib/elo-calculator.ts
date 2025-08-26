// ELO Rating System for ACC Racing (FR-15)
// Based on standard ELO with adjustments for racing positions

export interface RaceResultForElo {
  driverId: string
  position: number
  totalParticipants: number
  dnf: boolean
  currentElo: number
}

export interface EloUpdate {
  driverId: string
  oldElo: number
  newElo: number
  change: number
}

/**
 * Calculate expected score for a driver based on their ELO vs field average
 */
function calculateExpectedScore(playerElo: number, fieldAverageElo: number): number {
  return 1 / (1 + Math.pow(10, (fieldAverageElo - playerElo) / 400))
}

/**
 * Convert race position to actual score (0.0 to 1.0)
 * 1st place = 1.0, last place = 0.0, with linear distribution
 */
function positionToScore(position: number, totalParticipants: number, dnf: boolean): number {
  if (dnf) {
    // DNF gets a penalty - scored as if they finished last
    return 0.0
  }
  
  // Linear scoring: 1st = 1.0, 2nd = 0.9, etc.
  return (totalParticipants - position) / (totalParticipants - 1)
}

/**
 * Calculate K-factor based on:
 * - Current ELO (provisional vs established)
 * - Race size (larger races have more impact)
 */
function calculateKFactor(currentElo: number, raceSize: number): number {
  let baseFactor = 32
  
  // Provisional players (under 1400 or over 1600) get higher K-factor
  if (currentElo < 1400 || currentElo > 1600) {
    baseFactor = 40
  }
  
  // Scale with race size - bigger races matter more
  const sizeFactor = Math.min(1.5, Math.max(0.5, raceSize / 20))
  
  return Math.round(baseFactor * sizeFactor)
}

/**
 * Process race results and calculate ELO updates for all participants
 */
export function calculateRaceEloUpdates(raceResults: RaceResultForElo[]): EloUpdate[] {
  if (raceResults.length === 0) return []
  
  const totalParticipants = raceResults.length
  
  // Calculate field average ELO
  const fieldAverageElo = raceResults.reduce((sum, result) => sum + result.currentElo, 0) / totalParticipants
  
  return raceResults.map(result => {
    const expectedScore = calculateExpectedScore(result.currentElo, fieldAverageElo)
    const actualScore = positionToScore(result.position, totalParticipants, result.dnf)
    const kFactor = calculateKFactor(result.currentElo, totalParticipants)
    
    const eloChange = Math.round(kFactor * (actualScore - expectedScore))
    const newElo = Math.max(100, result.currentElo + eloChange) // Minimum ELO of 100
    
    return {
      driverId: result.driverId,
      oldElo: result.currentElo,
      newElo,
      change: eloChange
    }
  })
}

/**
 * Get ELO tier/rank name based on rating
 */
export function getEloTier(elo: number): { tier: string, color: string } {
  if (elo >= 2200) return { tier: 'Alien', color: 'purple' }
  if (elo >= 2000) return { tier: 'Pro', color: 'red' }
  if (elo >= 1800) return { tier: 'Expert', color: 'orange' }
  if (elo >= 1600) return { tier: 'Advanced', color: 'yellow' }
  if (elo >= 1400) return { tier: 'Intermediate', color: 'green' }
  if (elo >= 1200) return { tier: 'Novice', color: 'blue' }
  return { tier: 'Rookie', color: 'gray' }
}