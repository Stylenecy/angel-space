import { useState, useRef } from 'react'
import { animate, stagger, createTimeline, random } from 'animejs'

/**
 * Surprise types available in the wheel.
 * Each type maps to a content renderer in SurpriseContent.
 */
export const SURPRISE_TYPES = [
  { id: 'poem', label: '💌 Puis Rahasia', emoji: '💌' },
  { id: 'memory', label: '📸 Kenangan Random', emoji: '📸' },
  { id: 'message', label: '💬 Pesan Dex', emoji: '💬' },
  { id: 'minigame', label: '⭐ Mini Game', emoji: '⭐' },
  { id: 'fortune', label: '🥠 Fortune Cookie', emoji: '🥠' },
]

/**
 * SurpriseWheel — spin wheel UI for manual surprise trigger.
 */
export default function SurpriseWheel({ onSelect, onClose }) {
  const [spinning, setSpinning] = useState(false)
  const wheelRef = useRef(null)

  const spin = () => {
    if (spinning) return
    setSpinning(true)

    const randomIndex = random(0, SURPRISE_TYPES.length - 1)
    const selectedItem = SURPRISE_TYPES[randomIndex]

    // Spin animation
    if (wheelRef.current) {
      createTimeline({ easing: 'easeOutExpo' })
        .add({
          targets: '.surprise-wheel-item',
          rotate: [0, random(720, 1440)],
          scale: [1, 0.9, 1.1, 1],
          duration: 2000,
          easing: 'easeInOutQuad',
        })
        .add({
          targets: `.surprise-item-${randomIndex}`,
          scale: [1, 1.3, 1.15],
          opacity: [0.5, 1],
          duration: 600,
          easing: 'easeOutElastic(1, .5)',
          complete: () => {
            setSpinning(false)
            setTimeout(() => onSelect(selectedItem), 400)
          }
        })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 backdrop-blur-sm">
      <div className="relative bg-deep-blue border-3 border-warm-gold/40 rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-soft-white/30 hover:text-pixel-pink transition-colors font-pixel text-xs"
        >
          ✕
        </button>

        <h2 className="font-pixel text-sm text-warm-gold text-center mb-6">
          🎁 Surprise Me
        </h2>

        {/* Wheel */}
        <div ref={wheelRef} className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          {SURPRISE_TYPES.map((item, i) => (
            <div
              key={item.id}
              className={`surprise-wheel-item surprise-item-${i} w-14 h-14 flex items-center justify-center text-2xl bg-midnight border-2 border-soft-white/20 rounded-lg cursor-pointer transition-colors hover:border-warm-gold/60`}
            >
              {item.emoji}
            </div>
          ))}
        </div>

        {/* Spin button */}
        <button
          onClick={spin}
          disabled={spinning}
          className={`pixel-btn w-full ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {spinning ? 'spinning...' : '🎰 putar!'}
        </button>

        <p className="text-center text-xs text-soft-white/30 mt-3">
          atau biarkan saja... kejutan datang sendiri ⏳
        </p>
      </div>
    </div>
  )
}
