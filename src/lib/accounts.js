// ── Account identity helpers ──────────────────────────────────────────
// This is a couple space behind a shared PIN. There are exactly two
// first-class accounts. Identity is NOT free-text: callers canonicalize
// whatever is stored/typed to one of these so reads/writes are
// unambiguously scoped, and so "Dex" / "dex" / "DEX" can never split one
// person's Bible-reading progress into two.

export const ACCOUNTS = ['Dex', 'Angel']

// Map any stored/typed value to its canonical account name (or null).
export function canonicalUsername(name) {
  const t = (name || '').trim().toLowerCase()
  if (!t) return null
  if (t === 'dex') return 'Dex'
  if (t === 'angel') return 'Angel'
  // Legacy / unknown values: keep them as-is (trimmed) so we never lose
  // access to historical data written under a different name.
  return (name || '').trim()
}

// The partner of a given account (the other half of the couple).
export function partnerOf(username) {
  if (!username) return null
  if (username === 'Dex') return 'Angel'
  if (username === 'Angel') return 'Dex'
  // Fallback for any legacy name.
  return username.toLowerCase() === 'dex' ? 'Angel' : 'Dex'
}
