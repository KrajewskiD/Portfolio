function ProfileSkeleton() {
  return (
    <div className="site-hero-card site-hero-card--skeleton" aria-hidden="true">
      <div className="site-hero-card__trapezoid">
        <div className="site-hero-card__trapezoid-shape site-hero-card__trapezoid-shape--skeleton" />
      </div>

      <div className="site-hero-card__panel">
        <div className="site-hero-card__social">
          <div className="site-hero-card__links">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index} className="site-hero-card__link-skeleton">
                <span className="site-hero-card__link-skeleton-dot" />
              </span>
            ))}
          </div>
        </div>

        <div className="site-skeleton h-5 w-24 site-hero-card__label" />

        <div className="site-hero-card__name-row">
          <div className="site-skeleton site-hero-card__name-skeleton" />
        </div>

        <div className="site-hero-card__role-row">
          <span aria-hidden className="site-hero-card__rule opacity-30" />
          <div className="site-skeleton h-5 w-48 shrink-0" />
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
