type ProfileImageProps = {
  imageUrl?: string;
  alt: string;
  fallbackLabel: string;
};

function ProfileImage({ imageUrl, alt, fallbackLabel }: ProfileImageProps) {
  return (
    <div className="site-hero-card__visual">
      <div className="site-hero-card__photo">
        {imageUrl ? (
          <img src={imageUrl} alt={alt} className="site-hero-card__image" />
        ) : (
          <span className="site-hero-card__placeholder">{fallbackLabel}</span>
        )}
      </div>
    </div>
  );
}

export default ProfileImage;
