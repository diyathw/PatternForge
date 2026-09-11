import type { ReactNode } from 'react'
export function ArrayCell({ value, index, active = false }: { value: unknown; index: number; active?: boolean }) { return <div className={`array-cell ${active ? 'active' : ''}`}><strong>{String(value)}</strong><small>{index}</small></div> }
export function Pointer({ label, index }: { label: string; index: number }) { return <span className="pointer">{label} → {index}</span> }
export function SlidingRange({ start, end }: { start: number; end: number }) { return <span className="tag">Window [{start}, {end}]</span> }
export function StackView({ values }: { values: unknown[] }) { return <div className="stack-view">{[...values].reverse().map((v,i) => <div key={i}>{String(v)}</div>)}<small>stack · top ↑</small></div> }
export function QueueView({ values }: { values: unknown[] }) { return <div><small>front → queue → back</small><div className="array-view">{values.map((v,i) => <ArrayCell key={i} value={v} index={i} />)}</div></div> }
export function HashBucket({ entries }: { entries: Record<string,unknown> }) { return <dl className="variables">{Object.entries(entries).map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{JSON.stringify(v)}</dd></div>)}</dl> }
export function GraphNode({ label, active }: { label: string; active?: boolean }) { return <span className={`graph-node ${active ? 'active' : ''}`}>{label}</span> }
export function GraphEdge({ from, to }: { from: string; to: string }) { return <span className="graph-edge">{from} → {to}</span> }
export function TreeNode({ label, children }: { label: string; children?: ReactNode }) { return <div className="tree-node"><GraphNode label={label} />{children && <div className="tree-children">{children}</div>}</div> }
export function HeapTree({ values }: { values: unknown[] }) { const node = (i: number): ReactNode => i >= values.length ? null : <TreeNode key={i} label={String(values[i])}>{2*i+1 < values.length && <>{node(2*i+1)}{node(2*i+2)}</>}</TreeNode>; return <div className="heap-tree">{node(0)}</div> }
export function LinkedListNode({ label, last }: { label: string; last?: boolean }) { return <span className="linked-node"><GraphNode label={label} /><span>→ {last ? 'null' : ''}</span></span> }
export function DPCell({ value, index, active }: { value: unknown; index: number; active?: boolean }) { return <ArrayCell value={value} index={index} active={active} /> }
export function MatrixCell({ value, index, active }: { value: unknown; index: number; active?: boolean }) { return <DPCell value={value} index={index} active={active} /> }
export function MatrixView({ values }: { values: unknown[][] }) { return <div className="matrix-view">{values.map((row,i) => <div className="array-view" key={i}>{row.map((v,j) => <MatrixCell key={j} value={v} index={j} />)}</div>)}</div> }
export function BitView({ value }: { value: number }) { return <div className="array-view">{(value >>> 0).toString(2).padStart(8,'0').split('').map((v,i) => <ArrayCell key={i} value={v} index={i} active={v==='1'} />)}</div> }
export function IntervalTimeline({ intervals }: { intervals: number[][] }) { const max = Math.max(1,...intervals.flat()); return <div className="interval-timeline">{intervals.map(([start,end],i) => <div key={i} style={{ marginLeft: `${start/max*70}%`, width: `${Math.max(3,(end-start)/max*70)}%` }}>{start}–{end}</div>)}</div> }
export function RecursionTree({ label, children }: { label: string; children?: ReactNode }) { return <TreeNode label={label}>{children}</TreeNode> }
