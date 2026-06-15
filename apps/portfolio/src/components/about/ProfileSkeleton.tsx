function ProfileSkeleton() {
  return (
    <>
      <div className="mx-auto aspect-square w-64 animate-pulse rounded-full bg-gray-200 sm:w-full sm:max-w-sm lg:max-w-md" />

      <div className="max-w-2xl animate-pulse">
        <div className="mb-6 h-6 w-32 rounded bg-gray-200" />
        <div className="h-16 w-full max-w-xl rounded bg-gray-200" />
        <div className="mt-4 h-7 w-2/3 rounded bg-gray-200" />

        <div className="mt-8 space-y-3">
          <div className="h-5 w-full rounded bg-gray-200" />
          <div className="h-5 w-5/6 rounded bg-gray-200" />
        </div>
      </div>
    </>
  );
}

export default ProfileSkeleton;
