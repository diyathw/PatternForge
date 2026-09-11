import { add } from './catalog'
const treeCases: [unknown,unknown][] = [[{value:1,left:{value:2,left:null,right:null},right:{value:3,left:null,right:null}},[1,2,3]],[null,[]],[{value:4,left:null,right:null},[4]]]
add('tree-dfs','Preorder through a tree','Given a binary tree encoded as {value,left,right} or null, return preorder values: root, left subtree, right subtree.',
  'Depth-first traversal finishes a branch before moving to a sibling. An explicit stack avoids language recursion limits. Push right before left so the left child is popped first. Preorder acts before children; inorder acts between them; postorder acts after them.',
  'O(n) time, O(h) pending stack space for a binary tree of height h, plus output.','The stack holds roots of unfinished subtrees; its top is visited next.',
  ['explore tree branches','root before descendants'],'For nearest depth or level grouping, BFS is more natural.',
  `function solve(root){\n  const out=[],stack=root ? [root] : [];\n  while(stack.length){\n    const node=stack.pop();out.push(node.value);\n    if(node.right) stack.push(node.right);\n    if(node.left) stack.push(node.left);\n  }\n  return out;\n}`,
  `def solve(root):\n    out, stack = [], [root] if root else []\n    while stack:\n        node = stack.pop()\n        out.append(node['value'])\n        if node.get('right'):\n            stack.append(node['right'])\n        if node.get('left'):\n            stack.append(node['left'])\n    return out`,treeCases,
  [['Visit root 1, then push 3 followed by 2 so 2 is next.',{stack:[3,2],output:[1]}],['Pop and visit leaf 2. Its subtree is complete; next pop 3.',{stack:[3],output:[1,2]}],['Visit leaf 3. No unfinished subtrees remain; return [1,2,3].',{stack:[],output:[1,2,3]}]],
  ['Pushing left first visits right first with a LIFO stack.','A graph may contain cycles; tree traversal alone assumes a tree.'],['tree-bfs','postorder-traversal'])
add('tree-bfs','Read a tree one level at a time','Given a binary tree encoded as {value,left,right} or null, return values grouped by depth from the root.',
  'Breadth-first traversal keeps a FIFO frontier. Snapshot its current size to isolate one level before enqueueing children. A head index makes a JavaScript queue efficient; Python deque handles removal from the left directly.',
  'O(n) time. Python frontier O(w); this JS retained-array queue O(n). Output O(n).','At the start of each level, the pending frontier consists exactly of nodes at that depth.',
  ['level order','distance from root'],'For postorder aggregation use DFS or an explicit postorder stack.',
  `function solve(root){\n  const queue=root ? [root] : [],out=[];let head=0;\n  while(head<queue.length){\n    const end=queue.length,level=[];\n    while(head<end){\n      const node=queue[head++];level.push(node.value);\n      if(node.left) queue.push(node.left);\n      if(node.right) queue.push(node.right);\n    }\n    out.push(level);\n  }\n  return out;\n}`,
  `from collections import deque\n\ndef solve(root):\n    queue, out = deque([root] if root else []), []\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node['value'])\n            for child in (node.get('left'),node.get('right')):\n                if child:\n                    queue.append(child)\n        out.append(level)\n    return out`,
  [[treeCases[0][0],[[1],[2,3]]],[null,[]],[treeCases[2][0],[[4]]]],
  [['Frontier contains root 1. Snapshot size 1, visit it, and enqueue 2 and 3.',{queue:[2,3],levels:[[1]]}],['Snapshot size 2. Visit both leaves before starting another level.',{queue:[],levels:[[1],[2,3]]}],['The queue is empty. Return two levels: [[1],[2,3]].',{answer:[[1],[2,3]]}]],
  ['Using a growing queue length as the level boundary mixes depths.','Repeated shift on JavaScript arrays can be expensive.'],['queue','tree-dfs'])
