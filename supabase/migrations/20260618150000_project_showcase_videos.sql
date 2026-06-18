alter table public.projects
add column if not exists video_path text;

insert into storage.buckets (id, name, public)
values ('project-videos', 'project-videos', true)
on conflict (id) do nothing;
