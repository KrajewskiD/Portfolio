function ProjectSkeleton() {
  return (
    <div className="site-project-layout" aria-hidden="true">
      <div className="site-project-grid">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="site-skeleton site-project-thumb" />
        ))}
      </div>

      <article className="site-card--project">
        <div className="site-project-image">
          <div className="site-skeleton h-56 w-full sm:h-72 lg:h-full" />
        </div>

        <div className="site-project-skeleton__content">
          <div className="site-skeleton hidden h-5 w-24 sm:block" />

          <div className="site-skeleton mt-3 h-10 w-3/4" />

          <div className="mt-5 flex gap-2">
            <div className="site-skeleton h-10 w-20 rounded-pill" />
            <div className="site-skeleton h-10 w-28 rounded-pill" />
            <div className="site-skeleton h-10 w-24 rounded-pill" />
          </div>

          <div className="mt-6 flex gap-5 border-b border-border pb-3">
            <div className="site-skeleton h-6 w-24" />
            <div className="site-skeleton h-6 w-28" />
            <div className="site-skeleton h-6 w-32" />
          </div>

          <div className="site-topic-panel mt-5 space-y-4">
            <div className="site-skeleton h-5 w-28" />
            <div className="site-skeleton h-5 w-full" />
            <div className="site-skeleton h-5 w-4/5" />
          </div>
        </div>
      </article>
    </div>
  );
}

export default ProjectSkeleton;
