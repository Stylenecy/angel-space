# 📋 PROTOCOL.md — Angel's Space AI Agent Protocol
> **WAJIB dibaca dan dipahami sebelum melakukan APAPUN di proyek ini.**
> Setelah selesai mengerjakan task, rekap hasilnya ke bagian SESSION LOG di bawah.

---

## 🔴 LANGKAH WAJIB SEBELUM MULAI (MANDATORY PRE-WORK)

Ikuti urutan ini TANPA SKIP, apapun tasknya:

```
1. Baca file ini (Protocol.md) sampai habis
2. Baca CLAUDE.md di root proyek → aturan wajib proyek
3. Baca src/index.css → palette warna, font, utility classes yang sudah ada
4. Baca file yang akan diedit → JANGAN asumsi isi file
5. Cek apakah component yang akan dipakai sudah ada di src/components/
6. Jalankan npm run build di akhir → pastikan tidak ada error
```

**JANGAN lewati langkah nomor 4.** AI yang paling sering gagal adalah yang langsung nulis kode tanpa baca file aslinya dulu.

---

## ✅ YANG TERBUKTI BERHASIL

### Animasi & Transisi
- **framer-motion > CSS keyframes** untuk animasi penting yang harus terasa. CSS keyframe bisa invisible/tidak terdeteksi user karena timing/specificity issue. framer-motion lebih reliable dan predictable.
- `motion.span` dengan `initial/animate/transition` untuk character stagger dan word stagger — works great
- `AnimatePresence` untuk component yang mount/unmount (window buka/tutup, modal, dll)
- `type: 'spring', stiffness: 320, damping: 26` — spring animation terasa natural dan pixel-style

### Cursor & Interaksi
- `window.matchMedia('(pointer: coarse)').matches` untuk detect touch device sebelum aktifkan cursor effects
- `performance.now()` + `requestAnimationFrame` untuk animasi particle/trail — lebih smooth dari setInterval

### Positioning & Draggable Window
- Untuk draggable window dengan framer-motion: pakai `position: fixed` di `style`, biarkan framer-motion drag handle transform
- **JANGAN** wrap draggable content dengan `pointer-events-none/auto` div yang cover full screen → memblokir semua klik di bawahnya
- `onPointerDown={(e) => e.stopPropagation()}` pada button di dalam draggable container → cegah drag mulai saat click button

### Session/Storage
- `localStorage` (bukan sessionStorage) untuk feature flag yang perlu persist antar tab
- Selalu pakai try/catch saat akses localStorage → ada browser yang block (private mode, dll)
- Untuk "show once per X hours": simpan timestamp di localStorage, cek `Date.now() - last > cooldown`

### Entrance System
- CinematicEntrance sudah setup dengan localStorage 24h cooldown
- entrancePicker.js adalah single source → jangan hardcode entrance type di tempat lain
- Emergency fallback 6000ms di Landing.jsx harus tetap ada

### CSS & Tailwind
- Tailwind v4 dipakai → utility class bisa langsung dipakai, tapi untuk custom animation tetap tulis manual di index.css
- Semua keyframe ada di index.css — cek dulu sebelum tambah yang baru

---

## ❌ YANG HARUS DIHINDARI (LESSONS FROM FAILURES)

### Bug #1 — sessionStorage untuk "first visit" tidak reliable
**Apa yang terjadi:** Cinematic entrance pakai sessionStorage. Selama development, page di-refresh berkali-kali → key sudah ter-set → user tidak pernah lihat cinematic.
**Fix:** Ganti ke localStorage + timestamp cooldown (24h).
**Rule:** Jangan pakai sessionStorage untuk feature yang harus dilihat user. sessionStorage hilang di tab baru, tapi persist selama session — developer yang sering refresh tidak akan pernah trigger "first visit".

