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
    <div className="min-w-0 overflow-hidden border-t p-6 lg:border-t-0 lg:p-8">
      <p className="hidden font-mono text-sm sm:block"> {code}</p>

      <h3 className="text-2xl font-bold sm:mt-3 sm:text-3xl">{title}</h3>
      <div className="mt-5 flex flex-wrap gap-2">{technologies}</div>
      {topics}
    </div>
  );
}

export default ProjectDetails;
