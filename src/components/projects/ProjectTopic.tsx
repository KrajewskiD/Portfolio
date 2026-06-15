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
      aria-selected={active}
      aria-controls={panelId}
      onClick={onSelect}
      className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-3 ${
        active ? "border-black font-semibold" : "border-transparent opacity-60"
      }`}
    >
      <img
  src={iconSrc}
  alt=""
  aria-hidden="true"
  className="h-5 w-5 sm:hidden"
/>

<span className="hidden sm:inline">
  {label}
</span>

    </button>
  );
}

export default ProjectTopic;
