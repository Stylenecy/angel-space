import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { partnerOf } from '../lib/accounts'

// In-app notification feed for partner activity (complements push notifications).
// Reuses the same `bible_progress` table the BibleWalk push logic relies on.
// "Seen" state is stored locally per-user so the unread badge resets on view.

const SEEN_KEY = 'angel-notif-last-seen' // ISO timestamp of last time the bell was opened

const getPartner = partnerOf

function loadLastSeen() {
  try { return localStorage.getItem(SEEN_KEY) } catch { return null }
}

function saveLastSeen(iso) {
  try { localStorage.setItem(SEEN_KEY, iso) } catch { /* ignore */ }
}

export function usePartnerActivity(username) {
  const partner = getPartner(username)
  const [items, setItems] = useState([])
  const [lastSeen, setLastSeen] = useState(() => loadLastSeen())

  const fetchActivity = useCallback(async () => {
    if (!partner) return
    // Pull the partner's recent reads + notes from the last ~14 days.
    const since = new Date(Date.now() - 14 * 86400000).toISOString()
    const { data, error } = await supabase
      .from('bible_progress')
      .select('book, chapter, note, created_at')
      .eq('username', partner)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error || !data) return
    const mapped = data.map(r => ({
      id: `${r.book}-${r.chapter}-${r.created_at}`,
      book: r.book,
      chapter: r.chapter,
      note: r.note || '',
      created_at: r.created_at,
    }))
    setItems(mapped)
  }, [partner])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  // Anything newer than lastSeen counts as unread.
  const unreadCount = items.filter(
    it => !lastSeen || (it.created_at && it.created_at > lastSeen)
  ).length

  // Call when the user opens the bell — marks everything currently shown as seen.
  const markAllSeen = useCallback(() => {
    const now = new Date().toISOString()
    saveLastSeen(now)
    setLastSeen(now)
  }, [])

  return { partner, items, unreadCount, markAllSeen, refresh: fetchActivity }
}
