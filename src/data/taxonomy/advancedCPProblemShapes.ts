/**
 * Problem shapes for Track 7 (range-query techniques, and the general
 * "monotonic answer space" shape that binary-search-on-answer solves).
 *
 * SKELETON PASS ONLY: `contentStatus: "skeleton"` throughout.
 */
import type { ProblemShape } from "../../types/domain"

export const problemShapes: ProblemShape[] = [
  {
    id: "range-query",
    type: "problem-shape",
    name: "Range Query",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "high",
    recognitionClues: [
      "answer a query over a subrange [l, r] of an array",
      "sum/min/max/gcd of elements between two indices",
      "many queries against the same underlying array",
    ],
    recognitionWords: [
      "range sum",
      "range minimum",
      "range maximum",
      "query between indices",
      "subarray query",
    ],
    candidatePatternIds: ["prefix-sum", "fenwick-tree", "segment-tree", "sparse-table"],
    disambiguation:
      "First ask: does the array change between queries (updates interleaved with queries)? If STATIC (no updates): a 2D/1D prefix sum answers pure sum queries in O(1) after O(n) preprocessing; a sparse table answers min/max/gcd (idempotent) queries in O(1) after O(n log n) preprocessing and is the right default for static range-min/max. If DYNAMIC (point or range updates must be supported between queries): prefix sum and sparse table no longer work efficiently (rebuilding costs O(n) per update) — use a Fenwick tree for point-update/range-sum (simplest to code, O(log n) both ops), or a segment tree when the query is not sum (min/max/gcd/xor) or when both range updates and range queries are needed (segment tree, optionally with lazy propagation).",
    commonProblemShapes: [],
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "range-update",
    type: "problem-shape",
    name: "Range Update",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    recognitionClues: [
      "add a value to every element in a range",
      "apply an update to all elements between two indices",
      "multiple range updates, then read out final values (or query mid-stream)",
    ],
    recognitionWords: [
      "range add",
      "range increment",
      "range assign",
      "update all elements in [l, r]",
    ],
    candidatePatternIds: ["difference-array", "lazy-segment-tree"],
    disambiguation:
      "First ask: are queries interleaved with updates, or do all updates happen first and queries (or a single final readout) happen after? If updates are OFFLINE — apply all range updates, then read the final array once (or take a prefix sum at the end) — a difference array does each update in O(1) and reconstructs the final array in O(n) total, no tree needed. If range updates and range QUERIES are interleaved (an update, then a query, then another update, ...) and need to reflect current state each time, a difference array cannot answer point/range reads efficiently mid-stream — use a lazy segment tree instead, which supports O(log n) range update and O(log n) range query in any order.",
    commonProblemShapes: [],
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "static-min-max-query",
    type: "problem-shape",
    name: "Static Min/Max Query",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    recognitionClues: [
      "range minimum/maximum query, array is fixed and never modified",
      "many RMQ (range minimum query) style queries on the same static array",
    ],
    recognitionWords: [
      "range minimum query",
      "RMQ",
      "static array",
      "range max query",
      "no updates",
    ],
    candidatePatternIds: ["sparse-table"],
    disambiguation:
      "The defining constraint is 'no updates' — if that holds, a sparse table is essentially always the right call for idempotent range aggregates (min, max, gcd, and, or): O(n log n) preprocessing, O(1) per query. If updates are later added to the problem, this stops being this shape — it becomes Dynamic Range Sum / Range Query territory (Fenwick tree or segment tree) instead.",
    commonProblemShapes: [],
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "dynamic-range-sum",
    type: "problem-shape",
    name: "Dynamic Range Sum",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "high",
    recognitionClues: [
      "range sum query, but the array can also be updated (point updates)",
      "'range sum query - mutable' style problem",
      "interleaved update(index, value) and sumRange(l, r) calls",
    ],
    recognitionWords: [
      "range sum mutable",
      "update and query",
      "point update range sum",
      "dynamic array range sum",
    ],
    candidatePatternIds: ["fenwick-tree", "segment-tree"],
    disambiguation:
      "Both structures solve this in O(log n) per operation. Default to a Fenwick tree when the query is a plain sum (or any operation with a well-defined inverse, so ranges can be derived by subtracting two prefix queries) — it's simpler to code and has a smaller constant factor. Reach for a segment tree instead when the aggregate isn't invertible (min, max, gcd) or when the problem also needs range updates (pair with lazy propagation) or richer combine logic than a Fenwick tree's prefix-based trick can express.",
    commonProblemShapes: [],
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "monotonic-answer-space",
    type: "problem-shape",
    name: "Monotonic Answer Space",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "high",
    recognitionClues: [
      "minimize the maximum, or maximize the minimum, of something",
      "'find the smallest X such that condition holds' where feasibility only gets easier/harder as X grows",
      "answer isn't found by direct construction but by testing candidate answers for feasibility",
    ],
    recognitionWords: [
      "minimize the maximum",
      "maximize the minimum",
      "smallest value such that",
      "largest value such that",
      "feasibility check",
    ],
    candidatePatternIds: ["binary-search-on-answer"],
    disambiguation:
      "The deciding question is: as the candidate answer X increases, does whether X is 'feasible' change monotonically (all infeasible X below some threshold, all feasible X above it, or vice versa)? If feasibility is monotonic in the answer, binary search the answer space directly: binary search over candidate X values, and for each candidate run an O(check(X)) feasibility test, giving O(check(X) * log(range)) total instead of trying every possible X. If feasibility is NOT monotonic (there can be feasible X sandwiched between infeasible ones), binary search on answer is unsound and a different technique (DP, greedy, search) is required instead.",
    commonProblemShapes: [],
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
]
