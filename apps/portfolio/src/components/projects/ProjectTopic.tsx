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
      className={`site-topic-tab ${
        active ? "site-topic-tab--active" : "site-topic-tab--inactive"
      }`}
    >
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className="site-topic-tab__icon h-5 w-5 sm:hidden"
      />

      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default ProjectTopic;
