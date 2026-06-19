import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidPublicKey = 'BLhAZwYIX6kkRfJ3eyRO8hK2cUc5p0jOunZhm0NJmJvQdukJ_cN-sh7ChebQSRCvwqzx8uWZoZ_XHN8jzTsN0jA'

if (!vapidPrivateKey) {
  console.warn('[send-push] VAPID_PRIVATE_KEY not set')
}

webpush.setVapidDetails(
  'mailto:dex@angel-space.app',
  vapidPublicKey,
  vapidPrivateKey || ''
)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!vapidPrivateKey) {
    return res.status(500).json({ error: 'VAPID_PRIVATE_KEY not configured' })
  }

  const { target_username, title, body, url } = req.body
  if (!target_username || !title) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', `push_${target_username.toLowerCase()}`)
      .maybeSingle()

    if (error || !data) {
      return res.status(404).json({ error: 'No subscription found' })
    }

    let subData
    try {
      subData = JSON.parse(data.value)
    } catch {
      return res.status(500).json({ error: 'Invalid subscription data' })
    }

    const subscription = {
      endpoint: subData.endpoint,
      keys: {
        p256dh: subData.p256dh,
        auth: subData.auth,
      },
    }

    const payload = JSON.stringify({
      title,
      body: body || '',
      url: url || '/',
      icon: '/favicon.png',
      badge: '/favicon.png',
    })

    await webpush.sendNotification(subscription, payload)

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('[send-push]', err)
    if (err.statusCode === 410) {
      // subscription expired — clean up
      await supabase.from('app_settings').delete().eq('key', `push_${target_username.toLowerCase()}`)
      return res.status(410).json({ error: 'Subscription expired, removed' })
    }
    res.status(500).json({ error: 'Push send failed' })
  }
}
