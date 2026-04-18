'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Task {
  id: string
  type: string
  title: string
  description: string
  urgency: string
  assigned_at: string
  due_at: string | null
  completed_at: string | null
  user_response: string | null
  decision_choice: string | null
  decision_quality: string | null
  score: number | null
  ai_feedback: string | null
  xp_earned: number
  xp_reward: number
}

const TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  email_reply:    { label: 'Email reply',   color: '#1F4E79', bg: '#EBF3FB' },
  decision:       { label: 'Decision',      color: '#7C3AED', bg: '#EEEDFE' },
  scope_decision: { label: 'Scope control', color: '#D97706', bg: '#FFF3CD' },
  document:       { label: 'Document',      color: '#166534', bg: '#DCFCE7' },
  standup:        { label: 'Standup',       color: '#0891B2', bg: '#E0F7FA' },
  report:         { label: 'Report',        color: '#991B1B', bg: '#FEE2E2' },
  meeting:        { label: 'Meeting',       color: '#64748B', bg: '#F1F5F9' },
}

const QUALITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  good:   { label: 'Good', color: '#166534', bg: '#DCFCE7' },
  medium: { label: 'OK',   color: '#854D0E', bg: '#FEF9C3' },
  bad:    { label: 'Poor', color: '#991B1B', bg: '#FEE2E2' },
}

type Tab = 'pending' | 'completed' | 'all'

interface Props {
  tasks: Task[]
  activeSession: any
  profile: any
}

