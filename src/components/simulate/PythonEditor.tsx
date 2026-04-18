'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Props {
  task: any
  sessionId: string
  onComplete: (result: any) => void
}

const PYTHON_PLACEHOLDER = `# Write your Python code here
import pandas as pd

# Example: Load and analyse data
df = pd.DataFrame({
    'customer': ['Acme', 'Beta', 'Gamma'],
    'revenue': [120000, 85000, 210000]
})

# Your analysis here
top_customers = df.sort_values('revenue', ascending=False)
print(top_customers)
`

export default function PythonEditor({ task, sessionId, onComplete }: Props) {
  const [code, setCode] = useState(PYTHON_PLACEHOLDER)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function runCode() {
    if (!code.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/evaluate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: task.id,
          code,
          language: 'python',
          task_description: task.description,
          rubric: task.rubric ?? [
            'Code logic correctly addresses the task requirements',
            'Code is readable and follows Python conventions',
            'Approach is efficient and appropriate for the problem',
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
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Python Editor</div>
        <button
          onClick={runCode}
          disabled={loading}
          style={{
            padding: '6px 16px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: 7,
            fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Evaluating...' : 'Run & Submit ▶'}
        </button>
      </div>

      <div style={{ border: '0.5px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', minHeight: 320 }}>
        <MonacoEditor
          height={320}
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 12 },
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
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#DC2626', marginBottom: 4 }}>Issues:</div>
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
