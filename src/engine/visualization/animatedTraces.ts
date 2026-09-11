import type { VisualizationStep } from '../../types/domain'

export const animatedExamples: Record<string, { label: string; input: string | string[] }[]> = {
  'sliding-window': [{ label: 'Repeat and shrink · abba', input: 'abba' }, { label: 'Longer window · abcabcbb', input: 'abcabcbb' }, { label: 'All identical · aaaa', input: 'aaaa' }],
  anagram: [{ label: 'Same letters · listen / silent', input: ['listen', 'silent'] }, { label: 'Counts matter · aab / abb', input: ['aab', 'abb'] }, { label: 'Repeated letters · banana / ananab', input: ['banana', 'ananab'] }],
  bfs: [{ label: 'Branches, a cycle, and an unreachable node', input: '' }],
}
export const bfsAdj = [[1, 2], [0, 3], [0, 3], [1, 2], []]
export function animatedTrace(id: string, example = 0): VisualizationStep[] | undefined {
  const sample = animatedExamples[id]?.[example]
  if (!sample) return undefined
  const steps: VisualizationStep[] = []
  const push = (description: string, variables: Record<string, unknown>, action: string) => steps.push({ id: `${id}-${steps.length}`, description, variables: structuredClone(variables), action })
  if (id === 'sliding-window') {
    const letters = [...sample.input as string], counts: Record<string, number> = Object.fromEntries([...new Set(sample.input as string)].map(ch=>[ch,0]))
    let left = 0, best = 0
    const frame = (right: number, focus: number) => ({ letters, counts, left, right, best, focus })
    push('Start with an empty window. Move R to include one letter at a time.', frame(-1, -1), 'Start')
    for (let right = 0; right < letters.length; right++) {
      const ch = letters[right]; counts[ch] = (counts[ch] ?? 0) + 1
      push(`Include ${ch} at R = ${right}. ${counts[ch] > 1 ? 'It repeats inside the window; move L until the duplicate is gone.' : 'Every letter is unique; this window is valid.'}`, frame(right, right), 'Expand R')
      while (counts[ch] > 1) {
        const removed = letters[left]; counts[removed]--; left++
        push(`Remove ${removed} and move L to ${left}. ${counts[ch] > 1 ? `${ch} still repeats, so shrink again.` : 'The window is unique again.'}`, frame(right, left - 1), 'Shrink L')
      }
      best = Math.max(best, right - left + 1)
      push(`Valid window “${letters.slice(left, right + 1).join('')}” has length ${right-left+1}. Best length so far: ${best}.`, frame(right, -1), 'Update best')
    }
    push(`Finished. The longest unique substring has length ${best}. Each letter entered and left at most once: O(n) time.`, frame(letters.length - 1, -1), 'Result')
  } else if (id === 'anagram') {
    const [a,b] = (sample.input as string[]).map(s => [...s]), counts: Record<string,number> = Object.fromEntries([...new Set([...a,...b])].sort().map(c=>[c,0]))
    const frame = (row: number, focus: number) => ({ a,b,counts,row,focus })
    push('Anagrams have the same letters with the same counts. Add the first word, then cancel with the second.', frame(-1,-1), 'Start')
    a.forEach((ch,i) => { counts[ch]++; push(`Read ${ch} from the first word: add 1 to its bucket. ${ch} now has ${counts[ch]}.`, frame(0,i), 'Count +1') })
    b.forEach((ch,i) => { counts[ch]--; push(`Read ${ch} from the second word: subtract 1. ${counts[ch] === 0 ? `All copies of ${ch} are matched.` : `${ch} now has balance ${counts[ch]}.`}`, frame(1,i), 'Cancel −1') })
    const answer = Object.values(counts).every(n=>n===0)
    push(answer ? 'All balances are zero. These words are anagrams, even though their letter order differs.' : 'Some balances are not zero. These words are not anagrams: having the same distinct letters is not enough.', {...frame(-1,-1),answer}, 'Result')
  } else {
    const queue = [0], distance: (number|null)[] = [0,null,null,null,null], visited: number[] = []
    const frame = (current: number, edge: number[] = []) => ({ queue,distance,visited,current,edge })
    push('Discover node 0 at distance 0 and enqueue it. The queue processes the nearest discovered nodes first.', frame(-1), 'Start')
    while(queue.length) {
      const u = queue.shift()!; visited.push(u)
      push(`Dequeue node ${u}. Inspect its edges before taking the next node from the queue.`, frame(u), 'Dequeue')
      for(const v of bfsAdj[u]) {
        if(distance[v] !== null) push(`Follow ${u} → ${v}. Node ${v} was already discovered, so skip it. This prevents cycles from repeating forever.`, frame(u,[u,v]), 'Skip seen')
        else { distance[v] = distance[u]! + 1; queue.push(v); push(`Follow ${u} → ${v}. Discover ${v} at distance ${distance[v]} and add it to the back of the queue.`, frame(u,[u,v]), 'Discover') }
      }
    }
    push('The queue is empty. Distances are shortest edge counts in this unweighted graph. Node 4 is unreachable from 0.', frame(-1), 'Result')
  }
  steps[steps.length-1].done = true
  return steps
}
