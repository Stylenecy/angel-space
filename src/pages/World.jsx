import { useState, useRef } from 'react'
import WorldCanvas from '../components/world/WorldCanvas'

/**
 * World.jsx — Growtopia-style 2D tile world page.
 * Wraps WorldCanvas + handles room entry transitions.
 */
export default function World({ setPage }) {
  const [activeRoom, setActiveRoom] = useState(null)
  const [roomTransitioning, setRoomTransitioning] = useState(false)
  const [transitionOpacity, setTransitionOpacity] = useState(1)
  const containerRef = useRef(null)

  const handleEnterRoom = (room) => {
    if (roomTransitioning) return
    setRoomTransitioning(true)

    // CSS-based room entry transition
    setTransitionOpacity(0)
    setTimeout(() => {
      setActiveRoom(room)
      setTransitionOpacity(1)
      setTimeout(() => {
        setRoomTransitioning(false)
      }, 400)
    }, 300)
  }

  const handleBack = () => {
    if (activeRoom) {
      // Exit room
      setActiveRoom(null)
    } else {
      setPage('dashboard')
    }
  }

  // Room overlay handlers
  const handleRoomAction = (action) => {
    switch (action) {
      case 'mood': setPage('menu'); break
      case 'gallery': setPage('baik'); break
      case 'feed': setPage('feed'); break
      case 'surprise':
        // Trigger surprise
        break
      default:
        setActiveRoom(null)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        opacity: transitionOpacity,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* World */}
      <WorldCanvas onEnterRoom={handleEnterRoom} onBack={handleBack} />

      {/* Room overlay */}
      {activeRoom && !roomTransitioning && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-midnight/80 backdrop-blur-sm">
          <div className="bg-deep-blue border-3 border-warm-gold/40 rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="text-4xl mb-4">{activeRoom.emoji}</div>
            <h2 className="font-pixel text-sm text-warm-gold mb-2">
              {activeRoom.label}
            </h2>
            <p className="text-sm text-soft-white/50 mb-6">
              {activeRoom.id === 'mood' && 'hari ini kamu gimana?'}
              {activeRoom.id === 'gallery' && 'kenangan kita tersimpan di sini'}
              {activeRoom.id === 'feed' && 'apa yang terjadi hari ini?'}
              {activeRoom.id === 'faith' && '[ segera ]'}
              {activeRoom.id === 'hub' && 'kamu di rumah 🏠'}
              {activeRoom.id === 'surprise' && '🎁 sesuatu menunggumu...'}
            </p>

            <div className="flex gap-3 justify-center">
              {activeRoom.id !== 'hub' && activeRoom.id !== 'faith' && (
                <button
                  onClick={() => handleRoomAction(activeRoom.id)}
                  className="pixel-btn !text-[0.5rem] !py-2 !px-4"
                >
                  masuk →
                </button>
              )}
              <button
                onClick={() => setActiveRoom(null)}
                className="pixel-btn !text-[0.5rem] !py-2 !px-4 !bg-transparent border-soft-white/20 text-soft-white/50"
              >
                kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