export default function TasksClient({ tasks: initialTasks, activeSession, profile }: Props) {
  const [tasks, setTasks] = useState(initialTasks)
  const [tab, setTab] = useState<Tab>('pending')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [responding, setResponding] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const pending   = tasks.filter(t => !t.completed_at)
  const completed = tasks.filter(t =>  t.completed_at)
  const shown = tab === 'pending' ? pending : tab === 'completed' ? completed : tasks

  const totalXP  = completed.reduce((s, t) => s + (t.xp_earned ?? 0), 0)
  const avgScore = completed.filter(t => t.score).length
    ? Math.round(completed.filter(t => t.score).reduce((s, t) => s + (t.score ?? 0), 0) / completed.filter(t => t.score).length)
    : null

  async function submitResponse(task: Task) {
    if (!responseText.trim()) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/ai/score-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: task.id,
          career_path: profile?.career_path,
          task_type: task.type,
          task_title: task.title,
          task_description: task.description,
          rubric: getRubric(task.type),
          response: responseText,
        }),
      })

      const scored = await res.json()
      const xpEarned = Math.round((task.xp_reward ?? 30) * (scored.score / 100))

      // Update task in DB
      await supabase.from('tasks').update({
        completed_at: new Date().toISOString(),
        user_response: responseText,
        score: scored.score,
        decision_quality: scored.score >= 75 ? 'good' : scored.score >= 50 ? 'medium' : 'bad',
        ai_feedback: scored.summary,
        xp_earned: xpEarned,
      }).eq('id', task.id)

      // Update XP on profile
      await supabase.rpc('increment_xp', { user_id_input: profile?.id, xp_amount: xpEarned })

      // Update local state
      setTasks(prev => prev.map(t => t.id === task.id ? {
        ...t,
        completed_at: new Date().toISOString(),
        user_response: responseText,
        score: scored.score,
        decision_quality: scored.score >= 75 ? 'good' : scored.score >= 50 ? 'medium' : 'bad',
        ai_feedback: scored.summary,
        xp_earned: xpEarned,
      } : t))

      ;(window as any).espToast?.(
        scored.score >= 75
          ? `Task completed — ${scored.score}/100. +${xpEarned} XP`
          : `Submitted — ${scored.score}/100. ${scored.improvements?.[0] ?? 'Review feedback below.'}`,
        scored.score >= 75 ? 'success' : 'info'
      )

      setResponding(null)
      setResponseText('')
      router.refresh()
    } catch {
      ;(window as any).espToast?.('Failed to submit. Try again.', 'error')
    }

    setSubmitting(false)
  }

  function getRubric(type: string): string[] {
    const rubrics: Record<string, string[]> = {
      email_reply:    ['Professional tone', 'Addresses the concern directly', 'Clear and concise', 'States a clear next action'],
      decision:       ['Clear reasoning provided', 'Considers consequences', 'Actionable recommendation', 'Appropriate escalation if needed'],
      scope_decision: ['Acknowledges the request', 'Assesses impact on timeline and budget', 'Presents options with trade-offs', 'Professional communication'],
      document:       ['Covers all required areas', 'Clear structure', 'Accurate content', 'Appropriate detail level'],
      standup:        ['Covers yesterday, today, blockers', 'Concise - under 100 words', 'Flags any risks or dependencies', 'Professional tone'],
      report:         ['Accurate analysis', 'Clear structure with key findings', 'Actionable recommendations', 'Appropriate detail for the audience'],
    }
    return rubrics[type] ?? rubrics.document
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Pending tasks', val: pending.length,                        color: '#D97706' },
          { label: 'Completed',     val: completed.length,                      color: '#166534' },
          { label: 'XP earned',     val: totalXP,                               color: '#1F4E79' },
          { label: 'Avg score',     val: avgScore ? `${avgScore}/100` : '—',    color: '#7C3AED' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* No session warning */}
      {!activeSession && pending.length === 0 && (
        <div style={{ background: '#EBF3FB', border: '0.5px solid #BFDBFE', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#1E40AF' }}>
          Clock in from the Dashboard to receive today's tasks from your AI coworkers.
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 8, padding: 3, width: 'fit-content' }}>
        {([
          ['pending',   `Pending (${pending.length})`],
          ['completed', `Completed (${completed.length})`],
          ['all',       'All'],
        ] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 14px', border: 'none', borderRadius: 6, fontSize: 12,
            background: tab === t ? '#fff' : 'transparent',
            color: tab === t ? '#1F4E79' : '#64748B',
            fontWeight: tab === t ? 500 : 400, cursor: 'pointer',
            boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shown.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: 13 }}>
            {tab === 'pending' ? 'No pending tasks — clock in to receive new ones.' : 'No completed tasks yet.'}
          </div>
        )}

        {shown.map(task => {
          const typeConf  = TYPE_LABELS[task.type] ?? TYPE_LABELS.meeting
          const qualConf  = task.decision_quality ? QUALITY_CONFIG[task.decision_quality] : null
          const isExpanded = expanded === task.id
          const isResponding = responding === task.id
          const isOverdue  = !task.completed_at && task.due_at && new Date(task.due_at) < new Date()

          return (
            <div key={task.id} style={{
              background: '#fff',
              border: `0.5px solid ${isOverdue ? '#FCA5A5' : task.completed_at ? '#E2E8F0' : '#CBD5E1'}`,
              borderLeft: task.urgency === 'urgent' && !task.completed_at
                ? '3px solid #DC2626'
                : task.completed_at ? '3px solid #86EFAC' : '3px solid transparent',
              borderRadius: 10, overflow: 'hidden',
            }}>
              {/* Task header row */}
              <div
                onClick={() => {
                  setExpanded(isExpanded ? null : task.id)
                  if (isResponding) setResponding(null)
                }}
                style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start' }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  background: task.completed_at ? '#DCFCE7' : '#F1F5F9',
                  border: `0.5px solid ${task.completed_at ? '#86EFAC' : '#CBD5E1'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#166534',
                }}>
                  {task.completed_at ? '✓' : ''}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: task.completed_at ? '#64748B' : '#0F172A', textDecoration: task.completed_at ? 'line-through' : 'none', flex: 1 }}>
                      {task.title}
                    </span>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: typeConf.bg, color: typeConf.color, fontWeight: 500, flexShrink: 0 }}>
                      {typeConf.label}
                    </span>
                    {qualConf && (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: qualConf.bg, color: qualConf.color, fontWeight: 500 }}>
                        {qualConf.label}
                      </span>
                    )}
                    {task.urgency === 'urgent' && !task.completed_at && (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: '#FEE2E2', color: '#991B1B', fontWeight: 500 }}>
                        Urgent
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>
                      Assigned {new Date(task.assigned_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {task.due_at && !task.completed_at && (
                      <span style={{ fontSize: 11, color: isOverdue ? '#DC2626' : '#D97706', fontWeight: isOverdue ? 500 : 400 }}>
                        {isOverdue ? 'Overdue' : `Due ${new Date(task.due_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                    )}
                    {task.xp_earned > 0 && (
                      <span style={{ fontSize: 11, color: '#166534' }}>+{task.xp_earned} XP</span>
                    )}
                    {task.score != null && (
                      <span style={{ fontSize: 11, color: task.score >= 75 ? '#166534' : task.score >= 55 ? '#854D0E' : '#991B1B', fontWeight: 500 }}>
                        {task.score}/100
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: 10, color: '#94A3B8', flexShrink: 0, marginTop: 4 }}>
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ borderTop: '0.5px solid #F1F5F9', padding: '12px 14px', background: '#F8FAFC' }}>
                  {task.description && (
                    <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65, marginBottom: 12, whiteSpace: 'pre-wrap' }}>
                      {task.description}
                    </div>
                  )}

                  {task.ai_feedback && (
                    <div style={{ background: '#EBF3FB', borderLeft: '3px solid #1F4E79', padding: '10px 12px', borderRadius: '0 8px 8px 0', fontSize: 12, color: '#1E40AF', lineHeight: 1.5, marginBottom: 12 }}>
                      <span style={{ fontWeight: 500 }}>Manager feedback: </span>{task.ai_feedback}
                    </div>
                  )}

                  {task.user_response && (
                    <div style={{ background: '#F8FAFC', border: '0.5px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#374151', lineHeight: 1.5, marginBottom: 12 }}>
                      <span style={{ fontWeight: 500, color: '#64748B', display: 'block', marginBottom: 4 }}>Your response:</span>
                      {task.user_response}
                    </div>
                  )}

                  {!task.completed_at && !isResponding && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setResponding(task.id); setResponseText('') }}
                      style={{ padding: '7px 14px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                    >
                      Complete this task →
                    </button>
                  )}

                  {/* Response input */}
                  {isResponding && !task.completed_at && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>
                        Scored on: {getRubric(task.type).join(' · ')}
                      </div>
                      <textarea
                        value={responseText}
                        onChange={e => setResponseText(e.target.value)}
                        placeholder={getPlaceholder(task.type)}
                        rows={5}
                        autoFocus
                        style={{ width: '100%', resize: 'vertical', padding: '10px 12px', border: '0.5px solid #CBD5E1', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', lineHeight: 1.6, outline: 'none', boxSizing: 'border-box' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>{responseText.split(/\s+/).filter(Boolean).length} words · {task.xp_reward} XP available</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => { setResponding(null); setResponseText('') }}
                            style={{ padding: '7px 14px', background: 'transparent', color: '#64748B', border: '0.5px solid #E2E8F0', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => submitResponse(task)}
                            disabled={!responseText.trim() || submitting}
                            style={{ padding: '7px 14px', background: responseText.trim() ? '#1F4E79' : '#E2E8F0', color: responseText.trim() ? '#fff' : '#94A3B8', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: responseText.trim() ? 'pointer' : 'not-allowed' }}
                          >
                            {submitting ? 'Scoring...' : 'Submit →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getPlaceholder(type: string): string {
  const placeholders: Record<string, string> = {
    email_reply:    'Write your professional reply here...',
    decision:       'State your decision and explain your reasoning...',
    scope_decision: 'Describe how you would handle this scope change...',
    document:       'Write your document response here...',
    standup:        'Yesterday: ...\nToday: ...\nBlockers: ...',
    report:         'Write your analysis and findings here...',
  }
  return placeholders[type] ?? 'Write your response here...'
}

function getRubric(type: string): string[] {
  const rubrics: Record<string, string[]> = {
    email_reply:    ['Professional tone', 'Addresses concern directly', 'Concise', 'Clear next action'],
    decision:       ['Clear reasoning', 'Considers consequences', 'Actionable', 'Appropriate escalation'],
    scope_decision: ['Acknowledges request', 'Assesses impact', 'Presents options', 'Professional'],
    document:       ['Covers required areas', 'Clear structure', 'Accurate', 'Right detail level'],
    standup:        ['Yesterday / today / blockers', 'Under 100 words', 'Flags risks', 'Professional'],
    report:         ['Accurate analysis', 'Clear findings', 'Recommendations', 'Right audience level'],
  }
  return rubrics[type] ?? rubrics.document
}
