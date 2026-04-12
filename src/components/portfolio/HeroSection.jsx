import { useEffect, useRef } from 'react';
import { animate, stagger, createTimeline } from 'animejs';

/**
 * HeroSection — Grand entrance with centered character portrait,
 * staggered text reveal, and dreamy scroll indicator.
 * Powered by Anime.js v4 — no Framer Motion.
 */
export default function HeroSection({ profile }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const tl = createTimeline({
      defaults: {
        ease: 'out(4)',
      },
    });

    // Portrait reveal — scale + fade with a slight rotation
    tl.add(el.querySelector('.hero-portrait'), {
      opacity: [0, 1],
      scale: [0.85, 1],
      rotateZ: [-2, 0],
      duration: 1000,
    }, 0);

    // Portrait border glow pulse
    tl.add(el.querySelector('.hero-portrait-glow'), {
      opacity: [0, 0.6],
      scale: [0.9, 1],
      duration: 1200,
    }, 200);

    // Name words — staggered cascade
    tl.add(el.querySelectorAll('.hero-name-word'), {
      opacity: [0, 1],
      translateY: [40, 0],
      filter: ['blur(8px)', 'blur(0px)'],
      duration: 800,
      delay: stagger(120),
    }, 400);

    // Title — elegant slide up
    tl.add(el.querySelector('.hero-title'), {
      opacity: [0, 1],
      translateY: [25, 0],
      letterSpacing: ['0.4em', '0.2em'],
      duration: 900,
    }, 800);

    // Tagline — soft fade
    tl.add(el.querySelector('.hero-tagline'), {
      opacity: [0, 0.6],
      translateY: [20, 0],
      duration: 800,
    }, 1100);

    // Scroll indicator
    tl.add(el.querySelector('.scroll-indicator'), {
      opacity: [0, 0.6],
      translateY: [15, 0],
      duration: 600,
    }, 1600);

    // Infinite scroll wheel animation
    const wheelEl = el.querySelector('.scroll-wheel');
    if (wheelEl) {
      animate(wheelEl, {
        translateY: [4, 16, 4],
        opacity: [1, 0, 1],
        duration: 1500,
        loop: true,
        ease: 'inOut(2)',
      });
    }

    // Portrait hover parallax tilt
    const portrait = el.querySelector('.hero-portrait');
    const handleMouse = (e) => {
      const rect = portrait.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      animate(portrait, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 400,
        ease: 'out(3)',
      });
    };
    const handleLeave = () => {
      animate(portrait, {
        rotateY: 0,
        rotateX: 0,
        duration: 600,
        ease: 'out(4)',
      });
    };
    portrait?.addEventListener('mousemove', handleMouse);
    portrait?.addEventListener('mouseleave', handleLeave);

    return () => {
      portrait?.removeEventListener('mousemove', handleMouse);
      portrait?.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const nameWords = profile.fullName.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 pt-20"
    >
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto text-center">
        {/* Centered Character Portrait */}
        <div className="relative mb-10 group" style={{ perspective: '800px' }}>
          {/* Glow ring behind portrait */}
          <div
            className="hero-portrait-glow absolute -inset-3 rounded-2xl opacity-0"
            style={{
              background: 'linear-gradient(135deg, rgba(0,68,255,0.3), rgba(128,0,32,0.3))',
              filter: 'blur(20px)',
            }}
          />

          <div
            className="hero-portrait relative w-56 h-72 md:w-72 md:h-96 rounded-2xl overflow-hidden opacity-0"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src="/assets/images/IMG-20260221-WA0099.jpg"
              alt={profile.fullName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Image overlay — cinematic vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(to top, rgba(10,14,39,0.6) 0%, transparent 40%),
                  radial-gradient(ellipse at center, transparent 50%, rgba(10,14,39,0.4) 100%)
                `,
              }}
            />
            {/* Inner border highlight */}
            <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
          </div>
        </div>

        {/* Name */}
        <h1 className="font-['Playfair_Display',serif] text-4xl md:text-6xl lg:text-7xl leading-tight mb-4">
          {nameWords.map((word, i) => (
            <span key={i} className="hero-name-word inline-block opacity-0 mr-3">
              <span
                className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text"
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                {word}
              </span>
              {i === 1 && (
                <br className="hidden md:block" />
              )}
            </span>
          ))}
        </h1>

        {/* Title */}
        <p
          className="hero-title text-sm md:text-base text-gray-400 tracking-[0.2em] uppercase mb-6 opacity-0"
        >
          {profile.title}
        </p>

        {/* Tagline */}
        <p className="hero-tagline text-lg md:text-xl text-soft-white/50 max-w-2xl leading-relaxed opacity-0">
          {profile.tagline}
        </p>

        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-1">
            <div className="scroll-wheel w-1 h-2 bg-white/60 rounded-full" />
          </div>
          <span className="text-xs text-white/30 tracking-[0.15em] uppercase">Scroll</span>
        </div>
      </div>
    </section>
  );
}
