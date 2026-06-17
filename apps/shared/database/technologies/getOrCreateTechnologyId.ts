import type { SupabaseClient } from "@supabase/supabase-js";

type TechnologyIdRow = {
  id: string;
};

export async function getOrCreateTechnologyId(
  supabase: SupabaseClient,
  name: string,
): Promise<string> {
  const { data: technology, error: technologyLookupError } = await supabase
    .from("technologies")
    .select("id")
    .eq("name", name)
    .maybeSingle<TechnologyIdRow>();

  if (technologyLookupError) {
    throw technologyLookupError;
  }

  if (technology) {
    return technology.id;
  }

  const { data: createdTechnology, error: technologyCreateError } =
    await supabase
      .from("technologies")
      .insert({ name })
      .select("id")
      .single<TechnologyIdRow>();

  if (technologyCreateError) {
    throw technologyCreateError;
  }

  return createdTechnology.id;
}
