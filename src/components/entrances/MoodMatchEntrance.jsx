import { useEffect, useRef, useState } from 'react'
import { animate, stagger, createTimeline } from 'animejs'
import { getTimeMood } from './entrancePicker'

/**
 * Mood Match Entrance — Full-screen gradient sweep by time of day.
 */
const MOOD_CONFIG = {
  sunrise: {
    gradient: 'linear-gradient(180deg, #ff9a76 0%, #fbd786 30%, #111b3d 70%, #0a0e27 100%)',
    greeting: 'pagi yang baru ✨',
    color: '#ff9a76',
    emoji: '🌅',
  },
  morning: {
    gradient: 'linear-gradient(180deg, #d4a853 0%, #4a7cc9 50%, #0a0e27 100%)',
    greeting: 'semangat hari ini ☀️',
    color: '#d4a853',
    emoji: '☀️',
  },
  afternoon: {
    gradient: 'linear-gradient(180deg, #4a7cc9 0%, #7b5ea7 40%, #0a0e27 100%)',
    greeting: 'lanjut terus 💙',
    color: '#4a7cc9',
    emoji: '🌤️',
  },
  evening: {
    gradient: 'linear-gradient(180deg, #7b5ea7 0%, #111b3d 60%, #0a0e27 100%)',
    greeting: 'sore yang tenang 💜',
    color: '#7b5ea7',
    emoji: '🌇',
  },
  night: {
    gradient: 'linear-gradient(180deg, #0a0e27 0%, #111b3d 50%, #0a0e27 100%)',
    greeting: 'malam yang hangat 🌙',
    color: '#d4a853',
    emoji: '🌙',
  },
}

export default function MoodMatchEntrance({ onComplete }) {
  const containerRef = useRef(null)
  const starRefs = useRef([])
  const mood = getTimeMood()
  const config = MOOD_CONFIG[mood]
  const starCount = mood === 'night' ? 30 : 8

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // SAFETY: Force onComplete after 4.5s
    let completed = false
    const safetyTimeout = setTimeout(() => {
      if (!completed) {
        completed = true
        onComplete?.()
      }
    }, 4500)

    const triggerComplete = () => {
      if (!completed) {
        completed = true
        clearTimeout(safetyTimeout)
        onComplete?.()
      }
    }

    const bgEl = container.querySelector('.moodmatch-bg')
    const emojiEl = container.querySelector('.moodmatch-emoji')
    const textEl = container.querySelector('.moodmatch-text')
    const starEls = starRefs.current.filter(Boolean)

    const tl = createTimeline({
      complete: triggerComplete
    })

    // Phase 1: Gradient sweeps in
    tl.add(bgEl, {
      opacity: [0, 1],
      duration: 800,
      easing: 'easeInOutSine'
    })

    // Phase 2: Stars appear (staggered)
    if (starEls.length > 0) {
      starEls.forEach((el) => {
        tl.add(el, {
          opacity: [0, 0.7],
          scale: [0, 1],
          duration: 400,
          easing: 'easeOutQuad',
        }, '-=600')
      })
    }

    // Phase 3: Emoji scales in with elastic bounce
    tl.add(emojiEl, {
      opacity: [0, 1],
      scale: [0.2, 1.1, 1],
      duration: 600,
      easing: 'easeOutElastic(1, .5)'
    }, '-=300')

    // Phase 4: Greeting text slides up
    tl.add(textEl, {
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 500,
      easing: 'easeOutExpo'
    }, '-=300')

    // Phase 5: Hold... then fade everything out
    tl.add([bgEl, emojiEl, textEl, ...starEls], {
      opacity: 0,
      duration: 500,
      easing: 'easeOutQuad',
    }, '+=600')

    return () => {
      clearTimeout(safetyTimeout)
    }
  }, [mood, starCount])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Full-screen gradient */}
      <div className="moodmatch-bg absolute inset-0"
        style={{ background: config.gradient, opacity: 0 }}
      />

      {/* Stars */}
      {Array.from({ length: starCount }, (_, i) => (
        <div
          key={i}
          ref={(el) => { starRefs.current[i] = el }}
          className="absolute w-1 h-1 bg-soft-white"
          style={{
            left: `${5 + (i % 6) * 18}%`,
            top: `${5 + Math.floor(i / 6) * 20}%`,
            opacity: 0, transform: 'scale(0)',
          }}
        />
      ))}

      {/* Big emoji */}
      <div className="moodmatch-emoji relative z-10 text-7xl"
        style={{ opacity: 0, transform: 'scale(0.2)' }}
      >
        {config.emoji}
      </div>

      {/* Greeting text */}
      <div className="moodmatch-text absolute z-10 text-center"
        style={{ top: '68%', opacity: 0 }}
      >
        <p className="font-pixel text-sm md:text-base" style={{ color: config.color }}>
          {config.greeting}
        </p>
      </div>
    </div>
  )
}
