import { add } from './catalog'
const pairJS = `function solve({nums, target}) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
    seen.set(nums[i], i);
  }
  return [];
}`
const pairPY = `def solve(data):
    seen = {}
    for i, value in enumerate(data['nums']):
        complement = data['target'] - value
        if complement in seen:
            return [seen[complement], i]
        seen[value] = i
    return []`
for (const id of ['hash-map','pair-sum']) add(id,'Find a complementary pair',
  'Given {nums, target}, return indices of the first pair found while scanning left to right, checking previously seen values. Return [] if none exists. Indices must differ.',
  'A hash map associates keys with values. Here a previously seen number is the key and its latest index is the value. Rearrange a + b = target into a lookup for target − b. Checking before inserting prevents using the current item twice. Sorting plus two pointers is an alternative when you can reorder values; preserve original indices if needed.',
  'Expected O(n) time, O(n) space with hash lookup. Hash performance is not a worst-case constant-time guarantee.',
  'The map contains only earlier indices; every successful lookup creates a pair of distinct positions.',
  ['pair adds to target','need original indices','fast key lookup'], 'For sorted input, opposite pointers can use O(1) auxiliary space.',pairJS,pairPY,
  [[{nums:[2,7,11,15],target:9},[0,1]],[{nums:[3,3],target:6},[0,1]],[{nums:[],target:0},[]],[{nums:[2],target:4},[]],[{nums:[-3,5,2],target:2},[0,1]]],
  [['Read 2: complement 7 is absent. Store 2 → 0, then inspect 7.',{map:{2:0},index:0}],['Read 7: complement 2 is present at index 0. The indices differ because insertion followed lookup.',{map:{2:0},index:1,complement:2}],['Return [0,1]; their values sum to 9, so no further search is necessary.',{answer:[0,1]}]],
  ['Inserting before checking can reuse the same index.','JavaScript object keys coerce types; Map preserves key types.'],['two-pointers','frequency-counting'], 'easy',['pair-sum'])
add('frequency-counting','Count symbols','Given a string, return an object mapping each Unicode code point to its number of occurrences. Matching is case-sensitive; no normalization is applied.',
  'Counting retains multiplicity, which a set loses. Use a fixed array for a small known alphabet, a map for arbitrary symbols, and sorting if ordered groups are also needed. JavaScript for...of and Python iteration both traverse Unicode code points; a displayed grapheme can contain several code points.',
  'O(n) expected time and O(k) space for k distinct code points.','After processing a prefix, each stored count equals its occurrences in that prefix.',
  ['how many occurrences','multiplicity matters'],'A membership-only query needs a set rather than counts.',
  `function solve(text) {\n  const counts = new Map();\n  for (const ch of text) counts.set(ch, (counts.get(ch) ?? 0) + 1);\n  return Object.fromEntries(counts);\n}`,
  `from collections import Counter\n\ndef solve(text):\n    return dict(Counter(text))`,
  [['aba',{a:2,b:1}],['',{}],['😀a😀',{'😀':2,a:1}],['Aa',{A:1,a:1}]],
  [['Read a; create its count at 1. Next read b.',{counts:{a:1}}],['Read b; it has a separate identity, so add b:1.',{counts:{a:1,b:1}}],['Read a again; increment the existing count to 2 and return the complete map.',{counts:{a:2,b:1}}]],
  ['A set cannot distinguish one occurrence from two.','Decide explicitly whether case and Unicode normalization matter.'],['hash-map','counting-array'], 'easy',['frequency-problems'])
add('anagram','Compare letter multisets','Given [a,b], return whether two strings contain exactly the same Unicode code points with equal multiplicities. Matching is case-sensitive.',
  'An anagram is a problem shape, not one algorithm. Sorting produces canonical order in O(n log n). Frequency arrays give O(n + alphabet) with a fixed known alphabet. Hash maps support arbitrary code points in expected O(n), at O(k) space. These approaches compare multisets, not sets.',
  'Expected O(n + m) time, O(k) space. Sorting alternative: O(n log n + m log m).','A signed count records occurrences in a minus occurrences in b. Every count must finish at zero.',
  ['same characters in different order','rearrange letters'],'For substring search, maintain counts as a window moves rather than recounting every window.',
  `function solve([a,b]) {\n  const counts = new Map();\n  for (const ch of a) counts.set(ch,(counts.get(ch) ?? 0)+1);\n  for (const ch of b) counts.set(ch,(counts.get(ch) ?? 0)-1);\n  return [...counts.values()].every(n => n === 0);\n}`,
  `from collections import Counter\n\ndef solve(pair):\n    a, b = pair\n    return Counter(a) == Counter(b)`,
  [[['listen','silent'],true],[['aab','abb'],false],[['',''],true],[['😀a','a😀'],true],[['A','a'],false]],
  [['Count listen: each of its six letters has count 1. Now cancel letters from silent.',{counts:{l:1,i:1,s:1,t:1,e:1,n:1}}],['Cancel s, i, and l. Their counts become 0; t, e, and n still need matching.',{counts:{l:0,i:0,s:0,t:1,e:1,n:1}}],['Cancel e, n, and t. All counts are zero, so the multisets agree.',{counts:{l:0,i:0,s:0,t:0,e:0,n:0},answer:true}]],
  ['Comparing sets ignores repeated letters.','Sorting both strings must use consistent symbol ordering.'],['frequency-counting','sort-and-scan'], 'easy',['anagram'])
