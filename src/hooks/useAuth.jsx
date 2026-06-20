import { useState, useEffect, createContext, useContext } from 'react'
import { canonicalUsername, partnerOf } from '../lib/accounts'

const STORAGE_KEY = 'angel_space_username'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [username, _setUsername] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      // Canonicalize on read so old free-text logins snap to a clean account.
      const canon = canonicalUsername(stored)
      if (canon) {
        _setUsername(canon)
        if (canon !== stored) localStorage.setItem(STORAGE_KEY, canon)
      }
    }
    setLoading(false)
  }, [])

  const setUsername = (name) => {
    const canon = canonicalUsername(name)
    if (canon) {
      localStorage.setItem(STORAGE_KEY, canon)
      _setUsername(canon)
    }
  }

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY)
    _setUsername(null)
  }

  const partner = partnerOf(username)
  const profile = username ? { display_name: username, username } : null

  return (
    <AuthContext.Provider value={{ username, partner, profile, loading, setUsername, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
