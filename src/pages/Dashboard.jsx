import { useEffect, useState, useRef, useCallback } from 'react'
import StarField from '../components/StarField'
import { useAuth } from '../hooks/useAuth'
import { animate, stagger, createTimeline } from 'animejs'
import { pickEntrance } from '../components/entrances/entrancePicker'
import {
  StarfallEntrance,
  PortalEntrance,
  TypewriterEntrance,
  MoodMatchEntrance,
  SecretHeartEntrance,
} from '../components/entrances'
import { SurpriseWheel, SurpriseContent, useIdleDetector } from '../components/surprise'

const ENTRANCE_COMPONENTS = {
  starfall: StarfallEntrance,
  portal: PortalEntrance,
  typewriter: TypewriterEntrance,
  moodmatch: MoodMatchEntrance,
  secretheart: SecretHeartEntrance,
}

const portals = [
  { id: 'world',      label: 'Jelajahi Dunia', emoji: '🌍', desc: 'dunia pixel kita', color: 'border-pixel-green/40 hover:border-pixel-green/80 hover:shadow-pixel-green/20' },
  { id: 'bilikSuasana', label: 'Bilik Suasana', emoji: '🎭', desc: 'hari ini kamu gimana?', color: 'border-pixel-pink/40 hover:border-pixel-pink/80 hover:shadow-pixel-pink/20' },
  { id: 'nostalgia',   label: 'Bilik Nostalgia', emoji: '🖼️', desc: 'kenangan kita', color: 'border-calm-blue/40 hover:border-calm-blue/80 hover:shadow-calm-blue/20' },
  { id: 'feed',        label: 'Feed Kita', emoji: '📝', desc: 'cerita kita', color: 'border-warm-gold/40 hover:border-warm-gold/80 hover:shadow-warm-gold/20' },
  { id: 'journal',    label: 'Ruang Jurnal', emoji: '📖', desc: 'tulis apa yang kamu rasain', color: 'border-soft-white/20 hover:border-soft-white/50 hover:shadow-soft-white/10' },
  { id: 'portfolio',  label: 'Karya Kita', emoji: '🎓', desc: 'portofolio & pencapaian', color: 'border-pixel-purple/40 hover:border-pixel-purple/80 hover:shadow-pixel-purple/20' },
]

const COMING_SOON = new Set(['journal'])

function getGreeting(name) {
  const h = new Date().getHours()
  const time = h < 11 ? 'pagi' : h < 15 ? 'siang' : h < 18 ? 'sore' : 'malam'
  return `Selamat ${time}, ${name} ☀️`
}

