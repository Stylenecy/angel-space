# Changelog — 20 Jun 2026

Two features shipped: **A) Bible Walk UX polish** and **B) In-app notification bell**.
Build verified GREEN (`npm run build`, 546 modules). No git commit/push performed — local only.

---

## A. Bible Walk UX polish (P1)

### `src/pages/BibleWalk.jsx`
- **Post-read confirmation toast**: after tapping "Tandai sudah baca", a green confirmation card now appears ("✓ {Kitab} {pasal} ditandai!") with a one-tap **next-chapter** button. If you're at the last chapter of a book it offers the next book's chapter 1; at the very end of the Bible it shows a gentle "sampai di akhir Alkitab" message instead.
- **Prev / Next chapter navigation**: a `◄ sebelumnya` / `selanjutnya ►` row sits above the mark-read button. Rolls over book boundaries (e.g. end of Kejadian → Keluaran 1, start of Keluaran → end of Kejadian). Buttons disable at the absolute first/last chapter of the Bible.
- **Quick book-jump modal**: new `⤵` button next to the Kitab dropdown opens a full-screen modal that groups all 66 books by **Perjanjian Lama / Perjanjian Baru**, shows per-book read count (`done/total`, green ✓ when complete), highlights the current book, and jumps to chapter 1 on tap.
- Navigation helpers added: `goTo(book, chapter)` (also smooth-scrolls to top), `goNextChapter`, `goPrevChapter`.
- `justRead` toast auto-clears whenever the book/chapter changes (existing effect extended), so it never lingers on the wrong chapter.
- Progress Ring, Tile Map (Progres tab), notes, verse text, and existing partner-update banner are all untouched and still work.

