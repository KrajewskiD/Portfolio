function ProjectsForm() {
  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Projekty</h2>
          <p className="mt-2 text-white/60">
            Wybierz projekt z listy albo dodaj nowy.
          </p>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-full border border-white/20 bg-neutral-800 px-5 py-3 text-xl font-black text-white transition hover:border-white/30 hover:bg-neutral-700"
        >
          +
        </button>
      </header>
    </section>
  );
}

export default ProjectsForm;