import type { ReactNode } from "react";

type ProjectDetailsProps = {
  code: string;
  title: string;
  descriptionLabel: string;
  technologies: ReactNode;
  topics: ReactNode;
  children: ReactNode;
};

function ProjectDetails({
  code,
  title,
  descriptionLabel,
  technologies,
  topics,
  children,
}: ProjectDetailsProps) {
  return (
    <div className="border-t p-6 lg:border-t-0 lg:p-8">
      <p className="font-mono text-sm">{code}</p>
      <h3 className="mt-3 text-3xl font-bold">{title}</h3>

      <div className="mt-5 flex flex-wrap gap-2">
        {technologies}
      </div>

      <ul className="mt-6 space-y-1">
        {topics}
      </ul>

      <div className="mt-5 rounded-xl border-l-2 p-4">
        <p className="font-mono text-sm">{descriptionLabel}</p>
        <div className="mt-2 leading-7">{children}</div>
      </div>
    </div>
  );
}

export default ProjectDetails;