import type { Project } from "@shared/database/types/project";
import type { MainPage } from "@shared/database/types/mainPage";
import type { Profile } from "@shared/database/types/profile";
import type { FooterLinkData } from "@shared/database/types/link";
import type { SkillGroupData } from "@shared/database/types/skill";
import { normalizeProjectTopics } from "@shared/constants/projectTopics";
import { createEmptyProjectTechnology } from "@shared/database/types/project";

export const profileDraft: Profile = {
  name: "Dawid Krajewski",
  email: "",
  rolePl: "Frontend Developer PL",
  roleEn: "Frontend Developer EN",
  descriptionPl: "Lorem ipsum dolor sit amet. PL",
  descriptionEn: "Lorem ipsum dolor sit amet. EN",
  footerDescriptionPl: "Lorem ipsum stopka PL",
  footerDescriptionEn: "Lorem ipsum footer EN",
  imageAltPl: "Zdjęcie profilowe",
  imageAltEn: "Profile image",
};

export const mainPageDraft: MainPage = {
  aboutSiteCode: "WEB-SHOW-CASE",
  aboutSiteProjectUrl: "",
  aboutSiteTitlePl: "Portfolio",
  aboutSiteTitleEn: "Portfolio",
  aboutSiteTechnologies: [
    { name: "React", iconSlug: "logos/react" },
    { name: "TypeScript", iconSlug: "logos/typescript-icon" },
    { name: "Tailwind CSS", iconSlug: "logos/tailwindcss-icon" },
    { name: "Supabase", iconSlug: "logos/supabase-icon" },
    { name: "Cloudflare", iconSlug: "logos/cloudflare" },
    { name: "Vercel", iconSlug: "logos/vercel-icon" },
  ],
  aboutSiteTopics: normalizeProjectTopics({
    id: "about-site",
    titlePl: "",
    titleEn: "",
    miniatureAltPl: "",
    miniatureAltEn: "",
    technologies: [createEmptyProjectTechnology()],
    topics: [
      {
        id: "overview",
        contentPl: `Osobiste portfolio developerskie z prywatnym panelem CMS. Publiczna strona prezentuje profil, projekty i umiejętności w dwóch językach — polskim i angielskim.

Cała treść widoczna na stronie jest przechowywana w **Supabase** i edytowana bez ponownego deployu kodu: od sekcji „O mnie”, przez karty projektów, po modal **„O stronie”** w nagłówku.

Projekt powstał jako monorepo z dwoma niezależnymi aplikacjami SPA — publicznym portfolio i panelem administratora — współdzielącymi wspólną warstwę danych, typów i stylów.`,
        contentEn: `A personal developer portfolio with a private CMS panel. The public site presents profile, projects, and skills in two languages — Polish and English.

All on-page content is stored in **Supabase** and can be updated without redeploying code: from the About section and project cards to the header **“About this site”** modal.

The project is a monorepo with two independent SPAs — the public portfolio and the admin panel — sharing a common data, types, and styles layer.`,
        imageAltPl: "",
        imageAltEn: "",
      },
      {
        id: "features",
        contentPl: `**Strona publiczna**
- sekcje: O mnie, projekty, umiejętności, stopka
- dwujęzyczność PL/EN z zapamiętaniem wyboru w przeglądarce
- responsywny layout, sticky navbar, modal „O stronie”
- karty projektów z zakładkami, mediami i listą technologii

**Panel administratora**
- edycja profilu, projektów, umiejętności, stopki i treści „O stronie”
- upload zdjęć i miniaturek do Supabase Storage
- logowanie przez GitHub OAuth + wymagane MFA (AAL2)
- tłumaczenie pól PL↔EN przez Gemini (Edge Function)

**Bezpieczeństwo i jakość**
- Row Level Security na tabelach — publiczny odczyt, zapis tylko dla admina
- walidacja formularzy przez Zod (frontend + backend)
- smoke testy polityk dostępu`,
        contentEn: `**Public site**
- sections: About, projects, skills, footer
- PL/EN bilingual UI with language choice persisted in the browser
- responsive layout, sticky navbar, “About this site” modal
- project cards with tabs, media, and technology lists

**Admin panel**
- edit profile, projects, skills, footer, and “About this site” content
- upload images and thumbnails to Supabase Storage
- GitHub OAuth sign-in + required MFA (AAL2)
- PL↔EN field translation via Gemini (Edge Function)

**Security and quality**
- Row Level Security on tables — public read, admin-only writes
- form validation with Zod (frontend + backend)
- access-policy smoke tests`,
        imageAltPl: "",
        imageAltEn: "",
      },
      {
        id: "technologies",
        contentPl: `**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS 4, React Router, TanStack Query

**Formularze i walidacja**
- React Hook Form + Zod

**Backend i dane**
- Supabase: PostgreSQL, Auth, Storage, RLS

**Infrastruktura (kolejność ruchu)**
- **Cloudflare** — DNS, CDN, routing domeny \`.pl\` → \`.com\`
- **Vercel** — hosting portfolio i panelu admina jako osobne deploye

**Monorepo**
- \`apps/portfolio\` — publiczne SPA
- \`apps/admin\` — panel CMS
- \`apps/shared\` — typy, mapowanie DB, style i utils`,
        contentEn: `**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS 4, React Router, TanStack Query

**Forms and validation**
- React Hook Form + Zod

**Backend and data**
- Supabase: PostgreSQL, Auth, Storage, RLS

**Infrastructure (traffic order)**
- **Cloudflare** — DNS, CDN, routing \`.pl\` domain → \`.com\`
- **Vercel** — portfolio and admin panel deployed as separate projects

**Monorepo**
- \`apps/portfolio\` — public SPA
- \`apps/admin\` — CMS panel
- \`apps/shared\` — types, DB mapping, styles, and utils`,
        imageAltPl: "",
        imageAltEn: "",
      },
      {
        id: "architecture",
        contentPl: `**Przepływ danych**

\`\`\`text
Użytkownik → Cloudflare (DNS, CDN, .pl → .com) → Vercel (portfolio / admin)
                                                      ↓
                                              Supabase (PostgreSQL, Auth, Storage, RLS)
\`\`\`

**Warstwy monorepo**
- \`apps/portfolio\` — odczyt treści przez klienta Supabase (klucz anon + RLS)
- \`apps/admin\` — zapis po uwierzytelnieniu, weryfikacja w \`admin_users\` i MFA
- \`apps/shared\` — jeden model danych dla obu aplikacji

**Model bazy**
- \`profiles\` — dane o osobie (imię, rola, opis, zdjęcie)
- \`main_page\` — treść strony głównej i modala „O stronie”
- \`projects\` + powiązane tabele — karty projektów z zakładkami i technologiami
- \`skill_groups\` / \`skills\` — umiejętności
- \`footer_links\` — linki w stopce

**Bezpieczeństwo**
- RLS: anon ma tylko SELECT na publicznych tabelach
- admin: pełny dostęp po \`is_admin()\` i poziomie AAL2
- Edge Function \`translate-text\` — tłumaczenia po stronie serwera, klucze API poza przeglądarką`,
        contentEn: `**Data flow**

\`\`\`text
User → Cloudflare (DNS, CDN, .pl → .com) → Vercel (portfolio / admin)
                                                ↓
                                        Supabase (PostgreSQL, Auth, Storage, RLS)
\`\`\`

**Monorepo layers**
- \`apps/portfolio\` — reads content via Supabase client (anon key + RLS)
- \`apps/admin\` — writes after auth, verified via \`admin_users\` and MFA
- \`apps/shared\` — single data model for both apps

**Database model**
- \`profiles\` — person data (name, role, description, image)
- \`main_page\` — homepage and “About this site” modal content
- \`projects\` + related tables — project cards with tabs and technologies
- \`skill_groups\` / \`skills\` — skills
- \`footer_links\` — footer links

**Security**
- RLS: anon gets SELECT only on public tables
- admin: full access after \`is_admin()\` and AAL2
- Edge Function \`translate-text\` — server-side translation, API keys never in the browser`,
        imageAltPl: "",
        imageAltEn: "",
      },
    ],
  }).topics,
};

