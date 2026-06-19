function ProfileSkeleton() {
  return (
    <div className="site-hero-card" aria-hidden="true">
      <div className="site-hero-card__visual">
        <div className="site-hero-card__photo">
          <div className="site-skeleton h-4/5 w-4/5 rounded-3xl" />
        </div>
      </div>

      <div className="site-hero-card__content">
        <div className="site-skeleton h-5 w-24" />

        <div className="site-hero-card__name-row">
          <div className="site-skeleton h-14 w-full max-w-md" />

          <div className="site-hero-card__links">
            <div className="site-skeleton h-8 w-16 rounded-pill" />
            <div className="site-skeleton h-8 w-16 rounded-pill" />
          </div>
        </div>

        <div className="site-hero-card__role-row">
          <span className="site-hero-card__rule opacity-30" />
          <div className="site-skeleton h-5 w-48" />
        </div>

        <div className="site-hero-card__description space-y-3">
          <div className="site-skeleton h-5 w-full" />
          <div className="site-skeleton h-5 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
