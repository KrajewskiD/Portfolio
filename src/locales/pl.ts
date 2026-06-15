import type { Translations } from "./translations";

export const pl: Translations = {
  about: {
    label: "o_mnie",
    noImage: "Brak zdjęcia",
    loadError: "Nie udało się wczytać profilu.",
  },
  projects: {
    label: "projekty",
    title: "Wybrane projekty",
    noImage: "Brak zdjęcia projektu",
    loadError: "Nie udało się wczytać projektów.",
    emptyMessage: "Brak projektów.",
    topics: {
      overview: "Opis projektu",
      features: "Główne funkcje",
      technologies: "Wykorzystane technologie",
      architecture: "Architektura",
    },
  },
  skills: {
    label: "umiejętności",
    title: "Umiejętności",
    levelLabel: "Poziom {level} na {maxLevel}",
  },
  navigation: {
    mainLabel: "Główna nawigacja",
    mobileLabel: "Mobilna nawigacja",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
  },
  notFound: {
    message: "Nie znaleziono strony.",
    backHome: "Wróć na stronę główną",
  },
  footer: {
    socialLinksLabel: "Media społecznościowe",
  },
};
