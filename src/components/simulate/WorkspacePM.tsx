'use client'

import { useState } from 'react'
import { TabBar, TaskBrief, SubmitBtn, ResultPanel, evalSubmit, ArtefactPanel, SubmissionModeBar, AlternateSubmitForm, SubmissionMode, inp, lbl, ta, row, col, D } from './shared'

interface Props {
  task: any
  sessionId: string
  onComplete: (result: any) => void
  initialTab?: string
  careerPath?: string
}

const TABS = [
  { id: 'story',     label: 'User Story' },
  { id: 'roadmap',   label: 'Roadmap' },
  { id: 'prd',       label: 'PRD' },
  { id: 'comms',     label: 'Stakeholder Comms' },
]

// ── User Story Editor ──────────────────────────────────────────

interface AcceptanceCriterion { id: number; text: string; done: boolean }

function UserStoryEditor({ task, onComplete }: Props) {
  const [persona, setPersona] = useState('')
  const [goal, setGoal] = useState('')
  const [benefit, setBenefit] = useState('')
  const [priority, setPriority] = useState('medium')
  const [storyPoints, setStoryPoints] = useState('3')
  const [criteria, setCriteria] = useState<AcceptanceCriterion[]>([
    { id: 1, text: '', done: false },
  ])
  const [notes, setNotes] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const nextId = () => Math.max(0, ...criteria.map(c => c.id)) + 1
  function addCriterion() { setCriteria(c => [...c, { id: nextId(), text: '', done: false }]) }
  function removeCriterion(id: number) { setCriteria(c => c.filter(x => x.id !== id)) }
  function updateCriterion(id: number, text: string) {
    setCriteria(c => c.map(x => x.id === id ? { ...x, text } : x))
  }

  function submit() {
    const storyLine = `As a ${persona}, I want to ${goal}, so that ${benefit}.`
    const doc = `USER STORY
==================
${storyLine}

Priority: ${priority.toUpperCase()}
Story Points: ${storyPoints}

ACCEPTANCE CRITERIA:
${criteria.map((c, i) => `  ${i + 1}. ${c.text || '(empty)'}`).join('\n')}

NOTES / CONTEXT:
${notes || 'None'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'user_story',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Story follows the standard "As a [persona], I want [goal], so that [benefit]" format',
        'Persona is clearly defined and represents a real user segment',
        'Goal is specific and actionable, not vague',
        'Acceptance criteria are testable and cover happy path and edge cases',
        'Story points are reasonable relative to scope',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const priorityColors: Record<string, string> = { low: '#4ADE80', medium: '#FBBF24', high: '#F59E0B', critical: '#F43F5E' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        User Story Editor
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 12 }}>STORY STATEMENT</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: D.muted }}>As a</span>
          <input
            style={{ ...inp, width: 180 }}
            value={persona}
            onChange={e => setPersona(e.target.value)}
            placeholder="persona / user type"
          />
          <span style={{ fontSize: 12, color: D.muted }}>, I want to</span>
          <input
            style={{ ...inp, flex: 1, minWidth: 200 }}
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="goal / action"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: D.muted }}>so that</span>
          <input
            style={{ ...inp, flex: 1 }}
            value={benefit}
            onChange={e => setBenefit(e.target.value)}
            placeholder="benefit / outcome"
          />
        </div>
      </div>

      <div style={{ ...row }}>
        <div style={col}>
          <label style={lbl}>Priority</label>
          <select
            style={{ ...inp }}
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            {['low', 'medium', 'high', 'critical'].map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
          <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
            {['low', 'medium', 'high', 'critical'].map(p => (
              <div
                key={p}
                style={{
                  height: 4, flex: 1, borderRadius: 2,
                  background: ['low', 'medium', 'high', 'critical'].indexOf(p) <=
                    ['low', 'medium', 'high', 'critical'].indexOf(priority)
                    ? priorityColors[priority] : D.border,
                }}
              />
            ))}
          </div>
        </div>
        <div style={col}>
          <label style={lbl}>Story Points</label>
          <select style={{ ...inp }} value={storyPoints} onChange={e => setStoryPoints(e.target.value)}>
            {['1', '2', '3', '5', '8', '13', '21'].map(p => (
              <option key={p} value={p}>{p} {p === '1' ? '(trivial)' : p === '3' ? '(small)' : p === '5' ? '(medium)' : p === '8' ? '(large)' : p === '13' ? '(very large)' : p === '21' ? '(epic — split?)' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>ACCEPTANCE CRITERIA</div>
          <button onClick={addCriterion} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add criterion</button>
        </div>
        {criteria.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 11, color: D.muted, paddingTop: 8, minWidth: 18, textAlign: 'right' }}>{i + 1}.</div>
            <input
              style={{ ...inp, flex: 1 }}
              value={c.text}
              onChange={e => updateCriterion(c.id, e.target.value)}
              placeholder={`Given / When / Then or plain criterion...`}
            />
            <button
              onClick={() => removeCriterion(c.id)}
              style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14, paddingTop: 4 }}
            >×</button>
          </div>
        ))}
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 8 }}>NOTES / CONTEXT</div>
        <textarea
          style={{ ...ta, minHeight: 70 }}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Additional context, dependencies, constraints, out-of-scope items..."
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Roadmap Builder ────────────────────────────────────────────

type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'
type Status = 'planned' | 'in_progress' | 'complete' | 'at_risk' | 'cut'

interface RoadmapItem {
  id: number
  theme: string
  feature: string
  quarter: Quarter
  status: Status
  impact: 'low' | 'medium' | 'high'
  effort: 'S' | 'M' | 'L' | 'XL'
  owner: string
}

const STATUS_COLORS: Record<Status, string> = {
  planned: '#334155',
  in_progress: '#1D4ED8',
  complete: '#14532D',
  at_risk: '#92400E',
  cut: '#3D1A1A',
}
const STATUS_LABELS: Record<Status, string> = {
  planned: 'Planned', in_progress: 'In Progress', complete: 'Complete', at_risk: 'At Risk', cut: 'Cut',
}
const IMPACT_COLORS: Record<string, string> = { low: '#4A5568', medium: '#F59E0B', high: '#00C2A8' }

function RoadmapBuilder({ task, onComplete }: Props) {
  const [items, setItems] = useState<RoadmapItem[]>([
    { id: 1, theme: '', feature: '', quarter: 'Q1', status: 'planned', impact: 'medium', effort: 'M', owner: '' },
  ])
  const [vision, setVision] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'list' | 'grid'>('grid')

  const nextId = () => Math.max(0, ...items.map(i => i.id)) + 1
  function addItem() {
    setItems(prev => [...prev, { id: nextId(), theme: '', feature: '', quarter: 'Q1', status: 'planned', impact: 'medium', effort: 'M', owner: '' }])
  }
  function removeItem(id: number) { setItems(prev => prev.filter(i => i.id !== id)) }
  function updateItem(id: number, field: keyof RoadmapItem, value: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4']

  function submit() {
    const byQ = quarters.map(q => {
      const qItems = items.filter(i => i.quarter === q)
      return `${q}:\n${qItems.length === 0 ? '  (none)' : qItems.map(i =>
        `  [${i.status.toUpperCase()}] ${i.feature} — Theme: ${i.theme}, Impact: ${i.impact}, Effort: ${i.effort}, Owner: ${i.owner || 'TBD'}`
      ).join('\n')}`
    }).join('\n\n')

    const doc = `PRODUCT ROADMAP
==================
Vision: ${vision || 'Not specified'}

QUARTERLY BREAKDOWN:
${byQ}

SUMMARY: ${items.length} items across ${quarters.filter(q => items.some(i => i.quarter === q)).length} quarters
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'product_roadmap',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Roadmap has a clear vision statement that guides prioritisation',
        'Features are logically sequenced across quarters (dependencies respected)',
        'Impact and effort ratings are consistent and justifiable',
        'Themes group related work coherently',
        'High-impact, low-effort items are prioritised early',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Roadmap Builder
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Product Vision / North Star</label>
        <input style={inp} value={vision} onChange={e => setVision(e.target.value)} placeholder="What outcome are we driving toward this year?" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>ROADMAP ITEMS</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setView('grid')} style={{ fontSize: 11, color: view === 'grid' ? D.accent : D.muted, background: 'none', border: 'none', cursor: 'pointer' }}>Grid view</button>
          <button onClick={() => setView('list')} style={{ fontSize: 11, color: view === 'list' ? D.accent : D.muted, background: 'none', border: 'none', cursor: 'pointer' }}>List view</button>
          <button onClick={addItem} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add item</button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {quarters.map(q => (
            <div key={q} style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '10px 12px', minHeight: 120 }}>
              <div style={{ fontSize: 11, color: D.accent, fontWeight: 600, marginBottom: 8 }}>{q}</div>
              {items.filter(i => i.quarter === q).map(item => (
                <div key={item.id} style={{ marginBottom: 6, padding: '6px 8px', background: STATUS_COLORS[item.status], borderRadius: 6, borderLeft: `3px solid ${IMPACT_COLORS[item.impact]}` }}>
                  <div style={{ fontSize: 11, color: D.text, fontWeight: 500, marginBottom: 2 }}>{item.feature || '(unnamed)'}</div>
                  <div style={{ fontSize: 10, color: D.sub }}>{item.effort} effort · {STATUS_LABELS[item.status]}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 70px 120px 80px 60px 1fr 28px', gap: 6, marginBottom: 8 }}>
          {['Theme', 'Feature', 'Q', 'Status', 'Impact', 'Effort', 'Owner', ''].map(h => (
            <div key={h} style={{ fontSize: 10, color: D.muted, fontWeight: 600, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {items.map(item => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 70px 120px 80px 60px 1fr 28px', gap: 6, marginBottom: 6 }}>
            <input style={inp} value={item.theme} onChange={e => updateItem(item.id, 'theme', e.target.value)} placeholder="Theme" />
            <input style={inp} value={item.feature} onChange={e => updateItem(item.id, 'feature', e.target.value)} placeholder="Feature name" />
            <select style={{ ...inp }} value={item.quarter} onChange={e => updateItem(item.id, 'quarter', e.target.value)}>
              {quarters.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <select style={{ ...inp }} value={item.status} onChange={e => updateItem(item.id, 'status', e.target.value)}>
              {(Object.keys(STATUS_LABELS) as Status[]).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            <select style={{ ...inp }} value={item.impact} onChange={e => updateItem(item.id, 'impact', e.target.value)}>
              {['low', 'medium', 'high'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select style={{ ...inp }} value={item.effort} onChange={e => updateItem(item.id, 'effort', e.target.value)}>
              {['S', 'M', 'L', 'XL'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <input style={inp} value={item.owner} onChange={e => updateItem(item.id, 'owner', e.target.value)} placeholder="Owner" />
            <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14 }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── PRD Writer ────────────────────────────────────────────────

function PRDWriter({ task, onComplete }: Props) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState('draft')
  const [overview, setOverview] = useState('')
  const [problem, setProblem] = useState('')
  const [goals, setGoals] = useState('')
  const [nonGoals, setNonGoals] = useState('')
  const [userResearch, setUserResearch] = useState('')
  const [requirements, setRequirements] = useState('')
  const [metrics, setMetrics] = useState('')
  const [timeline, setTimeline] = useState('')
  const [risks, setRisks] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function submit() {
    const doc = `PRODUCT REQUIREMENTS DOCUMENT
==================
Title: ${title}
Author: ${author}
Status: ${status.toUpperCase()}
Date: ${new Date().toLocaleDateString('en-GB')}

1. OVERVIEW
${overview || '(empty)'}

2. PROBLEM STATEMENT
${problem || '(empty)'}

3. GOALS
${goals || '(empty)'}

4. NON-GOALS (OUT OF SCOPE)
${nonGoals || '(empty)'}

5. USER RESEARCH & INSIGHTS
${userResearch || '(empty)'}

6. REQUIREMENTS
${requirements || '(empty)'}

7. SUCCESS METRICS
${metrics || '(empty)'}

8. TIMELINE & MILESTONES
${timeline || '(empty)'}

9. RISKS & MITIGATIONS
${risks || '(empty)'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'prd',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Problem statement clearly articulates user pain and business impact',
        'Goals are specific and measurable (SMART)',
        'Non-goals prevent scope creep by explicitly excluding items',
        'Requirements are clear and complete, covering functional needs',
        'Success metrics are quantifiable and tied to stated goals',
        'Risks are identified with concrete mitigation strategies',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const section = (label: string, value: string, set: (v: string) => void, placeholder: string, minH = 80) => (
    <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
      <label style={lbl}>{label}</label>
      <textarea style={{ ...ta, minHeight: minH }} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        PRD Writer
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={row}>
          <div style={col}>
            <label style={lbl}>Document Title</label>
            <input style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Feature / initiative name" />
          </div>
          <div style={col}>
            <label style={lbl}>Author</label>
            <input style={inp} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name" />
          </div>
          <div style={{ ...col, maxWidth: 120 }}>
            <label style={lbl}>Status</label>
            <select style={{ ...inp }} value={status} onChange={e => setStatus(e.target.value)}>
              {['draft', 'in_review', 'approved', 'deprecated'].map(s => (
                <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {section('Overview', overview, setOverview, 'Brief description of the initiative and its context...')}
      {section('Problem Statement', problem, setProblem, 'What user/business problem are we solving? What evidence do we have?')}
      {section('Goals', goals, setGoals, 'What does success look like? Be specific and measurable...')}
      {section('Non-Goals', nonGoals, setNonGoals, 'What is explicitly out of scope for this iteration?')}
      {section('User Research & Insights', userResearch, setUserResearch, 'Key findings from user interviews, surveys, data analysis...')}
      {section('Requirements', requirements, setRequirements, 'Functional and non-functional requirements. Use numbered list format...', 120)}
      {section('Success Metrics', metrics, setMetrics, 'How will we measure success? Include baseline and target values...')}
      {section('Timeline & Milestones', timeline, setTimeline, 'Key dates, phases, dependencies...')}
      {section('Risks & Mitigations', risks, setRisks, 'Technical, business, or execution risks and how we\'ll address them...')}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Stakeholder Comms ─────────────────────────────────────────

type CommType = 'update' | 'launch' | 'escalation' | 'feedback_request' | 'roadmap_review'

const COMM_TEMPLATES: Record<CommType, { subject: string; body: string }> = {
  update: {
    subject: '[Product Update] {feature} — Week {n}',
    body: `Hi team,

Here's your weekly product update on {feature}.

STATUS: {status}

WHAT WE SHIPPED:
• {shipped}

WHAT'S NEXT:
• {next}

METRICS:
• {metrics}

Any questions, reply here or catch me in #product-updates.

Thanks,
{name}`,
  },
  launch: {
    subject: '🚀 Launching {feature} — {date}',
    body: `Hi {audience},

Excited to share that we're launching {feature} on {date}.

WHAT IT DOES:
{description}

WHO IT'S FOR:
{target_users}

HOW TO ACCESS:
{access}

For questions: {contact}`,
  },
  escalation: {
    subject: '[ESCALATION] {issue} — Action Required',
    body: `Hi {name},

I'm escalating {issue} as it requires your input.

SITUATION:
{situation}

IMPACT:
{impact}

OPTIONS:
1. {option_1}
2. {option_2}

RECOMMENDATION: {recommendation}

I need a decision by {deadline}.`,
  },
  feedback_request: {
    subject: 'Quick feedback needed: {feature}',
    body: `Hi {name},

We're finalising the direction for {feature} and your input would be invaluable.

CONTEXT:
{context}

WHAT I'D LOVE YOUR THOUGHTS ON:
• {question_1}
• {question_2}

Happy to chat for 15 minutes — {availability}.`,
  },
  roadmap_review: {
    subject: 'Roadmap Review Request — {quarter}',
    body: `Hi {name},

Sharing the draft {quarter} roadmap for your review ahead of our planning session.

KEY THEMES:
{themes}

TOP ITEMS:
{items}

OPEN QUESTIONS FOR DISCUSSION:
{questions}

Please review by {deadline} and add comments in {link}.`,
  },
}

function StakeholderComms({ task, onComplete }: Props) {
  const [commType, setCommType] = useState<CommType>('update')
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState(COMM_TEMPLATES.update.subject)
  const [body, setBody] = useState(COMM_TEMPLATES.update.body)
  const [context, setContext] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function loadTemplate(type: CommType) {
    setCommType(type)
    const t = COMM_TEMPLATES[type]
    setSubject(t.subject)
    setBody(t.body)
  }

  function submit() {
    const doc = `STAKEHOLDER COMMUNICATION
==================
Type: ${commType.replace('_', ' ').toUpperCase()}
To: ${to}
Subject: ${subject}

--- BODY ---
${body}

--- CONTEXT / NOTES ---
${context || 'None'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'stakeholder_comms',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Subject line is clear and actionable',
        'Communication is appropriately concise for the audience',
        'Key information (status, decisions, actions) is clearly communicated',
        'Tone is professional and matches the communication type',
        'Clear next steps or call to action is included',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const typeLabels: Record<CommType, string> = {
    update: 'Status Update',
    launch: 'Launch Announce',
    escalation: 'Escalation',
    feedback_request: 'Feedback Request',
    roadmap_review: 'Roadmap Review',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Stakeholder Comms
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(Object.keys(typeLabels) as CommType[]).map(type => (
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
          <input style={inp} value={to} onChange={e => setTo(e.target.value)} placeholder="Recipients, team, stakeholder group" />
        </div>
        <div>
          <label style={lbl}>Subject</label>
          <input style={inp} value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Message Body</label>
        <textarea
          style={{ ...ta, minHeight: 260, fontFamily: 'monospace', fontSize: 12 }}
          value={body}
          onChange={e => setBody(e.target.value)}
        />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Context / Background (for evaluator)</label>
        <textarea
          style={{ ...ta, minHeight: 60 }}
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="What prompted this communication? Any key decisions or constraints?"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Workspace shell ────────────────────────────────────────────

export default function WorkspacePM({ task, sessionId, onComplete, initialTab, careerPath }: Props) {
  const [tab, setTab] = useState(initialTab ?? 'story')
  const [subMode, setSubMode] = useState<SubmissionMode>('native')

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      {task.artefact_content && <ArtefactPanel task={task} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        <TaskBrief task={task} />
        <SubmissionModeBar mode={subMode} onChange={setSubMode} />
        {subMode === 'native' ? (
          <>
            <TabBar tabs={TABS} active={tab} onChange={setTab} />
            {tab === 'story'   && <UserStoryEditor   task={task} sessionId={sessionId} onComplete={onComplete} />}
            {tab === 'roadmap' && <RoadmapBuilder     task={task} sessionId={sessionId} onComplete={onComplete} />}
            {tab === 'prd'     && <PRDWriter          task={task} sessionId={sessionId} onComplete={onComplete} />}
            {tab === 'comms'   && <StakeholderComms   task={task} sessionId={sessionId} onComplete={onComplete} />}
          </>
        ) : (
          <AlternateSubmitForm mode={subMode} task={task} onComplete={onComplete} careerPath={careerPath} />
        )}
      </div>
    </div>
  )
}
