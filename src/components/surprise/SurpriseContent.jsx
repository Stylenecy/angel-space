import { useEffect, useState } from 'react'
import { createTimeline, stagger } from 'animejs'
import Typewriter from '../../components/Typewriter'
import { memories } from '../../data/memories'

/**
 * Surprise content renderer — shows different content based on surprise type.
 */

const POEMS = [
  "di antara bintang yang tak terlihat,\naku tetap di sini,\nmenunggu kamu pulang.",
  "kamu nggak harus sempurna.\ncukup jadi kamu.\nitu sudah lebih dari cukup.",
  "kadang dunia terlalu berisik.\ntenang sebentar di sini,\naku nggak kemana-mana.",
  "setiap kenangan yang kita simpan\nadalah bukti kita pernah benar-benar hidup.",
  "di ruang ini, kamu aman.\ndi ruang ini, kamu dicintai.",
]

const FORTUNES = [
  "hari ini adalah hari yang baik untuk percaya pada diri sendiri 🌟",
  "seseorang sedang memikirkan kamu sekarang 💛",
  "kebaikan yang kamu tanam sedang bertumbuh 🌱",
  "sesuatu yang indah akan terjadi minggu ini ✨",
  "kamu lebih kuat dari yang kamu kira 💪",
  "rezeki kamu nggak pernah tertukar 🤍",
  "istirahat bukan berarti berhenti 🌙",
]

const DEX_MESSAGES = [
  "hai, aku cuma mau bilang... aku bangga sama kamu 💛",
  "kalau hari ini berat, nggak apa-apa istirahat dulu. Aku di sini.",
  "kamu tau nggak? kamu itu lebih amazing dari yang kamu sadari.",
  "thanks udah jadi kamu. dunia butuh kamu, dan aku juga 🌙",
  "aku kirim ini karena aku sayang kamu. gitu aja. simple. 💌",
]

export default function SurpriseContent({ type, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const randomPoem = POEMS[Math.floor(Math.random() * POEMS.length)]
  const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
  const randomMessage = DEX_MESSAGES[Math.floor(Math.random() * DEX_MESSAGES.length)]
  const randomMemory = memories[Math.floor(Math.random() * memories.length)]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 backdrop-blur-sm">
      <div
        className={`surprise-panel relative bg-deep-blue border-3 border-warm-gold/40 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-soft-white/30 hover:text-pixel-pink transition-colors font-pixel text-xs"
        >
          ✕
        </button>

        {/* Poem */}
        {type === 'poem' && (
          <div className="text-center">
            <h2 className="font-pixel text-sm text-warm-gold mb-6">💌 Puis Rahasia</h2>
            <div className="text-lg text-soft-white/70 leading-relaxed whitespace-pre-line">
              <Typewriter text={randomPoem} speed={60} />
            </div>
          </div>
        )}

        {/* Memory */}
        {type === 'memory' && (
          <div className="text-center">
            <h2 className="font-pixel text-sm text-warm-gold mb-4">📸 Kenangan Random</h2>
            <div className="surprise-memory bg-midnight border-2 border-soft-white/10 rounded-lg p-4 mb-4">
              <img
                src={randomMemory.image}
                alt={randomMemory.caption}
                className="w-full h-40 object-cover rounded pixel-render mb-3"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <p className="text-sm text-soft-white/60">{randomMemory.caption}</p>
            </div>
          </div>
        )}

        {/* Dex Message */}
        {type === 'message' && (
          <div className="text-center">
            <h2 className="font-pixel text-sm text-warm-gold mb-6">💬 Dari Dex</h2>
            <div className="text-lg text-soft-white/70 leading-relaxed">
              <Typewriter text={randomMessage} speed={50} />
            </div>
          </div>
        )}

        {/* Fortune Cookie */}
        {type === 'fortune' && (
          <div className="text-center">
            <h2 className="font-pixel text-sm text-warm-gold mb-4">🥠 Fortune Cookie</h2>
            <div className="surprise-fortune text-2xl text-soft-white/80 leading-relaxed">
              <Typewriter text={randomFortune} speed={70} />
            </div>
            <p className="text-xs text-soft-white/30 mt-4">— dari alam semesta untukmu ✨</p>
          </div>
        )}

        {/* Mini Game */}
        {type === 'minigame' && <MiniGame onClose={onClose} />}
      </div>
    </div>
  )
}

/**
 * Mini Game — click 5 stars to unlock a secret message.
 */
function MiniGame({ onClose }) {
  const [collected, setCollected] = useState(0)
  const [done, setDone] = useState(false)

  const handleStarClick = (index) => {
    if (done) return
    const next = collected + 1
    setCollected(next)

    if (next >= 5) {
      setDone(true)
    }
  }

  return (
    <div className="text-center">
      <h2 className="font-pixel text-sm text-warm-gold mb-4">⭐ Tangkap 5 Bintang!</h2>

      {!done ? (
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          {[...Array(8)].map((_, i) => (
            <button
              key={i}
              onClick={() => handleStarClick(i)}
              className="w-10 h-10 text-xl hover:scale-125 transition-transform pixel-render"
            >
              ⭐
            </button>
          ))}
        </div>
      ) : (
        <div className="surprise-reveal mt-4">
          <p className="text-lg text-soft-white/80 leading-relaxed">
            🌙 kamu dapet pesan rahasia:
          </p>
          <p className="text-warm-gold mt-2 font-pixel text-xs">
            "aku sayang kamu. selalu. 💛"
          </p>
        </div>
      )}

      <div className="mt-3 text-sm text-soft-white/40">
        ⭐ × {collected} / 5
      </div>
    </div>
  )
}
