import { describe, expect, it } from "vitest"
import { allNodes, allProblemShapes, allRelationships, allComplexityHeuristics, nodeById } from "./index"

const nodes = [...allNodes, ...allProblemShapes]
describe("curriculum integrity", () => {
  it("uses unique canonical IDs and separate problem-shape records", () => {
    expect(new Set(nodes.map(n => n.id)).size).toBe(nodes.length)
    for (const node of nodes) {
      expect(node.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(node.recognitionClues.length, node.id).toBeGreaterThan(0)
    }
    expect(allNodes.every(n => n.type !== "problem-shape")).toBe(true)
    expect(allProblemShapes.every(n => n.type === "problem-shape")).toBe(true)
  })
  it("resolves every edge, parent, prerequisite and candidate", () => {
    const shapes = new Set(allProblemShapes.map(n => n.id))
    for (const node of nodes) {
      for (const id of [node.parent, ...(node.prerequisites ?? [])].filter(Boolean))
        expect(nodeById.has(id!), `${node.id} -> ${id}`).toBe(true)
      for (const id of node.commonProblemShapes ?? []) expect(shapes.has(id), `${node.id} shape ${id}`).toBe(true)
    }
    for (const shape of allProblemShapes) {
      expect(shape.candidatePatternIds.length, shape.id).toBeGreaterThan(0)
      expect(shape.disambiguation.length, shape.id).toBeGreaterThan(40)
      for (const id of shape.candidatePatternIds) {
        expect(nodeById.has(id), `${shape.id} candidate ${id}`).toBe(true)
        expect(nodeById.get(id)?.type).not.toBe("problem-shape")
        expect(allRelationships.some(e => e.from === shape.id && e.to === id && e.relation === "commonly-solved-by")).toBe(true)
      }
    }
    for (const edge of allRelationships) {
      expect(nodeById.has(edge.from), edge.from).toBe(true)
      expect(nodeById.has(edge.to), edge.to).toBe(true)
      expect(edge.from).not.toBe(edge.to)
    }
    expect(new Set(allRelationships.map(e => `${e.from}:${e.relation}:${e.to}`)).size).toBe(allRelationships.length)
  })
  it("has acyclic parent hierarchy and prerequisite learning order", () => {
    for (const field of ["parent", "prerequisites"] as const) {
      const done = new Set<string>()
      const visit = (id: string, ancestors: string[]) => {
        expect(ancestors, `${field} cycle: ${[...ancestors, id].join(" -> ")}`).not.toContain(id)
        if (done.has(id)) return
        const node = nodeById.get(id)!
        for (const next of field === "parent" ? (node.parent ? [node.parent] : []) : node.prerequisites ?? []) visit(next, [...ancestors, id])
        done.add(id)
      }
      nodes.forEach(n => visit(n.id, []))
    }
  })
  it("keeps broad specialist coverage alongside core and distinct shapes", () => {
    for (const id of ["hash-map", "linked-list", "graph", "two-pointers", "dijkstra", "dinic", "tarjan-scc", "aho-corasick", "suffix-automaton", "fenwick-tree", "lazy-segment-tree", "heavy-light-decomposition", "centroid-decomposition", "digit-dp", "broken-profile-dp", "convex-hull", "li-chao-tree", "dsu-rollback", "chinese-remainder-theorem", "sprague-grundy-theorem"])
      expect(nodeById.has(id), id).toBe(true)
    expect(nodeById.get("anagram")?.type).toBe("problem-shape")
    expect(nodeById.get("hash-map")?.type).toBe("data-structure")
    expect(nodeById.get("greedy")?.type).toBe("strategy")
    expect(allComplexityHeuristics).toHaveLength(6)
    for (const heuristic of allComplexityHeuristics) expect(heuristic.caveat).toContain("heuristic")
  })
  it("retains educational caveats instead of universal keyword rules", () => {
    const shape = (id: string) => allProblemShapes.find(n => n.id === id)!
    expect(shape("substring").disambiguation).toContain("not a particular algorithm")
    expect(shape("palindrome").disambiguation).toContain("permits gaps")
    expect(shape("weighted-shortest-path").candidatePatternIds).toContain("dag-shortest-path")
    expect(nodeById.get("dinic")?.complexityNotes).toContain("unit networks")
    expect(allRelationships.some(e => e.from === "dijkstra" && e.to === "bfs" && e.relation === "optimization-of")).toBe(false)
  })
})
