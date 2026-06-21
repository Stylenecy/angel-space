import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StarField from '../components/StarField'
import { useAuth } from '../hooks/useAuth'
import { useMejaSurat, isSealed } from '../hooks/useMejaSurat'

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function countdown(iso) {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return 'siap dibuka'
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (d > 0) return `${d} hari ${h} jam lagi`
  if (h > 0) return `${h} jam ${m} menit lagi`
  return `${m} menit lagi`
}

export default function MejaSurat({ setPage }) {
  const { profile, partner } = useAuth()
  const me = profile?.username
  const partnerName = partner
  const { inbox, outbox, loading, sendLetter, deleteLetter } = useMejaSurat(me, partnerName)

  const [tab, setTab] = useState('inbox')        // 'inbox' | 'outbox' | 'compose'
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [deliverAt, setDeliverAt] = useState('') // datetime-local string
  const [sending, setSending] = useState(false)
  const [opened, setOpened] = useState(() => new Set())
  const [sentOk, setSentOk] = useState(false)

  const reveal = (id) => setOpened(prev => new Set(prev).add(id))

  const handleSend = async () => {
    if (!body.trim() || sending) return
    setSending(true)
    const iso = deliverAt ? new Date(deliverAt).toISOString() : null
    await sendLetter({ title, body, deliver_at: iso })
    setTitle(''); setBody(''); setDeliverAt('')
    setSending(false)
    setSentOk(true)
    setTimeout(() => setSentOk(false), 2600)
    setTab('outbox')
  }

  const tabBtn = (key, label) =>
    `flex-1 font-pixel text-[0.5rem] sm:text-[0.55rem] py-3 border-2 transition-all duration-100 active:translate-y-0.5 cursor-pointer
     ${tab === key
       ? 'bg-deep-blue text-warm-gold border-warm-gold/60 shadow-[2px_2px_0_0_#d4a853]'
       : 'bg-midnight text-soft-white/40 border-soft-white/10 hover:border-soft-white/25'}`

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
        <h1 className="font-pixel text-[0.7rem] sm:text-[0.85rem] text-warm-gold mb-2 tracking-wider uppercase">💌 Meja Surat</h1>
        <p className="font-sans text-lg sm:text-xl text-soft-white/70">
          {partnerName ? `Surat buat ${partnerName} — bisa disegel sampai waktunya tiba.` : 'Tempat menulis surat berdua.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="relative z-10 w-full max-w-2xl flex gap-2 mb-6">
        <button onClick={() => setTab('inbox')} className={tabBtn('inbox', 'Diterima')}>📥 Diterima{inbox.length ? ` (${inbox.length})` : ''}</button>
        <button onClick={() => setTab('outbox')} className={tabBtn('outbox')}>📤 Dikirim</button>
        <button onClick={() => setTab('compose')} className={tabBtn('compose')}>✍️ Tulis</button>
      </div>

      {sentOk && (
        <div className="relative z-10 w-full max-w-2xl mb-4 bg-pixel-green/10 border-2 border-pixel-green/40 p-3 text-center">
          <p className="font-pixel text-[0.5rem] text-pixel-green">✓ Surat terkirim ke {partnerName} 💌</p>
        </div>
      )}

      {/* ── Compose ── */}
      {tab === 'compose' && (
        <div className="relative z-10 w-full max-w-2xl bg-deep-blue/60 border-2 border-soft-white/10 p-4 sm:p-6 mb-6">
          {!partnerName && (
            <p className="font-sans text-sm text-pixel-pink/70 mb-3">Login dulu buat nentuin penerima.</p>
          )}
          <label className="block font-sans text-sm text-soft-white/50 mb-1.5">Judul (opsional)</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="buat kamu yang lagi…"
            className="w-full bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base sm:text-lg p-2.5 mb-4 focus:border-warm-gold/50 outline-none" />

          <label className="block font-sans text-sm text-soft-white/50 mb-1.5">Isi surat</label>
          <textarea value={body} onChange={e => setBody(e.target.value)}
            placeholder="tulis apa yang susah diomongin langsung…"
            className="w-full bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base sm:text-lg p-3 min-h-[150px] resize-none focus:border-warm-gold/50 outline-none mb-4" />

          <label className="block font-sans text-sm text-soft-white/50 mb-1.5">Buka pada (opsional — segel sampai tanggal ini)</label>
          <input type="datetime-local" value={deliverAt} onChange={e => setDeliverAt(e.target.value)}
            className="w-full bg-midnight border-2 border-soft-white/10 text-soft-white font-sans text-base p-2.5 mb-1 focus:border-warm-gold/50 outline-none" />
          <p className="font-sans text-xs text-soft-white/30 mb-4">
            {deliverAt ? `📜 Tersegel — ${partnerName || 'partner'} baru bisa buka pada ${fmtDate(new Date(deliverAt).toISOString())}.` : 'Kosongkan kalau mau langsung bisa dibaca.'}
          </p>

          <button onClick={handleSend} disabled={!body.trim() || !partnerName || sending}
            className="w-full font-pixel text-[0.55rem] sm:text-[0.6rem] py-3 px-4 border-2 transition-all duration-100 active:translate-y-0.5
              bg-deep-blue/80 border-warm-gold/50 text-warm-gold hover:bg-warm-gold/15 shadow-[3px_3px_0_0_#d4a853] hover:shadow-[1px_1px_0_0_#d4a853] cursor-pointer
              disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none">
            {sending ? 'mengirim…' : '💌 Kirim surat'}
          </button>
        </div>
      )}

      {/* ── Inbox ── */}
      {tab === 'inbox' && (
        <div className="relative z-10 w-full max-w-2xl space-y-3 pb-10">
          {loading && <p className="font-pixel text-[0.55rem] text-soft-white/30 text-center py-8 animate-pixel-blink">memuat surat…</p>}
          {!loading && inbox.length === 0 && (
            <p className="font-sans text-base text-soft-white/30 text-center py-6">Belum ada surat buat kamu. 🤍</p>
          )}
          {inbox.map(l => {
            const sealed = isSealed(l)
            const isOpen = opened.has(l.id)
            return (
              <div key={l.id}
                className={`border-2 p-4 sm:p-5 ${sealed ? 'bg-deep-blue/30 border-warm-gold/20' : 'bg-deep-blue/50 border-warm-gold/40'}`}>
                {sealed ? (
                  <div className="text-center py-3">
                    <p className="text-3xl mb-2">📜</p>
                    <p className="font-pixel text-[0.5rem] text-warm-gold/80 mb-1">surat tersegel dari {l.sender}</p>
                    <p className="font-sans text-sm text-soft-white/50">terbuka {fmtDate(l.deliver_at)}</p>
                    <p className="font-sans text-base text-warm-gold/70 mt-1">⏳ {countdown(l.deliver_at)}</p>
                  </div>
                ) : !isOpen ? (
                  <button onClick={() => reveal(l.id)} className="w-full text-left cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✉️</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-base sm:text-lg text-warm-gold truncate group-hover:underline">
                          {l.title || `Surat dari ${l.sender}`}
                        </p>
                        <p className="font-sans text-xs text-soft-white/40">dari {l.sender} · {fmtDate(l.created_at)} · ketuk buat buka</p>
                      </div>
                    </div>
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    {l.title && <p className="font-pixel text-[0.55rem] text-warm-gold mb-2">{l.title}</p>}
                    <p className="font-sans text-base sm:text-lg text-soft-white/85 leading-relaxed whitespace-pre-wrap break-words">{l.body}</p>
                    <p className="font-sans text-xs text-soft-white/30 mt-3">— {l.sender}, {fmtDate(l.created_at)}</p>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Outbox ── */}
      {tab === 'outbox' && (
        <div className="relative z-10 w-full max-w-2xl space-y-3 pb-10">
          {loading && <p className="font-pixel text-[0.55rem] text-soft-white/30 text-center py-8 animate-pixel-blink">memuat surat…</p>}
          {!loading && outbox.length === 0 && (
            <p className="font-sans text-base text-soft-white/30 text-center py-6">Belum ada surat yang kamu kirim.</p>
          )}
          {outbox.map(l => {
            const sealed = isSealed(l)
            return (
              <div key={l.id} className="bg-deep-blue/40 border-2 border-soft-white/5 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-sans text-base sm:text-lg text-soft-white/85 truncate">
                    {l.title || 'Tanpa judul'} <span className="text-soft-white/40 text-sm">→ {l.recipient}</span>
                  </p>
                  <button onClick={() => deleteLetter(l.id)} title="Hapus"
                    className="shrink-0 font-pixel text-[0.4rem] text-soft-white/20 hover:text-pixel-pink transition-colors cursor-pointer">✕</button>
                </div>
                <p className="font-sans text-base text-soft-white/55 leading-relaxed whitespace-pre-wrap break-words line-clamp-3">{l.body}</p>
                <p className="font-sans text-xs mt-2">
                  {sealed
                    ? <span className="text-warm-gold/70">📜 tersegel · terbuka {fmtDate(l.deliver_at)}</span>
                    : <span className="text-pixel-green/70">✓ bisa dibaca {l.recipient}</span>}
                  <span className="text-soft-white/25"> · dikirim {fmtDate(l.created_at)}</span>
                </p>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
