function FooterSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-7xl animate-pulse flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between"
      aria-hidden="true"
    >
      <div>
        <div className="h-5 w-36 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-52 rounded bg-gray-200" />
      </div>

      <div className="flex items-center gap-4">
        <div className="h-6 w-20 rounded bg-gray-200 sm:h-12 sm:rounded-full" />
        <div className="h-6 w-20 rounded bg-gray-200 sm:h-12 sm:rounded-full" />
        <div className="h-6 w-20 rounded bg-gray-200 sm:h-12 sm:rounded-full" />
      </div>
    </div>
  );
}

export default FooterSkeleton;
