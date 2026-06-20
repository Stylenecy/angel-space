# PROJECT_MASTER — Angel's Space

> **Created:** 19 Jun 2026, 02:26
> **Last Session:** 21 Jun 2026 (Minggu) — Sesi 4: review + verify Sesi-3 work, build/boot GREEN, polish debug-string, prep SIAP-PUSH.
> **Deployed:** ✅ `https://angel-space.vercel.app` (master@d734e6e) — Sesi 3+4 work LOCAL, belum di-push.

---

## 🆕 SESSION 4 — 21 Jun 2026 (Minggu ~05:00) — REVIEW + VERIFY + SIAP-PUSH

**Goal sesi:** tuntasin Sesi-3 sampai siap push & live. Review build, fix bug sisa, pastiin akun terpisah + bell + Bible Walk jalan.

**✅ DIVERIFIKASI (oleh Claude, langsung dijalanin):**
- `npm run build` → **GREEN** exit 0, 547 modules, `dist/assets/index-*.js` 651kB (warning chunk >500kB pre-existing, non-blocking). Build dijalanin 2× (sebelum & sesudah edit).
- `npm run dev` → **boot bersih** di `localhost:5173` (4.3s, no error). Root URL balikin **HTTP 200**, `<div id="root">` + `src/main.jsx` ke-wire. App mount OK.
- **Code review penuh** 3 fitur (baca tiap file):
  - **Akun terpisah** ✅ — `accounts.js` canonical + `useAuth` canonicalize on read/write + `Login` picker 2 kartu + BibleWalk semua read `.eq('username', me)`. Logic benar, scoped per-orang. Flow ganti-akun: BibleWalk "ganti ⇄" → signOut → Landing → PIN → Login picker → pick → Dashboard. Jalan. (PIN re-prompt tiap masuk = memang security model, bukan bug.)
  - **Bell notif** ✅ — `usePartnerActivity` (partner rows 14hr) + `NotificationBell` (badge unread, dropdown, tap→bible) ke-mount di navbar Dashboard. Push path lama utuh.
  - **Bible Walk** ✅ — post-read toast + next-chapter rollover + book-jump modal + 2 ring (gold Kamu / green partner) + toggle Progres. Bugfix data-merge Sesi-3 (filter username) confirmed di kode.
- **Lint**: 42 error ESLint TAPI semua pre-existing style (`set-state-in-effect`, `no-unused-vars`) — Vite build pakai `vite build` bukan eslint, jadi **tidak blokir deploy**. Tidak ada error baru dari fitur Sesi-3/4.

**🔧 DIFIX sesi ini:**
- Hapus **debug string `entrance: {type}`** yang ke-render samar (opacity 0.15) di Landing.jsx + Dashboard.jsx. App romantis nggak boleh tampil teks debug. Build tetap green abis hapus.

**🆕 SESI 4b — REQUEST DEX (akun-lock + Three.js + font + DEPLOY):**
- **Akun lock device** — switch akun (Dashboard ✕ + BibleWalk "ganti ⇄") sekarang minta `window.confirm` dulu. Sekali pilih akun di HP, ke-lock; ga bisa gonta-ganti ga sengaja → progres ga ketuker. (Picker udah fixed Dex/Angel, ga ada free-text lagi.)
- **Data ga perlu reset** — tiap row `bible_progress` udah ke-tag `username` dari awal (bug Sesi-3 cuma di *baca* tanpa filter). Progres Angel = punya Angel, Dex = Dex. Udah bener.
- **Three.js live background** — `src/components/LiveBackground.jsx` (vanilla three, lazy-split). Particle field 2-layer parallax (gold/soft-white/calm-blue/pink), additive glow, pointer+gyro parallax, mobile-tuned (DPR≤1.5, count½ di HP), pause pas tab hidden, hormat prefers-reduced-motion. Mount di **Landing + Login + Dashboard** (di balik StarField — StarField pixel tetep di atas). Bible Walk SENGAJA ga dikasih (biar minimal/kebaca).
- **Font Alkitab diperbesar** — verse `text-sm sm:text-base` → `text-base sm:text-lg`, `leading-loose`, no. ayat lebih gede.
- **DB update boleh nyusul post-deploy** — separation client-side, SQL opsional/additive. Deploy aman duluan, SQL kapan aja.

**⚠️ BELUM diverifikasi Claude (butuh browser/HP + Supabase live — masuk LANGKAH MANUAL DEX):**
- Click-through asli di browser (login picker → mark read → ring kepisah gold/green).
- Round-trip Supabase nyata (insert/upsert `bible_progress`, baca app_settings).
- Push notif end-to-end (butuh VAPID_PRIVATE_KEY + Angel grant izin).

**📦 COMMIT:** Sesi 3+4 di-commit lokal `master@52609e3` (11 file, +882/-156, **NO co-author**, belum di-push). Dev server idup di `localhost:5173` buat review.

