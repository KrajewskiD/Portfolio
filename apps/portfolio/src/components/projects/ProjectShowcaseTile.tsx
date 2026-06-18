import { useEffect, useRef } from "react";

import { getLocalizedField } from "@shared/utils/localizedField";
import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";

type ProjectShowcaseTileProps = {
  project: Project;
  language: Language;
};

function ProjectShowcaseTile({ project, language }: ProjectShowcaseTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const title = getLocalizedField(project, language, "titlePl", "titleEn");

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    void video.play().catch(() => undefined);
  }, [project.videoUrl]);

  if (!project.videoUrl) {
    return null;
  }

  return (
    <div className="site-showcase-strip__tile">
      <video
        ref={videoRef}
        className="site-showcase-strip__video"
        src={project.videoUrl}
        autoPlay
        muted
        loop
        playsInline
        aria-label={title}
      />
    </div>
  );
}

export default ProjectShowcaseTile;
