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
      <a
        href={href}
        className="site-hero-card__link site-hero-card__link--icon"
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={socialIcons[platform]}
          alt=""
          aria-hidden
          className="site-hero-card__link-icon"
        />
      </a>
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
