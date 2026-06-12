type ProjectTopicProps = {
  label: string;
  active?: boolean;
};

function ProjectTopic({ label, active = false }: ProjectTopicProps) {
  return (
    <li
      className={
        active
          ? "rounded-xl border px-4 py-3 font-semibold"
          : "px-4 py-3"
      }
    >
      <span className="mr-3">•</span>
      {label}
    </li>
  );
}

export default ProjectTopic;