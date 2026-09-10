# PatternForge — Authoring Guide

How to add a new taxonomy node, or deepen an existing skeleton node into full content. See `CONTENT_SCHEMA.md` for field meanings and `src/types/domain.ts` for exact types.

## Adding a new node to the taxonomy (skeleton)

1. Pick a canonical kebab-case `id`. Check `src/data/taxonomy/` first — if a close variant already exists, consider making your node a `parent`/`variant-of` child of it instead of a new top-level node (e.g. don't add `duplicate-detection` as unrelated to `frequency-counting` if it's really a variant of it).
2. Add the `KnowledgeNode` (or `ProblemShape`, if applicable) to the appropriate category file under `src/data/taxonomy/`.
3. Add any `Relationship` edges to `src/data/taxonomy/relationships.ts` — at minimum a `prerequisite-of` or `variant-of` edge connecting it into the graph; add `commonly-confused-with` edges for any pattern it's easy to mix up with.
4. Leave `contentStatus: "skeleton"`. Do not fabricate `recognitionClues` or `complexityNotes` — keep them short and accurate even at skeleton stage; these are what power search and the recognition engine even before deep content exists.
5. Run `npm run typecheck` and regenerate `docs/TAXONOMY.md` via `npx tsx scripts/generate-taxonomy-doc.ts`.

## Deepening a skeleton node into complete content

1. Write the `PatternContent` record in `src/data/content/<id>.ts`. `problemStatement` and `workedExample` should be original writing. `steps` should be hand-traced — walk an actual example by hand and record what changes at each step; every step's `description` should answer what changed, why, and what decision comes next. Do not pad with steps that don't teach anything.
2. Write both `templates.javascript` and `templates.python` — idiomatic in each language (e.g. Python should use `Counter`/`defaultdict`/`heapq` where natural, not a line-by-line port of the JS).
3. Add one or more `CodingExercise` records in `src/data/exercises/<id>.ts`, spanning difficulties where it makes sense. Problem shapes with multiple valid approaches (e.g. Anagram: sorting vs frequency array vs hash map) should have exercises/content that explicitly discuss the tradeoffs rather than presenting only one approach as correct.
4. If this pattern is commonly confused with another, add or update a `ConfusionPair` in `src/data/recognition/` rather than leaving the distinction only implicit in prose.
5. Update the node's `contentStatus` to `"complete"` in its taxonomy file only once steps, both templates, and at least one exercise exist.
6. Avoid absolute claims the QA pass would reject — e.g. never state "subarray always means sliding window" or "weighted graph means Dijkstra" without immediately noting the exceptions (prefix sum/Kadane/DP for subarrays; Bellman-Ford for negative weights).

## Adding a recognition question or confusion pair

Add to `src/data/recognition/`. A `RecognitionQuestion` needs plausible `distractorPatternIds`, not just the correct answer — a question with an obvious-by-elimination answer doesn't train recognition. A `ConfusionPair`'s `distinguishingQuestion` should be the single question that actually resolves the ambiguity (e.g. "can edge weights be negative?" for Dijkstra vs Bellman-Ford), not a restatement of both patterns' definitions.

## Regenerating the taxonomy doc

`docs/TAXONOMY.md` is generated, never hand-edited. After any change under `src/data/taxonomy/`, run:

```bash
npx tsx scripts/generate-taxonomy-doc.ts
```
