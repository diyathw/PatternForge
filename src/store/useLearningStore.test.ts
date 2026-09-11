// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { currentStreak, useLearningStore } from './useLearningStore'

describe('persisted learner state', () => {
  beforeEach(() => { localStorage.clear(); useLearningStore.getState().resetProgress() })
  it('defaults to JavaScript and isolates drafts by language', () => {
    expect(useLearningStore.getState().language).toBe('javascript')
    useLearningStore.getState().setDraft('example', 'javascript', 'return 1')
    useLearningStore.getState().setDraft('example', 'python', 'return 2')
    expect(useLearningStore.getState().drafts).toEqual({ 'example:javascript': 'return 1', 'example:python': 'return 2' })
  })
  it('rehydrates real progress and language', async () => {
    const state = useLearningStore.getState()
    state.setLanguage('python')
    state.recordAttempt('hash-map', { kind: 'coding', correct: true, confidence: 'fairly-sure' })
    const persisted = localStorage.getItem('patternforge-learning-v1')!
    state.resetProgress()
    localStorage.setItem('patternforge-learning-v1', persisted)
    await useLearningStore.persist.rehydrate()
    expect(useLearningStore.getState().language).toBe('python')
    expect(useLearningStore.getState().mastery['hash-map'].codingScore).toBeGreaterThan(0)
    expect(useLearningStore.getState().attempts).toHaveLength(1)
  })
  it('does not save invented topic IDs', () => {
    useLearningStore.getState().recordAttempt('invented', { kind: 'coding', correct: true, confidence: 'certain' })
    expect(useLearningStore.getState().mastery).toEqual({})
  })
  it('calculates streaks across month boundaries with today optional', () => {
    expect(currentStreak(['2026-08-30', '2026-08-31'], new Date(2026, 8, 1))).toBe(2)
    expect(currentStreak(['2026-08-30'], new Date(2026, 8, 1))).toBe(0)
  })
})