export default function Dashboard({ setPage }) {
  const { profile, signOut } = useAuth()
  const [visible, setVisible] = useState(false)
  const [entranceType, setEntranceType] = useState(null)
  const [entranceDone, setEntranceDone] = useState(false)
  const dashboardContentRef = useRef(null)

  // Surprise Me state
  const [showWheel, setShowWheel] = useState(false)
  const [activeSurprise, setActiveSurprise] = useState(null)
  const [showIdleNotif, setShowIdleNotif] = useState(false)

  const displayName = profile?.display_name || profile?.username || 'Angel'

  // Idle detector — 30s triggers notification
  const handleIdle = useCallback(() => {
    setShowIdleNotif(true)
  }, [])
  useIdleDetector(30000, handleIdle, entranceDone && !showWheel && !activeSurprise)

  const handleSurpriseSelect = (item) => {
    setShowWheel(false)
    setActiveSurprise(item.id)
  }

  const handleCloseSurprise = () => {
    setActiveSurprise(null)
    setShowIdleNotif(false)
  }

  // Pick random entrance on mount
  useEffect(() => {
    setEntranceType(pickEntrance())
  }, [])

  // EMERGENCY: If entrance doesn't complete in 6s, force show dashboard
  useEffect(() => {
    const emergencyShow = setTimeout(() => {
      setEntranceDone(true)
      setVisible(true)
    }, 6000)
    return () => clearTimeout(emergencyShow)
  }, [])

  // After entrance animation, reveal dashboard
  const handleEntranceComplete = () => {
    setEntranceDone(true)
    // Stagger reveal of dashboard elements
    if (dashboardContentRef.current) {
      createTimeline({ easing: 'easeOutExpo' })
        .add({
          targets: '.dash-navbar',
          opacity: [0, 1],
          translateY: [-20, 0],
          duration: 600,
        })
        .add({
          targets: '.dash-greeting',
          opacity: [0, 1],
          translateY: [15, 0],
          duration: 500,
        }, -300)
        .add({
          targets: '.dash-portal',
          opacity: [0, 1],
          translateY: [20, 0],
          delay: stagger(80),
          duration: 500,
        }, -200)
    }
    setVisible(true)
  }

  const handlePortal = (id) => {
    if (COMING_SOON.has(id)) return
    if (id === 'bilikSuasana') setPage('menu')
    else if (id === 'nostalgia') setPage('baik')
    else if (id === 'world') setPage('world')
    else if (id === 'feed') setPage('feed')
    else setPage(id)
  }

  const handleSignOut = async () => {
    await signOut()
    setPage('landing')
  }

  const EntranceComponent = entranceType ? ENTRANCE_COMPONENTS[entranceType] : null

  return (
    <section className="relative flex flex-col items-center min-h-screen px-6 py-10 overflow-hidden select-none">
      <StarField />

      {/* Entrance animation overlay */}
      {!entranceDone && EntranceComponent && (
        <EntranceComponent onComplete={handleEntranceComplete} />
      )}

      {/* Dashboard content — hidden until entrance completes */}
      <div
        ref={dashboardContentRef}
        className={`relative z-10 w-full flex flex-col items-center ${!entranceDone ? 'opacity-0 pointer-events-none' : ''}`}
      >
        {/* ── Navbar ── */}
        <div className={`dash-navbar w-full max-w-xl flex items-center justify-between mb-10 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-warm-gold/40 bg-deep-blue flex items-center justify-center">
              <img src="/assets/icons/mini-angel-wave.png" alt="avatar"
                className="pixel-render w-full h-full object-contain"
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
              />
              <span className="hidden text-sm">🌙</span>
            </div>
            <span className="font-pixel text-[0.5rem] text-soft-white/60 tracking-wide">{displayName}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="font-pixel text-[0.45rem] text-soft-white/25 hover:text-pixel-pink transition-colors tracking-widest cursor-pointer"
          >
            keluar
          </button>
        </div>

        {/* ── Greeting ── */}
        <div className={`dash-greeting text-center mb-10 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <h1 className="font-pixel text-[0.7rem] md:text-[0.85rem] text-warm-gold tracking-wide mb-3">
            {getGreeting(displayName)}
          </h1>
          <p className="font-sans text-base text-soft-white/40">
            mau ke mana dulu hari ini?
          </p>
        </div>

        {/* ── 2×3 Portal Grid ── */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
          {portals.map((p, i) => {
            const isSoon = COMING_SOON.has(p.id)
            return (
              <button
                key={p.id}
                onClick={() => handlePortal(p.id)}
                disabled={isSoon}
                className={`
                  dash-portal pixel-card flex flex-col items-center justify-center gap-2
                  p-5 md:p-6 text-center border-2 hover:shadow-lg transition-all duration-300
                  ${p.color}
                  ${isSoon ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: `${200 + i * 80}ms`, transitionProperty: 'opacity, transform, border-color, box-shadow' }}
              >
                <span className="text-2xl">{p.emoji}</span>
                <span className="font-pixel text-[0.5rem] text-warm-gold tracking-wide leading-snug">{p.label}</span>
                <span className="font-sans text-xs text-soft-white/40 leading-snug">{p.desc}</span>
                {isSoon && <span className="font-pixel text-[0.4rem] text-soft-white/25 tracking-widest mt-1">[ segera ]</span>}
              </button>
            )
          })}
        </div>

        {/* ── Back to landing (subtle) ── */}
        <button
          onClick={() => setPage('landing')}
          className={`mt-12 font-pixel text-[0.45rem] tracking-widest text-soft-white/15 hover:text-soft-white/40 transition-colors cursor-pointer ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '800ms' }}
        >
          &lt; halaman awal
        </button>

        {/* ── Surprise Me Button ── */}
        <button
          onClick={() => setShowWheel(true)}
          className={`mt-6 pixel-btn !text-[0.5rem] !py-2 !px-4 text-warm-gold border-warm-gold/30 ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '1000ms' }}
        >
          🎁 surprise me
        </button>
      </div>

      {/* Surprise Wheel Overlay */}
      {showWheel && (
        <SurpriseWheel
          onSelect={handleSurpriseSelect}
          onClose={() => setShowWheel(false)}
        />
      )}

      {/* Surprise Content Overlay */}
      {activeSurprise && (
        <SurpriseContent
          type={activeSurprise}
          onClose={handleCloseSurprise}
        />
      )}

      {/* Idle Notification */}
      {showIdleNotif && !activeSurprise && (
        <div className="fixed bottom-6 right-6 z-50 animate-float">
          <button
            onClick={() => {
              setShowIdleNotif(false)
              setShowWheel(true)
            }}
            className="pixel-card px-4 py-3 border-2 border-warm-gold/40 hover:border-warm-gold/80 transition-colors"
          >
            <span className="font-pixel text-xs text-warm-gold">🎁 ada sesuatu...</span>
            <span className="block text-xs text-soft-white/40 mt-1">ketuk untuk kejutan</span>
          </button>
        </div>
      )}

      {/* Debug: entrance type indicator (subtle) */}
      {entranceDone && entranceType && (
        <div className="fixed bottom-4 left-4 font-pixel text-[0.35rem] text-soft-white/15 tracking-wider select-none pointer-events-none z-0">
          entrance: {entranceType}
        </div>
      )}
    </section>
  )
}
