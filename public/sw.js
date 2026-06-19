self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    const title = data.title || 'Angel\'s Space'
    const body = data.body || ''
    const icon = data.icon || '/favicon.png'
    const badge = '/favicon.png'
    const url = data.url || '/'

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon,
        badge,
        data: { url },
        vibrate: [100, 50, 100],
        requireInteraction: true,
        silent: false,
      })
    )
  } catch (e) {
    console.error('[SW] Push parse error:', e)
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const matchingClient = windowClients.find((c) => c.url === url)
      if (matchingClient) {
        matchingClient.focus()
      } else {
        clients.openWindow(url)
      }
    })
  )
})
