type SectionHeadingProps = {
  label: string;
  title: string;
};

function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <header>
      <p className="font-mono">// {label}</p>
      <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
        {title}
      </h2>
    </header>
  );
}

export default SectionHeading;