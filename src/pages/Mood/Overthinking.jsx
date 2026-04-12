import { useState, useEffect } from 'react';
import StarField from '../../components/StarField';
import Typewriter from '../../components/Typewriter';

// ── Scenario data ──────────────────────────────────────────────
const SCENARIOS = {
  temenin: {
    lines: [
      { text: 'sini, aku temenin sampai tenang.', delay: 600 },
      { text: 'pelan-pelan napasnya... gapapa kok.', delay: 0 },
    ],
    icon: '/assets/icons/anjing-kucing-peluk.png',
    fallback: '🐶🐱',
    iconAlt: 'anjing dan kucing peluk',
    floatSpeed: 'animate-float',
  },
  space: {
    lines: [
      { text: 'oke, ambil waktu buat dirimu sendiri ya.', delay: 600 },
      { text: 'aku jagain dari sini.', delay: 0 },
    ],
    icon: '/assets/icons/anjing-bulan.png',
    fallback: '🌙',
    iconAlt: 'anjing mini di bulan',
    // very slow float — 8s instead of default 4s
    floatSpeed: 'animate-float-slow',
  },
};

export default function Overthinking({ setPage }) {
  const [pageVisible, setPageVisible] = useState(false);
  const [openingDone, setOpeningDone] = useState(false);
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [mode, setMode] = useState(null);          // null | 'temenin' | 'space'
  const [line1Done, setLine1Done] = useState(false);
  const [line2Done, setLine2Done] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPageVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Show choice buttons shortly after opening line finishes
  useEffect(() => {
    if (openingDone) {
      const t = setTimeout(() => setChoicesVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [openingDone]);

  // Reset sub-state when a new mode is chosen
  const handleChoice = (choice) => {
    setChoicesVisible(false);
    setLine1Done(false);
    setLine2Done(false);
    // slight delay so choices fade out before text starts
    setTimeout(() => setMode(choice), 400);
  };

  const scenario = mode ? SCENARIOS[mode] : null;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 overflow-hidden select-none">
      <StarField />

      <div
        className={`relative z-10 flex flex-col items-center w-full max-w-2xl transition-opacity duration-1000 ease-in ${
          pageVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* ── Opening question ── */}
        <div className="text-center mb-10 min-h-[5rem]">
          <p className="text-xl md:text-2xl text-soft-white/90 leading-relaxed">
            <Typewriter
              text="kepalanya lagi berisik ya?"
              speed={70}
              delay={500}
              onComplete={() => setOpeningDone(true)}
            />
          </p>
        </div>

        {/* ── Branching choice buttons ── */}
        {!mode && (
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 ease-out ${
              choicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              onClick={() => handleChoice('temenin')}
              className="pixel-btn"
            >
              temenin aku
            </button>
            <button
              onClick={() => handleChoice('space')}
              className="pixel-btn"
            >
              aku butuh space
            </button>
          </div>
        )}

        {/* ── Scenario content ── */}
        {scenario && (
          <div className="flex flex-col items-center gap-8 text-center w-full">
            {/* Line 1 */}
            <p className="text-xl md:text-2xl text-soft-white/90 leading-relaxed min-h-[3rem]">
              <Typewriter
                text={scenario.lines[0].text}
                speed={60}
                delay={scenario.lines[0].delay}
                onComplete={() => setLine1Done(true)}
              />
            </p>

            {/* Line 2 — chained */}
            <p className="text-xl md:text-2xl text-warm-gold/90 leading-relaxed min-h-[3rem]">
              {line1Done && (
                <Typewriter
                  text={scenario.lines[1].text}
                  speed={60}
                  delay={900}
                  onComplete={() => setLine2Done(true)}
                />
              )}
            </p>

            {/* ── Floating icon ── */}
            <div
              className={`mt-4 transition-all duration-1000 ease-out ${
                line2Done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div
                className={`w-20 h-20 bg-deep-blue border-3 border-soft-white/20 flex items-center justify-center ${scenario.floatSpeed} pixel-render`}
                style={mode === 'space' ? { animationDuration: '8s' } : {}}
              >
                <img
                  src={scenario.icon}
                  alt={scenario.iconAlt}
                  className="pixel-render w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <span className="text-3xl hidden items-center justify-center w-full h-full">
                  {scenario.fallback}
                </span>
              </div>
            </div>

            {/* ── Back button ── */}
            <div
              className={`mt-8 transition-all duration-1000 ease-out ${
                line2Done ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button onClick={() => setPage('menu')} className="pixel-btn">
                &lt; kembali
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
