import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── Live WebGL ambience ──────────────────────────────────────────────
// A soft, drifting field of glowing motes that sits BEHIND everything
// (StarField's crisp pixel-stars still render on top). Adds depth + a
// "living" feel without touching the pixel-art UI. Mobile-friendly:
// capped DPR + particle count, pauses when the tab is hidden, and
// honours prefers-reduced-motion.

// Soft round sprite (radial gradient) so each point glows instead of being a square.
function makeGlowTexture() {
  const size = 64
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.65)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.18)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Warm, romantic palette tuned to the midnight/gold aesthetic.
const PALETTE = [
  [0.831, 0.659, 0.325], // warm-gold  #d4a853
  [0.909, 0.878, 0.831], // soft-white #e8e0d4
  [0.498, 0.604, 0.851], // calm-blue  #7f9ad9
  [0.929, 0.580, 0.690], // pixel-pink #ed94b0
]

export default function LiveBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Bail gracefully if WebGL is unavailable.
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
    } catch {
      return
    }

    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    renderer.setPixelRatio(dpr)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 28

    const texture = makeGlowTexture()

    // Two parallax layers — far (small/dim) and near (large/bright).
    const layers = []
    const buildLayer = ({ count, spread, size, opacity, z }) => {
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread
        positions[i * 3 + 2] = z + (Math.random() - 0.5) * 10
        const col = PALETTE[(Math.random() * PALETTE.length) | 0]
        colors[i * 3] = col[0]; colors[i * 3 + 1] = col[1]; colors[i * 3 + 2] = col[2]
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      const mat = new THREE.PointsMaterial({
        size, map: texture, vertexColors: true, transparent: true,
        opacity, depthWrite: false, blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
      const points = new THREE.Points(geo, mat)
      scene.add(points)
      layers.push({ points, geo, mat })
    }

    const scale = isMobile ? 0.5 : 1
    buildLayer({ count: Math.round(420 * scale), spread: 70, size: 0.55, opacity: 0.5, z: -10 })
    buildLayer({ count: Math.round(160 * scale), spread: 55, size: 1.4, opacity: 0.75, z: 6 })

    // Gentle pointer / device-orientation parallax.
    const target = { x: 0, y: 0 }
    const onPointer = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const onOrient = (e) => {
      if (e.gamma == null) return
      target.x = Math.max(-1, Math.min(1, e.gamma / 45))
      target.y = Math.max(-1, Math.min(1, (e.beta || 0) / 45))
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('deviceorientation', onOrient, { passive: true })

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let raf
    let t = 0
    const speed = reduced ? 0 : 1
    const render = () => {
      t += 0.0016 * speed
      // Ease camera toward the parallax target.
      camera.position.x += (target.x * 3 - camera.position.x) * 0.03
      camera.position.y += (-target.y * 3 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)
      layers[0].points.rotation.z = t * 0.4
      layers[1].points.rotation.z = -t * 0.25
      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    const start = () => { if (!raf) raf = requestAnimationFrame(render) }
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = null } }
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    start()

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('deviceorientation', onOrient)
      window.removeEventListener('resize', onResize)
      layers.forEach(({ geo, mat }) => { geo.dispose(); mat.dispose() })
      texture.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
