type ProfileImageProps = {
  imageUrl?: string;
  alt: string;
  fallbackLabel: string;
};

function ProfileImage({ imageUrl, alt, fallbackLabel }: ProfileImageProps) {
  return (
    <div className="site-avatar">
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="site-avatar__image" />
      ) : (
        <span className="site-text-muted">{fallbackLabel}</span>
      )}
    </div>
  );
}

export default ProfileImage;
