import { describe, expect, it } from 'vitest'
import { createMasteryRecord, dueReviews, generateDailyPractice, masteryScore, recordAttempt } from './index'
import type { CodingExercise, LearningAttempt } from '../../types/domain'
import { recognitionQuestions } from '../../data/recognition'

const confident: LearningAttempt = { kind: 'recognition', correct: true, confidence: 'certain' }
const day = (d: number) => new Date(Date.UTC(2026, 0, d))
describe('mastery evidence and retention', () => {
  it('uses the documented weights', () => {
    const r = createMasteryRecord('hash-map')
    expect(masteryScore({ ...r, recognitionScore: 100 })).toBe(30)
    expect(masteryScore({ ...r, codingScore: 100, traceScore: 100, complexityScore: 100, retentionScore: 100 })).toBe(70)
  })
  it('penalizes hints, retries and uncertain correct answers', () => {
    const r = createMasteryRecord('hash-map', day(1))
    const clean = recordAttempt(r, confident, day(1))
    const assisted = recordAttempt(r, { ...confident, hintsUsed: 2, retries: 1, confidence: 'unsure' }, day(1))
    expect(assisted.recognitionScore).toBeLessThan(clean.recognitionScore)
    expect(assisted.nextReviewAt).toBe(day(2).toISOString())
  })
  it('advances actual delayed successful reviews through 1, 3, 7 days', () => {
    const first = recordAttempt(createMasteryRecord('hash-map', day(1)), confident, day(1))
    expect(first.nextReviewAt).toBe(day(2).toISOString())
    const second = recordAttempt(first, confident, day(2))
    expect(second.nextReviewAt).toBe(day(5).toISOString())
    expect(recordAttempt(second, confident, day(5)).nextReviewAt).toBe(day(12).toISOString())
  })
  it('same-session repetitions cannot manufacture retention or move the due date', () => {
    let r = createMasteryRecord('hash-map', day(1))
    for (let i = 0; i < 100; i++) r = recordAttempt(r, confident, day(1))
    expect(r.retentionScore).toBe(0)
    expect(r.reviewStreak).toBe(0)
    expect(r.status).not.toBe('mastered')
    expect(r.nextReviewAt).toBe(day(2).toISOString())
  })
  it('failed reviews reset intervals and due lists respect time', () => {
    const r = recordAttempt(createMasteryRecord('hash-map', day(1)), confident, day(1))
    expect(dueReviews({ 'hash-map': r }, day(1))).toHaveLength(0)
    expect(dueReviews({ 'hash-map': r }, day(2))).toHaveLength(1)
    const failed = recordAttempt({ ...r, reviewStreak: 4 }, { ...confident, correct: false }, day(2))
    expect(failed.reviewStreak).toBe(0)
    expect(failed.nextReviewAt).toBe(day(3).toISOString())
    expect(generateDailyPractice({}, [], day(1))).toBeNull()
  })
  it('builds deterministic complete daily sets using real exercise and question IDs', () => {
    const exercise: CodingExercise = { id: 'sample', title: 'Sample', patternIds: ['hash-map'], problemShapeIds: ['pair-sum'], difficulty: 'easy', prompt: 'Find a pair', examples: [], constraints: [], starterCode: { javascript: '', python: '' }, tests: [], hints: [], solutions: { javascript: '', python: '' } }
    const r = recordAttempt(createMasteryRecord('hash-map', day(1)), { ...confident, correct: false }, day(1))
    const set = generateDailyPractice({ 'hash-map': r }, [exercise], day(2))!
    expect(set).toEqual(generateDailyPractice({ 'hash-map': r }, [exercise], day(2)))
    expect(set.codingExerciseId).toBe('sample')
    expect(set.weakTopicNodeId).toBe('hash-map')
    expect(set.spacedRepetitionNodeIds).toContain('hash-map')
    for (const id of [...set.recognitionQuestionIds, set.complexityQuestionId]) expect(recognitionQuestions.some(q => q.id === id)).toBe(true)
  })
})
