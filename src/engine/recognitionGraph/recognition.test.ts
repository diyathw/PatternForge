import { describe, expect, it } from 'vitest'
import { analyzeProblem, complexityGuidance, traverseDecisionTree } from './index'
import { recognitionQuestions, confusionPairs, decisionTree } from '../../data/recognition'
import { nodeById } from '../../data/taxonomy'

describe('constraint-based recognition', () => {
  it('rejects Dijkstra for negative edges but not non-negative edges', () => {
    const negative = analyzeProblem('Shortest path with negative edge weights')
    expect(negative.candidates.map(c => c.patternId)).toContain('bellman-ford')
    expect(negative.candidates.map(c => c.patternId)).not.toContain('dijkstra')
    expect(analyzeProblem('Shortest path with non-negative weighted edges').candidates.map(c => c.patternId)).toContain('dijkstra')
  })
  it('does not choose ordinary sum windows with signed values', () => {
    const result = analyzeProblem('Count contiguous subarrays with sum equal to k; values may be negative')
    expect(result.candidates.map(c => c.patternId)).toContain('prefix-sum')
    expect(result.candidates.map(c => c.patternId)).not.toContain('sliding-window')
  })
  it('prunes invalid variants for signed segment and weighted shortest-path wording', () => {
    for (const text of ['Find the shortest segment with a target sum; values may be negative', 'Find the maximum sum contiguous subarray with negative numbers']) {
      const result = analyzeProblem(text)
      expect(result.candidates.length).toBeGreaterThan(0)
      expect(result.candidates.map(c => c.patternId)).not.toContain('sliding-window')
      expect(result.candidates.map(c => c.patternId)).not.toContain('variable-sliding-window')
    }
    const graph = analyzeProblem('Find a shortest path with negative edge weights; a minimum number of hops is not the goal')
    for (const id of ['bfs', 'bfs-shortest-path', 'multi-source-bfs', 'bidirectional-bfs', 'dijkstra', 'a-star']) expect(graph.candidates.map(c => c.patternId)).not.toContain(id)
  })
  it('eliminates static structures for mutable range sums', () => {
    const result = analyzeProblem('Dynamic range sum queries interleaved with point updates')
    expect(result.candidates.map(c => c.patternId)).toContain('fenwick-tree')
    expect(result.candidates.map(c => c.patternId)).not.toContain('prefix-sum')
    expect(result.candidates.map(c => c.patternId)).not.toContain('sparse-table')
  })
  it('selects offline differences versus online lazy updates', () => {
    expect(analyzeProblem('Range add operations followed by final output').candidates.map(c => c.patternId)).toContain('difference-array')
    const online = analyzeProblem('Range updates interleaved with range sum queries')
    expect(online.candidates.map(c => c.patternId)).toContain('lazy-segment-tree')
    expect(online.candidates.map(c => c.patternId)).not.toContain('difference-array')
  })
  it('does not confidently classify arbitrary prose', () => {
    expect(analyzeProblem('Please solve this problem').candidates).toEqual([])
    expect(complexityGuidance(20).join(' ')).toContain('heuristics')
  })
  it('keeps every question, comparison and decision target canonical', () => {
    for (const q of recognitionQuestions) for (const id of [...q.correctPatternIds, ...q.distractorPatternIds]) expect(nodeById.has(id), `${q.id}: ${id}`).toBe(true)
    for (const p of confusionPairs) for (const id of [p.patternIdA, p.patternIdB]) expect(nodeById.has(id), id).toBe(true)
    for (const node of decisionTree) for (const target of Object.values(node.branches)) expect(target.startsWith('pattern:') ? nodeById.has(target.slice(8)) : decisionTree.some(n => n.id === target), target).toBe(true)
    expect(traverseDecisionTree('weights', 'May be negative')?.patternId).toBe('bellman-ford')
    expect(traverseDecisionTree('missing', 'unknown')).toBeNull()
  })
})
