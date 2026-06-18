function SkillsSkeleton() {
  return (
    <div
      className="mt-6 grid items-start gap-6 lg:grid-cols-2"
      aria-hidden="true"
    >
      {[0, 1].map((group) => (
        <div key={group} className="site-card--skeleton">
          <div className="site-skeleton mb-5 h-7 w-32" />

          {[0, 1, 2].map((skill) => (
            <div
              key={skill}
              className="site-skill-row flex items-center justify-between py-4"
            >
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
          ))}
        </div>
      ))}
    </div>
  );
}

export default SkillsSkeleton;
