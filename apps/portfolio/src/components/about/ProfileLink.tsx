import IconLinkButton from "@portfolio/components/IconLinkButton";
import githubIcon from "@shared/assets/icons/github.svg";
import linkedinIcon from "@shared/assets/icons/linkedin.svg";
import youtubeIcon from "@shared/assets/icons/youtube.svg";
import { getSocialPlatformFromUrl } from "@shared/utils/socialPlatform";

const socialIcons = {
  github: githubIcon,
  linkedin: linkedinIcon,
  youtube: youtubeIcon,
} as const;

type ProfileLinkProps = {
  label: string;
  href: string;
};

function ProfileLink({ label, href }: ProfileLinkProps) {
  const platform = getSocialPlatformFromUrl(href);

  if (platform) {
    return (
      <IconLinkButton
        href={href}
        label={label}
        iconSrc={socialIcons[platform]}
      />
    );
  }

  return (
    <a
      href={href}
      className="site-hero-card__link site-pill--link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

export default ProfileLink;
