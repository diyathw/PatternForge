import type { CodingExercise, DailyPracticeSet, LearningAttempt, MasteryRecord, MasteryStatus } from '../../types/domain'
import { recognitionQuestions } from '../../data/recognition'

const DAY = 86400000
export const reviewIntervals = [1, 3, 7, 14, 30] as const
const clamp = (n: number) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0))
export function masteryScore(record?: MasteryRecord): number {
  if (!record) return 0
  return Math.round(clamp(record.recognitionScore) * .30 + clamp(record.codingScore) * .30 + clamp(record.traceScore) * .15 + clamp(record.complexityScore) * .10 + clamp(record.retentionScore) * .15)
}
export function createMasteryRecord(nodeId: string, now = new Date()): MasteryRecord {
  return { nodeId, status: 'not-started', recognitionScore: 0, codingScore: 0, traceScore: 0, complexityScore: 0, retentionScore: 0, confidenceHistory: [], nextReviewAt: now.toISOString(), reviewStreak: 0, attempts: 0 }
}

/** Evidence model, not a psychometrically validated ability estimate. Speed is a small penalty only. */
export function recordAttempt(previous: MasteryRecord, attempt: LearningAttempt, now = new Date()): MasteryRecord {
  const confidence = { guessing: .45, unsure: .65, 'fairly-sure': .9, certain: 1 }[attempt.confidence]
  const hints = Math.max(0, attempt.hintsUsed ?? 0)
  const retries = Math.max(0, attempt.retries ?? 0)
  const speedPenalty = Math.min(10, Math.max(0, (attempt.elapsedSeconds ?? 0) - (attempt.kind === 'coding' ? 1200 : 180)) / 120)
  const evidence = attempt.correct ? clamp(100 * confidence - hints * 10 - retries * 8 - speedPenalty) : 0
  const field = { recognition: 'recognitionScore', coding: 'codingScore', trace: 'traceScore', complexity: 'complexityScore', retention: 'retentionScore' }[attempt.kind] as 'recognitionScore' | 'codingScore' | 'traceScore' | 'complexityScore' | 'retentionScore'
  const elapsed = previous.lastReviewedAt ? now.getTime() - new Date(previous.lastReviewedAt).getTime() : 0
  const delayed = elapsed >= DAY && now.getTime() >= new Date(previous.nextReviewAt).getTime()
  const successful = attempt.correct && confidence >= .9 && hints === 0 && retries === 0
  const streak = successful ? Math.min(5, (previous.reviewStreak ?? 0) + (delayed ? 1 : 0)) : 0
  const record = { ...previous, confidenceHistory: [...previous.confidenceHistory.slice(-49), attempt.confidence], attempts: (previous.attempts ?? 0) + 1, reviewStreak: streak }
  if (attempt.kind !== 'retention' || delayed) record[field] = clamp(previous[field] * .65 + evidence * .35)
  if (delayed && attempt.kind !== 'retention') record.retentionScore = clamp(previous.retentionScore * .65 + evidence * .35)
  if (!attempt.correct) record.retentionScore *= .8
  // Same-session practice should not push a due date forward indefinitely.
  if (!previous.lastReviewedAt || delayed || !successful) {
    record.lastReviewedAt = now.toISOString()
    record.nextReviewAt = new Date(now.getTime() + DAY * (successful ? reviewIntervals[Math.min(streak, 4)] : 1)).toISOString()
  }
  const score = masteryScore(record)
  const status: MasteryStatus = score >= 90 && record.retentionScore >= 75 && streak >= 3 ? 'mastered' : score >= 75 && record.codingScore >= 65 && record.retentionScore >= 50 ? 'interview-ready' : score >= 40 ? 'practicing' : 'learning'
  record.status = status
  return record
}

export function dueReviews(records: Record<string, MasteryRecord>, now = new Date()): MasteryRecord[] {
  return Object.values(records).filter(r => r.status !== 'not-started' && new Date(r.nextReviewAt).getTime() <= now.getTime()).sort((a, b) => Date.parse(a.nextReviewAt) - Date.parse(b.nextReviewAt))
}

export function generateDailyPractice(records: Record<string, MasteryRecord>, exercises: CodingExercise[], now = new Date()): DailyPracticeSet | null {
  if (!exercises.length) return null
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const dayIndex = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY)
  const weak = Object.values(records).filter(r => r.attempts).sort((a, b) => masteryScore(a) - masteryScore(b))[0]
  const exercise = exercises.find(e => weak && e.patternIds.includes(weak.nodeId)) ?? exercises[dayIndex % exercises.length]
  const weakTopicNodeId = weak?.nodeId ?? exercise.patternIds[0]
  const questions = recognitionQuestions.filter(q => !q.id.startsWith('size-'))
  const relevant = questions.filter(q => q.correctPatternIds.includes(weakTopicNodeId))
  const selected = [...new Set([...relevant.map(q => q.id), questions[dayIndex % questions.length].id, questions[(dayIndex + 3) % questions.length].id])].slice(0, 3)
  return { date, recognitionQuestionIds: selected, codingExerciseId: exercise.id, templateQuestionNodeId: exercise.patternIds[0], complexityQuestionId: ['size-twenty', 'size-forty', 'size-large'][dayIndex % 3], weakTopicNodeId, spacedRepetitionNodeIds: dueReviews(records, now).slice(0, 5).map(r => r.nodeId) }
}
