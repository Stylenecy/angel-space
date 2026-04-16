import { useEffect, useState } from 'react'

const LINES = [
  { text: '> ANGEL\'S SPACE OS — build 2025.04', delay: 150 },
  { text: '> scanning memories...         OK', delay: 700 },
  { text: '> found: 1,247 moments ✓',         delay: 1250 },
  { text: '> loading heartbeat...',            delay: 1750 },
  { text: '> connection: stable ♥',            delay: 2300 },
  { text: '> ready_',                          delay: 2850 },
]

const PROGRESS_START  = 2900  // ms — when bar starts filling
const PROGRESS_FILL   = 700   // ms — bar fill duration
const FADE_START      = 3800  // ms — when whole screen fades
const DONE_AT         = 4500  // ms — call onComplete

export default function CinematicEntrance({ onComplete }) {
  const [visible, setVisible] = useState([])      // indices of revealed lines
  const [progress, setProgress] = useState(0)     // 0-1
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timers = []

    // Reveal each line
    LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisible(prev => [...prev, i])
      }, line.delay))
    })

    // Progress bar fill
    timers.push(setTimeout(() => {
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / PROGRESS_FILL)
        setProgress(t)
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, PROGRESS_START))

    // Fade out
    timers.push(setTimeout(() => setFading(true), FADE_START))

    // Signal done
    timers.push(setTimeout(() => onComplete?.(), DONE_AT))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const filled   = Math.floor(progress * 20)
  const bar      = '█'.repeat(filled) + '░'.repeat(20 - filled)
  const pct      = Math.round(progress * 100)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-start justify-center px-8 md:px-20"
      style={{
        background: '#0a0e27',
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.7s ease-in-out' : 'none',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
          zIndex: 1,
        }}
      />

      {/* Boot text */}
      <div className="relative z-10 space-y-2">
        {LINES.map((line, i) => (
          <div
            key={i}
            className="font-pixel text-[0.55rem] md:text-[0.65rem] tracking-wider leading-loose"
            style={{
              color: i === 0 ? '#d4a853' : '#38b764',
              opacity: visible.includes(i) ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            {line.text}
          </div>
        ))}

        {/* Progress bar — appears after last line */}
        {visible.length === LINES.length && (
          <div
            className="font-pixel text-[0.55rem] md:text-[0.65rem] tracking-wider leading-loose mt-4"
            style={{ color: '#d4a853' }}
          >
            {'> '}[{bar}] {pct}%
          </div>
        )}
      </div>

      {/* Subtle vignette corners */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)',
          zIndex: 2,
        }}
      />
    </div>
  )
}
