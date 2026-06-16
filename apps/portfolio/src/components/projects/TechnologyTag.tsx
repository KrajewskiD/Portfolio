type TechnologyTagProps = {
  label: string;
};

function TechnologyTag({ label }: TechnologyTagProps) {
  return (
    <span className="rounded-full border px-3 py-1.5 text-sm">{label}</span>
  );
}

export default TechnologyTag;
