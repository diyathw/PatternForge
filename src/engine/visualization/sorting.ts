import type { VisualizationDemo, VisualizationStep } from '../../types/domain'
import { nodeById } from '../../data/taxonomy'
export const sortingIds = ['bubble-sort','selection-sort','insertion-sort','merge-sort','quick-sort','heap-sort','counting-sort','radix-sort','bucket-sort','shell-sort','timsort'] as const
export function sortingDemo(id: typeof sortingIds[number], input = [8,3,6,2,7,1,5,4]): VisualizationDemo {
 const a=[...input], steps: VisualizationStep[]=[]
 const frame=(description:string, indices:number[]=[], extra:Record<string,unknown>={})=>steps.push({id:`step-${steps.length}`,description,variables:{array:[...a],...extra},highlights:indices.map(String)})
 const swap=(i:number,j:number)=>{[a[i],a[j]]=[a[j],a[i]]}
 frame('Start with an unsorted array. Follow the invariant specific to this sorting method.')
 if(id==='bubble-sort'){
  for(let end=a.length-1;end>0;end--){let changed=false;for(let i=0;i<end;i++){if(a[i]>a[i+1]){swap(i,i+1);changed=true;frame('Swap inverted neighbors. The larger value moves toward its final position on the right.',[i,i+1])}}frame(`The suffix from index ${end} is sorted. Continue on the remaining prefix.`,[end]);if(!changed)break}
 } else if(id==='selection-sort'){
  for(let i=0;i<a.length;i++){let min=i;for(let j=i+1;j<a.length;j++)if(a[j]<a[min])min=j;swap(i,min);frame(`Select the minimum of the unsorted suffix and place it at index ${i}. The sorted prefix grows.`,[i,min])}
 } else if(id==='insertion-sort'||id==='shell-sort'){
  const gaps=id==='shell-sort'?[4,2,1]:[1]
  for(const gap of gaps)for(let i=gap;i<a.length;i++){const value=a[i];let j=i;while(j>=gap&&a[j-gap]>value){a[j]=a[j-gap];j-=gap}a[j]=value;frame(`Insert ${value} in its gap-${gap} sorted subsequence. ${gap===1?'The prefix is sorted.':'Later smaller gaps finish ordering.'}`,[i,j],{gap})}
 } else if(id==='merge-sort'||id==='timsort'){
  const merge=(l:number,m:number,r:number)=>{const left=a.slice(l,m),right=a.slice(m,r);let i=0,j=0;for(let k=l;k<r;k++)a[k]=j===right.length||(i<left.length&&left[i]<=right[j])?left[i++]:right[j++];frame(`Merge sorted runs [${l}, ${m}) and [${m}, ${r}); choosing the left tie preserves stability.`,[],{left,right})}
  if(id==='merge-sort'){const sort=(l:number,r:number)=>{if(r-l<2)return;const m=(l+r)>>1;sort(l,m);sort(m,r);merge(l,m,r)};sort(0,a.length)}
  else {const runs:number[][]=[];for(let l=0;l<a.length;){let r=l+1;while(r<a.length&&a[r-1]<=a[r])r++;runs.push([l,r]);frame(`Recognize an existing ascending run [${l}, ${r}). Natural-run merging can exploit existing order.`,[],{runs:runs.map(x=>[...x])});l=r}while(runs.length>1){const first=runs.shift()!,second=runs.shift()!;merge(first[0],first[1],second[1]);runs.unshift([first[0],second[1]])}}
 } else if(id==='quick-sort'){
  const sort=(l:number,r:number)=>{if(l>=r)return;const pivot=a[r];let p=l;for(let j=l;j<r;j++)if(a[j]<pivot){swap(p,j);p++}swap(p,r);frame(`Partition around ${pivot}: smaller values lie left of index ${p}, larger or equal values right. Recurse on both sides.`,[p],{pivot});sort(l,p-1);sort(p+1,r)};sort(0,a.length-1)
 } else if(id==='heap-sort'){
  const sift=(root:number,size:number)=>{while(2*root+1<size){let child=2*root+1;if(child+1<size&&a[child+1]>a[child])child++;if(a[root]>=a[child])break;swap(root,child);root=child}}
  for(let i=Math.floor(a.length/2)-1;i>=0;i--)sift(i,a.length)
  frame('Build a max heap: each parent is at least as large as its children. The maximum is at the root.',[],{heap:[...a]})
  for(let end=a.length-1;end>0;end--){swap(0,end);sift(0,end);frame(`Move the maximum to index ${end}, then repair the smaller heap. The suffix is final.`,[end],{heap:a.slice(0,end)})}
 } else if(id==='counting-sort'){
  if(a.some(v=>!Number.isInteger(v)||v<0||v>10000))throw new Error('This counting demo requires integers from 0 to 10,000.')
  const counts=Array(Math.max(0,...a)+1).fill(0);for(const v of a)counts[v]++
  frame('Count occurrences by integer value. This requires a manageable key range.',[],{counts:[...counts]})
  let i=0;for(let v=0;v<counts.length;v++)for(let c=0;c<counts[v];c++)a[i++]=v
  frame('Reconstruct in key order from the counts. This value-only variant does not demonstrate stability for attached records.',[],{counts})
 } else if(id==='radix-sort'){
  if(a.some(v=>!Number.isSafeInteger(v)||v<0))throw new Error('This radix demo requires nonnegative safe integers.')
  const max=Math.max(0,...a)
  for(let place=1;place<=max;place*=10){const buckets:number[][]=Array.from({length:10},()=>[]);for(const v of a)buckets[Math.floor(v/place)%10].push(v);a.splice(0,a.length,...buckets.flat());frame(`Stably collect digit buckets at place ${place}. Earlier lower-digit order is preserved within each bucket.`,[],{buckets})}
 } else if(id==='bucket-sort'){
  const max=Math.max(1,...a),min=Math.min(0,...a),buckets:number[][]=Array.from({length:4},()=>[])
  for(const v of a)buckets[Math.min(3,Math.floor((v-min)/(max-min+1)*4))].push(v)
  frame('Distribute values into ordered ranges. Balanced buckets are an assumption for expected linear performance.',[],{buckets:buckets.map(b=>[...b])})
  for(const bucket of buckets)bucket.sort((x,y)=>x-y)
  a.splice(0,a.length,...buckets.flat());frame('Sort within each bucket, then concatenate buckets in range order.',[],{buckets})
 }
 frame('The array is sorted. Check that it is nondecreasing and preserves the original multiset.',[],{result:[...a]})
 return {patternId:id,title:nodeById.get(id)?.name??id,description:id==='timsort'?'Concept demonstration: detect ascending runs and merge stably. Production TimSort also handles descending runs, minimum-run insertion, stack invariants and galloping; this is not a full TimSort implementation.':nodeById.get(id)?.complexityNotes??'',initialValues:input,steps}
}
