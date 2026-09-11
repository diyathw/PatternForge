/**
 * Canonical shared domain model for PatternForge.
 *
 * Ownership: this file is edited ONLY by Agent 0 (the orchestrator). Every other
 * agent imports from here and must not redefine or fork these shapes. If a new
 * field is needed, flag it back to Agent 0 rather than inventing a parallel type.
 *
 * Canonical IDs: every `id` in this domain is a kebab-case string (e.g.
 * "sliding-window", "anagram", "dijkstra") minted once in `src/data/taxonomy/`.
 * All other modules reference existing IDs; they never invent new ones.
 */

// ---------------------------------------------------------------------------
// Knowledge graph
// ---------------------------------------------------------------------------

export type KnowledgeNodeType =
  | "algorithm"
  | "pattern"
  | "data-structure"
  | "problem-shape"
  | "strategy"
  | "optimization"
  | "concept"

export type Difficulty =
  | "beginner"
  | "core"
  | "intermediate"
  | "advanced"
  | "specialist"

export type InterviewFrequency = "low" | "medium" | "high" | "very-high"

/**
 * Lifecycle of a node's deep content. The full taxonomy is populated with
 * "skeleton" nodes from day one; only the first-release pattern list is
 * expected to reach "complete" in this build. Detail pages must branch on
 * this status rather than assuming `PatternContent` exists.
 */
export type ContentStatus = "skeleton" | "in-progress" | "complete"

export type LanguageId = "javascript" | "python"

export interface KnowledgeNode {
  id: string
  type: KnowledgeNodeType
  name: string
  /** Parent node id for variant/child relationships, e.g. "anagram".parent = "frequency-counting" */
  parent?: string
  aliases?: string[]
  /** One of the 12 top-level taxonomy dimensions, e.g. "graph-algorithms", "range-query-techniques" */
  category: string
  difficulty: Difficulty
  interviewFrequency: InterviewFrequency
  /** Node ids that should be understood before this one */
  prerequisites?: string[]
  /** Short phrases/keywords that should make a learner think of this node */
  recognitionClues: string[]
  /** Problem-shape ids this node commonly solves */
  commonProblemShapes?: string[]
  complexityNotes?: string
  languageTemplatesAvailable: LanguageId[]
  contentStatus: ContentStatus
}

export type RelationType =
  | "prerequisite-of"
  | "variant-of"
  | "uses"
  | "commonly-confused-with"
  | "optimization-of"
  | "alternative-to"
  | "useful-for"
  | "combines-with"
  | "commonly-solved-by"

export interface Relationship {
  from: string
  to: string
  relation: RelationType
}

export interface ProblemShape extends KnowledgeNode {
  type: "problem-shape"
  recognitionWords: string[]
  candidatePatternIds: string[]
  /** How constraints (data size, weight sign, mutability, etc.) pick the final pattern */
  disambiguation: string
}

/**
 * A named heuristic mapping a constraint (e.g. "n <= 20") to viable algorithm
 * classes. Explicitly a heuristic, not a rule — `caveat` should say so.
 */
export interface ComplexityHeuristic {
  id: string
  constraint: string
  viableApproaches: string[]
  caveat: string
}

// ---------------------------------------------------------------------------
// Visualization
// ---------------------------------------------------------------------------

/**
 * A single frame of a pattern's hand-traced walkthrough. Superset of the
 * legacy `window.PATTERN_DATA` step shape so old hand-traced data (e.g. the
 * two-pointers "Pair with Target Sum" example) ports without reshaping:
 * legacy `message` -> `description`; `cellStates`/`pointers`/`windowRange`/
 * `stack`/`stats` are kept as-is as optional fields.
 */
export interface VisualizationStep {
  id: string
  description: string
  codeLine?: number
  variables?: Record<string, unknown>
  highlights?: string[]
  action?: string
  done?: boolean

  // Legacy PATTERN_DATA-compatible fields
  cellStates?: Record<string, string>
  pointers?: { label: string; index: number }[]
  windowRange?: [number, number] | null
  stack?: unknown[] | null
  stats?: Record<string, number>
}

// ---------------------------------------------------------------------------
// Deep pattern content (first-release patterns only, in this build)
// ---------------------------------------------------------------------------

