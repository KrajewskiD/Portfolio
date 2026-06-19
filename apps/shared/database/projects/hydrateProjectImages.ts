import type { SupabaseClient } from "@supabase/supabase-js";

import type { Project } from "../types/project";
import {
  PROJECT_IMAGES_BUCKET,
  PROJECT_MINIATURES_BUCKET,
} from "../storage/storageUrls";
import {
  appendCacheBust,
  resolveStorageImageUrl,
} from "../storage/resolveStorageImageUrl";

type HydrateProjectImagesOptions = {
  getProjectImagePublicUrl: (path: string) => string;
  getProjectMiniaturePublicUrl: (path: string) => string;
};

export async function hydrateProjectImages(
  supabase: SupabaseClient,
  projects: Project[],
  {
    getProjectImagePublicUrl,
    getProjectMiniaturePublicUrl,
  }: HydrateProjectImagesOptions,
): Promise<Project[]> {
  return Promise.all(
    projects.map(async (project) => ({
      ...project,
      miniatureUrl: project.miniaturePath
        ? ((await resolveStorageImageUrl(
            supabase,
            PROJECT_MINIATURES_BUCKET,
            project.miniaturePath,
            getProjectMiniaturePublicUrl,
          )) ??
          appendCacheBust(
            getProjectMiniaturePublicUrl(project.miniaturePath),
            Date.now(),
          ))
        : undefined,
      topics: await Promise.all(
        project.topics.map(async (topic) => ({
          ...topic,
          imageUrl: topic.imagePath
            ? ((await resolveStorageImageUrl(
                supabase,
                PROJECT_IMAGES_BUCKET,
                topic.imagePath,
                getProjectImagePublicUrl,
              )) ??
              appendCacheBust(
                getProjectImagePublicUrl(topic.imagePath),
                Date.now(),
              ))
            : undefined,
        })),
      ),
    })),
  );
}
