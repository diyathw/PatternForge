import { add } from './catalog'
add('standard-binary-search','Locate a sorted key','Given {nums,target}, where nums is strictly increasing, return the target index or -1.',
  'A sorted sequence lets one comparison discard half the active interval. Use a consistent closed interval here: both low and high are candidates. Lower bound handles duplicate-first-position queries with a different invariant.',
  'O(log n) time and O(1) space.','If present, the target is inside the closed interval [low,high].',
  ['sorted lookup','halve the candidates'],'Unsorted input has no ordered halves to discard.',
  `function solve({nums,target}) {\n  let low=0,high=nums.length-1;\n  while(low<=high){\n    const mid=low+Math.floor((high-low)/2);\n    if(nums[mid]===target) return mid;\n    if(nums[mid]<target) low=mid+1; else high=mid-1;\n  }\n  return -1;\n}`,
  `def solve(data):\n    nums, target = data['nums'], data['target']\n    low, high = 0, len(nums)-1\n    while low <= high:\n        mid = (low+high)//2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            low = mid+1\n        else:\n            high = mid-1\n    return -1`,
  [[{nums:[1,3,5,7,9],target:7},3],[{nums:[],target:3},-1],[{nums:[2],target:2},0],[{nums:[1,3],target:2},-1]],
  [['low=0, high=4 gives mid=2 and value 5. Since 5<7, discard indices 0 through 2.',{low:0,high:4,mid:2}],['Now low=3, high=4 gives mid=3. The value 7 equals the target.',{low:3,high:4,mid:3}],['Return index 3; the search terminates on equality.',{answer:3}]],
  ['Mixing closed and half-open bounds can skip the last candidate.','Every nonmatching iteration must shrink the interval.'],['lower-bound','binary-search-on-answer'])
add('stack','Validate nested brackets','Given a string containing only ()[]{}, return whether its brackets are properly nested.',
  'Nested structure closes in reverse opening order, so a last-in-first-out stack is the right state. Push openers; each closer must match the latest unmatched opener. A queue would check the oldest opener and fail on nesting.',
  'O(n) time and O(n) space.','The stack stores unmatched opening brackets in encounter order.',
  ['most recent unmatched item','nested brackets'],'FIFO processing needs a queue instead.',
  `function solve(text) {\n  const stack=[],match={')':'(',']':'[','}':'{'};\n  for(const ch of text){\n    if('([{'.includes(ch)) stack.push(ch);\n    else if(stack.pop()!==match[ch]) return false;\n  }\n  return stack.length===0;\n}`,
  `def solve(text):\n    stack = []\n    match = {')':'(', ']':'[', '}':'{'}\n    for char in text:\n        if char in '([{':\n            stack.append(char)\n        elif not stack or stack.pop() != match[char]:\n            return False\n    return not stack`,
  [['([])',true],['([)]',false],['',true],['(',false],[']',false]],
  [['Push ( and then [. The next closer must match [ because it opened last.',{stack:['(','[']}],['Read ]; pop [. The remaining unmatched opener is (.',{stack:['(']}],['Read ); pop (. The stack is empty after all input, so return true.',{stack:[],answer:true}]],
  ['Checking counts alone accepts crossing pairs such as ([)].','An empty stack on a closer is immediately invalid.'],['queue','stack-based-parentheses-matching'],'easy',['parentheses-matching'])
add('monotonic-decreasing-stack','Distance to a greater value','Given an integer array, return for each position the distance to the next strictly greater value on its right, or 0 if none exists.',
  'Keep indices whose answer is unresolved, with values in nonincreasing order. A new larger value resolves the smaller suffix of the stack. Each index is pushed once and popped at most once, giving amortized linear work despite the nested loop.',
  'O(n) time and O(n) space.','Stack indices are increasing; their values are nonincreasing and still await a greater successor.',
  ['next greater element','nearest larger on the right'],'For arbitrary range maxima, use a range-query structure rather than this one-direction successor scan.',
  `function solve(nums) {\n  const stack=[],out=Array(nums.length).fill(0);\n  for(let i=0;i<nums.length;i++){\n    while(stack.length && nums[stack.at(-1)]<nums[i]){\n      const j=stack.pop();out[j]=i-j;\n    }\n    stack.push(i);\n  }\n  return out;\n}`,
  `def solve(nums):\n    stack, out = [], [0]*len(nums)\n    for i,value in enumerate(nums):\n        while stack and nums[stack[-1]] < value:\n            j = stack.pop()\n            out[j] = i-j\n        stack.append(i)\n    return out`,
  [[[2,1,3],[2,1,0]],[[],[]],[[3,2,1],[0,0,0]],[[2,2,3],[2,1,0]]],
  [['Push indices 0 and 1 for values 2 and 1. Neither has found a greater successor.',{stack:[0,1],answer:[0,0,0]}],['Value 3 at index 2 pops index 1, then index 0. Their distances are 1 and 2.',{stack:[],answer:[2,1,0]}],['Push index 2. No later value exists, so its answer stays 0.',{stack:[2],answer:[2,1,0]}]],
  ['Using <= resolves equal values even though the query asks strictly greater.','Store indices to compute distances.'],['stack','monotonic-queue'],'medium',['next-greater-element'])
