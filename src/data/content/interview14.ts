import { add } from './catalog'

// Closes the gap against the well-known "14 Patterns" interview reference list:
// the other 8 (sliding-window, two-pointers, fast-slow-pointers, merge-intervals,
// reverse-list, tree-bfs, tree-dfs, standard-binary-search) already have deep
// content in arrays.ts/graphs.ts/structures.ts.

add('cyclic-sort', 'Find the missing number',
  'Given an array of n distinct integers drawn from the range [0, n], return the one value in that range missing from the array.',
  'When values are guaranteed to lie in a small range tied to the array\u2019s own length, each value has a "home" index. Repeatedly swap each value to its home index instead of sorting generally \u2014 every swap places at least one value correctly, so the array settles in linear time. A final scan finds the first index whose value disagrees with its position.',
  'O(n) time; each element is swapped to its home at most once. O(1) extra space beyond the copied input.',
  'After processing index i, every value in [0, i] that belongs somewhere in [0, i] already sits at its home index.',
  ['values drawn from a known range like 0..n or 1..n', 'find the missing/duplicate/smallest-missing value', 'the array itself can be rearranged'],
  'When values are not guaranteed to lie in a compact known range, a hash set is the general-purpose fallback.',
  `function solve(nums) {\n  const a = [...nums];\n  let i = 0;\n  while (i < a.length) {\n    const correct = a[i];\n    if (correct < a.length && a[correct] !== a[i]) {\n      [a[i], a[correct]] = [a[correct], a[i]];\n    } else {\n      i++;\n    }\n  }\n  for (let j = 0; j < a.length; j++) if (a[j] !== j) return j;\n  return a.length;\n}`,
  `def solve(nums):\n    a = list(nums)\n    i = 0\n    while i < len(a):\n        correct = a[i]\n        if correct < len(a) and a[correct] != a[i]:\n            a[correct], a[i] = a[i], a[correct]\n        else:\n            i += 1\n    for j, value in enumerate(a):\n        if value != j:\n            return j\n    return len(a)`,
  [[[3, 0, 1], 2], [[0, 1], 2], [[9, 6, 4, 2, 3, 5, 7, 0, 1], 8], [[0], 1], [[], 0]],
  [
    ['Index 0 holds 3, which is out of range for length 3 \u2014 it can never be placed here, so move on without swapping.', { array: [3, 0, 1], i: 0 }],
    ['Placing each in-range value at its own index (swapping 0 and 1 into position) settles the array into [0, 1, 3].', { array: [0, 1, 3], i: 3 }],
    ['Scan for the first mismatch: index 2 holds 3, not 2 \u2014 so 2 is the missing number.', { array: [0, 1, 3], missing: 2 }],
  ],
  ['Off-by-one on the range bounds (0..n vs 1..n) breaks the "correct home index" formula.', 'Skipping the visited check (the else branch) can loop forever once a value is already home.'],
  ['duplicate-detection', 'missing-number'], 'medium', ['missing-number'])

