'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SimTaskPanel from '@/components/SimTaskPanel'

interface Props {
  profile: any
  activeSession: any
  pendingTasks: any[]
  completedTasks: any[]
}

const URGENCY_ORDER: Record<string, number> = { urgent: 0, high: 1, normal: 2 }

export default function SimulateClient({ profile, activeSession, pendingTasks, completedTasks }: Props) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(
    pendingTasks.sort((a, b) => (URGENCY_ORDER[a.urgency] ?? 2) - (URGENCY_ORDER[b.urgency] ?? 2))[0]?.id ?? null
  )
  const router = useRouter()

  const sortedPending = [...pendingTasks].sort((a, b) =>
    (URGENCY_ORDER[a.urgency] ?? 2) - (URGENCY_ORDER[b.urgency] ?? 2)
  )

  const activeTask = sortedPending.find(t => t.id === activeTaskId) ?? sortedPending[0] ?? null

  function handleComplete(result: any) {
    // Move to next pending task after a short delay
    setTimeout(() => {
      const remaining = sortedPending.filter(t => t.id !== activeTaskId)
      setActiveTaskId(remaining[0]?.id ?? null)
      router.refresh()
    }, 2000)
  }

  // Not clocked in
  if (!activeSession) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B', fontSize: 13, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>▶</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#E2E8F0', marginBottom: 8 }}>Not clocked in</div>
        <div style={{ marginBottom: 20, color: '#4A5568' }}>Clock in from the Dashboard to receive tasks from your AI colleagues.</div>
        <button onClick={() => router.push('/dashboard')} style={{ padding: '10px 24px', background: '#00C2A8', color: '#0A0A0F', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Go to dashboard →
        </button>
      </div>
    )
  }

  // All tasks done
  if (sortedPending.length === 0 && completedTasks.length > 0) {
    const xpTotal = completedTasks.reduce((t, task) => t + (task.xp_earned ?? 0), 0)
    const goodDecisions = completedTasks.filter(t => t.decision_quality === 'good').length
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,194,168,0.1)', border: '2px solid #00C2A8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>★</div>
          <div style={{ fontSize: 10, color: '#00C2A8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Day complete</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#E2E8F0', marginBottom: 8 }}>All tasks completed</div>
          <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
            You completed {completedTasks.length} tasks today, earned {xpTotal} XP, and made {goodDecisions} strong decisions.
          </div>
          <div style={{ background: '#0D1117', border: '1px solid #1E2535', borderRadius: 12, padding: '14px 18px', marginBottom: 20, textAlign: 'left' }}>
            {completedTasks.map((t: any) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1E2535', fontSize: 12 }}>
                <span style={{ color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{t.title}</span>
                <span style={{ color: t.decision_quality === 'good' ? '#00C2A8' : t.decision_quality === 'bad' ? '#F43F5E' : '#F59E0B', fontWeight: 500, flexShrink: 0 }}>
                  +{t.xp_earned ?? 0} XP
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/dashboard/kpis')} style={{ width: '100%', padding: '12px', background: '#00C2A8', color: '#0A0A0F', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            View my KPIs →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#0A0A0F' }}>

      {/* Task list sidebar */}
      <div style={{ width: 260, borderRight: '1px solid #1E2535', overflow: 'auto', background: '#0D1117', flexShrink: 0 }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #1E2535' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#00C2A8', marginBottom: 2 }}>TODAY'S TASKS</div>
          <div style={{ fontSize: 10, color: '#334155' }}>{sortedPending.length} pending · {completedTasks.length} done</div>
        </div>

        {/* Pending */}
        {sortedPending.map(task => {
          const isActive = task.id === activeTaskId
          const urgColors: Record<string, string> = { urgent: '#F43F5E', high: '#F59E0B', normal: '#00C2A8' }
          return (
            <div
              key={task.id}
              onClick={() => setActiveTaskId(task.id)}
              style={{
                padding: '11px 14px', cursor: 'pointer',
                background: isActive ? 'rgba(0,194,168,0.06)' : 'transparent',
                borderLeft: `3px solid ${isActive ? '#00C2A8' : urgColors[task.urgency] ?? '#2D3748'}`,
                borderBottom: '1px solid #1E2535', transition: 'background 0.1s',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: isActive ? 600 : 500, color: isActive ? '#00C2A8' : '#A0AEC0', lineHeight: 1.3, marginBottom: 3 }}>{task.title}</div>
              <div style={{ fontSize: 10, color: '#334155' }}>
                {task.urgency === 'urgent' ? '🔴 Urgent' : task.urgency === 'high' ? '🟡 High' : '🟢 Normal'} · +{task.xp_reward ?? 0} XP
              </div>
            </div>
          )
        })}

        {/* Completed */}
        {completedTasks.length > 0 && (
          <>
            <div style={{ padding: '8px 14px 4px', fontSize: 10, color: '#2D3748', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completed</div>
            {completedTasks.map(task => (
              <div key={task.id} style={{ padding: '10px 14px', borderBottom: '1px solid #1E2535', borderLeft: '3px solid #1E2535', opacity: 0.5 }}>
                <div style={{ fontSize: 11, color: '#4A5568', textDecoration: 'line-through', lineHeight: 1.3 }}>{task.title}</div>
                <div style={{ fontSize: 10, color: '#2D3748', marginTop: 2 }}>
                  {task.decision_quality === 'good' ? '✓ Strong' : task.decision_quality === 'bad' ? '✗ Review' : '~ Acceptable'} · +{task.xp_earned ?? 0} XP
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Active task panel */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {activeTask ? (
          <SimTaskPanel
            key={activeTask.id}
            task={activeTask}
            sessionId={activeSession?.id ?? ''}
            onComplete={handleComplete}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4A5568' }}>
            <div style={{ fontSize: 13 }}>Select a task from the left to begin</div>
          </div>
        )}
      </div>
    </div>
  )
}
