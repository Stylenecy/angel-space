import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

// ── Karya Kita (Our Works) — a shared shelf of wins & creations ─────────
// Both Dex & Angel can add. Each item has an `owner` (Dex / Angel / Berdua)
// so it's clear whose win it is. Shared visibility (it's a celebration of
// each other). Supabase when available, localStorage fallback otherwise.

const TABLE = 'karya'
const FALLBACK_KEY = 'angel-karya'

function loadFallback() {
  try { return JSON.parse(localStorage.getItem(FALLBACK_KEY)) || [] } catch { return [] }
}
function saveFallback(rows) {
  try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(rows)) } catch { /* ignore */ }
}

export function useKarya() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('id, owner, title, description, link, created_at')
        .order('created_at', { ascending: false })
      if (error) throw error
      const local = loadFallback().filter(l => String(l.id).startsWith('local-'))
      setItems([...local, ...(data || [])])
    } catch {
      setItems(loadFallback())
    } finally {
      setLoading(false)
    }
  }, [])

  const addItem = useCallback(async ({ owner, title, description, link }) => {
    if (!title?.trim()) return
    const optimistic = {
      id: `local-${Date.now()}`,
      owner: owner || 'Berdua',
      title: title.trim(),
      description: description?.trim() || '',
      link: link?.trim() || null,
      created_at: new Date().toISOString(),
    }
    setItems(prev => [optimistic, ...prev])
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({ owner: optimistic.owner, title: optimistic.title, description: optimistic.description, link: optimistic.link })
        .select()
        .single()
      if (error) throw error
      setItems(prev => [data, ...prev.filter(i => i.id !== optimistic.id)])
    } catch {
      saveFallback([optimistic, ...loadFallback()])
    }
  }, [])

  const deleteItem = useCallback(async (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    if (String(id).startsWith('local-')) {
      saveFallback(loadFallback().filter(i => i.id !== id))
      return
    }
    try { await supabase.from(TABLE).delete().eq('id', id) } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  return { items, loading, addItem, deleteItem, refresh: fetchItems }
}
