# PatternForge session handoff

Updated: 2026-09-11 (Claude integration session; app builds, tests, and runs end-to-end).

## Resume here

Read this file, `IMPLEMENTATION_PLAN.md`, `CURRICULUM_QA.md`, and root agent instructions (`CLAUDE.md`/`AGENTS.md`). Run `git status --short` before assigning further work — the working tree is currently clean and committed. If multiple sessions (Claude and/or Codex) are working on this repo concurrently, check `git log` and recent file mtimes before editing, and keep only one orchestrator writing at a time.

## What's actually done and verified

- Phases 0-1 committed (`fe3f931`, `a0e7a08`): scaffold, shared domain types, full taxonomy skeleton.
- Full taxonomy: 384 knowledge nodes + 59 problem shapes across all 12 category dimensions, 964 relationship edges (includes auto-derived `commonly-solved-by` edges per problem shape plus hand-authored cross-cutting/confusion-pair edges), 6 complexity heuristics. `src/data/taxonomy/taxonomy.test.ts` enforces integrity: unique IDs, resolvable references, acyclic parent/prerequisite chains, no oversimplified absolute claims.
- 29 patterns have deep content (`src/data/content/{arrays,graphs,structures}.ts` via the `catalog.ts` `add()` helper) — explanation, visual intuition, hand-traced visualization steps, JS+Python templates, worked example, edge cases, mistakes, related patterns — and their taxonomy node's `contentStatus` is flipped to `"complete"` to match (previously these were authored but the taxonomy still said `"skeleton"`; fixed this session).
- Recognition engine (`src/engine/recognitionGraph/`): real constraint-based reasoning (`analyzeProblem`) that parses free-text problem statements for size/weight/update-pattern clues and recommends candidate patterns with eliminations and rationale — not keyword-matching. 14 confusion pairs, ~26 recognition questions, a decision tree, all in `src/data/recognition/`.
- Mastery engine (`src/engine/mastery/`): weighted scoring (30/30/15/10/15), spaced repetition (1/3/7/14/30 days, pulled back on low confidence/incorrect), daily-practice generation. Persisted via `src/store/useLearningStore.ts` (Zustand + localStorage).
- Execution engine (`src/engine/execution/`): JS runs via sandboxed Worker + `new Function`; Python via lazily-loaded Pyodide Worker (assets staged into `public/pyodide/` by `scripts/stage-static-assets.mjs`, which runs automatically via `predev`/`prebuild` npm hooks — not manually copied). Monaco via `CodeEditor.tsx`.
- App shell (`src/App.tsx`): all 12 nav destinations implemented (Dashboard, Pattern Map, Problem Shapes, Learn, Lesson detail, Visualizer Lab, Practice, Recognition Trainer, Compare, Daily Practice, Progress, Cheat Sheet, Search) as one dense-but-complete component tree, React Router-based.
- Full visual design pass this session: `src/index.css` (~1600 lines) — dark graphite palette with a single teal accent reserved for active/current state, IBM Plex Sans/Mono, node-and-edge visual language (left-accent-bar panels instead of generic rounded-shadow cards), dot-grid texture on the main content area. Styles every class used across `App.tsx` and `src/engine/visualization/{VisualizationPlayer,primitives}.tsx`.
- Wired `src/data/checks/` (the trace/template/debug/complexity skill-check bank) into the UI — it was fully authored but never rendered anywhere. Added a `SkillChecks` component to the Lesson page (`App.tsx`) that surfaces a pattern's checks as a short MCQ with feedback, and records attempts into mastery (`trace`/`complexity` buckets) so those two mastery-score components actually get evidence.
- **Verified in a real browser this session** (not just typecheck/build): every one of the 12 nav destinations, a Lesson page with the visualization player (state explorer, play/pause/step controls, code skeleton with language toggle, skill-check quiz), Practice page — typed a real solution into Monaco and ran it through the JS worker, tests passed and rendered correctly — and the Pattern Map's relationship explorer. No console errors observed.
- `npm run typecheck`, `npm test` (9 files / 39 tests), and `npm run build` all pass clean.

## Bugs found and fixed this session (Claude)

