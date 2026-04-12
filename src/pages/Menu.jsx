import { useState, useEffect } from 'react';
import StarField from '../components/StarField';

const moods = [
  {
    id: 'capek',
    label: 'aku lagi capek',
    icon: '/assets/icons/angel-capek.png',
    fallbackEmoji: '😴',
    borderHover: 'hover:border-emerald-400/50',
    glowHover: 'hover:shadow-emerald-500/20',
  },
  {
    id: 'overthinking',
    label: 'aku lagi overthinking',
    icon: '/assets/icons/angel-overthinking.png',
    fallbackEmoji: '🤔',
    borderHover: 'hover:border-blue-400/50',
    glowHover: 'hover:shadow-blue-500/20',
  },
  {
    id: 'baik',
    label: 'aku lagi baik-baik aja',
    icon: '/assets/icons/angel-senang.png',
    fallbackEmoji: '😊',
    borderHover: 'hover:border-amber-400/50',
    glowHover: 'hover:shadow-amber-500/20',
  },
  {
    id: 'random',
    label: 'aku cuma pengen lihat sesuatu',
    icon: '/assets/icons/angel-penasaran.png',
    fallbackEmoji: '⭐',
    borderHover: 'hover:border-purple-400/50',
    glowHover: 'hover:shadow-purple-500/20',
  },
];

export default function Menu({ setPage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 overflow-hidden select-none">
      <StarField />

      <div className="relative z-10 flex flex-col items-center w-full max-w-xl">
        {/* ── Heading ── */}
        <h2
          className={`font-pixel text-xs md:text-sm text-warm-gold mb-12 tracking-wide transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          hari ini... kamu lagi dimana?
        </h2>

        {/* ── 2×2 Pixel Mood Grid ── */}
        <div className="grid grid-cols-2 gap-4 md:gap-5 w-full">
          {moods.map((mood, i) => (
            <button
              key={mood.id}
              onClick={() => setPage(mood.id)}
              className={`
                group pixel-card flex flex-col items-center justify-center gap-3
                p-6 md:p-8 
                ${mood.borderHover} ${mood.glowHover}
                hover:shadow-lg
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
              `}
              style={{
                transitionProperty: 'opacity, transform',
                transitionDuration: '500ms',
                transitionDelay: `${300 + i * 150}ms`,
                transitionTimingFunction: 'ease-out',
              }}
            >
              {/* ── icon placeholder (64×64 fixed) ── */}
              <div className="w-16 h-16 flex items-center justify-center bg-soft-white/[0.04] border-2 border-soft-white/10 group-hover:border-soft-white/25 transition-colors">
                <img
                  src={mood.icon}
                  alt={mood.label}
                  className="pixel-render w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <span className="text-2xl hidden items-center justify-center w-full h-full">
                  {mood.fallbackEmoji}
                </span>
              </div>

              {/* ── label (with chromatic glitch on hover) ── */}
              <span className="pixel-card-label text-base md:text-lg text-soft-white/70 group-hover:text-soft-white transition-colors leading-snug text-center">
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        {/* ── Jelajahi Dunia Button ── */}
        <button
          onClick={() => setPage('world')}
          className={`
            mt-6 pixel-btn w-full max-w-md !bg-gradient-to-r from-[#2d8a4e]/30 to-[#1a5c3a]/30 hover:from-[#2d8a4e]/50 hover:to-[#1a5c3a]/50 !border-pixel-green/50
            flex flex-col items-center justify-center py-4 px-6 gap-2
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ transitionDelay: '700ms' }}
        >
          <div className="text-pixel-green text-[0.55rem] tracking-widest text-shadow-sm">🌍 GROWTOPIA-STYLE 🌍</div>
          <div className="text-xs md:text-sm font-pixel text-soft-white">JELAJAHI DUNIA</div>
        </button>

        {/* ── Buka Kado Button ── */}
        <button
          onClick={() => setPage('memory')}
          className={`
            mt-8 pixel-btn w-full max-w-md !bg-[#e8798b] hover:!bg-[#d36476] !border-warm-gold animate-pulse
            flex flex-col items-center justify-center py-4 px-6 gap-2
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ transitionDelay: '800ms' }}
        >
          <div className="text-warm-gold text-[0.6rem] tracking-widest text-shadow-sm">✨ KHUSUS HARI INI ✨</div>
          <div className="text-xs md:text-sm font-pixel text-soft-white">BUKA KADO (21)</div>
        </button>

        {/* ── Portfolio Button ── */}
        <button
          onClick={() => setPage('portfolio')}
          className={`
            mt-4 pixel-btn w-full max-w-md !bg-gradient-to-r from-[#0044ff]/20 to-[#800020]/20 hover:from-[#0044ff]/30 hover:to-[#800020]/30 !border-soft-white/30
            flex flex-col items-center justify-center py-4 px-6 gap-2
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ transitionDelay: '900ms' }}
        >
          <div className="text-warm-gold text-[0.55rem] tracking-widest text-shadow-sm">✦ MY WORKS ✦</div>
          <div className="text-xs md:text-sm font-pixel text-soft-white">PORTFOLIO</div>
        </button>

        {/* ── Back button ── */}
        <button
          onClick={() => setPage('landing')}
          className={`
            mt-10 font-pixel text-[0.5rem] tracking-widest text-soft-white/25
            hover:text-warm-gold transition-all duration-500 cursor-pointer
            ${visible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ transitionDelay: '1000ms' }}
        >
          &lt; kembali
        </button>

        {/* ── Hidden trigger — subtle, di bawah ── */}
        <button
          onClick={() => setPage('hidden')}
          className={`
            mt-6 text-soft-white/10 hover:text-soft-white/30 transition-opacity duration-700
            cursor-pointer text-[0.55rem] tracking-[0.3em] font-pixel
            ${visible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ transitionDelay: '1200ms' }}
          aria-label="pesan tersembunyi"
        >
          · · ·
        </button>
      </div>
    </section>
  );
}
