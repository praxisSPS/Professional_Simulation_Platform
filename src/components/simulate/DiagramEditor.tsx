'use client'

import { useState } from 'react'

interface Props {
  task: any
  sessionId: string
  onComplete: (result: any) => void
}

const DIAGRAM_PLACEHOLDER = `graph TD
    A[User Request] --> B[API Gateway]
    B --> C[Auth Service]
    C --> D[Data Service]
    D --> E[(Database)]
    D --> F[Cache Layer]
    F --> G[Response]

%% Add your architecture diagram here
%% Use Mermaid syntax or describe the architecture in text`

export default function DiagramEditor({ task, sessionId, onComplete }: Props) {
  const [diagram, setDiagram] = useState(DIAGRAM_PLACEHOLDER)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!diagram.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/evaluate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: task.id,
          code: diagram,
          language: 'diagram',
          task_description: task.description,
          rubric: task.rubric ?? [
            'Architecture covers all required components',
            'Design is appropriate for the stated requirements',
            'Diagram is clear and well-structured',
          ],
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Architecture / Diagram Editor</div>
        <button
          onClick={submit}
          disabled={loading}
          style={{
            padding: '6px 16px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 7,
            fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Evaluating...' : 'Submit Diagram ▶'}
        </button>
      </div>

      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: -4 }}>
        Use Mermaid syntax, pseudocode, or plain text to describe your architecture.
      </div>

      <textarea
        value={diagram}
        onChange={(e) => setDiagram(e.target.value)}
        style={{
          width: '100%', minHeight: 320, background: '#1E1E1E', color: '#D4D4D4',
          border: '0.5px solid #E2E8F0', borderRadius: 8, padding: '12px 14px',
          fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6, resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />

      {result && (
        <div style={{ background: result.error ? '#FEF2F2' : '#F0FDF4', border: `0.5px solid ${result.error ? '#FCA5A5' : '#86EFAC'}`, borderRadius: 8, padding: '14px 16px' }}>
          {result.error ? (
            <div style={{ fontSize: 13, color: '#DC2626' }}>{result.error}</div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#15803D' }}>Score: {result.score}/100</span>
                <span style={{ fontSize: 12, color: '#64748B' }}>Grade: {result.grade}</span>
              </div>
              <div style={{ fontSize: 12, color: '#374151', marginBottom: 8 }}>{result.summary}</div>
              {result.feedback && <div style={{ fontSize: 12, color: '#64748B' }}>{result.feedback}</div>}
            </>
          )}
        </div>
      )}
    </div>
  )
}
