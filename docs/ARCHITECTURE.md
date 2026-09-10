# PatternForge — Architecture

## Goal

Train the reasoning chain a strong problem-solver actually uses, not memorization of individual solutions:

```
Read question → identify problem shape → inspect constraints → identify candidate
data structures → identify candidate patterns → eliminate invalid approaches →
estimate complexity → choose the best pattern → recall reusable template → code
→ test edge cases
```

Every subsystem below exists to support one link in that chain.

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| App framework | Vite + React 19 + TypeScript | fast dev loop, static build, no server required |
| Styling | Tailwind CSS via `@tailwindcss/vite` | utility-first, no separate config file needed |
| Routing | React Router | standard SPA routing for the 12 nav pages |
| State/persistence | Zustand + `persist` (localStorage) | no backend; progress/mastery survive reloads |
| Code editor | `@monaco-editor/react` | full-featured editor, JS/Python syntax highlighting |
| JS execution | Web Worker + `new Function` | sandboxed, never touches the main thread, timeout-guardable |
| Python execution | `pyodide` (lazy dynamic import), inside a Worker | real CPython-in-WASM; only loaded when the Python tab opens, keeps initial bundle small |
| Tests | Vitest + React Testing Library | fast, Vite-native, jsdom environment |
| Relationship graph rendering | hand-rolled SVG/Canvas force layout | avoids an extra charting dependency for one graph view |

## Layered structure

```
types/        canonical domain model (Agent 0 only)
data/         static knowledge: taxonomy, content, exercises, recognition bank
engine/       behavior: visualization playback, code execution, mastery scoring, recognition reasoning
store/        persisted app state (Zustand)
pages/        one file per top-level nav destination
components/   shared UI (shell, sidebar, search)
```

Data flows one direction: `data/` is read by `engine/` and `pages/`; `engine/` is read by `pages/`; `pages/` never write back into `data/`. User progress/answers live only in `store/`.

## Knowledge graph

The taxonomy is a graph, not a flat list. Every algorithm, technique, data structure, problem shape, strategy, optimization, and concept is a `KnowledgeNode` (see `CONTENT_SCHEMA.md`) with an explicit `type` — a Problem Shape (e.g. "anagram") and a Pattern (e.g. "sliding window") are never conflated into the same type even though the UI may show them side by side. `Relationship` edges (`prerequisite-of`, `variant-of`, `commonly-confused-with`, `commonly-solved-by`, etc.) connect nodes so the Pattern Relationship Engine can render "3Sum → Sorting → Two Pointers → K-Sum" style chains instead of treating patterns as isolated flashcards.

Variants nest under a parent instead of proliferating as unrelated top-level entries: `Hashing → Frequency Counting → Anagram → Duplicate Detection` is one lineage via `parent`/`variant-of`, not four independent nodes.

## Content depth model

`KnowledgeNode.contentStatus` is `"skeleton" | "in-progress" | "complete"`. The full ~300+-node taxonomy is populated as skeleton entries immediately (browsable, searchable, linked into the relationship graph, covered by recognition clues and complexity heuristics). Only the first-release list (~30 highest-frequency, foundational patterns — Hash Map, Two Pointers, Sliding Window, Binary Search, Monotonic Stack, Union Find, Dijkstra, 1D/2D DP, Knapsack, Trie, etc.) reaches `"complete"`: hand-traced visualization steps, JS+Python templates, worked examples, exercises, and tests. A detail page for a skeleton node shows "content coming soon," never a broken visualizer. Deepening a skeleton node into a complete one later should require no schema changes — only adding a `PatternContent`/`CodingExercise` record referencing the existing id.

## Visualization engine

Reusable primitives (`ArrayCell`, `Pointer`, `SlidingRange`, `HashBucket`, `StackView`, `QueueView`, `HeapTree`, `LinkedListNode`, `TreeNode`, `GraphNode`/`GraphEdge`, `DPCell`, `RecursionTree`, `IntervalTimeline`, `BitView`, `MatrixCell`) are composed by each pattern's visualizer, driven by a `VisualizationStep[]` array. A single `VisualizationPlayer` component provides play/pause/next/previous/reset/speed/jump-to-step for every visualizer — visualizers differ only in which primitives they render per step, not in playback mechanics. Every step's `description` must answer what changed, why, and what decision comes next; steps that don't teach anything shouldn't exist.

## Coding practice engine

Monaco renders `starterCode[language]`; "Run Tests" executes the learner's code against `CodingExercise.tests` inside the appropriate sandboxed Worker (JS: `new Function` sandbox; Python: Pyodide) and reports pass/fail per test without ever `eval`-ing on the main thread. The reveal ladder (pattern name → pseudocode → template → full solution) and a complexity self-check question sit alongside the editor.

## Recognition & mastery

The Recognition Trainer surfaces `RecognitionQuestion`s and `ConfusionPair`s (e.g. Two Pointers vs Sliding Window, BFS vs Dijkstra, Segment Tree vs Fenwick Tree) so learners practice choosing an approach before writing code. `MasteryRecord` tracks a weighted score (recognition 30%, coding 30%, trace/debug 15%, complexity 10%, retention 15%) and a spaced-repetition schedule (1/3/7/14/30 days, pulled forward on low-confidence or incorrect answers) that feeds the Daily Practice generator.

## Extending this system

See `AUTHORING_GUIDE.md` for the concrete steps to add a new taxonomy node or deepen an existing skeleton into full content. `TAXONOMY.md` is generated (via `scripts/generate-taxonomy-doc.ts`) from `src/data/taxonomy/` — never hand-edit it.
