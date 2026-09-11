import { describe, it, expect } from 'vitest'
import { animatedExamples, animatedTrace } from './animatedTraces'

describe('animated algorithm traces', () => {
  it('keeps window counts synchronized and reports the brute-force longest unique length', () => {
    animatedExamples['sliding-window'].forEach(({input},example) => {
      const text = [...input as string]
      let expected = 0
      for(let l=0;l<text.length;l++) for(let r=l;r<text.length;r++) {
        const part = text.slice(l,r+1)
        if(new Set(part).size===part.length) expected=Math.max(expected,part.length)
      }
      const steps=animatedTrace('sliding-window',example)!
      for(const step of steps) {
        const v=step.variables!, counts=v.counts as Record<string,number>
        const active=text.slice(Number(v.left),Number(v.right)+1)
        for(const ch of new Set(text)) expect(counts[ch]??0).toBe(active.filter(c=>c===ch).length)
        if(step.action==='Update best') expect(new Set(active).size).toBe(active.length)
      }
      expect(steps.at(-1)?.variables?.best).toBe(expected)
    })
  })
  it('distinguishes multiset equality from matching distinct letters', () => {
    animatedExamples.anagram.forEach(({input},example) => {
      const [a,b]=input as string[]
      const steps=animatedTrace('anagram',example)!
      expect(steps.at(-1)?.variables?.answer).toBe([...a].sort().join('')===[...b].sort().join(''))
      expect(steps).toHaveLength([...a].length+[...b].length+2)
    })
    expect(animatedTrace('anagram',1)!.at(-1)?.variables?.counts).toEqual({a:1,b:-1})
  })
  it('handles graph cycles without duplicate discovery and leaves unreachable nodes alone', () => {
    const steps=animatedTrace('bfs')!
    expect(steps.at(-1)?.variables?.distance).toEqual([0,1,1,2,null])
    expect(steps.at(-1)?.variables?.visited).toEqual([0,1,2,3])
    expect(steps.filter(s=>s.action==='Discover')).toHaveLength(3)
    for(const step of steps) {
      const queue=step.variables!.queue as number[]
      expect(new Set(queue).size).toBe(queue.length)
    }
  })
})
