type ProjectTopicProps = {
  id: string;
  panelId: string;
  label: string;
  active: boolean;
  onSelect: () => void;
};

function ProjectTopic({
  id,
  panelId,
  label,
  active,
  onSelect,
}: ProjectTopicProps) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      onClick={onSelect}
      className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-3 ${
        active
          ? "border-black font-semibold"
          : "border-transparent opacity-60"
      }`}
    >
      {label}
    </button>
  );
}

export default ProjectTopic;