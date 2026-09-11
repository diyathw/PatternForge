/** Topic order and problem counts from the official study plan, checked 2026-09-11.
 * These are topic-to-curriculum mappings, not copies of LeetCode questions.
 */
export const interview150Url = 'https://leetcode.com/studyplan/top-interview-150/'

export const interview150Topics = [
  { title: 'Array / String', count: 24, description: 'Practice scans, in-place updates, prefix information, and greedy choices.', patternIds: ['array', 'read-write-pointer', 'prefix-sum', 'greedy', 'jump-game'] },
  { title: 'Two Pointers', count: 5, description: 'Move two positions with a reason for discarding each candidate.', patternIds: ['two-pointers', 'opposite-direction-two-pointers', 'same-direction-two-pointers'] },
  { title: 'Sliding Window', count: 4, description: 'Maintain a contiguous range as its boundaries move. Check that the validity rule supports shrinking.', patternIds: ['sliding-window', 'fixed-sliding-window', 'variable-sliding-window'] },
  { title: 'Matrix', count: 5, description: 'Track row and column boundaries while traversing or transforming a grid.', patternIds: ['spiral-matrix', 'matrix-rotation', 'matrix-transpose'] },
  { title: 'Hashmap', count: 9, description: 'Remember earlier values, count characters, and compare frequencies.', patternIds: ['hash-map', 'frequency-counting', 'anagram', 'group-anagrams'] },
  { title: 'Intervals', count: 4, description: 'Sort ranges and reason about overlap, insertion, and coverage.', patternIds: ['merge-intervals', 'insert-interval', 'interval-intersection'] },
  { title: 'Stack', count: 5, description: 'Keep unresolved work in last-in, first-out order.', patternIds: ['stack', 'stack-based-parentheses-matching', 'min-stack', 'expression-parsing'] },
  { title: 'Linked List', count: 11, description: 'Draw references before rewiring them; use a dummy node to simplify boundaries.', patternIds: ['linked-list', 'dummy-node', 'reverse-list', 'merge-lists', 'fast-slow-pointers'] },
  { title: 'Binary Tree General', count: 14, description: 'Define what each recursive call returns, then combine the child results.', patternIds: ['tree-dfs', 'tree-height-depth', 'path-sum', 'lowest-common-ancestor', 'tree-reconstruction'] },
  { title: 'Binary Tree BFS', count: 4, description: 'Use a queue to process one depth at a time.', patternIds: ['tree-bfs', 'level-order-traversal', 'zigzag-traversal'] },
  { title: 'Binary Search Tree', count: 3, description: 'Use ordering bounds and inorder traversal to reason about tree values.', patternIds: ['binary-search-tree', 'bst-validation', 'inorder-traversal'] },
  { title: 'Graph General', count: 6, description: 'Model neighbors, visited state, components, and dependencies explicitly.', patternIds: ['graph', 'dfs', 'island-problems', 'topological-sort'] },
  { title: 'Graph BFS', count: 3, description: 'Explore by distance when each edge has equal cost; weighted edges need other reasoning.', patternIds: ['bfs', 'bfs-shortest-path', 'multi-source-bfs'] },
  { title: 'Trie', count: 3, description: 'Share prefixes in a tree and distinguish a word ending from a prefix.', patternIds: ['trie', 'prefix-trie', 'word-search'] },
  { title: 'Backtracking', count: 7, description: 'Choose, explore, and undo while pruning choices that cannot lead to a solution.', patternIds: ['backtracking', 'permutations', 'combinations', 'combination-sum', 'word-search'] },
  { title: 'Divide & Conquer', count: 4, description: 'Split into smaller instances and define how their results are combined.', patternIds: ['divide-and-conquer', 'merge-sort', 'merge-k-sorted-lists'] },
  { title: "Kadane's Algorithm", count: 2, description: 'Decide whether the best range ending here extends the previous range or starts fresh.', patternIds: ['kadanes-algorithm', 'prefix-sum'] },
  { title: 'Binary Search', count: 7, description: 'State the sorted order or monotonic predicate that justifies removing half the candidates.', patternIds: ['standard-binary-search', 'lower-bound', 'rotated-array-search', 'search-in-matrix', 'peak-finding'] },
  { title: 'Heap', count: 4, description: 'Keep the next minimum or maximum available without fully sorting every update.', patternIds: ['min-heap', 'top-k', 'two-heaps', 'merge-k-sorted-lists'] },
  { title: 'Bit Manipulation', count: 6, description: 'Represent choices as bits and use masks, shifts, and XOR identities carefully.', patternIds: ['bitwise-operators', 'bit-shifting', 'bit-manipulation-primitives', 'xor-cancellation'] },
  { title: 'Math', count: 6, description: 'Reason about digits, integer operations, and repeated multiplication.', patternIds: ['binary-exponentiation', 'modular-arithmetic', 'binary-search-on-answer'] },
  { title: '1D DP', count: 5, description: 'Name the state for each position and reuse the answers to overlapping subproblems.', patternIds: ['dynamic-programming', '1d-dp', 'coin-change', 'word-break', 'longest-increasing-subsequence'] },
  { title: 'Multidimensional DP', count: 9, description: 'Track multiple coordinates or decision states and choose an order that satisfies dependencies.', patternIds: ['2d-dp', 'grid-dp', 'edit-distance', 'stock-dp', 'palindrome-dp'] },
] as const
