'use client'

import { useEffect, useRef } from 'react'
import { LEVEL_TITLES, LEVEL_THRESHOLDS } from '@/lib/kpi-engine'

interface KPIRecord {
  id: string
  recorded_at: string
  session_id: string | null
  reliability_score: number
  responsiveness_score: number
  quality_score: number
  communication_score: number
  scope_control_score: number
  performance_index: number
  tasks_total: number
  tasks_on_time: number
  decisions_made: number
  decisions_good: number
}

interface TaskRecord {
  id: string
  title: string
  type: string
  score: number | null
  decision_quality: string | null
  xp_earned: number | null
  completed_at: string | null
  kpi_tag: string | null
  session_id: string | null
}

interface Props {
  history: KPIRecord[]
  latest: KPIRecord | null
  profile: any
  recentTasks: TaskRecord[]
}

// KPI targets per career path (what employers expect at each level)
const KPI_TARGETS: Record<string, { reliability: number; quality: number; responsiveness: number; scope_control: number }> = {
  data_engineering:        { reliability: 85, quality: 80, responsiveness: 75, scope_control: 80 },
  reliability_engineering: { reliability: 90, quality: 82, responsiveness: 80, scope_control: 78 },
  financial_analysis:      { reliability: 88, quality: 85, responsiveness: 72, scope_control: 75 },
  product_management:      { reliability: 82, quality: 82, responsiveness: 78, scope_control: 85 },
  project_management:      { reliability: 90, quality: 80, responsiveness: 80, scope_control: 88 },
  digital_marketing:       { reliability: 80, quality: 78, responsiveness: 82, scope_control: 75 },
}

const DEFAULT_TARGETS = { reliability: 85, quality: 80, responsiveness: 75, scope_control: 80 }

function ragColor(val: number, target: number): string {
  if (val >= target) return '#16A34A'
  if (val >= target * 0.8) return '#D97706'
  return '#DC2626'
}

function ragBg(val: number, target: number): string {
  if (val >= target) return '#F0FDF4'
  if (val >= target * 0.8) return '#FFFBEB'
  return '#FEF2F2'
}

const KPI_DEFS = [
  { key: 'reliability_score',    label: 'Reliability',       targetKey: 'reliability',    weight: '25%', desc: 'Tasks completed on time' },
  { key: 'quality_score',        label: 'Decision quality',  targetKey: 'quality',        weight: '30%', desc: 'Average score across all tasks' },
  { key: 'responsiveness_score', label: 'Responsiveness',    targetKey: 'responsiveness', weight: '20%', desc: 'Handling urgent tasks quickly' },
  { key: 'scope_control_score',  label: 'Scope control',     targetKey: 'scope_control',  weight: '10%', desc: 'Handling scope-creep scenarios' },
]

