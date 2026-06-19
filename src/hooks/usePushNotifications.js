import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const VAPID_PUBLIC_KEY = 'BLhAZwYIX6kkRfJ3eyRO8hK2cUc5p0jOunZhm0NJmJvQdukJ_cN-sh7ChebQSRCvwqzx8uWZoZ_XHN8jzTsN0jA'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

async function registerSW() {
  if (!('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.register('/sw.js', { scope: '/' })
  } catch { return null }
}

async function subscribe(registration) {
  try {
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })
    return sub
  } catch { return null }
}

export function usePushNotifications(username) {
  const subRef = useRef(null)

  const storeSubscription = useCallback(async (subscription) => {
    if (!username || !subscription?.endpoint) return
    const json = subscription.toJSON()
    if (!json.keys?.p256dh || !json.keys?.auth) return
    try {
      await supabase.from('app_settings').upsert({
        key: `push_${username.toLowerCase()}`,
        value: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
        }),
      }, { onConflict: 'key' })
      subRef.current = subscription
    } catch { /* offline */ }
  }, [username])

  const unsubscribe = useCallback(async () => {
    if (subRef.current) {
      try { await subRef.current.unsubscribe() } catch { /* ignore */ }
      subRef.current = null
    }
    if (username) {
      try {
        await supabase.from('app_settings').delete().eq('key', `push_${username.toLowerCase()}`)
      } catch { /* ignore */ }
    }
  }, [username])

  useEffect(() => {
    if (!username || !('serviceWorker' in navigator) || !('PushManager' in window)) return

    let cancelled = false
    Notification.requestPermission().then(perm => {
      if (perm !== 'granted' || cancelled) return
      registerSW().then(reg => {
        if (!reg || cancelled) return
        reg.pushManager.getSubscription().then(existing => {
          if (cancelled) return
          if (existing) {
            storeSubscription(existing)
          } else {
            subscribe(reg).then(sub => {
              if (sub && !cancelled) storeSubscription(sub)
            })
          }
        })
      })
    })

    return () => { cancelled = true }
  }, [username, storeSubscription])

  return { unsubscribe }
}
