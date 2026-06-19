import TechnologyIcon from "./TechnologyIcon";

type TechnologyTagProps = {
  label: string;
  iconSlug?: string;
};

function TechnologyTag({ label, iconSlug }: TechnologyTagProps) {
  return (
    <span className="site-tag">
      {iconSlug ? <TechnologyIcon iconSlug={iconSlug} /> : null}
      <span>{label}</span>
    </span>
  );
}

export default TechnologyTag;