add('group-anagrams','Group equivalent words','Given lowercase ASCII words, group anagrams. Preserve group order by first appearance and preserve input order within each group.',
  'Grouping needs a canonical identity and a map from that identity to a bucket. A 26-count key costs O(L + 26) per word; a sorted key costs O(L log L) and generalizes easily. Delimit counts so [1,11] and [11,1] cannot collide. Python tuples are immutable hash keys; JavaScript arrays are identity keys and must be serialized.',
  'O(total characters + 26w) time, O(total characters + 26w) storage including output.','All words in one bucket share a canonical letter-count vector.',
  ['group words made of the same letters','canonical key'],'The fixed-array version requires lowercase a–z; use a map or sorting for other alphabets.',
  `function solve(words) {\n  const groups = new Map();\n  for (const word of words) {\n    const count = Array(26).fill(0);\n    for (const ch of word) count[ch.charCodeAt(0)-97]++;\n    const key = count.join(',');\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(word);\n  }\n  return [...groups.values()];\n}`,
  `from collections import defaultdict\n\ndef solve(words):\n    groups = defaultdict(list)\n    for word in words:\n        count = [0] * 26\n        for ch in word:\n            count[ord(ch)-ord('a')] += 1\n        groups[tuple(count)].append(word)\n    return list(groups.values())`,
  [[['eat','tea','tan','ate'],[['eat','tea','ate'],['tan']]],[[],[]],[['',''],[['','']]],[['ab','ba','a'],[['ab','ba'],['a']]]],
  [['eat creates the {a:1,e:1,t:1} bucket; next compute tea’s identity.',{groups:[['eat']]}],['tea has the same counts and joins eat. tan creates a new bucket because n replaces e.',{groups:[['eat','tea'],['tan']]}],['ate joins the first bucket. Return buckets in first-seen order.',{groups:[['eat','tea','ate'],['tan']]}]],
  ['Using a fresh JavaScript array as Map key compares identity, not contents.','Undelimited count concatenation creates ambiguous keys.'],['anagram','hash-map'],'medium',['group-anagrams'])
add('duplicate-detection','Detect a repeated value','Given an array of integers, return whether any value appears more than once.',
  'A set answers membership without storing counts. Scan and stop when a value is already present. Sorting plus adjacent comparison trades expected linear time for O(n log n) sorting; constrained index-placement or cycle methods need explicit value-range assumptions and do not apply to arbitrary arrays.',
  'Expected O(n) time and O(n) space.','The set contains exactly the distinct values before the current position.',
  ['any repeated value','membership only'],'Use a frequency map when the output needs occurrence counts.',
  `function solve(nums) {\n  const seen = new Set();\n  for (const x of nums) {\n    if (seen.has(x)) return true;\n    seen.add(x);\n  }\n  return false;\n}`,
  `def solve(nums):\n    seen = set()\n    for value in nums:\n        if value in seen:\n            return True\n        seen.add(value)\n    return False`,
  [[[4,2,4],true],[[],false],[[1,2,3],false],[[0,0],true]],
  [['4 is unseen; add it and advance.',{seen:[4]}],['2 is unseen; add it and advance.',{seen:[4,2]}],['4 is already present. Return true without adding it again.',{seen:[4,2],answer:true}]],
  ['Floyd’s cycle technique needs special input structure, not merely duplicates.','Do not sort the caller’s array accidentally.'],['hash-set','frequency-counting'],'easy',['duplicate-detection'])
