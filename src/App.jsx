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
  const audioRef = useRef(null)
  const fadeRef = useRef(null)

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
    const ratio = (e.clientX - rect.left) / rect.width
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
        <>
          <button
            onClick={toggleMusic}
            className="fixed top-4 right-4 z-50 pixel-btn flex items-center gap-2 !bg-deep-blue/90 border-2 border-warm-gold/50 hover:border-warm-gold shadow-[3px_3px_0_0_#d4a853] !text-[0.65rem] !py-3 !px-4 text-warm-gold"
          >
            <span className="text-lg">{isPlaying ? '🔇' : '🎵'}</span>
            <span>{isPlaying ? 'stop' : 'play'}</span>
          </button>

          {showControls && (
            <div className="fixed top-4 left-4 z-50 bg-deep-blue/90 border-2 border-warm-gold/30 p-4 min-w-[240px] shadow-[3px_3px_0_0_#d4a853]">
              <p className="font-pixel text-[0.5rem] text-warm-gold mb-2">🎵 Pope Is A Rockstar</p>

              {/* Progress bar */}
              <div
                onClick={handleSeek}
                className="w-full h-2 bg-midnight border border-warm-gold/30 cursor-pointer mb-1"
              >
                <div
                  className="h-full bg-warm-gold"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
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
                  className="flex-1 h-1.5 bg-midnight border border-soft-white/20 cursor-pointer"
                >
                  <div
                    className="h-full bg-soft-white/60"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </>
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
