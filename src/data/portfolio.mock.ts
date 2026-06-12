import type { Profile } from "../types/profile";
import type { Project } from "../types/project";
import type { SkillGroupData } from "../types/skill";
import type { FooterData } from "../types/footer";
import type { LinkData } from "../types/link";

export const profileMock: Profile = {
  name: "Dawid Krajewski",
  role: "XYZ",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  imageUrl: "/images/profile.jpg",
  imageAlt: "Dawid Krajewski",
};

export const projectMock: Project[] = [{
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
  descriptionLabel: "opis_projektu",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
}];

export const skillGroupsMock: SkillGroupData[] = [
  {
    title: "Frontend",
    skills: [
      {
        name: "React",
        level: 4,
        description: "Lorem ipsum dolor sit amet.",
      },
      {
        name: "TypeScript",
        level: 3,
        description: "Lorem ipsum dolor sit amet.",
      },
      {
        name: "Tailwind CSS",
        level: 4,
        description: "Lorem ipsum dolor sit amet.",
      },
    ],
  },
  {
    title: "Backend",
    skills: [
      {
        name: "REST API",
        level: 3,
        description: "Lorem ipsum dolor sit amet.",
      },
      {
        name: "Supabase",
        level: 3,
        description: "Lorem ipsum dolor sit amet.",
      },
    ],
  },
];

export const footerMock: FooterData = {
  name: "Dawid Krajewski",
  description: "React · TypeScript · Supabase",
  links: [
    { label: "LinkedIn", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};

export const navigationMock: LinkData[] = [
  { label: "O mnie", href: "#about" },
  { label: "Projekty", href: "#projects" },
  { label: "Umiejętności", href: "#skills" },
];