export default function KPIDashboard({ history, latest, profile, recentTasks }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  const careerPath = profile?.career_path ?? 'data_engineering'
  const targets = KPI_TARGETS[careerPath] ?? DEFAULT_TARGETS
  const nextLevelXP = LEVEL_THRESHOLDS[((profile?.current_level ?? 1) + 1) as keyof typeof LEVEL_THRESHOLDS] ?? 9999
  const xpPct = Math.min(100, Math.round(((profile?.experience_points ?? 0) / nextLevelXP) * 100))
  const piTarget = targets.quality

  // Group completed tasks by sim day (approximate: by date)
  const xpByDay: Record<string, number> = {}
  recentTasks.forEach(t => {
    if (!t.completed_at) return
    const day = new Date(t.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    xpByDay[day] = (xpByDay[day] ?? 0) + (t.xp_earned ?? 0)
  })

  useEffect(() => {
    if (!chartRef.current || history.length === 0) return

    async function buildChart() {
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)
      if (chartInstance.current) chartInstance.current.destroy()

      const labels = history.map(h =>
        new Date(h.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      )

      chartInstance.current = new Chart(chartRef.current!, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Performance Index',
              data: history.map(h => h.performance_index),
              borderColor: '#1F4E79', backgroundColor: 'rgba(31,78,121,0.06)',
              borderWidth: 2, fill: true, tension: 0.35, pointRadius: 3, pointBackgroundColor: '#1F4E79',
            },
            {
              label: 'Reliability',
              data: history.map(h => h.reliability_score),
              borderColor: '#16A34A', borderWidth: 1.5, fill: false, tension: 0.35, pointRadius: 2, borderDash: [4, 3],
            },
            {
              label: 'Quality',
              data: history.map(h => h.quality_score),
              borderColor: '#378ADD', borderWidth: 1.5, fill: false, tension: 0.35, pointRadius: 2, borderDash: [4, 3],
            },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#0F172A', titleColor: '#fff', bodyColor: '#B5D4F4', padding: 10, cornerRadius: 8 },
          },
          scales: {
            x: { ticks: { color: '#94A3B8', font: { size: 11 }, autoSkip: true, maxTicksLimit: 8 }, grid: { display: false }, border: { display: false } },
            y: { min: 0, max: 100, ticks: { color: '#94A3B8', font: { size: 11 }, stepSize: 20 }, grid: { color: '#F1F5F9', lineWidth: 1 }, border: { display: false } },
          },
        },
      })
    }

    buildChart()
    return () => { chartInstance.current?.destroy() }
  }, [history])

  if (!latest) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 8 }}>No KPI data yet</div>
          <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>
            Complete your first simulation session to generate KPI scores. Clock in from the Dashboard to start.
          </div>
        </div>
      </div>
    )
  }

  const piColor = latest.performance_index >= 85 ? '#16A34A' : latest.performance_index >= 70 ? '#1F4E79' : '#DC2626'
  const completedTasks = recentTasks.filter(t => t.completed_at).slice(0, 10)
  const xpDayEntries = Object.entries(xpByDay).slice(-7)

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* PI hero + level */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Performance index</div>
          <div style={{ fontSize: 56, fontWeight: 700, color: piColor, lineHeight: 1 }}>{latest.performance_index}</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Target: {piTarget} for Level {(profile?.current_level ?? 1) + 1}</div>
          <div style={{ width: '100%', height: 4, background: '#E2E8F0', borderRadius: 2, marginTop: 10 }}>
            <div style={{ height: 4, borderRadius: 2, background: piColor, width: `${Math.min(100, Math.round((latest.performance_index / piTarget) * 100))}%`, transition: 'width 0.6s' }} />
          </div>
        </div>

        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#0F172A', marginBottom: 12 }}>
            Level {profile?.current_level ?? 1} — {LEVEL_TITLES[profile?.current_level ?? 1]}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'KPI records', val: history.length },
              { label: 'Good decisions', val: latest.decisions_good ?? 0 },
              { label: 'Tasks on time', val: latest.tasks_on_time ?? 0 },
            ].map(s => (
              <div key={s.label} style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#0F172A' }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>XP to Level {(profile?.current_level ?? 1) + 1}</div>
          <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3 }}>
            <div style={{ height: 6, borderRadius: 3, background: '#1F4E79', width: `${xpPct}%`, transition: 'width 0.6s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
            <span>{profile?.experience_points ?? 0} XP</span>
            <span>{nextLevelXP} XP</span>
          </div>
        </div>
      </div>

      {/* RAG KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {KPI_DEFS.map(k => {
          const val = Math.round((latest as any)[k.key] ?? 0)
          const target = (targets as any)[k.targetKey] ?? 80
          const color = ragColor(val, target)
          const bg = ragBg(val, target)
          const status = val >= target ? 'On target' : val >= target * 0.8 ? 'Below target' : 'At risk'
          return (
            <div key={k.key} style={{ background: '#fff', border: `0.5px solid #E2E8F0`, borderRadius: 10, padding: '14px 16px', borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>{k.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.1 }}>{val}%</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>Target {target}%</div>
              <div style={{ marginTop: 8, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 99, display: 'inline-block', background: bg, color }}>
                {status}
              </div>
            </div>
          )
        })}
      </div>

      {/* Trend chart */}
      {history.length > 1 && (
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>Performance trend</span>
            <div style={{ display: 'flex', gap: 12 }}>
              {[{ label: 'PI', color: '#1F4E79' }, { label: 'Reliability', color: '#16A34A' }, { label: 'Quality', color: '#378ADD' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748B' }}>
                  <div style={{ width: 12, height: 2, background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', height: 200 }}>
            <canvas ref={chartRef} />
          </div>
        </div>
      )}

      {/* XP by day (week summary) */}
      {xpDayEntries.length > 0 && (
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', marginBottom: 12 }}>XP earned by day</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
            {xpDayEntries.map(([day, xp]) => {
              const maxXp = Math.max(...Object.values(xpByDay), 1)
              const pct = Math.round((xp / maxXp) * 100)
              return (
                <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, color: '#1F4E79', fontWeight: 600 }}>{xp}</div>
                  <div style={{ width: '100%', borderRadius: 4, background: '#1F4E79', height: `${Math.max(pct, 4)}%`, minHeight: 4 }} />
                  <div style={{ fontSize: 9, color: '#94A3B8', whiteSpace: 'nowrap' }}>{day}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Task history */}
      {completedTasks.length > 0 && (
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #E2E8F0' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>Recent task performance</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Task', 'Type', 'Score', 'Quality', 'XP'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: '#94A3B8', fontWeight: 500, borderBottom: '0.5px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completedTasks.map((t, i) => {
                const score = t.score ?? 0
                const scoreColor = score >= 75 ? '#16A34A' : score >= 55 ? '#D97706' : '#DC2626'
                return (
                  <tr key={t.id} style={{ borderBottom: i < completedTasks.length - 1 ? '0.5px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '9px 12px', color: '#374151', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</td>
                    <td style={{ padding: '9px 12px', color: '#94A3B8' }}>{t.type?.replace(/_/g, ' ')}</td>
                    <td style={{ padding: '9px 12px', fontWeight: 600, color: scoreColor }}>{score}%</td>
                    <td style={{ padding: '9px 12px', color: t.decision_quality === 'good' ? '#16A34A' : t.decision_quality === 'bad' ? '#DC2626' : '#D97706' }}>
                      {t.decision_quality ?? '—'}
                    </td>
                    <td style={{ padding: '9px 12px', color: '#1F4E79', fontWeight: 500 }}>+{t.xp_earned ?? 0}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Focus guidance */}
      <div style={{ background: '#EBF3FB', border: '0.5px solid #BFDBFE', borderRadius: 12, padding: '16px 18px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1E40AF', marginBottom: 10 }}>
          What to focus on next
        </div>
        {KPI_DEFS
          .map(k => ({ ...k, val: Math.round((latest as any)[k.key] ?? 0), target: (targets as any)[k.targetKey] ?? 80 }))
          .filter(k => k.val < k.target)
          .slice(0, 2)
          .map(k => (
            <div key={k.key} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#BFDBFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>!</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1E40AF' }}>{k.label}: {k.val}% vs {k.target}% target</div>
                <div style={{ fontSize: 11, color: '#3B82F6' }}>{k.desc}</div>
              </div>
            </div>
          ))}
        {KPI_DEFS.filter(k => Math.round((latest as any)[k.key] ?? 0) >= (targets as any)[k.targetKey]).length === KPI_DEFS.length && (
          <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 500 }}>All KPIs on target — great performance.</div>
        )}
      </div>

    </div>
  )
}
