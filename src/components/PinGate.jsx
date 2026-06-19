import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const PIN_STORAGE_KEY = 'angel-space-pin-verified'

export default function PinGate({ onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pin.trim()) return

    setChecking(true)
    setError('')

    const { data } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'access_pin')
      .maybeSingle()

    if (data && data.value === pin.trim()) {
      localStorage.setItem(PIN_STORAGE_KEY, 'true')
      onSuccess()
    } else {
      setError('PIN salah, coba lagi.')
    }
    setChecking(false)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-midnight/95 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-deep-blue border-2 border-warm-gold/20 p-6 sm:p-8 shadow-[4px_4px_0_0_#d4a853]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <p className="font-pixel text-[0.5rem] text-warm-gold/60 mb-1">MASUKKAN PIN</p>
            <p className="font-sans text-sm text-soft-white/30">ruang khusus kita berdua</p>
          </div>
          <input type="password" inputMode="numeric" maxLength={10} value={pin}
            onChange={e => { setPin(e.target.value); setError('') }}
            placeholder="• • • • • •"
            className="w-full bg-midnight border-2 border-soft-white/20 focus:border-warm-gold outline-none px-4 py-3 font-sans text-xl text-soft-white text-center tracking-[0.5em] placeholder:text-soft-white/15 transition-colors"
            autoFocus
          />
          {error && <p className="font-sans text-sm text-pixel-pink/70 text-center">{error}</p>}
          <button type="submit" disabled={!pin.trim() || checking}
            className="font-pixel text-[0.5rem] bg-deep-blue/80 border-2 border-warm-gold/50 text-warm-gold py-3 px-4 shadow-[3px_3px_0_0_#d4a853] hover:bg-warm-gold/20 active:translate-y-0.5 active:shadow-none transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed">
            {checking ? '...' : 'Buka ✨'}
          </button>
        </form>
      </div>
    </div>
  )
}