export interface PatternContent {
  patternId: string
  problemStatement: string
  explanation: string
  visualIntuition: string
  initialValues?: unknown
  meta?: Record<string, unknown>
  steps: VisualizationStep[]
  templates: Record<LanguageId, string>
  workedExample: string
  edgeCases: string[]
  mistakes: string[]
  relatedPatterns: string[]
}

// ---------------------------------------------------------------------------
// Coding practice
// ---------------------------------------------------------------------------

export interface Example {
  input: string
  output: string
  explanation?: string
}

export interface TestCase {
  id: string
  description?: string
  input: unknown
  expectedOutput: unknown
  hidden?: boolean
}

export interface Hint {
  id: string
  text: string
  /** 1 = gentlest nudge, higher = closer to the answer */
  level: number
}

export interface CodingExercise {
  id: string
  title: string
  patternIds: string[]
  problemShapeIds: string[]
  difficulty: "easy" | "medium" | "hard"
  prompt: string
  examples: Example[]
  constraints: string[]
  starterCode: Record<LanguageId, string>
  tests: TestCase[]
  hints: Hint[]
  solutions: Record<LanguageId, string>
}

// ---------------------------------------------------------------------------
// Recognition / decision engine
// ---------------------------------------------------------------------------

export interface RecognitionQuestion {
  id: string
  prompt: string
  /** Phrases pulled from the prompt that should trigger pattern recognition */
  clues: string[]
  correctPatternIds: string[]
  distractorPatternIds: string[]
  explanation: string
}

export interface ConfusionPair {
  id: string
  patternIdA: string
  patternIdB: string
  distinguishingQuestion: string
  guidance: string
}

export interface DecisionTreeNode {
  id: string
  question: string
  /** Answer label -> next node id, or a resolved pattern id prefixed with "pattern:" */
  branches: Record<string, string>
}

// ---------------------------------------------------------------------------
// Mastery / spaced repetition
// ---------------------------------------------------------------------------

export type MasteryStatus =
  | "not-started"
  | "learning"
  | "practicing"
  | "interview-ready"
  | "mastered"

export type ConfidenceLevel = "guessing" | "unsure" | "fairly-sure" | "certain"

export interface MasteryRecord {
  reviewStreak?: number
  attempts?: number
  nodeId: string
  status: MasteryStatus
  /** Weighted 30/30/15/10/15 respectively */
  recognitionScore: number
  codingScore: number
  traceScore: number
  complexityScore: number
  retentionScore: number
  confidenceHistory: ConfidenceLevel[]
  /** ISO date string; spaced-repetition schedule is 1/3/7/14/30 days */
  nextReviewAt: string
  lastReviewedAt?: string
}

export interface DailyPracticeSet {
  date: string
  recognitionQuestionIds: string[]
  codingExerciseId: string
  templateQuestionNodeId: string
  complexityQuestionId: string
  weakTopicNodeId: string
  spacedRepetitionNodeIds: string[]
}

// Shared learner evidence and constraint reasoning contracts.
export type AttemptKind = 'recognition' | 'coding' | 'trace' | 'complexity' | 'retention'
export interface LearningAttempt {
  kind: AttemptKind
  correct: boolean
  confidence: ConfidenceLevel
  elapsedSeconds?: number
  hintsUsed?: number
  retries?: number
}
export interface RecognitionConstraints {
  n?: number
  negativeWeights?: boolean
  unweighted?: boolean
  hasNegativeNumbers?: boolean
  dynamicUpdates?: boolean
  rangeUpdates?: boolean
  staticQueries?: boolean
  sorted?: boolean
}
export interface RecognitionAnalysis {
  clues: string[]
  shapeIds: string[]
  candidates: { patternId: string; reason: string; complexity: string }[]
  eliminated: { patternId: string; reason: string }[]
  constraintNotes: string[]
  steps: string[]
}

export interface ExecutionResult {
  testId: string
  passed: boolean
  actual?: unknown
  error?: string
}

export interface SkillCheck {
  id: string
  nodeId: string
  kind: 'trace' | 'template' | 'debug' | 'complexity'
  prompt: string
  code?: Record<LanguageId, string>
  options: string[]
  answerIndex: number
  explanation: string
}

export interface VisualizationDemo {
  patternId: string
  title: string
  description: string
  initialValues: unknown
  steps: VisualizationStep[]
}
