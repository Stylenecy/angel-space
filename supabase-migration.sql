-- Supabase Migration: Angel's Space Bible Walk
-- Jalankan di Supabase Dashboard → SQL Editor

-- 1. Tabel progress baca Alkitab
CREATE TABLE IF NOT EXISTS public.bible_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book text NOT NULL,
  chapter integer NOT NULL,
  note text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book, chapter)
);

ALTER TABLE public.bible_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read all progress" ON public.bible_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.bible_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.bible_progress;

CREATE POLICY "Users can read all progress"
  ON public.bible_progress FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own progress"
  ON public.bible_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own progress"
  ON public.bible_progress FOR UPDATE
  USING (true);

-- 2. Disable RLS untuk profiles (app pake login nama, bukan auth)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_progress DISABLE ROW LEVEL SECURITY;

-- 3. Trigger auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bible_progress_updated_at ON public.bible_progress;

CREATE TRIGGER bible_progress_updated_at
  BEFORE UPDATE ON public.bible_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
