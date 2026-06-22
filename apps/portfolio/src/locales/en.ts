import type { Translations } from "./translations";

export const en: Translations = {
  about: {
    label: "about_me",
    noImage: "No profile image",
    loadError: "The profile could not be loaded.",
    emailLabel: "Show email",
    copyEmailLabel: "Copy",
    emailCopiedMessage: "Copied",
    emailEmptyMessage: "No email address in the profile.",
    emailLoadErrorMessage: "Could not load the email address.",
  },
  projects: {
    label: "projects",
    title: "Selected Work",
    noImage: "No project image",
    loadError: "The projects could not be loaded.",
    emptyMessage: "No projects available.",
    openProjectLink: "Open project on GitHub",
  },
  skills: {
    label: "skills",
    title: "Skills",
    levelLabel: "Level {level} of {maxLevel}",
    loadError: "The skills could not be loaded.",
    emptyMessage: "No skills available.",
  },
  navigation: {
    mainLabel: "Main navigation",
    mobileLabel: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  notFound: {
    message: "Page not found.",
    backHome: "Return to the home page",
  },
  footer: {
    socialLinksLabel: "Social media",
  },
};
