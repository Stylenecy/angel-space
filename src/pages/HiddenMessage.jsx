import { useState } from 'react';
import StarField from '../components/StarField';
import Typewriter from '../components/Typewriter';

const lines = [
  "kamu itu cukup.",
  "kamu dihargai.",
  "bahkan saat kamu ga ngerasa begitu.",
];

export default function HiddenMessage({ setPage }) {
  const [visibleLines, setVisibleLines] = useState([0]);
  const [showButton, setShowButton] = useState(false);

  const handleLineComplete = (lineIndex) => {
    if (lineIndex < lines.length - 1) {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, lineIndex + 1]);
      }, 350);
    } else {
      setTimeout(() => setShowButton(true), 600);
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden">
      <StarField />

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
        {/* ── Message Card ── */}
        <div className="font-pixel text-[0.6rem] md:text-[0.65rem] leading-loose text-pixel-pink mb-12 w-full text-center bg-deep-blue p-10 border-2 border-pixel-pink/40 shadow-lg shadow-pixel-pink/20 min-h-[180px] flex flex-col items-center justify-center gap-5">
          {visibleLines.map((lineIndex) => (
            <div key={lineIndex} className="animate-fade-in">
              <Typewriter
                text={lines[lineIndex]}
                speed={55}
                delay={0}
                onComplete={() => handleLineComplete(lineIndex)}
              />
            </div>
          ))}
        </div>

        {/* ── Back button — hanya muncul setelah semua baris selesai ── */}
        {showButton && (
          <button
            onClick={() => setPage('menu')}
            className="pixel-btn text-[0.6rem] animate-fade-in"
          >
            &lt; kembali
          </button>
        )}
      </div>
    </section>
  );
}
