import { useEffect, useRef } from 'react'

const PALETTE = ['#d4a853', '#e8798b', '#4a7cc9', '#38b764', '#7b5ea7', '#f0f0f5']
const SPAWN_INTERVAL_MS = 22
const LIFETIME_MS = 700

export default function PixelTrailCursor() {
  const containerRef = useRef(null)
  const lastSpawnRef = useRef(0)

  useEffect(() => {
    // Only on real pointer devices — skip touch-only screens
    if (window.matchMedia('(pointer: coarse)').matches) return

    const container = containerRef.current
    if (!container) return

    const spawn = (clientX, clientY) => {
      const now = performance.now()
      if (now - lastSpawnRef.current < SPAWN_INTERVAL_MS) return
      lastSpawnRef.current = now

      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      const size = Math.random() > 0.55 ? 6 : 4
      const ox = clientX + (Math.random() - 0.5) * 10 - size / 2
      const oy = clientY + (Math.random() - 0.5) * 10 - size / 2
      const vx = (Math.random() - 0.5) * 70   // horizontal drift px/s
      const vy = Math.random() * 55 + 25       // downward drift px/s

      const el = document.createElement('div')
      Object.assign(el.style, {
        position: 'fixed',
        width:  size + 'px',
        height: size + 'px',
        background: color,
        left: ox + 'px',
        top:  oy + 'px',
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        zIndex: '9997',
        willChange: 'transform, opacity',
      })
      container.appendChild(el)

      const startTime = performance.now()
      const tick = (now) => {
        const elapsed = now - startTime
        const t = elapsed / LIFETIME_MS
        if (t >= 1) { el.remove(); return }
        el.style.left = ox + vx * (elapsed / 1000) + 'px'
        el.style.top  = oy + vy * (elapsed / 1000) + 'px'
        el.style.opacity = String(1 - t * t)   // quadratic ease-out
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const onMove = (e) => spawn(e.clientX, e.clientY)
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9997, overflow: 'hidden' }}
    />
  )
}