add('dfs','Find reachable vertices','Given {adj,start}, with adj an adjacency list for vertices 0..n-1 and a valid start, return reachable vertex IDs in ascending order. Directed edges are followed as listed.',
  'DFS explores a branch using a stack. Mark a vertex when scheduling it so cycles and converging edges do not repeatedly add it. A final ascending scan makes the returned reachable set deterministic; it is not the DFS visit order.',
  'O(V+E) time, O(V) auxiliary space.','Every scheduled vertex is marked, and every marked vertex is reachable from start.',
  ['reachability','explore a component'],'DFS does not in general find minimum unweighted distances.',
  `function solve({adj,start}){\n  const seen=Array(adj.length).fill(false),stack=[start];seen[start]=true;\n  while(stack.length){\n    const u=stack.pop();\n    for(const v of adj[u]) if(!seen[v]){seen[v]=true;stack.push(v);}\n  }\n  return seen.flatMap((yes,i)=>yes ? [i] : []);\n}`,
  `def solve(data):\n    adj, start = data['adj'], data['start']\n    seen, stack = {start}, [start]\n    while stack:\n        u = stack.pop()\n        for v in adj[u]:\n            if v not in seen:\n                seen.add(v)\n                stack.append(v)\n    return [v for v in range(len(adj)) if v in seen]`,
  [[{adj:[[1],[2],[0],[]],start:0},[0,1,2]],[{adj:[[]],start:0},[0]],[{adj:[[1,1],[]],start:0},[0,1]]],
  [['Mark 0 and push it. Pop 0, discover 1, and mark 1 before pushing.',{stack:[1],seen:[0,1]}],['Pop 1 and discover 2. Next explore 2.',{stack:[2],seen:[0,1,2]}],['2 leads back to marked 0, so skip it. Vertex 3 is unreachable; return [0,1,2].',{stack:[],answer:[0,1,2]}]],
  ['Without visited state a cycle can loop forever.','Reachability output order is a contract separate from exploration order.'],['bfs','union-find'],'easy',['connected-groups'])
add('bfs','Minimum number of edges','Given {adj,start}, return the minimum edge count from start to each vertex, or null for unreachable vertices. All edges have unit cost.',
  'FIFO layers process all distance-d vertices before distance d+1. The first discovery therefore gives a shortest unweighted path length. Mark on enqueue, not on dequeue. Weighted edges break this layer-cost equivalence unless all have equal cost.',
  'O(V+E) time and O(V) auxiliary space.','Each enqueued vertex has its final minimum edge count.',
  ['minimum unweighted steps','unit edge cost'],'Use 0-1 BFS for weights 0/1; Dijkstra for nonnegative weights; consider Bellman-Ford for negative edges.',
  `function solve({adj,start}){\n  const distance=Array(adj.length).fill(null),queue=[start];distance[start]=0;\n  for(let head=0;head<queue.length;head++){\n    const u=queue[head];\n    for(const v of adj[u]) if(distance[v]===null){distance[v]=distance[u]+1;queue.push(v);}\n  }\n  return distance;\n}`,
  `from collections import deque\n\ndef solve(data):\n    adj, start = data['adj'], data['start']\n    distance = [None]*len(adj)\n    distance[start] = 0\n    queue = deque([start])\n    while queue:\n        u = queue.popleft()\n        for v in adj[u]:\n            if distance[v] is None:\n                distance[v] = distance[u]+1\n                queue.append(v)\n    return distance`,
  [[{adj:[[1,2],[3],[3],[],[]],start:0},[0,1,1,2,null]],[{adj:[[]],start:0},[0]],[{adj:[[1],[0]],start:0},[0,1]]],
  [['Visit 0 at distance 0; discover 1 and 2 at distance 1.',{queue:[1,2],distance:[0,1,1,null,null]}],['Process 1 and discover 3 at distance 2. Processing 2 cannot improve already discovered 3.',{queue:[3],distance:[0,1,1,2,null]}],['Process 3 and finish. Vertex 4 is unreachable, so its distance remains null.',{distance:[0,1,1,2,null]}]],
  ['Weighted shortest paths cannot generally use ordinary BFS.','Enqueueing a vertex repeatedly wastes time and can corrupt parent choices.'],['dfs','dijkstra'],'easy',['minimum-unweighted-steps'])
