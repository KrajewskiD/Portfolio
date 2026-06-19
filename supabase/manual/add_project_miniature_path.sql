-- Ścieżka do pliku w buckecie Supabase Storage `project-miniatures`.
-- Sam obraz trzymasz w storage; tutaj tylko referencja (np. `{project-id}.webp`).
alter table public.projects
add column if not exists miniature_path text;
