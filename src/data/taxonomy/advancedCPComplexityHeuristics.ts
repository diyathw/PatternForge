/**
 * Constraint-band complexity heuristics ("n <= X implies these approaches
 * become viable"). These are rules of thumb for narrowing candidate
 * approaches under a time limit, not guarantees — every `caveat` says so
 * explicitly.
 */
import type { ComplexityHeuristic } from "../../types/domain"

export const heuristics: ComplexityHeuristic[] = [
  {
    id: "n-leq-10",
    constraint: "n <= 10",
    viableApproaches: [
      "factorial / permutation brute force (O(n!))",
      "backtracking over all orderings or subsets",
      "exponential exact search (e.g. try every assignment)",
    ],
    caveat:
      "This is a heuristic, not a law: it assumes a roughly 10^8-10^9 operations-per-second budget and a low per-operation constant factor. A specific problem's actual constant factor, time limit, or a required exponent higher than n! (e.g. n^n) can still make even n <= 10 too slow, and a tightly-constant-factor'd O(n!) solution can occasionally pass for slightly larger n too. Always sanity-check against the stated time limit rather than applying this band mechanically.",
  },
  {
    id: "n-leq-20",
    constraint: "n <= 20",
    viableApproaches: [
      "bitmask enumeration of all 2^n subsets",
      "bitmask DP (state = subset of n elements, e.g. Held-Karp TSP)",
      "brute-force subset generation",
    ],
    caveat:
      "This is a heuristic, not a law: 2^20 (~1e6) is comfortable, but if the DP has an extra factor beyond the bitmask (e.g. O(2^n * n) or O(2^n * n^2) for transition cost), the true operation count can be far higher than 2^n alone suggests and this band can still time out. Verify the full complexity expression, not just the exponential term, against the time limit.",
  },
  {
    id: "n-leq-40",
    constraint: "n <= 40",
    viableApproaches: [
      "meet-in-the-middle (split into two halves of size n/2, O(2^(n/2)) each)",
      "subset-sum / partition via meet-in-the-middle",
    ],
    caveat:
      "This is a heuristic, not a law: meet-in-the-middle's benefit assumes the two halves can be combined cheaply (e.g. sort + binary search, or a hash set) — if combining the halves costs more than the enumeration itself, or if per-element state is large enough that 2^(n/2) storage doesn't fit in memory, this band's approach can still fail. n=40 giving 2^20 per half is a rough guideline, not a guarantee tied to any specific time or memory limit.",
  },
  {
    id: "n-leq-1000",
    constraint: "n <= 1000",
    viableApproaches: [
      "O(n^2) algorithms (nested loops, simple DP over pairs)",
      "O(n^2 log n) with a small constant factor",
    ],
    caveat:
      "This is a heuristic, not a law: n^2 = 1e6, comfortably fast under typical limits, but an O(n^2) algorithm with a large hidden constant (heavy per-iteration work, allocations inside the inner loop, recursive overhead) can still be too slow, and conversely some O(n^3) solutions with tiny constants can pass at this n. Treat this as a starting guess to confirm against the actual time limit and constant factor, not a hard cutoff.",
  },
  {
    id: "n-leq-1e5",
    constraint: "n <= 100000 (1e5)",
    viableApproaches: [
      "O(n) linear algorithms",
      "O(n log n) algorithms (sorting, segment tree/Fenwick tree operations, divide and conquer)",
    ],
    caveat:
      "This is a heuristic, not a law: at this size, O(n^2) (1e10 operations) is essentially always too slow under normal time limits, but that's a strong default, not a certainty — some O(n^2) solutions with extremely small constants and generous time limits (or n actually far below the stated upper bound in practice) can still pass. Always confirm against the problem's actual time limit rather than assuming the band is exact.",
  },
  {
    id: "n-leq-1e6",
    constraint: "n <= 1000000 (1e6)",
    viableApproaches: [
      "strictly linear O(n) algorithms",
      "near-linear algorithms with a small constant factor (e.g. O(n log n) with light per-element work, counting sort, bucket-based techniques)",
    ],
    caveat:
      "This is a heuristic, not a law: at this size even O(n log n) needs a genuinely small constant factor to fit typical time limits (n log n is roughly 2*10^7, but algorithms with heavy per-element overhead — object allocation, recursion, cache-unfriendly access patterns — can still be too slow). O(n^2) is essentially never viable here. As always, verify against the stated time limit and language/constant-factor realities rather than treating this band as exact.",
  },
]
