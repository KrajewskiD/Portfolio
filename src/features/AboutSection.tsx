function AboutSection() {
  return (
    <section
    id="about"
    className="flex scroll-mt-24 items-center py-16"
    >
        <div className="grid w-full items-center gap-12 rounded-3xl border p-6 sm:p-10 lg:grid-cols-2 lg:p-16">
            <div className="mx-auto aspect-square w-full max-w-xs rounded-full border sm:max-w-sm">
                <div className="flex h-full items-center justify-center">
                Miejsce na zdjęcie
                </div>
            </div>

            <div className="max-w-2xl">
                <p className="mb-6 font-mono">// o_mnie</p>

                <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
                Dawid Krajewski
                </h1>

                <p className="mt-4 text-xl">XYZ</p>

                <p className="mt-8 text-lg leading-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>
        </div>
    </section>
  );
}

export default AboutSection;