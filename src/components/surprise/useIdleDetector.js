import { useEffect, useRef, useCallback } from 'react'

/**
 * useIdleDetector — detects user inactivity and triggers callback.
 * @param {number} idleTimeMs - Time in ms before triggering (default 30000)
 * @param {Function} onIdle - Callback when idle
 * @param {boolean} enabled - Toggle on/off
 */
export function useIdleDetector(idleTimeMs = 30000, onIdle, enabled = true) {
  const timerRef = useRef(null)
  const onIdleRef = useRef(onIdle)

  // Keep ref updated
  useEffect(() => {
    onIdleRef.current = onIdle
  }, [onIdle])

  const resetTimer = useCallback(() => {
    if (!enabled) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onIdleRef.current?.()
    }, idleTimeMs)
  }, [idleTimeMs, enabled])

  useEffect(() => {
    if (!enabled) return

    const events = ['mousedown', 'mousemove', 'keypress', 'touchstart', 'scroll', 'click']
    events.forEach(event => {
      window.addEventListener(event, resetTimer, true)
    })

    // Start timer
    resetTimer()

    return () => {
      clearTimeout(timerRef.current)
      events.forEach(event => {
        window.removeEventListener(event, resetTimer, true)
      })
    }
  }, [enabled, resetTimer])

  // Manual reset
  return {
    reset: resetTimer,
  }
}
