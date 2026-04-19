'use client'

import { useState } from 'react'

interface TaskItem {
  id: string
  title: string
  type: string
  score: number | null
  xp_earned: number | null
  completed_at: string | null
  project_ref: string | null
  assigned_at: string | null
  urgency: string
}

interface ProjectWithStats {
  id: string
  name: string
  description: string
  start_day: number
  end_day: number
  career_path: string
  totalTasks: number
  completedTasks: number
  status: 'not_started' | 'in_progress' | 'complete'
  team: Array<{ name: string; role: string }>
  tasks: TaskItem[]
}

interface Props {
  projects: ProjectWithStats[]
  simDay: number
}

const TIMELINE_DAYS = 5

function fmtProject(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function initials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function StatusBadge({ status }: { status: ProjectWithStats['status'] }) {
  const map = {
    not_started: { label: 'Not Started', bg: '#F1F5F9', color: '#64748B' },
    in_progress:  { label: 'In Progress', bg: '#EBF3FB', color: '#1F4E79' },
    complete:     { label: 'Complete',    bg: '#DCFCE7', color: '#166534' },
  }
  const s = map[status]
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 9px', borderRadius: 99, background: s.bg, color: s.color, letterSpacing: '0.04em' }}>
      {s.label}
    </span>
  )
}

