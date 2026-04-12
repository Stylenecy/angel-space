import { useState } from 'react'
import StarField from '../components/StarField'
import { useAuth } from '../hooks/useAuth'

export default function Login({ setPage }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email)
    setLoading(false)
    if (error) {
      setError('gagal mengirim link. coba lagi ya.')
    } else {
      setSent(true)
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden select-none">
      <StarField />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm animate-fade-in">
        {/* ── Icon ── */}
        <div className="w-14 h-14 mb-8 border-2 border-warm-gold/40 bg-deep-blue flex items-center justify-center animate-float">
          <img
            src="/assets/icons/mini-angel-wave.png"
            alt="angel wave"
            className="pixel-render w-full h-full object-contain"
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
          />
          <span className="hidden text-2xl">🌙</span>
        </div>

        <h1 className="font-pixel text-[0.65rem] md:text-[0.75rem] text-warm-gold mb-2 tracking-wide text-center">
          Angel's Space
        </h1>
        <p className="font-sans text-sm text-soft-white/40 mb-10 text-center">
          masuk dulu ya 🤍
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-pixel text-[0.5rem] text-soft-white/50 tracking-widest">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emailmu@..."
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

            {error && (
              <p className="font-pixel text-[0.5rem] text-pixel-pink text-center leading-loose">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="pixel-btn w-full py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'mengirim...' : 'kirim magic link ✨'}
            </button>
          </form>
        ) : (
          /* ── Success state ── */
          <div className="w-full bg-deep-blue/80 border-2 border-pixel-green/40 p-8 text-center flex flex-col gap-4">
            <div className="text-3xl">📬</div>
            <p className="font-pixel text-[0.55rem] text-pixel-green leading-loose">
              link terkirim!
            </p>
            <p className="font-sans text-sm text-soft-white/60 leading-relaxed">
              Cek email <span className="text-warm-gold">{email}</span> dan klik link-nya untuk masuk.
            </p>
          </div>
        )}

        <button
          onClick={() => setPage('landing')}
          className="mt-10 font-pixel text-[0.5rem] tracking-widest text-soft-white/20 hover:text-soft-white/50 transition-colors cursor-pointer"
        >
          &lt; kembali
        </button>
      </div>
    </section>
  )
}
