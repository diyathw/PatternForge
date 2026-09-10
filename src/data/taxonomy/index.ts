/**
 * Aggregation point for the full taxonomy. Owned by Agent 1.
 *
 * Individual category files (e.g. `arrays.ts`, `graphs.ts`, `dynamicProgramming.ts`)
 * each export their own `KnowledgeNode[]`/`ProblemShape[]` and are re-exported here
 * so the rest of the app (and `scripts/generate-taxonomy-doc.ts`) has one place to
 * import the whole graph from. Do not import individual category files from outside
 * `src/data/taxonomy/` — always import from this index.
 */
import type {
  ComplexityHeuristic,
  KnowledgeNode,
  ProblemShape,
  Relationship,
} from "../../types/domain"

// Populated in Phase 1 — each spread should list every category file's export,
// e.g. `...arrayPatterns.nodes, ...graphAlgorithms.nodes, ...`
export const allNodes: KnowledgeNode[] = []

export const allProblemShapes: ProblemShape[] = []

export const allRelationships: Relationship[] = []

export const allComplexityHeuristics: ComplexityHeuristic[] = []
