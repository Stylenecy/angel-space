import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

/**
 * ContactSection — Elegant CTA with social links.
 * Pure Anime.js v4 — no Framer Motion.
 */
export default function ContactSection({ profile }) {
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          // Card entrance — scale + fade
          animate(el.querySelector('.contact-card'), {
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.97, 1],
            duration: 800,
            ease: 'out(4)',
          });

          // Heading
          animate(el.querySelector('.contact-heading'), {
            opacity: [0, 1],
            translateY: [25, 0],
            duration: 600,
            delay: 200,
            ease: 'out(4)',
          });

          // Description
          animate(el.querySelector('.contact-desc'), {
            opacity: [0, 0.6],
            translateY: [15, 0],
            duration: 500,
            delay: 400,
            ease: 'out(3)',
          });

          // CTA button — special entrance
          animate(el.querySelector('.contact-cta'), {
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.95, 1],
            duration: 600,
            delay: 550,
            ease: 'out(4)',
          });

          // Social icons — staggered float up
          animate(el.querySelectorAll('.social-icon'), {
            opacity: [0, 1],
            translateY: [15, 0],
            scale: [0.8, 1],
            duration: 400,
            delay: stagger(80, { start: 700 }),
            ease: 'out(3)',
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const socialIcons = {
    instagram: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    github: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    dribbble: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.074c-3.282-.978-6.225-.462-8.76.912 1.686 2.76 2.918 5.772 3.612 8.892 3.008-1.872 5.098-5.12 5.148-9.804zm-7.14 10.452c-.732-3.228-2.004-6.222-3.726-8.94-3.282 1.728-7.044 2.25-11.136 1.662C1.772 19.956 5.46 23.222 10.02 23.874c.21.03.42.048.63.06.21-.012.42-.03.63-.066zm-12.336-3.378c3.726.582 7.182-.006 10.182-1.662-1.59-2.286-3.396-4.446-5.382-6.45-3.726 1.386-6.39 3.936-7.872 7.332-.372.858-.672 1.764-.918 2.718l.99-.938zm1.776-9.822c1.668-3.318 4.536-5.922 8.082-7.392 2.184 2.064 4.122 4.29 5.796 6.678-3.87 1.332-8.124 1.374-12.594.048-.456-.138-.894-.306-1.32-.486l.036-.848zm15.54-1.224c-1.608-2.316-3.462-4.476-5.526-6.456 3.666-1.092 7.044-.564 10.032 1.536-1.134 1.956-2.616 3.582-4.392 4.86-.054-.03-.114-.048-.174-.066.02.036.042.072.06.108z" />
      </svg>
    ),
  };

  return (
    <section ref={sectionRef} className="relative py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="contact-card glass-card p-12 md:p-16 rounded-3xl opacity-0 relative overflow-hidden"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Shimmer accents */}
          <div
            className="absolute top-0 left-0 w-full h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,68,255,0.15), transparent)',
            }}
          />

          <h2 className="contact-heading font-['Playfair_Display',serif] text-4xl md:text-5xl mb-6 opacity-0">
            Let&apos;s Create
          </h2>

          <p
            className="contact-desc text-base md:text-lg text-soft-white/60 mb-8 max-w-xl mx-auto leading-relaxed opacity-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Ready to elevate your digital presence? I&apos;m currently accepting new projects for 2026.
          </p>

          {/* CTA Button */}
          <a
            href={`mailto:${profile.email}`}
            className="contact-cta inline-block px-10 py-4 rounded-full font-semibold tracking-wider text-white opacity-0 transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #0044ff, #800020)',
              boxShadow: '0 8px 25px rgba(128,0,32,0.3)',
            }}
            onMouseEnter={(e) => {
              animate(e.currentTarget, {
                scale: 1.06,
                translateY: -3,
                duration: 250,
                ease: 'out(3)',
              });
            }}
            onMouseLeave={(e) => {
              animate(e.currentTarget, {
                scale: 1,
                translateY: 0,
                duration: 300,
                ease: 'out(3)',
              });
            }}
          >
            Get in Touch
          </a>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-10">
            {Object.entries(profile.socials).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-soft-white/40 hover:text-warm-gold transition-colors duration-300 opacity-0"
                aria-label={platform}
                onMouseEnter={(e) => {
                  animate(e.currentTarget, {
                    scale: 1.25,
                    translateY: -4,
                    duration: 250,
                    ease: 'out(3)',
                  });
                }}
                onMouseLeave={(e) => {
                  animate(e.currentTarget, {
                    scale: 1,
                    translateY: 0,
                    duration: 300,
                    ease: 'out(3)',
                  });
                }}
              >
                {socialIcons[platform]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
