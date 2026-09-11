/**
 * Exercises are authored alongside their lesson (see `data/content/catalog.ts`'s
 * `add()` helper, which appends to both `lessons` and `practice` from one call so
 * a pattern's explanation, template, and exercise stay in sync). This module just
 * re-exports that same array under the path the rest of the app expects.
 */
import { contentExercises } from '../content'

export const exercises = contentExercises
