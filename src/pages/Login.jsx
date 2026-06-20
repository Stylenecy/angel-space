import { useState, useEffect, lazy, Suspense } from 'react'
import StarField from '../components/StarField'
import { useAuth } from '../hooks/useAuth'
import { ACCOUNTS } from '../lib/accounts'
const LiveBackground = lazy(() => import('../components/LiveBackground'))

// Account picker — identity is now first-class. Behind the shared PIN the
// person explicitly chooses *which account* they are (Dex or Angel). That
// choice scopes every Bible-progress read/write to that username, so each
// person's progress is unambiguously their own.
const ACCOUNT_META = {
  Dex:   { icon: '/assets/icons/anjing-tidur.png',   emoji: '🐶', tint: 'border-calm-blue/40 hover:border-calm-blue/80 hover:shadow-calm-blue/20' },
  Angel: { icon: '/assets/icons/mini-angel-wave.png', emoji: '🌙', tint: 'border-warm-gold/40 hover:border-warm-gold/80 hover:shadow-warm-gold/20' },
}

export default function Login({ setPage }) {
  const { setUsername } = useAuth()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 400)
    return () => clearTimeout(t)
  }, [])

  const pick = (name) => {
    setUsername(name)
    setPage('dashboard')
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden select-none">
      <Suspense fallback={null}><LiveBackground /></Suspense>
      <StarField />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <h1
          className={`font-pixel text-[0.65rem] md:text-[0.75rem] text-warm-gold mb-2 tracking-wide text-center transition-all duration-700 ease-out ${
            show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          kamu siapa? 🤍
        </h1>
        <p
          className={`font-sans text-sm text-soft-white/40 mb-10 text-center transition-all duration-700 ease-out ${
            show ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          pilih akunmu — progres bacaan kebaca milikmu sendiri
        </p>

        <div className="w-full flex flex-col gap-4">
          {ACCOUNTS.map((name, i) => {
            const meta = ACCOUNT_META[name]
            return (
              <button
                key={name}
                onClick={() => pick(name)}
                className={`
                  pixel-card flex items-center gap-4 p-4 border-2 transition-all duration-300 cursor-pointer
                  ${meta.tint}
                  ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: `${300 + i * 120}ms` }}
              >
                <div className="w-12 h-12 shrink-0 border-2 border-warm-gold/30 bg-deep-blue flex items-center justify-center">
                  <img
                    src={meta.icon}
                    alt={name}
                    className="pixel-render w-full h-full object-contain"
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
                  />
                  <span className="hidden text-2xl">{meta.emoji}</span>
                </div>
                <div className="text-left">
                  <span className="block font-pixel text-[0.6rem] text-warm-gold tracking-wide">masuk sebagai</span>
                  <span className="block font-sans text-lg text-soft-white">{name}</span>
                </div>
                <span className="ml-auto font-pixel text-[0.6rem] text-soft-white/30">→</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setPage('landing')}
          className={`mt-10 font-pixel text-[0.5rem] tracking-widest text-soft-white/20 hover:text-soft-white/50 transition-colors cursor-pointer ${
            show ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          &lt; kembali
        </button>
      </div>
    </section>
  )
}
