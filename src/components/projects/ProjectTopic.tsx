type ProjectTopicProps = {
  label: string;
  active: boolean;
  onSelect: () => void;
};

function ProjectTopic({ label, active, onSelect }: ProjectTopicProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={
          active
            ? "w-full rounded-xl border px-4 py-3 text-left font-semibold"
            : "w-full px-4 py-3 text-left"
        }
      >
        <span className="mr-3">•</span>
        {label}
      </button>
    </li>
  );
}

export default ProjectTopic;
