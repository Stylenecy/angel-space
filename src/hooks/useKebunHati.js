import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

// ── Kebun Hati (Garden of the Heart) — daily journal ────────────────────
// Each entry is a seed: a mood + a few words about today. Entries are
// PRIVATE to the writer (your own garden), scoped strictly by username,
// just like Bible Walk. Supabase when available, localStorage fallback so
// it always works even before the DB table exists.

const TABLE = 'kebun_hati'
const fallbackKey = (u) => `angel-kebun-${(u || 'anon').toLowerCase()}`

function loadFallback(username) {
  try { return JSON.parse(localStorage.getItem(fallbackKey(username))) || [] } catch { return [] }
}
function saveFallback(username, rows) {
  try { localStorage.setItem(fallbackKey(username), JSON.stringify(rows)) } catch { /* ignore */ }
}

export function useKebunHati(username) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    if (!username) { setEntries([]); setLoading(false); return }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('id, username, mood, body, created_at')
        .eq('username', username)
        .order('created_at', { ascending: false })
      if (error) throw error
      // Merge any offline-only entries that never reached the DB.
      const local = loadFallback(username).filter(l => String(l.id).startsWith('local-'))
      setEntries([...local, ...(data || [])])
    } catch {
      setEntries(loadFallback(username))
    } finally {
      setLoading(false)
    }
  }, [username])

  const addEntry = useCallback(async ({ mood, body }) => {
    if (!username || !body?.trim()) return
    const optimistic = {
      id: `local-${Date.now()}`,
      username, mood, body: body.trim(),
      created_at: new Date().toISOString(),
    }
    setEntries(prev => [optimistic, ...prev])
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({ username, mood, body: body.trim() })
        .select()
        .single()
      if (error) throw error
      // Swap the optimistic row for the real one.
      setEntries(prev => [data, ...prev.filter(e => e.id !== optimistic.id)])
    } catch {
      const rows = [optimistic, ...loadFallback(username)]
      saveFallback(username, rows)
    }
  }, [username])

  const deleteEntry = useCallback(async (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    if (String(id).startsWith('local-')) {
      saveFallback(username, loadFallback(username).filter(e => e.id !== id))
      return
    }
    try { await supabase.from(TABLE).delete().eq('id', id) } catch { /* ignore */ }
  }, [username])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  return { entries, loading, addEntry, deleteEntry, refresh: fetchEntries }
}
