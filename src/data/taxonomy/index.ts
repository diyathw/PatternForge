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

// Materialize structural references so the visual graph and learning order share
// the same edges as the searchable records, without duplicate parallel edges.
const structuralRelationships: Relationship[] = [...allNodes, ...allProblemShapes].flatMap((node) => [
  ...(node.parent ? [{ from: node.id, to: node.parent, relation: "variant-of" as const }] : []),
  ...(node.prerequisites ?? []).map((id) => ({ from: id, to: node.id, relation: "prerequisite-of" as const })),
  ...(node.commonProblemShapes ?? []).map((id) => ({ from: node.id, to: id, relation: "useful-for" as const })),
])
const shapeRelationships: Relationship[] = allProblemShapes.flatMap((shape) =>
  shape.candidatePatternIds.map((id) => ({ from: shape.id, to: id, relation: "commonly-solved-by" as const })),
)
export const allRelationships: Relationship[] = [...new Map(
  [...relationships, ...structuralRelationships, ...shapeRelationships].map((edge) =>
    [`${edge.from}:${edge.relation}:${edge.to}`, edge] as const),
).values()]

export const allComplexityHeuristics: ComplexityHeuristic[] = advancedCPComplexityHeuristics

/** Lookup map of every node/problem-shape id -> its node, for validation and UI use. */
export const nodeById: ReadonlyMap<string, KnowledgeNode> = new Map(
  [...allNodes, ...allProblemShapes].map((n) => [n.id, n]),
)
