import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

/**
 * AboutSection — Personal bio with photo in a glassmorphism card.
 * Scroll-triggered reveal powered by Anime.js + IntersectionObserver.
 */
export default function AboutSection({ profile }) {
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          // Section title reveal
          animate(el.querySelector('.section-heading'), {
            opacity: [0, 1],
            translateY: [35, 0],
            duration: 700,
            ease: 'out(4)',
          });

          // Underline dash expand
          animate(el.querySelector('.section-dash'), {
            scaleX: [0, 1],
            opacity: [0, 1],
            duration: 600,
            delay: 200,
            ease: 'out(3)',
          });

          // Text card — slide from left with glassmorphism shimmer
          animate(el.querySelector('.about-text-card'), {
            opacity: [0, 1],
            translateX: [-60, 0],
            duration: 800,
            delay: 300,
            ease: 'out(4)',
          });

          // Text paragraphs — staggered appearance
          animate(el.querySelectorAll('.about-paragraph'), {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            delay: stagger(150, { start: 500 }),
            ease: 'out(3)',
          });

          // Image — slide from right with slight rotation
          animate(el.querySelector('.about-image-wrapper'), {
            opacity: [0, 1],
            translateX: [60, 0],
            rotateZ: [2, 0],
            duration: 900,
            delay: 500,
            ease: 'out(4)',
          });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="section-heading font-['Playfair_Display',serif] text-4xl md:text-5xl mb-4 opacity-0">
            The Vision
          </h2>
          <div
            className="section-dash w-16 h-0.5 mx-auto opacity-0"
            style={{
              background: 'linear-gradient(90deg, #0044ff, #800020)',
              transformOrigin: 'center',
            }}
          />
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div
            className="about-text-card glass-card p-8 md:p-10 rounded-2xl opacity-0 relative overflow-hidden"
          >
            {/* Shimmer accent */}
            <div
              className="absolute top-0 left-0 w-full h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              }}
            />
            {profile.about.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="about-paragraph text-base md:text-lg leading-relaxed text-soft-white/70 mb-6 last:mb-0 opacity-0"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Image */}
          <div
            className="about-image-wrapper relative rounded-2xl overflow-hidden aspect-[4/5] group opacity-0"
            style={{
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <img
              src="/assets/images/20260221_210200.jpg"
              alt="About Angel"
              className="w-full h-full object-cover transition-all duration-700 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105"
            />
            {/* Overlay vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(10,14,39,0.4) 0%, transparent 50%)',
              }}
            />
            <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