add('two-pointers','Search a sorted pair','Given {nums,target} with nums sorted ascending, return indices of a pair totaling target using opposite pointers, or []. Return the first match encountered from both ends.',
  'Sorted order makes elimination safe. If the smallest and largest active values sum too low, the smallest cannot pair successfully with anything remaining. Discard it. If the sum is too high, discard the largest. This proof is what enables linear work; two pointers is not justified by having two indices alone.',
  'O(n) time, O(1) auxiliary space.','Any undiscovered solution lies between left and right.',
  ['sorted pair sum','discard an endpoint monotonically'],'Unsorted pair sums need sorting or a hash map; a window solves different contiguous-state problems.',
  `function solve({nums,target}) {\n  let l=0, r=nums.length-1;\n  while (l<r) {\n    const sum=nums[l]+nums[r];\n    if(sum===target) return [l,r];\n    if(sum<target) l++; else r--;\n  }\n  return [];\n}`,
  `def solve(data):\n    nums, target = data['nums'], data['target']\n    left, right = 0, len(nums)-1\n    while left < right:\n        total = nums[left] + nums[right]\n        if total == target:\n            return [left, right]\n        if total < target:\n            left += 1\n        else:\n            right -= 1\n    return []`,
  [[{nums:[1,2,4,7],target:6},[1,2]],[{nums:[],target:0},[]],[{nums:[3,3],target:6},[0,1]],[{nums:[1,2],target:9},[]]],
  [['1 + 7 = 8 exceeds 6. Discard 7: all other active partners are at least 1.',{left:0,right:3,sum:8}],['1 + 4 = 5 is too low. Discard 1 because 4 is its largest remaining partner.',{left:0,right:2,sum:5}],['2 + 4 = 6. Return indices [1,2].',{left:1,right:2,answer:[1,2]}]],
  ['This endpoint-elimination argument requires sorted input.','Use left < right to prevent reusing a position.'],['pair-sum','sliding-window'],'easy',['pair-sum'])
add('triplet-sum','Find unique zero triples','Given integers, return all unique ascending triples totaling zero, in lexicographic order.',
  'Sort, fix the first value, then solve a two-pointer pair problem on its suffix. Skip equal anchors and equal successful endpoints to produce value-unique triples. This reduces cubic enumeration to quadratic search after sorting.',
  'O(n²) time; O(n) copied input plus output and sorting overhead.','The anchor is fixed while opposite pointers explore its sorted suffix without revisiting discarded pairs.',
  ['three values totaling a target','unique triples'],'For much larger k, k-sum recursion grows quickly; consider constraints and meet in the middle.',
  `function solve(input) {\n  const a=[...input].sort((x,y)=>x-y), out=[];\n  for(let i=0;i<a.length-2;i++){\n    if(i && a[i]===a[i-1]) continue;\n    let l=i+1,r=a.length-1;\n    while(l<r){\n      const s=a[i]+a[l]+a[r];\n      if(s<0) l++; else if(s>0) r--; else {\n        out.push([a[i],a[l],a[r]]);\n        const x=a[l],y=a[r];\n        while(l<r && a[l]===x) l++;\n        while(l<r && a[r]===y) r--;\n      }\n    }\n  }\n  return out;\n}`,
  `def solve(nums):\n    a, out = sorted(nums), []\n    for i in range(len(a)-2):\n        if i and a[i] == a[i-1]:\n            continue\n        left, right = i+1, len(a)-1\n        while left < right:\n            total = a[i]+a[left]+a[right]\n            if total < 0:\n                left += 1\n            elif total > 0:\n                right -= 1\n            else:\n                out.append([a[i],a[left],a[right]])\n                x, y = a[left], a[right]\n                while left < right and a[left] == x:\n                    left += 1\n                while left < right and a[right] == y:\n                    right -= 1\n    return out`,
  [[[-1,0,1,2,-1,-4],[[-1,-1,2],[-1,0,1]]],[[0,0,0,0],[[0,0,0]]],[[],[]],[[1,2,3],[]]],
  [['Sort to [-4,-1,-1,0,1,2]. Anchor -4 has no matching suffix pair, so advance.',{array:[-4,-1,-1,0,1,2],anchor:0}],['Anchor -1 with left -1 and right 2 totals zero. Record [-1,-1,2], then skip equal endpoints.',{anchor:1,left:2,right:5,answer:[[-1,-1,2]]}],['The same anchor with 0 and 1 gives [-1,0,1]. Skip the duplicate -1 anchor; later anchors add nothing.',{answer:[[-1,-1,2],[-1,0,1]]}]],
  ['JavaScript default sort is lexical; supply a numeric comparator.','Deduplicate values, not merely index triples.'],['two-pointers','k-sum'],'medium',['triplet-sum'])
