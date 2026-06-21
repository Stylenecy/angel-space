import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StarField from '../components/StarField'
import { useAuth } from '../hooks/useAuth'
import { useKarya } from '../hooks/useKarya'

const OWNERS = ['Dex', 'Angel', 'Berdua']
const OWNER_STYLE = {
  Dex:    { tint: 'text-calm-blue', chip: 'border-calm-blue/60 text-calm-blue bg-calm-blue/10', dot: '🔵' },
  Angel:  { tint: 'text-warm-gold', chip: 'border-warm-gold/60 text-warm-gold bg-warm-gold/10', dot: '🌙' },
  Berdua: { tint: 'text-pixel-pink', chip: 'border-pixel-pink/60 text-pixel-pink bg-pixel-pink/10', dot: '🤍' },
}
const styleOf = (o) => OWNER_STYLE[o] || OWNER_STYLE.Berdua

export default function Portfolio({ setPage }) {
  const { profile } = useAuth()
  const me = profile?.username
  const { items, loading, addItem, deleteItem } = useKarya()

  const [filter, setFilter] = useState('Semua')
  const [showForm, setShowForm] = useState(false)
  const [owner, setOwner] = useState(me && OWNERS.includes(me) ? me : 'Berdua')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [link, setLink] = useState('')
  const [saving, setSaving] = useState(false)

  const shown = filter === 'Semua' ? items : items.filter(i => i.owner === filter)

  const handleAdd = async () => {
    if (!title.trim() || saving) return
    setSaving(true)
    await addItem({ owner, title, description: desc, link })
    setTitle(''); setDesc(''); setLink('')
    setSaving(false)
    setShowForm(false)
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
        <h1 className="font-pixel text-[0.7rem] sm:text-[0.85rem] text-pixel-purple mb-2 tracking-wider uppercase">🎓 Karya Kita</h1>
        <p className="font-sans text-lg sm:text-xl text-soft-white/70">
          Rak kecil buat ngerayain pencapaian & karya kita berdua.
        </p>
      </div>

      {/* Filter + add */}
      <div className="relative z-10 w-full max-w-2xl flex items-center gap-2 mb-5 flex-wrap">
        {['Semua', ...OWNERS].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-pixel text-[0.45rem] sm:text-[0.5rem] px-3 py-2 border-2 transition-all duration-100 active:translate-y-0.5 cursor-pointer
              ${filter === f ? 'bg-deep-blue text-warm-gold border-warm-gold/60 shadow-[2px_2px_0_0_#d4a853]'
                            : 'bg-midnight text-soft-white/40 border-soft-white/10 hover:border-soft-white/25'}`}>
            {f}
          </button>
        ))}
        <button onClick={() => setShowForm(v => !v)}
          className="ml-auto font-pixel text-[0.45rem] sm:text-[0.5rem] px-3 py-2 border-2 border-pixel-purple/50 text-pixel-purple hover:bg-pixel-purple/15 transition-colors cursor-pointer active:translate-y-0.5 shadow-[2px_2px_0_0_#7b5ea7]">
          {showForm ? '✕ tutup' : '+ tambah'}
        </button>
      </div>

      {/* Composer */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden mb-5">
            <div className="bg-deep-blue/60 border-2 border-soft-white/10 p-4 sm:p-5">
              <label className="block font-sans text-sm text-soft-white/50 mb-1.5">Punya siapa?</label>
              <div className="flex gap-2 mb-3">
                {OWNERS.map(o => (
                  <button key={o} onClick={() => setOwner(o)}
                    className={`flex-1 font-sans text-sm py-2 border-2 transition-colors cursor-pointer
                      ${owner === o ? styleOf(o).chip : 'bg-midnight border-soft-white/10 text-soft-white/40 hover:border-soft-white/25'}`}>
                    {styleOf(o).dot} {o}
                  </button>
                ))}
              </div>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="judul karya / pencapaian"
                className="w-full bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base sm:text-lg p-2.5 mb-3 focus:border-warm-gold/50 outline-none" />
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="cerita dikit (opsional)"
                className="w-full bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base p-2.5 mb-3 min-h-[80px] resize-none focus:border-warm-gold/50 outline-none" />
              <input value={link} onChange={e => setLink(e.target.value)} placeholder="link (opsional) — https://…"
                className="w-full bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base p-2.5 mb-3 focus:border-warm-gold/50 outline-none" />
              <button onClick={handleAdd} disabled={!title.trim() || saving}
                className="w-full font-pixel text-[0.55rem] py-3 border-2 border-pixel-purple/50 text-pixel-purple hover:bg-pixel-purple/15 transition-all cursor-pointer active:translate-y-0.5 shadow-[3px_3px_0_0_#7b5ea7] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none">
                {saving ? 'menyimpan…' : '✦ Simpan karya'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="relative z-10 w-full max-w-2xl space-y-3 pb-10">
        {loading && <p className="font-pixel text-[0.55rem] text-soft-white/30 text-center py-8 animate-pixel-blink">memuat…</p>}
        {!loading && shown.length === 0 && (
          <p className="font-sans text-base text-soft-white/30 text-center py-6">
            {filter === 'Semua' ? 'Belum ada karya. Tambah yang pertama ✨' : `Belum ada karya ${filter}.`}
          </p>
        )}
        <AnimatePresence>
          {shown.map(it => {
            const s = styleOf(it.owner)
            return (
              <motion.div key={it.id} layout
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                className="bg-deep-blue/40 border-2 border-soft-white/5 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className={`font-pixel text-[0.4rem] sm:text-[0.45rem] px-2 py-1 border ${s.chip}`}>{s.dot} {it.owner}</span>
                  <button onClick={() => deleteItem(it.id)} title="Hapus"
                    className="shrink-0 font-pixel text-[0.4rem] text-soft-white/20 hover:text-pixel-pink transition-colors cursor-pointer">✕</button>
                </div>
                <p className={`font-sans text-lg sm:text-xl ${s.tint} leading-snug mt-1`}>{it.title}</p>
                {it.description && (
                  <p className="font-sans text-base text-soft-white/65 leading-relaxed mt-1 whitespace-pre-wrap break-words">{it.description}</p>
                )}
                {it.link && (
                  <a href={it.link} target="_blank" rel="noreferrer"
                    className="inline-block mt-2 font-pixel text-[0.45rem] text-calm-blue hover:underline break-all">↗ buka link</a>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </section>
  )
}
