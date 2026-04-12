import { useEffect, useState, useRef } from 'react';
import StarField from '../components/StarField';
import { useAuth } from '../hooks/useAuth';
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

export default function Landing({ setPage }) {
  const { username } = useAuth()
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

  useEffect(() => {
    const emergencyShow = setTimeout(() => {
      setEntranceDone(true);
      setShowTitle(true);
      setShowSubtitle(true);
      setShowButton(true);
    }, 6000);
    return () => clearTimeout(emergencyShow);
  }, []);

  const handleEntranceComplete = () => {
    setEntranceDone(true);
    setShowTitle(true);
    const t2 = setTimeout(() => setShowSubtitle(true), 400);
    const t3 = setTimeout(() => setShowButton(true), 1200);
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

  const displayName = username || 'Angel'
  const hasUsername = !!username
  const targetPage = hasUsername ? 'dashboard' : 'login'

  const EntranceComponent = entranceType ? ENTRANCE_COMPONENTS[entranceType] : null;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden select-none">
      <StarField />

      {!entranceDone && EntranceComponent && (
        <EntranceComponent onComplete={handleEntranceComplete} />
      )}

      <div className="relative z-10 flex flex-col items-center max-w-lg">

        <div className="mb-6">
          <div
            className="w-16 h-16 bg-deep-blue border-3 border-soft-white/20 flex items-center justify-center animate-float pixel-render"
          >
            <img
              src="/assets/icons/anjing-tidur.png"
              alt="anjing mini tidur"
              className="pixel-render w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            <span className="text-2xl hidden">🐶</span>
          </div>
        </div>

        <h1
          onClick={handleTitleClick}
          className={`font-pixel text-xl md:text-2xl tracking-wide text-warm-gold transition-all duration-1000 ease-out cursor-pointer select-none ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Hi, {displayName}
          <span className="inline-block ml-2 animate-pixel-blink">🌙</span>
        </h1>

        <p
          className={`mt-6 text-lg md:text-xl leading-relaxed text-soft-white/70 transition-all duration-1000 ease-out ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          ini bukan apa-apa yang besar…<br />
          cuma tempat kecil,<br />
          kalau suatu hari kamu butuh pulang sebentar
        </p>

        <div
          className={`mt-12 transition-all duration-700 ease-out ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button onClick={() => setPage(targetPage)} className="pixel-btn">
            {hasUsername ? 'masuk ke ruang kamu →' : 'buat nama dulu ✨'}
          </button>
        </div>

        <div
          className={`mt-8 flex flex-col items-center gap-4 transition-all duration-1000 ease-out ${
            showButton ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
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
        </div>

        {entranceDone && entranceType && (
          <div className="fixed bottom-4 left-4 font-pixel text-[0.35rem] text-soft-white/15 tracking-wider select-none pointer-events-none z-0">
            entrance: {entranceType}
          </div>
        )}
      </div>
    </section>
  );
}
