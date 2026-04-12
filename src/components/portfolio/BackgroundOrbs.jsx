import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

/**
 * BackgroundOrbs — Floating blurred orbs with Anime.js parallax mouse movement.
 * Replaces Framer Motion with Anime.js for richer, physics-based animation.
 */
export default function BackgroundOrbs() {
  const containerRef = useRef(null);

  useEffect(() => {
    const orbs = containerRef.current?.querySelectorAll('.orb');
    if (!orbs?.length) return;

    // Initial floating animation with staggered timing
    const floatAnimation = animate(orbs, {
      translateY: [
        { to: -40, duration: 4000 },
        { to: 20, duration: 3000 },
        { to: 0, duration: 3000 },
      ],
      translateX: [
        { to: 25, duration: 5000 },
        { to: -15, duration: 4000 },
        { to: 0, duration: 3000 },
      ],
      scale: [
        { to: 1.08, duration: 6000 },
        { to: 0.95, duration: 4000 },
        { to: 1, duration: 4000 },
      ],
      ease: 'inOut(2)',
      loop: true,
      alternate: true,
      delay: stagger(1500),
    });

    // Mouse parallax effect (using direct DOM manipulation for performance)
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 25;
        const currentX = parseFloat(orb.dataset.baseX || 0);
        const currentY = parseFloat(orb.dataset.baseY || 0);
        animate(orb, {
          translateX: currentX + x * speed,
          translateY: currentY + y * speed,
          duration: 800,
          ease: 'out(3)',
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      floatAnimation.pause();
    };
  }, []);

  const orbConfigs = [
    {
      size: 450,
      gradient: 'radial-gradient(circle, rgba(128,0,32,0.5) 0%, rgba(128,0,32,0) 70%)',
      position: { top: '-120px', left: '-120px' },
    },
    {
      size: 550,
      gradient: 'radial-gradient(circle, rgba(0,68,255,0.35) 0%, rgba(0,68,255,0) 70%)',
      position: { bottom: '-180px', right: '-180px' },
    },
    {
      size: 350,
      gradient: 'radial-gradient(circle, rgba(106,13,173,0.3) 0%, rgba(106,13,173,0) 70%)',
      position: { top: '35%', left: '35%' },
    },
    {
      size: 200,
      gradient: 'radial-gradient(circle, rgba(212,168,83,0.15) 0%, rgba(212,168,83,0) 70%)',
      position: { top: '60%', right: '10%' },
    },
  ];

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Radial gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, #1a0b2e 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, #0f1c3f 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #0a0514 0%, transparent 60%)
          `,
        }}
      />

      {/* Animated orbs */}
      {orbConfigs.map((orb, i) => (
        <div
          key={i}
          className="orb absolute rounded-full"
          data-base-x="0"
          data-base-y="0"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.gradient,
            filter: 'blur(80px)',
            ...orb.position,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
