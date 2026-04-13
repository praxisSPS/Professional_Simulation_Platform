'use client'

/**
 * University Admin Portal
 * Used by university careers service staff to:
 * - View all enrolled students and their KPI progress
 * - Track cohort-level performance
 * - Export reports for employability metrics
 * - Manage student access and cohort assignments
 *
 * Access: users with role='university_admin' in profiles table
 * Route: /admin/university
 */

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'
import { LEVEL_TITLES } from '@/lib/kpi-engine'

interface StudentRow {
  id: string
  full_name: string
  email: string
  career_path: string
  current_level: number
  experience_points: number
  subscription_tier: string
  created_at: string
  latest_kpi?: {
    reliability_score: number
    quality_score: number
    responsiveness_score: number
    performance_index: number
    recorded_at: string
  }
  sessions_count?: number
}

interface CohortStats {
  total_students: number
  active_this_week: number
  avg_pi: number
  level_distribution: Record<number, number>
  path_distribution: Record<string, number>
  avg_reliability: number
  avg_quality: number
}

type SortKey = 'name' | 'level' | 'pi' | 'joined'
type FilterPath = 'all' | string

export default function UniversityAdminPage() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [stats, setStats] = useState<CohortStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortKey>('pi')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filterPath, setFilterPath] = useState<FilterPath>('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'students' | 'cohort' | 'export'>('students')
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)

    // Load all student profiles (in production this would be filtered by university_id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!profiles) { setLoading(false); return }

    // Load latest KPI for each student
    const studentRows: StudentRow[] = await Promise.all(
      profiles.map(async (p) => {
        const { data: kpi } = await supabase
          .from('kpi_metrics')
          .select('reliability_score, quality_score, responsiveness_score, performance_index, recorded_at')
          .eq('user_id', p.id)
          .order('recorded_at', { ascending: false })
          .limit(1)
          .single()

        const { count: sessionsCount } = await supabase
          .from('simulation_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', p.id)
          .eq('status', 'completed')

        return { ...p, latest_kpi: kpi ?? undefined, sessions_count: sessionsCount ?? 0 }
      })
    )

    setStudents(studentRows)

    // Compute cohort stats
    const piScores = studentRows.filter(s => s.latest_kpi).map(s => s.latest_kpi!.performance_index)
    const levelDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    const pathDist: Record<string, number> = {}
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    studentRows.forEach(s => {
      levelDist[s.current_level] = (levelDist[s.current_level] ?? 0) + 1
      pathDist[s.career_path] = (pathDist[s.career_path] ?? 0) + 1
    })

    const activeThisWeek = studentRows.filter(s =>
      s.latest_kpi && s.latest_kpi.recorded_at > oneWeekAgo
    ).length

    setStats({
      total_students: studentRows.length,
      active_this_week: activeThisWeek,
      avg_pi: piScores.length ? Math.round(piScores.reduce((a, b) => a + b, 0) / piScores.length) : 0,
      level_distribution: levelDist,
      path_distribution: pathDist,
      avg_reliability: Math.round(studentRows.filter(s => s.latest_kpi).reduce((a, s) => a + s.latest_kpi!.reliability_score, 0) / (piScores.length || 1)),
      avg_quality: Math.round(studentRows.filter(s => s.latest_kpi).reduce((a, s) => a + s.latest_kpi!.quality_score, 0) / (piScores.length || 1)),
    })

    setLoading(false)
  }

  function handleSort(key: SortKey) {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(key); setSortDir('desc') }
  }

  const filtered = students
    .filter(s => filterPath === 'all' || s.career_path === filterPath)
    .filter(s => !search || s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1
      if (sortBy === 'name') return mult * (a.full_name ?? '').localeCompare(b.full_name ?? '')
      if (sortBy === 'level') return mult * (a.current_level - b.current_level)
      if (sortBy === 'pi') return mult * ((a.latest_kpi?.performance_index ?? 0) - (b.latest_kpi?.performance_index ?? 0))
      if (sortBy === 'joined') return mult * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      return 0
    })

  function exportCSV() {
    const header = ['Name', 'Email', 'Career Path', 'Level', 'XP', 'Reliability', 'Quality', 'Responsiveness', 'PI Score', 'Sessions', 'Joined']
    const rows = filtered.map(s => [
      s.full_name ?? '',
      s.email,
      CAREER_PATH_DISPLAY[s.career_path]?.label ?? s.career_path,
      s.current_level,
      s.experience_points,
      s.latest_kpi?.reliability_score ?? '',
      s.latest_kpi?.quality_score ?? '',
      s.latest_kpi?.responsiveness_score ?? '',
      s.latest_kpi?.performance_index ?? '',
      s.sessions_count ?? 0,
      new Date(s.created_at).toLocaleDateString('en-GB'),
    ])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `Praxis_cohort_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 13, color: '#64748B' }}>
      Loading cohort data...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>

      {/* Header */}
      <div style={{ background: '#1F4E79', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>PRAXIS</span>
        <span style={{ color: '#B5D4F4', fontSize: 12 }}>University Admin Portal</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {(['students', 'cohort', 'export'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 14px', border: 'none', borderRadius: 6, fontSize: 12,
              background: view === v ? 'rgba(255,255,255,0.18)' : 'transparent',
              color: view === v ? '#fff' : '#B5D4F4', cursor: 'pointer', fontWeight: view === v ? 500 : 400,
            }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px' }}>

        {/* Stats strip */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Total students', val: stats.total_students, sub: 'enrolled' },
              { label: 'Active this week', val: stats.active_this_week, sub: `${Math.round(stats.active_this_week / Math.max(1, stats.total_students) * 100)}% engagement` },
              { label: 'Avg performance index', val: stats.avg_pi, sub: 'cohort average' },
              { label: 'Avg reliability', val: `${stats.avg_reliability}%`, sub: `Quality: ${stats.avg_quality}%` },
            ].map(m => (
              <div key={m.label} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#0F172A' }}>{m.val}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Students view */}
        {view === 'students' && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '8px 12px', border: '0.5px solid #CBD5E1', borderRadius: 8, fontSize: 13, outline: 'none', width: 260 }}
              />
              <select
                value={filterPath}
                onChange={e => setFilterPath(e.target.value)}
                style={{ padding: '8px 12px', border: '0.5px solid #CBD5E1', borderRadius: 8, fontSize: 13, outline: 'none' }}
              >
                <option value="all">All career paths</option>
                {Object.entries(CAREER_PATH_DISPLAY).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 4 }}>{filtered.length} students</span>
              <button onClick={exportCSV} style={{ marginLeft: 'auto', padding: '7px 16px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                Export CSV
              </button>
            </div>

            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 0.8fr 0.7fr 0.7fr 0.7fr 0.8fr', padding: '10px 16px', background: '#F8FAFC', borderBottom: '0.5px solid #E2E8F0' }}>
                {[['name', 'Student'], ['', 'Career path'], ['level', 'Level'], ['', 'XP'], ['', 'Reliability'], ['', 'Quality'], ['pi', 'PI Score'], ['joined', 'Joined']].map(([key, label]) => (
                  <div key={label} onClick={() => key && handleSort(key as SortKey)}
                    style={{ fontSize: 11, fontWeight: 600, color: '#64748B', cursor: key ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                    {label}
                    {key && sortBy === key && <span style={{ fontSize: 9 }}>{sortDir === 'desc' ? '↓' : '↑'}</span>}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((s, i) => (
                <div key={s.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 0.8fr 0.7fr 0.7fr 0.7fr 0.8fr',
                  padding: '11px 16px', borderBottom: i < filtered.length - 1 ? '0.5px solid #F1F5F9' : 'none',
                  alignItems: 'center', transition: 'background 0.1s',
                }}>
                  <div>
                    <div style={{ fontWeight: 500, color: '#0F172A' }}>{s.full_name || 'Unnamed'}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#374151' }}>{CAREER_PATH_DISPLAY[s.career_path]?.label ?? s.career_path}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>{s.sessions_count} sessions</div>
                  </div>
                  <div>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 99,
                      background: s.current_level >= 3 ? '#DCFCE7' : s.current_level >= 2 ? '#EFF6FF' : '#F1F5F9',
                      color: s.current_level >= 3 ? '#166534' : s.current_level >= 2 ? '#1E40AF' : '#64748B',
                      fontWeight: 500,
                    }}>
                      L{s.current_level} · {LEVEL_TITLES[s.current_level]}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{s.experience_points}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>{s.latest_kpi ? `${s.latest_kpi.reliability_score}%` : '—'}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>{s.latest_kpi ? `${s.latest_kpi.quality_score}%` : '—'}</div>
                  <div>
                    {s.latest_kpi ? (
                      <span style={{
                        fontSize: 13, fontWeight: 600,
                        color: s.latest_kpi.performance_index >= 85 ? '#166534' : s.latest_kpi.performance_index >= 70 ? '#1E40AF' : '#DC2626',
                      }}>
                        {s.latest_kpi.performance_index}
                      </span>
                    ) : <span style={{ color: '#CBD5E1' }}>—</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{new Date(s.created_at).toLocaleDateString('en-GB')}</div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                  No students match this filter.
                </div>
              )}
            </div>
          </>
        )}

        {/* Cohort analytics view */}
        {view === 'cohort' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Level distribution */}
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '20px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', marginBottom: 16 }}>Level distribution</div>
              {Object.entries(stats.level_distribution).map(([level, count]) => {
                const pct = stats.total_students > 0 ? Math.round((count / stats.total_students) * 100) : 0
                return (
                  <div key={level} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#374151', marginBottom: 4 }}>
                      <span>Level {level} — {LEVEL_TITLES[parseInt(level)]}</span>
                      <span style={{ color: '#64748B' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3 }}>
                      <div style={{ height: 6, borderRadius: 3, background: '#1F4E79', width: `${pct}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Career path distribution */}
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '20px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', marginBottom: 16 }}>Career path enrolment</div>
              {Object.entries(stats.path_distribution).sort((a, b) => b[1] - a[1]).map(([path, count]) => {
                const pct = stats.total_students > 0 ? Math.round((count / stats.total_students) * 100) : 0
                return (
                  <div key={path} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: '#EBF3FB', color: '#1F4E79', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                      {CAREER_PATH_DISPLAY[path]?.icon ?? '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#374151', marginBottom: 3 }}>
                        <span>{CAREER_PATH_DISPLAY[path]?.label ?? path}</span>
                        <span style={{ color: '#64748B' }}>{count}</span>
                      </div>
                      <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2 }}>
                        <div style={{ height: 4, borderRadius: 2, background: '#2E74B5', width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* KPI averages */}
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '20px', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', marginBottom: 16 }}>Cohort KPI averages</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Avg reliability', val: stats.avg_reliability, color: '#1D9E75' },
                  { label: 'Avg quality', val: stats.avg_quality, color: '#2E74B5' },
                  { label: 'Avg PI score', val: stats.avg_pi, color: '#1F4E79' },
                  { label: 'Engagement rate', val: Math.round(stats.active_this_week / Math.max(1, stats.total_students) * 100), color: '#7C3AED' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px' }}>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4 }}>{k.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: k.color }}>{k.val}%</div>
                    <div style={{ height: 3, background: '#E2E8F0', borderRadius: 2, marginTop: 6 }}>
                      <div style={{ height: 3, borderRadius: 2, background: k.color, width: `${k.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Export view */}
        {view === 'export' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 6 }}>Export cohort data</div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>
                Download a full cohort report for your employability metrics, DLHE reporting, or accreditation evidence.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={exportCSV} style={{ padding: '11px 20px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>
                  Full cohort CSV — all students, KPIs, levels, sessions
                </button>
                <button onClick={() => alert('PDF report available in Standard Licence tier')} style={{ padding: '11px 20px', background: '#F8FAFC', color: '#374151', border: '0.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
                  PDF summary report — cohort overview for senior leadership
                </button>
                <button onClick={() => alert('LMS export available in Enterprise tier')} style={{ padding: '11px 20px', background: '#F8FAFC', color: '#374151', border: '0.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
                  SCORM/LMS export — integrate results into your VLE
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
