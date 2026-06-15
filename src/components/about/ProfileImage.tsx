type ProfileImageProps = {
  imageUrl?: string;
  alt: string;
  fallbackLabel: string;
};

function ProfileImage({ imageUrl, alt, fallbackLabel }: ProfileImageProps) {
  return (
    <div className="mx-auto flex aspect-square w-64 items-center justify-center overflow-hidden rounded-full border sm:w-full sm:max-w-sm lg:max-w-md">
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <p>{fallbackLabel}</p>
      )}
    </div>
  );
}

export default ProfileImage;