add('two-heaps', 'Track a running median',
  'Given a stream of numbers (as an array, processed one at a time in order), return the median after each insertion.',
  'Split the seen values into two halves: a max-heap holding the smaller half, a min-heap holding the larger half, kept within one element of each other in size. The median is then always at one or both roots \u2014 no re-sorting of everything already seen is ever needed. Rebalance after every insertion by moving a root across when one heap grows too large.',
  'O(log n) time per insertion (heap push/pop), O(n) total space for the stream.',
  'low\u2019s root is always \u2264 high\u2019s root, and their sizes differ by at most one \u2014 together they represent a valid split of everything inserted so far around the median.',
  ['running median of a stream', 'need the middle value(s) after every insertion, not just once', 'values arrive one at a time'],
  'For a single one-shot median of a static array, sorting once (or quickselect for the middle index) is simpler and needs no ongoing heap maintenance.',
  `function solve(stream) {\n  const low = [], high = [];\n  const cmp = (heap, a, b) => heap === low ? b - a : a - b;\n  const push = (heap, v) => {\n    heap.push(v);\n    let i = heap.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (cmp(heap, heap[i], heap[p]) < 0) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; } else break;\n    }\n  };\n  const pop = (heap) => {\n    const top = heap[0], last = heap.pop();\n    if (heap.length) {\n      heap[0] = last;\n      let i = 0;\n      while (true) {\n        let l = 2 * i + 1, r = 2 * i + 2, best = i;\n        if (l < heap.length && cmp(heap, heap[l], heap[best]) < 0) best = l;\n        if (r < heap.length && cmp(heap, heap[r], heap[best]) < 0) best = r;\n        if (best === i) break;\n        [heap[i], heap[best]] = [heap[best], heap[i]];\n        i = best;\n      }\n    }\n    return top;\n  };\n  const medians = [];\n  for (const x of stream) {\n    if (low.length === 0 || x <= low[0]) push(low, x); else push(high, x);\n    if (low.length > high.length + 1) push(high, pop(low));\n    else if (high.length > low.length) push(low, pop(high));\n    medians.push(low.length > high.length ? low[0] : (low[0] + high[0]) / 2);\n  }\n  return medians;\n}`,
  `import heapq\n\ndef solve(stream):\n    low, high = [], []  # low: max-heap via negation; high: min-heap\n    medians = []\n    for x in stream:\n        if not low or x <= -low[0]:\n            heapq.heappush(low, -x)\n        else:\n            heapq.heappush(high, x)\n        if len(low) > len(high) + 1:\n            heapq.heappush(high, -heapq.heappop(low))\n        elif len(high) > len(low):\n            heapq.heappush(low, -heapq.heappop(high))\n        medians.append(-low[0] if len(low) > len(high) else (-low[0] + high[0]) / 2)\n    return medians`,
  [[[5, 15, 1, 3], [5, 10, 5, 4]], [[1], [1]], [[], []], [[2, 2, 2], [2, 2, 2]]],
  [
    ['Insert 5, then 15: low holds {5}, high holds {15}. Sizes are equal, so the median averages both roots: 10.', { low: [5], high: [15], median: 10 }],
    ['Insert 1: it belongs in the smaller half, so low grows to {5, 1}. Now low outnumbers high, so low\u2019s root alone is the median: 5.', { low: [5, 1], high: [15], median: 5 }],
    ['Insert 3: after rebalancing, low={3,1} and high={5,15}, equal in size again. Median averages both roots: (3+5)/2 = 4.', { low: [3, 1], high: [5, 15], median: 4 }],
  ],
  ['Comparing sizes with plain length checks instead of maintaining the \u2264-one-apart invariant lets the heaps drift out of balance.', 'Forgetting to route the very first value through the size-0 check crashes on an empty low[0] lookup.'],
  ['streaming-median', 'min-heap', 'max-heap'], 'hard', [])

add('subsets-shape', 'Generate every subset',
  'Given a list of distinct integers, return every subset (the power set), including the empty subset and the full list itself.',
  'Start with just the empty subset. For each new number, take every subset built so far and create a new copy of each with that number appended \u2014 this doubles the collection once per number. After n numbers the collection holds exactly 2^n subsets, because each number independently ended up in or out of each one.',
  'O(n \u00b7 2^n) time and space to materialize every subset \u2014 there are 2^n subsets, each up to length n.',
  'After processing the first k numbers, the collection holds exactly every subset of those k numbers, each exactly once.',
  ['generate every possible subset', 'the power set', 'each element independently in or out'],
  'For subsets under an extra constraint (fixed size k, a sum bound), backtracking with pruning avoids ever building subsets that could never satisfy it.',
  `function solve(nums) {\n  let subsets = [[]];\n  for (const n of nums) {\n    const withN = subsets.map(s => [...s, n]);\n    subsets = subsets.concat(withN);\n  }\n  return subsets;\n}`,
  `def solve(nums):\n    subsets = [[]]\n    for n in nums:\n        subsets += [s + [n] for s in subsets]\n    return subsets`,
  [[[1, 2, 3], [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]], [[], [[]]], [[5], [[], [5]]], [[1, 2], [[], [1], [2], [1, 2]]]],
  [
    ['Start with just the empty subset: [[]].', { subsets: [[]] }],
    ['For 1, copy every existing subset and append 1, doubling the collection to [[], [1]].', { subsets: [[], [1]], added: 1 }],
    ['Repeating for 2 and 3 doubles the collection twice more, from 2 to 4 to 8 subsets \u2014 every combination of in/out per element appears exactly once.', { subsets: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] }],
  ],
  ['Rebuilding from an empty array each iteration discards prior progress \u2014 extend the running collection instead.', 'Confusing subsets (any elements, any positions) with subsequences (must preserve relative order) produces a different-sized answer.'],
  ['backtracking', 'bitmask-dp'], 'medium', ['subsets-shape'])

