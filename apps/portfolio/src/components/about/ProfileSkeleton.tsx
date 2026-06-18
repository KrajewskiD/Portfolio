function ProfileSkeleton() {
  return (
    <div className="site-hero-card" aria-hidden="true">
      <div className="site-hero-card__visual site-skeleton" />

      <div className="site-hero-card__content">
        <div className="site-skeleton h-5 w-24" />
        <div className="site-hero-card__name-row">
          <div className="site-skeleton h-14 w-full max-w-md" />
          <div className="flex gap-2">
            <div className="site-skeleton h-8 w-16 rounded-full" />
            <div className="site-skeleton h-8 w-16 rounded-full" />
          </div>
        </div>
        <div className="site-skeleton mt-4 h-5 w-48" />

        <div className="mt-8 space-y-3">
          <div className="site-skeleton h-5 w-full" />
          <div className="site-skeleton h-5 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
