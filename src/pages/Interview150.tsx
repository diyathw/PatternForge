import { useState } from 'react'
import { Link } from 'react-router-dom'
import { contentById } from '../data/content'
import { interview150Topics, interview150Url } from '../data/studyPlans'
import { nodeById } from '../data/taxonomy'

export function Interview150() {
  const [query, setQuery] = useState('')
  const [lessonsOnly, setLessonsOnly] = useState(false)
  const normalized = query.trim().toLowerCase()
  const topics = interview150Topics.map((topic, index) => ({ ...topic, index })).filter(topic => {
    const searchable = `${topic.title} ${topic.description} ${topic.patternIds.map(id => nodeById.get(id)?.name).join(' ')}`
    return searchable.toLowerCase().includes(normalized) && (!lessonsOnly || topic.patternIds.some(id => contentById.has(id)))
  })

  return <>
    <header className="page-heading">
      <span className="eyebrow">STUDY PLAN COMPANION</span>
      <h1>Top Interview 150</h1>
      <p>Follow LeetCode’s topic order. Learn the underlying patterns here, then solve the problems in the official study plan.</p>
    </header>
    <div className="panel tinted">
      <div className="section-heading"><h2>23 topics · 150 problems</h2><a href={interview150Url} target="_blank" rel="noopener noreferrer">Open official LeetCode plan ↗</a></div>
      <p>Each topic links to related PatternForge material. <strong>Lesson</strong> includes an explanation, walkthrough, and code; <strong>Overview</strong> is a shorter curriculum entry. Problem counts refer to LeetCode’s plan.</p>
    </div>
    <div className="filters">
      <input aria-label="Search study plan topics" placeholder="Find a topic or pattern…" value={query} onChange={event => setQuery(event.target.value)} />
      <label className="study-plan-toggle"><input type="checkbox" checked={lessonsOnly} onChange={event => setLessonsOnly(event.target.checked)} /> Topics with lessons</label>
    </div>
    <p className="muted" role="status">{topics.length} of 23 topics{lessonsOnly ? ' with authored lessons' : ''}</p>
    <div className="shape-grid study-plan-grid">
      {topics.map(topic => <section className="panel" key={topic.title}>
        <div className="section-heading"><span className="eyebrow">{String(topic.index + 1).padStart(2, '0')}</span><span className="pill">{topic.count} problems</span></div>
        <h2>{topic.title}</h2>
        <p>{topic.description}</p>
        <ul className="study-plan-links">
          {topic.patternIds.filter(id => !lessonsOnly || contentById.has(id)).map(id => <li key={id}>
            <Link to={`/learn/${id}`}><span>{nodeById.get(id)?.name ?? id}</span><small className={contentById.has(id) ? 'success' : 'muted'}>{contentById.has(id) ? 'Lesson' : 'Overview'} →</small></Link>
          </li>)}
        </ul>
      </section>)}
    </div>
    {!topics.length && <div className="panel empty"><h2>No matching topics</h2><p>Try a broader term or show all topics.</p><button onClick={() => { setQuery(''); setLessonsOnly(false) }}>Clear filters</button></div>}
  </>
}
