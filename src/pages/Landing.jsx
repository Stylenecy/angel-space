import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import StarField from '../components/StarField';
import { useAuth } from '../hooks/useAuth';
import { pickEntrance } from '../components/entrances/entrancePicker';
import {
  StarfallEntrance,
  PortalEntrance,
  TypewriterEntrance,
  MoodMatchEntrance,
  SecretHeartEntrance,
  CinematicEntrance,
} from '../components/entrances';

const ENTRANCE_COMPONENTS = {
  starfall:    StarfallEntrance,
  portal:      PortalEntrance,
  typewriter:  TypewriterEntrance,
  moodmatch:   MoodMatchEntrance,
  secretheart: SecretHeartEntrance,
  cinematic:   CinematicEntrance,
};

// ── Character stagger — Elsye-inspired, framer-motion per-char ──
// Outer span = clipping mask; inner motion.span slides up from below
function CharStagger({ text, baseDelay = 0, charDelay = 110, color }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <motion.span
            style={{ display: 'inline-block', color }}
            initial={{ y: '120%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              delay: (baseDelay + i * charDelay) / 1000,
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </>
  );
}

// ── Subtitle — word stagger with 3-D tilt (Elsye words) ──
const SUBTITLE_LINES = [
  'ini bukan apa-apa yang besar…',
  'cuma tempat kecil,',
  'kalau suatu hari kamu butuh pulang sebentar',
];

function SubtitleStagger() {
  return (
    <p className="mt-6 text-lg md:text-xl leading-relaxed text-soft-white/70">
      {SUBTITLE_LINES.map((line, lineIdx) => (
        <span key={lineIdx} className="block" style={{ perspective: '500px' }}>
          {line.split(' ').map((word, wordIdx) => (
            <motion.span
              key={wordIdx}
              className="inline-block mr-[0.28em]"
              initial={{ y: 28, opacity: 0, rotateX: -50 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{
                delay: (lineIdx * 220 + wordIdx * 95) / 1000,
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {word}
            </motion.span>
          ))}
        </span>
      ))}
    </p>
  );
}

// ── Page component ────────────────────────────────────────────
export default function Landing({ setPage }) {
  const { username } = useAuth();
  const [entranceType, setEntranceType] = useState(null);
  const [entranceDone, setEntranceDone] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  useEffect(() => {
    setEntranceType(pickEntrance());
  }, []);

  // Emergency fallback — show everything after 6 s
  useEffect(() => {
    const t = setTimeout(() => {
      setEntranceDone(true);
      setShowTitle(true);
      setShowSubtitle(true);
      setShowButton(true);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  const handleEntranceComplete = () => {
    setEntranceDone(true);
    setShowTitle(true);
    const t2 = setTimeout(() => setShowSubtitle(true), 500);
    const t3 = setTimeout(() => setShowButton(true), 1500);
    return () => { clearTimeout(t2); clearTimeout(t3); };
  };

  useEffect(() => {
    if (entranceType === null) {
      const t1 = setTimeout(() => setShowTitle(true), 300);
      const t2 = setTimeout(() => setShowSubtitle(true), 1400);
      const t3 = setTimeout(() => setShowButton(true), 3000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [entranceType]);

  const handleTitleClick = () => {
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setPage('hidden');
      return;
    }
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  };

  const displayName = username;
  const hasUsername = !!username;
  const targetPage  = hasUsername ? 'dashboard' : 'login';
  const EntranceComponent = entranceType ? ENTRANCE_COMPONENTS[entranceType] : null;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden select-none">
      <StarField />

      {/* CRT scanline atmospheric overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
        }}
      />

      {!entranceDone && EntranceComponent && (
        <EntranceComponent onComplete={handleEntranceComplete} />
      )}

      <div className="relative z-10 flex flex-col items-center max-w-lg">

        {/* ── Avatar icon ── */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={showTitle ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="w-16 h-16 bg-deep-blue border-3 border-soft-white/20 flex items-center justify-center animate-float pixel-render">
            <img
              src="/assets/icons/anjing-tidur.png"
              alt="anjing mini tidur"
              className="pixel-render w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            <span className="text-2xl hidden">🐶</span>
          </div>
        </motion.div>

        {/* ── Title — character stagger (Elsye) ── */}
        {showTitle && (
          <h1
            onClick={handleTitleClick}
            className="font-pixel text-xl md:text-2xl tracking-wide cursor-pointer"
          >
            {hasUsername ? (
              <>
                <CharStagger
                  text="Hi,\u00A0"
                  baseDelay={0}
                  charDelay={110}
                  color="#d4a853"
                />
                <CharStagger
                  text={displayName}
                  baseDelay={500}
                  charDelay={120}
                  color="#d4a853"
                />
              </>
            ) : (
              <CharStagger text="Hi" baseDelay={0} charDelay={130} color="#d4a853" />
            )}
            <motion.span
              className="inline-block ml-2 animate-pixel-blink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: hasUsername ? (0.5 + (displayName?.length || 0) * 0.12 + 0.5) : 0.6 }}
            >
              🌙
            </motion.span>
          </h1>
        )}

        {/* ── Subtitle — word stagger (Elsye) ── */}
        {showSubtitle && <SubtitleStagger />}

        {/* ── Enter button ── */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={showButton ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <button onClick={() => setPage(targetPage)} className="pixel-btn">
            {hasUsername ? 'masuk ke ruang kamu →' : 'buat nama dulu ✨'}
          </button>
        </motion.div>

        {/* ── Bottom hints ── */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={showButton ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <p className="text-sm text-soft-white/25 tracking-wider">
            kamu boleh masuk, pelan-pelan aja 🤍
          </p>
          <button
            onClick={() => setPage('menu')}
            className="font-pixel text-[0.5rem] tracking-widest text-soft-white/20 hover:text-warm-gold transition-colors cursor-pointer"
          >
            jelajahi tanpa nama →
          </button>
        </motion.div>

        {entranceDone && entranceType && (
          <div className="fixed bottom-4 left-4 font-pixel text-[0.35rem] text-soft-white/15 tracking-wider select-none pointer-events-none z-0">
            entrance: {entranceType}
          </div>
        )}
      </div>
    </section>
  );
}
