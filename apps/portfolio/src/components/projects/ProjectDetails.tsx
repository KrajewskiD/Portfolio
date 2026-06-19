import type { ReactNode } from "react";

type ProjectDetailsProps = {
  code: string;
  title: string;
  technologies: ReactNode;
  topics: ReactNode;
};

function ProjectDetails({
  code,
  title,
  technologies,
  topics,
}: ProjectDetailsProps) {
  return (
    <div className="site-project-details">
      <p className="site-code">{code}</p>

      <h3 className="site-title--project">{title}</h3>
      <div className="site-project-technologies">
        <div className="site-project-technologies__card">{technologies}</div>
      </div>
      {topics}
    </div>
  );
}

export default ProjectDetails;
