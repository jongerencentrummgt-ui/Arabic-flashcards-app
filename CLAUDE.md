## Project Configuration

- **Language**: None
- **Package Manager**: pnpm
- **Add-ons**: eslint, prettier

---

# arabic-flashcards

A lightweight flashcard web app for a small Arabic study group. Built with SvelteKit, no backend, no accounts — everything runs in the browser.

---

## Stack

- **Framework**: SvelteKit (Svelte 5 with runes syntax)
- **Language**: JavaScript (no TypeScript)
- **Package manager**: pnpm
- **Styling**: Plain CSS with custom properties (no Tailwind, no UI library)
- **Data**: Static JSON files in `$lib/content/` — card sets are managed by the developer, not end users
- **Persistence**: `localStorage` for study progress and settings
- **Deployment**: Vercel (`@sveltejs/adapter-vercel`)

---

## Project Structure

```
src/
├── lib/
│   ├── content/
│   │   └── sets/
│   │       └── chapter-01.json   # card sets (one file per set)
│   ├── components/
│   │   ├── Flashcard.svelte
│   │   ├── MultipleChoice.svelte
│   │   ├── TypeAnswer.svelte
│   │   └── StudyProgress.svelte
│   └── stores/
│       └── progress.js           # localStorage-backed progress store
├── routes/
│   ├── +page.svelte              # home: list of all sets
│   ├── sets/[slug]/
│   │   └── +page.svelte          # set detail + mode picker
│   └── study/[slug]/[mode]/
│       └── +page.svelte          # active study session
static/
CLAUDE.md
```

---

## Card Set Format

Each set is split into **one file per language** in `src/lib/content/sets/`, named `[slug].[lang].json` (e.g. `chapter-01.nl.json`). Supported language suffixes: `en`, `nl`, `tr`.

The universal field name for the non-Arabic side is `translation` — the language is determined by the filename, not the field name.

```json
{
  "id": "chapter-01",
  "slug": "chapter-01",
  "cards": [
    {
      "arabic": "مُحَمَّد طَالِب قَدِيم",
      "translation": "Mohammed is an old student"
    },
    {
      "arabic": "هَذَا دَرْس سَهْل",
      "translation": "This lesson is easy"
    }
  ]
}
```

The app loads the file matching the user's active locale (stored in localStorage as `locale`), falling back to `.en.json` if the locale file doesn't exist. Set titles and descriptions are **not** in the JSON — they live in the i18n files under `sets.[slug].title` and `sets.[slug].description`.

When adding a new card set, create `[slug].en.json`, `[slug].nl.json`, and `[slug].tr.json`.

---

## Study Modes

The app supports 4 study modes, selectable per session. Each mode supports **both directions**: Arabic → Translation (default) and Translation → Arabic (reverse mode, toggled on the set detail page).

| Mode | Description |
|---|---|
| `flashcard` | Flip card to reveal translation |
| `multiple-choice` | Pick correct answer from 4 options |
| `type-answer` | Type the translation, checked on submit |
| `spaced-repetition` | Cards marked hard come back sooner |

---

## Design

- Dark theme, gold (`#c9a84c`) and green (`#a8d8b0`) accent colors
- Arabic text uses `Amiri` (Google Fonts), UI uses `Outfit`
- Arabic is always rendered `direction: rtl`
- CSS variables defined in `app.css`, no scoped design tokens per component

### Key CSS variables

```css
--bg: #0f1117;
--surface: #1a1d27;
--surface2: #222636;
--gold: #c9a84c;
--gold-light: #e8c97a;
--green-text: #a8d8b0;
--cream: #f0e6c8;
--text: #e2e8f0;
--muted: #64748b;
--border: rgba(255, 255, 255, 0.07);
--radius: 16px;
```

---

## Svelte Conventions

- Use **Svelte 5 runes** syntax: `$state`, `$derived`, `$props`, `$effect`
- Event handlers use `onclick` (not `on:click`)
- No TypeScript — plain `.js` and `.svelte` files only
- Keep components small and focused — one responsibility per component

---

## Commands

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Getting Started

```bash
pnpm create svelte@latest arabic-flashcards
# choose: Skeleton project, no TypeScript, ESLint + Prettier

cd arabic-flashcards
pnpm install
pnpm install -D @sveltejs/adapter-vercel

# replace adapter-auto with adapter-vercel in svelte.config.js
```

---

## Internationalisation

- UI strings use `svelte-i18n` with three locales: `en`, `nl`, `tr`
- Translation files live in `src/lib/i18n/` (`en.json`, `nl.json`, `tr.json`)
- Set titles and descriptions are also translated via i18n, not hardcoded in the JSON files
- Keys follow the pattern: `sets.[slug].title` and `sets.[slug].description`
- When adding a new card set: add the slug, title, and description to all 3 locale files (`en.json`, `nl.json`, `tr.json`) in addition to creating the JSON file in `src/lib/content/sets/`
- Card sets are split per language: `[slug].[locale].json` (e.g. `chapter-01.nl.json`)
- The active locale is read from localStorage (key: `locale`) to load the matching file
- Falls back to `[slug].en.json` if the locale file doesn't exist
- Progress in localStorage is keyed by `[slug].[locale]` so progress is tracked separately per language

---

## Theming

- Dark theme is the default (`:root` variables in `app.css`)
- Light theme is applied via `[data-theme="light"]` on the `<html>` element
- The active theme is managed by `src/lib/stores/theme.js`, which exports `theme` (writable store with resolved value `'dark' | 'light'`), `initTheme()`, and `toggleTheme()`
- `initTheme()` is called in `+layout.svelte` at startup; reads the override from localStorage (key: `theme`), falls back to `window.matchMedia('(prefers-color-scheme: dark)')`, and listens for system preference changes when no override is set
- A toggle button (☀︎ / ☽) in the nav calls `toggleTheme()`, which saves the override to localStorage

---

## Out of Scope

- User accounts or authentication
- Backend / database
- Admin UI to create/edit card sets (sets are managed via JSON files directly)
- Native mobile app
