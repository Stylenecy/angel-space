import { useEffect, useRef } from 'react';

/**
 * StarField — pixel-art style twinkling stars.
 * Each star is a crisp square (2×2 or 4×4 px) instead of round dots.
 */
export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // disable anti-aliasing for crisp pixel look
    ctx.imageSmoothingEnabled = false;

    let animationId;
    let stars = [];

    const STAR_COUNT = 100;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.imageSmoothingEnabled = false;
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        // snap positions to a 2px grid for pixel-perfect placement
        const size = Math.random() > 0.7 ? 4 : 2;
        stars.push({
          x: Math.floor(Math.random() * canvas.width / 2) * 2,
          y: Math.floor(Math.random() * canvas.height / 2) * 2,
          size,
          baseAlpha: Math.random() * 0.5 + 0.3,
          alpha: 0,
          // stepped twinkle speed
          speed: Math.random() * 0.006 + 0.002,
          phase: Math.random() * Math.PI * 2,
          // some stars have a subtle color tint
          color: Math.random() > 0.85
            ? [200, 220, 255]  // blue tint
            : Math.random() > 0.8
              ? [255, 230, 180] // warm tint
              : [255, 255, 255], // white
        });
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        // stepped alpha (quantize to 4 levels for pixel feel)
        const raw = star.baseAlpha * (0.5 + 0.5 * Math.sin(time * star.speed + star.phase));
        star.alpha = Math.round(raw * 4) / 4;

        const [r, g, b] = star.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.alpha})`;
        // draw a crisp square — no arcs
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createStars();
    animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      resize();
      createStars();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
