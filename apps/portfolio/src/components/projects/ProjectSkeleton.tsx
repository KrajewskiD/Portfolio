function ProjectSkeleton() {
  const topics = ["w-24", "w-28", "w-36", "w-24"];

  return (
    <div className="site-project-layout" aria-hidden="true">
      <div className="site-project-grid">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`site-project-thumb site-project-thumb--skeleton shrink-0${
              index === 0 ? " site-project-thumb--active" : ""
            }`}
          >
            <div className="site-project-thumb__placeholder" />

            <span className="site-project-thumb__overlay">
              <span className="site-project-thumb__name-panel">
                <span className="site-skeleton mx-auto block h-4 w-3/4 max-w-[8rem]" />
              </span>
            </span>
          </div>
        ))}
      </div>

      <article className="site-card--project site-card--project--skeleton">
        <div className="site-project-image">
          <div className="site-project-image__frame site-project-image__frame--skeleton">
            <div className="site-skeleton size-full rounded-2xl" />

            <div className="site-project-image__technologies">
              <div className="site-project-technologies">
                <div className="site-project-technologies__card">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="site-skeleton h-8 w-8 rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="site-project-details">
          <div className="site-skeleton hidden h-5 w-24 sm:block" />

          <div className="site-skeleton mt-3 h-10 w-3/4" />

          <div className="site-project-topics">
            <div className="site-topic-list">
              {topics.map((width, index) => (
                <div
                  key={index}
                  className={`site-topic-tab ${
                    index === 0
                      ? "site-topic-tab--active"
                      : "site-topic-tab--inactive"
                  }`}
                >
                  <div className="site-skeleton h-5 w-5 sm:hidden" />
                  <div
                    className={`site-skeleton hidden h-5 ${width} sm:block`}
                  />
                </div>
              ))}
            </div>

            <div className="site-topic-panel-shell">
              <div className="site-topic-panel space-y-4">
                <div className="site-skeleton h-5 w-28" />
                <div className="site-skeleton h-5 w-full" />
                <div className="site-skeleton h-5 w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ProjectSkeleton;