add('queue','Serve requests in arrival order','Given operations ["push",value] or ["pop"], return the popped values in order. Popping an empty queue returns null.',
  'A queue serves the oldest pending item. JavaScript can keep a head index rather than repeatedly shifting an array; Python provides deque.popleft. The simple JS array below retains processed storage until the call finishes, so long-lived queues should compact or use a ring buffer.',
  'O(m) total time and O(m) storage for m operations.','Pending entries occupy the array suffix beginning at head.',
  ['first in first out','process arrivals fairly'],'Nested last-opened work needs a stack.',
  `function solve(operations) {\n  const queue=[],out=[];let head=0;\n  for(const [op,value] of operations){\n    if(op==='push') queue.push(value);\n    else out.push(head<queue.length ? queue[head++] : null);\n  }\n  return out;\n}`,
  `from collections import deque\n\ndef solve(operations):\n    queue, out = deque(), []\n    for operation in operations:\n        if operation[0] == 'push':\n            queue.append(operation[1])\n        else:\n            out.append(queue.popleft() if queue else None)\n    return out`,
  [[[['push',4],['push',7],['pop'],['pop'],['pop']],[4,7,null]],[[],[]],[[['pop'],['push',0],['pop']],[null,0]]],
  [['Enqueue 4 then 7; head points at the oldest item, 4.',{queue:[4,7],head:0}],['Dequeue 4 by advancing head. The next served item is 7.',{queue:[7],head:1,output:[4]}],['Dequeue 7, then return null for the empty queue. Output is [4,7,null].',{queue:[],output:[4,7,null]}]],
  ['Repeated JavaScript shift can make a linear workload quadratic.','Distinguish empty from a stored falsy value such as 0.'],['bfs','stack'])
const reverseJS = `function solve(values) {
  let head=null;
  for(let i=values.length-1;i>=0;i--) head={value:values[i],next:head};
  let previous=null,current=head;
  while(current){
    const next=current.next;
    current.next=previous;
    previous=current;current=next;
  }
  const out=[];
  for(let node=previous;node;node=node.next) out.push(node.value);
  return out;
}`
const reversePY = `def solve(values):
    head = None
    for value in reversed(values):
        head = {'value': value, 'next': head}
    previous, current = None, head
    while current is not None:
        following = current['next']
        current['next'] = previous
        previous, current = current, following
    out = []
    while previous is not None:
        out.append(previous['value'])
        previous = previous['next']
    return out`
add('reverse-list','Reverse linked nodes','Given an array encoding an acyclic singly linked list, build the nodes, reverse their next pointers, and return the resulting values.',
  'A linked list stores successor references rather than adjacent array slots. Reversal redirects one edge at a time. Save the old successor before changing it, then move the previous and current cursors. Array conversion here only makes the exercise JSON-compatible; the reversal itself operates on nodes.',
  'O(n) time. Pointer reversal O(1) auxiliary space; JSON conversion and returned values use O(n).','previous heads the reversed prefix; current heads the untouched suffix.',
  ['reverse successor direction','in-place linked pointers'],'Do not mutate shared nodes unless ownership permits it; cyclic lists need separate handling.',reverseJS,reversePY,
  [[[1,2,3],[3,2,1]],[[],[]],[[9],[9]],[[2,2],[2,2]]],
  [['Save node 2, then redirect node 1 to null. previous=1, current=2.',{previous:1,current:2,links:['1→null','2→3']}],['Save node 3, then redirect node 2 to node 1. previous=2, current=3.',{previous:2,current:3,links:['2→1→null']}],['Redirect node 3 to node 2. current becomes null; the new head is node 3.',{previous:3,current:null,links:['3→2→1→null'],answer:[3,2,1]}]],
  ['Overwriting next before saving it loses the untouched suffix.','Returning the old head returns the new tail.'],['in-place-pointer-manipulation','fast-slow-pointers'])
