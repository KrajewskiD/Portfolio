function ProjectSkeleton() {
  return (
    <article
      className="mt-8 grid w-full min-w-0 overflow-hidden rounded-3xl border lg:min-h-[75vh] lg:grid-cols-2"
      aria-hidden="true"
    >
      <div className="flex p-4 lg:border-r">
        <div className="h-56 w-full animate-pulse rounded-2xl bg-gray-200 sm:h-72 lg:h-full" />
      </div>

      <div className="min-w-0 p-6 lg:p-8">
        <div className="hidden h-5 w-24 animate-pulse rounded bg-gray-200 sm:block" />

        <div className="mt-3 h-10 w-3/4 animate-pulse rounded bg-gray-200" />

        <div className="mt-5 flex gap-2">
          <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-10 w-28 animate-pulse rounded-full bg-gray-200" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
        </div>

        <div className="mt-6 flex gap-5 border-b pb-3">
          <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-5 space-y-4 rounded-xl border-l-2 p-4">
          <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </article>
  );
}

export default ProjectSkeleton;
