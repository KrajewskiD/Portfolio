import IconLinkButton from "@portfolio/components/IconLinkButton";
import githubIcon from "@shared/assets/icons/github.svg";

type ProjectExternalLinkProps = {
  href: string;
  label: string;
};

function ProjectExternalLink({ href, label }: ProjectExternalLinkProps) {
  return <IconLinkButton href={href} label={label} iconSrc={githubIcon} />;
}

export default ProjectExternalLink;
