const technologies = ["React", "TypeScript", "Supabase"];

const projectTopics = [
  "Opis projektu",
  "Główne funkcje",
  "Wykorzystane technologie",
  "Architektura",
];

function ProjectsSection() {
  return (
    <section id="projects"   className="scroll-mt-24 pt-16 pb-8 sm:pt-20 sm:pb-10">
      <p className="font-mono">// projekty</p>

      <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
        Wybrane projekty
      </h2>

      <article className="mt-8 grid overflow-hidden rounded-3xl border lg:grid-cols-2">
        <div className="flex p-4 lg:border-r">
          <div className="flex min-h-64 w-full items-center justify-center rounded-2xl border border-dashed">
            Miejsce na zdjęcie projektu
          </div>
        </div>

        <div className="border-t p-6 lg:border-t-0 lg:p-8">
          <p className="font-mono text-sm">PROJECT_01</p>

          <h3 className="mt-3 text-3xl font-bold">
            Nazwa projektu
          </h3>

          <div className="mt-5 flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border px-3 py-1.5 text-sm"
              >
                {technology}
              </span>
            ))}
          </div>

          <ul className="mt-6 space-y-1">
            {projectTopics.map((topic, index) => (
              <li
                key={topic}
                className={
                  index === 0
                    ? "rounded-xl border px-4 py-3 font-semibold"
                    : "px-4 py-3"
                }
              >
                <span className="mr-3">•</span>
                {topic}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-xl border-l-2 p-4">
            <p className="font-mono text-sm">opis_projektu</p>

            <p className="mt-2 leading-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ProjectsSection;