/**
 * Aggregation point for the full taxonomy. Owned by Agent 1 (+ integrated by Agent 0).
 *
 * Individual category files (e.g. `arraysHashingNodes.ts`, `graphsNodes.ts`,
 * `strategiesAndDPNodes.ts`) each export their own `KnowledgeNode[]`/`ProblemShape[]`
 * and are re-exported here so the rest of the app (and
 * `scripts/generate-taxonomy-doc.ts`) has one place to import the whole graph from.
 * Do not import individual category files from outside `src/data/taxonomy/` —
 * always import from this index.
 */
import type {
  ComplexityHeuristic,
  KnowledgeNode,
  ProblemShape,
  Relationship,
} from "../../types/domain"

import { nodes as foundationalConceptsNodes } from "./foundationalConcepts"
import { nodes as arraysHashingNodes } from "./arraysHashingNodes"
import { problemShapes as arraysHashingProblemShapes } from "./arraysHashingProblemShapes"
import { nodes as sortingSearchingStacksListsNodes } from "./sortingSearchingStacksListsNodes"
import { nodes as intervalsHeapsTreesNodes } from "./intervalsHeapsTreesNodes"
import { problemShapes as intervalsHeapsTreesProblemShapes } from "./intervalsHeapsTreesProblemShapes"
import { nodes as graphsNodes } from "./graphsNodes"
import { problemShapes as graphsProblemShapes } from "./graphsProblemShapes"
import { nodes as strategiesAndDPNodes } from "./strategiesAndDPNodes"
import { problemShapes as strategiesAndDPProblemShapes } from "./strategiesAndDPProblemShapes"
import { nodes as stringsMathNodes } from "./stringsMathNodes"
import { problemShapes as stringsMathProblemShapes } from "./stringsMathProblemShapes"
import { nodes as advancedCPNodes } from "./advancedCPNodes"
import { problemShapes as advancedCPProblemShapes } from "./advancedCPProblemShapes"
import { heuristics as advancedCPComplexityHeuristics } from "./advancedCPComplexityHeuristics"
import { relationships } from "./relationships"

export const allNodes: KnowledgeNode[] = [
  ...foundationalConceptsNodes,
  ...arraysHashingNodes,
  ...sortingSearchingStacksListsNodes,
  ...intervalsHeapsTreesNodes,
  ...graphsNodes,
  ...strategiesAndDPNodes,
  ...stringsMathNodes,
  ...advancedCPNodes,
]

export const allProblemShapes: ProblemShape[] = [
  ...arraysHashingProblemShapes,
  ...intervalsHeapsTreesProblemShapes,
  ...graphsProblemShapes,
  ...strategiesAndDPProblemShapes,
  ...stringsMathProblemShapes,
  ...advancedCPProblemShapes,
]

export const allRelationships: Relationship[] = relationships

export const allComplexityHeuristics: ComplexityHeuristic[] = advancedCPComplexityHeuristics

/** Lookup map of every node/problem-shape id -> its node, for validation and UI use. */
export const nodeById: ReadonlyMap<string, KnowledgeNode> = new Map(
  [...allNodes, ...allProblemShapes].map((n) => [n.id, n]),
)
