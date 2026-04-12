import { useState, useEffect, createContext, useContext } from 'react'

const STORAGE_KEY = 'angel_space_username'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [username, _setUsername] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      _setUsername(stored.trim())
    }
    setLoading(false)
  }, [])

  const setUsername = (name) => {
    const trimmed = (name || '').trim()
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed)
      _setUsername(trimmed)
    }
  }

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY)
    _setUsername(null)
  }

  const profile = username ? { display_name: username, username } : null

  return (
    <AuthContext.Provider value={{ username, profile, loading, setUsername, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
