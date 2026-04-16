/**
 * Entrance picker — random entrance type with no consecutive repeats.
 * First visit per session → cinematic boot intro.
 * 10% chance of secret heart on subsequent visits.
 */

const ENTRANCE_TYPES = ['starfall', 'portal', 'typewriter', 'moodmatch']
const SECRET_CHANCE   = 0.1   // 10%
const CINEMATIC_KEY   = 'as_cinematic_done'

let lastType = null

/**
 * Pick a random entrance type.
 * - First visit this browser session → 'cinematic' boot sequence.
 * - Subsequent visits: 10% secret heart, otherwise random (no repeats).
 */
export function pickEntrance() {
  // First visit this session → cinematic intro
  if (!sessionStorage.getItem(CINEMATIC_KEY)) {
    sessionStorage.setItem(CINEMATIC_KEY, '1')
    console.log('🎬 Entrance picked: cinematic (first visit)')
    return 'cinematic'
  }

  // 10% chance for secret heart
  if (Math.random() < SECRET_CHANCE) {
    console.log('🎭 Entrance picked: secretheart')
    return 'secretheart'
  }

  let type
  do {
    type = ENTRANCE_TYPES[Math.floor(Math.random() * ENTRANCE_TYPES.length)]
  } while (type === lastType)

  lastType = type
  console.log(`🎭 Entrance picked: ${type}`)
  return type
}

/**
 * Get mood-based entrance for time of day.
 * Used by MoodMatch entrance.
 */
export function getTimeMood() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 9) return 'sunrise'
  if (hour >= 9 && hour < 15) return 'morning'
  if (hour >= 15 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 21) return 'evening'
  return 'night'
}