add('top-k', 'Find the k largest values',
  'Given {nums, k}, return the k largest values from nums, in ascending order.',
  'Maintain a min-heap bounded to size k. Push every value; whenever the heap exceeds k, evict its current minimum \u2014 that value can never end up among the k largest once k bigger candidates already exist. What remains after the full scan is exactly the k largest, and popping them off one at a time yields ascending order for free.',
  'O(n log k) time to process the stream, O(k) space for the heap \u2014 notably not O(n log n), since the heap never grows past k.',
  'The heap always holds at most the k largest values seen so far; its root is the smallest of those k.',
  ['k largest or smallest values', 'a stream too large to sort in full', 'only need k results, not every value sorted'],
  'For a single one-shot rank in a fully in-memory, mutable array, quickselect finds it in expected O(n) without maintaining a heap at all.',
  `function solve({ nums, k }) {\n  const heap = [];\n  const push = (v) => {\n    heap.push(v);\n    let i = heap.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (heap[i] < heap[p]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; } else break;\n    }\n  };\n  const popMin = () => {\n    const top = heap[0], last = heap.pop();\n    if (heap.length) {\n      heap[0] = last;\n      let i = 0;\n      while (true) {\n        let l = 2 * i + 1, r = 2 * i + 2, best = i;\n        if (l < heap.length && heap[l] < heap[best]) best = l;\n        if (r < heap.length && heap[r] < heap[best]) best = r;\n        if (best === i) break;\n        [heap[i], heap[best]] = [heap[best], heap[i]];\n        i = best;\n      }\n    }\n    return top;\n  };\n  for (const x of nums) {\n    push(x);\n    if (heap.length > k) popMin();\n  }\n  const result = [];\n  while (heap.length) result.push(popMin());\n  return result;\n}`,
  `import heapq\n\ndef solve(data):\n    nums, k = data['nums'], data['k']\n    heap = []\n    for x in nums:\n        heapq.heappush(heap, x)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return sorted(heap)`,
  [[{ nums: [3, 1, 5, 12, 2, 11], k: 3 }, [5, 11, 12]], [{ nums: [1], k: 1 }, [1]], [{ nums: [5, 5, 5], k: 2 }, [5, 5]], [{ nums: [9, 4, 7, 1, 3], k: 2 }, [7, 9]]],
  [
    ['Push 3, 1, 5 \u2014 the heap has room for all three (k=3), so nothing is evicted yet.', { heap: [1, 3, 5] }],
    ['Push 12: the heap now holds four values, so evict its current minimum, 1 \u2014 it can\u2019t be among the 3 largest once a bigger candidate exists.', { heap: [3, 5, 12], evicted: 1 }],
    ['After processing every value, two more minimums (2, then 3) get evicted along the way; only the true largest 3 survive. Popped off in order: [5, 11, 12].', { answer: [5, 11, 12] }],
  ],
  ['Using an unbounded max-heap of everything defeats the purpose \u2014 a min-heap capped at size k is what keeps this sub-linear in space.', 'Popping the max instead of the min evicts the wrong end and silently returns the k smallest values instead.'],
  ['heap', 'quickselect'], 'medium', ['top-k'])

add('merge-k-sorted-lists', 'Merge k sorted lists',
  'Given a list of k already-sorted integer arrays, merge them into one fully sorted array. (The same algorithm applies unchanged whether the k inputs are arrays or linked lists \u2014 only how you read "the next element" differs.)',
  'Seed a min-heap with just the first element of each of the k lists, tagged with which list and position it came from. Repeatedly pop the smallest, append it to the output, then push that same list\u2019s next element to replace it. The heap never holds more than k candidates at once, so every comparison is among at most k values instead of comparing all k list-heads by a linear scan each step.',
  'O(n log k) time for n total elements across k lists, O(k) heap space plus O(n) output.',
  'The heap always holds exactly one still-unconsumed "frontier" element per non-exhausted list \u2014 its minimum is therefore the true global minimum of everything not yet output.',
  ['merge k already-sorted lists or arrays into one', 'combine many sorted streams', 'k-way merge'],
  'For just two lists, a plain two-pointer merge is simpler and avoids heap overhead entirely.',
  `function solve(lists) {\n  const heap = [];\n  const less = (a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];\n  const push = (e) => {\n    heap.push(e);\n    let i = heap.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (less(heap[i], heap[p]) < 0) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; } else break;\n    }\n  };\n  const pop = () => {\n    const top = heap[0], last = heap.pop();\n    if (heap.length) {\n      heap[0] = last;\n      let i = 0;\n      while (true) {\n        let l = 2 * i + 1, r = 2 * i + 2, best = i;\n        if (l < heap.length && less(heap[l], heap[best]) < 0) best = l;\n        if (r < heap.length && less(heap[r], heap[best]) < 0) best = r;\n        if (best === i) break;\n        [heap[i], heap[best]] = [heap[best], heap[i]];\n        i = best;\n      }\n    }\n    return top;\n  };\n  lists.forEach((list, li) => { if (list.length) push([list[0], li, 0]); });\n  const merged = [];\n  while (heap.length) {\n    const [value, li, ei] = pop();\n    merged.push(value);\n    if (ei + 1 < lists[li].length) push([lists[li][ei + 1], li, ei + 1]);\n  }\n  return merged;\n}`,
  `import heapq\n\ndef solve(lists):\n    heap = [(lst[0], li, 0) for li, lst in enumerate(lists) if lst]\n    heapq.heapify(heap)\n    merged = []\n    while heap:\n        value, li, ei = heapq.heappop(heap)\n        merged.append(value)\n        if ei + 1 < len(lists[li]):\n            heapq.heappush(heap, (lists[li][ei + 1], li, ei + 1))\n    return merged`,
  [[[[1, 4, 5], [1, 3, 4], [2, 6]], [1, 1, 2, 3, 4, 4, 5, 6]], [[[], []], []], [[[1]], [1]], [[[], [1, 2, 3]], [1, 2, 3]]],
  [
    ['Seed the heap with just the first element of every list: 1 from list 0, 1 from list 1, and 2 from list 2.', { heap: [[1, 0, 0], [1, 1, 0], [2, 2, 0]] }],
    ['Pop the smallest (1 from list 0, chosen first on the tie), append it, then push list 0\u2019s next element, 4, to replace it.', { merged: [1], pushed: [4, 0, 1] }],
    ['Repeating pop-then-replace drains every list in sorted order, comparing only k candidates at a time: [1, 1, 2, 3, 4, 4, 5, 6].', { answer: [1, 1, 2, 3, 4, 4, 5, 6] }],
  ],
  ['Comparing all k list-heads with a fresh linear scan every step costs O(nk) instead of O(n log k) \u2014 that\u2019s the exact overhead the heap exists to avoid.', 'Forgetting to push the next element from the same list after popping stalls that list forever.'],
  ['min-heap', 'merge-intervals'], 'hard', [])