add('island-problems','Count land components','Given a rectangular matrix of 0 and 1, count groups of 1 connected through four orthogonal neighbors. Empty matrices are allowed; diagonal contact does not connect.',
  'The grid implicitly defines a graph. Start a flood fill at each unvisited land cell; one fill consumes exactly one island. Static counting admits either DFS or BFS. If land is added repeatedly and counts are queried online, DSU avoids reflooding the entire grid.',
  'O(rows × cols) time and space for visited cells and the explicit stack.','When a flood fill finishes, every cell connected to its seed has been marked.',
  ['islands in a grid','orthogonal connected regions'],'Dynamic deletions are harder than additions and need more than ordinary DSU.',
  `function solve(grid){\n  const rows=grid.length,cols=grid[0]?.length ?? 0,seen=new Set();let count=0;\n  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){\n    const key=r*cols+c;if(grid[r][c]!==1 || seen.has(key)) continue;\n    count++;seen.add(key);const stack=[[r,c]];\n    while(stack.length){\n      const [x,y]=stack.pop();\n      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){\n        const a=x+dx,b=y+dy,k=a*cols+b;\n        if(a>=0 && a<rows && b>=0 && b<cols && grid[a][b]===1 && !seen.has(k)){seen.add(k);stack.push([a,b]);}\n      }\n    }\n  }\n  return count;\n}`,
  `def solve(grid):\n    rows, cols = len(grid), len(grid[0]) if grid else 0\n    seen, count = set(), 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] != 1 or (r,c) in seen:\n                continue\n            count += 1\n            seen.add((r,c))\n            stack = [(r,c)]\n            while stack:\n                x,y = stack.pop()\n                for a,b in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):\n                    if 0 <= a < rows and 0 <= b < cols and grid[a][b] == 1 and (a,b) not in seen:\n                        seen.add((a,b))\n                        stack.append((a,b))\n    return count`,
  [[[[1,1,0],[0,0,1],[1,0,1]],3],[[],0],[[[0,0]],0],[[[1,0],[0,1]],2],[[[1,1],[1,1]],1]],
  [['Seed (0,0) and flood to (0,1). Mark the first island before looking for another seed.',{visited:[[0,0],[0,1]],count:1}],['The next unvisited land is (1,2); flood to (2,2). Count becomes 2.',{visited:[[0,0],[0,1],[1,2],[2,2]],count:2}],['Cell (2,0) is isolated by water. Count it as island 3 and finish.',{count:3}]],
  ['Accidentally adding diagonal neighbors changes the definition.','Mark when pushing to avoid duplicate pending cells.'],['flood-fill','union-find'],'medium',['island-problems'])
add('topological-sort','Schedule prerequisites','Given {n,edges}, where [u,v] means u must precede v, return Kahn’s FIFO topological order, initially queueing zero-indegree IDs in ascending order. Return [] if a cycle prevents completing all vertices.',
  'Only a vertex with no remaining prerequisites is safe to schedule. Removing it decrements the indegrees of its outgoing neighbors. If the queue empties early, the remaining directed graph contains a cycle. Many valid orders may exist; this exercise defines a deterministic queue policy.',
  'O(V+E) time and space.','Indegree equals the number of incoming edges from unscheduled vertices.',
  ['dependencies before tasks','directed acyclic ordering'],'Undirected connectivity is not a topological ordering problem.',
  `function solve({n,edges}){\n  const adj=Array.from({length:n},()=>[]),degree=Array(n).fill(0);\n  for(const [u,v] of edges){adj[u].push(v);degree[v]++;}\n  const queue=[];for(let i=0;i<n;i++) if(degree[i]===0) queue.push(i);\n  for(let head=0;head<queue.length;head++) for(const v of adj[queue[head]]) if(--degree[v]===0) queue.push(v);\n  return queue.length===n ? queue : [];\n}`,
  `from collections import deque\n\ndef solve(data):\n    n = data['n']\n    adj, degree = [[] for _ in range(n)], [0]*n\n    for u,v in data['edges']:\n        adj[u].append(v)\n        degree[v] += 1\n    queue = deque(i for i in range(n) if degree[i] == 0)\n    out = []\n    while queue:\n        u = queue.popleft()\n        out.append(u)\n        for v in adj[u]:\n            degree[v] -= 1\n            if degree[v] == 0:\n                queue.append(v)\n    return out if len(out) == n else []`,
  [[{n:4,edges:[[0,2],[1,2],[2,3]]},[0,1,2,3]],[{n:2,edges:[[0,1],[1,0]]},[]],[{n:3,edges:[]},[0,1,2]],[{n:1,edges:[[0,0]]},[]]],
  [['Indegrees are [0,0,2,1]. Queue 0 and 1 because neither has prerequisites.',{indegree:[0,0,2,1],queue:[0,1]}],['Remove 0 then 1. Node 2’s indegree drops from 2 to 0, so enqueue it.',{indegree:[0,0,0,1],queue:[2],order:[0,1]}],['Remove 2, unlock 3, then remove 3. All four tasks are scheduled.',{indegree:[0,0,0,0],order:[0,1,2,3]}]],
  ['A partial order is not a successful result when a cycle remains.','Interpret edge direction from the specification.'],['kahns-algorithm','dfs-topological-sort'],'medium',['dependency-problems'])
