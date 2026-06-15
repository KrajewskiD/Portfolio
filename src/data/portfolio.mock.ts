import type { Profile } from "../types/profile";
import type { Project } from "../types/project";
import type { SkillGroupData } from "../types/skill";
import type { FooterData } from "../types/footer";
import type { NavigationLinkData } from "../types/link";

export const profileMock: Profile = {
  name: "Dawid Krajewski",
  rolePl: "Frontend Developer PL",
  roleEn: "Frontend Developer ENG",
  descriptionPl: "Lorem ipsum dolor sit amet. PL",
  descriptionEn: "Lorem ipsum dolor sit amet. ENG",
  imageUrl: undefined,
  imageAltPl: "Zdjęcie Dawida Krajewskiego",
  imageAltEn: "Photo of Dawid Krajewski",
};

export const projectsMock: Project[] = [
  {
    id: "project-01",
    code: "PROJECT_01",
    titlePl: "Nazwa projektu",
    titleEn: "Project name",
    imageAltPl: "Podgląd projektu",
    imageAltEn: "Project preview",
    technologies: ["React", "TypeScript", "Supabase"],

    topics: [
      {
        id: "overview",
        contentPl: "Opis projektu PL",
        contentEn: "Project overview EN",
      },
      {
        id: "features",
        contentPl: "Funkcje PL",
        contentEn: "Features EN",
      },
      {
        id: "technologies",
        contentPl: "Technologie PL",
        contentEn: "Technologies EN",
      },
      {
        id: "architecture",
        contentPl: "Architektura PL",
        contentEn: "Architecture EN",
      },
    ],
  },
];

export const skillGroupsMock: SkillGroupData[] = [
  {
    id: "skill-frontend",
    titlePl: "Frontend",
    titleEn: "Frontend",
    skills: [
      {
        id: "skill-01",
        name: "React",
        level: 4,
        descriptionPl: "Lorem ipsum dolor sit amet. PL",
        descriptionEn: "Lorem ipsum dolor sit amet. EN",
      },
      {
        id: "skill-02",
        name: "TypeScript",
        level: 3,
        descriptionPl: "Lorem ipsum dolor sit amet. PL",
        descriptionEn: "Lorem ipsum dolor sit amet. EN",
      },
      {
        id: "skill-03",
        name: "Tailwind CSS",
        level: 4,
        descriptionPl: "Lorem ipsum dolor sit amet. PL",
        descriptionEn: "Lorem ipsum dolor sit amet. EN",
      },
    ],
  },
  {
    id: "skill-backend",
    titlePl: "Backend",
    titleEn: "Backend",
    skills: [
      {
        id: "skill-04",
        name: "REST API",
        level: 3,
        descriptionPl: "Lorem ipsum dolor sit amet. PL",
        descriptionEn: "Lorem ipsum dolor sit amet. EN",
      },
      {
        id: "skill-05",
        name: "Supabase",
        level: 3,
        descriptionPl: "Lorem ipsum dolor sit amet. PL",
        descriptionEn: "Lorem ipsum dolor sit amet. EN",
      },
    ],
  },
];

export const navigationMock: NavigationLinkData[] = [
  {
    id: "about",
    labelPl: "O mnie",
    labelEn: "About",
    href: "#about",
  },
  {
    id: "projects",
    labelPl: "Projekty",
    labelEn: "Projects",
    href: "#projects",
  },
  {
    id: "skills",
    labelPl: "Umiejętności",
    labelEn: "Skills",
    href: "#skills",
  },
];

export const footerMock: FooterData = {
  name: "Dawid Krajewski",
  description: "React · TypeScript · Supabase",
  links: [
    { id: "linkedin", label: "LinkedIn", href: "#" },
    { id: "github", label: "GitHub", href: "#" },
    { id: "youtube", label: "YouTube", href: "#" },
  ],
};
