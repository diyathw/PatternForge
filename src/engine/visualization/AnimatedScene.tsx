import type { VisualizationStep } from '../../types/domain'
import { bfsAdj } from './animatedTraces'

function LetterRow({ letters, focus, consumed = -1 }: { letters: string[]; focus: number; consumed?: number }) {
  return <div className="letter-strip">{letters.map((ch,i)=><div key={i} className={`letter-tile ${i===focus?'current':''} ${i<consumed?'consumed':''}`}><strong>{ch}</strong><small>{i}</small></div>)}</div>
}
export default function AnimatedScene({ id, step }: { id: string; step: VisualizationStep }) {
  const v = step.variables!
  const counts = v.counts as Record<string,number> | undefined
  return <div className="animated-scene">
    <div className="scene-status">{step.action && <span className="tag">{step.action}</span>}<span>{id==='sliding-window'?'Keep a contiguous window with no repeated letters':id==='anagram'?'Balance = first word count − second word count':id==='linked-list'?'A node stores a value and a reference to the next node':'Breadth-first search · undirected, unweighted graph'}</span></div>
    {id==='sliding-window' && <>
      <div className="window-scroll"><div className="window-track" style={{width:(v.letters as string[]).length*58}}>
        <LetterRow letters={v.letters as string[]} focus={v.focus as number}/>
        {(v.right as number)>=0 && <><div className="moving-window" style={{left:(v.left as number)*58,width:((v.right as number)-(v.left as number)+1)*58-6}}/><span className="window-pointer left-pointer" style={{left:(v.left as number)*58}}>L ↑</span><span className="window-pointer right-pointer" style={{left:(v.right as number)*58}}>R ↑</span></>}
      </div></div>
      <p className="muted">This count-based trace includes a letter, then removes duplicates. The lesson’s set-based code removes a duplicate before adding it; both keep the same valid windows.</p>
      <div className="scene-metrics"><span>Window length <b>{Math.max(0,Number(v.right)-Number(v.left)+1)}</b></span><span>Best length <b>{String(v.best)}</b></span><span>Unique? <b>{Object.values(counts!).some(n=>n>1)?'No · shrink L':'Yes'}</b></span></div>
    </>}
    {id==='anagram' && <div className="word-comparison">{[v.a,v.b].map((letters,row)=><div key={row}><p>{row===0?'First word · add +1':'Second word · cancel −1'}</p><LetterRow letters={letters as string[]} focus={v.row===row?v.focus as number:-1} consumed={v.row===row?v.focus as number:v.row===1&&row===0?(letters as string[]).length:-1}/></div>)}</div>}
    {counts && <div><p className="muted">{id==='anagram'?'Letter balances · zero means matched':'Letters currently inside the window'}</p><div className="count-buckets">{Object.entries(counts).map(([ch,n])=><div className={`count-bucket ${n===0?'balanced':''} ${n<0||id==='sliding-window'&&n>1?'mismatch':''}`} key={ch}><strong>{ch}</strong><div className="count-meter"><div style={{height:`${Math.min(Math.abs(n)*22,88)}px`}}/></div><b>{n}</b><small>{n===0?(id==='anagram'?'matched':'absent'):n<0?'extra in second':id==='anagram'?'still to cancel':'in window'}</small></div>)}</div></div>}
    {id==='linked-list' && <>
      <p className="muted">head → first node · current → node being read · null → end of chain</p>
      <div className="linked-chain">{(v.nodes as number[]).map((n,i)=><div className={`linked-item ${v.current===i?'current':''}`} key={n}><small>{i===0?'head':''} {v.current===i?'↓ current':''}</small><div className="linked-box"><strong>{n}</strong><span>next →</span></div></div>)}<div className="linked-item"><small>{v.current===(v.nodes as number[]).length?'↓ current':''}</small><div className="linked-null">null</div></div></div>
      {v.insertion==='prepare' && <div className="pending-node">New node <b>15</b> → node 20 <small>(10 still points to 20)</small></div>}
      {!v.insertion && <p>Values collected: <strong>{(v.output as number[]).join(' → ')||'none yet'}</strong></p>}
    </>}
    {id==='bfs' && <GraphScene step={step}/>}
    {typeof v.answer==='boolean' && <p className="scene-result">{v.answer?'✓ Anagrams':'≠ Not anagrams'}</p>}
  </div>
}
const positions = [[65,130],[220,55],[220,205],[375,130],[505,130]]
function GraphScene({ step }: { step: VisualizationStep }) {
  const v=step.variables!, distance=v.distance as (number|null)[], queue=v.queue as number[], visited=v.visited as number[], edge=v.edge as number[]
  return <>
    <svg className="traversal-graph" viewBox="0 0 570 270" role="img" aria-label="BFS graph with nodes 0 through 4; node 4 is disconnected">
      {bfsAdj.flatMap((neighbors,u)=>neighbors.filter(v=>v>u).map(w=><line key={`${u}-${w}`} x1={positions[u][0]} y1={positions[u][1]} x2={positions[w][0]} y2={positions[w][1]} className={edge.includes(u)&&edge.includes(w)?'traversed-edge':''}/>))}
      {positions.map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`} className={v.current===i?'node-current':queue.includes(i)?'node-queued':visited.includes(i)?'node-visited':''}><circle r="25"/><text textAnchor="middle" dy="6">{i}</text><text className="node-distance" textAnchor="middle" y="46">d = {distance[i]??'∞'}</text></g>)}
    </svg>
    <p className="muted">Teal filled = processing · teal outline = queued · gray = processed · ∞ = undiscovered</p>
    <div className="bfs-queue"><span>Front →</span>{queue.map(n=><strong key={n}>{n}</strong>)}{!queue.length&&<span>empty</span>}<span>← Back</span></div>
    <div className="scene-metrics"><span>Dequeued <b>{visited.join(' → ')||'none'}</b></span></div>
  </>
}
