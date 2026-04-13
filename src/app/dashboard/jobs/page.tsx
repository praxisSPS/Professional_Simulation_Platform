'use client'

/**
 * Job Board — multi-organisation vacancy system
 * Users browse open positions across all virtual organisations.
 * They can apply if their level and PI score meet requirements.
 * This is the feature that makes Praxis a career platform, not just a training tool.
 */

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'
import { LEVEL_TITLES } from '@/lib/kpi-engine'

interface JobPosting {
  id: string
  title: string
  career_path: string
  level_required: number
  min_pi_score: number
  description: string
  is_open: boolean
  posted_at: string
  organisations: {
    name: string
    type: string
    industry: string
    culture: string
    logo_initials: string
  }
}

interface Profile {
  id: string
  current_level: number
  career_path: string
  performance_index?: number
}

const ORG_COLORS: Record<string, { bg: string; text: string }> = {
  startup:       { bg: '#EBF3FB', text: '#1F4E79' },
  bank:          { bg: '#EEEDFE', text: '#3C3489' },
  agency:        { bg: '#EAF3DE', text: '#27500A' },
  corporate:     { bg: '#FAEEDA', text: '#633806' },
  public_sector: { bg: '#F1EFE8', text: '#444441' },
}

const CULTURE_LABELS: Record<string, { label: string; color: string }> = {
  fast_paced:  { label: 'Fast-paced', color: '#DC2626' },
  demanding:   { label: 'High standards', color: '#D97706' },
  balanced:    { label: 'Balanced', color: '#16A34A' },
  structured:  { label: 'Structured', color: '#2563EB' },
}

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [latestPI, setLatestPI] = useState<number>(0)
  const [applications, setApplications] = useState<Set<string>>(new Set())
  const [filterPath, setFilterPath] = useState('all')
  const [filterLevel, setFilterLevel] = useState(0)
  const [applying, setApplying] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: prof }, { data: jobData }, { data: apps }, { data: kpi }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('job_postings').select('*, organisations(name, type, industry, culture, logo_initials)').eq('is_open', true).order('posted_at', { ascending: false }),
      supabase.from('job_applications').select('job_id').eq('user_id', user.id),
      supabase.from('kpi_metrics').select('performance_index').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(1).single(),
    ])

    setProfile(prof)
    setJobs(jobData ?? [])
    setApplications(new Set((apps ?? []).map((a: any) => a.job_id)))
    setLatestPI(kpi?.performance_index ?? 0)
    setLoading(false)
  }

  async function applyToJob(jobId: string) {
    if (!profile) return
    setApplying(jobId)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('job_applications').insert({
      job_id: jobId,
      user_id: user.id,
      status: 'pending',
    })

    setApplications(prev => new Set([...prev, jobId]))
    setApplying(null)
  }

  const canApply = (job: JobPosting) => {
    if (!profile) return false
    return profile.current_level >= job.level_required && latestPI >= job.min_pi_score
  }

  const filtered = jobs
    .filter(j => filterPath === 'all' || j.career_path === filterPath)
    .filter(j => filterLevel === 0 || j.level_required === filterLevel)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, fontSize: 13, color: '#64748B' }}>
      Loading job board...
    </div>
  )

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>

      {/* My eligibility banner */}
      {profile && (
        <div style={{ background: '#EBF3FB', border: '0.5px solid #BFDBFE', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: '#1E40AF' }}>
            <span style={{ fontWeight: 600 }}>Your profile:</span> Level {profile.current_level} · {CAREER_PATH_DISPLAY[profile.career_path]?.label} · PI: {latestPI}
          </div>
          <div style={{ fontSize: 11, color: '#3B82F6', marginLeft: 'auto' }}>
            {filtered.filter(j => canApply(j) && !applications.has(j.id)).length} roles you can apply to now
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterPath} onChange={e => setFilterPath(e.target.value)}
          style={{ padding: '7px 12px', border: '0.5px solid #CBD5E1', borderRadius: 8, fontSize: 12, outline: 'none' }}>
          <option value="all">All career paths</option>
          {Object.entries(CAREER_PATH_DISPLAY).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select value={filterLevel} onChange={e => setFilterLevel(parseInt(e.target.value))}
          style={{ padding: '7px 12px', border: '0.5px solid #CBD5E1', borderRadius: 8, fontSize: 12, outline: 'none' }}>
          <option value={0}>All levels</option>
          {[1, 2, 3, 4, 5].map(l => <option key={l} value={l}>Level {l} — {LEVEL_TITLES[l]}</option>)}
        </select>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>{filtered.length} open roles</span>
      </div>

      {/* Job listings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(job => {
          const org = job.organisations as any
          const orgColors = ORG_COLORS[org?.type ?? 'startup']
          const applied = applications.has(job.id)
          const eligible = canApply(job)
          const culture = CULTURE_LABELS[org?.culture ?? 'balanced']

          return (
            <div key={job.id} style={{
              background: '#fff', border: `0.5px solid ${applied ? '#86EFAC' : eligible ? '#E2E8F0' : '#F1F5F9'}`,
              borderRadius: 12, padding: '16px 18px', opacity: (!eligible && !applied) ? 0.65 : 1,
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {/* Org logo */}
                <div style={{ width: 44, height: 44, borderRadius: 10, background: orgColors.bg, color: orgColors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {org?.logo_initials ?? '??'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{job.title}</div>
                    {applied && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#DCFCE7', color: '#166534', fontWeight: 500 }}>Applied</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    {org?.name} · {org?.industry}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#F1F5F9', color: '#64748B' }}>
                      {CAREER_PATH_DISPLAY[job.career_path]?.label ?? job.career_path}
                    </span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#EBF3FB', color: '#1F4E79' }}>
                      Min Level {job.level_required}
                    </span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#F1F5F9', color: '#64748B' }}>
                      Min PI: {job.min_pi_score}
                    </span>
                    {culture && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#F8FAFC', color: culture.color }}>
                        {culture.label}
                      </span>
                    )}
                  </div>
                  {job.description && (
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 8, lineHeight: 1.5 }}>{job.description}</div>
                  )}
                </div>

                {/* Apply button */}
                <div style={{ flexShrink: 0 }}>
                  {applied ? (
                    <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 500, padding: '8px 0' }}>Application sent ✓</div>
                  ) : eligible ? (
                    <button
                      onClick={() => applyToJob(job.id)}
                      disabled={applying === job.id}
                      style={{ padding: '8px 16px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {applying === job.id ? 'Applying...' : 'Apply now'}
                    </button>
                  ) : (
                    <div style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', maxWidth: 100 }}>
                      Requires L{job.level_required} · PI {job.min_pi_score}+
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: 13 }}>
            No open roles matching this filter. Check back as new positions are added weekly.
          </div>
        )}
      </div>
    </div>
  )
}
