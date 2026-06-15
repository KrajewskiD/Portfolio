import type { Translations } from "./translations";

export const en: Translations = {
  about: {
    label: "about_me",
    noImage: "No profile image",
    loadError: "The profile could not be loaded.",
  },
  projects: {
    label: "projects",
    title: "Selected Work",
    noImage: "No project image",
    loadError: "The projects could not be loaded.",
    emptyMessage: "No projects available.",
    topics: {
      overview: "Overview",
      features: "Main features",
      technologies: "Technologies",
      architecture: "Architecture",
    },
  },
  skills: {
    label: "skills",
    title: "Skills",
    levelLabel: "Level {level} of {maxLevel}",
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