add('fast-slow-pointers','Find the middle linked node','Given an array encoding an acyclic linked list, return its middle value, choosing the second middle for even length. Return null for empty input.',
  'Move slow one edge and fast two edges. When fast reaches the end, slow has covered half as many edges. The same speed difference detects cycles when the input can loop, but a middle query assumes an acyclic list.',
  'O(n) time. Pointer scan O(1) auxiliary space; constructing JSON-adapted nodes O(n).','After each iteration, fast has taken twice as many edges as slow, until the end limits it.',
  ['middle linked node','two traversal speeds'],'Do not seek a finite middle in a cyclic list.',
  `function solve(values) {\n  let head=null;\n  for(let i=values.length-1;i>=0;i--) head={value:values[i],next:head};\n  let slow=head,fast=head;\n  while(fast && fast.next){slow=slow.next;fast=fast.next.next;}\n  return slow ? slow.value : null;\n}`,
  `def solve(values):\n    head = None\n    for value in reversed(values):\n        head = {'value':value, 'next':head}\n    slow = fast = head\n    while fast is not None and fast['next'] is not None:\n        slow = slow['next']\n        fast = fast['next']['next']\n    return slow['value'] if slow is not None else None`,
  [[[1,2,3,4,5],3],[[1,2,3,4],3],[[],null],[[7],7]],
  [['Start both cursors at node 1. Move slow to 2 and fast to 3.',{slow:2,fast:3}],['Move slow to 3 and fast to 5. Fast has no next node, so stop.',{slow:3,fast:5}],['Return slow’s value 3; two fast edges corresponded to each slow edge.',{answer:3}]],
  ['Check fast and fast.next before taking two steps.','Starting fast at a different node changes the even-length tie rule.'],['floyds-algorithm','reverse-list'])
add('merge-intervals','Coalesce covered intervals','Given closed intervals [start,end] with start<=end, return their sorted merged coverage. Touching endpoints overlap.',
  'Sort by start. The last merged interval contains the entire overlapping chain seen so far. If the next start is within its end, extend that end; otherwise the previous interval is final. Closed versus half-open semantics determine whether touching endpoints merge.',
  'O(n log n) time, O(n) copied input/output.','Merged intervals are sorted and disjoint; only the last one can overlap a new sorted interval.',
  ['union of overlapping ranges','combine coverage'],'To count simultaneous events, use a sweep line with explicit endpoint ordering.',
  `function solve(intervals) {\n  const sorted=intervals.map(x=>[...x]).sort((a,b)=>a[0]-b[0]);\n  const out=[];\n  for(const [start,end] of sorted){\n    const last=out.at(-1);\n    if(last && start<=last[1]) last[1]=Math.max(last[1],end);\n    else out.push([start,end]);\n  }\n  return out;\n}`,
  `def solve(intervals):\n    out = []\n    for start,end in sorted(intervals):\n        if out and start <= out[-1][1]:\n            out[-1][1] = max(out[-1][1],end)\n        else:\n            out.append([start,end])\n    return out`,
  [[[[5,7],[1,3],[2,6]],[[1,7]]],[[],[]],[[[1,2],[2,3]],[[1,3]]],[[[1,8],[2,3]],[[1,8]]],[[[1,2],[4,5]],[[1,2],[4,5]]]],
  [['Sort intervals to [1,3], [2,6], [5,7]. Seed the output with [1,3].',{intervals:[[1,3],[2,6],[5,7]],merged:[[1,3]]}],['2<=3, so [2,6] overlaps. Extend the current end to 6.',{merged:[[1,6]]}],['5<=6, so extend again to 7. The single merged interval is [1,7].',{merged:[[1,7]]}]],
  ['Always take max of ends; a contained interval must not shrink coverage.','State whether touching endpoints count as overlap.'],['sweep-line','interval-scheduling'],'medium',['interval-overlap'])