**Test locally** (`npm run dev` → http://localhost:5173):
1. Log in (e.g. `Angel`), open dashboard → **Bible Walk**.
2. Pick a book/chapter, tap **Tandai sudah baca** → green confirmation appears with `► Pasal N+1`. Tap it → jumps forward, scrolls to top, toast clears.
3. Mark the *last* chapter of a book → confirmation offers `► {NextBook} 1`.
4. Use `◄ sebelumnya` / `selanjutnya ►` to walk across a book boundary.
5. Tap the `⤵` button → modal opens; switch between PL/PB; tap any book → jumps there. Verify the read-count badges and the current-book highlight.
6. Switch to **Progres** tab → ring + tile map still render as before.

---

## B. In-app notification bell (P2)

### `src/hooks/usePartnerActivity.js` (new)
- Fetches the **partner's** recent `bible_progress` rows (reads + notes) from the last 14 days, ordered newest-first, limit 30. Partner resolution reuses the same `dex ↔ Angel` rule as BibleWalk.
- Tracks unread count via a `localStorage` key `angel-notif-last-seen` (ISO timestamp). Anything newer than "last seen" is unread. `markAllSeen()` stamps now.
- This is **additive** — it does not touch the push-notification path (`usePushNotifications` / `sendPushNotification`), so push still works exactly as before. (Uses a different localStorage key from BibleWalk's `angel-bible-partner-check`, so the two don't interfere.)

### `src/components/NotificationBell.jsx` (new)
- 🔔 bell button with an unread badge (pixel-pink, shows count or `9+`).
- Opens a dropdown listing partner activity: "{partner} baca {Kitab} {pasal}" or "nulis catatan di …" with the note preview (2-line clamp) and a relative timestamp ("baru aja", "N menit/jam/hari lalu"). Tapping any item closes the panel and navigates to Bible Walk.
- Opening the bell marks everything seen (badge clears). Tap-away backdrop + ✕ to close. Renders nothing if there is no resolvable partner.
- Styled to match: deep-blue panel, warm-gold border + `shadow-[3px_3px_0_0_#d4a853]`, pixel font headers, VT323 body.

### `src/pages/Dashboard.jsx`
- Imported and mounted `<NotificationBell username={profile?.username} onGoBible={() => setPage('bible')} />` in the navbar (right side, opposite the username/sign-out cluster). Existing `usePushNotifications(profile?.username)` call left intact.

**Test locally**:
1. Log in as `Angel`. The bell sits at the top-right of the dashboard navbar.
2. To see activity, have the **partner** (`Dex`) mark chapters / save notes in Bible Walk (or insert `bible_progress` rows for username `Dex`). Reload the dashboard → a pink unread badge shows the count.
3. Tap the bell → dropdown lists the reads/notes with relative times; badge clears. Tap an item → routes to Bible Walk.
4. Reload — previously-seen items no longer count as unread (only newer ones do).
5. Confirm push notifications still fire as before (unchanged code path).

---

## Files touched
- `src/pages/BibleWalk.jsx` (edited)
- `src/pages/Dashboard.jsx` (edited)
- `src/hooks/usePartnerActivity.js` (new)
- `src/components/NotificationBell.jsx` (new)

## Build status
`npm run build` → **PASS** (green, 546 modules). Pre-existing >500 kB chunk-size warning is unchanged and unrelated.

## Known gaps / notes
- Bell data is fetched on dashboard mount (no realtime subscription) — count refreshes on reload/revisit, not live. Fine for the current usage; could add a Supabase realtime channel later.
- "Seen" state is per-device (localStorage), matching the existing `PARTNER_CHECK_KEY` pattern in BibleWalk. Not synced across devices.
- Activity window is the last 14 days / 30 items; older history isn't shown in the bell (full history still lives in the Progres tab).
- Unread badge tops out at `9+`.

---

# Addendum — 20 Jun 2026 (later)

## C. Separate accounts + clear per-person Bible-progress separation (P0)

**Why:** login was free-text (`setUsername(anyString)`), and — critically — Bible Walk's `fetchProgress()` / `fetchNotes()` read **every** `bible_progress` row with *no username filter*. So "my" progress ring, tile map, and notes were actually the **union of both Dex and Angel**. Free-text names also meant `Dex` / `dex` / `Dexx` could silently fork one person into multiple accounts. Goal: each person's progress is unambiguously their own, visibly separated from the partner's. Non-breaking, no data destroyed.

### `src/lib/accounts.js` (new)
- Single source of truth for identity. Exports `ACCOUNTS = ['Dex', 'Angel']`, `canonicalUsername(name)` (snaps `dex`/`DEX`/`Dex` → canonical `Dex`; legacy/unknown names kept as-is so historical rows stay reachable), and `partnerOf(username)`.
- Pulled the helpers into their own module so `useAuth.jsx` no longer mixes component + non-component exports.

### `src/hooks/useAuth.jsx`
- Now **canonicalizes** the username on read AND on write via `canonicalUsername`. Old free-text logins snap to a clean `Dex`/`Angel` account on next load (and the localStorage value is rewritten to canonical).
- Context now also exposes `partner` (derived via `partnerOf`). `signOut` unchanged. Storage key unchanged (`angel_space_username`) → **no migration needed**, existing sessions keep working.

### `src/pages/Login.jsx` — rewritten as an explicit account picker
- Replaced the free-text name field with two clearly-labeled cards: **“masuk sebagai Dex”** / **“masuk sebagai Angel”** (Dex = calm-blue tint + anjing icon, Angel = warm-gold tint + angel-wave icon). Picking one calls `setUsername(canonical)` → dashboard.
- Still sits behind the shared PIN (Landing → PinGate → Login). Mobile-first card layout, midnight/gold pixel aesthetic preserved.

### `src/pages/BibleWalk.jsx` — the core data-separation fix
- **`fetchProgress()` now `.eq('username', me)`** — strictly MY chapters only. Same for **`fetchNotes()`** (`.eq('username', me).neq('note','')`). The 1189-chapter ring + Progres tiles + saved notes are now genuinely per-person.
- Added **`fetchPartnerProgress()`** → reads the partner's rows into a separate `partnerProgress` state (read-only).
- Added `groupRows()` helper (shared grouping of flat rows → `{Book:[chapters]}`).
- All writes (`markRead`, `saveNote`) now insert/upsert under `me` (canonical) explicitly. Partner push-notification + bell paths untouched and still fire.
- Re-scopes everything if the account changes mid-session (effect now keyed on `me`).

#### UI clarity (never ambiguous whose chapters are whose)
- **Two distinct Progress Rings** side-by-side at the top: **“Kamu”** (warm-gold) vs **partner name** (pixel-green), each with its own %, `read/1189`, and book count.
- **Progres tab**: a **“Kamu / {partner}” toggle** switches the tile map dataset. My tiles render **gold**, partner tiles render **green** — color reinforces the label. A line shows “Progres {who} — N pasal”. Empty states are per-owner.
- **Identity indicator**: fixed top-right pill **“kamu: {name}”** with a **“ganti ⇄”** button that signs out → Landing (explicit account switch). Back button + existing partner-update banner unchanged.

### `src/hooks/usePartnerActivity.js`
- Swapped its local `getPartner` for the shared `partnerOf` from `lib/accounts` (keeps the bell consistent with canonical accounts). Logic otherwise unchanged — bell + unread badge still work.

## Files touched (addendum)
- `src/lib/accounts.js` (new)
- `src/hooks/useAuth.jsx` (edited)
- `src/pages/Login.jsx` (rewritten)
- `src/pages/BibleWalk.jsx` (edited)
- `src/hooks/usePartnerActivity.js` (edited)

## Build status (addendum)
`npm run build` → **PASS** (green, 546 modules). No new ESLint errors introduced (remaining lint hits in `useAuth`/`usePartnerActivity` are the same pre-existing `set-state-in-effect` / `only-export-components` style warnings; build is unaffected).

## Supabase schema notes (Dex must apply / verify)
- **No schema change is required** — separation works purely by filtering on the existing `username` column. Existing data is untouched.
- **Recommended (optional, additive only):**
  - Composite unique constraint backing the note upsert: `UNIQUE (username, book, chapter)` — `saveNote` upserts `onConflict: 'username,book,chapter'`. If this constraint doesn't already exist, add it so note upserts dedupe correctly:
    `ALTER TABLE bible_progress ADD CONSTRAINT bible_progress_user_book_ch UNIQUE (username, book, chapter);`
  - Index for the scoped reads: `CREATE INDEX IF NOT EXISTS idx_bible_progress_username ON bible_progress (username);`
  - If any **legacy rows** were written under a non-canonical name (e.g. lowercase `dex`, or a typo), normalize them so they attach to the right account:
    `UPDATE bible_progress SET username='Dex' WHERE lower(username)='dex'; UPDATE bible_progress SET username='Angel' WHERE lower(username)='angel';`
- (Future hardening, not done here: Supabase **RLS** still allows the anon key to read both usernames — separation is currently enforced client-side. Fine for a private 2-person space; revisit if you ever want server-enforced isolation.)

## Test locally (addendum) — `npm run dev` → http://localhost:5173
1. Landing → “masuk” → enter PIN → **Login now shows two cards (Dex / Angel)**, not a text field.
2. Pick **Dex** → Dashboard navbar shows `Dex`. Open **Bible Walk** → top-right pill reads **“kamu: Dex”**.
3. Mark a few chapters / save a note. The **“Kamu” (gold) ring** and **Progres → Kamu (gold tiles)** reflect ONLY what you marked.
4. Tap **“ganti ⇄”** → back to Landing. Re-enter → pick **Angel**. Mark different chapters.
5. As Angel, open Bible Walk: the **“Kamu” ring** shows Angel's count; the **green partner ring** shows Dex's. In **Progres**, toggle **Kamu / Dex** — gold tiles = yours, green tiles = Dex's, counts differ. Confirms progress is separated, not merged.
6. Confirm the partner-update banner, 🔔 bell, and push notifications still fire (have the other account mark a chapter).
