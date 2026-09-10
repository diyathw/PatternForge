# PatternForge — Content Schema

Canonical TypeScript definitions live in `src/types/domain.ts` — this document explains the fields in prose; the code is the source of truth if the two ever disagree.

## KnowledgeNode

The base unit of the taxonomy. Every algorithm, technique, data structure, problem shape, strategy, optimization, and concept is one of these.

| Field | Meaning |
|---|---|
| `id` | canonical kebab-case id, minted once in `data/taxonomy/`, referenced everywhere else |
| `type` | `algorithm \| pattern \| data-structure \| problem-shape \| strategy \| optimization \| concept` — these are deliberately distinct; e.g. "Dijkstra" is an `algorithm`, "Sliding Window" is a `pattern`, "Heap" is a `data-structure`, "Anagram" is a `problem-shape`, "Greedy" is a `strategy` |
| `parent` | id of the node this is a variant/child of (e.g. `anagram`'s parent is `frequency-counting`) — used to avoid flat proliferation of near-duplicate nodes |
| `category` | one of the 12 top-level taxonomy dimensions (data structures, algorithmic techniques, problem shapes, optimization patterns, graph algorithms, string algorithms, mathematical algorithms, range-query techniques, tree techniques, advanced dynamic programming, computational geometry, competitive-programming techniques) |
| `difficulty` | `beginner \| core \| intermediate \| advanced \| specialist` |
| `interviewFrequency` | `low \| medium \| high \| very-high` — kept separate from `difficulty` so an advanced-but-common pattern (e.g. Union Find) isn't mislabeled, and a simple-but-rare one isn't overrated |
| `recognitionClues` | short phrases that should make a learner think of this node when reading a problem |
| `commonProblemShapes` | ids of `ProblemShape` nodes this one frequently solves |
| `contentStatus` | `skeleton \| in-progress \| complete` — see ARCHITECTURE.md's content depth model |

## Relationship

`{ from, to, relation }` edges over node ids. `relation` is one of: `prerequisite-of`, `variant-of`, `uses`, `commonly-confused-with`, `optimization-of`, `alternative-to`, `useful-for`, `combines-with`, `commonly-solved-by`. These power the Pattern Relationship Engine and the confusion-pair lessons — a `commonly-confused-with` edge between two patterns is what the Recognition Trainer turns into a `ConfusionPair` lesson.

## ProblemShape

Extends `KnowledgeNode` (`type: "problem-shape"`) with `recognitionWords` (phrasings that signal this shape), `candidatePatternIds` (the patterns that might solve it), and `disambiguation` (prose explaining which constraint picks the final pattern — e.g. "positive numbers only → sliding window may work; negative numbers allowed → prefix sum + hash map is usually necessary").

## ComplexityHeuristic

`{ id, constraint, viableApproaches, caveat }` — maps an input-size constraint (`"n <= 20"`) to algorithm classes that become viable (`["bitmask DP", "meet-in-the-middle"]`), with an explicit `caveat` stating this is a heuristic, not a guarantee.

## VisualizationStep

One frame of a hand-traced walkthrough: `description` (what/why/what's-next), optional `codeLine`, `variables`, `highlights`, `action`. Also carries the legacy `window.PATTERN_DATA` fields (`cellStates`, `pointers`, `windowRange`, `stack`, `stats`) as optional passthrough so old hand-traced sequences port without reshaping — new content should prefer the newer fields where it can.

## PatternContent

Deep content for a single pattern: `problemStatement`, `explanation`, `visualIntuition`, `steps` (`VisualizationStep[]`), `templates` (`{ javascript, python }` idiomatic code, not mechanical translations of each other), `workedExample`, `edgeCases`, `mistakes`, `relatedPatterns`. Only exists for nodes at `contentStatus: "complete"`.

## CodingExercise

`patternIds`/`problemShapeIds` link an exercise to the graph (an exercise can legitimately belong to multiple patterns — e.g. an Anagram exercise might accept both a sorting solution and a frequency-map solution). `prompt`/`examples` are original writing, never copied from LeetCode. `starterCode`/`solutions` are per-language. `tests` are `TestCase[]` with an optional `hidden` flag for tests not shown to the learner before running. `hints` are leveled (1 = gentle nudge, higher = closer to the answer) to support the reveal ladder.

## RecognitionQuestion / ConfusionPair / DecisionTreeNode

Power the Recognition Trainer. A `RecognitionQuestion` presents a problem-shaped prompt with `clues`, a set of `correctPatternIds`, and plausible `distractorPatternIds`. A `ConfusionPair` is a two-pattern lesson keyed off a `commonly-confused-with` relationship, with a `distinguishingQuestion` the learner should learn to ask (e.g. "are weights allowed to be negative?" for Dijkstra vs Bellman-Ford). A `DecisionTreeNode` is one step of a guided walk from a question to either another node or a resolved pattern (`"pattern:<id>"`).

## MasteryRecord / DailyPracticeSet

`MasteryRecord` tracks per-node progress with a weighted score (recognition 30%, coding 30%, trace/debug 15%, complexity 10%, retention 15%), a `status` ladder (`not-started → learning → practicing → interview-ready → mastered`), a `confidenceHistory`, and `nextReviewAt` on a 1/3/7/14/30-day spaced-repetition schedule that pulls forward on low confidence or incorrect answers. `DailyPracticeSet` is the generated daily bundle: recognition questions, one coding exercise, a template-recall question, a complexity question, one weak-topic focus, and due spaced-repetition reviews.
