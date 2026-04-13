'use client'

import { useEffect, useState, useCallback } from 'react'
import { simulationEngine, EngineState, EngineMessage } from '@/lib/simulation-engine'
import SimTaskPanel from './SimTaskPanel'
import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'

interface Props {
  profile: any
  activeSession: any
}

export default function SimulateClient({ profile, activeSession }: Props) {
  const [engineState, setEngineState] = useState<EngineState | null>(simulationEngine.getState())
  const [started, setStarted] = useState(false)

  // Subscribe to engine updates
  useEffect(() => {
    const unsub = simulationEngine.subscribe(state => setEngineState({ ...state }))
    return unsub
  }, [])

  // If there's an active session and engine isn't running, start it
  useEffect(() => {
    if (activeSession && !simulationEngine.getState() && !started) {
      startEngine()
    }
  }, [activeSession])

  async function startEngine() {
    if (!activeSession) return
    setStarted(true)
    await simulationEngine.start({
      sessionId: activeSession.id,
      careerPath: profile.career_path,
      simDay: activeSession.sim_day ?? 1,
      userId: profile.id,
    })
  }

  const handleTaskComplete = useCallback(() => {
    // Refresh the engine state display after completing a task
    setEngineState(simulationEngine.getState())
  }, [])

  // Not clocked in
  if (!activeSession) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <div style={{ width: 56, height: 56, background: '#EBF3FB', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24, color: '#1F4E79' }}>
            ▶
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Ready to simulate?</div>
          <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>
            You need to clock in from the Dashboard to start a simulation session. Your AI coworkers are standing by.
          </div>
          <a href="/dashboard" style={{ display: 'inline-block', padding: '10px 24px', background: '#1F4E79', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Go to dashboard →
          </a>
        </div>
      </div>
    )
  }

  // Session active but engine not started yet
  if (!engineState) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B', fontSize: 13 }}>
        <div className="esp-skeleton" style={{ width: 200, height: 20, margin: '0 auto 12px' }} />
        <div className="esp-skeleton" style={{ width: 140, height: 14, margin: '0 auto' }} />
      </div>
    )
  }

  const { activeTask, messages, kpis, xp, simDay } = engineState
  const pendingCount = engineState.pendingTaskIds.size
  const completedCount = engineState.completedTaskIds.size

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Main area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>

        {/* Day header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Day {simDay} — {CAREER_PATH_DISPLAY[profile.career_path]?.label}</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: '#EAF3DE', color: '#166534', fontWeight: 500 }}>{completedCount} done</span>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: '#EBF3FB', color: '#1F4E79', fontWeight: 500 }}>{pendingCount} pending</span>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: '#F1F5F9', color: '#64748B', fontWeight: 500 }}>{xp} XP</span>
          </div>
        </div>

        {/* Active task */}
        {activeTask ? (
          <div className="esp-card esp-fadein" style={{ marginBottom: 16 }}>
            <SimTaskPanel task={activeTask} onComplete={handleTaskComplete} />
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>Waiting for next task...</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Tasks are released on a simulated schedule. Stay ready.</div>
          </div>
        )}

        {/* Engine message feed */}
        {messages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Activity feed</div>
            {messages.slice(0, 8).map((msg: EngineMessage) => (
              <div key={msg.id} className="esp-fadein" style={{
                padding: '10px 14px', borderRadius: 8, fontSize: 12,
                background: msg.severity === 'positive' ? '#F0FDF4' : msg.severity === 'negative' ? '#FEF2F2' : '#F8FAFC',
                color: msg.severity === 'positive' ? '#166534' : msg.severity === 'negative' ? '#991B1B' : '#64748B',
                borderLeft: `3px solid ${msg.severity === 'positive' ? '#86EFAC' : msg.severity === 'negative' ? '#FCA5A5' : '#E2E8F0'}`,
                lineHeight: 1.5,
              }}>
                {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPI sidebar */}
      <div style={{ width: 220, borderLeft: '0.5px solid #E2E8F0', padding: '16px', background: '#fff', overflow: 'auto', flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 12 }}>Live KPIs</div>
        {[
          { label: 'Reliability', val: kpis.reliability, color: '#1D9E75' },
          { label: 'Responsiveness', val: kpis.responsiveness, color: '#EF9F27' },
          { label: 'Decision quality', val: kpis.quality, color: '#378ADD' },
          { label: 'Scope control', val: kpis.scope_control, color: '#7C3AED' },
        ].map(k => (
          <div key={k.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#64748B' }}>{k.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: k.color }}>{k.val}%</span>
            </div>
            <div className="esp-bar-track">
              <div className="esp-bar-fill" style={{ width: `${k.val}%`, background: k.color }} />
            </div>
          </div>
        ))}
        <div style={{ borderTop: '0.5px solid #E2E8F0', paddingTop: 12, marginTop: 4 }}>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Performance index</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1F4E79' }}>{kpis.performance_index}</div>
        </div>
      </div>
    </div>
  )
}
