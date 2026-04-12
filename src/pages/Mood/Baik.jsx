import { useState } from 'react';
import StarField from '../../components/StarField';
import Typewriter from '../../components/Typewriter';
import { memories } from '../../data/memories';

export default function Baik({ setPage }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMemory = memories[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? memories.length - 1 : prev - 1));
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 overflow-hidden select-none">
      <StarField />

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
        {/* ── Title ── */}
        <h2 className="font-pixel text-xs md:text-sm text-warm-gold mb-8 tracking-wide">
           Memory Gallery
        </h2>

        {/* ── Polaroid Card ── */}
        <div className="pixel-card w-full flex flex-col p-4 md:p-6 bg-deep-blue/80 border-2 border-soft-white/10 shadow-lg shrink-0">
          {/* Image Container */}
          <div className="w-full aspect-[4/3] bg-midnight/50 border border-soft-white/5 mb-6 overflow-hidden flex items-center justify-center relative shadow-inner">
            <img
              src={currentMemory.image}
              alt={`Memory ${currentIndex + 1}`}
              className="w-full h-full object-cover pixel-render"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="text-soft-white/20 hidden flex-col items-center justify-center absolute inset-0 w-full h-full text-xs font-pixel text-center px-4">
              <span className="text-2xl mb-2">📷</span>
              ( {currentMemory.image.split('/').pop()} )<br/>
              Foto belum tertaut
            </div>
          </div>

          {/* Caption */}
          <div className="font-pixel text-xs md:text-sm text-soft-white leading-relaxed text-center min-h-[3rem] flex items-center justify-center">
            <Typewriter
              key={currentMemory.id}
              text={currentMemory.caption}
              speed={40}
            />
          </div>
        </div>

        {/* ── Navigation Buttons ── */}
        <div className="flex items-center justify-between w-full mt-8 gap-4">
          <button onClick={handlePrev} className="pixel-btn flex-1 py-3 text-xs md:text-sm">
            &lt; Prev
          </button>

          <div className="font-pixel text-[0.6rem] text-soft-white/50 tracking-widest px-4">
            {currentIndex + 1} / {memories.length}
          </div>

          <button onClick={handleNext} className="pixel-btn flex-1 py-3 text-xs md:text-sm">
            Next &gt;
          </button>
        </div>

        {/* ── Back button ── */}
        <button
          onClick={() => setPage('menu')}
          className="mt-12 font-pixel text-[0.6rem] tracking-widest text-soft-white/25 hover:text-warm-gold transition-colors cursor-pointer"
        >
          [ kembali ke menu ]
        </button>
      </div>
    </section>
  );
}
