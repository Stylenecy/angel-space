import { useEffect, useRef, useState } from 'react'
import { animate, stagger, createTimeline, random } from 'animejs'

/**
 * Secret Heart Entrance — ULTRA RARE (10% chance).
 * Growtopia Growganoth level drama. Proper anime.js v4.
 */
export default function SecretHeartEntrance({ onComplete }) {
  const containerRef = useRef(null)
  const particleRefs = useRef([])

  const particles = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
      size: 2 + Math.random() * 5,
      color: i % 2 === 0 ? '#e8798b' : '#d4a853',
    }))
  )[0]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // SAFETY: Force onComplete after 6s (longer for drama!)
    let completed = false
    const safetyTimeout = setTimeout(() => {
      if (!completed) {
        completed = true
        onComplete?.()
      }
    }, 6000)

    const triggerComplete = () => {
      if (!completed) {
        completed = true
        clearTimeout(safetyTimeout)
        onComplete?.()
      }
    }

    const darkEl = container.querySelector('.secretheart-dark')
    const heartEl = container.querySelector('.secretheart-heart')
    const glowEl = container.querySelector('.secretheart-glow')
    const msgEl = container.querySelector('.secretheart-msg')
    const particleEls = particleRefs.current.filter(Boolean)

    const tl = createTimeline({
      complete: triggerComplete
    })

    // Phase 1: Screen pitch black
    tl.add(darkEl, {
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutQuad'
    })

    // Phase 2: GLITCH — screen shakes
    tl.add(darkEl, {
      translateX: [0, -10, 8, -6, 4, -3, 2, -1, 0],
      duration: 400,
      easing: 'easeInOutSine'
    })

    // Phase 3: HEART MATERIALIZES — grows from nothing with elastic bounce
    tl.add(heartEl, {
      opacity: [0, 1],
      scale: [0, 1],
      duration: 700,
      easing: 'easeOutElastic(1, .4)'
    }, '-=100')

    // Phase 4: HEARTBEAT — thump thump
    tl.add(heartEl, {
      scale: [1, 1.2, 1.1, 1.25, 1.15, 1.1],
      duration: 600,
      easing: 'easeInOutSine'
    })

    // Phase 5: Glow expands from heart
    tl.add(glowEl, {
      opacity: [0, 0.7],
      scale: [0, 1],
      duration: 500,
      easing: 'easeOutExpo'
    }, '-=300')

    // Phase 6: PARTICLE BURST — 50 particles explode outward
    particleEls.forEach((el) => {
      tl.add(el, {
        translateX: [0, random(-250, 250)],
        translateY: [0, random(-250, 250)],
        scale: [0, random(0.5, 2.5)],
        opacity: [1, 0],
        duration: 800,
        easing: 'easeOutExpo',
      }, '-=300')
    })

    // Phase 7: Screen fills with warm pink
    tl.add(darkEl, {
      opacity: [1, 0.25],
      duration: 800,
      easing: 'easeOutExpo'
    }, '-=400')

    // Phase 8: Secret message appears
    tl.add(msgEl, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing: 'easeOutExpo'
    }, '-=400')

    // Hold message for a moment, then...
    // Phase 9: Everything fades → reveal page
    tl.add([darkEl, heartEl, glowEl, msgEl], {
      opacity: 0,
      duration: 600,
      easing: 'easeOutQuad',
    }, '+=800')

    return () => {
      clearTimeout(safetyTimeout)
    }
  }, [particles])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Dark overlay */}
      <div className="secretheart-dark absolute inset-0 bg-midnight" style={{ opacity: 0 }} />

      {/* Heart shape (CSS pixel art) */}
      <div className="secretheart-heart absolute flex items-center justify-center"
        style={{ width: 60, height: 60, opacity: 0, transform: 'scale(0)' }}
      >
        <div style={{ position: 'relative', width: 48, height: 48 }}>
          <div style={{ position: 'absolute', width: 18, height: 18, background: '#e8798b', top: 0, left: 0 }} />
          <div style={{ position: 'absolute', width: 18, height: 18, background: '#e8798b', top: 0, right: 0 }} />
          <div style={{ position: 'absolute', width: 48, height: 12, background: '#e8798b', top: 14, left: 0 }} />
          <div style={{ position: 'absolute', width: 36, height: 12, background: '#e8798b', top: 26, left: 6 }} />
          <div style={{ position: 'absolute', width: 24, height: 10, background: '#e8798b', top: 38, left: 12 }} />
        </div>
      </div>

      {/* Glow behind heart */}
      <div className="secretheart-glow absolute rounded-full"
        style={{
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(232,121,139,0.5) 0%, rgba(212,168,83,0.2) 40%, transparent 70%)',
          boxShadow: '0 0 80px 30px rgba(232,121,139,0.3)',
          opacity: 0, transform: 'scale(0)',
        }}
      />

      {/* Secret message */}
      <div className="secretheart-msg absolute text-center px-6" style={{ top: '72%', opacity: 0 }}>
        <p className="font-pixel text-xs text-pixel-pink tracking-wider">
          💛 RARE: 1 in 10 💛
        </p>
        <p className="text-sm mt-2" style={{ color: 'rgba(240,240,245,0.5)' }}>
          kamu spesial. nggak semua orang bisa lihat ini.
        </p>
      </div>

      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => { particleRefs.current[i] = el }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            left: '50%',
            top: '50%',
            imageRendering: 'pixelated',
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}
