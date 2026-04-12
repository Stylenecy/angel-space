import { useState, useEffect, useRef, useCallback } from 'react';
import { animate, stagger } from 'animejs';

/**
 * SkillsSection — Animated skill bars with category filter.
 * Pure Anime.js v4 — no Framer Motion.
 */
export default function SkillsSection({ skills }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const sectionRef = useRef(null);
  const barsRef = useRef(null);
  const hasRevealed = useRef(false);

  const categories = ['all', 'design', 'tools', 'development'];

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  // Scroll-triggered reveal for section heading
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed.current) {
          hasRevealed.current = true;
          animate(el.querySelector('.section-heading'), {
            opacity: [0, 1],
            translateY: [35, 0],
            duration: 700,
            ease: 'out(4)',
          });
          animate(el.querySelector('.section-dash'), {
            scaleX: [0, 1],
            opacity: [0, 1],
            duration: 600,
            delay: 200,
            ease: 'out(3)',
          });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate skill bars on filter change
  const animateSkillBars = useCallback(() => {
    const container = barsRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.skill-card');
    const fills = container.querySelectorAll('.skill-fill');

    // Cards stagger in
    animate(cards, {
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: 500,
      delay: stagger(80),
      ease: 'out(3)',
    });

    // Skill bar fills animate to their width
    fills.forEach((fill, i) => {
      const level = fill.dataset.level;
      animate(fill, {
        width: [`0%`, `${level}%`],
        duration: 1000,
        delay: i * 80 + 300,
        ease: 'out(4)',
      });
    });
  }, []);

  useEffect(() => {
    // Small timeout to let React render the new list
    const timer = setTimeout(animateSkillBars, 50);
    return () => clearTimeout(timer);
  }, [activeCategory, animateSkillBars]);

  return (
    <section ref={sectionRef} className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="section-heading font-['Playfair_Display',serif] text-4xl md:text-5xl mb-4 opacity-0">
            Skills & Expertise
          </h2>
          <div
            className="section-dash w-16 h-0.5 mx-auto opacity-0"
            style={{
              background: 'linear-gradient(90deg, #0044ff, #800020)',
              transformOrigin: 'center',
            }}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative px-5 py-2 rounded-full text-sm capitalize transition-all duration-300 overflow-hidden"
              style={{
                background: activeCategory === cat
                  ? 'linear-gradient(90deg, #0044ff, #800020)'
                  : 'rgba(255,255,255,0.05)',
                color: activeCategory === cat
                  ? '#fff'
                  : 'rgba(240,240,245,0.5)',
                border: activeCategory === cat
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat) {
                  animate(e.currentTarget, {
                    scale: 1.06,
                    duration: 200,
                    ease: 'out(3)',
                  });
                }
              }}
              onMouseLeave={(e) => {
                animate(e.currentTarget, {
                  scale: 1,
                  duration: 200,
                  ease: 'out(3)',
                });
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill Bars */}
        <div ref={barsRef} className="space-y-5">
          {filtered.map((skill) => (
            <SkillBar key={`${activeCategory}-${skill.name}`} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillBar({ skill }) {
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      className="skill-card glass-card p-5 rounded-xl opacity-0 relative overflow-hidden"
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        }}
      />
      <div className="flex justify-between items-center mb-3">
        <span
          className="text-base font-medium text-soft-white/90"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {skill.name}
        </span>
        <span className="text-sm text-warm-gold font-mono">{skill.level}%</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="skill-fill h-full rounded-full"
          data-level={skill.level}
          style={{
            width: '0%',
            background: 'linear-gradient(90deg, #0044ff, #6a0dad, #800020)',
          }}
        />
      </div>
    </div>
  );
}
