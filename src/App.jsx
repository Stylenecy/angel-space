import { useState, useRef } from 'react'
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
  const audioRef = useRef(null)

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = 0
      audio.play().catch(() => {})
      setIsPlaying(true)
      // 3s fade-in
      let vol = 0
      const step = 50
      const fade = setInterval(() => {
        vol += step / 3000
        if (vol >= 1) {
          vol = 1
          clearInterval(fade)
        }
        audio.volume = vol
      }, step)
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
        <button
          onClick={toggleMusic}
          className="fixed top-4 right-4 z-50 pixel-btn flex items-center gap-2 !bg-deep-blue/90 border-2 border-warm-gold/50 hover:border-warm-gold shadow-[3px_3px_0_0_#d4a853] !text-[0.65rem] !py-3 !px-4 text-warm-gold"
        >
          <span className="text-lg">{isPlaying ? '🔇' : '🎵'}</span>
          <span>{isPlaying ? 'stop' : 'play'}</span>
        </button>
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
