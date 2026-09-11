/**
 * Cross-cutting Relationship edges over the knowledge graph — the "Pattern
 * Relationship Engine" data. Owned by Agent 0 (integration), built once all
 * taxonomy tracks landed and their canonical ids were known. Two kinds of edge
 * live here: (1) worked example chains showing how patterns compose to solve a
 * problem shape, and (2) `commonly-confused-with` edges for pattern pairs that
 * are easy to mix up — these back the Recognition Trainer's confusion-pair
 * lessons (Phase 2 / Agent 2 authors the lesson prose; the edge itself lives here).
 */
import type { Relationship } from "../../types/domain"

export const relationships: Relationship[] = [
  // --- Anagram -> Hash Map -> Frequency Counting -> Sorting ---
  { from: "anagram", to: "frequency-counting", relation: "commonly-solved-by" },
  { from: "anagram", to: "hash-map", relation: "uses" },
  { from: "frequency-counting", to: "hash-map", relation: "uses" },
  { from: "anagram", to: "sorting", relation: "commonly-solved-by" },

  // --- 3Sum -> Sorting -> Two Pointers -> K-Sum ---
  { from: "triplet-sum", to: "sorting", relation: "uses" },
  { from: "triplet-sum", to: "two-pointers", relation: "uses" },
  { from: "triplet-sum", to: "k-sum", relation: "variant-of" },
  { from: "pair-sum", to: "triplet-sum", relation: "prerequisite-of" },

  // --- Sliding Window -> Two Pointers -> Frequency Map ---
  { from: "sliding-window", to: "two-pointers", relation: "variant-of" },
  { from: "sliding-window", to: "frequency-counting", relation: "combines-with" },

  // --- Dijkstra -> Graph -> Greedy -> Priority Queue ---
  { from: "dijkstra", to: "greedy", relation: "uses" },
  { from: "dijkstra", to: "heap", relation: "uses" },
  { from: "dijkstra", to: "bfs", relation: "alternative-to" },

  // --- Kruskal -> Greedy -> Sorting -> Union Find ---
  { from: "kruskal", to: "greedy", relation: "uses" },
  { from: "kruskal", to: "sorting", relation: "uses" },
  { from: "kruskal", to: "union-find", relation: "uses" },
  { from: "prim", to: "greedy", relation: "uses" },
  { from: "prim", to: "heap", relation: "uses" },

  // --- Tree DP -> DFS -> Dynamic Programming ---
  { from: "tree-dp", to: "dfs", relation: "uses" },
  { from: "tree-dp", to: "dynamic-programming", relation: "variant-of" },
  { from: "dag-dynamic-programming", to: "topological-sort", relation: "uses" },
  { from: "dag-dynamic-programming", to: "dynamic-programming", relation: "variant-of" },

  // --- Word Search -> Trie -> DFS -> Backtracking ---
  { from: "word-search", to: "trie", relation: "combines-with" },
  { from: "word-search", to: "dfs", relation: "uses" },
  { from: "word-search", to: "backtracking", relation: "uses" },

  // --- Range Sum -> Prefix Sum -> Fenwick Tree -> Segment Tree ---
  { from: "range-sum", to: "prefix-sum", relation: "commonly-solved-by" },
  { from: "range-sum", to: "fenwick-tree", relation: "commonly-solved-by" },
  { from: "range-sum", to: "segment-tree", relation: "commonly-solved-by" },
  { from: "fenwick-tree", to: "prefix-sum", relation: "alternative-to" },
  { from: "segment-tree", to: "fenwick-tree", relation: "alternative-to" },

  // --- Other useful composition chains ---
  { from: "top-k", to: "heap", relation: "commonly-solved-by" },
  { from: "top-k", to: "quickselect", relation: "commonly-solved-by" },
  { from: "top-k", to: "bucket-sort", relation: "commonly-solved-by" },
  { from: "subsets-shape", to: "backtracking", relation: "commonly-solved-by" },
  { from: "subsets-shape", to: "bitmask-dp", relation: "commonly-solved-by" },
  { from: "island-problems", to: "dfs", relation: "commonly-solved-by" },
  { from: "island-problems", to: "bfs", relation: "commonly-solved-by" },
  { from: "island-problems", to: "union-find", relation: "commonly-solved-by" },
  { from: "dependency-problems", to: "topological-sort", relation: "commonly-solved-by" },
  { from: "weighted-shortest-path", to: "dijkstra", relation: "commonly-solved-by" },
  { from: "weighted-shortest-path", to: "bellman-ford", relation: "commonly-solved-by" },
  { from: "lca-binary-lifting", to: "binary-lifting", relation: "uses" },
  { from: "lca-binary-lifting", to: "lowest-common-ancestor", relation: "optimization-of" },

  // --- Confusion pairs (feed the Recognition Trainer's confusion-pair lessons) ---
  { from: "hash-map", to: "sorting", relation: "commonly-confused-with" },
  { from: "two-pointers", to: "sliding-window", relation: "commonly-confused-with" },
  { from: "prefix-sum", to: "sliding-window", relation: "commonly-confused-with" },
  { from: "bfs", to: "dfs", relation: "commonly-confused-with" },
  { from: "bfs", to: "dijkstra", relation: "commonly-confused-with" },
  { from: "dijkstra", to: "bellman-ford", relation: "commonly-confused-with" },
  { from: "heap", to: "quickselect", relation: "commonly-confused-with" },
  { from: "greedy", to: "dynamic-programming", relation: "commonly-confused-with" },
  { from: "backtracking", to: "dynamic-programming", relation: "commonly-confused-with" },
  { from: "dfs", to: "union-find", relation: "commonly-confused-with" },
  { from: "segment-tree", to: "fenwick-tree", relation: "commonly-confused-with" },
  { from: "trie", to: "hash-map", relation: "commonly-confused-with" },
  { from: "topological-sort", to: "dfs", relation: "commonly-confused-with" },
  { from: "subarray", to: "subsequence", relation: "commonly-confused-with" },
  { from: "subsequence", to: "subsets-shape", relation: "commonly-confused-with" },
]
