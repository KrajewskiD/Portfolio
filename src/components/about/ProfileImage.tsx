type ProfileImageProps = {
  imageUrl?: string;
  alt: string;
  fallbackLabel: string;
};

function ProfileImage({ imageUrl, alt, fallbackLabel }: ProfileImageProps) {
  return (
    <div className="mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-full border">
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <p>{fallbackLabel}</p>
      )}
    </div>
  );
}

export default ProfileImage;
