'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SimTaskPanel from '@/components/SimTaskPanel'
import dynamic from 'next/dynamic'

// ── Tool definitions per career path ──────────────────────────
const CAREER_PATH_TOOLS: Record<string, { id: string; label: string; desc: string }[]> = {
  project_management: [
    { id: 'raid',   label: 'RAID Log',          desc: 'Track risks, assumptions, issues, dependencies' },
    { id: 'gantt',  label: 'Gantt Timeline',    desc: 'Plan and visualise the project schedule' },
    { id: 'status', label: 'Status Report',     desc: 'Write a RAG status update for stakeholders' },
    { id: 'comms',  label: 'Stakeholder Comms', desc: 'Draft communications and meeting notes' },
    { id: 'change', label: 'Change Request',    desc: 'Assess and document scope changes' },
  ],
  product_management: [
    { id: 'story',   label: 'User Story Editor', desc: 'Write user stories with acceptance criteria' },
    { id: 'roadmap', label: 'Roadmap Builder',   desc: 'Plan the product roadmap by sprint' },
    { id: 'prd',     label: 'PRD Writer',        desc: 'Write a Product Requirements Document' },
    { id: 'comms',   label: 'Stakeholder Comms', desc: 'Draft emails and stakeholder communications' },
  ],
  financial_analysis: [
    { id: 'model',    label: 'Spreadsheet Model', desc: 'Build financial models and calculations' },
    { id: 'variance', label: 'Variance Writer',   desc: 'Analyse budget vs actual variances' },
    { id: 'scenario', label: 'Scenario Modeller', desc: 'Build base, upside, and downside scenarios' },
    { id: 'deck',     label: 'Presentation',      desc: 'Build board-ready financial narratives' },
  ],
  reliability_engineering: [
    { id: 'rca',   label: 'RCA Workbench', desc: 'Root cause analysis for equipment failures' },
    { id: 'fmea',  label: 'FMEA Tool',    desc: 'Failure Mode and Effects Analysis' },
    { id: 'sop',   label: 'SOP Builder',  desc: 'Write standard operating procedures' },
    { id: 'cmms',  label: 'CMMS / Work Order', desc: 'Log and manage maintenance work orders' },
    { id: 'shift', label: 'Shift Report', desc: 'Write shift handover and status notes' },
  ],
  data_engineering: [
    { id: 'sql',    label: 'SQL Editor',     desc: 'Write SQL queries and transformations' },
    { id: 'python', label: 'Python Script',  desc: 'Write Python for data pipelines' },
    { id: 'arch',   label: 'Architecture Diagram', desc: 'Design system and data architecture' },
    { id: 'dq',     label: 'Data Quality',   desc: 'Check and document data quality issues' },
  ],
  digital_marketing: [
    { id: 'dashboard', label: 'Campaign Dashboard', desc: 'Review and analyse campaign performance' },
    { id: 'copy',      label: 'Copy Editor',        desc: 'Write ad copy, emails, and content' },
    { id: 'abtest',    label: 'A/B Test Planner',   desc: 'Design and document A/B tests' },
    { id: 'builder',   label: 'Campaign Builder',   desc: 'Plan and structure campaigns' },
    { id: 'analytics', label: 'Analytics',          desc: 'Interpret data and write insights' },
  ],
}

type WP = { task: any; sessionId: string; onComplete: (result: any) => void; initialTab?: string; careerPath?: string }
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
  const [toolSelectedForTask, setToolSelectedForTask] = useState<Record<string, string>>({})
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
          toolSelectedForTask[activeTask.id] === undefined ? (
            <ToolSelectScreen
              task={activeTask}
              careerPath={profile?.career_path ?? ''}
              onSelect={async (toolId) => {
                setToolSelectedForTask(prev => ({ ...prev, [activeTask.id]: toolId }))
                await fetch(`/api/tasks/${activeTask.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tool_used: toolId }),
                }).catch(() => {})
              }}
            />
          ) : (
            <TaskWorkspace
              key={activeTask.id}
              task={activeTask}
              sessionId={activeSession?.id ?? ''}
              careerPath={profile?.career_path ?? ''}
              onComplete={handleComplete}
              initialTab={toolSelectedForTask[activeTask.id]}
            />
          )
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
  initialTab?: string
}

function TaskWorkspace({ task, sessionId, careerPath, onComplete, initialTab }: WorkspaceProps) {
  const props = { task, sessionId, onComplete, careerPath, initialTab }
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

// ── Tool selection screen ──────────────────────────────────────

function ToolSelectScreen({ task, careerPath, onSelect }: {
  task: any
  careerPath: string
  onSelect: (toolId: string) => void
}) {
  const tools = CAREER_PATH_TOOLS[careerPath] ?? []

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 0', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#00C2A8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          New task
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0', marginBottom: 10, lineHeight: 1.3 }}>
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

      <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', marginBottom: 12 }}>
        Which tool will you use to complete this task?
      </div>
      <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 16 }}>
        Your choice is part of the assessment — pick the tool most appropriate for this task type.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => onSelect(tool.id)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 16px', background: '#0D1117',
              border: '1px solid #1E2535', borderRadius: 8,
              cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#00C2A8')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E2535')}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#001A17', border: '1px solid #00C2A8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 14 }}>
                {tool.id === 'sql' ? '⌗' : tool.id === 'python' ? '⌘' : tool.id === 'arch' ? '◈' :
                 tool.id === 'rca' ? '⚙' : tool.id === 'fmea' ? '⚠' : tool.id === 'shift' ? '📋' :
                 tool.id === 'raid' ? '⚑' : tool.id === 'gantt' ? '▦' : tool.id === 'status' ? '◉' :
                 tool.id === 'story' ? '✎' : tool.id === 'roadmap' ? '→' : tool.id === 'model' ? '⊞' :
                 tool.id === 'dashboard' ? '⊹' : tool.id === 'analytics' ? '↗' : '▷'}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', marginBottom: 2 }}>{tool.label}</div>
              <div style={{ fontSize: 11, color: '#4A5568' }}>{tool.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
