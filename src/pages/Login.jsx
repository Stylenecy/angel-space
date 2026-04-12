import { useState, useRef, useEffect } from 'react'
import StarField from '../components/StarField'
import { useAuth } from '../hooks/useAuth'

export default function Login({ setPage }) {
  const { setUsername } = useAuth()
  const [name, setName] = useState('')
  const [showField, setShowField] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setShowField(true), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (showField && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showField])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setUsername(name.trim())
    setPage('dashboard')
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden select-none">
      <StarField />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <div
          className={`w-14 h-14 mb-8 border-2 border-warm-gold/40 bg-deep-blue flex items-center justify-center animate-float transition-all duration-700 ease-out ${
            showField ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <img
            src="/assets/icons/mini-angel-wave.png"
            alt="angel wave"
            className="pixel-render w-full h-full object-contain"
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
          />
          <span className="hidden text-2xl">🌙</span>
        </div>

        <h1
          className={`font-pixel text-[0.65rem] md:text-[0.75rem] text-warm-gold mb-2 tracking-wide text-center transition-all duration-700 ease-out ${
            showField ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          siapa namamu? 🤍
        </h1>
        <p
          className={`font-sans text-sm text-soft-white/40 mb-10 text-center transition-all duration-700 ease-out ${
            showField ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          cukup ketik nama, langsung masuk
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div
            className={`flex flex-col gap-2 transition-all duration-700 ease-out ${
              showField ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <label className="font-pixel text-[0.5rem] text-soft-white/50 tracking-widest">
              NAMA
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Angel, Dex, siapa aja..."
              maxLength={30}
              required
              className="
                w-full bg-deep-blue border-2 border-soft-white/20
                focus:border-warm-gold focus:outline-none
                px-4 py-3 font-sans text-base text-soft-white
                placeholder:text-soft-white/25
                transition-colors duration-200
              "
            />
          </div>

          <div
            className={`transition-all duration-700 ease-out ${
              showField ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <button
              type="submit"
              disabled={!name.trim()}
              className="pixel-btn w-full py-4 mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              masuk ✨
            </button>
          </div>
        </form>

        <button
          onClick={() => setPage('landing')}
          className={`mt-10 font-pixel text-[0.5rem] tracking-widest text-soft-white/20 hover:text-soft-white/50 transition-colors cursor-pointer ${
            showField ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          &lt; kembali
        </button>
      </div>
    </section>
  )
}
