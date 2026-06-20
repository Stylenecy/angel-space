import { useState } from 'react'
import { usePartnerActivity } from '../hooks/usePartnerActivity'

// Relative-time formatter (Indonesian) — keeps it lightweight, no date lib.
function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'baru aja'
  if (m < 60) return `${m} menit lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  const d = Math.floor(h / 24)
  return `${d} hari lalu`
}

export default function NotificationBell({ username, onGoBible }) {
  const { partner, items, unreadCount, markAllSeen } = usePartnerActivity(username)
  const [open, setOpen] = useState(false)

  if (!partner) return null

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next && unreadCount > 0) markAllSeen()
  }

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={toggle}
        aria-label="Notifikasi"
        className="relative w-8 h-8 flex items-center justify-center border border-warm-gold/40 bg-deep-blue hover:border-warm-gold/80 transition-colors cursor-pointer active:translate-y-0.5"
      >
        <span className="text-sm leading-none">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-pixel-pink text-midnight font-pixel text-[0.4rem] border border-midnight rounded-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Tap-away backdrop */}
          <div className="fixed inset-0 z-[55]" onClick={() => setOpen(false)} />

          {/* Dropdown panel */}
          <div className="absolute right-0 mt-2 w-[280px] sm:w-[320px] max-h-[60vh] overflow-y-auto z-[60] bg-deep-blue border-2 border-warm-gold/40 shadow-[3px_3px_0_0_#d4a853]">
            <div className="sticky top-0 bg-deep-blue px-3 py-2.5 border-b-2 border-soft-white/10 flex items-center justify-between">
              <p className="font-pixel text-[0.5rem] text-warm-gold">aktivitas {partner}</p>
              <button onClick={() => setOpen(false)}
                className="font-pixel text-[0.45rem] text-soft-white/40 hover:text-warm-gold transition-colors cursor-pointer px-1">✕</button>
            </div>

            {items.length === 0 ? (
              <p className="font-sans text-sm text-soft-white/40 text-center py-8 px-4">
                Belum ada aktivitas dari {partner}.
              </p>
            ) : (
              <ul className="divide-y divide-soft-white/5">
                {items.map(it => (
                  <li key={it.id}>
                    <button
                      onClick={() => { setOpen(false); onGoBible?.() }}
                      className="w-full text-left px-3 py-2.5 hover:bg-midnight/60 transition-colors cursor-pointer"
                    >
                      <p className="font-sans text-sm sm:text-base text-soft-white/80 leading-snug">
                        <span className="text-pixel-green">{partner}</span>{' '}
                        {it.note ? 'nulis catatan di' : 'baca'}{' '}
                        <span className="text-warm-gold">{it.book} {it.chapter}</span>
                      </p>
                      {it.note && (
                        <p className="font-sans text-xs text-soft-white/40 italic mt-0.5 leading-snug line-clamp-2">
                          &ldquo;{it.note}&rdquo;
                        </p>
                      )}
                      <p className="font-pixel text-[0.35rem] text-soft-white/25 mt-1">{timeAgo(it.created_at)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