export const dsuJS = `class DSU {
  constructor(n){this.parent=Array.from({length:n},(_,i)=>i);this.size=Array(n).fill(1);this.count=n;}
  find(x){while(x!==this.parent[x]){this.parent[x]=this.parent[this.parent[x]];x=this.parent[x];}return x;}
  union(a,b){a=this.find(a);b=this.find(b);if(a===b)return false;
    if(this.size[a]<this.size[b]) [a,b]=[b,a];
    this.parent[b]=a;this.size[a]+=this.size[b];this.count--;return true;}
}`
const dsuPY = `class DSU:
    def __init__(self,n):
        self.parent = list(range(n))
        self.size = [1]*n
        self.count = n
    def find(self,x):
        while x != self.parent[x]:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    def union(self,a,b):
        a,b = self.find(a),self.find(b)
        if a == b:
            return False
        if self.size[a] < self.size[b]:
            a,b = b,a
        self.parent[b] = a
        self.size[a] += self.size[b]
        self.count -= 1
        return True`
add('union-find','Track merging components','Given {n,edges}, process undirected edges [u,v] in order and return the number of connected components after each insertion. Vertices are 0..n-1.',
  'Disjoint-set union represents each component by a root. Union links different roots, while path compression and union by size keep future finds shallow. A repeated edge or self-loop changes no component count. DSU answers connectivity, not actual paths, and basic DSU does not support deletions.',
  'O((V+E) α(V)) amortized time, O(V) structure space plus output.','Every set root represents exactly one component; union reduces the count only for different roots.',
  ['incremental undirected connectivity','merge groups'],'For shortest paths or arbitrary edge deletion, use a different method.',
  `${dsuJS}\nfunction solve({n,edges}){const dsu=new DSU(n);return edges.map(([u,v])=>{dsu.union(u,v);return dsu.count;});}`,
  `${dsuPY}\n\ndef solve(data):\n    dsu = DSU(data['n'])\n    out = []\n    for u,v in data['edges']:\n        dsu.union(u,v)\n        out.append(dsu.count)\n    return out`,
  [[{n:4,edges:[[0,1],[2,3],[1,2],[0,3]]},[3,2,1,1]],[{n:2,edges:[[0,0],[0,1],[0,1]]},[2,1,1]],[{n:0,edges:[]},[]]],
  [['Union 0 with 1 and 2 with 3. Two merges reduce four components to two.',{parent:[0,0,2,2],count:2}],['Union 1 with 2: their roots differ, so connect the two size-2 components.',{parent:[0,0,0,2],count:1}],['Edge 0–3 joins vertices already connected. Compression may shorten parent links, but count remains 1.',{parent:[0,0,0,0],count:1,answer:[3,2,1,1]}]],
  ['Decrementing count on every edge mishandles redundant edges.','Link roots, not arbitrary internal vertices.'],['path-compression','kruskal'],'medium',['connected-groups'])
