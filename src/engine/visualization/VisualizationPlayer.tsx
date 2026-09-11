import { useEffect, useMemo, useState } from 'react'
import HashMapScene from './HashMapScene'
import AnimatedScene from './AnimatedScene'
import { animatedExamples, animatedTrace } from './animatedTraces'
import type { PatternContent } from '../../types/domain'
import { ArrayCell, BitView, GraphEdge, GraphNode, HashBucket, HeapTree, IntervalTimeline, MatrixView, Pointer, QueueView, SlidingRange, StackView } from './primitives'
export default function VisualizationPlayer({ content }: { content: Pick<PatternContent, 'patternId' | 'steps' | 'initialValues'> }) {
  const [index,setIndex] = useState(0), [playing,setPlaying] = useState(false), [speed,setSpeed] = useState(1)
  const [example,setExample] = useState(0)
  const animated = useMemo(() => animatedTrace(content.patternId, example), [content.patternId, example])
  const steps = animated ?? content.steps
  useEffect(() => { setIndex(0); setPlaying(false); setExample(0) }, [content.patternId])
  useEffect(() => {
    if (!playing || index >= steps.length-1) return
    const timer = setTimeout(() => { setIndex(i => i+1); if(index === steps.length-2) setPlaying(false) }, 1600/speed)
    return () => clearTimeout(timer)
  }, [playing,index,speed,steps.length])
  const step = steps[Math.min(index,steps.length-1)]
  if (!step) return <p>This topic does not yet have a walkthrough.</p>
  const vars = step.variables ?? {}
  const array = vars.array ?? vars.nums ?? vars.values ?? content.initialValues
  const matrix = vars.table ?? vars.dp ?? vars.matrix
  const graph = content.initialValues && !Array.isArray(content.initialValues) && typeof content.initialValues === "object" ? content.initialValues as Record<string,unknown> : {}
  return <section className="visualization" aria-label="Algorithm walkthrough">
    <div className="section-heading"><div><span className="eyebrow">STATE EXPLORER</span><h3>Watch the reasoning unfold</h3></div><span className="tag">{index+1} / {steps.length}</span></div>
    {animated && <label className="field-label">Try an example<select value={example} onChange={e=>{setExample(Number(e.target.value));setIndex(0);setPlaying(false)}}>{animatedExamples[content.patternId].map((item,i)=><option key={i} value={i}>{item.label}</option>)}</select></label>}
    <div className="visual-stage">
      {['hash-map','pair-sum'].includes(content.patternId) ? <HashMapScene step={step} initialValues={content.initialValues}/> : animated || content.patternId==='linked-list' ? <AnimatedScene id={content.patternId} step={step}/> : <>
      {Array.isArray(graph.nodes) && <div className="graph-scene"><div className="array-view">{graph.nodes.map((node,i) => { const label = typeof node === 'object' && node ? String((node as Record<string,unknown>).id ?? (node as Record<string,unknown>).label ?? i) : String(node); return <GraphNode key={i} label={label} active={step.highlights?.includes(label)} /> })}</div>{Array.isArray(graph.edges) && <div className="pointer-row">{graph.edges.map((edge,i) => { const e = edge as Record<string,unknown>; return <GraphEdge key={i} from={String(Array.isArray(edge) ? edge[0] : e.from)} to={String(Array.isArray(edge) ? edge[1] : e.to)} /> })}</div>}</div>}

      {Array.isArray(array) && array.every(v=>!Array.isArray(v) && typeof v !== 'object') && <div className="array-view">{array.map((v,i)=><ArrayCell key={i} value={v} index={i} active={Boolean(step.cellStates?.[i]) || Boolean(step.pointers?.some(p=>p.index===i)) || Boolean(step.highlights?.includes(String(i)))} />)}</div>}
      {Array.isArray(matrix) && Array.isArray(matrix[0]) && <MatrixView values={matrix as unknown[][]} />}
      {Array.isArray(vars.heap) && <HeapTree values={vars.heap} />}
      {Array.isArray(vars.queue) && <QueueView values={vars.queue} />}
      {Array.isArray(step.stack ?? vars.stack) && <StackView values={(step.stack ?? vars.stack) as unknown[]} />}
      {Array.isArray(vars.intervals) && <IntervalTimeline intervals={vars.intervals as number[][]} />}
      {typeof vars.bits === 'number' && <BitView value={vars.bits} />}
      <div className="pointer-row">{step.pointers?.map(p=><Pointer key={p.label} {...p} />)}{step.windowRange && <SlidingRange start={step.windowRange[0]} end={step.windowRange[1]} />}</div>
      <HashBucket entries={vars} />
      </>}
    </div>
    <div className="step-explanation" aria-live="polite"><span className="step-number">{index+1}</span><p>{step.description}</p></div>
    <div className="playback-controls"><button onClick={()=>{setIndex(0);setPlaying(false)}}>Reset</button><button disabled={index===0} onClick={()=>{setPlaying(false);setIndex(i=>i-1)}}>Previous</button><button className="primary" onClick={()=>{if(index===steps.length-1){setIndex(0);setPlaying(true)}else setPlaying(p=>!p)}}>{playing && index<steps.length-1 ? 'Pause' : 'Play'}</button><button disabled={index===steps.length-1} onClick={()=>{setPlaying(false);setIndex(i=>i+1)}}>Next</button><label>Speed <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label></div>
    <label className="step-slider">Jump to step<input aria-label="Jump to step" type="range" min={0} max={steps.length-1} value={index} onChange={e=>{setPlaying(false);setIndex(Number(e.target.value))}} /></label>
  </section>
}
