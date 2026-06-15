type ProjectTopicProps = {
  id: string;
  panelId: string;
  label: string;
  iconSrc: string;
  active: boolean;
  onSelect: () => void;
};

function ProjectTopic({
  id,
  panelId,
  label,
  active,
  iconSrc,
  onSelect,
}: ProjectTopicProps) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-label={label}
      aria-selected={active}
      aria-controls={panelId}
      onClick={onSelect}
      className={`border-l-2 p-3 sm:shrink-0 sm:whitespace-nowrap sm:border-b-2 sm:border-l-0 sm:px-4 sm:py-3 ${
        active ? "border-black font-semibold" : "border-transparent opacity-60"
      }`}
    >
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className="h-5 w-5 sm:hidden"
      />

      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default ProjectTopic;
