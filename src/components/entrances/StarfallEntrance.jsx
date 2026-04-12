import { useEffect, useRef, useState } from 'react'
import { animate, stagger, createTimeline, random } from 'animejs'

/**
 * Starfall Entrance — DRAMATIC meteor shower.
 * Properly uses anime.js v4 with DOM element references.
 * Screen goes dark → meteors rain → flash → explode → reveal.
 */
export default function StarfallEntrance({ onComplete }) {
  const containerRef = useRef(null)
  const meteorRefs = useRef([])
  const [meteors] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: 6 + Math.floor(Math.random() * 12),
      left: Math.random() * 100,
      drift: -60 + Math.random() * 120,
    }))
  )

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

    const darkEl = container.querySelector('.starfall-dark')
    const flashEl = container.querySelector('.starfall-flash')

    // Get all meteor DOM elements
    const meteorEls = meteorRefs.current.filter(Boolean)

    const tl = createTimeline({
      complete: triggerComplete
    })

    // Phase 1: Darken screen
    tl.add(darkEl, {
      opacity: [0, 0.92],
      duration: 500,
      easing: 'easeOutQuad'
    })

    // Phase 2: METEOR SHOWER
    meteorEls.forEach((el, i) => {
      tl.add(el, {
        translateY: [0, window.innerHeight + 200],
        translateX: [0, meteors[i].drift],
        rotate: [0, random(-180, 180)],
        opacity: [0, 1, 0.9, 0],
        duration: 1200 + Math.random() * 400,
        easing: 'easeInQuad',
      }, 400 + i * 80)
    })

    // Phase 3: Center flash
    tl.add(flashEl, {
      opacity: [0, 0.8],
      scale: [0.3, 1.5],
      duration: 400,
      easing: 'easeOutExpo'
    }, 2800)

    tl.add(flashEl, {
      opacity: [0.8, 0],
      scale: [1.5, 3],
      duration: 300,
      easing: 'easeOutExpo'
    }, 3200)

    // Phase 4: Meteors explode outward
    meteorEls.forEach((el, i) => {
      tl.add(el, {
        translateX: () => random(-200, 200),
        translateY: () => random(-200, 200),
        scale: [1, 0],
        opacity: [0.7, 0],
        duration: 500,
        easing: 'easeOutExpo',
      }, 3400)
    })

    // Phase 5: Dark overlay fades out → reveal page
    tl.add(darkEl, {
      opacity: [0.92, 0],
      duration: 600,
      easing: 'easeOutQuad'
    }, 3500)

    return () => {
      clearTimeout(safetyTimeout)
    }
  }, [meteors, onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Dark overlay */}
      <div className="starfall-dark absolute inset-0 bg-midnight" style={{ opacity: 0 }} />

      {/* Center flash */}
      <div className="starfall-flash absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
        <div className="w-32 h-32 rounded-full bg-warm-gold"
          style={{ boxShadow: '0 0 100px 50px rgba(212,168,83,0.6)' }}
        />
      </div>

      {/* Meteors */}
      {meteors.map((m, i) => (
        <div
          key={m.id}
          ref={(el) => { meteorRefs.current[i] = el }}
          className="absolute"
          style={{
            width: m.size,
            height: m.size,
            left: `${m.left}%`,
            top: '-20px',
            background: '#d4a853',
            boxShadow: `0 0 ${m.size * 2}px rgba(212,168,83,0.6)`,
            imageRendering: 'pixelated',
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}
