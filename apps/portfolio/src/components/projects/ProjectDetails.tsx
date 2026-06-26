import type { ReactNode } from "react";

type ProjectDetailsProps = {
  code: string;
  title: string;
  technologies?: ReactNode;
  topics: ReactNode;
  externalLink?: ReactNode;
};

function ProjectDetails({
  code,
  title,
  technologies,
  topics,
  externalLink,
}: ProjectDetailsProps) {
  return (
    <div className="site-project-details">
      <div className="site-project-details__content">
        <div className="site-project-details__head">
          <div className="site-project-details__head-main">
            <p className="site-code">{code}</p>

            <h3 className="site-title--project">{title}</h3>
          </div>

          {technologies ? (
            <div className="site-project-details__head-aside">
              {technologies}
            </div>
          ) : null}
        </div>

        {topics}
      </div>

      {externalLink ? (
        <div className="site-project-details__actions site-social-icon-scale">
          {externalLink}
        </div>
      ) : null}
    </div>
  );
}

export default ProjectDetails;
