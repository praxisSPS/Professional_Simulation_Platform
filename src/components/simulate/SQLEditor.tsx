'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Props {
  task: any
  sessionId: string
  onComplete: (result: any) => void
}

const SQL_PLACEHOLDER = `-- Write your SQL query here
-- Example:
SELECT
  customer_name,
  SUM(order_value) AS total_revenue,
  COUNT(*) AS order_count
FROM orders
WHERE order_date >= '2024-10-01'
GROUP BY customer_name
ORDER BY total_revenue DESC
LIMIT 10;
`

export default function SQLEditor({ task, sessionId, onComplete }: Props) {
  const [code, setCode] = useState(SQL_PLACEHOLDER)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function runQuery() {
    if (!code.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/evaluate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: task.id,
          code,
          language: 'sql',
          task_description: task.description,
          rubric: task.rubric ?? [
            'Query returns the correct columns as specified',
            'Query logic correctly filters and aggregates data',
            'Query is readable and well-commented',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>SQL Editor</div>
        <button
          onClick={runQuery}
          disabled={loading}
          style={{
            padding: '6px 16px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 7,
            fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Evaluating...' : 'Run & Submit ▶'}
        </button>
      </div>

      <div style={{ border: '0.5px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', minHeight: 320 }}>
        <MonacoEditor
          height={320}
          language="sql"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 12 },
            renderLineHighlight: 'gutter',
          }}
        />
      </div>

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
              {result.issues?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#DC2626', marginBottom: 4 }}>Issues to fix:</div>
                  {result.issues.map((i: string, idx: number) => (
                    <div key={idx} style={{ fontSize: 11, color: '#374151', marginBottom: 2 }}>• {i}</div>
                  ))}
                </div>
              )}
              {result.strengths?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#15803D', marginBottom: 4 }}>Strengths:</div>
                  {result.strengths.map((s: string, idx: number) => (
                    <div key={idx} style={{ fontSize: 11, color: '#374151', marginBottom: 2 }}>✓ {s}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
