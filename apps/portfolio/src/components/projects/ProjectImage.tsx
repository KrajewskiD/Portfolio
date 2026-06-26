import type { ReactNode } from "react";

type ProjectImageProps = {
  imageUrl?: string;
  alt: string;
  fallbackLabel: string;
  technologies?: ReactNode;
};

function ProjectImage({
  imageUrl,
  alt,
  fallbackLabel,
  technologies,
}: ProjectImageProps) {
  return (
    <div className="site-project-image">
      <div className="site-project-image__frame">
        {imageUrl ? (
          <img src={imageUrl} alt={alt} className="site-project-image__media" />
        ) : (
          <p className="site-text-muted">{fallbackLabel}</p>
        )}

        {technologies ? (
          <div className="site-project-image__technologies">{technologies}</div>
        ) : null}
      </div>
    </div>
  );
}

export default ProjectImage;
