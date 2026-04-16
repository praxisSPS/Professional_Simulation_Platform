'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TaskOption {
  feedback?: string
  id: string
  text: string
  quality?: string
}

interface Task {
  id: string
  title: string
  type: string
  description: string
  urgency: string
  options?: TaskOption[]
  xp_reward?: number
  due_at?: string
  session_id?: string
}

interface Props {
  task: Task
  sessionId: string
  onComplete: (result: any) => void
}

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  urgent:  { label: 'Urgent',  color: '#F43F5E', bg: 'rgba(244,63,94,0.08)' },
  high:    { label: 'High',    color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  normal:  { label: 'Normal',  color: '#00C2A8', bg: 'rgba(0,194,168,0.08)' },
}

const TYPE_CONFIG: Record<string, { label: string; icon: string }> = {
  decision:       { label: 'Decision',      icon: '⚡' },
  scope_decision: { label: 'Scope control', icon: '🎯' },
  email_reply:    { label: 'Email reply',   icon: '✉️' },
  document:       { label: 'Document',      icon: '📄' },
  standup:        { label: 'Standup',       icon: '🎤' },
  report:         { label: 'Report',        icon: '📊' },
}

export default function SimTaskPanel({ task, sessionId, onComplete }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [freeText, setFreeText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const urgencyConf = URGENCY_CONFIG[task.urgency] ?? URGENCY_CONFIG.normal
  const typeConf = TYPE_CONFIG[task.type] ?? { label: task.type, icon: '📋' }

  // Decision tasks use option selection
  const isDecision = task.type === 'decision' || task.type === 'scope_decision'
  // Free text tasks
  const isFreeText = ['email_reply', 'document', 'standup', 'report'].includes(task.type)

  const canSubmit = isDecision ? !!selectedOption : freeText.trim().length > 20

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const body: any = {
        task_id: task.id,
        session_id: sessionId,
        task_type: task.type,
      }

      if (isDecision && selectedOption) {
        body.decision_choice = selectedOption
        // Determine quality from the option
        const opt = (task.options ?? []).find((o: any) => o.id === selectedOption)
        body.decision_quality = opt?.quality ?? 'medium'
        body.user_response = opt?.text ?? ''
      } else {
        body.user_response = freeText
        // Score free text via AI
        const scoreRes = await fetch('/api/ai/score-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task_type: task.type,
            response: freeText,
            rubric: [
              'Clear and professional communication',
              'Addresses the core issue directly',
              'Appropriate level of detail for the context',
              'Actionable — the reader knows what happens next',
            ],
          }),
        })
        const scored = await scoreRes.json()
        body.decision_quality = scored.score >= 75 ? 'good' : scored.score >= 50 ? 'medium' : 'bad'
        body.ai_score = scored.score
        body.ai_feedback = scored.summary
      }

      const res = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setResult({ ...data, decision_choice: selectedOption, task_type: task.type })
      onComplete(data)

      // Show level up if triggered
      if (data.level_up) {
        window.dispatchEvent(new CustomEvent('esp:levelup', { detail: data.level_up }))
      }

      // Toast
      const xp = data.xp_earned ?? 0
      const quality = body.decision_quality
      ;(window as any).espToast?.(
        quality === 'good'
          ? `+${xp} XP — Strong decision. KPIs updated.`
          : quality === 'medium'
          ? `+${xp} XP — Acceptable. Review the feedback.`
          : `Task completed. Review the feedback to improve your KPIs.`,
        quality === 'good' ? 'success' : quality === 'medium' ? 'info' : 'info'
      )

      router.refresh()
    } catch (e) {
      ;(window as any).espToast?.('Submission failed. Try again.', 'error')
    }
    setSubmitting(false)
  }

  // ── Result screen ──────────────────────────────────────────
  if (result) {
    const quality = result.decision_quality ?? (
      result.decision_choice
        ? (task.options ?? []).find((o: any) => o.id === result.decision_choice)?.quality
        : null
    )
    const feedback = result.ai_feedback ??
      (task.options ?? []).find((o: any) => o.id === result.decision_choice)?.feedback ?? ''
    const xp = result.xp_earned ?? 0
    const kpis = result.kpis

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Result header */}
        <div style={{
          padding: '14px 16px',
          borderRadius: 10,
          background: quality === 'good' ? 'rgba(0,194,168,0.08)' : quality === 'bad' ? 'rgba(244,63,94,0.08)' : 'rgba(245,158,11,0.08)',
          border: `1px solid ${quality === 'good' ? '#004D43' : quality === 'bad' ? '#3D0F1B' : '#3D2A00'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 22 }}>{quality === 'good' ? '✓' : quality === 'bad' ? '✗' : '~'}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: quality === 'good' ? '#00C2A8' : quality === 'bad' ? '#F43F5E' : '#F59E0B' }}>
                {quality === 'good' ? 'Strong decision' : quality === 'bad' ? 'Poor decision — review feedback' : 'Acceptable — room to improve'}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>+{xp} XP earned</div>
            </div>
          </div>
          {feedback && (
            <div style={{ fontSize: 12, color: '#A0AEC0', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
              <span style={{ fontWeight: 500, color: '#E2E8F0' }}>Feedback: </span>{feedback}
            </div>
          )}
        </div>

        {/* KPI impact */}
        {kpis && (
          <div style={{ background: '#0D1117', border: '1px solid #1E2535', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>KPI update</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[
                { label: 'Reliability', val: kpis.reliability, color: '#4ADE80' },
                { label: 'Decision quality', val: kpis.quality, color: '#818CF8' },
                { label: 'Responsiveness', val: kpis.responsiveness, color: '#F59E0B' },
                { label: 'PI Score', val: kpis.performance_index, color: '#00C2A8' },
              ].map(k => (
                <div key={k.label} style={{ background: '#141420', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, color: '#4A5568', marginBottom: 3 }}>{k.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: k.color }}>{Math.round(k.val)}%</div>
                  <div style={{ height: 3, background: '#1E2535', borderRadius: 2, marginTop: 5 }}>
                    <div style={{ height: 3, borderRadius: 2, background: k.color, width: `${Math.min(100, k.val)}%`, transition: 'width 0.6s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => router.push('/dashboard')}
          style={{ padding: '11px', background: '#00C2A8', color: '#0A0A0F', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Back to dashboard →
        </button>
      </div>
    )
  }

  // ── Task interface ─────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Task header */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 99, background: urgencyConf.bg, color: urgencyConf.color, fontWeight: 500 }}>
          {typeConf.icon} {typeConf.label}
        </span>
        <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 99, background: urgencyConf.bg, color: urgencyConf.color, fontWeight: 500 }}>
          {urgencyConf.label}
        </span>
        {task.xp_reward && (
          <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 99, background: 'rgba(0,194,168,0.08)', color: '#00C2A8', fontWeight: 500, marginLeft: 'auto' }}>
            +{task.xp_reward} XP available
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.3 }}>{task.title}</div>

      {/* Scenario / description */}
      <div style={{
        background: '#0D1117', border: '1px solid #1E2535',
        borderLeft: `3px solid ${urgencyConf.color}`,
        borderRadius: '0 8px 8px 0', padding: '12px 14px',
        fontSize: 13, color: '#94A3B8', lineHeight: 1.7, whiteSpace: 'pre-wrap',
      }}>
        {task.description}
      </div>

      {/* Decision options */}
      {isDecision && task.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 2 }}>Choose your response:</div>
          {(task.options as any[]).map((opt: any, i: number) => {
            const isSelected = selectedOption === (opt.id ?? opt.value ?? i.toString())
            const optId = opt.id ?? opt.value ?? i.toString()
            return (
              <div
                key={optId}
                onClick={() => setSelectedOption(optId)}
                style={{
                  padding: '12px 14px',
                  background: isSelected ? 'rgba(0,194,168,0.08)' : '#0D1117',
                  border: `1px solid ${isSelected ? '#00C2A8' : '#1E2535'}`,
                  borderRadius: 9, cursor: 'pointer',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  transition: 'all 0.12s', lineHeight: 1.5,
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  border: `1.5px solid ${isSelected ? '#00C2A8' : '#2D3748'}`,
                  background: isSelected ? '#00C2A8' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: '#0A0A0F', fontWeight: 700,
                }}>
                  {isSelected ? '✓' : ''}
                </div>
                <span style={{ fontSize: 13, color: isSelected ? '#E2E8F0' : '#64748B', fontWeight: isSelected ? 500 : 400 }}>
                  {opt.text ?? opt.l}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Free text input */}
      {isFreeText && (
        <div>
          <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 6 }}>
            {task.type === 'email_reply' ? 'Write your reply:' :
             task.type === 'standup' ? 'Write your standup update:' :
             task.type === 'document' ? 'Write your document / notes:' : 'Write your report:'}
          </div>
          <textarea
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            placeholder={
              task.type === 'email_reply' ? 'Write a professional reply...' :
              task.type === 'standup' ? 'Yesterday: ...\nToday: ...\nBlockers: ...' :
              'Write clearly and concisely...'
            }
            rows={8}
            style={{
              width: '100%', background: '#0D1117', border: '1px solid #2D3748',
              borderRadius: 9, padding: '12px 14px', color: '#E2E8F0',
              fontSize: 13, fontFamily: 'inherit', lineHeight: 1.65,
              resize: 'vertical', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 11, color: '#334155' }}>
              {freeText.split(/\s+/).filter(Boolean).length} words
            </span>
            <span style={{ fontSize: 11, color: '#334155' }}>
              Scored on: clarity · professionalism · actionability · completeness
            </span>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        style={{
          padding: '12px', background: canSubmit && !submitting ? '#00C2A8' : '#1E2535',
          color: canSubmit && !submitting ? '#0A0A0F' : '#334155',
          border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600,
          cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
        }}
      >
        {submitting ? 'Submitting...' : isDecision ? 'Submit decision →' : 'Submit response →'}
      </button>
    </div>
  )
}
