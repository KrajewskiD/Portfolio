alter table public.projects
  add column if not exists miniature_alt_pl text not null default '',
  add column if not exists miniature_alt_en text not null default '';
