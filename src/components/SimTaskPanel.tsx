'use client'

/**
 * SimTaskPanel — renders the active simulation task
 * Shows the scenario, AI coworker message, and decision options or free-text input.
 * Connects to the SimulationEngine to resolve decisions.
 */

import { useState } from 'react'
import { SimTask, DecisionOption } from '@/lib/simulation-scripts'
import { simulationEngine } from '@/lib/simulation-engine'

const PERSONA_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  boss:   { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  marcus: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  sarah:  { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA' },
  client: { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
  hr:     { bg: '#F0FDFA', text: '#065F46', border: '#A7F3D0' },
}

const QUALITY_STYLES: Record<string, { border: string; bg: string; label: string; labelBg: string; labelText: string }> = {
  good:   { border: '#86EFAC', bg: '#F0FDF4', label: 'Best approach', labelBg: '#DCFCE7', labelText: '#166534' },
  medium: { border: '#FCD34D', bg: '#FFFBEB', label: 'Acceptable',    labelBg: '#FEF9C3', labelText: '#854D0E' },
  bad:    { border: '#FCA5A5', bg: '#FFF5F5', label: 'Poor choice',   labelBg: '#FEE2E2', labelText: '#991B1B' },
}

interface SimTaskPanelProps {
  task: SimTask
  onComplete: () => void
}

export default function SimTaskPanel({ task, onComplete }: SimTaskPanelProps) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [freeText, setFreeText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [textScore, setTextScore] = useState<number | null>(null)

  const personaKey = task.from_persona ?? 'boss'
  const pStyle = PERSONA_STYLES[personaKey] ?? PERSONA_STYLES.boss

  async function handleDecision(opt: DecisionOption) {
    if (chosen) return
    setChosen(opt.id)
    setRevealed(true)
    await simulationEngine.resolveDecision(opt.id)
  }

  async function handleTextSubmit() {
    if (!freeText.trim() || submitting) return
    setSubmitting(true)
    // Score via AI API
    let score = 70 // default fallback
    try {
      const res = await fetch('/api/ai/score-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: task.id,
          rubric: task.scoring_rubric,
          response: freeText,
          career_path: simulationEngine.getState()?.careerPath,
        }),
      })
      const data = await res.json()
      score = data.score ?? 70
    } catch (_) {}

    setTextScore(score)
    await simulationEngine.resolveTextTask(task.id, freeText, score)
    setSubmitting(false)
  }

  const isDecision = task.type === 'decision' || task.type === 'scope_decision'
  const isFreeText = task.type === 'document' || task.type === 'standup' || task.type === 'report'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Task header */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 500,
          background: task.urgency === 'urgent' ? '#FEE2E2' : '#EFF6FF',
          color: task.urgency === 'urgent' ? '#991B1B' : '#1E40AF',
          flexShrink: 0, marginTop: 2,
        }}>
          {task.urgency === 'urgent' ? 'URGENT' : task.type.replace('_', ' ').toUpperCase()}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>{task.title}</h3>
      </div>

      {/* Scenario description */}
      <div style={{
        background: pStyle.bg, border: `0.5px solid ${pStyle.border}`,
        borderLeft: `3px solid ${pStyle.border}`, borderRadius: 8,
        padding: '12px 14px', fontSize: 13, color: '#374151', lineHeight: 1.6,
      }}>
        {task.description}
      </div>

      {/* Decision options */}
      {isDecision && task.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>How do you respond?</div>
          {task.options.map(opt => {
            const isChosen = chosen === opt.id
            const qStyle = revealed && isChosen ? QUALITY_STYLES[opt.quality] : null

            return (
              <div key={opt.id}>
                <div
                  onClick={() => !chosen && handleDecision(opt)}
                  style={{
                    padding: '11px 14px', border: qStyle
                      ? `1.5px solid ${qStyle.border}`
                      : chosen
                        ? '0.5px solid #E2E8F0'
                        : '0.5px solid #CBD5E1',
                    borderRadius: 8, cursor: chosen ? 'default' : 'pointer',
                    background: qStyle?.bg ?? (chosen && !isChosen ? '#FAFAFA' : '#fff'),
                    opacity: chosen && !isChosen ? 0.5 : 1,
                    transition: 'all 0.15s', fontSize: 13, color: '#374151', lineHeight: 1.5,
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: isChosen ? '#1F4E79' : '#F1F5F9',
                    color: isChosen ? '#fff' : '#64748B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600, marginTop: 1,
                  }}>
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </div>

                {/* Consequence reveal */}
                {revealed && isChosen && (
                  <div style={{
                    marginTop: 8, padding: '10px 14px', borderRadius: 8,
                    background: qStyle?.bg, border: `0.5px solid ${qStyle?.border}`,
                    display: 'flex', flexDirection: 'column', gap: 6,
                  }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                        background: qStyle?.labelBg, color: qStyle?.labelText,
                      }}>
                        {qStyle?.label}
                      </span>
                      <span style={{ fontSize: 11, color: '#64748B' }}>+{opt.xp} XP</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                      {opt.consequence}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {Object.entries(opt.kpi_impact).map(([k, v]) => (
                        <span key={k} style={{
                          fontSize: 10, padding: '2px 8px', borderRadius: 99,
                          background: v > 0 ? '#DCFCE7' : '#FEE2E2',
                          color: v > 0 ? '#166534' : '#991B1B',
                        }}>
                          {k.replace('_', ' ')} {v > 0 ? '+' : ''}{v}%
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={onComplete}
                      style={{
                        alignSelf: 'flex-end', padding: '7px 16px', background: '#1F4E79',
                        color: '#fff', border: 'none', borderRadius: 8, fontSize: 12,
                        fontWeight: 500, cursor: 'pointer', marginTop: 4,
                      }}
                    >
                      Continue →
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Free-text response */}
      {isFreeText && textScore === null && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {task.free_text_prompt && (
            <div style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>{task.free_text_prompt}</div>
          )}
          {task.scoring_rubric && (
            <div style={{ background: '#F8FAFC', border: '0.5px solid #E2E8F0', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#64748B', marginBottom: 6 }}>What good looks like:</div>
              {task.scoring_rubric.map((r, i) => (
                <div key={i} style={{ fontSize: 11, color: '#64748B', display: 'flex', gap: 6, marginBottom: 3 }}>
                  <span style={{ color: '#10B981', flexShrink: 0 }}>✓</span>
                  {r}
                </div>
              ))}
            </div>
          )}
          <textarea
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            placeholder="Type your response here..."
            rows={5}
            style={{
              width: '100%', padding: '10px 12px', border: '0.5px solid #CBD5E1',
              borderRadius: 8, fontSize: 13, outline: 'none', resize: 'vertical',
              fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>{freeText.split(' ').filter(Boolean).length} words</span>
            <button
              onClick={handleTextSubmit}
              disabled={!freeText.trim() || submitting}
              style={{
                padding: '8px 18px', background: freeText.trim() ? '#1F4E79' : '#E2E8F0',
                color: freeText.trim() ? '#fff' : '#94A3B8', border: 'none',
                borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: freeText.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {submitting ? 'Scoring...' : 'Submit →'}
            </button>
          </div>
        </div>
      )}

      {/* Text score result */}
      {isFreeText && textScore !== null && (
        <div style={{
          padding: '14px', borderRadius: 8,
          background: textScore >= 80 ? '#F0FDF4' : textScore >= 60 ? '#FFFBEB' : '#FFF5F5',
          border: `0.5px solid ${textScore >= 80 ? '#86EFAC' : textScore >= 60 ? '#FCD34D' : '#FCA5A5'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Response scored</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: textScore >= 80 ? '#166534' : textScore >= 60 ? '#854D0E' : '#991B1B' }}>
              {textScore}/100
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>
            {textScore >= 80 ? 'Excellent — clear, precise, and professional.' : textScore >= 60 ? 'Good effort. Review the rubric to sharpen your approach.' : 'Needs improvement. Focus on the scoring criteria and try again next time.'}
          </div>
          <button onClick={onComplete} style={{ padding: '7px 16px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
