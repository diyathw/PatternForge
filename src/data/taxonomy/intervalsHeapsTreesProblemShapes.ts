/**
 * Problem-shape nodes owned by Track 3 (Intervals/Events, Heaps, Trees).
 *
 * Skeleton pass only — every shape is `contentStatus: "skeleton"`.
 *
 * `candidatePatternIds` reference cross-track pattern ids where relevant
 * (e.g. stack/monotonic-stack patterns owned by the stacks/queues track,
 * quickselect/bucket-sort owned by the sorting/selection track,
 * binary-search-on-answer owned by the binary search track). These are
 * expected to be dangling until the integration pass reconciles ids across
 * all seven tracks.
 */
import type { ProblemShape } from "../../types/domain"

export const problemShapes: ProblemShape[] = [
  {
    id: "interval-overlap",
    type: "problem-shape",
    name: "Interval Overlap",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "very-high",
    recognitionClues: [
      "list of [start, end] ranges that may touch or overlap",
      "\"merge\", \"intersection\", \"insert\", or \"remove minimum to eliminate overlap\" phrased over intervals",
    ],
    recognitionWords: [
      "overlapping intervals",
      "merge intervals",
      "insert interval",
      "interval intersection",
      "free time",
      "conflicting ranges",
    ],
    candidatePatternIds: ["merge-intervals", "insert-interval", "interval-intersection", "non-overlapping-intervals", "sweep-line"],
    disambiguation:
      "If the task is to collapse a single list into non-overlapping ranges, sort-and-merge (merge-intervals) is the direct fit, O(n log n). If two independent sorted lists must be intersected, use the two-pointer interval-intersection variant instead of merging, O(m+n). If the question is about a count or peak (e.g. \"max overlapping at once\") rather than the merged ranges themselves, switch to sweep-line with a running counter. If it asks for the fewest removals to eliminate all overlap, treat it as greedy interval scheduling (non-overlapping-intervals) sorted by end time, not by start time.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "meeting-scheduling",
    type: "problem-shape",
    name: "Meeting Scheduling",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    recognitionClues: [
      "given meeting/event time ranges, decide feasibility or resource count",
      "\"can attend all meetings\", \"minimum rooms/servers needed\", \"maximum concurrent bookings\"",
    ],
    recognitionWords: [
      "meeting rooms",
      "conference rooms",
      "schedule conflicts",
      "minimum resources",
      "concurrent meetings",
      "task scheduler",
    ],
    candidatePatternIds: ["meeting-rooms", "min-heap", "sweep-line", "maximum-concurrent-events", "scheduling-with-heap"],
    disambiguation:
      "For a yes/no feasibility check (\"can one person attend all meetings\"), sort by start time and check adjacent overlaps, O(n log n), no heap needed. For \"minimum rooms/resources required\", either sort start and end times separately and two-pointer-sweep them, or push meeting end-times onto a min-heap and reuse a room when the heap's minimum end-time has already passed — both O(n log n). When jobs additionally have priorities or cooldowns (not just start/end times), move to scheduling-with-heap, which pops the highest-priority ready task each tick instead of just tracking room counts.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "parentheses-matching",
    type: "problem-shape",
    name: "Parentheses Matching",
    category: "problem-shapes",
    difficulty: "beginner",
    interviewFrequency: "high",
    recognitionClues: [
      "\"valid parentheses\", balanced brackets of multiple types",
      "nested open/close symbols where the most recently opened must close first",
    ],
    recognitionWords: [
      "valid parentheses",
      "balanced brackets",
      "matching brackets",
      "nested braces",
      "longest valid parentheses",
    ],
    candidatePatternIds: ["stack-based-parentheses-matching", "stack"],
    disambiguation:
      "This is a pure last-in-first-out matching problem: push opening symbols, and on a closing symbol pop and check it matches the most recent opener. A stack is essentially the only viable structure here — the LIFO order is exactly what \"most recently opened closes first\" requires. Variants asking for the *longest* valid substring keep the stack but store indices instead of characters so the gap between mismatches can be measured.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "expression-evaluation",
    type: "problem-shape",
    name: "Expression Evaluation",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    recognitionClues: [
      "\"basic calculator\", evaluate an infix/postfix arithmetic string with operator precedence and parentheses",
      "need to respect +/-/*/÷ precedence and nested parens while scanning left to right",
    ],
    recognitionWords: [
      "basic calculator",
      "evaluate expression",
      "operator precedence",
      "postfix",
      "reverse polish notation",
      "infix to postfix",
    ],
    candidatePatternIds: ["stack", "shunting-yard"],
    disambiguation:
      "Postfix/RPN expressions evaluate directly with a single operand stack, O(n), no precedence logic needed since the notation already encodes order. Infix expressions with precedence and parentheses need either two stacks (operands + operators, applying operators when precedence drops) or a shunting-yard-style conversion to postfix first, then evaluation. Choose the two-stack direct approach for a one-off calculator; choose shunting-yard when the expression must be converted/reused multiple times (e.g. compiled once, evaluated many times).",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "next-greater-element",
    type: "problem-shape",
    name: "Next Greater Element",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "high",
    recognitionClues: [
      "\"for each element, find the next element to the right that is greater\"",
      "circular array variants (\"next greater element II\") wrap around once",
    ],
    recognitionWords: [
      "next greater element",
      "next warmer temperature",
      "daily temperatures",
      "next larger value",
    ],
    candidatePatternIds: ["monotonic-decreasing-stack"],
    disambiguation:
      "A monotonic decreasing stack of indices is the direct O(n) fit: scan left to right, and whenever the current value exceeds the stack's top, pop and resolve that index's answer, since indices only ever get popped once. Brute-force nested loops are O(n^2) and should be flagged as suboptimal for any n beyond a few hundred. Circular-array variants iterate the array twice (or index modulo n) over the same monotonic stack.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "next-smaller-element",
    type: "problem-shape",
    name: "Next Smaller Element",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    recognitionClues: [
      "\"for each element, find the next element to the right that is smaller\"",
      "mirror image of next-greater-element with the comparison flipped",
    ],
    recognitionWords: [
      "next smaller element",
      "previous smaller element",
      "next smaller to the right",
    ],
    candidatePatternIds: ["monotonic-increasing-stack"],
    disambiguation:
      "Same mechanics as next-greater-element but with a monotonic increasing stack instead of decreasing: pop while the stack's top is greater than or equal to the current value, resolving each popped index's answer as it leaves. O(n) single pass, since each index is pushed and popped at most once.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "histogram-problems",
    type: "problem-shape",
    name: "Histogram Problems",
    category: "problem-shapes",
    difficulty: "advanced",
    interviewFrequency: "medium",
    recognitionClues: [
      "\"largest rectangle in histogram\", \"maximal rectangle in a binary matrix\"",
      "for each bar, need the nearest shorter bar to its left and right to know how far the bar's height can extend",
    ],
    recognitionWords: [
      "largest rectangle in histogram",
      "maximal rectangle",
      "bar heights",
      "trapping rain water",
    ],
    candidatePatternIds: ["monotonic-increasing-stack", "monotonic-decreasing-stack"],
    disambiguation:
      "Largest-rectangle-in-histogram uses a monotonic increasing stack of bar indices: when a shorter bar is encountered, pop taller bars and compute the rectangle each one could have spanned (width = current index - new stack top - 1). This resolves the naive O(n^2) \"expand left/right per bar\" approach down to O(n). The 2D \"maximal rectangle in a binary matrix\" variant reduces to this exact histogram problem run once per matrix row, treating each row as histogram heights accumulated from consecutive 1s above it.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "stock-span",
    type: "problem-shape",
    name: "Stock Span",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    recognitionClues: [
      "\"online stock span\" — for each new price, count consecutive prior days with price <= today's",
      "streaming/online variant where each answer must use only prices seen so far",
    ],
    recognitionWords: [
      "stock span problem",
      "online stock span",
      "consecutive days price",
    ],
    candidatePatternIds: ["monotonic-decreasing-stack"],
    disambiguation:
      "Maintain a monotonic decreasing stack of (price, span) pairs; on each new price, pop and accumulate the span of every stack entry with price <= today's, then push (today's price, accumulated span + 1). This gives amortized O(1) per call and O(n) total, versus O(n) per call / O(n^2) total for a naive backward scan. Because prices stream in one at a time, this is one of the few next-greater-style problems solved online rather than with a single upfront left-to-right pass.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "top-k",
    type: "problem-shape",
    name: "Top K",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "very-high",
    recognitionClues: [
      "\"top k frequent elements\", \"k closest points\", \"k largest numbers\"",
      "need the k best items out of n, not necessarily in sorted order",
    ],
    recognitionWords: [
      "top k",
      "k most frequent",
      "k closest",
      "k largest",
      "k smallest",
    ],
    candidatePatternIds: ["min-heap", "max-heap", "bucket-sort", "quickselect"],
    disambiguation:
      "A size-k heap (min-heap for top-k-largest, max-heap for top-k-smallest) runs in O(n log k), stays simple to reason about, and naturally supports streaming input where n isn't known upfront. Quickselect (partition-based) achieves O(n) average time but requires the full dataset in memory upfront (no streaming), mutates the input array, and has O(n^2) worst case without randomized pivoting. Bucket sort by frequency/value is O(n) and simplest of all when the value range (e.g. frequency counts bounded by n) is known and bounded — but it doesn't generalize to arbitrary/unbounded value ranges the way heap or quickselect do.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "kth-largest-kth-smallest",
    type: "problem-shape",
    name: "Kth Largest / Kth Smallest",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    recognitionClues: [
      "\"find the kth largest element in an array\" — a single scalar answer, not the whole top-k set",
      "may be a one-off query on a static array, or a repeated query as a stream grows (\"kth largest element in a stream\")",
    ],
    recognitionWords: [
      "kth largest element",
      "kth smallest element",
      "kth largest in a stream",
      "median of two sorted arrays",
    ],
    candidatePatternIds: ["heap-based-kth-element", "quickselect", "binary-search-on-answer"],
    disambiguation:
      "For a single one-off query on a static array, quickselect is the fastest average case at O(n), though it mutates the array and degrades to O(n^2) worst case without randomization/median-of-medians. For a stream that keeps growing with repeated kth-largest queries, maintain a size-k min-heap instead — O(log k) per insertion, since quickselect would have to rerun from scratch each time. When the array holds a bounded/discrete value range instead of arbitrary numbers (or the question is phrased as \"find the value V such that exactly k elements are <= V\" over a monotonic search space, e.g. two sorted arrays), binary-search-on-answer over the value range can beat both, often reaching O(log(range)) or O(log(m+n)).",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
  {
    id: "tree-ancestor-queries",
    type: "problem-shape",
    name: "Tree Ancestor Queries",
    category: "problem-shapes",
    difficulty: "advanced",
    interviewFrequency: "medium",
    recognitionClues: [
      "\"kth ancestor of a node\", \"lowest common ancestor\", \"distance between two nodes in a tree\" with many repeated queries",
      "static or append-only tree where per-query O(depth) DFS walks would be too slow across all queries",
    ],
    recognitionWords: [
      "kth ancestor",
      "lowest common ancestor",
      "LCA",
      "path query tree",
      "tree ancestor",
    ],
    candidatePatternIds: ["binary-lifting", "lowest-common-ancestor", "heavy-light-decomposition"],
    disambiguation:
      "For a single LCA query (or O(1) of them), a plain recursive DFS is simplest at O(n) per query — no preprocessing needed. For many repeated ancestor/LCA queries on a tree that doesn't change, precompute a binary-lifting table once in O(n log n), then answer each query in O(log n) — this is the standard fit for \"kth ancestor\" and \"LCA\" at scale. When queries additionally need aggregates ALONG the path between two nodes (sum/max/min of edge or node weights, not just which node is the LCA), escalate to heavy-light decomposition over a segment tree, O(log^2 n) per path query — binary lifting alone only identifies the LCA, it doesn't aggregate along the path.",
    languageTemplatesAvailable: [],
    contentStatus: "skeleton",
  },
]
