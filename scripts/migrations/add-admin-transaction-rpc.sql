create or replace function public.save_admin_projects(projects_payload jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  project_item jsonb;
  topic_item jsonb;
  technology_item jsonb;
  project_order integer;
  topic_ids text[];
  technology_ids uuid[];
  seen_technology_names text[];
  v_project_id uuid;
  v_technology_id uuid;
  technology_name text;
  technology_icon_slug text;
  technology_order integer;
begin
  if jsonb_typeof(projects_payload) <> 'array' then
    raise exception 'projects_payload must be a JSON array';
  end if;

  for project_item, project_order in
    select value, ordinality::integer
    from jsonb_array_elements(projects_payload) with ordinality
  loop
    v_project_id := (project_item ->> 'id')::uuid;

    insert into projects (
      id,
      code,
      project_url,
      title_pl,
      title_en,
      miniature_alt_pl,
      miniature_alt_en,
      display_order,
      miniature_path,
      video_path
    )
    values (
      v_project_id,
      nullif(project_item ->> 'code', ''),
      nullif(project_item ->> 'projectUrl', ''),
      coalesce(project_item ->> 'titlePl', ''),
      coalesce(project_item ->> 'titleEn', ''),
      coalesce(project_item ->> 'miniatureAltPl', ''),
      coalesce(project_item ->> 'miniatureAltEn', ''),
      project_order,
      nullif(project_item ->> 'miniaturePath', ''),
      null
    )
    on conflict (id) do update set
      code = excluded.code,
      project_url = excluded.project_url,
      title_pl = excluded.title_pl,
      title_en = excluded.title_en,
      miniature_alt_pl = excluded.miniature_alt_pl,
      miniature_alt_en = excluded.miniature_alt_en,
      display_order = excluded.display_order,
      miniature_path = excluded.miniature_path,
      video_path = excluded.video_path;

    topic_ids := '{}'::text[];

    for topic_item in
      select value
      from jsonb_array_elements(coalesce(project_item -> 'topics', '[]'::jsonb))
    loop
      topic_ids := array_append(topic_ids, topic_item ->> 'id');

      insert into project_topics (
        project_id,
        topic_type_id,
        content_pl,
        content_en,
        image_path,
        image_alt_pl,
        image_alt_en
      )
      values (
        v_project_id,
        topic_item ->> 'id',
        coalesce(topic_item ->> 'contentPl', ''),
        coalesce(topic_item ->> 'contentEn', ''),
        nullif(topic_item ->> 'imagePath', ''),
        coalesce(topic_item ->> 'imageAltPl', ''),
        coalesce(topic_item ->> 'imageAltEn', '')
      )
      on conflict (project_id, topic_type_id) do update set
        content_pl = excluded.content_pl,
        content_en = excluded.content_en,
        image_path = excluded.image_path,
        image_alt_pl = excluded.image_alt_pl,
        image_alt_en = excluded.image_alt_en;
    end loop;

    if cardinality(topic_ids) = 0 then
      delete from project_topics
      where project_topics.project_id = v_project_id;
    else
      delete from project_topics
      where project_topics.project_id = v_project_id
        and not (topic_type_id = any(topic_ids));
    end if;

    technology_ids := '{}'::uuid[];
    seen_technology_names := '{}'::text[];
    technology_order := 0;

    for technology_item in
      select value
      from jsonb_array_elements(coalesce(project_item -> 'technologies', '[]'::jsonb))
    loop
      technology_name := btrim(coalesce(technology_item ->> 'name', ''));
      technology_icon_slug := btrim(coalesce(technology_item ->> 'iconSlug', ''));

      if technology_name = '' or lower(technology_name) = any(seen_technology_names) then
        continue;
      end if;

      seen_technology_names := array_append(seen_technology_names, lower(technology_name));
      technology_order := technology_order + 1;

      select id
      into v_technology_id
      from technologies
      where name = technology_name
      limit 1;

      if v_technology_id is null then
        insert into technologies (name, icon_slug)
        values (technology_name, nullif(technology_icon_slug, ''))
        returning id into v_technology_id;
      elsif technology_icon_slug <> '' then
        update technologies
        set icon_slug = technology_icon_slug
        where id = v_technology_id
          and coalesce(icon_slug, '') <> technology_icon_slug;
      end if;

      technology_ids := array_append(technology_ids, v_technology_id);

      update project_technologies
      set display_order = technology_order
      where project_technologies.project_id = v_project_id
        and project_technologies.technology_id = v_technology_id;

      if not found then
        insert into project_technologies (
          project_id,
          technology_id,
          display_order
        )
        values (
          v_project_id,
          v_technology_id,
          technology_order
        );
      end if;
    end loop;

    if cardinality(technology_ids) = 0 then
      delete from project_technologies
      where project_technologies.project_id = v_project_id;
    else
      delete from project_technologies
      where project_technologies.project_id = v_project_id
        and not (project_technologies.technology_id = any(technology_ids));
    end if;
  end loop;
end;
$$;

create or replace function public.save_admin_settings(
  skill_groups_payload jsonb,
  footer_links_payload jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  group_item jsonb;
  skill_item jsonb;
  footer_link_item jsonb;
  group_order integer;
  skill_order integer;
  group_ids uuid[] := '{}'::uuid[];
  skill_ids uuid[] := '{}'::uuid[];
  footer_link_ids uuid[] := '{}'::uuid[];
  v_group_id uuid;
  v_skill_id uuid;
  v_footer_link_id uuid;
  v_technology_id uuid;
  skill_name text;
begin
  if jsonb_typeof(skill_groups_payload) <> 'array' then
    raise exception 'skill_groups_payload must be a JSON array';
  end if;

  if jsonb_typeof(footer_links_payload) <> 'array' then
    raise exception 'footer_links_payload must be a JSON array';
  end if;

  for group_item, group_order in
    select value, ordinality::integer
    from jsonb_array_elements(skill_groups_payload) with ordinality
  loop
    v_group_id := (group_item ->> 'id')::uuid;
    group_ids := array_append(group_ids, v_group_id);

    insert into skill_groups (
      id,
      title_pl,
      title_en,
      display_order
    )
    values (
      v_group_id,
      coalesce(group_item ->> 'titlePl', ''),
      coalesce(group_item ->> 'titleEn', ''),
      group_order
    )
    on conflict (id) do update set
      title_pl = excluded.title_pl,
      title_en = excluded.title_en,
      display_order = excluded.display_order;

    skill_order := 0;

    for skill_item in
      select value
      from jsonb_array_elements(coalesce(group_item -> 'skills', '[]'::jsonb))
    loop
      skill_name := btrim(coalesce(skill_item ->> 'name', ''));

      if skill_name = '' then
        continue;
      end if;

      v_skill_id := (skill_item ->> 'id')::uuid;
      skill_ids := array_append(skill_ids, v_skill_id);
      skill_order := skill_order + 1;

      select id
      into v_technology_id
      from technologies
      where name = skill_name
      limit 1;

      if v_technology_id is null then
        insert into technologies (name, icon_slug)
        values (skill_name, null)
        returning id into v_technology_id;
      end if;

      insert into skills (
        id,
        group_id,
        technology_id,
        description_pl,
        description_en,
        level,
        show_level,
        display_order
      )
      values (
        v_skill_id,
        v_group_id,
        v_technology_id,
        '',
        '',
        coalesce((skill_item ->> 'level')::integer, 1),
        coalesce((skill_item ->> 'showLevel')::boolean, true),
        skill_order
      )
      on conflict (id) do update set
        group_id = excluded.group_id,
        technology_id = excluded.technology_id,
        description_pl = excluded.description_pl,
        description_en = excluded.description_en,
        level = excluded.level,
        show_level = excluded.show_level,
        display_order = excluded.display_order;
    end loop;
  end loop;

  if cardinality(skill_ids) = 0 then
    delete from skills;
  else
    delete from skills
    where not (skills.id = any(skill_ids));
  end if;

  if cardinality(group_ids) = 0 then
    delete from skill_groups;
  else
    delete from skill_groups
    where not (skill_groups.id = any(group_ids));
  end if;

  for footer_link_item, group_order in
    select value, ordinality::integer
    from jsonb_array_elements(footer_links_payload) with ordinality
  loop
    v_footer_link_id := (footer_link_item ->> 'id')::uuid;
    footer_link_ids := array_append(footer_link_ids, v_footer_link_id);

    insert into footer_links (
      id,
      label,
      url,
      platform,
      display_order
    )
    values (
      v_footer_link_id,
      coalesce(footer_link_item ->> 'label', ''),
      coalesce(footer_link_item ->> 'href', ''),
      coalesce(footer_link_item ->> 'platform', ''),
      group_order
    )
    on conflict (id) do update set
      label = excluded.label,
      url = excluded.url,
      platform = excluded.platform,
      display_order = excluded.display_order;
  end loop;

  if cardinality(footer_link_ids) = 0 then
    delete from footer_links;
  else
    delete from footer_links
    where not (footer_links.id = any(footer_link_ids));
  end if;
end;
$$;

create or replace function public.delete_admin_project(project_id_to_delete uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  delete from project_technologies
  where project_technologies.project_id = project_id_to_delete;

  delete from project_topics
  where project_topics.project_id = project_id_to_delete;

  delete from projects
  where projects.id = project_id_to_delete;
end;
$$;

grant execute on function public.save_admin_projects(jsonb) to authenticated;
grant execute on function public.save_admin_settings(jsonb, jsonb) to authenticated;
grant execute on function public.delete_admin_project(uuid) to authenticated;
