'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Props {
  task: any
  sessionId: string
  onComplete: (result: any) => void
}

const DEFAULT_MERMAID = `graph TD
    A[User Request] --> B[API Gateway]
    B --> C[Auth Service]
    C --> D[Data Service]
    D --> E[(Database)]
    D --> F[Cache Layer]`

export default function DiagramEditor({ task, sessionId, onComplete }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [mermaidCode, setMermaidCode] = useState('')
  const [mermaidSvg, setMermaidSvg] = useState<string | null>(null)
  const [mermaidError, setMermaidError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mermaidTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Lazy-render mermaid preview with debounce
  useEffect(() => {
    if (!mermaidCode.trim()) { setMermaidSvg(null); setMermaidError(null); return }
    if (mermaidTimer.current) clearTimeout(mermaidTimer.current)
    mermaidTimer.current = setTimeout(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({ startOnLoad: false, theme: 'dark' })
        const id = `mermaid-${Date.now()}`
        const { svg } = await mermaid.render(id, mermaidCode.trim())
        setMermaidSvg(svg)
        setMermaidError(null)
      } catch (e: any) {
        setMermaidSvg(null)
        setMermaidError(e?.message?.split('\n')[0] ?? 'Invalid Mermaid syntax')
      }
    }, 600)
    return () => { if (mermaidTimer.current) clearTimeout(mermaidTimer.current) }
  }, [mermaidCode])

  function handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = e => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }

  async function submit() {
    if (!imageFile && !mermaidCode.trim()) return
    setLoading(true)

    let image_base64: string | null = null
    let image_mime_type: string | null = null

    if (imageFile) {
      const buf = await imageFile.arrayBuffer()
      image_base64 = btoa(String.fromCharCode(...new Uint8Array(buf)))
      image_mime_type = imageFile.type
    }

    try {
      const res = await fetch('/api/ai/evaluate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: task.id,
          code: mermaidCode.trim() || null,
          language: 'diagram',
          task_description: task.description,
          rubric: task.rubric ?? [
            'Architecture covers all required components',
            'Design is appropriate for the stated requirements',
            'Diagram is clear and well-structured',
          ],
          image_base64,
          image_mime_type,
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

  const canSubmit = (!!imageFile || !!mermaidCode.trim()) && !loading

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Architecture Diagram</div>
        <button
          onClick={submit}
          disabled={!canSubmit}
          style={{
            padding: '6px 18px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 7,
            fontSize: 12, fontWeight: 500, cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.5,
          }}
        >
          {loading ? 'Evaluating…' : 'Submit Diagram ▶'}
        </button>
      </div>

      {/* Section 1: Image upload */}
      <div>
        <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8, fontWeight: 500 }}>
          OPTION A — Upload diagram image <span style={{ color: '#334155' }}>(PNG / JPG from draw.io, Lucidchart, etc.)</span>
        </div>

        {imagePreview ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="diagram" style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 8, border: '1px solid #2D3748', display: 'block' }} />
            <button
              onClick={() => { setImageFile(null); setImagePreview(null) }}
              style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</button>
          </div>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#7C3AED' : '#2D3748'}`,
              borderRadius: 10, padding: '28px 20px', textAlign: 'center',
              background: dragging ? 'rgba(124,58,237,0.06)' : '#0D1117',
              cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🖼</div>
            <div style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.5 }}>
              Drag & drop your diagram here, or <span style={{ color: '#7C3AED', textDecoration: 'underline' }}>browse files</span>
            </div>
            <div style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>PNG, JPG, WEBP supported</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f) }}
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: '#1E2535' }} />
        <span style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>OR</span>
        <div style={{ flex: 1, height: 1, background: '#1E2535' }} />
      </div>

      {/* Section 2: Mermaid editor */}
      <div>
        <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8, fontWeight: 500 }}>
          OPTION B — Mermaid syntax <span style={{ color: '#334155' }}>(live preview below)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Editor */}
          <textarea
            value={mermaidCode}
            onChange={e => setMermaidCode(e.target.value)}
            placeholder={DEFAULT_MERMAID}
            spellCheck={false}
            style={{
              width: '100%', minHeight: 200, background: '#1E1E1E', color: '#D4D4D4',
              border: '1px solid #2D3748', borderRadius: 8, padding: '10px 12px',
              fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, resize: 'vertical',
              boxSizing: 'border-box', outline: 'none',
            }}
          />

          {/* Preview pane */}
          <div style={{
            minHeight: 200, background: '#0D1117', border: '1px solid #2D3748', borderRadius: 8,
            padding: '10px 12px', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {mermaidSvg ? (
              <div dangerouslySetInnerHTML={{ __html: mermaidSvg }} style={{ width: '100%' }} />
            ) : mermaidError ? (
              <div style={{ fontSize: 11, color: '#F43F5E', textAlign: 'center', padding: '0 8px' }}>{mermaidError}</div>
            ) : (
              <div style={{ fontSize: 11, color: '#334155', textAlign: 'center' }}>
                {mermaidCode.trim() ? 'Rendering…' : 'Preview will appear here'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div style={{ background: result.error ? '#1A0A0A' : '#0A1A0F', border: `1px solid ${result.error ? '#7F1D1D' : '#14532D'}`, borderRadius: 8, padding: '14px 16px' }}>
          {result.error ? (
            <div style={{ fontSize: 13, color: '#F87171' }}>{result.error}</div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: result.score >= 75 ? '#4ADE80' : result.score >= 55 ? '#FBBF24' : '#F87171' }}>
                  Score: {result.score}/100 · {result.grade}
                </span>
                <span style={{ fontSize: 11, color: '#4A5568' }}>+{result.xp_earned ?? 0} XP</span>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, lineHeight: 1.5 }}>{result.summary}</div>
              {result.feedback && <div style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>{result.feedback}</div>}
            </>
          )}
        </div>
      )}
    </div>
  )
}
