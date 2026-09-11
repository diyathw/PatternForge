import type { VisualizationStep } from '../../types/domain'
import { ArrayCell } from './primitives'

export default function HashMapScene({ step, initialValues }: { step: VisualizationStep; initialValues: unknown }) {
  const input = initialValues as { nums?: number[]; target?: number } | undefined
  const nums = input?.nums ?? []
  const target = input?.target ?? 0
  const variables = step.variables ?? {}
  const answer = Array.isArray(variables.answer) ? variables.answer as number[] : undefined
  const index = typeof variables.index === 'number' ? variables.index : answer?.[1]
  const current = index === undefined ? undefined : nums[index]
  const complement = current === undefined ? undefined : target - current
  const stored = variables.map && typeof variables.map === 'object'
    ? variables.map as Record<string, number>
    : Object.fromEntries(nums.slice(0, index ?? 0).map((value, i) => [String(value), i]))
  // Authored frames show the map after insertion; lookup must exclude this index.
  const matchIndex = complement === undefined ? undefined : stored[String(complement)]
  const found = matchIndex !== undefined && index !== undefined && matchIndex < index

  return <div className="animated-scene">
    <div className="scene-status"><span className="tag">Hash map · complementary pair</span><span>Find two different positions whose values add to {target}.</span></div>
    <div>
      <p className="muted">Input numbers · small labels are zero-based indices</p>
      <div className="array-view">{nums.map((value, i) => <div key={i}>
        <ArrayCell value={value} index={i} active={answer ? answer.includes(i) : i === index || found && i === matchIndex}/>
        <small>{i === index ? '↑ current' : found && i === matchIndex ? '↑ found' : '\u00a0'}</small>
      </div>)}</div>
    </div>
    {current !== undefined && <div className="scene-metrics">
      <span>Target <b>{target}</b></span>
      <span>Current value <b>{current}</b></span>
      <span>Look for <b>{target} − {current} = {complement}</b></span>
    </div>}
    <div>
      <h3>Seen numbers → their indices</h3>
      <p className="muted">Check for the complement before storing the current number.</p>
      {Object.keys(stored).length ? <div className="count-buckets">{Object.entries(stored).map(([value, position]) => <div className={`count-bucket ${found && position === matchIndex ? 'balanced' : ''}`} key={value}>
        <small>number</small><strong>{value}</strong><span>↓ stored at</span><b>index {position}</b><small>{found && position === matchIndex ? 'Complement found' : position === index ? 'Just stored after lookup' : 'Previously seen'}</small>
      </div>)}</div> : <p>The map is empty.</p>}
    </div>
    <p className="scene-result">{answer?.length === 2
      ? `${nums[answer[0]]} + ${nums[answer[1]]} = ${target}. Return indices [${answer.join(', ')}].`
      : found
        ? `Found ${complement} at index ${matchIndex}. Pair it with ${current} at index ${index}.`
        : `No earlier ${complement} was found. Store ${current} → ${index}, then move right.`}</p>
  </div>
}
