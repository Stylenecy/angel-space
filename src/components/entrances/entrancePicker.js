/**
 * Entrance picker — random entrance type with no consecutive repeats.
 * - Cinematic boot intro shows once per 24 hours (localStorage).
 * - 10% chance of secret heart on other visits.
 */

const ENTRANCE_TYPES   = ['starfall', 'portal', 'typewriter', 'moodmatch']
const SECRET_CHANCE    = 0.1
const CINEMATIC_KEY    = 'as_cinematic_ts'
const CINEMATIC_COOLDOWN = 24 * 60 * 60 * 1000  // 24 jam

let lastType = null

/**
 * Pick a random entrance type.
 * - Once per 24h → 'cinematic' boot sequence (uses localStorage timestamp).
 * - Otherwise: 10% secretheart, else random no-repeat.
 */
export function pickEntrance() {
  try {
    const last = parseInt(localStorage.getItem(CINEMATIC_KEY) || '0', 10)
    if (Date.now() - last > CINEMATIC_COOLDOWN) {
      localStorage.setItem(CINEMATIC_KEY, String(Date.now()))
      console.log('🎬 Entrance: cinematic (24h cooldown reset)')
      return 'cinematic'
    }
  } catch (_) {
    // localStorage unavailable — skip cinematic
  }

  if (Math.random() < SECRET_CHANCE) {
    console.log('🎭 Entrance: secretheart')
    return 'secretheart'
  }

  let type
  do {
    type = ENTRANCE_TYPES[Math.floor(Math.random() * ENTRANCE_TYPES.length)]
  } while (type === lastType)

  lastType = type
  console.log(`🎭 Entrance: ${type}`)
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