**🔴 LANGKAH MANUAL DEX (1-klik tiap nomor):**
1. **Review browser** — buka `http://localhost:5173` (dev server udah jalan). Cek: Landing→PIN→Login 2 kartu → pick Dex → Bible Walk: mark read, ring "Kamu" gold naik. Ganti ⇄ → pick Angel → ring kepisah. Bell di Dashboard.
2. **Push (= auto-deploy Vercel):** `git push origin master`
3. **Vercel env** — set `VAPID_PRIVATE_KEY` (Sensitive ✅) di `vercel.com/stylenecy/angel-space/settings/environment-variables`. **Value-nya ambil dari `.env.local` lokal / catatan pribadi Dex — JANGAN ditulis di file yang ke-commit.** Tanpa ini push-notif gagal diam-diam.
4. **Supabase SQL** (opsional, additive, no drop) — di SQL editor:
   ```sql
   ALTER TABLE bible_progress ADD CONSTRAINT bible_progress_user_book_ch UNIQUE (username, book, chapter);
   CREATE INDEX IF NOT EXISTS idx_bible_progress_username ON bible_progress (username);
   UPDATE bible_progress SET username='Dex'   WHERE lower(username)='dex';
   UPDATE bible_progress SET username='Angel' WHERE lower(username)='angel';
   ```
   (Constraint bikin upsert catatan dedupe bener; UPDATE narik legacy row non-kanonik ke akun yg betul.)

---

## 🆕 SESSION 3 — 20 Jun 2026 (LOCAL, ⚠️ BELUM DI-PUSH — Dex review `npm run dev` dulu)

> Dikerjain 2 workflow Claude (gas mode). Semua local-only, build `npm run build` GREEN, **TIDAK ada git push/deploy** (app live Angel — Dex yang push sendiri abis review).

**🐞 BUG NYATA difix (penting):** `BibleWalk.fetchProgress()` + `fetchNotes()` dulu baca SEMUA row `bible_progress` **tanpa filter username** → ring/tile/notes tiap orang diam-diam = gabungan Dex+Angel. Sekarang semua read `.eq('username', me)`.

**Yang berubah:**
1. **Bible Walk polish** — konfirmasi post-read + tombol "next chapter" (rollover antar kitab) + modal book-jump 66 kitab (grouped PL/PB, read-count per kitab). Progress Ring + Tile Map tetap jalan.
2. **Bell notif in-app** — `NotificationBell.jsx` + `usePartnerActivity.js` di navbar Dashboard, badge unread, dropdown aktivitas partner 14 hari, tap → Bible Walk. Push lama UTUH.
3. **Akun terpisah (first-class)** — `src/lib/accounts.js` (`canonicalUsername` snap `dex`→`Dex`, `partnerOf`). Login = **picker 2 kartu** ("masuk sebagai Dex / Angel") di balik PIN, bukan free-text. Pill "kamu: {name}" + "ganti ⇄" buat switch/signout.
4. **UI pemisahan jelas** — 2 ring beda: **"Kamu" (gold)** vs **partner (green)**; tab Progres ada toggle Kamu/{partner}.

**Files:** `src/lib/accounts.js` (baru), `useAuth.jsx`, `Login.jsx` (rewrite), `BibleWalk.jsx`, `usePartnerActivity.js`, `NotificationBell.jsx` (baru), `.agent/changelog_20Jun.md`.

**🔴 STEP DEX (sebelum/sesudah push):**
1. Review lokal: `npm run dev` → localhost:5173 → cek Bible Walk + bell + login picker.
2. Kalau oke → **git push** (auto-deploy Vercel).
3. **Supabase (opsional/additive, no schema drop):** pastikan `UNIQUE (username, book, chapter)` di `bible_progress`; index `idx_bible_progress_username`; kalau ada legacy row non-kanonik → `UPDATE bible_progress SET username='Dex' WHERE lower(username)='dex';` (sama buat Angel).
4. **Set `VAPID_PRIVATE_KEY`** di Vercel env (push notif blm jalan tanpa ini).

**Known gaps:** separation client-side (anon key teknisnya msh bisa baca dua username — fine buat ruang privat 2 orang; tambah RLS kalau mau server-enforced). localStorage fallback offline msh per-device.

> **Manus super-prompt** (kalau mau rebuild full-stack flashy Three.js): `_Dex-Brain\Manus-Prompt-AngelSpace.md`.

---

## 🎯 Visi

Digital sanctuary untuk Dex & Angel — tempat berdua yang bebas berbagi hati, pikiran, jiwa.
Bukan pengganti WhatsApp, tapi **ruang yang sengaja didatangi** — intentionally visited space.

---

## ⚖️ Keputusan Arsitektur (Final)

- **1 URL, multiple realm** — satu proyek Vite+React, tidak dipisah
- **State management via `useState` + props** — `setPage()` pattern, bukan `react-router-dom`
- **Auth:** Name-based login (localStorage) + shared PIN (Supabase `app_settings.access_pin`)
- **Partner detection:** Hardcoded flip ("Dex" ↔ "Angel")
- **Data layer:** Supabase (anon key, RLS disabled) + localStorage fallback
- **Bible text:** GitHub raw JSON (tobiasagyasta/alkitab-api) — TB (Terjemahan Baru LAI)
- **Push notification:** Web Push API + VAPID + Service Worker + Vercel API function
- **Deploy:** Vercel, auto-deploy from GitHub `master`
- **Dev:** `localhost:5173` (vite dev server)

