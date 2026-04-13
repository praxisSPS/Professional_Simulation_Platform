'use client'

import { useEffect, useRef } from 'react'
import { LEVEL_TITLES, LEVEL_THRESHOLDS } from '@/lib/kpi-engine'

interface KPIRecord {
  id: string
  recorded_at: string
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

interface Props {
  history: KPIRecord[]
  latest: KPIRecord | null
  profile: any
}

const KPI_DEFS = [
  { key: 'reliability_score',     label: 'Reliability',      weight: '25%', color: '#1D9E75', desc: 'Tasks completed on time vs total tasks assigned' },
  { key: 'quality_score',         label: 'Decision quality', weight: '30%', color: '#378ADD', desc: 'Average score across all decision-point tasks' },
  { key: 'responsiveness_score',  label: 'Responsiveness',   weight: '20%', color: '#EF9F27', desc: 'How quickly you handle urgent messages and tasks' },
  { key: 'communication_score',   label: 'Communication',    weight: '15%', color: '#7C3AED', desc: 'Tone, clarity, and professionalism of your written responses' },
  { key: 'scope_control_score',   label: 'Scope control',    weight: '10%', color: '#D85A30', desc: 'How well you handle scope-creep scenarios without over-committing' },
]

export default function KPIsClient({ history, latest, profile }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  const nextLevelXP = LEVEL_THRESHOLDS[((profile?.current_level ?? 1) + 1) as keyof typeof LEVEL_THRESHOLDS] ?? 9999
  const xpPct = Math.min(100, Math.round(((profile?.experience_points ?? 0) / nextLevelXP) * 100))
  const piTarget = profile?.current_level >= 4 ? 90 : profile?.current_level >= 3 ? 82 : profile?.current_level >= 2 ? 78 : 72

  // Build chart when history changes
  useEffect(() => {
    if (!chartRef.current || history.length === 0) return

    async function buildChart() {
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)

      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

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
              borderColor: '#1F4E79',
              backgroundColor: 'rgba(31,78,121,0.06)',
              borderWidth: 2,
              fill: true,
              tension: 0.35,
              pointRadius: 3,
              pointBackgroundColor: '#1F4E79',
            },
            {
              label: 'Reliability',
              data: history.map(h => h.reliability_score),
              borderColor: '#1D9E75',
              borderWidth: 1.5,
              fill: false,
              tension: 0.35,
              pointRadius: 2,
              borderDash: [4, 3],
            },
            {
              label: 'Quality',
              data: history.map(h => h.quality_score),
              borderColor: '#378ADD',
              borderWidth: 1.5,
              fill: false,
              tension: 0.35,
              pointRadius: 2,
              borderDash: [4, 3],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0F172A',
              titleColor: '#fff',
              bodyColor: '#B5D4F4',
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            x: {
              ticks: { color: '#94A3B8', font: { size: 11 }, autoSkip: true, maxTicksLimit: 8 },
              grid: { display: false },
              border: { display: false },
            },
            y: {
              min: 0, max: 100,
              ticks: { color: '#94A3B8', font: { size: 11 }, stepSize: 20 },
              grid: { color: '#F1F5F9', lineWidth: 1 },
              border: { display: false },
            },
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

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* PI hero + level progress */}
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
              { label: 'Sessions', val: history.length },
              { label: 'Good decisions', val: latest.decisions_good ?? 0 },
              { label: 'Tasks on time', val: latest.tasks_on_time ?? 0 },
            ].map(s => (
              <div key={s.label} style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#0F172A' }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>XP progress to Level {(profile?.current_level ?? 1) + 1}</div>
          <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3 }}>
            <div style={{ height: 6, borderRadius: 3, background: '#1F4E79', width: `${xpPct}%`, transition: 'width 0.6s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
            <span>{profile?.experience_points ?? 0} XP</span>
            <span>{nextLevelXP} XP</span>
          </div>
        </div>
      </div>

      {/* Trend chart */}
      {history.length > 1 && (
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>KPI trend</span>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { label: 'PI', color: '#1F4E79' },
                { label: 'Reliability', color: '#1D9E75' },
                { label: 'Quality', color: '#378ADD' },
              ].map(l => (
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

      {/* KPI breakdown */}
      <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', marginBottom: 14 }}>KPI breakdown</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {KPI_DEFS.map(k => {
            const val = (latest as any)[k.key] ?? 0
            const prev = history.length > 1 ? (history[history.length - 2] as any)[k.key] ?? 0 : null
            const delta = prev !== null ? val - prev : null

            return (
              <div key={k.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{k.label}</span>
                    <span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 6 }}>weight {k.weight}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    {delta !== null && (
                      <span style={{ fontSize: 11, color: delta >= 0 ? '#16A34A' : '#DC2626', fontWeight: 500 }}>
                        {delta >= 0 ? '+' : ''}{Math.round(delta)}
                      </span>
                    )}
                    <span style={{ fontSize: 18, fontWeight: 600, color: k.color }}>{Math.round(val)}%</span>
                  </div>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3 }}>
                  <div style={{ height: 6, borderRadius: 3, background: k.color, width: `${val}%`, transition: 'width 0.6s' }} />
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{k.desc}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* What to improve */}
      <div style={{ background: '#EBF3FB', border: '0.5px solid #BFDBFE', borderRadius: 12, padding: '16px 18px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1E40AF', marginBottom: 10 }}>
          What to focus on to reach Level {(profile?.current_level ?? 1) + 1}
        </div>
        {KPI_DEFS
          .map(k => ({ ...k, val: (latest as any)[k.key] ?? 0 }))
          .sort((a, b) => a.val - b.val)
          .slice(0, 2)
          .map(k => (
            <div key={k.key} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#BFDBFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>!</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1E40AF' }}>{k.label} is your lowest score at {Math.round(k.val)}%</div>
                <div style={{ fontSize: 11, color: '#3B82F6' }}>{k.desc}</div>
              </div>
            </div>
          ))}
      </div>

    </div>
  )
}
