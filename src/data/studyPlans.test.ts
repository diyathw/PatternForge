import { describe, expect, it } from 'vitest'
import { interview150Topics } from './studyPlans'
import { nodeById } from './taxonomy'
import { contentById } from './content'

describe('Top Interview 150 curriculum links', () => {
  it('accounts for all 150 problems across 23 ordered topics', () => {
    expect(interview150Topics).toHaveLength(23)
    expect(interview150Topics.reduce((total, topic) => total + topic.count, 0)).toBe(150)
    expect(new Set(interview150Topics.map(topic => topic.title)).size).toBe(23)
  })

  it('links every topic to existing canonical curriculum entries', () => {
    for (const topic of interview150Topics) {
      expect(topic.patternIds.length).toBeGreaterThan(0)
      for (const id of topic.patternIds) expect(nodeById.has(id), `${topic.title}: ${id}`).toBe(true)
    }
  })

  it('offers authored lessons for the requested hash, search and heap topics', () => {
    for (const title of ['Hashmap', 'Binary Search', 'Heap']) {
      const topic = interview150Topics.find(topic => topic.title === title)!
      expect(topic.patternIds.some(id => contentById.has(id))).toBe(true)
    }
  })
})
