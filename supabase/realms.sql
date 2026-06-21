-- ════════════════════════════════════════════════════════════════════
-- Angel's Space — schema for the new realms (Sesi 5)
-- Run this once in Supabase → SQL Editor. Additive only, no drops.
-- RLS is disabled to match the existing tables (anon key, private 2-person
-- space). The app works WITHOUT this (localStorage fallback), but running
-- it makes data sync across devices and between Dex & Angel.
-- ════════════════════════════════════════════════════════════════════

-- ── Kebun Hati (daily journal, private per person) ──────────────────────
create table if not exists kebun_hati (
  id uuid primary key default gen_random_uuid(),
  username   text not null,
  mood       text,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_kebun_username on kebun_hati (username);
alter table kebun_hati disable row level security;

-- ── Meja Surat (timed letters between the two) ──────────────────────────
create table if not exists meja_surat (
  id uuid primary key default gen_random_uuid(),
  sender     text not null,
  recipient  text not null,
  title      text,
  body       text not null,
  deliver_at timestamptz,                 -- null = readable immediately; future = sealed until then
  created_at timestamptz not null default now()
);
create index if not exists idx_surat_recipient on meja_surat (recipient);
create index if not exists idx_surat_sender on meja_surat (sender);
alter table meja_surat disable row level security;

-- ── Karya Kita (shared shelf of works/achievements) ────────────────────
create table if not exists karya (
  id uuid primary key default gen_random_uuid(),
  owner       text not null default 'Berdua',   -- 'Dex' | 'Angel' | 'Berdua'
  title       text not null,
  description text,
  link        text,
  created_at  timestamptz not null default now()
);
alter table karya disable row level security;

-- ── Feed (posts) — ensure it exists for Feed Kita ──────────────────────
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id  text,
  caption    text,
  image_url  text,
  created_at timestamptz not null default now()
);
alter table posts disable row level security;
