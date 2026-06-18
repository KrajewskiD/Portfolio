function ProfileSkeleton() {
  return (
    <>
      <div className="site-avatar site-skeleton sm:w-full sm:max-w-sm lg:max-w-md" />

      <div className="site-profile">
        <div className="site-skeleton mb-6 h-6 w-32" />
        <div className="site-skeleton h-16 w-full max-w-xl" />
        <div className="site-skeleton mt-4 h-7 w-2/3" />

        <div className="mt-8 space-y-3">
          <div className="site-skeleton h-5 w-full" />
          <div className="site-skeleton h-5 w-5/6" />
        </div>
      </div>
    </>
  );
}

export default ProfileSkeleton;
