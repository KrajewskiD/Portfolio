type ProjectImageProps = {
  imageUrl?: string;
  alt: string;
  fallbackLabel: string;
};

function ProjectImage({ imageUrl, alt, fallbackLabel }: ProjectImageProps) {
  return (
    <div className="flex p-4 lg:border-r">
      <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed sm:h-72 lg:h-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <p>{fallbackLabel}</p>
        )}
      </div>
    </div>
  );
}

export default ProjectImage;
