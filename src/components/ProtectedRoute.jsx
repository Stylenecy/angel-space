import { useAuth } from '../hooks/useAuth'

/**
 * Wrap any page that requires login.
 * If not authenticated → shows Login instead.
 */
export default function ProtectedRoute({ children, fallback }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <p className="font-pixel text-[0.6rem] text-warm-gold animate-pixel-blink">
          loading...
        </p>
      </div>
    )
  }

  if (!user) return fallback ?? null

  return children
}
