# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project

PatternForge — a React + TypeScript SPA that teaches and visualizes the practical universe of algorithmic patterns, data structures, recurring problem shapes, and competitive-programming techniques (not limited to interview-style patterns). It combines a browsable knowledge graph, step-by-step visualizations, a Monaco-based JS/Python coding environment, a pattern-recognition trainer, and spaced-repetition mastery tracking.

See `docs/ARCHITECTURE.md` for the full system design, `docs/CONTENT_SCHEMA.md` for the data model, and `docs/AUTHORING_GUIDE.md` for how to add or deepen a pattern.

## Commands

```bash
npm run dev         # start Vite dev server
npm run build        # tsc -b type-check + production build
npm run typecheck     # tsc -b --noEmit only
npm test               # run Vitest once (npm run test:watch for watch mode)
npm run lint             # ESLint (JS/TypeScript + React hooks)
npm run check            # lint + typecheck + tests (also runs before commits)
npm run preview           # preview a production build
```

Run a single test file: `npx vitest run src/path/to/File.test.tsx`
Run tests matching a name: `npx vitest run -t "some test name"`

## Architecture

- **Build tooling**: Vite + React 19 + TypeScript, Tailwind CSS via `@tailwindcss/vite` (no separate PostCSS/Tailwind config file — the plugin handles it; styles are pulled in via `@import "tailwindcss"` in `src/index.css`).
- **Routing**: React Router (`src/router/`). Top-level nav pages live in `src/pages/`: Dashboard, Pattern Map, Problem Shapes, Learn, Visualizer Lab, Practice, Recognition Trainer, Compare, Daily Practice, Progress, Cheat Sheet, Search.
- **State/persistence**: Zustand with the `persist` middleware (localStorage) in `src/store/` — no backend. Holds progress, mastery, confidence, and streak data.
- **Shared domain types**: `src/types/domain.ts` is the single source of truth for every cross-cutting shape (`KnowledgeNode`, `Relationship`, `ProblemShape`, `VisualizationStep`, `PatternContent`, `CodingExercise`, `MasteryRecord`, etc.). Every other module imports from here rather than redefining shapes. All pattern/problem-shape ids are canonical kebab-case strings minted once in `src/data/taxonomy/` — other modules reference ids, they never invent new ones.
- **Knowledge graph data**: `src/data/taxonomy/` (nodes by category, relationships, problem shapes, complexity heuristics), `src/data/content/` (deep per-pattern content: explanation, templates, worked example, mistakes — filename = canonical id), `src/data/exercises/` (`CodingExercise` records), `src/data/recognition/` (recognition question bank, confusion pairs).
- **Engine layer** (`src/engine/`): `visualization/` (reusable visualization primitives — `ArrayCell`, `Pointer`, `HeapTree`, `GraphNode`/`GraphEdge`, etc. — plus the `VisualizationPlayer` play/pause/step/speed controller), `execution/` (Monaco wrapper, sandboxed JS Web Worker runner, lazily-loaded Pyodide Worker runner for Python, hint/reveal ladder), `mastery/` (mastery scoring formula, spaced-repetition scheduler, daily-practice generator), `recognitionGraph/` (decision-tree traversal + constraint-based reasoning).
- **Content status**: not every taxonomy node has deep content. `KnowledgeNode.contentStatus` is `"skeleton" | "in-progress" | "complete"` — the full taxonomy (~300+ nodes) exists as skeleton entries from the start; only a first-release set of ~30 core patterns is fully deepened. Any UI reading `PatternContent` must handle the skeleton case (show "content coming soon" rather than assuming content exists).
- **Code execution model**: JavaScript runs in a sandboxed Web Worker via `new Function` (never `eval` on the main thread) with a timeout guard. Python runs via the `pyodide` npm package, dynamically imported only when a learner opens the Python tab, also inside a Worker — keeps the initial bundle small.
- **Visualization step format**: `VisualizationStep` is a superset of the legacy hand-traced `window.PATTERN_DATA` step shape (`cellStates`, `pointers`, `windowRange`, `stack`, `stats` are kept as optional fields; legacy `message` maps to `description`) — new step data should still prefer `description`/`variables`/`highlights` where possible.

## Conventions

- Canonical ids are kebab-case and minted exactly once, in `src/data/taxonomy/`. Never invent a new pattern/problem-shape id from inside `pages/`, `engine/`, or `data/content|exercises|recognition` — if one is missing, add it to the taxonomy first.
- `src/types/domain.ts` is edited only when adding a genuinely new cross-cutting shape or field; prefer extending an existing interface over creating a parallel one.
- Exercise prompts and problem summaries are original writing, not copied verbatim from LeetCode or any other source.
- Pattern-recognition content must avoid oversimplified absolute claims (e.g. "subarray always means sliding window", "weighted graph means Dijkstra") — call out the exceptions (prefix sum/Kadane/DP for subarrays; Bellman-Ford for negative weights) explicitly.

## Session handoff

Before starting work, read `docs/PROGRESS.md` for the current implementation state, validation evidence, active ownership, and exact next steps. Read `docs/IMPLEMENTATION_PLAN.md` for agent responsibilities and integration rules, and `docs/CURRICULUM_QA.md` for the foundation audit.

Update `docs/PROGRESS.md` at milestones and before ending a session or approaching usage/context limits. Record unfinished work and failing checks honestly so either Claude or Codex can resume without repeating completed work. Background agents do not survive a session handoff; inspect their saved files before relaunching them.
