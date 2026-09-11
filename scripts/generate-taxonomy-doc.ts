/**
 * Regenerates docs/TAXONOMY.md from src/data/taxonomy/. Never hand-edit that file.
 * Run: npx tsx scripts/generate-taxonomy-doc.ts
 */
import { writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  allComplexityHeuristics,
  allNodes,
  allProblemShapes,
  allRelationships,
} from "../src/data/taxonomy/index"
import type { KnowledgeNode } from "../src/types/domain"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, "../docs/TAXONOMY.md")

function statusBadge(status: KnowledgeNode["contentStatus"]): string {
  return { skeleton: "○", "in-progress": "◐", complete: "●" }[status]
}

function renderCategory(category: string, nodes: KnowledgeNode[]): string {
  const rows = nodes
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (n) =>
        `| ${statusBadge(n.contentStatus)} | \`${n.id}\` | ${n.name} | ${n.type} | ${n.difficulty} | ${n.interviewFrequency} |`,
    )
    .join("\n")
  return `### ${category}\n\n| | id | name | type | difficulty | interview frequency |\n|---|---|---|---|---|---|\n${rows || "| | _none yet_ | | | | |"}\n`
}

function generate(): string {
  const categories = Array.from(new Set(allNodes.map((n) => n.category))).sort()
  const total = allNodes.length
  const complete = allNodes.filter((n) => n.contentStatus === "complete").length
  const skeleton = allNodes.filter((n) => n.contentStatus === "skeleton").length

  const categorySections =
    categories.length > 0
      ? categories
          .map((c) => renderCategory(c, allNodes.filter((n) => n.category === c)))
          .join("\n")
      : "_No taxonomy nodes yet — populated in Phase 1._\n"

  return `# Taxonomy

Generated from \`src/data/taxonomy/\` by \`scripts/generate-taxonomy-doc.ts\`. Do not hand-edit.

Legend: ○ skeleton · ◐ in-progress · ● complete

- **${total}** total nodes (**${complete}** complete, **${skeleton}** skeleton)
- **${allProblemShapes.length}** problem shapes
- **${allRelationships.length}** relationships
- **${allComplexityHeuristics.length}** complexity heuristics

${categorySections}
## Problem-shape recognition database

Each row is a separate problem shape, with candidate approaches narrowed by constraints.

| Shape | Candidates | Constraint reasoning |
|---|---|---|
${allProblemShapes.map(shape => `| ${shape.name} (\`${shape.id}\`) | ${shape.candidatePatternIds.join(", ")} | ${shape.disambiguation.replaceAll("|", "\\|")} |`).join("\n")}

## Curriculum QA

The taxonomy is expandable; these counts are a snapshot, not an official number of patterns.
Aliases and parent links keep synonyms and variants connected. Every candidate approach,
parent, prerequisite and problem-shape reference is validated by taxonomy.test.ts.
Skeleton entries advertise no templates. Actual template availability must be checked
against the deep-content registry as authored lessons become available.

Educational corrections include separate substring/subsequence palindrome reasoning,
non-universal sliding-window recognition, and correct flow algorithm assumptions.
Dinic's O(E sqrt V) bound applies to unit networks such as bipartite matching reductions,
not arbitrary unit-capacity graphs. See [the algorithm reference](https://cp-algorithms.com/graph/dinic.html).

## Range-query selection

| Technique | Updates | Queries | Static/dynamic | Complexity |
|---|---|---|---|---|
| Prefix sum | Rebuild after arbitrary changes | Range sum | Static | O(n) build, O(1) query |
| Difference array | Batch range addition | Materialize final values | Offline | O(1) update, O(n) reconstruction |
| Fenwick tree | Point addition; range variants with differences | Prefix/range sum | Dynamic | O(log n) update/query, O(n) storage |
| Segment tree | Point assignment/update | Associative range aggregate | Dynamic | O(n) build, O(log n) update/query |
| Lazy segment tree | Compatible range updates | Range aggregate | Dynamic | O(log n) update/query with composable lazy tags |
| Sparse table | Rebuild | Static idempotent min/max/gcd | Static | O(n log n) build/space, O(1) idempotent query |
| Square-root decomposition | Point updates, block-aware variants | Range aggregate | Dynamic | Typically O(sqrt n) query; update depends on aggregate |
| Mo's algorithm | Offline variants support modifications | Reorder range queries with cheap add/remove | Offline | Typical O((n+q)sqrt n) add/remove operations |
| Ordered set | Insert/delete | Order, predecessor/successor | Dynamic | Balanced-tree O(log n); rank requires augmentation |
| Coordinate compression | Usually preprocess known keys | Rank mapping | Usually offline | O(n log n) preprocessing; does not itself answer aggregates |
`
}

writeFileSync(outPath, generate())
console.log(`Wrote ${outPath}`)
