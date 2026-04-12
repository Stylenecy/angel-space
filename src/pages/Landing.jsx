import { useEffect, useState, useRef } from 'react';
import StarField from '../components/StarField';
import { pickEntrance } from '../components/entrances/entrancePicker';
import {
  StarfallEntrance,
  PortalEntrance,
  TypewriterEntrance,
  MoodMatchEntrance,
  SecretHeartEntrance,
} from '../components/entrances';

const ENTRANCE_COMPONENTS = {
  starfall: StarfallEntrance,
  portal: PortalEntrance,
  typewriter: TypewriterEntrance,
  moodmatch: MoodMatchEntrance,
  secretheart: SecretHeartEntrance,
};

/**
 * Landing Page — pixel-art "Night Sky" welcome screen.
 * Random entrance animation each time you load.
 * Easter egg: klik judul "Hi, Angel" sebanyak 3x → HiddenMessage
 */
export default function Landing({ setPage }) {
  const [entranceType, setEntranceType] = useState(null);
  const [entranceDone, setEntranceDone] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  // Pick random entrance on mount
  useEffect(() => {
    setEntranceType(pickEntrance());
  }, []);

  // EMERGENCY: If entrance doesn't complete in 6s, force show everything
  useEffect(() => {
    const emergencyShow = setTimeout(() => {
      setEntranceDone(true);
      setShowTitle(true);
      setShowSubtitle(true);
      setShowButton(true);
    }, 6000);
    return () => clearTimeout(emergencyShow);
  }, []);

  // After entrance animation, show normal content
  const handleEntranceComplete = () => {
    setEntranceDone(true);
    setShowTitle(true);
    const t2 = setTimeout(() => setShowSubtitle(true), 400);
    const t3 = setTimeout(() => setShowButton(true), 1200);
    return () => { clearTimeout(t2); clearTimeout(t3); };
  };

  useEffect(() => {
    // If no entrance picked yet (edge case), show content normally
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

    // reset counter jika tidak klik lagi dalam 1.5 detik
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  };

  const EntranceComponent = entranceType ? ENTRANCE_COMPONENTS[entranceType] : null;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden select-none">
      <StarField />

      {/* Entrance animation overlay */}
      {!entranceDone && EntranceComponent && (
        <EntranceComponent onComplete={handleEntranceComplete} />
      )}

      <div className="relative z-10 flex flex-col items-center max-w-lg">

        {/* ── Icon placeholder: anjing mini tidur ── */}
        <div className="mb-6">
          <div
            className="w-16 h-16 bg-deep-blue border-3 border-soft-white/20 flex items-center justify-center animate-float pixel-render"
            title="anjing mini tidur — placeholder"
          >
            {/* Replace with <img src="/assets/icons/anjing-tidur.png" className="pixel-render w-full h-full" /> */}
            <img
              src="/assets/icons/anjing-tidur.png"
              alt="anjing mini tidur"
              className="pixel-render w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            <span className="text-2xl hidden">🐶</span>
          </div>
        </div>

        {/* ── Title — klik 3x untuk easter egg ── */}
        <h1
          onClick={handleTitleClick}
          className={`font-pixel text-xl md:text-2xl tracking-wide text-warm-gold transition-all duration-1000 ease-out cursor-pointer select-none ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Hi, Angel
          <span className="inline-block ml-2 animate-pixel-blink">🌙</span>
        </h1>

        {/* ── Subtitle ── */}
        <p
          className={`mt-6 text-lg md:text-xl leading-relaxed text-soft-white/70 transition-all duration-1000 ease-out ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          ini bukan apa-apa yang besar…<br />
          cuma tempat kecil,<br />
          kalau suatu hari kamu butuh pulang sebentar
        </p>

        {/* ── Pixel-art Enter Button ── */}
        <div
          className={`mt-12 transition-all duration-700 ease-out ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button onClick={() => setPage('menu')} className="pixel-btn">
            aku mau masuk
          </button>
        </div>

        {/* ── Login link ── */}
        <div
          className={`mt-14 flex flex-col items-center gap-4 transition-all duration-1000 ease-out ${
            showButton ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-sm text-soft-white/25 tracking-wider">
            kamu boleh masuk, pelan-pelan aja 🤍
          </p>
          <button
            onClick={() => setPage('login')}
            className="pixel-btn !text-[0.6rem] !py-3 !px-6 text-soft-white/60 border-soft-white/30"
          >
            masuk ke ruang kamu →
          </button>
        </div>

        {/* ── Debug: entrance type indicator (subtle) ── */}
        {entranceDone && entranceType && (
          <div className="fixed bottom-4 left-4 font-pixel text-[0.35rem] text-soft-white/15 tracking-wider select-none pointer-events-none z-0">
            entrance: {entranceType}
          </div>
        )}
      </div>
    </section>
  );
}
