/**
 * Track 5 — Algorithm Taxonomy & Curriculum Architect.
 *
 * Problem shapes for the Recursion/Backtracking, Divide and Conquer, Greedy,
 * and Dynamic Programming taxonomy in `strategiesAndDPNodes.ts`. Skeleton
 * pass only: metadata (names, recognition clues/words, candidate patterns,
 * disambiguation prose) — no deep content yet. Every entry here is
 * `contentStatus: "skeleton"`.
 *
 * These ids are exactly the ones referenced by `commonProblemShapes` in
 * `strategiesAndDPNodes.ts` (permutations-shape, combinations-shape,
 * subsets-shape, partition-problems, scheduling-problems, matching-problems,
 * state-space-search, constraint-satisfaction) — this file is what resolves
 * those dangling references.
 *
 * Conventions:
 * - `category` is "problem-shapes" for every entry in this file.
 * - `candidatePatternIds` draw primarily from ids minted in
 *   `strategiesAndDPNodes.ts`; a few reach across tracks (e.g.
 *   "bipartite-matching", "bfs") and are referenced by id only — they are
 *   expected to be minted by the graphs track, reconciled in a later
 *   integration pass, per that file's own convention.
 */
import type { ProblemShape } from "../../types/domain"

export const problemShapes: ProblemShape[] = [
  {
    id: "permutations-shape",
    type: "problem-shape",
    name: "Permutations",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    recognitionClues: [
      "'return all possible orderings/arrangements' of the input",
      "order matters — [1,2] and [2,1] count as different results",
      "expected result count is n! (or a fraction of it with duplicates removed)",
      "'next permutation' / 'kth permutation' phrasing",
      "arrange ALL elements, not a subset of them",
    ],
    recognitionWords: [
      "permutation",
      "arrangement",
      "ordering",
      "order matters",
      "rearrange",
      "all possible orders",
    ],
    candidatePatternIds: ["permutations", "backtracking", "bitmask-dp"],
    disambiguation:
      "Use `permutations`/`backtracking` (choose-explore-undo over a used[] set or in-place swapping) when every distinct ordering must actually be enumerated and n is small enough that n! is tractable (roughly n <= 10-12). When the problem only asks for an optimal cost/count over all orderings — not the orderings themselves — and n <= ~20, `bitmask-dp` (state = which elements have been placed) computes the answer in O(2^n * n)-ish time without ever materializing an ordering, which is exponentially cheaper than generating all n! permutations.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "combinations-shape",
    type: "problem-shape",
    name: "Combinations",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    recognitionClues: [
      "choose k elements out of n, order does NOT matter",
      "'return all combinations of size k'",
      "'find all unique combinations that sum to target'",
      "expected result count is C(n, k) or bounded by it",
      "a start index in the recursion prevents re-deriving the same combination in a different order",
    ],
    recognitionWords: [
      "combination",
      "choose k",
      "subset of size k",
      "order doesn't matter",
      "sum to target",
    ],
    candidatePatternIds: [
      "combinations",
      "combination-sum",
      "backtracking",
      "01-knapsack",
      "subset-sum",
    ],
    disambiguation:
      "Enumerate every combination itself -> `combinations`/`backtracking` with a start-index guard to avoid order-duplicates. Elements may repeat and must sum exactly to a target while still enumerating every valid combination -> `combination-sum`. When the question only needs whether/how many/the best-value combination of a given size or sum exists — not the actual list of combinations — that's a counting/feasibility/optimization question, which is `01-knapsack`/`subset-sum` DP instead, and is far cheaper than enumerating C(n,k) combinations.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "subsets-shape",
    type: "problem-shape",
    name: "Subsets",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "very-high",
    recognitionClues: [
      "'return all subsets' / power set of the array",
      "expected result count is 2^n (or fewer once duplicates are pruned)",
      "each element is independently included or excluded",
      "'count the number of subsets with sum equal to X' or a similar aggregate property",
      "'subsets II' style — input has duplicate values that must not produce duplicate subsets",
    ],
    recognitionWords: [
      "subset",
      "power set",
      "all subsets",
      "include or exclude",
      "2^n",
    ],
    candidatePatternIds: ["backtracking", "subset-sum", "01-knapsack", "bitmask-dp"],
    disambiguation:
      "Need to actually list every subset -> `backtracking` (include/exclude recursion, sorted + skip-duplicates for 'Subsets II') or an iterative bitmask enumeration over 0..2^n-1. Need only to know whether some subset (or how many subsets) satisfies a sum/count property, without listing them -> DP (`subset-sum` for boolean reachability, `01-knapsack` for a value-optimizing variant) — dramatically cheaper than materializing 2^n subsets. Need the OPTIMAL value achievable for every possible subset composition simultaneously (n <= ~20) -> `bitmask-dp`, where the mask itself is the DP state.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "partition-problems",
    type: "problem-shape",
    name: "Partition Problems",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "high",
    recognitionClues: [
      "'split the array into two (or k) groups' optimizing or matching a property of the sums",
      "'can this array be partitioned into two subsets with equal sum'",
      "'minimum possible difference between the sums of two subsets'",
      "'partition into k equal-sum subsets'",
      "'palindrome partitioning' style — split a string into pieces each satisfying a property",
    ],
    recognitionWords: [
      "partition",
      "split into groups",
      "equal sum subsets",
      "divide into k subsets",
      "minimize difference",
    ],
    candidatePatternIds: [
      "subset-sum",
      "partition-dp",
      "01-knapsack",
      "backtracking",
      "greedy",
    ],
    disambiguation:
      "Need only feasibility or the optimal sum-difference for a two-group split, with a sum small enough to index (roughly <= 10^4-10^5) -> `subset-sum`/`partition-dp` DP, which reduces the equal-sum case directly to target = totalSum / 2. Need to enumerate ALL valid partitions, split into k > 2 groups with small n, or the partition unit is non-numeric (e.g. palindrome partitioning of a string) -> `backtracking`/`01-knapsack`-style DP over group assignments. A simple sort-then-greedy rule provably yields the optimal split (rare — must verify the greedy-choice property first) -> `greedy`.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "scheduling-problems",
    type: "problem-shape",
    name: "Scheduling Problems",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "very-high",
    recognitionClues: [
      "intervals or jobs with start/end times (or a deadline) to arrange",
      "'maximize the number of non-overlapping meetings/intervals you can attend'",
      "'jobs with deadlines and profits — schedule a subset to maximize profit'",
      "'minimum number of meeting rooms/resources needed'",
      "weighted intervals where each choice also carries a cost or value to optimize",
    ],
    recognitionWords: [
      "interval",
      "meeting",
      "deadline",
      "schedule",
      "overlap",
      "resources",
    ],
    candidatePatternIds: [
      "interval-scheduling",
      "greedy",
      "deadline-scheduling",
      "activity-selection",
      "01-knapsack",
    ],
    disambiguation:
      "Maximize the COUNT of non-overlapping intervals (no per-interval value) -> `interval-scheduling`/`activity-selection`, greedy sorted by end time. Jobs each have a deadline and a profit, one job per slot -> `deadline-scheduling`, greedy sorted by profit descending, placed in the latest free slot. Intervals carry weights/values and a simple greedy order is NOT provably optimal (e.g. weighted interval scheduling, or a capacity/budget constraint beyond 'no overlap') -> DP over intervals sorted by end time, shaped like `01-knapsack` (take-or-skip each interval, skip forward past whatever it conflicts with).",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "matching-problems",
    type: "problem-shape",
    name: "Matching Problems",
    category: "problem-shapes",
    difficulty: "advanced",
    interviewFrequency: "medium",
    recognitionClues: [
      "pair up elements from two groups so every element is matched at most once",
      "'assignment problem' — assign each worker to exactly one task minimizing/maximizing total cost",
      "'maximum bipartite matching' between two disjoint sets",
      "n is small (<= ~20) and the state is naturally 'which right-side elements are already taken'",
      "note: algorithmic matching (pairing elements under constraints), not string/pattern matching",
    ],
    recognitionWords: [
      "matching",
      "pairing",
      "assignment",
      "bipartite",
      "one-to-one correspondence",
    ],
    candidatePatternIds: ["bitmask-dp", "bipartite-matching", "greedy"],
    disambiguation:
      "Small n (roughly <= 20) and the goal is an optimal-cost/value one-to-one assignment -> `bitmask-dp`, with the mask tracking which elements on one side are already used. General maximum bipartite matching (unweighted, cardinality only, n can be much larger) -> `bipartite-matching` (graphs track — augmenting-path/Hopcroft-Karp based; referenced by id only, minted elsewhere). A simple sorted-greedy pairing provably achieves the optimum (e.g. pairing two sorted arrays to minimize/maximize the sum of paired differences) -> `greedy`, with an exchange-argument proof.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "state-space-search",
    type: "problem-shape",
    name: "State-Space Search",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    recognitionClues: [
      "explore reachable states/configurations one legal move/transformation at a time",
      "'find the shortest sequence of moves/transformations from a start state to a goal state'",
      "each state has a well-defined set of neighboring states reachable by one operation",
      "word ladder, sliding puzzle, grid traversal with a visited-state set",
      "state may be composite (position + extra flags), not just a plain grid cell",
    ],
    recognitionWords: [
      "state space",
      "reachable states",
      "sequence of moves",
      "transform step by step",
      "visited states",
    ],
    candidatePatternIds: ["backtracking", "word-search", "bitmask-dp", "bfs"],
    disambiguation:
      "Need to enumerate all paths, or find ANY valid path where choices must be undoable to try alternatives -> `backtracking` (DFS with choose/explore/undo, e.g. `word-search`). Need the SHORTEST sequence of transformations in an unweighted state graph -> `bfs` (graphs track; referenced by id only) explored level by level from the start state. The state naturally compresses into a small set of discrete flags (n <= ~20, e.g. 'which keys collected') and an optimal count/cost over that state space is needed -> `bitmask-dp`.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "constraint-satisfaction",
    type: "problem-shape",
    name: "Constraint Satisfaction",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    recognitionClues: [
      "assign values to variables (cells, positions) so that every constraint holds simultaneously",
      "n-queens/sudoku-style placement puzzles with row/column/region rules",
      "each partial assignment must stay valid at every step, not just be checked at the end",
      "board/grid placement where a single bad placement invalidates the whole branch",
      "formal name: Constraint Satisfaction Problem (CSP)",
    ],
    recognitionWords: [
      "constraint satisfaction",
      "CSP",
      "valid assignment",
      "placement puzzle",
      "satisfies all constraints",
    ],
    candidatePatternIds: [
      "backtracking",
      "constraint-search",
      "n-queens",
      "sudoku-solver",
      "pruning",
    ],
    disambiguation:
      "Default approach is `backtracking` with `constraint-search` (checking validity incrementally at each partial assignment rather than generating everything then filtering). When conflicts can be tracked with O(1)-lookup sets over a small number of constraint dimensions (rows/columns/diagonals) -> `n-queens`-style. When constraints span multiple overlapping groups simultaneously (rows AND columns AND boxes) -> `sudoku-solver`-style, often paired with candidate elimination. Once basic backtracking is too slow for the given constraints, layer `pruning`/branch-and-bound on top rather than switching strategies.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
]
