import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { LanguageId, LearningAttempt, MasteryRecord, ThemeMode } from '../types/domain'
import { createMasteryRecord, recordAttempt as updateMastery } from '../engine/mastery'
import { nodeById } from '../data/taxonomy'

interface LearningState {
  language: LanguageId
  theme: ThemeMode
  mastery: Record<string, MasteryRecord>
  attempts: { nodeId: string; at: string; attempt: LearningAttempt }[]
  drafts: Record<string, string>
  completedLessons: string[]
  activityDates: string[]
  setLanguage: (language: LanguageId) => void
  setTheme: (theme: ThemeMode) => void
  recordAttempt: (nodeId: string, attempt: LearningAttempt) => void
  setDraft: (exerciseId: string, language: LanguageId, code: string) => void
  completeLesson: (nodeId: string) => void
  resetProgress: () => void
}
const initial = { language: 'javascript' as LanguageId, theme: 'system' as ThemeMode, mastery: {}, attempts: [], drafts: {}, completedLessons: [], activityDates: [] }
const localDate = (now: Date) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
export const useLearningStore = create<LearningState>()(persist((set) => ({
  ...initial,
  setLanguage: language => set({ language }),
  setTheme: theme => set({ theme }),
  recordAttempt: (nodeId, attempt) => {
    if (!nodeById.has(nodeId)) return
    const now = new Date()
    set(state => ({ mastery: { ...state.mastery, [nodeId]: updateMastery(state.mastery[nodeId] ?? createMasteryRecord(nodeId, now), attempt, now) }, attempts: [...state.attempts.slice(-999), { nodeId, at: now.toISOString(), attempt }], activityDates: [...new Set([...state.activityDates, localDate(now)])].slice(-366) }))
  },
  setDraft: (exerciseId, language, code) => set(state => ({ drafts: { ...state.drafts, [`${exerciseId}:${language}`]: code } })),
  completeLesson: nodeId => { if (nodeById.has(nodeId)) set(state => ({ completedLessons: [...new Set([...state.completedLessons, nodeId])], activityDates: [...new Set([...state.activityDates, localDate(new Date())])].slice(-366) })) },
  resetProgress: () => set({ ...initial }),
}), { name: 'patternforge-learning-v1', version: 1, storage: createJSONStorage(() => localStorage), partialize: state => ({ language: state.language, theme: state.theme, mastery: state.mastery, attempts: state.attempts, drafts: state.drafts, completedLessons: state.completedLessons, activityDates: state.activityDates }) }))

export function currentStreak(activityDates: string[], now = new Date()): number {
  const dates = new Set(activityDates)
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (!dates.has(localDate(cursor))) cursor.setDate(cursor.getDate() - 1)
  let count = 0
  while (dates.has(localDate(cursor))) { count++; cursor.setDate(cursor.getDate() - 1) }
  return count
}
