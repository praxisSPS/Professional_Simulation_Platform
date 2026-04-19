'use client'

import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

interface Props {
  task: any
  sessionId: string
  onComplete: (result: any) => void
}

const ExcalidrawCanvas = dynamic(
  async () => {
    const { Excalidraw } = await import('@excalidraw/excalidraw')
    return { default: Excalidraw }
  },
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: 520, background: '#1A1B26', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#4A5568', fontSize: 13, borderRadius: 10,
        border: '1px solid #2D3748',
      }}>
        Loading canvas…
      </div>
    ),
  }
)

export default function DiagramEditor({ task, onComplete }: Props) {
  const excalidrawAPI = useRef<any>(null)
  const [hasDrawing, setHasDrawing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClear = useCallback(() => {
    if (excalidrawAPI.current) {
      excalidrawAPI.current.resetScene()
      setHasDrawing(false)
    }
  }, [])

  const handleExportPNG = useCallback(async () => {
    if (!excalidrawAPI.current) return
    const elements = excalidrawAPI.current.getSceneElements()
    if (!elements.some((el: any) => !el.isDeleted)) return
    const { exportToBlob } = await import('@excalidraw/excalidraw')
    const blob = await exportToBlob({
      elements,
      appState: { ...excalidrawAPI.current.getAppState(), exportWithDarkMode: true },
      files: excalidrawAPI.current.getFiles(),
      mimeType: 'image/png',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'architecture-diagram.png'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  function handleImageFile(file: File) {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return
    setUploadedFile(file)
    if (file.type !== 'application/pdf') {
      const reader = new FileReader()
      reader.onload = e => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  async function submit() {
    if (loading) return
    setLoading(true)

    let image_base64: string | null = null
    let image_mime_type: string | null = null

    if (uploadedFile) {
      const buf = await uploadedFile.arrayBuffer()
      const bytes = new Uint8Array(buf)
      let binary = ''
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
      image_base64 = btoa(binary)
      image_mime_type = uploadedFile.type === 'application/pdf' ? 'image/png' : uploadedFile.type
    } else if (excalidrawAPI.current && hasDrawing) {
      const elements = excalidrawAPI.current.getSceneElements().filter((el: any) => !el.isDeleted)
      if (elements.length === 0) { setLoading(false); return }
      const { exportToBlob } = await import('@excalidraw/excalidraw')
      const blob = await exportToBlob({
        elements,
        appState: { ...excalidrawAPI.current.getAppState(), exportWithDarkMode: true },
        files: excalidrawAPI.current.getFiles(),
        mimeType: 'image/png',
      })
      const buf = await blob.arrayBuffer()
      const bytes = new Uint8Array(buf)
      let binary = ''
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
      image_base64 = btoa(binary)
      image_mime_type = 'image/png'
    }

    if (!image_base64) { setLoading(false); return }

    try {
      const res = await fetch('/api/ai/evaluate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: task.id,
          code: null,
          language: 'diagram',
          task_description: task.description,
          rubric: task.rubric ?? [
            'Diagram addresses all task requirements described in the brief',
            'All required components are present and correctly labelled',
            'Connections and relationships between components are logical and correct',
            'Design is clear, professional, and appropriate for the stated requirements',
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

  const canSubmit = (hasDrawing || !!uploadedFile) && !loading

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Architecture Diagram
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleClear}
            disabled={!hasDrawing || loading}
            style={{
              padding: '5px 14px', background: 'transparent', color: '#64748B',
              border: '1px solid #2D3748', borderRadius: 6, fontSize: 11,
              fontWeight: 500, cursor: hasDrawing && !loading ? 'pointer' : 'not-allowed',
              opacity: hasDrawing && !loading ? 1 : 0.4,
            }}
          >
            Clear
          </button>
          <button
            onClick={handleExportPNG}
            disabled={!hasDrawing || loading}
            style={{
              padding: '5px 14px', background: 'transparent', color: '#64748B',
              border: '1px solid #2D3748', borderRadius: 6, fontSize: 11,
              fontWeight: 500, cursor: hasDrawing && !loading ? 'pointer' : 'not-allowed',
              opacity: hasDrawing && !loading ? 1 : 0.4,
            }}
          >
            Export PNG
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            style={{
              padding: '5px 18px', background: canSubmit ? '#7C3AED' : '#2D1F47',
              color: canSubmit ? '#fff' : '#5B4A7A', border: 'none', borderRadius: 6,
              fontSize: 12, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Evaluating…' : 'Submit ▶'}
          </button>
        </div>
      </div>

      {/* Excalidraw canvas */}
      <div style={{
        height: 520, borderRadius: 10, overflow: 'hidden',
        border: '1px solid #2D3748', position: 'relative',
      }}>
        <ExcalidrawCanvas
          excalidrawAPI={(api: any) => { excalidrawAPI.current = api }}
          theme="dark"
          initialData={{
            appState: {
              viewBackgroundColor: '#1A1B26',
              theme: 'dark',
              currentItemFontFamily: 1,
            },
          }}
          onChange={(elements: readonly any[]) => {
            setHasDrawing(elements.some(el => !el.isDeleted))
          }}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              toggleTheme: false,
              saveAsImage: false,
              saveToActiveFile: false,
              loadScene: false,
              export: false,
            },
          }}
        />
      </div>

      {/* OR divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
        <div style={{ flex: 1, height: 1, background: '#1E2535' }} />
        <span style={{ fontSize: 10, color: '#334155', fontWeight: 600, letterSpacing: '0.06em' }}>OR UPLOAD</span>
        <div style={{ flex: 1, height: 1, background: '#1E2535' }} />
      </div>

      {/* Upload area */}
      {imagePreview ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreview}
            alt="uploaded diagram"
            style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8, border: '1px solid #2D3748', display: 'block' }}
          />
          <button
            onClick={() => { setUploadedFile(null); setImagePreview(null) }}
            style={{
              position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.75)',
              color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24,
              fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      ) : uploadedFile ? (
        <div style={{
          background: '#0D1117', border: '1px solid #2D3748', borderRadius: 8,
          padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>📄 {uploadedFile.name}</div>
          <button
            onClick={() => { setUploadedFile(null); setImagePreview(null) }}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 13 }}
          >✕</button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault(); setDragging(false)
            const f = e.dataTransfer.files[0]
            if (f) handleImageFile(f)
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#7C3AED' : '#2D3748'}`,
            borderRadius: 10, padding: '22px 20px', textAlign: 'center',
            background: dragging ? 'rgba(124,58,237,0.06)' : 'transparent',
            cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
          }}
        >
          <div style={{ fontSize: 11, color: '#4A5568', lineHeight: 1.6 }}>
            Upload a diagram you made elsewhere{' '}
            <span style={{ color: '#334155' }}>(draw.io, Lucidchart, PowerPoint, photo of whiteboard)</span>
          </div>
          <div style={{ fontSize: 11, color: '#7C3AED', marginTop: 6 }}>Browse files</div>
          <div style={{ fontSize: 10, color: '#2D3748', marginTop: 4 }}>PNG, JPG, PDF</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f) }}
          />
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          background: result.error ? '#1A0A0A' : '#0A1A0F',
          border: `1px solid ${result.error ? '#7F1D1D' : '#14532D'}`,
          borderRadius: 8, padding: '14px 16px',
        }}>
          {result.error ? (
            <div style={{ fontSize: 13, color: '#F87171' }}>{result.error}</div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: result.score >= 75 ? '#4ADE80' : result.score >= 55 ? '#FBBF24' : '#F87171',
                }}>
                  Score: {result.score}/100 · {result.grade}
                </span>
                <span style={{ fontSize: 11, color: '#4A5568' }}>+{result.xp_earned ?? 0} XP</span>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, lineHeight: 1.6 }}>{result.summary}</div>
              {result.issues?.length > 0 && (
                <div style={{ fontSize: 11, color: '#F87171', marginBottom: 4 }}>
                  {result.issues.map((i: string, idx: number) => <div key={idx}>• {i}</div>)}
                </div>
              )}
              {result.feedback && (
                <div style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 4 }}>{result.feedback}</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
