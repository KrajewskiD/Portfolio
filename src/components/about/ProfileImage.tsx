type ProfileImageProps = {
  imageUrl?: string;
  alt: string;
};

function ProfileImage({ imageUrl, alt }: ProfileImageProps) {
  return (
    <div className="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-full border sm:max-w-sm">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          Brak zdjęcia
        </div>
      )}
    </div>
  );
}

export default ProfileImage;