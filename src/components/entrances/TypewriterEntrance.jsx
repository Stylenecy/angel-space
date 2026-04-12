import { useEffect, useRef, useState, useCallback } from 'react'
import Typewriter from '../../components/Typewriter'
import { animate, createTimeline, random } from 'animejs'

/**
 * Typewriter Entrance — DRAMATIC. Pitch black → "kamu di sini..." → light BURSTS from center.
 */
export default function TypewriterEntrance({ onComplete }) {
  const [phase, setPhase] = useState('typing')
  const containerRef = useRef(null)
  const completedRef = useRef(false)

  const triggerComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    setPhase('reveal')

    const container = containerRef.current
    if (!container) return

    const darkEl = container.querySelector('.type-dark')
    const lightEl = container.querySelector('.type-light')
    const textEl = container.querySelector('.type-text')

    // Light burst animation via anime.js
    createTimeline({
      complete: () => onComplete?.(),
    })
      .add(lightEl, {
        opacity: [0, 1],
        scale: [0, 15],
        duration: 800,
        easing: 'easeOutExpo',
      })
      .add(darkEl, {
        opacity: [1, 0],
        duration: 500,
        easing: 'easeOutQuad',
      }, '-=400')
      .add(textEl, {
        opacity: [1, 0],
        translateY: [0, -10],
        duration: 300,
        easing: 'easeOutQuad',
      }, '-=500')
  }, [onComplete])

  // SAFETY: If Typewriter doesn't complete in 3s, force it
  useEffect(() => {
    const fallback = setTimeout(() => {
      triggerComplete()
    }, 3000)
    return () => clearTimeout(fallback)
  }, [triggerComplete])

  const handleTypingComplete = () => {
    triggerComplete()
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Full dark overlay */}
      <div className="type-dark absolute inset-0 bg-midnight" style={{ opacity: 1 }} />

      {/* Light burst */}
      <div className="type-light absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div className="rounded-full"
          style={{
            width: 10, height: 10,
            background: 'radial-gradient(circle, #d4a853 0%, rgba(212,168,83,0.5) 30%, rgba(74,124,201,0.2) 60%, transparent 80%)',
            boxShadow: '0 0 40px 15px rgba(212,168,83,0.6)',
          }}
        />
      </div>

      {/* Vignette */}
      {phase === 'typing' && (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(10,14,39,0.7) 60%, rgba(10,14,39,0.95) 100%)',
          }}
        />
      )}

      {/* Typewriter text */}
      <div className="type-text relative z-10 text-center px-6">
        <Typewriter
          text="kamu di sini..."
          speed={150}
          onComplete={handleTypingComplete}
          className="font-pixel text-lg md:text-xl text-warm-gold"
        />
        <p className="mt-3 text-sm" style={{ color: 'rgba(240,240,245,0.3)' }}>
          selamat datang kembali 🌙
        </p>
      </div>
    </div>
  )
}
