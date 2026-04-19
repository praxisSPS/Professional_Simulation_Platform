'use client'

import { useState } from 'react'
import { TabBar, TaskBrief, SubmitBtn, ResultPanel, evalSubmit, inp, lbl, ta, row, col, D } from './shared'

interface Props {
  task: any
  sessionId: string
  onComplete: (result: any) => void
}

const TABS = [
  { id: 'raid',      label: 'RAID Log' },
  { id: 'gantt',     label: 'Gantt' },
  { id: 'status',    label: 'Status Report' },
  { id: 'comms',     label: 'Stakeholder Comms' },
  { id: 'change',    label: 'Change Request' },
]

// ── RAID Log ───────────────────────────────────────────────────

type RAIDCategory = 'risk' | 'assumption' | 'issue' | 'dependency'
type RAIDStatus = 'open' | 'in_progress' | 'closed' | 'escalated'
type RAIDSeverity = 'low' | 'medium' | 'high' | 'critical'

interface RAIDItem {
  id: number
  category: RAIDCategory
  title: string
  description: string
  owner: string
  severity: RAIDSeverity
  status: RAIDStatus
  mitigation: string
  due: string
}

const RAID_COLORS: Record<RAIDCategory, string> = {
  risk: '#F43F5E',
  assumption: '#F59E0B',
  issue: '#7C3AED',
  dependency: '#1D4ED8',
}
const SEV_COLORS: Record<RAIDSeverity, string> = {
  low: '#4ADE80', medium: '#FBBF24', high: '#F59E0B', critical: '#F43F5E',
}

