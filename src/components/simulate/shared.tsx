'use client'
import React from 'react'

// ── Dark-theme style tokens ────────────────────────────────────
export const D = {
  bg: '#0A0A0F',
  panel: '#0D1117',
  border: '#1E2535',
  border2: '#2D3748',
  text: '#E2E8F0',
  sub: '#94A3B8',
  muted: '#4A5568',
  accent: '#00C2A8',
}

export const inp: React.CSSProperties = {
  background: '#0D1117',
  border: '1px solid #1E2535',
  color: '#E2E8F0',
  borderRadius: 6,
  padding: '7px 10px',
  fontSize: 12,
  width: '100%',
  outline: 'none',
  fontFamily: "'Segoe UI',system-ui,sans-serif",
  boxSizing: 'border-box',
}

export const ta: React.CSSProperties = {
  ...inp,
  resize: 'vertical' as const,
  lineHeight: 1.6,
  minHeight: 80,
}

export const lbl: React.CSSProperties = {
  fontSize: 10,
  color: '#94A3B8',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 4,
  display: 'block',
}

export const row: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  marginBottom: 12,
}

export const col: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}

// ── Shared components ──────────────────────────────────────────

export function TabBar({ tabs, active, onChange }: {
  tabs: { id: string; label: string; disabled?: boolean }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #1E2535', marginBottom: 16 }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => !t.disabled && onChange(t.id)}
          title={t.disabled ? 'Not needed for this task' : undefined}
          style={{
            padding: '7px 14px', background: 'none', border: 'none',
            cursor: t.disabled ? 'default' : 'pointer',
            fontSize: 12, fontWeight: active === t.id ? 600 : 400,
            color: t.disabled ? '#2D3748' : active === t.id ? '#00C2A8' : '#4A5568',
            borderBottom: active === t.id ? '2px solid #00C2A8' : '2px solid transparent',
            marginBottom: -1, opacity: t.disabled ? 0.35 : 1, whiteSpace: 'nowrap',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function TaskBrief({ task }: { task: any }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.3, marginBottom: 8 }}>
        {task.title}
      </div>
      <div style={{
        background: '#0D1117', border: '1px solid #1E2535',
        borderLeft: '3px solid #00C2A8', borderRadius: '0 8px 8px 0',
        padding: '10px 14px', fontSize: 12, color: '#94A3B8', lineHeight: 1.7,
      }}>
        {task.description}
      </div>
    </div>
  )
}

export function SubmitBtn({ onClick, loading, label = 'Submit ▶', color = '#7C3AED' }: {
  onClick: () => void; loading: boolean; label?: string; color?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        padding: '7px 20px',
        background: loading ? '#1A1026' : color,
        color: loading ? '#5B4A7A' : '#fff',
        border: 'none', borderRadius: 6,
        fontSize: 12, fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s',
      }}
    >
      {loading ? 'Evaluating…' : label}
    </button>
  )
}

export function ResultPanel({ result }: { result: any }) {
  if (!result) return null
  return (
    <div style={{
      background: result.error ? '#1A0A0A' : '#0A1A0F',
      border: `1px solid ${result.error ? '#7F1D1D' : '#14532D'}`,
      borderRadius: 8, padding: '14px 16px', marginTop: 12,
    }}>
      {result.error ? (
        <div style={{ fontSize: 13, color: '#F87171' }}>{result.error}</div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: result.score >= 75 ? '#4ADE80' : result.score >= 55 ? '#FBBF24' : '#F87171' }}>
              Score: {result.score}/100 · {result.grade}
            </span>
            <span style={{ fontSize: 11, color: '#4A5568' }}>+{result.xp_earned ?? 0} XP</span>
          </div>
          {result.summary && <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, lineHeight: 1.6 }}>{result.summary}</div>}
          {result.issues?.length > 0 && (
            <div style={{ fontSize: 11, color: '#F87171', marginBottom: 6, lineHeight: 1.7 }}>
              {result.issues.map((i: string, idx: number) => <div key={idx}>• {i}</div>)}
            </div>
          )}
          {result.strengths?.length > 0 && (
            <div style={{ fontSize: 11, color: '#4ADE80', marginBottom: 4, lineHeight: 1.7 }}>
              {result.strengths.map((s: string, idx: number) => <div key={idx}>✓ {s}</div>)}
            </div>
          )}
          {(result.feedback || result.manager_comment) && (
            <div style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 4 }}>
              {result.feedback || result.manager_comment}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export async function evalSubmit({
  taskId, content, language, taskDescription, rubric, setResult, setLoading, onComplete,
}: {
  taskId: string; content: string; language: string
  taskDescription: string; rubric: string[]
  setResult: (r: any) => void
  setLoading: (v: boolean) => void
  onComplete: (r: any) => void
}) {
  setLoading(true)
  try {
    const res = await fetch('/api/ai/evaluate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: taskId, code: content, language,
        task_description: taskDescription, rubric,
      }),
    })
    const data = await res.json()
    setResult(data)
    if (data.score) onComplete(data)
  } catch {
    setResult({ error: 'Evaluation failed. Check your connection.' })
  }
  setLoading(false)
}
