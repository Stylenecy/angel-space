/**
 * Entrance picker — random entrance type with no consecutive repeats.
 * Also includes 10% chance of secret heart entrance.
 */

const ENTRANCE_TYPES = ['starfall', 'portal', 'typewriter', 'moodmatch']
const SECRET_CHANCE = 0.1 // 10%

let lastType = null

/**
 * Pick a random entrance type.
 * Never returns the same type twice in a row.
 * 10% chance of returning 'secretheart' instead.
 */
export function pickEntrance() {
  // 10% chance for secret heart
  if (Math.random() < SECRET_CHANCE) {
    const type = 'secretheart'
    console.log(`🎭 Entrance picked: ${type} (secret heart!)`)
    return type
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
