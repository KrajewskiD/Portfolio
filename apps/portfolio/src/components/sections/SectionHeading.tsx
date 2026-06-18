type SectionHeadingProps = {
  label: string;
  title: string;
};

function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <header>
      <p className="site-section-label">// {label}</p>
      <h2 className="site-title mt-4">{title}</h2>
    </header>
  );
}

export default SectionHeading;
