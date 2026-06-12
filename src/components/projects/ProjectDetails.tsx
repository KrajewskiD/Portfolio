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
    <div className="border-t p-6 lg:border-t-0 lg:p-8">
      <p className="font-mono text-sm">{code}</p>
      <h3 className="mt-3 text-3xl font-bold">{title}</h3>

      <div className="mt-5 flex flex-wrap gap-2">{technologies}</div>

      {topics}
    </div>
  );
}

export default ProjectDetails;
