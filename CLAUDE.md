# CLAUDE.md — Angel's Space Project Rules
### *Dibaca otomatis oleh Claude Code di setiap sesi*

---

## 🧭 Konteks Proyek

**"Angel's Space"** adalah platform web personal untuk dua orang: Dex (developer) dan Angel (pasangannya).  
Bukan produk komersial. Ini ruang digital yang dibuat dengan cinta — harus terasa seperti itu.

**Stack**: Vite + React + Tailwind CSS v4 | Supabase (auth, DB, storage) | Vercel  
**Aesthetic**: Pixel-art RPG (Terraria / Stardew Valley vibes) — TIDAK BOLEH BERUBAH  
**Fonts**: Press Start 2P (heading) + VT323 (body) — TETAP

---

## 📌 Aturan Wajib untuk Semua AI Agent

### 1. Selalu Baca Dulu Sebelum Mulai
Sebelum mengerjakan apapun, baca:
- `.agent/Master/MASTER_TASK.md` → cek task apa yang harus dikerjakan selanjutnya
- `.agent/Master/Angel's Space Masterplan v2.md` → single source of truth

### 2. Update MASTER_TASK Setiap Progress
- Tandai `[~]` saat mulai sebuah task
- Tandai `[x]` saat task selesai dan sudah ditest
- Jangan skip langkah ini

### 3. Buat Walkthrough Setiap Selesai 1 Task/Phase
- Simpan di `.agent/Walkthrough/walkthrough_XX.md`
- Format: nomor urut dari walkthrough terakhir + 1
- Template ada di `.agent/Master/AGENT_RULES.md`

### 4. Commit & Push ke GitHub Setiap Progress
- Commit message format: `[PhaseX.Y] <deskripsi singkat>`
- Contoh: `[Phase0.1] Add HiddenMessage.jsx with typewriter easter egg`
- Push ke `master` branch setelah setiap task selesai
- **JANGAN pakai `Co-Authored-By`** — Vercel Hobby plan memblokir deploy jika ada co-author

### 5. Filter Setiap Fitur dengan 5 Tujuan Inti
Setiap fitur atau perubahan HARUS mendukung minimal satu dari:
1. Ruang emosional yang aman
2. Ekspresi saat kata-kata sulit diucapkan langsung
3. Menyimpan kenangan yang bertumbuh
4. Mendukung pertumbuhan — emosional, kehidupan, iman
5. Ruang bersama dua orang: Dex dan Angel

Jika tidak → tanya Dex dulu, jangan langsung implementasi.

### 6. Coding Rules
- Data yang perlu disimpan → **Supabase** (`@supabase/supabase-js`)
- Route protected → **ProtectedRoute.jsx**
- Content editable → **Edit Mode toggle** (jangan hardcode)
- Jangan hapus `StarField.jsx` dari halaman utama manapun
- Gunakan `Typewriter.jsx` untuk semua teks emosional/personal
- Mobile-first — Angel akses dari HP

### 7. Jika Bingung atau Tidak Yakin
Buat file di `.agent/Implementation/implementation_plan_XX.md` dengan dua bagian:
- **Bagian AI**: spesifikasi teknis, file paths, langkah konkret
- **Bagian Dex**: penjelasan manusiawi, kenapa, apa yang akan terjadi

Kemudian tanya Dex sebelum lanjut.

### 8. Jangan Pernah
- Ubah aesthetic pixel-art tanpa konfirmasi Dex
- Hardcode konten yang seharusnya dari database
- Commit `.env.local` atau file yang mengandung secrets
- Deploy ke production tanpa bilang ke Dex
- Hapus atau overwrite file existing tanpa baca dulu

---

## 📁 Struktur .agent Folder

```
.agent/
├── Master/
│   ├── Angel's Space Masterplan v2.md   ← SINGLE SOURCE OF TRUTH
│   ├── MASTER_TASK.md                    ← CHECKLIST UTAMA
│   └── AGENT_RULES.md                    ← Rules detail + templates
├── Walkthrough/
│   └── walkthrough_XX.md                 ← Progress reports
├── Implementation/
│   └── implementation_plan_XX.md         ← Rencana detail saat bingung
├── Task/                                 ← Task tracking (legacy)
├── Plan/                                 ← Planning docs
└── Idea/                                 ← Referensi & inspirasi
```

---

*File ini dibaca otomatis oleh Claude Code. Update saat ada perubahan rules.*
