import { allProblemShapes, nodeById } from '../../data/taxonomy'
import { confusionPairs, decisionTree } from '../../data/recognition'
import type { RecognitionAnalysis, RecognitionConstraints } from '../../types/domain'

export function complexityGuidance(n?: number): string[] {
  if (n === undefined || !Number.isFinite(n) || n < 0) return ['Check input size, memory, output size, and operation costs before choosing an algorithm.']
  const budget = n <= 10 ? 'Factorial enumeration may be viable for small n.' : n <= 20 ? 'Subset enumeration or bitmask DP may be viable; count transitions and bytes per state.' : n <= 40 ? 'Meet in the middle may reduce 2^n search to roughly 2^(n/2).' : n <= 1000 ? 'Quadratic work may be viable.' : n <= 100000 ? 'Usually seek O(n) or O(n log n).' : 'Usually seek linear or near-linear work; inspect memory and constants carefully.'
  return [`n = ${n.toLocaleString()}: ${budget}`, 'These are heuristics, not guarantees. Time limits, language, constants, and output size can change the budget.']
}

export function analyzeProblem(text: string, supplied: RecognitionConstraints = {}): RecognitionAnalysis {
  const t = text.toLowerCase().replace(/[–−]/g, '-')
  const constraints: RecognitionConstraints = { ...supplied }
  const size = t.match(/\bn\s*(?:<=|≤|=)\s*([\d,]+)(?:\s*\^\s*(\d+))?/)
  if (constraints.n === undefined && size) constraints.n = size[2] ? Number(size[1]) ** Number(size[2]) : Number(size[1].replaceAll(',', ''))
  const nonnegative = /non[ -]?negative|positive (?:edge|weight)|all weights.*(?:positive|zero)/.test(t)
  if (constraints.negativeWeights === undefined && /weight|edge|graph|path/.test(t)) {
    if (nonnegative) constraints.negativeWeights = false
    else if (/negative (?:edge|weight)|weights.*negative/.test(t)) constraints.negativeWeights = true
  }
  constraints.hasNegativeNumbers ??= !nonnegative && /negative (?:number|value)|values.*negative/.test(t)
  constraints.unweighted ??= /unweighted|equal.cost|each.*costs? (?:one|1)|every.*costs? (?:one|1)/.test(t)
  constraints.dynamicUpdates ??= /dynamic|mutable|interleav|point updates?|updates between|update and query/.test(t)
  constraints.rangeUpdates ??= /range (?:add|update|assign|increment)/.test(t)
  constraints.staticQueries ??= /static|never changes|no updates|fixed array/.test(t)
  constraints.sorted ??= /\bsorted\b/.test(t) && !/\bunsorted\b/.test(t)
  const result: RecognitionAnalysis = { clues: [], shapeIds: [], candidates: [], eliminated: [], constraintNotes: complexityGuidance(constraints.n), steps: [] }
  const add = (patternId: string, reason: string, complexity?: string) => {
    if (!nodeById.has(patternId) || result.candidates.some(c => c.patternId === patternId)) return
    result.candidates.push({ patternId, reason, complexity: complexity ?? nodeById.get(patternId)?.complexityNotes ?? 'Depends on the chosen variant and input representation.' })
  }
  const shape = (id: string) => { if (nodeById.has(id) && !result.shapeIds.includes(id)) result.shapeIds.push(id) }
  const eliminate = (patternId: string, reason: string) => { result.candidates = result.candidates.filter(c => c.patternId !== patternId); if (!result.eliminated.some(c => c.patternId === patternId)) result.eliminated.push({ patternId, reason }) }
  for (const s of allProblemShapes) {
    const matches = [...s.recognitionWords, s.name.toLowerCase(), ...(s.aliases ?? [])].filter(w => w.length > 2 && t.includes(w.toLowerCase()))
    if (matches.length) { shape(s.id); result.clues.push(...matches); for (const id of s.candidatePatternIds) add(id, s.disambiguation) }
  }
  if (/same (?:letters|characters)|anagram/.test(t)) {
    shape(/group|cluster/.test(t) ? 'group-anagrams' : 'anagram')
    add('frequency-counting', 'Compare character multiplicities; fixed small alphabets permit counting arrays.', 'O(total characters) time; O(alphabet size) per signature')
    add('sort-and-scan', 'Sorted characters form a canonical identity; a simple alternative to frequency signatures.', 'O(L log L) per word')
    if (/group|cluster/.test(t)) add('hash-map', 'Group canonical word signatures into buckets.', 'Expected O(number of words) map operations plus key construction')
  }
  if (/shortest|minimum.*(?:path|route|moves|steps)|fewest.*(?:moves|steps)/.test(t)) {
    shape('path-finding')
    if (/\bdag\b|acyclic/.test(t)) {
      add('dag-shortest-path', 'A topological pass relaxes edges once, including negative weights.', 'O(V+E)')
      eliminate('dijkstra', 'Unnecessary here: the known DAG permits a linear topological relaxation, including negative edges. Dijkstra remains valid when all weights are non-negative.')
    } else if (constraints.unweighted) {
      add('bfs', 'Equal-cost edges make breadth-first layers distance layers.', 'O(V+E)')
      eliminate('dijkstra', 'A priority queue is unnecessary when every edge has equal cost.')
      eliminate('bellman-ford', 'Equal-cost moves need no repeated weighted relaxation.')
    } else if (/0.?1 weights|weights? (?:are |only )?(?:0 and 1|zero and one)/.test(t)) {
      add('0-1-bfs', 'Put zero-cost relaxations at the deque front and unit-cost relaxations at its back.', 'O(V+E)')
    } else if (constraints.negativeWeights === true) {
      add('bellman-ford', 'Negative edges require relaxation that can revisit distances; detect reachable negative cycles.', 'O(VE)')
      eliminate('dijkstra', 'Negative edges invalidate ordinary greedy finalization.')
      eliminate('a-star', 'Ordinary A* shortest-path guarantees require suitable edge costs and heuristic conditions; negative edges are not covered.')
      eliminate('bfs', 'Distance is not determined by number of edges when weights differ.')
      for (const id of ['bfs-shortest-path', 'multi-source-bfs', 'bidirectional-bfs', '0-1-bfs']) eliminate(id, 'The stated negative edge weights do not satisfy this traversal’s edge-cost assumptions.')
    } else if (constraints.negativeWeights === false) {
      add('dijkstra', 'Non-negative weights justify finalizing the smallest tentative distance.', 'O((V+E) log V) with a binary heap')
      eliminate('bfs', 'Different edge costs invalidate ordinary BFS distance layers.')
      for (const id of ['bfs-shortest-path', 'multi-source-bfs', 'bidirectional-bfs']) eliminate(id, 'Ordinary BFS distance layers require equal edge costs, which are not guaranteed.')
    } else result.constraintNotes.push('Edge weights are unspecified: ask equal-cost, 0/1, non-negative, negative, or DAG before choosing a shortest-path algorithm.')
  }
  if (/subarray|contiguous|segment/.test(t) && /sum/.test(t)) {
    shape('subarray')
    if (/maximum|max sum|largest sum/.test(t)) {
      add('kadanes-algorithm', 'For maximum contiguous sum, keep the best sum ending here and restart when beneficial.', 'O(n) time, O(1) extra space')
      for (const id of ['sliding-window', 'variable-sliding-window']) eliminate(id, 'Unrestricted maximum subarray sum is not a sum-bound shrinking-window problem. Kadane handles it directly, including signed values.')
    } else {
      add('prefix-sum', 'For exact target sums, compare prefix differences; a frequency map counts repeated prefixes.', 'Expected O(n) with a hash map')
      add('hash-map', 'Track how many earlier prefixes equal currentPrefix − target.', 'Expected O(n) space/time')
      if (constraints.hasNegativeNumbers) for (const id of ['sliding-window', 'variable-sliding-window']) eliminate(id, 'For sum-based shrink/grow logic, negatives break monotonicity. Fixed-size windows can still work on signed arrays when the window length is given.')
      else result.constraintNotes.push('A sum window needs a monotone validity rule; exact-sum counting with zeros also requires care.')
    }
  }
  if (/substring/.test(t) && /repeat|distinct|unique/.test(t)) {
    shape('substring'); add('sliding-window', 'Maintain character counts; shrink until the uniqueness or frequency bound is restored.', 'O(n) boundary moves')
  }
  if (/range|queries/.test(t)) {
    shape('range-query')
    if (constraints.rangeUpdates && constraints.dynamicUpdates) {
      add('lazy-segment-tree', 'Interleaved compatible range updates and queries require stored aggregates and deferred update tags.', 'O(log n) per operation')
      eliminate('difference-array', 'A plain difference array is best when updates precede a final reconstruction, not arbitrary online range queries.')
    } else if (constraints.rangeUpdates) add('difference-array', 'For offline range additions, mark boundaries and reconstruct once.', 'O(1) per addition, O(n) reconstruction')
    if (constraints.dynamicUpdates) {
      if (/sum/.test(t) && !constraints.rangeUpdates) { shape('dynamic-range-sum'); add('fenwick-tree', 'Point updates and sums support compact prefix aggregates.', 'O(log n) update and query') }
      add('segment-tree', 'An associative aggregate supports dynamic range queries.', 'O(log n) point update and range query')
      eliminate('prefix-sum', 'Rebuilding static prefixes after each update is expensive.')
      eliminate('sparse-table', 'An ordinary sparse table requires rebuilding after changes.')
    } else if (constraints.staticQueries && /minimum|maximum|min|max|gcd/.test(t)) add('sparse-table', 'Idempotent static aggregates allow overlapping blocks.', 'O(n log n) preprocessing; O(1) min/max/gcd query')
    else if (constraints.staticQueries && /sum/.test(t)) add('prefix-sum', 'No changes means one prefix build can serve every sum query.', 'O(n) preprocessing; O(1) query')
  }
  if (/prerequisite|dependenc|build order/.test(t)) { shape('dependency-problems'); add('topological-sort', 'Order directed prerequisites; detect cycles rather than returning an invalid order.', 'O(V+E)') }
  if (/kth|top k|largest.*stream/.test(t)) {
    shape('top-k')
    if (/stream/.test(t)) { add('min-heap', 'Keep only the largest k values in a bounded heap.', 'O(n log k), O(k) space'); eliminate('quickselect', 'Ordinary quickselect needs the batch array in memory.') }
    else { add('quickselect', 'For a one-shot rank, partition around pivots if mutation is acceptable.', 'Expected O(n), worst O(n²)'); add('heap', 'A size-k heap trades expected linear selection for predictable logarithmic updates.', 'O(n log k)') }
  }
  result.clues = [...new Set(result.clues)]
  // Keep the strongest structural alternatives first while retaining explainable comparisons.
  const priorities = constraints.negativeWeights === true ? ['bellman-ford', 'dag-shortest-path'] : constraints.unweighted ? ['bfs'] : constraints.dynamicUpdates ? (constraints.rangeUpdates ? ['lazy-segment-tree', 'segment-tree'] : ['fenwick-tree', 'segment-tree']) : /maximum sum|max sum/.test(t) ? ['kadanes-algorithm'] : /substring/.test(t) && /repeat|distinct|unique/.test(t) ? ['sliding-window', 'hash-map'] : []
  result.candidates.sort((a, b) => {
    const rank = (id: string) => priorities.includes(id) ? priorities.indexOf(id) : priorities.length
    return rank(a.patternId) - rank(b.patternId)
  })
  result.steps = [
    result.shapeIds.length ? `Identify shape: ${result.shapeIds.map(id => nodeById.get(id)?.name).join(', ')}.` : 'No confident wording match. Describe the required output and structural constraints more precisely.',
    'Inspect constraints and distinguish input guarantees from assumptions.',
    `Consider structures: ${result.candidates.filter(c => nodeById.get(c.patternId)?.type === 'data-structure').map(c => nodeById.get(c.patternId)?.name).join(', ') || 'choose state to match candidate operations'}.`,
    'Compare candidate preconditions and complexity; these suggestions are a transparent rule-based shortlist, not a correctness proof.',
    'Choose an invariant, implement a reusable template, and test empty, boundary, duplicate, and adversarial cases.',
  ]
  return result
}

export function traverseDecisionTree(nodeId: string, answer: string) {
  const node = decisionTree.find(n => n.id === nodeId)
  const next = node?.branches[answer]
  if (!next) return null
  return next.startsWith('pattern:') ? { patternId: next.slice(8), node: undefined } : { patternId: undefined, node: decisionTree.find(n => n.id === next) }
}

export function comparePatterns(a: string, b: string) {
  return confusionPairs.find(pair => (pair.patternIdA === a && pair.patternIdB === b) || (pair.patternIdA === b && pair.patternIdB === a)) ?? null
}
