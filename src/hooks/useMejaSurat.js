import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

// ── Meja Surat (Letter Desk) — timed letters to your partner ────────────
// Write a letter to the other person. Optionally seal it until a date
// (deliver_at) — the recipient sees a sealed envelope and can only open it
// once that moment arrives. Supabase when available, localStorage fallback.

const TABLE = 'meja_surat'
const FALLBACK_KEY = 'angel-meja-surat'

function loadFallback() {
  try { return JSON.parse(localStorage.getItem(FALLBACK_KEY)) || [] } catch { return [] }
}
function saveFallback(rows) {
  try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(rows)) } catch { /* ignore */ }
}

export function isSealed(letter, now = Date.now()) {
  return !!letter.deliver_at && new Date(letter.deliver_at).getTime() > now
}

export function useMejaSurat(username, partner) {
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLetters = useCallback(async () => {
    if (!username) { setLetters([]); setLoading(false); return }
    setLoading(true)
    try {
      // Letters I sent OR letters addressed to me.
      const { data, error } = await supabase
        .from(TABLE)
        .select('id, sender, recipient, title, body, deliver_at, created_at')
        .or(`sender.eq.${username},recipient.eq.${username}`)
        .order('created_at', { ascending: false })
      if (error) throw error
      const local = loadFallback().filter(
        l => String(l.id).startsWith('local-') && (l.sender === username || l.recipient === username)
      )
      setLetters([...local, ...(data || [])])
    } catch {
      setLetters(loadFallback().filter(l => l.sender === username || l.recipient === username))
    } finally {
      setLoading(false)
    }
  }, [username])

  const sendLetter = useCallback(async ({ title, body, deliver_at }) => {
    if (!username || !partner || !body?.trim()) return
    const optimistic = {
      id: `local-${Date.now()}`,
      sender: username, recipient: partner,
      title: title?.trim() || null, body: body.trim(),
      deliver_at: deliver_at || null,
      created_at: new Date().toISOString(),
    }
    setLetters(prev => [optimistic, ...prev])
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({
          sender: username, recipient: partner,
          title: optimistic.title, body: optimistic.body,
          deliver_at: optimistic.deliver_at,
        })
        .select()
        .single()
      if (error) throw error
      setLetters(prev => [data, ...prev.filter(l => l.id !== optimistic.id)])
    } catch {
      saveFallback([optimistic, ...loadFallback()])
    }
    // Best-effort push notification to the partner (no-op if unconfigured).
    try {
      const sealedNote = deliver_at ? ' (tersegel sampai waktunya)' : ''
      await fetch('/api/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_username: partner,
          title: `${username} nulis surat buat kamu 💌`,
          body: (title?.trim() || 'Ada surat baru di Meja Surat') + sealedNote,
          url: '/',
        }),
      })
    } catch { /* not critical */ }
  }, [username, partner])

  const deleteLetter = useCallback(async (id) => {
    setLetters(prev => prev.filter(l => l.id !== id))
    if (String(id).startsWith('local-')) {
      saveFallback(loadFallback().filter(l => l.id !== id))
      return
    }
    try { await supabase.from(TABLE).delete().eq('id', id) } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchLetters() }, [fetchLetters])

  const inbox = letters.filter(l => l.recipient === username)
  const outbox = letters.filter(l => l.sender === username)

  return { letters, inbox, outbox, loading, sendLetter, deleteLetter, refresh: fetchLetters }
}
