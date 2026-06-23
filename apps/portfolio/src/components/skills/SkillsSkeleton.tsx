function SkillsSkeleton() {
  return (
    <div
      className="mt-6 grid items-start gap-6 lg:grid-cols-2"
      aria-hidden="true"
    >
      {[0, 1].map((group) => (
        <article key={group} className="site-card--skill">
          <div className="site-skeleton h-6 w-32 site-title--skill-group" />

          <div className="mt-3">
            {[0, 1, 2].map((skill) => (
              <div key={skill} className="site-skill-row">
                <div className="site-skill-item">
                  <div className="site-skeleton h-5 w-32" />

                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="site-skeleton h-4 w-4 rounded-pill"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export default SkillsSkeleton;
