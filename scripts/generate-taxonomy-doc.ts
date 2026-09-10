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
`
}

writeFileSync(outPath, generate())
console.log(`Wrote ${outPath}`)