add('kruskal','Cheapest spanning forest','Given {n,edges}, with undirected weighted edges [u,v,w], return the total weight of a minimum spanning forest including every vertex. Disconnected input is allowed.',
  'Sort edges by weight and accept an edge exactly when it connects different DSU components. The cut property justifies choosing a lightest crossing edge. Negative weights are valid here: MST does not share Dijkstra’s nonnegative-weight restriction. A disconnected graph produces a forest.',
  'O(E log E + V) time and O(V+E) storage.','Accepted edges are acyclic and can be extended to a minimum spanning forest.',
  ['connect all vertices cheaply','undirected total edge cost'],'A shortest-path tree optimizes distances from one source, which is a different objective.',
  `${dsuJS}\nfunction solve({n,edges}){const dsu=new DSU(n);let total=0;for(const [u,v,w] of [...edges].sort((a,b)=>a[2]-b[2])) if(dsu.union(u,v)) total+=w;return total;}`,
  `${dsuPY}\n\ndef solve(data):\n    dsu = DSU(data['n'])\n    total = 0\n    for u,v,w in sorted(data['edges'],key=lambda edge:edge[2]):\n        if dsu.union(u,v):\n            total += w\n    return total`,
  [[{n:3,edges:[[0,1,4],[1,2,1],[0,2,2]]},3],[{n:4,edges:[[0,1,-2],[2,3,5]]},3],[{n:2,edges:[]},0]],
  [['Sort weights 1,2,4. Accept edge 1–2 of weight 1 because its roots differ.',{accepted:[[1,2,1]],total:1}],['Accept edge 0–2 of weight 2; all three vertices are now connected.',{accepted:[[1,2,1],[0,2,2]],total:3}],['Reject edge 0–1 of weight 4 because it closes a cycle. Return weight 3.',{rejected:[[0,1,4]],total:3}]],
  ['Adding an edge inside one component creates a cycle.','Do not confuse minimum total tree weight with minimum source distances.'],['union-find','prim'],'medium')
add('dijkstra','Nonnegative weighted routes','Given {n,edges,start}, with directed edges [u,v,w] and w>=0, return shortest distances from start, using null for unreachable vertices. This exercise uses the dense O(V²) implementation.',
  'Repeatedly finalize the unvisited vertex with smallest tentative distance, then relax its outgoing edges. Nonnegative weights ensure a later path cannot improve a finalized vertex. The array-scan version is simple and suited to dense graphs. For sparse graphs, a heap gives O((V+E) log V), with stale-entry checks. Negative edges require a different algorithm such as Bellman-Ford; DAGs admit topological relaxation even with negative edges.',
  'O(V²+E) time and O(V+E) space for this dense implementation.','Every finalized vertex has its true shortest distance; tentative values are upper bounds.',
  ['minimum weighted path','nonnegative edges'],'Negative edges invalidate the finalization proof; unit edges favor BFS.',
  `function solve({n,edges,start}){\n  const adj=Array.from({length:n},()=>[]),dist=Array(n).fill(Infinity),done=Array(n).fill(false);\n  for(const [u,v,w] of edges) adj[u].push([v,w]);dist[start]=0;\n  for(let iteration=0;iteration<n;iteration++){\n    let u=-1;for(let v=0;v<n;v++) if(!done[v] && (u<0 || dist[v]<dist[u])) u=v;\n    if(u<0 || dist[u]===Infinity) break;done[u]=true;\n    for(const [v,w] of adj[u]) if(dist[u]+w<dist[v]) dist[v]=dist[u]+w;\n  }\n  return dist.map(x=>x===Infinity ? null : x);\n}`,
  `def solve(data):\n    n, start = data['n'], data['start']\n    adj = [[] for _ in range(n)]\n    for u,v,w in data['edges']:\n        adj[u].append((v,w))\n    distance, done = [float('inf')]*n, [False]*n\n    distance[start] = 0\n    for _ in range(n):\n        u = min((v for v in range(n) if not done[v]),key=lambda v:distance[v],default=-1)\n        if u < 0 or distance[u] == float('inf'):\n            break\n        done[u] = True\n        for v,w in adj[u]:\n            distance[v] = min(distance[v],distance[u]+w)\n    return [None if d == float('inf') else d for d in distance]`,
  [[{n:4,edges:[[0,1,5],[0,2,1],[2,1,2],[1,3,1]],start:0},[0,3,1,4]],[{n:3,edges:[[0,1,0]],start:0},[0,0,null]],[{n:1,edges:[],start:0},[0]]],
  [['Finalize source 0. Relax edges to get tentative distances [0,5,1,∞]. Next choose vertex 2.',{distances:[0,5,1,null],finalized:[0]}],['Finalize 2 at cost 1; its edge improves vertex 1 from 5 to 3.',{distances:[0,3,1,null],finalized:[0,2]}],['Finalize 1 at 3 and relax vertex 3 to 4. Finalize 3 and return [0,3,1,4].',{distances:[0,3,1,4],finalized:[0,2,1,3]}]],
  ['A vertex is finalized by minimum tentative distance, not first discovery.','Do not apply the nonnegative-weight proof to negative edges.'],['bfs','bellman-ford','min-heap'],'medium',['weighted-shortest-path'])
