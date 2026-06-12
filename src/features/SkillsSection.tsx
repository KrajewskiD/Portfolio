const skillGroups = [
  {
    title: "Frontend",
    skills: [
      {
        name: "React",
        level: 4,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        name: "TypeScript",
        level: 3,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        name: "Tailwind CSS",
        level: 4,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    title: "Backend",
    skills: [
      {
        name: "REST API",
        level: 3,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        name: "Supabase",
        level: 3,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
];

function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-24 py-8 sm:py-10">
      <p className="font-mono">// umiejętności</p>

      <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
        Umiejętności
      </h2>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {skillGroups.map((group) => (
          <article
            key={group.title}
            className="rounded-2xl border px-5 py-4"
          >
            <h3 className="font-mono text-lg font-semibold">
              {group.title}
            </h3>

            <div className="mt-3">
              {group.skills.map((skill) => (
                <details key={skill.name} className="border-t">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3">
                    <span className="font-semibold">
                      {skill.name}
                    </span>

                    <span
                      className="flex gap-1.5"
                      aria-label={`Poziom ${skill.level} na 5`}
                    >
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className={`h-2.5 w-2.5 rounded-full border ${
                            dot <= skill.level
                              ? "bg-current"
                              : "opacity-30"
                          }`}
                        />
                      ))}
                    </span>
                  </summary>

                  <p className="pb-4 text-sm leading-6">
                    {skill.description}
                  </p>
                </details>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;