import { useState } from 'react';
import StarField from '../components/StarField';

const cards = [
  {
    image: '/assets/images/20250625_174823.jpg',
    caption: 'ini foto dari awal-awal kita. aku masih ingat betapa nervous-nya aku waktu itu.',
  },
  {
    image: '/assets/images/IMG-20251225-WA0104.jpg',
    caption: 'natal pertama kita. salah satu hari yang paling aku syukuri.',
  },
  {
    image: '/assets/images/20260221_120152.jpg',
    caption: 'ini. ini salah satu kenangan favorit aku sama kamu.',
  },
  {
    image: '/assets/images/20260319_175625.jpg',
    caption: 'baru kemarin rasanya, tapi udah jadi memori yang paling aku jaga.',
  },
  {
    image: null,
    caption: null,
    isFinal: true,
  },
];

export default function Memory({ setPage }) {
  const [index, setIndex] = useState(0);
  const card = cards[index];

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 overflow-hidden select-none">
      <StarField />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* ── Header ── */}
        <h1 className="font-pixel text-[0.6rem] md:text-[0.7rem] text-warm-gold mb-8 border-2 border-warm-gold px-6 py-3 bg-deep-blue/80 shadow-[3px_3px_0_0_#d4a853] text-center leading-relaxed animate-float">
          Happy 21st, Angel 🎂
        </h1>

        {/* ── Card ── */}
        <div key={index} className="w-full bg-deep-blue/90 border-2 border-pixel-pink shadow-[4px_4px_0_0_#e8798b] p-6 flex flex-col items-center gap-6 animate-fade-in">

          {card.isFinal ? (
            /* ── Final card: pesan tulus ── */
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="text-5xl animate-float-slow">🤍</div>
              <p className="font-pixel text-[0.55rem] md:text-[0.6rem] leading-loose text-pixel-pink text-center">
                di hari ulang tahunmu yang ke-21...
              </p>
              <p className="font-pixel text-[0.55rem] md:text-[0.6rem] leading-loose text-warm-gold text-center">
                makasih udah mau ada<br />di dunia yang sama dengan aku.
              </p>
              <p className="font-sans text-base text-soft-white/60 text-center leading-relaxed mt-2">
                setiap momennya berharga.<br />
                dan aku berencana untuk terus mengumpulkan lebih banyak lagi.
              </p>
            </div>
          ) : (
            /* ── Photo card ── */
            <>
              <div className="w-full aspect-[4/3] bg-midnight/60 border border-soft-white/10 overflow-hidden flex items-center justify-center relative">
                <img
                  src={card.image}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden absolute inset-0 flex-col items-center justify-center text-soft-white/20 font-pixel text-[0.5rem] text-center px-4">
                  <span className="text-3xl mb-2">📷</span>
                  foto belum tersimpan
                </div>
              </div>
              <p className="font-sans text-base md:text-lg text-soft-white/80 text-center leading-relaxed min-h-[4rem]">
                {card.caption}
              </p>
            </>
          )}
        </div>

        {/* ── Navigation ── */}
        <div className="w-full mt-6">
          {!card.isFinal ? (
            <button
              onClick={() => setIndex(index + 1)}
              className="pixel-btn w-full !bg-pixel-pink hover:!bg-[#d36476] !border-warm-gold py-4 text-[0.6rem] md:text-xs"
            >
              selanjutnya &gt;
            </button>
          ) : (
            <button
              onClick={() => setPage('menu')}
              className="pixel-btn w-full !bg-pixel-green hover:!bg-[#2e9c53] !border-soft-white py-4 animate-pulse text-[0.6rem] md:text-xs"
            >
              &lt; kembali ke menu
            </button>
          )}
        </div>

        {/* ── Progress dots ── */}
        <div className="flex gap-2 mt-5">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 transition-all duration-300 ${
                i === index ? 'bg-warm-gold scale-125' : 'bg-soft-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
