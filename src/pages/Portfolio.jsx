import { useEffect, useState } from 'react';
import StarField from '../components/StarField';

export default function Portfolio({ setPage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden select-none">
      <StarField />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        <div
          className={`transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* ── Icon ── */}
          <div className="w-16 h-16 mx-auto mb-8 border-2 border-warm-gold/40 bg-deep-blue flex items-center justify-center animate-float">
            <img
              src="/assets/icons/mini-angel-dex.png"
              alt="portfolio icon"
              className="pixel-render w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="hidden text-2xl">🎓</span>
          </div>

          {/* ── Title ── */}
          <h1 className="font-pixel text-[0.7rem] md:text-xs text-warm-gold mb-4 tracking-wide">
            Karya Kita
          </h1>

          {/* ── Coming Soon card ── */}
          <div className="bg-deep-blue/80 border-2 border-soft-white/10 p-8 mb-8 shadow-[3px_3px_0_0_rgba(212,168,83,0.3)]">
            <p className="font-pixel text-[0.55rem] leading-loose text-warm-gold/70 mb-4">
              [ sedang dibangun ]
            </p>
            <p className="font-sans text-base text-soft-white/60 leading-relaxed">
              Tempat ini nanti jadi rumah untuk karya-karya kita berdua.
            </p>
            <p className="font-sans text-sm text-soft-white/40 leading-relaxed mt-3">
              Portfolio Angel & Dex — bisa diedit langsung, tanpa sentuh kode.
            </p>
          </div>

          {/* ── Back ── */}
          <button
            onClick={() => setPage('menu')}
            className="font-pixel text-[0.5rem] tracking-widest text-soft-white/25 hover:text-warm-gold transition-all duration-500 cursor-pointer"
          >
            &lt; kembali
          </button>
        </div>
      </div>
    </section>
  );
}
