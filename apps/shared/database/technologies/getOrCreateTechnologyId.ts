import type { SupabaseClient } from "@supabase/supabase-js";

type TechnologyRow = {
  id: string;
  icon_slug: string | null;
};

export async function getOrCreateTechnologyId(
  supabase: SupabaseClient,
  name: string,
  iconSlug = "",
): Promise<string> {
  const trimmedName = name.trim();
  const trimmedIconSlug = iconSlug.trim();

  const { data: technology, error: technologyLookupError } = await supabase
    .from("technologies")
    .select("id, icon_slug")
    .eq("name", trimmedName)
    .maybeSingle<TechnologyRow>();

  if (technologyLookupError) {
    throw technologyLookupError;
  }

  if (technology) {
    if (trimmedIconSlug && technology.icon_slug !== trimmedIconSlug) {
      const { error: updateError } = await supabase
        .from("technologies")
        .update({ icon_slug: trimmedIconSlug })
        .eq("id", technology.id);

      if (updateError) {
        throw updateError;
      }
    }

    return technology.id;
  }

  const { data: createdTechnology, error: technologyCreateError } =
    await supabase
      .from("technologies")
      .insert({
        name: trimmedName,
        icon_slug: trimmedIconSlug || null,
      })
      .select("id")
      .single<{ id: string }>();

  if (technologyCreateError) {
    throw technologyCreateError;
  }

  return createdTechnology.id;
}