export const projectDrafts: Project[] = [
  normalizeProjectTopics({
    id: "project-01",
    code: "PROJECT_01",
    titlePl: "Nazwa projektu PL",
    titleEn: "Project name EN",
    miniatureAltPl: "Miniatura projektu PL",
    miniatureAltEn: "Project thumbnail EN",
    technologies: [
      { name: "React", iconSlug: "logos/react" },
      { name: "TypeScript", iconSlug: "logos/typescript-icon" },
      { name: "Supabase", iconSlug: "logos/supabase-icon" },
    ],
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
    miniatureAltPl: "Miniatura panelu administratora PL",
    miniatureAltEn: "Admin panel thumbnail EN",
    technologies: [
      { name: "React", iconSlug: "logos/react" },
      { name: "TypeScript", iconSlug: "logos/typescript-icon" },
      { name: "Supabase", iconSlug: "logos/supabase-icon" },
      { name: "PostgreSQL", iconSlug: "logos/postgresql" },
    ],
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
      },
      {
        id: "typescript",
        name: "TypeScript",
        level: 4,
      },
    ],
  },
];

export const footerLinkDrafts: FooterLinkData[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "#",
    platform: "linkedin",
    displayOrder: 1,
  },
  {
    id: "github",
    label: "GitHub",
    href: "#",
    platform: "github",
    displayOrder: 2,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "#",
    platform: "youtube",
    displayOrder: 3,
  },
];
