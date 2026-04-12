import { useEffect, useRef } from 'react'
import { createTimeline } from 'animejs'

/**
 * Portal Entrance — DRAMATIC concentric portal rings.
 * Proper anime.js v4 with DOM element references.
 */
export default function PortalEntrance({ onComplete }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // SAFETY: Force onComplete after 5s
    let completed = false
    const safetyTimeout = setTimeout(() => {
      if (!completed) {
        completed = true
        onComplete?.()
      }
    }, 5000)

    const triggerComplete = () => {
      if (!completed) {
        completed = true
        clearTimeout(safetyTimeout)
        onComplete?.()
      }
    }

    const darkEl = container.querySelector('.portal-dark')
    const ring1 = container.querySelector('.portal-ring-1')
    const ring2 = container.querySelector('.portal-ring-2')
    const ring3 = container.querySelector('.portal-ring-3')
    const fillEl = container.querySelector('.portal-fill')
    const centerEl = container.querySelector('.portal-center')

    const tl = createTimeline({
      complete: triggerComplete
    })

    // Phase 1: Screen darkens
    tl.add(darkEl, {
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutQuad'
    })

    // Phase 2: Center point appears
    tl.add(centerEl, {
      opacity: [0, 1],
      scale: [0, 1],
      duration: 400,
      easing: 'easeOutElastic(1, .5)'
    }, '-=100')

    // Phase 3: Ring 1 expands (big outer)
    tl.add(ring1, {
      opacity: [0, 1],
      scale: [0, 1],
      duration: 700,
      easing: 'easeOutElastic(1, .5)'
    }, '-=100')

    // Phase 4: Ring 2 (middle)
    tl.add(ring2, {
      opacity: [0, 0.9],
      scale: [0, 1],
      duration: 500,
      easing: 'easeOutElastic(1, .4)'
    }, '-=300')

    // Phase 5: Ring 3 (inner)
    tl.add(ring3, {
      opacity: [0, 0.8],
      scale: [0, 1],
      duration: 400,
      easing: 'easeOutElastic(1, .3)'
    }, '-=200')

    // Phase 6: Portal fills with light
    tl.add(fillEl, {
      opacity: [0, 0.8],
      scale: [0.5, 1],
      duration: 600,
      easing: 'easeInOutSine'
    }, '-=100')

    // Phase 7: PORTAL BREATHES — pulse
    tl.add([ring1, ring2, ring3, fillEl], {
      scale: [1, 1.08, 0.96, 1.02, 1],
      duration: 600,
      easing: 'easeInOutSine'
    })

    // Phase 8: EXPLOSION — everything expands to fill screen
    tl.add([ring1, ring2, ring3], {
      scale: [1, 10],
      opacity: [1, 0],
      duration: 500,
      easing: 'easeOutExpo'
    })

    tl.add(fillEl, {
      scale: [1, 12],
      opacity: [0.8, 0],
      duration: 500,
      easing: 'easeOutExpo'
    }, '-=400')

    tl.add(centerEl, {
      scale: [1, 15],
      opacity: [1, 0],
      duration: 400,
      easing: 'easeOutExpo'
    }, '-=350')

    // Phase 9: Dark overlay fades to reveal
    tl.add(darkEl, {
      opacity: [1, 0],
      duration: 500,
      easing: 'easeOutQuad'
    }, '-=300')

    return () => {
      clearTimeout(safetyTimeout)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Full dark overlay */}
      <div className="portal-dark absolute inset-0 bg-midnight" style={{ opacity: 0 }} />

      {/* Portal rings */}
      <div className="portal-ring-1 absolute rounded-full"
        style={{
          width: 300, height: 300,
          border: '4px solid #d4a853',
          boxShadow: '0 0 30px rgba(212,168,83,0.4), inset 0 0 20px rgba(212,168,83,0.1)',
          opacity: 0, transform: 'scale(0)',
        }}
      />
      <div className="portal-ring-2 absolute rounded-full"
        style={{
          width: 200, height: 200,
          border: '3px solid #4a7cc9',
          boxShadow: '0 0 20px rgba(74,124,201,0.3), inset 0 0 15px rgba(74,124,201,0.1)',
          opacity: 0, transform: 'scale(0)',
        }}
      />
      <div className="portal-ring-3 absolute rounded-full"
        style={{
          width: 120, height: 120,
          border: '2px solid #7b5ea7',
          boxShadow: '0 0 15px rgba(123,94,167,0.3), inset 0 0 10px rgba(123,94,167,0.1)',
          opacity: 0, transform: 'scale(0)',
        }}
      />

      {/* Portal fill (center glow) */}
      <div className="portal-fill absolute rounded-full"
        style={{
          width: 100, height: 100,
          background: 'radial-gradient(circle, rgba(212,168,83,0.8) 0%, rgba(74,124,201,0.4) 40%, transparent 70%)',
          boxShadow: '0 0 60px 20px rgba(212,168,83,0.5)',
          opacity: 0, transform: 'scale(0.5)',
        }}
      />

      {/* Center point */}
      <div className="portal-center absolute rounded-full w-4 h-4 bg-warm-gold"
        style={{
          boxShadow: '0 0 20px 10px rgba(212,168,83,0.8)',
          opacity: 0, transform: 'scale(0)',
        }}
      />
    </div>
  )
}
