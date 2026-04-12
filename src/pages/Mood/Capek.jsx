import { useState, useEffect } from 'react';
import StarField from '../../components/StarField';
import Typewriter from '../../components/Typewriter';

export default function Capek({ setPage }) {
  const [visible, setVisible] = useState(false);
  
  // Track which paragraph has finished typing
  const [p1Done, setP1Done] = useState(false);
  const [p2Done, setP2Done] = useState(false);
  const [p3Done, setP3Done] = useState(false);

  useEffect(() => {
    // Fade in the whole page container
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 overflow-hidden select-none">
      <StarField />
      
      <div 
        className={`
          relative z-10 flex flex-col items-center w-full max-w-2xl
          transition-opacity duration-1000 ease-in
          ${visible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        
        {/* ── RPG Dialog Container ── */}
        <div className="w-full flex flex-col gap-8 text-center px-4 md:px-8">
          
          <p className="text-xl md:text-2xl text-soft-white/90 leading-relaxed min-h-[3rem]">
            <Typewriter 
              text="pelan-pelan ya..." 
              speed={60} 
              delay={500} 
              onComplete={() => setP1Done(true)} 
            />
          </p>

          <p className="text-xl md:text-2xl text-soft-white/90 leading-relaxed min-h-[4rem]">
            {p1Done && (
              <Typewriter 
                text="kamu ga harus selalu jadi yang paling kuat kok." 
                speed={50} 
                delay={800} // wait a bit after p1 ends before starting p2
                onComplete={() => setP2Done(true)} 
              />
            )}
          </p>

          <p className="text-xl md:text-2xl text-warm-gold/90 leading-relaxed min-h-[4rem]">
            {p2Done && (
              <Typewriter 
                text="lebih bersyukur lagi yuk, kamu udah berjuang sejauh ini." 
                speed={55} 
                delay={1000} 
                onComplete={() => setP3Done(true)} 
              />
            )}
          </p>
        </div>

        {/* ── Floating Cat Icon (Reveals after text finishes) ── */}
        <div 
          className={`
            mt-16 mb-8 transition-all duration-1000 ease-out
            ${p3Done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <div className="w-20 h-20 bg-deep-blue border-3 border-soft-white/20 flex items-center justify-center animate-float pixel-render rounded-lg shadow-lg">
            <img
              src="/assets/icons/kucing-duduk.png"
              alt="kucing mini duduk"
              className="pixel-render w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback emoji */}
            <span className="text-3xl hidden items-center justify-center w-full h-full">
              🐱
            </span>
          </div>
        </div>

        {/* ── Back button ── */}
        <div 
          className={`
            mt-12 transition-all duration-1000 ease-out
            ${p3Done ? 'opacity-100' : 'opacity-0 delay-500'}
          `}
        >
          <button onClick={() => setPage('menu')} className="pixel-btn">
            &lt; kembali
          </button>
        </div>
        
      </div>
    </section>
  );
}