### Bug #2 — CSS animation tidak terasa pada pixel font kecil
**Apa yang terjadi:** Character stagger dengan CSS keyframe (`translateY(110%)`) diimplementasi tapi user bilang "sama sekali ga kerasa". Kemungkinan: `overflow: hidden` + pixel font kecil = efek tidak visible, atau ada CSS specificity issue dengan Tailwind.
**Fix:** Ganti ke framer-motion `motion.span` — guaranteed bekerja.
**Rule:** Untuk animasi yang HARUS dirasakan user (entrance, reveal penting), pakai framer-motion bukan CSS class saja.

### Bug #3 — pointer-events wrapper memblokir klik seluruh halaman
**Apa yang terjadi:** Wrapper div `absolute inset-0 pointer-events-none` dengan child `pointer-events-auto w-full h-full` → child cover full screen → SEMUA klik ter-intercept, icon di bawah tidak bisa diklik.
**Fix:** Hilangkan wrapper. AppWindow pakai `position: fixed` langsung.
**Rule:** Jangan buat div full-screen dengan pointer-events-auto kecuali memang mau block semua input (modal overlay). Untuk floating element, pakai `position: fixed` tanpa wrapper.

### Yang Tidak Boleh Dilakukan
- ❌ Ubah font (Press Start 2P / VT323) tanpa konfirmasi Dex
- ❌ Tambah library baru tanpa tanya Dex
- ❌ Edit file yang tidak diminta dalam task
- ❌ Deploy ke production langsung
- ❌ Commit dengan `Co-Authored-By` — Vercel Hobby plan blokir deploy
- ❌ Hardcode warna di luar palette:
  ```
  #0a0e27 (midnight)  #111b3d (deep-blue)
  #f0f0f5 (soft-white) #d4a853 (warm-gold)
  #4a7cc9 (calm-blue)  #38b764 (pixel-green)
  #e8798b (pixel-pink) #7b5ea7 (pixel-purple)
  ```
- ❌ Tambah `border-radius` yang besar (pixel aesthetic = sharp corners)
- ❌ Pakai font selain Press Start 2P dan VT323 kecuali untuk portfolio page

---

## 💡 TIPS UNTUK AI LEVEL MENENGAH (MiniMax M2.7, Gemini Pro, dll)

Tips ini dibuat agar AI yang tidak selalu bisa reasoning panjang tetap bisa menghasilkan output yang konsisten.

### SEBELUM MENULIS KODE APAPUN

**Tip 1 — Baca dulu, tulis kemudian**
Selalu mulai dengan membaca file yang akan diedit. Bukan hanya imports-nya — baca seluruh file. Kalau file terlalu panjang, baca bagian yang relevan dengan task. AI yang mengarang isi file cenderung menghapus fitur yang sudah ada.

**Tip 2 — Trace import chain**
Sebelum pakai component, trace:
```
Apakah component/hook ini exist di codebase?
→ Cek src/components/, src/hooks/, src/pages/
Apakah sudah di-export dari index.js?
→ Cek file index.js di folder tersebut
```

**Tip 3 — Cek CSS yang sudah ada**
Baca `src/index.css` dan cari class yang sudah ada. Jangan buat ulang animasi yang sudah tersedia. Class yang sudah ada:
- `.pixel-btn` — tombol pixel style
- `.pixel-card` — card pixel style  
- `.pixel-render` — image-rendering: pixelated
- `.font-pixel` — Press Start 2P
- `.animate-float` — floating animation
- `.animate-pixel-blink` — blink animation
- `.animate-char-slide` — char slide up (Elsye-style)
- `.animate-word-slide` — word slide 3D (Elsye-style)

### SAAT MENULIS KODE

**Tip 4 — Ikuti pola yang sudah ada**
Lihat component lain sebagai template. Misalnya, semua page punya:
```jsx
export default function NamaPage({ setPage }) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen ...">
      <StarField />  ← JANGAN HILANGKAN INI
      ...
    </section>
  )
}
```
Ikuti pola ini. Jangan buat struktur baru yang berbeda dari pola yang ada.

