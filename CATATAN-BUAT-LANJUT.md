# CATATAN BUAT LANJUT

> Last: 19 Jun 2026 ~12:30

## ✅ Done this session

### Security Layer
- PIN gate modal on Landing → check Supabase `app_settings.access_pin` → stored in localStorage
- "Jelajahi tanpa nama" deleted (bypass PIN — security hole)
- Easter egg "klik judul 3x" deleted (same reason)

### Push Notification (full stack)
- Service Worker (`public/sw.js`) — push handler + notification click
- Hook (`usePushNotifications.js`) — register SW, subscribe with VAPID, store in `app_settings`
- Dashboard integration — subscribes on mount
- `api/send-push.mjs` — Vercel serverless function using `web-push` npm
- BibleWalk triggers: mark as read → push to partner, save note → push to partner

### Deploy
- Committed & pushed to GitHub `master`
- VAPID keys generated (public in client, private = Vercel env var)
- Redeploy triggered (with existing build cache)
- Note: VAPID_PRIVATE_KEY belum di-set di Vercel env — harus manual

## Next action (priority)

1. **Set VAPID_PRIVATE_KEY di Vercel**:
   - Buka `https://vercel.com/stylenecy/angel-space/settings/environment-variables`
   - Key: `VAPID_PRIVATE_KEY`, Value: **ambil dari `.env.local` lokal / catatan pribadi Dex** (jangan tulis di file ke-commit), Sensitive: ✅

2. **Bible Walk polish** (kalau mau):
   - After mark-read: auto-advance to next chapter or show confirmation
   - Better book navigation (filter by testament, search)
   - Show partner's progress overlay on same tile map

3. **In-app notification bell** (next nice-to-have):
   - Unread count badge
   - Feed of partner's activity (read chapter, wrote note)

4. **Kebun Hati realm** (post-Bible polish):
   - Daily journaling with mood selector
   - Timeline view of past entries

## Blocker

- VAPID_PRIVATE_KEY belum diset → push notif will fail silently
- Angel needs to visit site and grant notif permission for push to work

## Notes

- Key decision this session: push subscription stored in `app_settings` table (key: `push_{username}`), NOT a separate `push_subscriptions` table — avoids needing DDL on Supabase
- `api/send-push.mjs` uses `.mjs` extension for explicit ESM in Vercel
- VAPID public key is hardcoded in client (safe — it's meant to be public)
- Service worker and API route only work in production (HTTPS required for push)
