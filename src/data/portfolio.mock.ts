import type { Profile } from "../types/profile";
import type { Project } from "../types/project";
import type { SkillGroupData } from "../types/skill";
import type { FooterData } from "../types/footer";
import type { NavigationLinkData } from "../types/link";

export const profileMock: Profile = {
  name: "Dawid Krajewski",
  role: "XYZ",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  imageUrl: "/images/profile.jpg",
  imageAlt: "Dawid Krajewski",
};

export const projectsMock: Project[] = [
    {
        id: "project-01",
        code: "PROJECT_01",
        title: "Nazwa projektu",
        imageAlt: "Podgląd projektu",
        technologies: ["React", "TypeScript", "Supabase"],
        topics: [
            {
            id: "overview",
            label: "Opis projektu",
            content: "Lorem ipsum dolor sit amet.",
            },
            {
            id: "features",
            label: "Główne funkcje",
            content: "Lorem ipsum dolor sit amet.",
            },
            {
            id: "technologies",
            label: "Wykorzystane technologie",
            content: "Lorem ipsum dolor sit amet.",
            },
            {
            id: "architecture",
            label: "Architektura",
            content: "Lorem ipsum dolor sit amet.",
            },
        ],
    }
];

export const skillGroupsMock: SkillGroupData[] = [
  {
    id: "skill-frontend",
    title: "Frontend",
    skills: [
      {
        id: "skill-01",
        name: "React",
        level: 4,
        description: "Lorem ipsum dolor sit amet.",
      },
      {
        id: "skill-02",
        name: "TypeScript",
        level: 3,
        description: "Lorem ipsum dolor sit amet.",
      },
      {
        id: "skill-03",
        name: "Tailwind CSS",
        level: 4,
        description: "Lorem ipsum dolor sit amet.",
      },
    ],
  },
  {
    id: "skill-backend",
    title: "Backend",
    skills: [
      {
        id: "skill-04",
        name: "REST API",
        level: 3,
        description: "Lorem ipsum dolor sit amet.",
      },
      {
        id: "skill-05",
        name: "Supabase",
        level: 3,
        description: "Lorem ipsum dolor sit amet.",
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