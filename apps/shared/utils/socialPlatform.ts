export type SocialPlatform = "github" | "linkedin" | "youtube";

export function getSocialPlatformFromUrl(href: string): SocialPlatform | null {
  const normalized = href.toLowerCase();

  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) {
    return "youtube";
  }

  if (normalized.includes("github.com")) {
    return "github";
  }

  if (normalized.includes("linkedin.com")) {
    return "linkedin";
  }

  return null;
}
