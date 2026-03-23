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

Each set is a JSON file in `src/lib/content/sets/`. Example:

```json
{
  "id": "chapter-01",
  "title": "Chapter 1 — Basic Sentences",
  "description": "Introductory sentences from the textbook",
  "cards": [
    {
      "arabic": "مُحَمَّد طَالِب قَدِيم",
      "dutch": "Mohammed is een oude student"
    },
    {
      "arabic": "هَذَا دَرْس سَهْل",
      "dutch": "Deze les is makkelijk"
    }
  ]
}
```

---

## Study Modes

The app supports 4 study modes, selectable per session. Each mode supports **both directions**: Arabic → Dutch and Dutch → Arabic.

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

## Out of Scope

- User accounts or authentication
- Backend / database
- Admin UI to create/edit card sets (sets are managed via JSON files directly)
- Native mobile app
