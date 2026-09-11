import { describe, expect, it } from 'vitest'
import { skillChecks } from './index'
import { nodeById } from '../taxonomy'
describe('skill checks',()=>{
 it('references existing curriculum and offers a valid answer for every practice modality',()=>{
  expect(new Set(skillChecks.map(q=>q.kind))).toEqual(new Set(['trace','template','debug','complexity']))
  for(const q of skillChecks){expect(nodeById.has(q.nodeId),q.id).toBe(true);expect(q.options[q.answerIndex],q.id).toBeTruthy();expect(new Set(q.options).size).toBe(q.options.length)}
 })
})