add('palindrome','Check mirrored text','Given a string, return whether its Unicode code points read identically forward and backward. Spaces and case count.',
  'Palindrome is a shape with several algorithms. A full-string check compares endpoints inward. Longest palindromic substring instead admits expand-around-center, O(n²) DP, or linear Manacher; a palindromic subsequence is a different DP problem. Here both languages materialize code points for consistent indexing.',
  'O(n) time and O(n) code-point array space; O(1) auxiliary space is possible with appropriate indexed input.',
  'Every pair outside the active interval already matches.', ['reads the same backward','mirror symmetry'],'Do not use this boolean check to claim the longest palindromic substring has been found.',
  `function solve(text) {\n  const a=[...text];\n  let l=0,r=a.length-1;\n  while(l<r) if(a[l++]!==a[r--]) return false;\n  return true;\n}`,
  `def solve(text):\n    chars = list(text)\n    left, right = 0, len(chars)-1\n    while left < right:\n        if chars[left] != chars[right]:\n            return False\n        left += 1\n        right -= 1\n    return True`,
  [['radar',true],['',true],['ab',false],['😀a😀',true]],
  [['Compare r with r. They match, so move both endpoints inward.',{left:0,right:4,matched:['r','r']}],['Compare a with a. They match; move toward the center.',{left:1,right:3,matched:['a','a']}],['Both pointers reach d. A single center needs no partner; return true.',{left:2,right:2,answer:true}]],
  ['JavaScript string indexing uses UTF-16 code units; spread first for code points.','Cleaning punctuation changes the problem specification.'],['two-pointers','palindrome-dp'],'easy',['palindrome'])
add('sliding-window','Longest unique segment','Given a string, return the length in Unicode code points of its longest contiguous substring with no repeated symbol.',
  'Maintain a valid contiguous window. Extending right can introduce a duplicate; shrink left until validity is restored. Each symbol enters and leaves at most once. This monotonic repair property is essential. For exact sums with negative values, prefix counts may be required instead.',
  'Expected O(n) time and O(k) window set space, plus O(n) code-point materialization.',
  'The active window contains no duplicate symbols.', ['longest contiguous substring','can repair by removing from left'],'Negative-number sum constraints need separate monotonicity analysis; subarray does not imply sliding window.',
  `function solve(text) {\n  const a=[...text], seen=new Set();\n  let left=0,best=0;\n  for(let right=0;right<a.length;right++){\n    while(seen.has(a[right])) seen.delete(a[left++]);\n    seen.add(a[right]);\n    best=Math.max(best,right-left+1);\n  }\n  return best;\n}`,
  `def solve(text):\n    seen, left, best = set(), 0, 0\n    for right, char in enumerate(text):\n        while char in seen:\n            seen.remove(text[left])\n            left += 1\n        seen.add(char)\n        best = max(best, right-left+1)\n    return best`,
  [['abba',2],['',0],['bbbb',1],['😀a😀b',3]],
  [['Extend through a,b. Both are distinct; best length becomes 2.',{window:['a','b'],left:0,right:1,best:2}],['The next b repeats. Remove a, then the earlier b; only then add the new b.',{window:['b'],left:2,right:2,best:2}],['Add a to obtain ba. Its length is 2; return the best length 2.',{window:['b','a'],left:2,right:3,best:2}]],
  ['A single if may not remove enough characters; shrink with while.','Update best after restoring validity.'],['two-pointers','prefix-sum'],'medium',['substring'])
add('prefix-sum','Answer static range sums','Given {nums,queries}, each query is [left,rightExclusive]. Return each half-open range sum. Valid bounds satisfy 0 <= left <= rightExclusive <= nums.length.',
  'Store the total before every boundary. Subtract the total before left from the total before right to cancel everything outside the interval. Negative values are harmless because this is an algebraic identity, not a monotonic window rule. Updates invalidate later prefixes; use Fenwick or segment trees for dynamic workloads.',
  'O(n + q) time, O(n) auxiliary space and O(q) output.','prefix[i] equals the sum of nums[0:i], with prefix[0]=0.',
  ['many static range sums','cancel a prefix'],'Frequent point updates make rebuilding prefixes costly.',
  `function solve({nums,queries}) {\n  const prefix=[0];\n  for(const x of nums) prefix.push(prefix.at(-1)+x);\n  return queries.map(([l,r])=>prefix[r]-prefix[l]);\n}`,
  `from itertools import accumulate\n\ndef solve(data):\n    prefix = [0, *accumulate(data['nums'])]\n    return [prefix[right]-prefix[left] for left,right in data['queries']]`,
  [[{nums:[3,-2,5],queries:[[0,3],[1,3],[2,2]]},[6,3,0]],[{nums:[],queries:[[0,0]]},[0]],[{nums:[-2,-3],queries:[[0,2],[1,2]]},[-5,-3]]],
  [['Start prefix with 0; after 3 and -2 the totals are [0,3,1]. Next add 5.',{prefix:[0,3,1]}],['Append 6. Each index now represents a boundary before that position.',{prefix:[0,3,1,6]}],['Answer [0,3):6−0=6, [1,3):6−3=3, and empty [2,2):1−1=0.',{answer:[6,3,0]}]],
  ['Mixing inclusive and exclusive endpoints introduces off-by-one errors.','O(1) query time excludes preprocessing and output.'],['sliding-window','fenwick-tree'],'easy',['range-sum'])