function TeamPills({ team }: { team: Array<{ name: string; role: string }> }) {
  if (team.length === 0) return <span style={{ fontSize: 11, color: '#94A3B8' }}>—</span>
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {team.map(m => (
        <div key={m.name} title={`${m.name} — ${m.role}`} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: '#F1F5F9', borderRadius: 99, padding: '3px 9px 3px 4px',
        }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#BFDBFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
            {initials(m.name)}
          </div>
          <span style={{ fontSize: 11, color: '#334155' }}>{m.name.split(' ')[0]}</span>
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  const color = pct === 100 ? '#16A34A' : pct > 0 ? '#1F4E79' : '#E2E8F0'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#64748B' }}>{completed} / {total} tasks</span>
        <span style={{ fontSize: 11, color: pct === 100 ? '#16A34A' : '#1F4E79', fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.3s' }} />
      </div>
    </div>
  )
}

// ── Section 1: Active project cards ──────────────────────────────

function ProjectCard({ project, expanded, onToggle }: {
  project: ProjectWithStats
  expanded: boolean
  onToggle: () => void
}) {
  const displayEnd = Math.min(project.end_day, 5)
  const longRunning = project.end_day > 5

  return (
    <div style={{
      background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden',
      borderLeft: `3px solid ${project.status === 'complete' ? '#16A34A' : project.status === 'in_progress' ? '#1F4E79' : '#E2E8F0'}`,
    }}>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>
              {fmtProject(project.name)}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>
              Day {project.start_day}–{displayEnd}{longRunning ? '+' : ''} &nbsp;·&nbsp; {project.career_path.replace(/_/g, ' ')}
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, marginBottom: 14 }}>
          {project.description}
        </div>

        <ProgressBar completed={project.completedTasks} total={project.totalTasks} />

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Team</div>
          <TeamPills team={project.team} />
        </div>
      </div>

      {project.totalTasks > 0 && (
        <button
          onClick={onToggle}
          style={{
            width: '100%', padding: '9px 18px', background: '#F8FAFC', border: 'none',
            borderTop: '0.5px solid #F1F5F9', cursor: 'pointer', textAlign: 'left',
            fontSize: 12, color: '#1F4E79', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ transform: expanded ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s', fontSize: 10 }}>▶</span>
          {expanded ? 'Hide' : `View ${project.totalTasks} task${project.totalTasks !== 1 ? 's' : ''}`}
        </button>
      )}

      {expanded && project.totalTasks > 0 && (
        <div style={{ borderTop: '0.5px solid #F1F5F9' }}>
          {project.tasks.map(t => (
            <div key={t.id} style={{
              padding: '10px 18px', borderBottom: '0.5px solid #F8FAFC',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 12, color: t.completed_at ? '#374151' : '#0F172A', fontWeight: t.completed_at ? 400 : 500, textDecoration: t.completed_at ? 'none' : 'none' }}>
                  {t.title}
                </div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
                  {t.type.replace(/_/g, ' ')}
                  {t.completed_at ? ` · Completed ${fmtDate(t.completed_at)}` : ' · Pending'}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                {t.completed_at && t.score != null ? (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.score >= 75 ? '#16A34A' : t.score >= 55 ? '#D97706' : '#DC2626' }}>
                      {t.score}%
                    </div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>+{t.xp_earned ?? 0} XP</div>
                  </>
                ) : (
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: t.urgency === 'urgent' ? '#FEE2E2' : t.urgency === 'high' ? '#FEF3C7' : '#F1F5F9', color: t.urgency === 'urgent' ? '#991B1B' : t.urgency === 'high' ? '#92400E' : '#64748B' }}>
                    {t.urgency}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Section 2: Gantt-style timeline ──────────────────────────────

function ProjectTimeline({ projects, simDay }: { projects: ProjectWithStats[]; simDay: number }) {
  const dayCount = TIMELINE_DAYS
  const clampedDay = Math.min(simDay, dayCount)

  return (
    <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '0.5px solid #E2E8F0' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Project Timeline</div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>Days 1–5 · vertical line = current sim day</div>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Day header */}
        <div style={{ display: 'flex', marginBottom: 10, paddingLeft: 148 }}>
          {Array.from({ length: dayCount }, (_, i) => i + 1).map(d => (
            <div key={d} style={{
              flex: 1, textAlign: 'center', fontSize: 10, fontWeight: 600,
              color: d === clampedDay ? '#1F4E79' : '#94A3B8',
              letterSpacing: '0.04em',
            }}>
              D{d}
            </div>
          ))}
        </div>

        {/* Project rows */}
        {projects.map(p => {
          const start = Math.min(p.start_day, dayCount)
          const end = Math.min(p.end_day, dayCount)
          const leftPct = ((start - 1) / dayCount) * 100
          const widthPct = ((end - start + 1) / dayCount) * 100
          const barColor = p.status === 'complete' ? '#16A34A' : p.status === 'in_progress' ? '#1F4E79' : '#CBD5E1'
          const longRunning = p.end_day > dayCount

          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, height: 28 }}>
              {/* Project label */}
              <div style={{ width: 148, flexShrink: 0, fontSize: 11, color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>
                {fmtProject(p.name)}
              </div>

              {/* Bar area */}
              <div style={{ flex: 1, position: 'relative', height: 20 }}>
                {/* Grid lines */}
                {Array.from({ length: dayCount - 1 }, (_, i) => i + 1).map(d => (
                  <div key={d} style={{
                    position: 'absolute', left: `${(d / dayCount) * 100}%`,
                    top: 0, bottom: 0, width: 1, background: '#F1F5F9',
                  }} />
                ))}

                {/* Project bar */}
                <div style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  top: 3, bottom: 3,
                  background: barColor,
                  borderRadius: 4,
                  opacity: 0.85,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  paddingRight: 4,
                }}>
                  {longRunning && (
                    <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>→</span>
                  )}
                </div>

                {/* Current day marker */}
                <div style={{
                  position: 'absolute',
                  left: `${((clampedDay - 0.5) / dayCount) * 100}%`,
                  top: -2, bottom: -2,
                  width: 2, background: '#EF4444',
                  borderRadius: 1,
                  opacity: 0.7,
                  zIndex: 2,
                }} />
              </div>
            </div>
          )
        })}

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 12, borderTop: '0.5px solid #F1F5F9' }}>
          {[
            { color: '#CBD5E1', label: 'Not started' },
            { color: '#1F4E79', label: 'In progress' },
            { color: '#16A34A', label: 'Complete' },
            { color: '#EF4444', label: 'Today' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: l.label === 'Today' ? 2 : 12, height: l.label === 'Today' ? 12 : 6, background: l.color, borderRadius: l.label === 'Today' ? 1 : 3 }} />
              <span style={{ fontSize: 10, color: '#94A3B8' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section 3: My contributions ───────────────────────────────────

function MyContributions({ projects }: { projects: ProjectWithStats[] }) {
  const contributions = projects
    .map(p => {
      const done = p.tasks.filter(t => t.completed_at && t.score != null)
      if (done.length === 0) return null
      const totalXP = done.reduce((s, t) => s + (t.xp_earned ?? 0), 0)
      const avgScore = Math.round(done.reduce((s, t) => s + (t.score ?? 0), 0) / done.length)
      return { project: p, done, totalXP, avgScore }
    })
    .filter(Boolean) as Array<{ project: ProjectWithStats; done: TaskItem[]; totalXP: number; avgScore: number }>

  if (contributions.length === 0) {
    return (
      <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '32px 18px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#94A3B8' }}>No completed tasks yet. Complete tasks to see your project contributions.</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {contributions.map(({ project, done, totalXP, avgScore }) => (
        <div key={project.id} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '0.5px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{fmtProject(project.name)}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{done.length} task{done.length !== 1 ? 's' : ''} completed</div>
            </div>
            <div style={{ display: 'flex', gap: 16, textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: avgScore >= 75 ? '#16A34A' : avgScore >= 55 ? '#D97706' : '#DC2626' }}>{avgScore}%</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>Avg score</div>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#7C3AED' }}>+{totalXP}</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>XP earned</div>
              </div>
            </div>
          </div>

          {done.map(t => (
            <div key={t.id} style={{ padding: '9px 18px', borderBottom: '0.5px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#374151' }}>{t.title}</div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>
                  {t.completed_at ? fmtDate(t.completed_at) : ''} · {t.type.replace(/_/g, ' ')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0, marginLeft: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: (t.score ?? 0) >= 75 ? '#16A34A' : (t.score ?? 0) >= 55 ? '#D97706' : '#DC2626' }}>
                  {t.score}%
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>+{t.xp_earned ?? 0} XP</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────

export default function ProjectsClient({ projects, simDay }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'projects' | 'timeline' | 'contributions'>('projects')

  const sections = [
    { id: 'projects',      label: 'Active Projects' },
    { id: 'timeline',      label: 'Timeline' },
    { id: 'contributions', label: 'My Contributions' },
  ] as const

  const inProgress = projects.filter(p => p.status === 'in_progress').length
  const complete = projects.filter(p => p.status === 'complete').length

  return (
    <div style={{ padding: '20px', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Projects</div>
        <div style={{ fontSize: 12, color: '#64748B' }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
          {inProgress} in progress &nbsp;·&nbsp; {complete} complete &nbsp;·&nbsp; Day {simDay}
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '0.5px solid #E2E8F0', marginBottom: 20 }}>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
              color: activeSection === s.id ? '#1F4E79' : '#64748B',
              borderBottom: activeSection === s.id ? '2px solid #1F4E79' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Section 1: Active Projects */}
      {activeSection === 'projects' && (
        projects.length === 0 ? (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#94A3B8' }}>No projects found for your career path.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 14 }}>
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                expanded={expandedId === p.id}
                onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
              />
            ))}
          </div>
        )
      )}

      {/* Section 2: Timeline */}
      {activeSection === 'timeline' && (
        <ProjectTimeline projects={projects} simDay={simDay} />
      )}

      {/* Section 3: My Contributions */}
      {activeSection === 'contributions' && (
        <MyContributions projects={projects} />
      )}
    </div>
  )
}
