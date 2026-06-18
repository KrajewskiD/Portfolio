type ProjectImageProps = {
  imageUrl?: string;
  alt: string;
  fallbackLabel: string;
};

function ProjectImage({ imageUrl, alt, fallbackLabel }: ProjectImageProps) {
  return (
    <div className="site-project-image">
      <div className="site-project-image__frame">
        {imageUrl ? (
          <img src={imageUrl} alt={alt} className="site-project-image__media" />
        ) : (
          <p className="site-text-muted">{fallbackLabel}</p>
        )}
      </div>
    </div>
  );
}

export default ProjectImage;
