import type { ReactNode } from "react";

type ProjectDetailsProps = {
  code: string;
  title: string;
  technologies?: ReactNode;
  topics: ReactNode;
  externalLink?: ReactNode;
  pinExternalLinkToTitle?: boolean;
};

function ProjectDetails({
  code,
  title,
  technologies,
  topics,
  externalLink,
  pinExternalLinkToTitle = false,
}: ProjectDetailsProps) {
  const externalLinkActions = externalLink ? (
    <div className="site-project-details__actions site-social-icon-scale">
      {externalLink}
    </div>
  ) : null;

  return (
    <div className="site-project-details">
      <div className="site-project-details__content">
        <div className="site-project-details__head">
          <div className="site-project-details__head-main">
            <p className="site-code">{code}</p>

            <div className="site-project-details__title-row">
              <h3 className="site-title--project">{title}</h3>
              {pinExternalLinkToTitle ? externalLinkActions : null}
            </div>
          </div>

          {technologies ? (
            <div className="site-project-details__head-aside">
              {technologies}
            </div>
          ) : null}
        </div>

        {topics}
      </div>

      {!pinExternalLinkToTitle ? externalLinkActions : null}
    </div>
  );
}

export default ProjectDetails;
