import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StarField from '../components/StarField'
import { useAuth } from '../hooks/useAuth'
import { useKebunHati } from '../hooks/useKebunHati'

// Each mood is a different plant in your garden.
const MOODS = [
  { key: 'syukur', emoji: '🌻', label: 'bersyukur' },
  { key: 'senang', emoji: '🌸', label: 'senang' },
  { key: 'tenang', emoji: '🌿', label: 'tenang' },
  { key: 'kangen', emoji: '🌙', label: 'kangen' },
  { key: 'lelah',  emoji: '🍂', label: 'lelah' },
  { key: 'sedih',  emoji: '🌧️', label: 'sedih' },
]
const moodOf = (k) => MOODS.find(m => m.key === k) || MOODS[2]

function timeAgo(iso) {
  if (!iso) return ''
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (d <= 0) return 'hari ini'
  if (d === 1) return 'kemarin'
  if (d < 7) return `${d} hari lalu`
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function KebunHati({ setPage }) {
  const { profile } = useAuth()
  const me = profile?.username
  const displayName = profile?.display_name || me || 'kamu'
  const { entries, loading, addEntry, deleteEntry } = useKebunHati(me)

  const [mood, setMood] = useState('tenang')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)

  const handlePlant = async () => {
    if (!body.trim() || saving) return
    setSaving(true)
    await addEntry({ mood, body })
    setBody('')
    setMood('tenang')
    setSaving(false)
  }

  return (
    <section className="relative flex flex-col items-center min-h-screen w-full bg-midnight overflow-x-hidden px-4 py-6 sm:py-8">
      <StarField />

      <button
        onClick={() => setPage('dashboard')}
        className="fixed top-4 left-4 z-50 font-pixel text-[0.5rem] sm:text-[0.55rem] text-warm-gold/60 hover:text-warm-gold border border-warm-gold/20 hover:border-warm-gold/50 px-3 py-1.5 transition-colors cursor-pointer bg-deep-blue/40 hover:bg-deep-blue/70"
      >
        ← Kembali
      </button>

      <div className="relative z-10 w-full max-w-2xl text-center mb-6 mt-16 sm:mt-12">
        <h1 className="font-pixel text-[0.7rem] sm:text-[0.85rem] text-pixel-green mb-2 tracking-wider uppercase">🌷 Kebun Hati</h1>
        <p className="font-sans text-lg sm:text-xl text-soft-white/70">
          Hai {displayName}, tanam apa yang kamu rasa hari ini.
        </p>
      </div>

      {/* ── The garden bed — every entry blooms here ── */}
      <div className="relative z-10 w-full max-w-2xl mb-6">
        <div className="bg-gradient-to-b from-deep-blue/30 to-pixel-green/10 border-2 border-pixel-green/20 p-4 sm:p-5 min-h-[84px]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-[0.45rem] sm:text-[0.5rem] text-pixel-green/80 uppercase tracking-wider">kebunmu</span>
            <span className="font-sans text-sm text-soft-white/40">{entries.length} bunga</span>
          </div>
          {entries.length === 0 ? (
            <p className="font-sans text-sm text-soft-white/30 py-3">Tanahnya masih kosong. Tanam benih pertamamu. 🌱</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 items-end">
              <AnimatePresence>
                {entries.map((e) => (
                  <motion.span
                    key={e.id}
                    initial={{ opacity: 0, y: 12, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    title={moodOf(e.mood).label}
                    className="text-xl sm:text-2xl leading-none"
                  >
                    {moodOf(e.mood).emoji}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Composer ── */}
      <div className="relative z-10 w-full max-w-2xl bg-deep-blue/60 border-2 border-soft-white/10 p-4 sm:p-6 mb-6">
        <label className="block font-sans text-sm text-soft-white/50 mb-2">Hari ini hatimu kayak apa?</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
          {MOODS.map(m => {
            const on = mood === m.key
            return (
              <button key={m.key} onClick={() => setMood(m.key)}
                className={`flex flex-col items-center gap-1 py-2.5 border-2 transition-all duration-100 active:translate-y-0.5 cursor-pointer
                  ${on ? 'bg-pixel-green/15 border-pixel-green/60 shadow-[2px_2px_0_0_#38b764]'
                       : 'bg-midnight border-soft-white/10 hover:border-soft-white/30'}`}>
                <span className="text-xl">{m.emoji}</span>
                <span className={`font-sans text-xs ${on ? 'text-pixel-green' : 'text-soft-white/40'}`}>{m.label}</span>
              </button>
            )
          })}
        </div>

        <textarea value={body} onChange={e => setBody(e.target.value)}
          placeholder="tulis sedikit tentang hari ini…"
          className="w-full bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base sm:text-lg p-3 min-h-[110px] resize-none focus:border-pixel-green/50 outline-none" />

        <button onClick={handlePlant} disabled={!body.trim() || saving}
          className="mt-3 w-full font-pixel text-[0.55rem] sm:text-[0.6rem] py-3 px-4 border-2 transition-all duration-100 active:translate-y-0.5
            bg-deep-blue/80 border-pixel-green/50 text-pixel-green hover:bg-pixel-green/15 shadow-[3px_3px_0_0_#38b764] hover:shadow-[1px_1px_0_0_#38b764] cursor-pointer
            disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none">
          {saving ? 'menanam…' : '🌱 Tanam'}
        </button>
      </div>

      {/* ── Timeline ── */}
      <div className="relative z-10 w-full max-w-2xl space-y-3 pb-10">
        {loading && (
          <p className="font-pixel text-[0.55rem] text-soft-white/30 text-center py-8 animate-pixel-blink">memuat kebun…</p>
        )}
        {!loading && entries.length === 0 && (
          <p className="font-sans text-base text-soft-white/30 text-center py-6">Belum ada catatan. Mulai dari yang kecil. 🤍</p>
        )}
        <AnimatePresence>
          {entries.map(e => {
            const m = moodOf(e.mood)
            return (
              <motion.div key={e.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-deep-blue/40 border-2 border-soft-white/5 p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-pixel text-[0.4rem] sm:text-[0.45rem] text-pixel-green/70 uppercase tracking-wider">{m.label}</span>
                      <span className="font-sans text-xs text-soft-white/30">{timeAgo(e.created_at)}</span>
                    </div>
                    <p className="font-sans text-base sm:text-lg text-soft-white/85 leading-relaxed whitespace-pre-wrap break-words">{e.body}</p>
                  </div>
                  <button onClick={() => deleteEntry(e.id)}
                    title="Hapus"
                    className="shrink-0 font-pixel text-[0.4rem] text-soft-white/20 hover:text-pixel-pink transition-colors cursor-pointer">✕</button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </section>
  )
}
