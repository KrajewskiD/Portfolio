alter table public.skills
  add column if not exists show_level boolean not null default true;
