/**
 * Umbrella/foundational nodes referenced (by expected canonical id) from multiple
 * parallel-authored track files but not owned by any single track — added during
 * integration (Agent 0) once the dangling-reference check surfaced them. Each of
 * these is a genuine concept in its own right (not a naming duplicate), acting as
 * the parent of a family of more specific nodes defined elsewhere.
 */
import type { KnowledgeNode } from "../../types/domain"

export const nodes: KnowledgeNode[] = [
  {
    id: "linked-list", type: "data-structure", name: "Linked List",
    aliases: ["Singly Linked List", "Doubly Linked List"], category: "data-structures",
    difficulty: "beginner", interviewFrequency: "high",
    recognitionClues: ["nodes connected by next or previous references", "insert or delete beside a known node"],
    complexityNotes: "O(n) indexed access or search. O(1) insertion after a known node; deletion needs its predecessor in a singly linked list. O(n) storage.",
    languageTemplatesAvailable: [], contentStatus: "skeleton",
  },
  {
    id: "graph", type: "data-structure", name: "Graph",
    aliases: ["Adjacency List", "Adjacency Matrix"], category: "data-structures",
    difficulty: "core", interviewFrequency: "very-high",
    recognitionClues: ["entities connected by directed or undirected edges", "weighted relationships or reachable states"],
    complexityNotes: "Adjacency lists use O(V+E) space and enumerate neighbors in O(degree). Matrices use O(V²) space and test an edge in O(1). Representation affects traversal costs.",
    languageTemplatesAvailable: [], contentStatus: "skeleton",
  },
  {
    id: "array",
    type: "data-structure",
    name: "Array",
    category: "data-structures",
    difficulty: "beginner",
    interviewFrequency: "very-high",
    recognitionClues: [
      "contiguous, index-addressable collection",
      "O(1) random access by index",
      "fixed or dynamically-resized contiguous storage",
    ],
    complexityNotes:
      "O(1) index access, O(n) insert/delete at an arbitrary position (O(1) amortized at the end for dynamic arrays), O(n) search unless sorted.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "sorting",
    type: "concept",
    name: "Sorting",
    category: "sorting-searching",
    difficulty: "beginner",
    interviewFrequency: "very-high",
    recognitionClues: [
      "need elements in a defined order before another technique can apply",
      "'sort the array first' as a setup step for two pointers, greedy, or binary search",
    ],
    commonProblemShapes: ["pair-sum", "triplet-sum", "k-sum"],
    complexityNotes:
      "The umbrella concept over concrete algorithms (merge-sort, quick-sort, heap-sort, counting-sort, etc.) — comparison-based sorts are Ω(n log n) worst case; non-comparison sorts (counting/radix/bucket) can reach O(n) under bounded-range assumptions.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "binary-search",
    type: "pattern",
    name: "Binary Search",
    category: "sorting-searching",
    difficulty: "core",
    interviewFrequency: "very-high",
    recognitionClues: [
      "sorted array or a monotonic (feasibility) predicate over a range",
      "need better than O(n) search",
      "'find the smallest/largest value such that...'",
    ],
    complexityNotes:
      "The umbrella pattern over concrete variants (lower/upper bound, rotated-array search, binary-search-on-answer, etc.) — O(log n) iterations with an O(1) comparison per iteration; multiply by the predicate cost for answer search, halving the search space each iteration.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "heap",
    type: "data-structure",
    name: "Heap",
    category: "heaps",
    difficulty: "core",
    interviewFrequency: "very-high",
    recognitionClues: [
      "repeatedly need the current min or max as elements are added/removed",
      "priority queue behavior",
    ],
    commonProblemShapes: ["top-k", "kth-largest-kth-smallest"],
    complexityNotes:
      "The umbrella data structure over min-heap/max-heap. O(log n) insert and extract-min/max, O(1) peek, O(n) build-heap from an unsorted array.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "monotonic-stack",
    type: "pattern",
    name: "Monotonic Stack",
    category: "stacks-queues",
    difficulty: "intermediate",
    interviewFrequency: "very-high",
    prerequisites: ["stack"],
    recognitionClues: [
      "next/previous greater or smaller element",
      "maintain a stack that only ever grows or only ever shrinks in value as elements are pushed",
    ],
    commonProblemShapes: ["next-greater-element", "next-smaller-element", "histogram-problems", "stock-span"],
    complexityNotes:
      "The umbrella pattern over monotonic-increasing-stack and monotonic-decreasing-stack. O(n) total time — each element is pushed and popped at most once.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "recursion",
    type: "concept",
    name: "Recursion",
    category: "recursion-backtracking",
    difficulty: "beginner",
    interviewFrequency: "very-high",
    recognitionClues: [
      "a problem decomposes into smaller instances of itself",
      "a natural base case and recursive case",
      "tree/graph traversal, divide and conquer, or backtracking are being considered",
    ],
    complexityNotes:
      "The foundational technique underlying basic-recursion, divide-and-conquer, backtracking, and recursive tree/graph traversal — analyze via recurrence relations (e.g. the Master Theorem) plus call-stack space.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "dynamic-programming",
    type: "strategy",
    name: "Dynamic Programming",
    category: "dynamic-programming",
    difficulty: "core",
    interviewFrequency: "very-high",
    prerequisites: ["recursion"],
    recognitionClues: [
      "optimal substructure: the optimal solution is built from optimal solutions to subproblems",
      "overlapping subproblems: naive recursion recomputes the same state many times",
      "'count the number of ways', 'find the minimum/maximum', over a state that depends on earlier choices",
    ],
    commonProblemShapes: ["subsets-shape", "partition-problems"],
    complexityNotes:
      "The umbrella strategy over the entire DP family (1D/2D/grid DP, knapsack, sequence DP, interval DP, tree DP, bitmask DP, digit DP, etc.) — see dp-state/dp-transition/memoization/tabulation for the foundational vocabulary.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "expand-around-center",
    type: "pattern",
    name: "Expand Around Center",
    category: "string-algorithms",
    difficulty: "core",
    interviewFrequency: "very-high",
    prerequisites: ["two-pointers"],
    recognitionClues: [
      "find the longest palindromic substring",
      "try every possible center (2n-1 of them, including between-character centers for even-length palindromes) and grow outward while characters match",
    ],
    commonProblemShapes: ["palindrome-substring-queries", "palindrome"],
    complexityNotes:
      "O(n^2) time worst case (n centers, O(n) expansion each), O(1) space — simpler to implement than Manacher's Algorithm, which achieves O(n) for the same problem.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "shunting-yard",
    type: "algorithm",
    name: "Shunting-Yard Algorithm",
    category: "stacks-queues",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    prerequisites: ["stack", "expression-parsing"],
    recognitionClues: [
      "convert an infix expression to postfix (RPN) or prefix notation",
      "operator precedence and associativity must be respected while parsing",
    ],
    commonProblemShapes: ["expression-evaluation"],
    complexityNotes:
      "O(n) time, O(n) space. Uses an operator stack and an output queue, popping higher-precedence operators, and equal-precedence operators only when the incoming operator is left-associative.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
]
