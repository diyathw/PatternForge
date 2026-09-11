# PatternForge

A React + TypeScript learning SPA for recognizing algorithmic structure across interviews, university algorithms and competitive programming. The curriculum distinguishes algorithms, patterns, data structures, strategies and recurring problem shapes; it does not claim a fixed universal number of patterns.

Live at [diyathw.github.io/PatternForge](https://diyathw.github.io/PatternForge/), deployed automatically from `main` via `.github/workflows/deploy.yml`.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Practice defaults to JavaScript and supports Python. Language choice, theme preference, exercise drafts and learner progress are saved in this browser's local storage. There is no account or backend synchronization.

## Development checks

```bash
npm run check       # ESLint + typecheck + tests
npm run lint:fix    # apply ESLint auto-fixes
npm run build
npm run preview
```

Husky installs the pre-commit hook during `npm install`; every commit runs `npm run check`. `npm run lint:oxlint` retains the optional fast Oxlint pass. ESLint uses a flat JS/TypeScript configuration with React hook correctness rules.

The same checks (typecheck, lint, test, build) run in CI on every push and pull request to `main` (`.github/workflows/ci.yml`).

## Architecture and handoff

- [Current progress and exact resume steps](docs/PROGRESS.md)
- [Implementation phases and agent ownership](docs/IMPLEMENTATION_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Shared content schema](docs/CONTENT_SCHEMA.md)
- [Authoring guide](docs/AUTHORING_GUIDE.md)
- [Curriculum audit](docs/CURRICULUM_QA.md)
- [Generated taxonomy](docs/TAXONOMY.md)

Canonical curriculum IDs live in `src/data/taxonomy/`; shared domain interfaces live in `src/types/domain.ts`. New curriculum content must reference those IDs. Fully developed core lessons and lighter specialist entries coexist; the application should indicate actual available content.

Routing (`src/App.tsx`) uses React Router's `HashRouter` (`#/route`) rather than `BrowserRouter`. This is deliberate: GitHub Pages is a static host with no server-side rewrite rule, so a deep link or refresh on a non-root route would 404 under path-based routing, while hash routes always resolve to `index.html` regardless of what follows the `#`. Don't change this back to `BrowserRouter` without also solving that problem another way. The production base path (`/PatternForge/` vs `/`) is set in `vite.config.ts` via the `GITHUB_PAGES` env var, which is only set by the deploy workflow.

## Code execution

JavaScript and Python run in disposable Web Workers with cancellation and time limits. Python loads Pyodide lazily; its matching runtime files are included under `public/pyodide/`. Monaco uses local package assets. Worker execution keeps learner code off the UI thread, but is not a hardened isolation boundary for deliberately hostile code. Local hidden-style fixtures are pedagogical checks and are inspectable by the learner.

When upgrading Pyodide, refresh `pyodide.asm.mjs`, `pyodide.asm.wasm`, `pyodide-lock.json`, and `python_stdlib.zip` in `public/pyodide/` from the installed package together, then validate Python in a production preview.

Mastery scores are transparent learning heuristics, not validated measurements of ability. Constraint-based recommendations explain assumptions and alternatives; learners must still verify correctness and complexity.
