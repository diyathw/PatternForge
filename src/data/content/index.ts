import { lessons, practice } from './catalog'
import './arrays'
import './graphs'
import './structures'
import type { PatternContent, CodingExercise } from '../../types/domain'

export const patternContents: PatternContent[] = lessons
export const contentById: Map<string, PatternContent> = new Map(lessons.map(l => [l.patternId, l]))
export const contentExercises: CodingExercise[] = practice