function RAIDLog({ task, onComplete }: Props) {
  const [items, setItems] = useState<RAIDItem[]>([
    { id: 1, category: 'risk', title: '', description: '', owner: '', severity: 'medium', status: 'open', mitigation: '', due: '' },
  ])
  const [activeTab, setActiveTab] = useState<RAIDCategory | 'all'>('all')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const nextId = () => Math.max(0, ...items.map(i => i.id)) + 1
  function addItem(cat: RAIDCategory = 'risk') {
    setItems(p => [...p, { id: nextId(), category: cat, title: '', description: '', owner: '', severity: 'medium', status: 'open', mitigation: '', due: '' }])
  }
  function removeItem(id: number) { setItems(p => p.filter(i => i.id !== id)) }
  function updateItem(id: number, field: keyof RAIDItem, value: string) {
    setItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const visible = activeTab === 'all' ? items : items.filter(i => i.category === activeTab)
  const cats: (RAIDCategory | 'all')[] = ['all', 'risk', 'assumption', 'issue', 'dependency']
  const catCounts = (c: RAIDCategory | 'all') => c === 'all' ? items.length : items.filter(i => i.category === c).length

  function submit() {
    const byCategory = (['risk', 'assumption', 'issue', 'dependency'] as RAIDCategory[]).map(cat => {
      const catItems = items.filter(i => i.category === cat)
      const label = cat.charAt(0).toUpperCase() + cat.slice(1) + 's'
      return `${label.toUpperCase()} (${catItems.length}):\n${catItems.length === 0 ? '  None' : catItems.map(i =>
        `  [${i.severity.toUpperCase()}/${i.status.toUpperCase()}] ${i.title}\n  → ${i.description}\n  Mitigation: ${i.mitigation || 'TBD'} | Owner: ${i.owner || 'TBD'} | Due: ${i.due || 'TBD'}`
      ).join('\n\n')}`
    }).join('\n\n')

    const doc = `RAID LOG
==================
Project RAID Register — ${new Date().toLocaleDateString('en-GB')}

${byCategory}

SUMMARY: ${items.length} items — ${items.filter(i => i.status === 'open').length} open, ${items.filter(i => i.severity === 'critical' || i.severity === 'high').length} high/critical
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'raid_log',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'All four RAID categories are represented where relevant',
        'Risks have clear mitigations and owners',
        'Issues are clearly described with resolution steps',
        'Dependencies are identified with clear impact if not met',
        'Severity ratings are consistent and well-calibrated',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>RAID Log</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setActiveTab(c)}
              style={{
                padding: '4px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
                background: activeTab === c ? (c === 'all' ? 'rgba(0,194,168,0.12)' : `${RAID_COLORS[c as RAIDCategory]}22`) : D.panel,
                border: `1px solid ${activeTab === c ? (c === 'all' ? D.accent : RAID_COLORS[c as RAIDCategory]) : D.border}`,
                color: activeTab === c ? (c === 'all' ? D.accent : RAID_COLORS[c as RAIDCategory]) : D.sub,
              }}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)} ({catCounts(c)})
            </button>
          ))}
          <button
            onClick={() => addItem(activeTab === 'all' ? 'risk' : activeTab as RAIDCategory)}
            style={{ padding: '4px 10px', fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}
          >+ Add</button>
        </div>
      </div>

      {visible.map(item => (
        <div key={item.id} style={{ background: D.panel, border: `1px solid ${D.border}`, borderLeft: `3px solid ${RAID_COLORS[item.category]}`, borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px 100px 100px 28px', gap: 8, marginBottom: 10 }}>
            <div>
              <label style={lbl}>Type</label>
              <select style={{ ...inp }} value={item.category} onChange={e => updateItem(item.id, 'category', e.target.value)}>
                {(['risk', 'assumption', 'issue', 'dependency'] as RAIDCategory[]).map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={lbl}>Title</label>
              <input style={inp} value={item.title} onChange={e => updateItem(item.id, 'title', e.target.value)} placeholder="Short title..." />
            </div>
            <div>
              <label style={lbl}>Severity</label>
              <select style={{ ...inp, borderColor: SEV_COLORS[item.severity] }} value={item.severity} onChange={e => updateItem(item.id, 'severity', e.target.value)}>
                {['low', 'medium', 'high', 'critical'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select style={{ ...inp }} value={item.status} onChange={e => updateItem(item.id, 'status', e.target.value)}>
                {['open', 'in_progress', 'closed', 'escalated'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Owner</label>
              <input style={inp} value={item.owner} onChange={e => updateItem(item.id, 'owner', e.target.value)} placeholder="Owner" />
            </div>
            <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14, paddingTop: 20 }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 8 }}>
            <div>
              <label style={lbl}>Description</label>
              <textarea style={{ ...ta, minHeight: 60 }} value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Detail..." />
            </div>
            <div>
              <label style={lbl}>Mitigation / Action</label>
              <textarea style={{ ...ta, minHeight: 60 }} value={item.mitigation} onChange={e => updateItem(item.id, 'mitigation', e.target.value)} placeholder="How are we addressing this?" />
            </div>
            <div>
              <label style={lbl}>Due Date</label>
              <input type="date" style={{ ...inp }} value={item.due} onChange={e => updateItem(item.id, 'due', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Gantt Timeline ────────────────────────────────────────────

interface GanttTask {
  id: number
  name: string
  owner: string
  startWeek: number
  endWeek: number
  status: 'not_started' | 'in_progress' | 'complete' | 'delayed'
  milestone: boolean
}

const GANTT_STATUS_COLORS: Record<string, string> = {
  not_started: '#334155',
  in_progress: '#1D4ED8',
  complete: '#14532D',
  delayed: '#7F1D1D',
}

function GanttTimeline({ task, onComplete }: Props) {
  const [weeks, setWeeks] = useState(8)
  const [tasks, setTasks] = useState<GanttTask[]>([
    { id: 1, name: '', owner: '', startWeek: 1, endWeek: 2, status: 'not_started', milestone: false },
  ])
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const nextId = () => Math.max(0, ...tasks.map(t => t.id)) + 1
  function addTask() {
    setTasks(p => [...p, { id: nextId(), name: '', owner: '', startWeek: 1, endWeek: 2, status: 'not_started', milestone: false }])
  }
  function removeTask(id: number) { setTasks(p => p.filter(t => t.id !== id)) }
  function updateTask(id: number, field: keyof GanttTask, value: string | boolean | number) {
    setTasks(p => p.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const weekNums = Array.from({ length: weeks }, (_, i) => i + 1)

  function submit() {
    const doc = `PROJECT GANTT TIMELINE
==================
Total Weeks: ${weeks}
Tasks: ${tasks.length}

SCHEDULE:
${tasks.map(t =>
  `  [W${t.startWeek}-W${t.endWeek}] ${t.name || '(unnamed)'}${t.milestone ? ' ★' : ''} — ${t.status.replace('_', ' ')}, Owner: ${t.owner || 'TBD'}`
).join('\n')}

STATUS SUMMARY:
  Not started: ${tasks.filter(t => t.status === 'not_started').length}
  In progress: ${tasks.filter(t => t.status === 'in_progress').length}
  Complete: ${tasks.filter(t => t.status === 'complete').length}
  Delayed: ${tasks.filter(t => t.status === 'delayed').length}
  Milestones: ${tasks.filter(t => t.milestone).length}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'gantt_plan',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Tasks cover all major workstreams for the project',
        'Task durations are realistic and well-scoped',
        'Key milestones are identified',
        'Dependencies are reflected in the sequencing',
        'Owners are assigned to all tasks',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Gantt Timeline</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: D.sub }}>Weeks:</span>
          {[4, 6, 8, 12].map(w => (
            <button key={w} onClick={() => setWeeks(w)} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, cursor: 'pointer', background: weeks === w ? 'rgba(0,194,168,0.12)' : D.panel, border: `1px solid ${weeks === w ? D.accent : D.border}`, color: weeks === w ? D.accent : D.sub }}>
              {w}
            </button>
          ))}
          <button onClick={addTask} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add task</button>
        </div>
      </div>

      {/* Gantt chart */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: `200px 100px ${weekNums.map(() => '1fr').join(' ')}`, borderBottom: `1px solid ${D.border}` }}>
          <div style={{ padding: '6px 10px', fontSize: 10, color: D.muted, fontWeight: 600 }}>TASK</div>
          <div style={{ padding: '6px 10px', fontSize: 10, color: D.muted, fontWeight: 600 }}>OWNER</div>
          {weekNums.map(w => (
            <div key={w} style={{ padding: '6px 4px', fontSize: 10, color: D.muted, textAlign: 'center', borderLeft: `1px solid ${D.border}` }}>W{w}</div>
          ))}
        </div>
        {/* Rows */}
        {tasks.map(t => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: `200px 100px ${weekNums.map(() => '1fr').join(' ')}`, borderBottom: `1px solid ${D.border}`, alignItems: 'center' }}>
            <div style={{ padding: '4px 10px' }}>
              <input
                style={{ ...inp, padding: '4px 6px', fontSize: 11 }}
                value={t.name}
                onChange={e => updateTask(t.id, 'name', e.target.value)}
                placeholder={t.milestone ? '★ Milestone' : 'Task name'}
              />
            </div>
            <div style={{ padding: '4px 6px' }}>
              <input
                style={{ ...inp, padding: '4px 6px', fontSize: 11 }}
                value={t.owner}
                onChange={e => updateTask(t.id, 'owner', e.target.value)}
                placeholder="Owner"
              />
            </div>
            {weekNums.map(w => {
              const active = w >= t.startWeek && w <= t.endWeek
              const isFirst = w === t.startWeek
              const isLast = w === t.endWeek
              return (
                <div
                  key={w}
                  onClick={() => {
                    if (w < t.startWeek) updateTask(t.id, 'startWeek', w)
                    else if (w > t.endWeek) updateTask(t.id, 'endWeek', w)
                    else if (w === t.startWeek && w < t.endWeek) updateTask(t.id, 'startWeek', w + 1)
                    else if (w === t.endWeek && w > t.startWeek) updateTask(t.id, 'endWeek', w - 1)
                  }}
                  style={{
                    height: 28, cursor: 'pointer', borderLeft: `1px solid ${D.border}`,
                    background: active ? GANTT_STATUS_COLORS[t.status] : 'transparent',
                    borderRadius: isFirst && isLast ? 4 : isFirst ? '4px 0 0 4px' : isLast ? '0 4px 4px 0' : 0,
                    position: 'relative',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Task settings below chart */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '10px 14px' }}>
        <div style={{ fontSize: 10, color: D.muted, fontWeight: 600, marginBottom: 8 }}>TASK SETTINGS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 120px 90px 28px', gap: 6, marginBottom: 6 }}>
          {['Task', 'Start W', 'End W', 'Status', 'Type', ''].map(h => (
            <div key={h} style={{ fontSize: 10, color: D.muted }}>{h}</div>
          ))}
        </div>
        {tasks.map(t => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 120px 90px 28px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: D.text }}>{t.name || '(unnamed)'}</span>
            <input type="number" style={{ ...inp, padding: '4px 6px' }} value={t.startWeek} min={1} max={weeks} onChange={e => updateTask(t.id, 'startWeek', +e.target.value)} />
            <input type="number" style={{ ...inp, padding: '4px 6px' }} value={t.endWeek} min={1} max={weeks} onChange={e => updateTask(t.id, 'endWeek', +e.target.value)} />
            <select style={{ ...inp }} value={t.status} onChange={e => updateTask(t.id, 'status', e.target.value)}>
              {['not_started', 'in_progress', 'complete', 'delayed'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <select style={{ ...inp }} value={t.milestone ? 'milestone' : 'task'} onChange={e => updateTask(t.id, 'milestone', e.target.value === 'milestone')}>
              <option value="task">Task</option>
              <option value="milestone">★ Milestone</option>
            </select>
            <button onClick={() => removeTask(t.id)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14 }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
          {Object.entries(GANTT_STATUS_COLORS).map(([s, c]) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              <span style={{ fontSize: 10, color: D.sub }}>{s.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Status Report ─────────────────────────────────────────────

type RAGStatus = 'green' | 'amber' | 'red'

const RAG_COLORS: Record<RAGStatus, string> = {
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
}
const RAG_LABELS: Record<RAGStatus, string> = {
  green: 'On Track',
  amber: 'At Risk',
  red: 'Off Track',
}

interface WorkstreamStatus {
  id: number
  name: string
  rag: RAGStatus
  comment: string
}

function StatusReport({ task, onComplete }: Props) {
  const [projectName, setProjectName] = useState('')
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10))
  const [period, setPeriod] = useState('')
  const [overallRAG, setOverallRAG] = useState<RAGStatus>('green')
  const [summaryUpdate, setSummaryUpdate] = useState('')
  const [workstreams, setWorkstreams] = useState<WorkstreamStatus[]>([
    { id: 1, name: 'Scope', rag: 'green', comment: '' },
    { id: 2, name: 'Schedule', rag: 'green', comment: '' },
    { id: 3, name: 'Budget', rag: 'green', comment: '' },
    { id: 4, name: 'Quality', rag: 'green', comment: '' },
  ])
  const [accomplishments, setAccomplishments] = useState('')
  const [nextPeriod, setNextPeriod] = useState('')
  const [escalations, setEscalations] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function updateWS(id: number, field: keyof WorkstreamStatus, value: string) {
    setWorkstreams(p => p.map(w => w.id === id ? { ...w, [field]: value } : w))
  }

  function submit() {
    const doc = `PROJECT STATUS REPORT
==================
Project: ${projectName}
Report Date: ${reportDate}
Period: ${period}
Overall Status: ${overallRAG.toUpperCase()} — ${RAG_LABELS[overallRAG]}

EXECUTIVE SUMMARY:
${summaryUpdate || '(empty)'}

WORKSTREAM STATUS:
${workstreams.map(w => `  ${w.rag.toUpperCase()} ${w.name}: ${w.comment || '(no comment)'}`).join('\n')}

ACCOMPLISHMENTS THIS PERIOD:
${accomplishments || '(empty)'}

PLANNED NEXT PERIOD:
${nextPeriod || '(empty)'}

ESCALATIONS / DECISIONS REQUIRED:
${escalations || 'None'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'status_report',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'RAG status is well-calibrated and supported by evidence',
        'Executive summary is concise and actionable (no jargon)',
        'Accomplishments are specific and quantified where possible',
        'Planned activities have clear owners and dates',
        'Escalations are clearly framed with decision required',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Status Report Builder</div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={row}>
          <div style={col}>
            <label style={lbl}>Project Name</label>
            <input style={inp} value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project name" />
          </div>
          <div style={col}>
            <label style={lbl}>Report Date</label>
            <input type="date" style={inp} value={reportDate} onChange={e => setReportDate(e.target.value)} />
          </div>
          <div style={col}>
            <label style={lbl}>Period Covered</label>
            <input style={inp} value={period} onChange={e => setPeriod(e.target.value)} placeholder="e.g. Week 3, Sprint 2" />
          </div>
        </div>

        <label style={lbl}>Overall Project Status</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['green', 'amber', 'red'] as RAGStatus[]).map(rag => (
            <button
              key={rag}
              onClick={() => setOverallRAG(rag)}
              style={{
                padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                background: overallRAG === rag ? `${RAG_COLORS[rag]}22` : D.panel,
                border: `2px solid ${overallRAG === rag ? RAG_COLORS[rag] : D.border}`,
                color: overallRAG === rag ? RAG_COLORS[rag] : D.muted,
              }}
            >
              ● {RAG_LABELS[rag]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>WORKSTREAM STATUS</div>
        {workstreams.map(w => (
          <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '120px auto 1fr', gap: 10, marginBottom: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: D.text }}>{w.name}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['green', 'amber', 'red'] as RAGStatus[]).map(rag => (
                <button
                  key={rag}
                  onClick={() => updateWS(w.id, 'rag', rag)}
                  style={{
                    width: 24, height: 24, borderRadius: 12, border: `2px solid ${w.rag === rag ? RAG_COLORS[rag] : D.border}`,
                    background: w.rag === rag ? `${RAG_COLORS[rag]}33` : 'transparent',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
            <input
              style={inp}
              value={w.comment}
              onChange={e => updateWS(w.id, 'comment', e.target.value)}
              placeholder={`${w.name} status comment...`}
            />
          </div>
        ))}
      </div>

      {[
        ['ACCOMPLISHMENTS THIS PERIOD', accomplishments, setAccomplishments, 'Bullet points of what was delivered...'],
        ['PLANNED NEXT PERIOD', nextPeriod, setNextPeriod, 'What will be completed in the next period?'],
        ['ESCALATIONS / DECISIONS REQUIRED', escalations, setEscalations, 'Issues requiring sponsor or steering group decision...'],
      ].map(([label, value, set, placeholder]) => (
        <div key={label as string} style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
          <label style={lbl}>{label as string}</label>
          <textarea style={{ ...ta, minHeight: 80 }} value={value as string} onChange={e => (set as any)(e.target.value)} placeholder={placeholder as string} />
        </div>
      ))}

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Executive Summary</label>
        <textarea style={{ ...ta, minHeight: 100 }} value={summaryUpdate} onChange={e => setSummaryUpdate(e.target.value)} placeholder="2-3 sentence summary suitable for a sponsor..." />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Stakeholder Comms ─────────────────────────────────────────

type PJMCommType = 'kickoff' | 'update' | 'escalation' | 'closure' | 'change_notice'

const PJM_TEMPLATES: Record<PJMCommType, { subject: string; body: string }> = {
  kickoff: {
    subject: 'Project Kickoff: {project_name} — {date}',
    body: `Hi all,

Welcome to the {project_name} project kickoff.

PROJECT OVERVIEW:
{overview}

OBJECTIVES:
• {objective_1}
• {objective_2}

TIMELINE: {start} → {end}
BUDGET: {budget}

TEAM:
{team}

NEXT STEPS:
• {next_1}
• {next_2}

Looking forward to working with everyone on this.`,
  },
  update: {
    subject: '[{project}] Weekly Status — {date} — {rag}',
    body: `Hi {stakeholders},

Here's this week's status for {project}.

OVERALL STATUS: {rag}

THIS WEEK:
{this_week}

NEXT WEEK:
{next_week}

RISKS / ISSUES:
{risks}

Full status report attached.`,
  },
  escalation: {
    subject: '[ESCALATION] {project}: {issue} — Decision Required by {deadline}',
    body: `Hi {name},

I'm writing to escalate an issue on {project} that requires your decision.

ISSUE:
{issue}

IMPACT IF UNRESOLVED:
{impact}

OPTIONS:
1. {option_1} — {pros_1}
2. {option_2} — {pros_2}

RECOMMENDATION: {recommendation}

I need a decision by {deadline} to keep the project on track.`,
  },
  closure: {
    subject: 'Project Closure: {project} — Completed {date}',
    body: `Hi all,

I'm pleased to confirm that {project} has been formally closed as of {date}.

DELIVERED:
{deliverables}

OUTCOMES vs OBJECTIVES:
{outcomes}

LESSONS LEARNED:
{lessons}

Thank you all for your contributions.`,
  },
  change_notice: {
    subject: 'Change Notice #{number}: {summary} — {project}',
    body: `Hi {stakeholders},

Please be advised of the following approved change to {project}.

CHANGE SUMMARY:
{summary}

IMPACT:
• Scope: {scope_impact}
• Schedule: {schedule_impact}
• Cost: {cost_impact}

REASON FOR CHANGE:
{reason}

APPROVED BY: {approver}
EFFECTIVE DATE: {effective_date}`,
  },
}

function StakeholderComms({ task, onComplete }: Props) {
  const [commType, setCommType] = useState<PJMCommType>('update')
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState(PJM_TEMPLATES.update.subject)
  const [body, setBody] = useState(PJM_TEMPLATES.update.body)
  const [context, setContext] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function loadTemplate(type: PJMCommType) {
    setCommType(type)
    setSubject(PJM_TEMPLATES[type].subject)
    setBody(PJM_TEMPLATES[type].body)
  }

  function submit() {
    const doc = `PROJECT MANAGER COMMUNICATION
==================
Type: ${commType.replace('_', ' ').toUpperCase()}
To: ${to}
Subject: ${subject}

--- MESSAGE ---
${body}

--- CONTEXT ---
${context || 'None'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'pm_communication',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Communication is clear and concise for the target audience',
        'Key project information (status, actions, risks) is communicated effectively',
        'Tone is professional and appropriate for the communication type',
        'Actions and owners are clearly stated',
        'All relevant stakeholders are addressed',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const typeLabels: Record<PJMCommType, string> = {
    kickoff: 'Kickoff',
    update: 'Status Update',
    escalation: 'Escalation',
    closure: 'Closure',
    change_notice: 'Change Notice',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Stakeholder Comms</div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(Object.keys(typeLabels) as PJMCommType[]).map(type => (
          <button
            key={type}
            onClick={() => loadTemplate(type)}
            style={{
              padding: '5px 12px', fontSize: 11, fontWeight: 500,
              background: commType === type ? 'rgba(0,194,168,0.12)' : D.panel,
              border: `1px solid ${commType === type ? D.accent : D.border}`,
              color: commType === type ? D.accent : D.sub,
              borderRadius: 6, cursor: 'pointer',
            }}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>To</label>
          <input style={inp} value={to} onChange={e => setTo(e.target.value)} placeholder="Recipients / stakeholder groups" />
        </div>
        <div>
          <label style={lbl}>Subject</label>
          <input style={inp} value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Message</label>
        <textarea style={{ ...ta, minHeight: 260, fontFamily: 'monospace', fontSize: 12 }} value={body} onChange={e => setBody(e.target.value)} />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Context (for evaluator)</label>
        <textarea style={{ ...ta, minHeight: 60 }} value={context} onChange={e => setContext(e.target.value)} placeholder="Project background, key constraints, recipient relationship..." />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Change Request Form ───────────────────────────────────────

type ChangeImpact = 'none' | 'minor' | 'moderate' | 'major'
type ChangeStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'deferred'

function ChangeRequest({ task, onComplete }: Props) {
  const [crNumber, setCrNumber] = useState(`CR-${new Date().getFullYear()}-001`)
  const [projectName, setProjectName] = useState('')
  const [requestedBy, setRequestedBy] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState<ChangeStatus>('draft')
  const [description, setDescription] = useState('')
  const [justification, setJustification] = useState('')
  const [scopeImpact, setScopeImpact] = useState<ChangeImpact>('none')
  const [scheduleImpact, setScheduleImpact] = useState<ChangeImpact>('none')
  const [costImpact, setCostImpact] = useState<ChangeImpact>('none')
  const [scheduleDelta, setScheduleDelta] = useState('')
  const [costDelta, setCostDelta] = useState('')
  const [scopeDetail, setScopeDetail] = useState('')
  const [risks, setRisks] = useState('')
  const [alternatives, setAlternatives] = useState('')
  const [approver, setApprover] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const IMPACT_COLORS_CR: Record<ChangeImpact, string> = { none: '#4ADE80', minor: '#94A3B8', moderate: '#F59E0B', major: '#F43F5E' }

  function submit() {
    const doc = `CHANGE REQUEST FORM
==================
CR Number: ${crNumber}
Project: ${projectName}
Requested By: ${requestedBy}
Date: ${date}
Status: ${status.replace('_', ' ').toUpperCase()}

CHANGE DESCRIPTION:
${description || '(empty)'}

JUSTIFICATION / REASON:
${justification || '(empty)'}

IMPACT ASSESSMENT:
  Scope: ${scopeImpact.toUpperCase()} — ${scopeDetail || 'No detail provided'}
  Schedule: ${scheduleImpact.toUpperCase()} — Delta: ${scheduleDelta || 'N/A'}
  Cost: ${costImpact.toUpperCase()} — Delta: ${costDelta || 'N/A'}

RISKS OF IMPLEMENTING CHANGE:
${risks || 'None identified'}

ALTERNATIVES CONSIDERED:
${alternatives || 'None'}

APPROVER: ${approver || 'TBD'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'change_request',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Change is clearly described and unambiguous',
        'Justification is compelling and business-driven',
        'Impact assessment covers scope, schedule, and cost',
        'Risks of implementing (and not implementing) are addressed',
        'Alternatives show due diligence in evaluation',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const impactSelector = (label: string, value: ChangeImpact, set: (v: ChangeImpact) => void) => (
    <div>
      <label style={lbl}>{label}</label>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['none', 'minor', 'moderate', 'major'] as ChangeImpact[]).map(v => (
          <button
            key={v}
            onClick={() => set(v)}
            style={{
              padding: '4px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
              background: value === v ? `${IMPACT_COLORS_CR[v]}22` : D.panel,
              border: `1px solid ${value === v ? IMPACT_COLORS_CR[v] : D.border}`,
              color: value === v ? IMPACT_COLORS_CR[v] : D.sub,
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Change Request Form</div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={row}>
          <div style={col}>
            <label style={lbl}>CR Number</label>
            <input style={inp} value={crNumber} onChange={e => setCrNumber(e.target.value)} />
          </div>
          <div style={col}>
            <label style={lbl}>Project Name</label>
            <input style={inp} value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project name" />
          </div>
          <div style={col}>
            <label style={lbl}>Requested By</label>
            <input style={inp} value={requestedBy} onChange={e => setRequestedBy(e.target.value)} placeholder="Your name" />
          </div>
          <div style={{ ...col, maxWidth: 130 }}>
            <label style={lbl}>Date</label>
            <input type="date" style={inp} value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div style={{ ...col, maxWidth: 140 }}>
            <label style={lbl}>Status</label>
            <select style={inp} value={status} onChange={e => setStatus(e.target.value as ChangeStatus)}>
              {['draft', 'pending_review', 'approved', 'rejected', 'deferred'].map(s => (
                <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Change Description</label>
        <textarea style={{ ...ta, minHeight: 80 }} value={description} onChange={e => setDescription(e.target.value)} placeholder="What exactly is being changed?" />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Justification</label>
        <textarea style={{ ...ta, minHeight: 70 }} value={justification} onChange={e => setJustification(e.target.value)} placeholder="Why is this change needed? What's the business driver?" />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 12 }}>IMPACT ASSESSMENT</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {impactSelector('Scope Impact', scopeImpact, setScopeImpact)}
          <div>
            <label style={lbl}>Scope Change Detail</label>
            <input style={inp} value={scopeDetail} onChange={e => setScopeDetail(e.target.value)} placeholder="What specifically changes in scope?" />
          </div>
          {impactSelector('Schedule Impact', scheduleImpact, setScheduleImpact)}
          <div>
            <label style={lbl}>Schedule Delta</label>
            <input style={inp} value={scheduleDelta} onChange={e => setScheduleDelta(e.target.value)} placeholder="e.g. +2 weeks, extends milestone by 5 days" />
          </div>
          {impactSelector('Cost Impact', costImpact, setCostImpact)}
          <div>
            <label style={lbl}>Cost Delta</label>
            <input style={inp} value={costDelta} onChange={e => setCostDelta(e.target.value)} placeholder="e.g. +£15,000 / -£5,000 saving" />
          </div>
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Risks of Implementing This Change</label>
        <textarea style={{ ...ta, minHeight: 70 }} value={risks} onChange={e => setRisks(e.target.value)} placeholder="What could go wrong?" />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Alternatives Considered</label>
        <textarea style={{ ...ta, minHeight: 70 }} value={alternatives} onChange={e => setAlternatives(e.target.value)} placeholder="What other options were evaluated?" />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Approver</label>
        <input style={inp} value={approver} onChange={e => setApprover(e.target.value)} placeholder="Who needs to approve this change?" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Workspace shell ────────────────────────────────────────────

export default function WorkspacePJM({ task, sessionId, onComplete }: Props) {
  const [tab, setTab] = useState('raid')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TaskBrief task={task} />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'raid'   && <RAIDLog          task={task} sessionId={sessionId} onComplete={onComplete} />}
      {tab === 'gantt'  && <GanttTimeline    task={task} sessionId={sessionId} onComplete={onComplete} />}
      {tab === 'status' && <StatusReport     task={task} sessionId={sessionId} onComplete={onComplete} />}
      {tab === 'comms'  && <StakeholderComms task={task} sessionId={sessionId} onComplete={onComplete} />}
      {tab === 'change' && <ChangeRequest    task={task} sessionId={sessionId} onComplete={onComplete} />}
    </div>
  )
}
