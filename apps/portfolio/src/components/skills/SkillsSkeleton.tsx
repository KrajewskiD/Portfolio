function SkillsSkeleton() {
  return (
    <div
      className="mt-6 grid items-start gap-6 lg:grid-cols-2"
      aria-hidden="true"
    >
      {[0, 1].map((group) => (
        <div key={group} className="animate-pulse rounded-3xl border p-6">
          <div className="mb-5 h-7 w-32 rounded bg-gray-200" />

          {[0, 1, 2].map((skill) => (
            <div
              key={skill}
              className="flex items-center justify-between border-t py-4"
            >
              <div className="h-5 w-32 rounded bg-gray-200" />

              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="h-4 w-4 rounded-full bg-gray-200"
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