add('01-knapsack', 'Maximum value under a weight limit',
  'Given {weights, values, capacity} \u2014 parallel arrays of item weights and values, plus a total weight capacity \u2014 return the maximum total value achievable by choosing a subset of items (each usable at most once) without exceeding capacity.',
  'Track dp[c] = the best value achievable with total weight at most c, using items considered so far. For each new item, scan capacity downward from the max: dp[c] can either skip the item (keep its current value) or take it (dp[c - weight] + value, using a value computed before this item was considered). Scanning downward \u2014 not upward \u2014 is exactly what guarantees each item is used at most once.',
  'O(n \u00b7 capacity) time and O(capacity) space with the rolling 1D array (a full 2D table would cost O(n \u00b7 capacity) space instead).',
  'After considering the first i items, dp[c] holds the best value achievable using any subset of those i items with total weight at most c.',
  ['maximize value under a weight or capacity limit', 'each item usable at most once', 'choose-or-skip per item'],
  'When items can be reused an unlimited number of times, scan capacity upward instead (unbounded knapsack) \u2014 scanning downward here is specifically what enforces the 0/1, use-once constraint.',
  `function solve({ weights, values, capacity }) {\n  const dp = new Array(capacity + 1).fill(0);\n  for (let i = 0; i < weights.length; i++) {\n    for (let c = capacity; c >= weights[i]; c--) {\n      dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i]);\n    }\n  }\n  return dp[capacity];\n}`,
  `def solve(data):\n    weights, values, capacity = data['weights'], data['values'], data['capacity']\n    dp = [0] * (capacity + 1)\n    for weight, value in zip(weights, values):\n        for c in range(capacity, weight - 1, -1):\n            dp[c] = max(dp[c], dp[c - weight] + value)\n    return dp[capacity]`,
  [[{ weights: [1, 3, 4, 5], values: [1, 4, 5, 7], capacity: 7 }, 9], [{ weights: [], values: [], capacity: 5 }, 0], [{ weights: [2], values: [3], capacity: 1 }, 0], [{ weights: [2], values: [3], capacity: 2 }, 3]],
  [
    ['Seed dp[0..7] = 0 \u2014 with zero items considered, no capacity yields any value yet.', { dp: [0, 0, 0, 0, 0, 0, 0, 0] }],
    ['After considering the weight-1/value-1 and weight-3/value-4 items (scanning capacity downward so each is used at most once), dp[7] has climbed to 5.', { dp: [0, 1, 1, 4, 5, 5, 5, 5] }],
    ['The weight-4/value-5 item pushes dp[7] to 9 \u2014 pairing it with the earlier weight-3/value-4 item exactly fills capacity 7. The final weight-5/value-7 item can\u2019t beat that. Return dp[7] = 9.', { dp: [0, 1, 1, 4, 5, 6, 6, 9], answer: 9 }],
  ],
  ['Scanning capacity upward for 0/1 knapsack lets an item be counted more than once, silently turning it into unbounded knapsack.', 'Indexing dp by item count instead of by weight loses track of the actual constraint being modeled.'],
  ['dynamic-programming', 'unbounded-knapsack'], 'medium', [])
