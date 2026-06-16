import type { Project } from "@shared/types/project";
import type { Profile } from "@shared/types/profile";
import type { FooterLinkData } from "@shared/types/link";
import type { SkillGroupData } from "@shared/types/skill";
import { normalizeProjectTopics } from "@shared/constants/projectTopics";

export const profileDraft: Profile = {
  name: "Dawid Krajewski",
  rolePl: "Frontend Developer PL",
  roleEn: "Frontend Developer EN",
  descriptionPl: "Lorem ipsum dolor sit amet. PL",
  descriptionEn: "Lorem ipsum dolor sit amet. EN",
  footerDescriptionPl: "Lorem ipsum stopka PL",
  footerDescriptionEn: "Lorem ipsum footer EN",
  imageAltPl: "Zdjęcie profilowe",
  imageAltEn: "Profile image",
};

export const projectDrafts: Project[] = [
  normalizeProjectTopics({
    id: "project-01",
    code: "PROJECT_01",
    titlePl: "Nazwa projektu PL",
    titleEn: "Project name EN",
    technologies: ["React", "TypeScript", "Supabase"],
    topics: [
      {
        id: "overview",
        contentPl: "Opis projektu PL",
        contentEn: "Project overview EN",
        imageAltPl: "Podgląd projektu PL",
        imageAltEn: "Project preview EN",
      },
      {
        id: "features",
        contentPl: "Funkcje projektu PL",
        contentEn: "Project features EN",
        imageAltPl: "Funkcje projektu PL",
        imageAltEn: "Project features EN",
      },
      {
        id: "technologies",
        contentPl: "Technologie projektu PL",
        contentEn: "Project technologies EN",
        imageAltPl: "Technologie projektu PL",
        imageAltEn: "Project technologies EN",
      },
      {
        id: "architecture",
        contentPl: "Architektura projektu PL",
        contentEn: "Project architecture EN",
        imageAltPl: "Architektura projektu PL",
        imageAltEn: "Project architecture EN",
      },
    ],
  }),
  normalizeProjectTopics({
    id: "project-02",
    code: "PROJECT_02",
    titlePl: "Panel administratora PL",
    titleEn: "Admin panel EN",
    technologies: ["React", "TypeScript", "Supabase", "PostgreSQL"],
    topics: [
      {
        id: "overview",
        contentPl: "Opis panelu administratora PL",
        contentEn: "Admin panel overview EN",
        imageAltPl: "Podgląd panelu administratora PL",
        imageAltEn: "Admin panel preview EN",
      },
      {
        id: "features",
        contentPl: "Funkcje panelu administratora PL",
        contentEn: "Admin panel features EN",
        imageAltPl: "Funkcje panelu administratora PL",
        imageAltEn: "Admin panel features EN",
      },
      {
        id: "technologies",
        contentPl: "Technologie panelu administratora PL",
        contentEn: "Admin panel technologies EN",
        imageAltPl: "Technologie panelu administratora PL",
        imageAltEn: "Admin panel technologies EN",
      },
      {
        id: "architecture",
        contentPl: "Architektura panelu administratora PL",
        contentEn: "Admin panel architecture EN",
        imageAltPl: "Architektura panelu administratora PL",
        imageAltEn: "Admin panel architecture EN",
      },
    ],
  }),
];

export const skillGroupDrafts: SkillGroupData[] = [
  {
    id: "frontend",
    titlePl: "Frontend",
    titleEn: "Frontend",
    skills: [
      {
        id: "react",
        name: "React",
        level: 4,
        descriptionPl: "Lorem ipsum dolor sit amet. PL",
        descriptionEn: "Lorem ipsum dolor sit amet. EN",
      },
      {
        id: "typescript",
        name: "TypeScript",
        level: 4,
        descriptionPl: "Lorem ipsum dolor sit amet. PL",
        descriptionEn: "Lorem ipsum dolor sit amet. EN",
      },
    ],
  },
];

export const footerLinkDrafts: FooterLinkData[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "#",
    displayOrder: 1,
  },
  {
    id: "github",
    label: "GitHub",
    href: "#",
    displayOrder: 2,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "#",
    displayOrder: 3,
  },
];
