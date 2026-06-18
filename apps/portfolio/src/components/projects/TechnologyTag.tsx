type TechnologyTagProps = {
  label: string;
};

function TechnologyTag({ label }: TechnologyTagProps) {
  return <span className="site-tag">{label}</span>;
}

export default TechnologyTag;
