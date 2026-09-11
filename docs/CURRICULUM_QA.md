# Curriculum architecture and QA handoff

Initial curriculum inspection is complete and implementation may proceed using canonical IDs.
This is a coverage and integrity gate, not a claim that all lessons or algorithms have deep content.

## Coverage

The existing taxonomy covers every major requested track: array/hash/pointer/prefix techniques;
sorting and binary-search families; stack/queue/linked-list structures; intervals/events/heaps;
tree fundamentals and advanced decompositions; graph traversal, directed DAGs, DSU, shortest
paths, MST, SCC/low-link/Eulerian algorithms, flow and matching; recursion/backtracking,
divide-and-conquer and greedy; DP foundations, sequence/string/interval/tree/state-machine/
bitmask/digit/probability/game/optimization DP; string search and specialist suffix structures;
bits, number theory and combinatorics; range-query structures; advanced search, matrices,
offline queries, randomized techniques, geometry, games, and specialist competitive programming.

Added missing standalone **Graph** and **Linked List** foundational data-structure records.
Profile DP is searchable as an alias of Broken Profile DP. Operators, bit shifts and
set/clear/toggle/check primitives are grouped under existing concepts instead of new micro-nodes.
Kth-largest/kth-smallest are variants of their shared shape. Concepts such as DSU and fast
exponentiation remain aliases of their canonical technique. No fixed universal pattern count
is asserted. Future additions should be justified by distinct technique or learning need.

## Corrected educational errors

- Substring no longer implies sliding window: objective and monotonic validity matter.
- Palindromic substring center expansion is separated from subsequence DP with gaps.
- Weighted shortest-path candidates include 0-1 BFS, DAG relaxation and all-pairs methods.
- Dinic's O(E sqrt V) special bound requires a unit network, such as the bipartite matching
  reduction, rather than arbitrary unit-capacity graphs. [Reference](https://cp-algorithms.com/graph/dinic.html).
- Ford-Fulkerson's integer-capacity termination is distinguished from irrational capacities.
- Dijkstra is an alternative to BFS for different constraints, not an optimization of BFS.
- Fenwick trees trade dynamic-update support for query cost; they are not universally faster prefix sums.
- Shunting-yard equal-precedence handling now respects associativity.
- Binary search has O(log n) iterations, not O(log n) per iteration.
- Broken Profile DP requires bitmask DP, not SOS DP.
- Complexity heuristics no longer assume a universal operations-per-second budget.

## Integration rules and validation

All structural parent/prerequisite/problem-shape/candidate links are materialized and
deduplicated in allRelationships. Import the taxonomy index for shared graph data.
Skeletons advertise no language templates; the UI should derive authored template availability
from the content registry. Do not mark deep content complete based on taxonomy presence.

Five taxonomy tests pass: ID/type validity, all reference and candidate integrity, absence of
parent/prerequisite cycles, representative broad coverage, and educational regression guards.
TypeScript checking passes. Generated TAXONOMY.md now includes all searchable shape mappings,
constraint reasoning and a range-query comparison table in addition to the node catalogue.

Remaining work belongs to implementation/content QA: executing JS and Python solutions,
checking every trace transition and complexity explanation, learner persistence and responsive
navigation. Specialist skeletons intentionally remain lighter than core authored lessons.
