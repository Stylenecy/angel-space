import { useState, useRef, useEffect } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Menu from './pages/Menu'
import Capek from './pages/Mood/Capek'
import Overthinking from './pages/Mood/Overthinking'
import Baik from './pages/Mood/Baik'
import Random from './pages/Random'
import Memory from './pages/Memory'
import Portfolio from './pages/Portfolio'
import HiddenMessage from './pages/HiddenMessage'
import Feed from './pages/Feed'
import World from './pages/World'

function AppInner() {
  const { loading: authLoading } = useAuth()
  const [page, setPage] = useState('landing')
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [pinned, setPinned] = useState(false)
  const [popupPos, setPopupPos] = useState(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth - 226 : 0,
    y: 58,
  }))
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const posRef = useRef(popupPos)
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const buttonRef = useRef(null)
  const popupElRef = useRef(null)

  // Keep posRef in sync
  useEffect(() => { posRef.current = popupPos }, [popupPos])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const update = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    audio.addEventListener('timeupdate', update)
    audio.addEventListener('loadedmetadata', onMeta)
    return () => {
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('loadedmetadata', onMeta)
    }
  }, [isPlaying])

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const startFadeIn = () => {
    const audio = audioRef.current
    if (fadeRef.current) clearInterval(fadeRef.current)
    let vol = 0
    const step = 50
    const fadeDuration = 5000
    fadeRef.current = setInterval(() => {
      vol += step / fadeDuration
      if (vol >= 1) {
        vol = 1
        clearInterval(fadeRef.current)
      }
      audio.volume = vol
    }, step)
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      if (fadeRef.current) clearInterval(fadeRef.current)
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = 0
      audio.play().catch(() => {})
      setIsPlaying(true)
      setShowControls(true)
      startFadeIn()
    }
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
  }

  const handleVolume = (e) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setVolume(ratio)
    audio.volume = ratio
  }

  // Drag handlers for popup
  const handleDragStart = (e) => {
    if (!pinned) return
    e.preventDefault()
    setDragging(true)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    dragOffset.current = { x: clientX - posRef.current.x, y: clientY - posRef.current.y }
  }

  const handleDragMove = (e) => {
    if (!dragging) return
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setPopupPos({ x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y })
  }

  const handleDragEnd = () => {
    setDragging(false)
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove, { passive: false })
      window.addEventListener('touchend', handleDragEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [dragging])

  const togglePin = () => {
    if (pinned) {
      // Unpin: popup goes back to flex flow
      setPinned(false)
    } else {
      // Pin: capture current rendered position
      if (popupElRef.current) {
        const rect = popupElRef.current.getBoundingClientRect()
        setPopupPos({ x: rect.left, y: rect.top })
      }
      setPinned(true)
    }
  }

  const hideMusicBtn = page === 'landing' || page === 'hidden' || page === 'login'

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-midnight font-sans flex items-center justify-center">
        <p className="font-pixel text-[0.6rem] text-warm-gold animate-pixel-blink">
          loading...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-midnight font-sans overflow-x-hidden selection:bg-calm-blue/30 selection:text-soft-white relative">
      <audio ref={audioRef} loop preload="auto">
        <source src="/assets/music/background-music.mp3" type="audio/mpeg" />
      </audio>

      {!hideMusicBtn && (
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
          {/* Play button */}
          <button
            ref={buttonRef}
            onClick={toggleMusic}
            className="pixel-btn flex items-center gap-2 !bg-deep-blue/90 border-2 border-warm-gold/50 hover:border-warm-gold shadow-[3px_3px_0_0_#d4a853] !text-[0.65rem] !py-3 !px-4 text-warm-gold"
          >
            <span className="text-lg">{isPlaying ? '🔇' : '🎵'}</span>
            <span>{isPlaying ? 'playing... ♪' : 'play'}</span>
          </button>

          {/* Music popup */}
          {showControls && (
            <div
              ref={popupElRef}
              className={pinned ? '' : ''}
              style={pinned ? {
                position: 'fixed',
                top: popupPos.y,
                left: popupPos.x,
                cursor: dragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                zIndex: 60,
              } : {}}
              onMouseDown={pinned ? handleDragStart : undefined}
              onTouchStart={pinned ? handleDragStart : undefined}
            >
              <div className="bg-deep-blue/90 border-2 border-warm-gold/30 p-3 w-[210px] shadow-[3px_3px_0_0_#d4a853]">
                {/* Header: title + pin button */}
                <div className="flex items-center justify-between mb-2">
                  <p className="font-pixel text-[0.45rem] text-warm-gold leading-tight">♫ Pope Is A Rockstar</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePin() }}
                    className="font-pixel text-[0.5rem] text-soft-white/40 hover:text-warm-gold transition-colors cursor-pointer ml-2 shrink-0"
                    title={pinned ? 'unpin (dock to button)' : 'pin (free drag)'}
                  >
                    {pinned ? '📌' : '📍'}
                  </button>
                </div>

                {/* Progress bar — same style as volume */}
                <div
                  onClick={handleSeek}
                  className="w-full h-2 bg-midnight border border-warm-gold/30 cursor-pointer mb-1 relative group"
                >
                  <div
                    className="h-full bg-warm-gold relative transition-none"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-warm-gold rounded-sm border border-deep-blue group-hover:scale-125 transition-transform" />
                  </div>
                </div>
                <div className="flex justify-between font-pixel text-[0.35rem] text-soft-white/40 mb-3">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Volume bar */}
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[0.4rem] text-soft-white/50">🔊</span>
                  <div
                    onClick={handleVolume}
                    className="flex-1 h-2 bg-midnight border border-soft-white/20 cursor-pointer relative group"
                  >
                    <div
                      className="h-full bg-soft-white/60 relative"
                      style={{ width: `${volume * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-soft-white/60 rounded-sm border border-deep-blue group-hover:scale-125 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {page === 'landing'  && <Landing setPage={setPage} />}
      {page === 'hidden'   && <HiddenMessage setPage={setPage} />}
      {page === 'login'    && <Login setPage={setPage} />}
      {page === 'dashboard'&& <Dashboard setPage={setPage} />}
      {page === 'menu'         && <Menu setPage={setPage} />}
      {page === 'capek'        && <Capek setPage={setPage} />}
      {page === 'overthinking' && <Overthinking setPage={setPage} />}
      {page === 'baik'         && <Baik setPage={setPage} />}
      {page === 'random'       && <Random setPage={setPage} />}
      {page === 'memory'       && <Memory setPage={setPage} />}
      {page === 'portfolio'    && <Portfolio setPage={setPage} />}
      {page === 'feed'         && <Feed setPage={setPage} />}
      {page === 'world'        && <World setPage={setPage} />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
