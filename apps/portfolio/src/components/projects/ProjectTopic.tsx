type ProjectTopicProps = {
  id: string;
  label: string;
  iconSrc: string;
  active: boolean;
  onSelect: () => void;
};

function ProjectTopic({
  id,
  label,
  active,
  iconSrc,
  onSelect,
}: ProjectTopicProps) {
  return (
    <button
      id={id}
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`site-topic-tab ${
        active ? "site-topic-tab--active" : "site-topic-tab--inactive"
      }`}
    >
      <img
        src={iconSrc}
        alt=""
        aria-hidden
        className="site-topic-tab__icon h-5 w-5 sm:hidden"
      />

      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </button>
  );
}

export default ProjectTopic;
