# PatternForge

A React + TypeScript learning SPA for recognizing algorithmic structure across interviews, university algorithms and competitive programming. The curriculum distinguishes algorithms, patterns, data structures, strategies and recurring problem shapes; it does not claim a fixed universal number of patterns.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Practice defaults to JavaScript and supports Python. Language choice, exercise drafts and learner progress are saved in this browser's local storage. There is no account or backend synchronization.

## Development checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

## Architecture and handoff

- [Current progress and exact resume steps](docs/PROGRESS.md)
- [Implementation phases and agent ownership](docs/IMPLEMENTATION_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Shared content schema](docs/CONTENT_SCHEMA.md)
- [Authoring guide](docs/AUTHORING_GUIDE.md)
- [Curriculum audit](docs/CURRICULUM_QA.md)
- [Generated taxonomy](docs/TAXONOMY.md)

Canonical curriculum IDs live in `src/data/taxonomy/`; shared domain interfaces live in `src/types/domain.ts`. New curriculum content must reference those IDs. Fully developed core lessons and lighter specialist entries coexist; the application should indicate actual available content.

## Code execution

JavaScript and Python run in disposable Web Workers with cancellation and time limits. Python loads Pyodide lazily; its matching runtime files are included under `public/pyodide/`. Monaco uses local package assets. Worker execution keeps learner code off the UI thread, but is not a hardened isolation boundary for deliberately hostile code. Local hidden-style fixtures are pedagogical checks and are inspectable by the learner.

When upgrading Pyodide, refresh `pyodide.asm.mjs`, `pyodide.asm.wasm`, `pyodide-lock.json`, and `python_stdlib.zip` in `public/pyodide/` from the installed package together, then validate Python in a production preview.

Mastery scores are transparent learning heuristics, not validated measurements of ability. Constraint-based recommendations explain assumptions and alternatives; learners must still verify correctness and complexity.
