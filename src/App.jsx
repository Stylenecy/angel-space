import { useState } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'

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

  const toggleMusic = () => {
    const audio = document.getElementById('bg-music')
    if (isPlaying) audio.pause()
    else audio.play().catch(() => {})
    setIsPlaying(!isPlaying)
  }

  // Pages yang tidak perlu musik button (full-screen experiences)
  const hideMusicBtn = page === 'landing' || page === 'hidden' || page === 'login'

  // Auth loading screen
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
      <audio id="bg-music" loop preload="auto">
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

      {/* ── Public pages ── */}
      {page === 'landing'  && <Landing setPage={setPage} />}
      {page === 'hidden'   && <HiddenMessage setPage={setPage} />}
      {page === 'login'    && <Login setPage={setPage} />}

      {/* ── Mood / guest pages (no auth required for Phase 0) ── */}
      {page === 'menu'         && <Menu setPage={setPage} />}
      {page === 'capek'        && <Capek setPage={setPage} />}
      {page === 'overthinking' && <Overthinking setPage={setPage} />}
      {page === 'baik'         && <Baik setPage={setPage} />}
      {page === 'random'       && <Random setPage={setPage} />}
      {page === 'memory'       && <Memory setPage={setPage} />}
      {page === 'portfolio'    && <Portfolio setPage={setPage} />}
      {page === 'feed'         && <Feed setPage={setPage} />}
      {page === 'world'        && <World setPage={setPage} />}

      {/* ── Protected pages (require login) ── */}
      {page === 'dashboard' && (
        <ProtectedRoute fallback={<Login setPage={setPage} />}>
          <Dashboard setPage={setPage} />
        </ProtectedRoute>
      )}
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