add('subarray','Count target-sum segments','Given {nums,target}, return the number of nonempty contiguous segments summing to target. Values may be negative or zero.',
  'Let current be the running prefix total. A prior prefix equal to current−target marks a segment ending here. Count all such prefixes, not only one index. Positive-only feasibility sometimes allows a window; zero multiplicities complicate counting, and negative values destroy sum monotonicity. Maximum-sum subarray instead points to Kadane.',
  'Expected O(n) time and O(n) space.','Before inserting the current prefix, the map counts all earlier prefix boundaries.',
  ['count contiguous sums','negative values permitted'],'For a maximum sum use Kadane; for static specified intervals use prefix subtraction.',
  `function solve({nums,target}) {\n  const count=new Map([[0,1]]);\n  let total=0,answer=0;\n  for(const x of nums){\n    total+=x; answer+=count.get(total-target) ?? 0;\n    count.set(total,(count.get(total) ?? 0)+1);\n  }\n  return answer;\n}`,
  `from collections import defaultdict\n\ndef solve(data):\n    count = defaultdict(int, {0: 1})\n    total = answer = 0\n    for value in data['nums']:\n        total += value\n        answer += count[total-data['target']]\n        count[total] += 1\n    return answer`,
  [[{nums:[1,-1,1],target:1},3],[{nums:[0,0],target:0},3],[{nums:[],target:0},0],[{nums:[-2,-1],target:-3},1]],
  [['Seed count[0]=1. After 1, total=1; one earlier zero prefix gives the first segment.',{total:1,count:{0:1,1:1},answer:1}],['After -1 total=0; no prefix -1 exists. Record a second zero boundary.',{total:0,count:{0:2,1:1},answer:1}],['After 1 total=1; both earlier zero boundaries match. Add 2 and return 3.',{total:1,count:{0:2,1:2},answer:3}]],
  ['Omitting the empty prefix misses segments starting at index 0.','Store frequencies; a set loses multiple valid left boundaries.'],['prefix-sum','sliding-window','kadanes-algorithm'],'medium',['subarray'])
add('kadanes-algorithm','Best nonempty segment','Given a nonempty integer array, return the maximum sum of a nonempty contiguous segment.',
  'For a segment ending here, either extend the best segment ending one position earlier or start fresh here. A negative previous contribution can only hurt. Track the best ending-here state separately from the best seen anywhere. This local recurrence is dynamic programming, not arbitrary greedy guessing.',
  'O(n) time and O(1) auxiliary space.','ending is the best nonempty segment sum ending at the current index.',
  ['maximum contiguous sum','restart or extend'],'For exact target counts use prefix frequencies; subsequences need a different recurrence.',
  `function solve(nums) {\n  let ending=nums[0],best=nums[0];\n  for(let i=1;i<nums.length;i++){\n    ending=Math.max(nums[i],ending+nums[i]);\n    best=Math.max(best,ending);\n  }\n  return best;\n}`,
  `def solve(nums):\n    ending = best = nums[0]\n    for value in nums[1:]:\n        ending = max(value, ending+value)\n        best = max(best, ending)\n    return best`,
  [[[-2,3,-1,4,-5],6],[[-8,-3,-6],-3],[[4],4],[[0,0],0]],
  [['Initialize ending=best=-2. At 3, restart because 3 exceeds -2+3.',{ending:3,best:3,index:1}],['At -1, extend to 2; at 4, extend again to 6. Record best=6.',{ending:6,best:6,index:3}],['At -5, ending drops to 1, but the earlier best remains 6. Return 6.',{ending:1,best:6,index:4}]],
  ['Initializing best=0 incorrectly permits an empty answer for all-negative input.','The ending-here value is not always the global best.'],['1d-dp','subarray'],'easy',['maximum-minimum-segment'])
