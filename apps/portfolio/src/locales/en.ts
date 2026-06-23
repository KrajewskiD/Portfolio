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
    readMore: "Read more",
    readLess: "Show less",
  },
  projects: {
    label: "projects",
    title: "Selected Work",
    noImage: "No project image",
    loadError: "The projects could not be loaded.",
    emptyMessage: "No projects available.",
    openProjectLink: "Open project on GitHub",
    topicSectionLabel: "Project sections",
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
  header: {
    infoTitle: "About the site",
    infoEmptyMessage: "No projects available to display.",
    closeModalLabel: "Close",
  },
  notFound: {
    message: "Page not found.",
    backHome: "Return to the home page",
  },
  footer: {
    socialLinksLabel: "Social media",
  },
};