export const heapJS = `class MinHeap {
  constructor(){this.a=[];}
  push(value){
    const a=this.a;a.push(value);let i=a.length-1;
    while(i>0){const p=Math.floor((i-1)/2);if(a[p]<=a[i]) break;
      [a[p],a[i]]=[a[i],a[p]];i=p;}
  }
  pop(){
    const a=this.a;if(!a.length) return null;
    const result=a[0],last=a.pop();
    if(a.length){a[0]=last;let i=0;
      while(true){let c=2*i+1;if(c>=a.length) break;
        if(c+1<a.length && a[c+1]<a[c]) c++;
        if(a[i]<=a[c]) break;[a[i],a[c]]=[a[c],a[i]];i=c;}
    }
    return result;
  }
}`
add('min-heap','Extract values by priority','Given integers, insert them into a min heap and return the sequence obtained by repeatedly extracting the minimum.',
  'A binary heap is a complete tree stored in an array. Each parent is no greater than its children. Insertion bubbles up; extraction replaces the root with the last leaf and sifts down through the smaller child. It exposes only the minimum, not a fully sorted internal array. JavaScript needs a helper; Python provides heapq.',
  'O(n log n) time with repeated insertion/extraction and O(n) storage. Bottom-up heap construction alone can be O(n).','Each parent is at most either child; therefore the root is globally minimal.',
  ['repeated smallest item','stream of priorities'],'For a one-off kth query, quickselect may avoid maintaining a heap.',
  `${heapJS}\nfunction solve(nums){const heap=new MinHeap();for(const x of nums) heap.push(x);const out=[];while(heap.a.length) out.push(heap.pop());return out;}`,
  `import heapq\n\ndef solve(nums):\n    heap = list(nums)\n    heapq.heapify(heap)\n    return [heapq.heappop(heap) for _ in range(len(heap))]`,
  [[[4,1,3],[1,3,4]],[[],[]],[[2,2,-1],[-1,2,2]]],
  [['Insert 4, then 1. Bubble 1 above 4 because the parent must be smaller.',{heap:[1,4]}],['Insert 3; its parent 1 is smaller, so it stays. Extract 1 and restore the root using 3.',{heap:[3,4],output:[1]}],['Extract 3, then 4. Every extraction returns the smallest pending value.',{heap:[],output:[1,3,4]}]],
  ['A heap array is not globally sorted.','Sift toward the smaller child in a min heap.'],['heap-based-kth-element','dijkstra'])
add('insertion-sort','Sort by growing a prefix','Given integers, return them sorted ascending using insertion sort without mutating input.',
  'Treat the prefix as sorted. Save the next key, shift larger prefix elements right, and place the key in the created hole. Strict greater-than shifting preserves the relative order of equal keys, making this version stable. It is useful for small or nearly sorted data.',
  'O(n²) worst-case time, O(n) best-case time; O(1) sorting workspace plus O(n) input copy.','Before iteration i, indices [0,i) are sorted and contain the original prefix multiset.',
  ['small or nearly sorted sequence','insert into sorted prefix'],'For large arbitrary data, use O(n log n) sorting.',
  `function solve(nums){\n  const a=[...nums];\n  for(let i=1;i<a.length;i++){\n    const key=a[i];let j=i-1;\n    while(j>=0 && a[j]>key){a[j+1]=a[j];j--;}\n    a[j+1]=key;\n  }\n  return a;\n}`,
  `def solve(nums):\n    a = list(nums)\n    for i in range(1,len(a)):\n        key, j = a[i], i-1\n        while j >= 0 and a[j] > key:\n            a[j+1] = a[j]\n            j -= 1\n        a[j+1] = key\n    return a`,
  [[[3,1,2],[1,2,3]],[[],[]],[[2,2,1],[1,2,2]],[[1,2,3],[1,2,3]]],
  [['Prefix [3] is sorted. Save key 1 and shift 3 right.',{array:[3,3,2],key:1,hole:0}],['Insert 1 at index 0, giving sorted prefix [1,3]. Next save key 2.',{array:[1,3,2],key:2}],['Shift 3 right and insert 2 after 1. The entire array is sorted.',{array:[1,2,3]}]],
  ['Save the key before shifting over its original slot.','Using >= instead of > loses stability for equal-key records.'],['merge-sort','timsort'])