**Tip 5 — Mobile-first selalu**
Angel akses dari HP. Setiap element:
- Minimum touch target: 44×44px
- Font yang cukup besar di mobile: `text-[0.5rem]` minimum untuk font-pixel, `text-base` untuk VT323
- Hindari layout yang butuh hover untuk berfungsi

**Tip 6 — framer-motion sudah tersedia**
Package `framer-motion` sudah install. Untuk animasi yang penting (yang harus terasa user), PAKAI framer-motion bukan CSS class:
```jsx
import { motion, AnimatePresence } from 'framer-motion'

// Benar — guaranteed terasa:
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

// Berisiko tidak terlihat — CSS class:
<div className="animate-fade-in">
```

**Tip 7 — Verifikasi dengan build**
Setelah selesai, jalankan `npm run build`. Kalau ada error:
- Import yang salah/tidak exist → paling umum
- Named vs default export → cek kembali
- Tailwind class tidak valid di v4 → pakai inline style sebagai fallback

### UNTUK TASK SPESIFIK

**Menambah halaman baru:**
1. Buat file di `src/pages/NamaHalaman.jsx`
2. Import di `src/App.jsx`
3. Tambah route: `{page === 'namahalaman' && <NamaHalaman setPage={setPage} />}`
4. Tambah tombol navigasi di Dashboard.jsx atau page yang sesuai

**Menambah component:**
1. Buat di `src/components/NamaComponent.jsx`
2. Export di folder index.js jika ada
3. Test bahwa `npm run build` tidak error

**Mengubah animasi/transisi:**
1. Kalau perlu dirasakan user → framer-motion
2. Kalau cuma decorative → CSS animation di index.css

**Mengubah data/konten yang disimpan:**
1. Selalu pakai Supabase (`@supabase/supabase-js`)
2. Jangan hardcode data yang harusnya dari database
3. Contoh pola yang sudah ada: lihat `src/hooks/useAuth.jsx`

---

## 📅 SESSION LOG

Format: `[TANGGAL] — Apa yang dikerjakan | Hasilnya | Lesson learned`

---

### [2026-04-16] — Implementasi 3 referensi UI (Bohdan + DaveOS + Elsye)

**Yang dikerjakan:**
- `PixelTrailCursor.jsx` — pixel particle trail cursor, skip di touch device
- `CinematicEntrance.jsx` — terminal boot sequence dengan progress bar
- `PixelDesktop.jsx` — OS desktop dengan icon + draggable window + taskbar
- `Landing.jsx` — character stagger (Elsye) + word stagger subtitle
- `entrancePicker.js` — cinematic entrance system
- `index.css` — tambah `@keyframes char-slide` dan `word-slide`

**Yang berhasil baik:**
- Pixel trail cursor → langsung terasa, user feedback positif ✓
- Pixel Desktop → terlihat, OS aesthetic berhasil ✓
- CRT scanline overlay di Landing dan PixelDesktop → atmospheric ✓
- framer-motion spring animation untuk window buka/tutup → natural ✓

**Yang perlu diperbaiki (dan sudah difix di session yang sama):**

| Masalah | Root Cause | Fix |
|---------|-----------|-----|
| Cinematic tidak muncul | sessionStorage sudah ter-set dari dev session | Ganti ke localStorage + 24h cooldown |
| Char stagger tidak terasa | CSS keyframe tidak reliable di pixel font kecil | Ganti ke framer-motion motion.span |
| Desktop icon tidak bisa diklik | `pointer-events-auto` wrapper full-screen memblokir semua klik | Hapus wrapper, pakai position:fixed langsung |

**Status akhir session:** Build clean ✓ | Semua bug difix ✓ | Pushed ke master ✓

---

*Tambahkan session baru di bawah ini setiap selesai kerja.*

---