---

## ✅ Done

### Routing & Auth
- ✅ `App.jsx` — `page` state-based routing (landing/login/dashboard/bible/menu/mood/feed/world/dll)
- ✅ `Login.jsx` — name-based entry (Dex / Angel)
- ✅ `useAuth.jsx` — localStorage-based, profile from Supabase `profiles`
- ✅ `Landing.jsx` — beautiful public face with starfield, entrance animations, subway
- ✅ **PIN Gate** — modal overlay from Landing's "masuk ✨" button. Compares against Supabase `app_settings.access_pin` (value: `250526`). PIN saved in localStorage.
- ✅ "Jelajahi tanpa nama" — **DELETED** (security hole)
- ✅ Easter egg (click title 3x → hidden page) — **DELETED** (bypasses PIN)

### Bible Walk Realm
- ✅ Book/chapter selector with scrollable grid (`/BibleWalk.jsx`)
- ✅ Mark chapter as read → upsert to `bible_progress` (via `username` field)
- ✅ Write notes per chapter → upsert with note, conflict on `username,book,chapter`
- ✅ **Progress Ring** (circular percentage) + **Tile Map** (grid of read chapters per book)
- ✅ **Bible text display** — fetches from GitHub raw JSON (TB), cleaned of cross-ref artifacts
- ✅ **Partner notification banner** — shows what Angel/Dex has read since last check (`fetchPartnerUpdates`)

### Push Notification (NEW — 19 Jun)
- ✅ `public/sw.js` — Service Worker handles `push` event → show notification, `notificationclick` → focus/open
- ✅ `usePushNotifications.js` — Hook that registers SW, subscribes (VAPID public key), stores in `app_settings` (key: `push_dex` / `push_angel`)
- ✅ `Dashboard.jsx` — calls `usePushNotifications(profile?.username)` on mount
- ✅ `api/send-push.mjs` — Vercel serverless function, reads subscription from `app_settings`, sends via `web-push`
- ✅ **BibleWalk trigger** — `markRead()` calls `sendPushNotification(partner, ...)` after upsert
- ✅ **Note trigger** — `saveNote()` calls `sendPushNotification(partner, ...)` for non-empty notes

### Database (Supabase)
- ✅ `bible_progress` — book, chapter, username, note, created_at, updated_at
- ✅ `app_settings` — key/value (PIN: `access_pin` = `250526`, push subs: `push_dex` / `push_angel`)
- ✅ `profiles` — username, display_name, avatar_url (RLS disabled for all tables)

### Deployment
- ✅ GitHub remote: `https://github.com/Stylenecy/angel-space.git`
- ✅ Vercel auto-deploy from `master` branch
- ✅ VAPID keys generated (public in client, private in Vercel env `VAPID_PRIVATE_KEY`)
- ✅ Project live at `https://angel-space.vercel.app`

---

## 🗺️ Prioritas Selanjutnya

| Prioritas | Item | Status |
|-----------|------|--------|
| ✅ P1 | **Bible Walk — polish** (post-read flow, book nav, akun terpisah + bugfix) | DONE 20 Jun (local, blm push) |
| ✅ P2 | **In-app notification system** (bell icon, unread count) | DONE 20 Jun (local, blm push) |
| 🟡 P2 | **Kebun Hati** — daily journal realm | Not started |
| 🟡 P2 | **Meja Surat** — timed messages for partner | Not started |
| 🟢 P3 | **Ruang Nostalgia** — photo timeline | Not started |
| 🟢 P3 | **Dunia Utama** — isometric/tile-based exploration | Not started |

---

## 🎨 Aesthetic Direction

- **Pixel-art RPG** aesthetic for main world (Landing, Dashboard portals, pixel-shadow buttons)
- **Sacred/minimal** for Bible realm (high-contrast text, candle emojis, gold accent)
- Font: `Press Start 2P` (pixel) + system sans-serif for body text
- Palette: midnight (#0a0a1a), deep-blue (#0f0f2a), warm-gold (#d4a853), soft-white (#e8e0d4), pixel-green (#4ade80)

---

## 🛠️ Tech Stack

- Vite 8 + React 19 + Tailwind CSS v4 + Framer Motion 12
- Supabase (DB only — no auth provider)
- `web-push` (npm) — for Vercel API serverless push
- VAPID (Web Push Protocol) — ECDSA P-256 key pair
- Vercel (deploy + serverless functions from `api/` directory)

---

## ⚠️ Golden Rules (revised)

1. **Fungsi dulu, UI belakangan** — jangan perfeksionis
2. **Security-aware** — shared PIN + localStorage, no anonymous backdoor
3. **Disk = source of truth** — write decisions to state files as you go
4. **Selesai di satu sesi** — jangan tinggal setengah-setengah
5. **Mobile-first** — harus akses dari HP, touch-friendly
6. **Notif harus gacor** — push notif ke HP pas partner baca/nulis (done ✅)
