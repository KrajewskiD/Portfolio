type ProjectImageProps = {
  imageUrl?: string;
  alt: string;
};

function ProjectImage({ imageUrl, alt }: ProjectImageProps) {
  return (
    <div className="flex p-4 lg:border-r">
      <div className="flex min-h-64 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>Brak zdjęcia projektu</span>
        )}
      </div>
    </div>
  );
}

export default ProjectImage;