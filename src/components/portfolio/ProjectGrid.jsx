import { useState, useEffect, useRef, useCallback } from 'react';
import { animate, stagger } from 'animejs';

/**
 * ProjectGrid — Filterable portfolio showcase with hover effects.
 * Pure Anime.js v4 — no Framer Motion.
 */
export default function ProjectGrid({ projects, categories }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const hasRevealed = useRef(false);

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  // Scroll-triggered heading reveal
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate cards on filter change
  const animateCards = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('.project-card');
    animate(cards, {
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.95, 1],
      duration: 600,
      delay: stagger(100),
      ease: 'out(4)',
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(animateCards, 50);
    return () => clearTimeout(timer);
  }, [activeCategory, animateCards]);

  return (
    <section ref={sectionRef} className="relative py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="section-heading font-['Playfair_Display',serif] text-4xl md:text-5xl mb-4 opacity-0">
            Selected Works
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
              className="px-5 py-2 rounded-full text-sm transition-all duration-300"
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
                  animate(e.currentTarget, { scale: 1.06, duration: 200, ease: 'out(3)' });
                }
              }}
              onMouseLeave={(e) => {
                animate(e.currentTarget, { scale: 1, duration: 200, ease: 'out(3)' });
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.map((project) => (
            <ProjectCard key={`${activeCategory}-${project.id}`} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;

    animate(card.querySelector('.card-overlay'), {
      opacity: [0.5, 1],
      duration: 350,
      ease: 'out(3)',
    });
    animate(card.querySelector('.card-content'), {
      translateY: [10, 0],
      opacity: [0.7, 1],
      duration: 400,
      ease: 'out(3)',
    });
    animate(card.querySelector('.card-description'), {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 350,
      delay: 100,
      ease: 'out(3)',
    });
    animate(card.querySelector('.card-image'), {
      scale: 1.08,
      duration: 700,
      ease: 'out(3)',
    });
    // Subtle card lift
    animate(card, {
      scale: 1.02,
      duration: 300,
      ease: 'out(3)',
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    animate(card.querySelector('.card-overlay'), {
      opacity: 0.5,
      duration: 300,
      ease: 'out(2)',
    });
    animate(card.querySelector('.card-content'), {
      translateY: 10,
      opacity: 0.7,
      duration: 300,
      ease: 'out(2)',
    });
    animate(card.querySelector('.card-description'), {
      opacity: 0,
      translateY: 10,
      duration: 200,
      ease: 'out(2)',
    });
    animate(card.querySelector('.card-image'), {
      scale: 1,
      duration: 500,
      ease: 'out(3)',
    });
    animate(card, {
      scale: 1,
      duration: 300,
      ease: 'out(2)',
    });
  };

  return (
    <div
      ref={cardRef}
      className="project-card relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden cursor-pointer opacity-0"
      style={{
        boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          className="card-image absolute inset-0 w-full h-full object-cover"
          style={{ willChange: 'transform' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : null}

      {/* Fallback Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: project.gradient }}
      />

      {/* Overlay */}
      <div
        className="card-overlay absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 80%)',
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div
        className="card-content absolute bottom-0 left-0 w-full p-8"
        style={{ opacity: 0.7, transform: 'translateY(10px)' }}
      >
        <span
          className="text-sm uppercase tracking-widest mb-2 block"
          style={{ color: '#4a8eff' }}
        >
          {project.category}
        </span>
        <h3 className="font-['Playfair_Display',serif] text-2xl md:text-3xl mb-3 text-white">
          {project.title}
        </h3>
        <p
          className="card-description text-base text-soft-white/70 leading-relaxed"
          style={{ opacity: 0, fontFamily: "'Inter', sans-serif" }}
        >
          {project.description}
        </p>
      </div>
    </div>
  );
}
