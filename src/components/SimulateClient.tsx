'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SimTaskPanel from '@/components/SimTaskPanel'
import dynamic from 'next/dynamic'

type WP = { task: any; sessionId: string; onComplete: (result: any) => void; initialTab?: string }
const WorkspaceDE  = dynamic<WP>(() => import('@/components/simulate/WorkspaceDE'),  { ssr: false })
const WorkspaceRE  = dynamic<WP>(() => import('@/components/simulate/WorkspaceRE'),  { ssr: false })
const WorkspaceFA  = dynamic<WP>(() => import('@/components/simulate/WorkspaceFA'),  { ssr: false })
const WorkspacePM  = dynamic<WP>(() => import('@/components/simulate/WorkspacePM'),  { ssr: false })
const WorkspacePJM = dynamic<WP>(() => import('@/components/simulate/WorkspacePJM'), { ssr: false })
const WorkspaceDM  = dynamic<WP>(() => import('@/components/simulate/WorkspaceDM'),  { ssr: false })

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

  // No pending tasks
  if (sortedPending.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B', fontSize: 13, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>📭</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#E2E8F0', marginBottom: 8 }}>No active tasks</div>
        <div style={{ marginBottom: 20, color: '#4A5568' }}>
          {completedTasks.length > 0
            ? `You've completed ${completedTasks.length} task${completedTasks.length !== 1 ? 's' : ''} today. End your day from the Dashboard to wrap up.`
            : 'Clock in from the Dashboard to receive tasks from your AI colleagues.'}
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ padding: '10px 24px', background: '#00C2A8', color: '#0A0A0F', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Go to Dashboard →
        </button>
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
          <TaskWorkspace
            key={activeTask.id}
            task={activeTask}
            sessionId={activeSession?.id ?? ''}
            careerPath={profile?.career_path ?? ''}
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

// ── Task workspace: routes to the right editor per career path + task type ──

interface WorkspaceProps {
  task: any
  sessionId: string
  careerPath: string
  onComplete: (result: any) => void
}

function TaskWorkspace({ task, sessionId, careerPath, onComplete }: WorkspaceProps) {
  const props = { task, sessionId, onComplete }
  switch (careerPath) {
    case 'data_engineering':        return <WorkspaceDE  {...props} />
    case 'reliability_engineering': return <WorkspaceRE  {...props} />
    case 'financial_analysis':      return <WorkspaceFA  {...props} />
    case 'product_management':      return <WorkspacePM  {...props} />
    case 'project_management':      return <WorkspacePJM {...props} />
    case 'digital_marketing':       return <WorkspaceDM  {...props} />
    default:                        return <SimTaskPanel task={task} sessionId={sessionId} onComplete={onComplete} />
  }
}
