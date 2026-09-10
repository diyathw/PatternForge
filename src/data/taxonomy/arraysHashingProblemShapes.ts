/**
 * Foundational array/hashing problem shapes — the recurring "what is this
 * problem, structurally" categories a learner should recognize before
 * picking a pattern.
 *
 * Owned by Agent 1 (Algorithm Taxonomy & Curriculum Architect), Track 1 of the
 * parallel taxonomy build. Skeleton pass only: `contentStatus: "skeleton"`
 * throughout, no deep content. `candidatePatternIds` reference ids defined in
 * `arraysHashingNodes.ts` (this track) as well as ids expected to be minted by
 * other parallel tracks (e.g. "sorting", "binary-search", "heap",
 * "quickselect", "monotonic-stack", "dynamic-programming") — a later
 * integration pass reconciles any mismatches.
 */
import type { ProblemShape } from "../../types/domain"

export const problemShapes: ProblemShape[] = [
  {
    id: "duplicate-detection",
    type: "problem-shape",
    name: "Duplicate Detection",
    category: "problem-shapes",
    difficulty: "beginner",
    interviewFrequency: "very-high",
    prerequisites: ["hash-set", "array"],
    recognitionClues: [
      "have I seen this value before",
      "contains duplicate",
      "dedupe while scanning",
    ],
    recognitionWords: [
      "contains duplicate",
      "appears twice in the array",
      "find any repeated element",
      "does the array have duplicates",
    ],
    candidatePatternIds: ["hash-set", "sort-and-scan", "cyclic-sort", "fast-slow-pointers"],
    disambiguation:
      "If extra space is unrestricted, a hash set gives O(n) time in one pass. If space must be O(1) and values are guaranteed to lie in [1, n], cyclic sort or index-placement finds the duplicate in place. If values aren't range-bounded but O(1) space is still required, sort first (O(n log n)) and scan for adjacent equals. Fast/slow pointers apply when the array can be treated as an implicit linked list (single duplicate, values in [1, n], array must stay unmodified).",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "missing-number",
    type: "problem-shape",
    name: "Missing Number",
    category: "problem-shapes",
    difficulty: "beginner",
    interviewFrequency: "high",
    parent: "duplicate-detection",
    prerequisites: ["array"],
    recognitionClues: [
      "expected total vs actual total",
      "range 1..n but one value is absent",
      "XOR trick for a single missing value",
    ],
    recognitionWords: [
      "find the missing number",
      "array contains n distinct numbers in the range 0 to n",
      "one number is missing from 1 to n",
    ],
    candidatePatternIds: ["cyclic-sort", "hash-set", "running-sum"],
    disambiguation:
      "When values are guaranteed to be exactly the range [0, n] or [1, n] with one missing, cyclic sort (or the sum/XOR formula — an O(1)-space arithmetic shortcut built on running-sum) solves it in O(n) time, O(1) space. A hash set is the general-purpose O(n)-space fallback when the range guarantee doesn't hold or multiple ranges are being compared.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "repeating-number",
    type: "problem-shape",
    name: "Repeating Number",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    parent: "duplicate-detection",
    prerequisites: ["array"],
    recognitionClues: [
      "single repeated value within a bounded range",
      "find the repeated number and the missing number together",
    ],
    recognitionWords: [
      "find the duplicate number",
      "exactly one number repeats",
      "numbers in the range 1 to n, one of them repeated",
    ],
    candidatePatternIds: ["cyclic-sort", "index-placement", "fast-slow-pointers", "hash-set"],
    disambiguation:
      "If array modification is allowed and values sit in [1, n], cyclic sort or index-placement finds the repeat in O(n) time, O(1) space. If the array must stay read-only, Floyd's fast/slow pointers (treating value-at-index as a 'next' pointer) achieves O(1) space without mutation. A hash set is the simplest fallback when neither constraint holds, at the cost of O(n) space.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "anagram",
    type: "problem-shape",
    name: "Anagram",
    category: "problem-shapes",
    difficulty: "beginner",
    interviewFrequency: "very-high",
    parent: "frequency-counting",
    prerequisites: ["frequency-counting"],
    recognitionClues: [
      "same character counts, different order",
      "one string is a rearrangement of another",
    ],
    recognitionWords: [
      "is t an anagram of s",
      "same letters rearranged",
      "valid anagram",
    ],
    candidatePatternIds: ["sort-and-scan", "frequency-counting", "counting-array"],
    disambiguation:
      "Sorting both strings and comparing is O(n log n) per string and simple to write. A frequency array (when the alphabet is small and fixed, e.g. 26 lowercase letters) or a hash map counts each string in O(n) and is preferred at scale or with a large/unicode alphabet.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "group-anagrams",
    type: "problem-shape",
    name: "Group Anagrams",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    parent: "anagram",
    prerequisites: ["anagram", "hash-map"],
    recognitionClues: [
      "bucket strings by a canonical key",
      "sorted string or count signature used as a hash map key",
    ],
    recognitionWords: [
      "group anagrams together",
      "cluster strings that are anagrams of each other",
    ],
    candidatePatternIds: ["hash-map", "sort-and-scan", "frequency-counting"],
    disambiguation:
      "Use each string's sorted form (O(n log n) per string) or its character-count signature (O(n) per string, better for long strings or large alphabets) as a hash map key, then bucket strings sharing a key. This is the anagram check applied repeatedly and keyed, rather than compared pairwise.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "palindrome",
    type: "problem-shape",
    name: "Palindrome",
    category: "problem-shapes",
    difficulty: "beginner",
    interviewFrequency: "very-high",
    prerequisites: ["opposite-direction-two-pointers"],
    recognitionClues: [
      "mirror symmetry around a center",
      "compare characters from both ends moving inward",
    ],
    recognitionWords: [
      "reads the same forwards and backwards",
      "valid palindrome",
      "longest palindromic substring",
    ],
    candidatePatternIds: ["opposite-direction-two-pointers", "dynamic-programming"],
    disambiguation:
      "Checking whether a given string/array is itself a palindrome is opposite-direction two pointers: O(n) time, O(1) space. Finding the longest palindromic substring or subsequence within a larger string needs expand-around-center (O(n^2)) or dynamic programming (O(n^2) time/space), since the palindrome's boundaries aren't known up front.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "pair-sum",
    type: "problem-shape",
    name: "Pair Sum",
    category: "problem-shapes",
    difficulty: "beginner",
    interviewFrequency: "very-high",
    prerequisites: ["array"],
    recognitionClues: [
      "complement lookup: target minus current value",
      "two indices whose values sum to a target",
    ],
    recognitionWords: [
      "two sum",
      "find a pair that adds up to target",
      "two numbers summing to a target value",
    ],
    candidatePatternIds: ["hash-map", "opposite-direction-two-pointers"],
    disambiguation:
      "Unsorted input where you must return indices: a hash map gives O(n) time, O(n) space via complement lookup. Sorted input (or sorting is free/already done) where only the values matter: opposite-direction two pointers gives O(n) time, O(1) extra space after the sort.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "triplet-sum",
    type: "problem-shape",
    name: "Triplet Sum",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    parent: "pair-sum",
    prerequisites: ["pair-sum", "sort-and-scan"],
    recognitionClues: [
      "fix one element, then two-sum the rest",
      "avoid duplicate triplets in the output",
    ],
    recognitionWords: [
      "3sum",
      "find three numbers that sum to zero or a target",
      "triplet summing to a target",
    ],
    candidatePatternIds: ["sort-and-scan", "opposite-direction-two-pointers", "hash-map"],
    disambiguation:
      "Sort the array, then for each fixed first element run opposite-direction two pointers on the remainder: O(n^2) time, O(1) extra space beyond the sort, and sorting also makes duplicate-triplet skipping straightforward. A hash-map-based approach avoids sorting but complicates duplicate handling and is rarely preferred here.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "k-sum",
    type: "problem-shape",
    name: "K-Sum",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    parent: "triplet-sum",
    prerequisites: ["triplet-sum"],
    recognitionClues: [
      "recursively fix elements down to a 2-sum base case",
      "generalized N numbers summing to a target",
    ],
    recognitionWords: [
      "4sum",
      "k numbers that sum to a target",
      "generalized n-sum",
    ],
    candidatePatternIds: ["sort-and-scan", "opposite-direction-two-pointers", "hash-map"],
    disambiguation:
      "Generalizes triplet-sum by recursively fixing one element at a time (sort once, O(n log n)) until only a pair-sum with two pointers remains as the base case: O(n^(k-1)) time overall. Practical only for small fixed k (3-4); for large or variable k this shape stops being tractable by brute enumeration and signals a different technique (e.g. meet-in-the-middle or subset-sum DP) instead.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  // "top-k" is defined once, canonically, in intervalsHeapsTreesProblemShapes.ts —
  // referenced here via parent/prerequisites rather than redefined.
  {
    id: "kth-largest",
    type: "problem-shape",
    name: "Kth Largest",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    parent: "top-k",
    prerequisites: ["top-k"],
    recognitionClues: [
      "single order statistic, not the whole top-k list",
    ],
    recognitionWords: [
      "kth largest element in the array",
      "find the kth biggest value",
    ],
    candidatePatternIds: ["heap", "quickselect", "sort-and-scan"],
    disambiguation:
      "A min-heap of size k gives O(n log k) and adapts well to a data stream. Quickselect gives expected O(n) (worst case O(n^2)) when the array is fully available in memory and only a one-shot answer is needed. Sorting is the simplest O(n log n) fallback.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "kth-smallest",
    type: "problem-shape",
    name: "Kth Smallest",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    parent: "top-k",
    prerequisites: ["top-k"],
    recognitionClues: [
      "mirror of kth-largest with the comparator flipped",
    ],
    recognitionWords: [
      "kth smallest element",
      "find the kth lowest value",
    ],
    candidatePatternIds: ["heap", "quickselect", "sort-and-scan"],
    disambiguation:
      "Same tradeoffs as kth-largest with the comparator flipped: a max-heap of size k for O(n log k) or streaming input, quickselect for expected O(n) one-shot queries, sorting for the simplest O(n log n) fallback.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "majority-element",
    type: "problem-shape",
    name: "Majority Element",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    prerequisites: ["linear-scan"],
    recognitionClues: [
      "one value is guaranteed to be the strict majority",
      "Boyer-Moore voting",
    ],
    recognitionWords: [
      "element that appears more than n/2 times",
      "majority vote",
      "dominant element",
    ],
    candidatePatternIds: ["linear-scan", "frequency-counting", "sort-and-scan"],
    disambiguation:
      "Boyer-Moore voting (a specialized linear scan carrying a candidate value + counter) solves the guaranteed-majority (>n/2) case in O(n) time, O(1) space. A hash map/frequency count is the general-purpose O(n) time, O(n) space fallback when there's no guaranteed strict majority (e.g. finding all elements appearing more than n/3 times). Sorting and reading the middle element works in O(n log n) when a strict majority is guaranteed.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "frequency-problems",
    type: "problem-shape",
    name: "Frequency Problems",
    category: "problem-shapes",
    difficulty: "beginner",
    interviewFrequency: "high",
    parent: "frequency-counting",
    prerequisites: ["frequency-counting"],
    recognitionClues: [
      "count-then-rank pattern",
      "frequency of frequencies",
    ],
    recognitionWords: [
      "most frequent element",
      "elements appearing exactly k times",
      "sort elements by frequency",
    ],
    candidatePatternIds: ["frequency-counting", "heap", "counting-array"],
    disambiguation:
      "Build counts with a hash map or counting array (bounded domain) in O(n), then rank or filter: a heap for top-k-by-frequency (O(n log k)), or bucket sort by frequency for O(n) when frequencies are themselves bounded by n (bucket index = frequency).",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "subarray",
    type: "problem-shape",
    name: "Subarray",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "very-high",
    prerequisites: ["array"],
    recognitionClues: [
      "must be contiguous, unlike a subsequence",
      "a window of the original array",
    ],
    recognitionWords: [
      "contiguous subarray",
      "maximum sum subarray",
      "subarray that sums to k",
    ],
    candidatePatternIds: ["sliding-window", "prefix-sum", "kadanes-algorithm"],
    disambiguation:
      "Sliding window works when all values are positive, since sums grow monotonically as the window extends. Once negative numbers are allowed, that monotonicity breaks and prefix-sum + hash map is usually necessary for 'sums to k' questions. For the specific ask 'maximum sum contiguous subarray,' Kadane's algorithm is the direct O(n) specialist tool regardless of sign.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "subsequence",
    type: "problem-shape",
    name: "Subsequence",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "high",
    prerequisites: ["array"],
    recognitionClues: [
      "elements keep their relative order but gaps are allowed",
      "delete some elements and keep the rest in order",
    ],
    recognitionWords: [
      "longest increasing subsequence",
      "subsequence that satisfies a condition",
      "not necessarily contiguous",
    ],
    candidatePatternIds: ["dynamic-programming", "binary-search", "same-direction-two-pointers"],
    disambiguation:
      "Because elements may be skipped, a sliding window (which requires contiguity) does not apply. Most subsequence optimization problems (longest/shortest satisfying some property) are dynamic programming, O(n^2); some, like longest increasing subsequence, admit an O(n log n) patience-sorting/binary-search refinement. A simple 'is X a subsequence of Y' check is a same-direction two-pointer scan in O(n).",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "substring",
    type: "problem-shape",
    name: "Substring",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "very-high",
    parent: "subarray",
    prerequisites: ["variable-sliding-window"],
    recognitionClues: [
      "a contiguous run of characters within a string",
      "a window that must satisfy a character-set condition",
    ],
    recognitionWords: [
      "longest substring without repeating characters",
      "minimum window substring",
      "substring containing all characters of another string",
    ],
    candidatePatternIds: ["variable-sliding-window", "hash-map"],
    disambiguation:
      "Substring problems are the string specialization of the subarray shape: contiguity means variable sliding window (grow/shrink two pointers) is almost always the answer, typically paired with a hash map or frequency array tracking the window's character counts to test validity in O(1) per move.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "longest-shortest-segment",
    type: "problem-shape",
    name: "Longest/Shortest Segment",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    parent: "subarray",
    prerequisites: ["subarray"],
    recognitionClues: [
      "optimize the length of a valid contiguous run",
      "grow the window to find the longest, shrink it to find the shortest",
    ],
    recognitionWords: [
      "longest subarray or substring satisfying a condition",
      "smallest window that contains",
      "shortest contiguous segment with a property",
    ],
    candidatePatternIds: ["variable-sliding-window", "prefix-sum", "dynamic-programming"],
    disambiguation:
      "If validity is monotonic as the window grows or shrinks (adding an element can only help or only hurt, never both — e.g. all-positive sums, or a distinct-character-count bound), variable sliding window finds the optimum in O(n). If validity depends on an equality condition over sums that may include negative numbers (e.g. 'longest subarray summing to k'), prefix sum + hash map (tracking the first-seen index per prefix value) is needed instead. Non-monotonic conditions typically fall back to dynamic programming.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "maximum-minimum-segment",
    type: "problem-shape",
    name: "Maximum/Minimum Segment",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    parent: "subarray",
    prerequisites: ["subarray"],
    recognitionClues: [
      "optimize a value (sum, max, or min) over a contiguous window, not the window's length",
    ],
    recognitionWords: [
      "maximum sum subarray of size k",
      "minimum sum contiguous segment",
      "maximum or minimum in every sliding window",
    ],
    candidatePatternIds: ["fixed-sliding-window", "kadanes-algorithm", "monotonic-stack"],
    disambiguation:
      "Fixed window size k with a sum/average target: fixed sliding window, O(n). Window spans the entire array with the target being the maximum-sum contiguous subarray specifically: Kadane's algorithm, O(n). Sliding-window maximum/minimum (the running max/min as a fixed window slides across the array) needs a monotonic deque/stack to stay O(n) rather than O(n*k) from rescanning each window.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "range-sum",
    type: "problem-shape",
    name: "Range Sum",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    parent: "prefix-sum",
    prerequisites: ["prefix-sum"],
    recognitionClues: [
      "many queries over a fixed array",
      "answer a sum for an arbitrary [l, r] range quickly",
    ],
    recognitionWords: [
      "sum of elements between index i and j",
      "multiple range sum queries",
      "query the sum of a subrange repeatedly",
    ],
    candidatePatternIds: ["prefix-sum", "difference-array"],
    disambiguation:
      "Many read-only range-sum queries on a static array: precompute a prefix-sum array once for O(1) per query. Many range-update operations (add a value across [l, r]) followed by a final read: a difference array answers each update in O(1) and reconstructs final values with one prefix-sum pass at the end — the inverse use case of plain prefix sum.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "consecutive-sequence",
    type: "problem-shape",
    name: "Consecutive Sequence",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    prerequisites: ["hash-set"],
    recognitionClues: [
      "values that would be consecutive if sorted, though the array itself is unsorted",
      "no requirement that they appear contiguously in the array",
    ],
    recognitionWords: [
      "longest consecutive sequence",
      "longest run of consecutive integers",
      "longest streak of numbers in a row",
    ],
    candidatePatternIds: ["hash-set", "sort-and-scan"],
    disambiguation:
      "A hash set lets you check, for each number, whether it's the start of a sequence (no predecessor present in the set) and then count forward — amortized O(n) total since each number is visited a bounded number of times. Sorting and scanning for consecutive runs is a simpler O(n log n) alternative when the strict O(n) requirement doesn't matter.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
]