- `src/App.tsx` referenced `./data/content` (needed `patternContents`/`contentById`) and `./data/exercises` (needed `exercises`) — neither index file existed. Added `src/data/content/index.ts` and `src/data/exercises/index.ts` (re-exports from content).
- `useLearningStore.setDraft(exerciseId, language, code)` (3 args) vs. two `App.tsx` call sites passing a pre-combined `key` (2 args) — fixed both call sites.
- Quick-sort visualization (`src/engine/visualization/sorting.ts`) had an off-by-one: `sort(0, a.length)` treated `r` as exclusive but the partition body used `a[r]` as an inclusive pivot index, corrupting the array for small inputs (caught by the existing `sorting.test.ts`, which had been silently passing because the test loop aborted on the first failing input). Fixed to `sort(0, a.length - 1)`.
- Production build failed: `monaco-editor/esm/vs/.../*.worker?worker` bare-specifier imports don't resolve under this Vite 8 (Rolldown) build — a current Rolldown limitation, not a config mistake. Fixed by importing via relative paths (`../../../node_modules/monaco-editor/esm/...?worker`) instead of bare specifiers; Rolldown resolves relative worker imports fine. Also added `monaco-editor` as an explicit direct dependency (it was only present as a transitive/hoisted dependency of `@monaco-editor/react`, which is fragile).
- No CSS existed for any of the ~110 semantic class names used across `App.tsx` and the visualization primitives — the app rendered as unstyled text. Wrote the full stylesheet (see above).
- `.cheat` (Cheat Sheet rows) combined the shared `.panel` class (1.5rem padding on the container) with its own child-level padding on `summary`/`p`/`pre`/`a` (designed for a flush, zero-padding container) — the two stacked, bloating every collapsed row to ~105px of mostly empty space. Fixed by zeroing `.panel`'s padding specifically for `.cheat`. Audited every other `.panel`-combo class name (`tinted`, `empty`, `table-scroll`) for the same doubling risk; none of the others had it.

## Known gaps / not yet done

- Bundle size warning on build (Monaco + language grammars push a few chunks over 500kB). Not a correctness issue; could be addressed later with `dynamic import()` code-splitting for `CodeEditor` if it matters for real-world load time. Not urgent for a learning tool.
- Python/Pyodide execution path was not live-tested in a browser this session (JS path was, and both share the same `runCode`/`runner.ts` logic, differing only in which Worker is spawned) — worth a real Python "Run tests" click next session.
- 4 non-blocking `oxlint` warnings (`react(set-state-in-effect)` x3, `react(purity)` x1) in `App.tsx`/`VisualizationPlayer.tsx` — style nitpicks about effect usage, not bugs; left as-is to avoid risking the tested behavior for marginal gain.
- Only 29/384 taxonomy nodes have deep content (`contentStatus: "complete"`); this matches the plan's intentional scope (full skeleton taxonomy + first-release core deepened), not an oversight. Deepening more patterns is future work — see `docs/AUTHORING_GUIDE.md`.
- `npm audit` reports one moderate transitive vulnerability (`dompurify` via `monaco-editor`, used only for the editor's internal tooltip sanitization — this app never feeds untrusted external HTML through Monaco). `npm audit fix --force` would downgrade `monaco-editor` to 0.53.0, a breaking change; left as-is rather than risk destabilizing the worker-loading fix. Revisit if monaco-editor ships a patched dompurify.
- `docs/CURRICULUM_QA.md` and `docs/IMPLEMENTATION_PLAN.md` (written by a prior Codex session) haven't been re-read line-by-line against the current taxonomy state by this session; skim them before making further curriculum claims.

## Exact next steps

1. Live-test the Python practice path in a browser (Pyodide cold-load takes a few seconds; confirm it actually initializes and a Python solution runs and passes).
2. Consider deepening a few more first-release patterns (target list is in the original build plan: ~30 core patterns; 29 done, close to complete).
3. If bundle size becomes a real concern, lazy-load `CodeEditor` more aggressively or drop unused Monaco language grammars.
4. Decide whether to commit `package-lock.json` changes (monaco-editor added as a direct dependency) — already included in this session's commit.
