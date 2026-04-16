import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StarField from '../components/StarField'

const APPS = [
  { id: 'world',     label: 'DUNIA',     emoji: '🌍', desc: 'Jelajahi dunia pixel kita bareng', color: '#38b764' },
  { id: 'menu',      label: 'SUASANA',   emoji: '🎭', desc: 'Hari ini kamu lagi gimana?', color: '#e8798b' },
  { id: 'baik',      label: 'NOSTALGIA', emoji: '🖼️', desc: 'Kenangan-kenangan yang kita simpen', color: '#4a7cc9' },
  { id: 'feed',      label: 'FEED',      emoji: '📝', desc: 'Cerita & catatan kita berdua', color: '#d4a853' },
  { id: 'portfolio', label: 'KARYA',     emoji: '🎓', desc: 'Portfolio & pencapaian', color: '#7b5ea7' },
  { id: 'hidden',    label: 'SECRET',    emoji: '🔮', desc: '...', color: '#f0f0f5' },
]

// ── Taskbar clock ──────────────────────────────────────────
function TaskbarClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const pad = (n) => String(n).padStart(2, '0')
  return (
    <span className="font-pixel text-[0.45rem] text-soft-white/60 tabular-nums">
      {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
    </span>
  )
}

// ── Floating draggable window ──────────────────────────────
// Uses position:fixed + framer-motion drag (transforms over left/top).
// No pointer-events wrappers needed.
function AppWindow({ app, onClose, onNavigate }) {
  const initX = typeof window !== 'undefined'
    ? Math.max(8, window.innerWidth / 2 - 150)
    : 60
  const initY = typeof window !== 'undefined'
    ? Math.max(60, window.innerHeight * 0.18)
    : 120

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      style={{
        position: 'fixed',
        left: initX,
        top: initY,
        width: 300,
        zIndex: 200,
        touchAction: 'none',
        cursor: 'grab',
      }}
      whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
    >
      {/* Title bar — drag handle */}
      <div
        style={{
          background: app.color + '25',
          border: `3px solid ${app.color}`,
          borderBottom: 'none',
        }}
        className="flex items-center justify-between px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{app.emoji}</span>
          <span className="font-pixel text-[0.45rem] tracking-wider" style={{ color: app.color }}>
            {app.label}.exe
          </span>
        </div>
        {/* Stop propagation so close button doesn't start a drag */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center font-pixel text-[0.5rem] border transition-colors cursor-pointer"
          style={{
            background: '#e8798b30',
            borderColor: '#e8798b80',
            color: '#e8798b',
          }}
        >
          ×
        </button>
      </div>

      {/* Window body */}
      <div
        style={{
          background: '#111b3d',
          border: `3px solid ${app.color}`,
          borderTop: 'none',
          boxShadow: `0 8px 32px ${app.color}35`,
        }}
        className="flex flex-col items-center gap-4 p-6"
      >
        <span className="text-4xl mt-1">{app.emoji}</span>
        <p className="font-pixel text-[0.45rem] text-soft-white/55 text-center leading-relaxed">
          {app.desc}
        </p>
        {/* Stop propagation so BUKA button doesn't drag the window */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onNavigate(app.id)}
          className="mt-1 pixel-btn !text-[0.48rem] !py-2 !px-5 cursor-pointer"
          style={{ borderColor: app.color, color: app.color }}
        >
          BUKA →
        </button>
      </div>
    </motion.div>
  )
}

// ── Desktop icon ───────────────────────────────────────────
function DesktopIcon({ app, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-2 group cursor-pointer transition-transform duration-100 hover:scale-110 active:scale-95"
    >
      <div
        className="w-14 h-14 flex items-center justify-center border-2 transition-all duration-150"
        style={{
          background: active ? app.color + '28' : app.color + '0f',
          borderColor: active ? app.color : app.color + '55',
          boxShadow: active
            ? `0 0 14px ${app.color}55, inset 0 0 6px ${app.color}20`
            : 'none',
        }}
      >
        <span className="text-2xl">{app.emoji}</span>
      </div>
      <span
        className="font-pixel text-[0.38rem] text-center leading-tight max-w-[3.5rem]"
        style={{ color: active ? app.color : 'rgba(240,240,245,0.5)' }}
      >
        {app.label}
      </span>
    </button>
  )
}

// ── Main component ─────────────────────────────────────────
export default function PixelDesktop({ setPage }) {
  const [activeApp, setActiveApp] = useState(null)
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 200)
    return () => clearTimeout(t)
  }, [])

  const openApp  = (app) => setActiveApp(prev => prev?.id === app.id ? null : app)
  const closeApp = () => setActiveApp(null)
  const navigate = (id) => { setActiveApp(null); setPage(id) }

  const now      = new Date()
  const dayNames   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dateStr  = `${dayNames[now.getDay()]} ${now.getDate()} ${monthNames[now.getMonth()]}`

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden select-none"
      style={{ background: '#0a0e27', paddingBottom: 44 }}
    >
      <StarField />

      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
        }}
      />

      {/* ── Top menu bar ── */}
      <div
        className="relative z-20 flex items-center justify-between px-4 py-2 border-b border-soft-white/10"
        style={{ background: 'rgba(10,14,39,0.85)', backdropFilter: 'blur(6px)' }}
      >
        <div className="flex items-center gap-5">
          <span className="font-pixel text-[0.5rem] text-warm-gold">✦ ANGEL'S SPACE</span>
          <span className="font-pixel text-[0.4rem] text-soft-white/20 hidden md:block">v1.0</span>
        </div>
        <TaskbarClock />
      </div>

      {/* ── Desktop icons area ── */}
      <div className="relative z-20 p-5 md:p-8">
        <div className="flex flex-wrap gap-5 max-w-sm">
          {APPS.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 16 }}
              animate={booted ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
            >
              <DesktopIcon
                app={app}
                active={activeApp?.id === app.id}
                onClick={() => openApp(app)}
              />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-6 font-pixel text-[0.42rem] text-soft-white/18 tracking-wider"
          initial={{ opacity: 0 }}
          animate={booted ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.7 }}
        >
          tap icon untuk membuka • drag window untuk memindah
        </motion.p>
      </div>

      {/* ── Floating windows — position:fixed, no wrapper needed ── */}
      <AnimatePresence>
        {activeApp && (
          <AppWindow
            key={activeApp.id}
            app={activeApp}
            onClose={closeApp}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>

      {/* ── Taskbar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-3"
        style={{
          height: 44,
          background: 'rgba(10,14,39,0.93)',
          backdropFilter: 'blur(10px)',
          borderTop: '2px solid rgba(240,240,245,0.08)',
        }}
      >
        <button
          onClick={() => setPage('dashboard')}
          className="pixel-btn !text-[0.4rem] !py-1 !px-3 !border-warm-gold/40 text-warm-gold hover:!border-warm-gold cursor-pointer"
        >
          ✦ MENU
        </button>

        <AnimatePresence>
          {activeApp && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="px-3 py-1 font-pixel text-[0.4rem] border cursor-pointer"
              style={{
                background: activeApp.color + '18',
                borderColor: activeApp.color + '55',
                color: activeApp.color,
              }}
              onClick={closeApp}
            >
              {activeApp.emoji} {activeApp.label}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <span className="font-pixel text-[0.38rem] text-soft-white/25 hidden md:block">{dateStr}</span>
          <button
            onClick={() => setPage('landing')}
            className="font-pixel text-[0.4rem] text-soft-white/25 hover:text-warm-gold transition-colors cursor-pointer"
          >
            ⏏ exit
          </button>
        </div>
      </div>
    </section>
  )
}
