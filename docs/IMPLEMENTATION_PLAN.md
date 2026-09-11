# PatternForge implementation and ownership

## Architecture
Preserve the React/TypeScript/Vite SPA. Static canonical curriculum flows into pure learning engines and React pages. Zustand persists device-local learner progress. JavaScript and Python execute in disposable workers with timeouts. Every subsystem imports shared interfaces from `src/types/domain.ts` and canonical IDs from `src/data/taxonomy/index.ts`.

## Agent ownership
- Agent 0 (lead): shared models, integration, progress documentation, final validation.
- Agent 1 (curriculum): taxonomy, canonical IDs, relationships, coverage review.
- Agent 2 (recognition): `src/engine/recognitionGraph`, `src/data/recognition`.
- Agent 3 (visualization): `src/engine/visualization` and associated tests.
- Agent 4 (practice): `src/engine/execution` and associated tests.
- Agent 5 (mastery): `src/engine/mastery`, `src/store` and associated tests.
- Agent 6 (product): app shell, pages, components, styles, navigation.
- Agent 7 (content): `src/data/content`, `src/data/exercises`.
- Agent 8 (QA): independent correctness and integration review; coordinate fixes with file owners.

Agents may perform sequential roles within the available concurrency slots. No agent edits another active owner's files. Only the lead changes shared domain models; requests for fields go through the lead. No parallel models or invented curriculum IDs. No commits or deployment without lead coordination.

## Phases and acceptance
1. Foundation: audit existing taxonomy; verify references, hierarchy and broad requested coverage before implementation.
2. Learning intelligence: tested recognition, constraint comparisons, mastery, repetition and daily practice.
3. Product: responsive accessible shell and all twelve working navigation destinations.
4. Visualization: reusable playback and meaningful algorithm-specific traces for first-release topics.
5. Practice: Monaco, language switching, worker execution, tests, hints and reset.
6. Content: original lessons and idiomatic JS/Python exercises for first-release topics; clearly label lighter advanced entries.
7. Integration: connect learning, progress and practice; verify persistence and deep links.
8. QA: algorithm checks, tests, type checking, lint, production build and browser interaction checks.

## Integration rules
Use existing architecture and domain docs. Keep advanced coverage expandable: no claim of a fixed universal pattern count. Distinguish problem shapes from algorithms. Constraints qualify recommendations; no absolute keyword rules. Language defaults to JavaScript. All important content explains state, transitions, complexity, edge cases and tradeoffs. Skeleton topics remain browsable and explicitly lighter. Update progress with actual evidence rather than marking planned features complete.
