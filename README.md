# Portfolio — Dawid Krajewski

Dwujęzyczna strona portfolio (PL/EN) z panelem administracyjnym do zarządzania treścią. Frontend oparty o React i Vite; dane i pliki przechowywane w Supabase.

**Strona produkcyjna:** [dawid-krajewski.com](https://dawid-krajewski.com)

## Funkcje

### Strona publiczna

- Sekcje: O mnie, Projekty, Umiejętności
- Dwie wersje językowe (`/pl`, `/en`) z automatycznym wykrywaniem preferencji przeglądarki
- Nawigacja z kotwicami do sekcji
- Treści w Markdown z sanityzacją HTML
- Responsywny layout z animacjami i efektami wizualnymi

### Panel administracyjny (`/admin`)

- Logowanie przez Supabase Auth
- Weryfikacja dwuetapowa (MFA)
- Edycja profilu, opisu strony, projektów i umiejętności
- Wbudowany mechanizm tłumaczenia pól (PL ↔ EN)
- Zarządzanie obrazami w Supabase Storage
- Ochrona przed utratą niezapisanych zmian

## Stos technologiczny

| Warstwa | Technologie |
|--------|-------------|
| Frontend | React 19, TypeScript, Vite 8 |
| Stylowanie | Tailwind CSS 4 |
| Routing | React Router 7 |
| Dane | TanStack Query, Supabase (PostgreSQL + Storage) |
| Treść | react-markdown, remark-gfm, rehype-sanitize |
| Jakość kodu | ESLint, Prettier, Vitest |

## Struktura projektu

```
Portfolio/
├── apps/
│   ├── main.ts              # Punkt wejścia — ładuje portfolio lub admin
│   ├── portfolio/           # Aplikacja publiczna
│   │   └── src/
│   │       ├── components/
│   │       ├── features/
│   │       ├── hooks/
│   │       ├── locales/     # Tłumaczenia UI (pl, en)
│   │       └── pages/
│   ├── admin/               # Panel administracyjny
│   │   └── src/
│   │       ├── auth/        # MFA, sesja, ochrona tras
│   │       ├── forms/       # Formularze edycji treści
│   │       └── pages/
│   └── shared/              # Kod współdzielony
│       ├── components/
│       ├── config/          # Trasy, zmienne środowiskowe
│       ├── database/        # Zapytania, mapery, typy
│       ├── styles/
│       └── utils/
├── public/                  # Favicony, manifest PWA
├── scripts/
│   └── security-smoke.mjs   # Testy bezpieczeństwa API
└── index.html
```

### Aliasy importów

| Alias | Ścieżka |
|-------|---------|
| `@portfolio/*` | `apps/portfolio/src/*` |
| `@admin/*` | `apps/admin/src/*` |
| `@shared/*` | `apps/shared/*` |

## Wymagania

- Node.js 20+
- Konto Supabase z skonfigurowaną bazą danych, storage i auth
- Zmienne środowiskowe (patrz poniżej)

## Uruchomienie lokalne

1. Sklonuj repozytorium i zainstaluj zależności:

```bash
npm install
```

2. Skopiuj plik środowiskowy i uzupełnij dane Supabase:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

3. Uruchom serwer deweloperski:

```bash
npm run dev
```

- Strona portfolio: `http://localhost:5173/`
- Panel admin: `http://localhost:5173/admin`

## Skrypty npm

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Serwer deweloperski Vite |
| `npm run build` | Kompilacja TypeScript + build produkcyjny |
| `npm run preview` | Podgląd buildu produkcyjnego |
| `npm run lint` | Analiza ESLint |
| `npm run format` | Formatowanie Prettier |
| `npm run security:smoke` | Smoke testy bezpieczeństwa (wymaga `.env`) |

## Architektura

Aplikacja to monorepo z jednym bundlem Vite. Plik `apps/main.ts` na podstawie ścieżki URL ładuje odpowiedni moduł:

- ścieżki `/admin/*` → panel administracyjny
- pozostałe → strona portfolio

Warstwa `apps/shared/database` zawiera zapytania do Supabase, mapowanie wierszy na typy domenowe oraz logikę URL-i obrazów ze storage. Oba fronty korzystają z tej samej warstwy danych.

Panel admin wymaga zalogowanego użytkownika z włączonym MFA. Edge Functions (np. `translate-text`) obsługują tłumaczenia i są testowane skryptem `security:smoke`.

## Licencja

Projekt prywatny — wszelkie prawa zastrzeżone.
