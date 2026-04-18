// src/app/portfolio/[certificateId]/page.tsx
// Public-facing portfolio — shareable URL for graduates
// No auth required — employers can view this directly
// URL format: /portfolio/PRX-2026-4821

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'
import { LEVEL_TITLES } from '@/lib/kpi-engine'

// Public Supabase client (anon key only — RLS allows public portfolio reads)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  params: { certificateId: string }
}

export default async function PortfolioPage({ params }: Props) {
  const { data: entry } = await supabase
    .from('portfolio_entries')
    .select('*, profiles(full_name, email, career_path, current_level, experience_points)')
    .eq('certificate_id', params.certificateId)
    .eq('is_public', true)
    .single()

  if (!entry) notFound()

  const profile = entry.profiles as any
  const careerDisplay = CAREER_PATH_DISPLAY[entry.career_path]

  const achievements: string[] = Array.isArray(entry.key_achievements) ? entry.key_achievements : []
  const competencyTags: string[] = Array.isArray(entry.competency_tags) ? entry.competency_tags : []

  const pi = entry.final_pi_score ?? 0
  const piColor = pi >= 85 ? '#16A34A' : pi >= 70 ? '#1F4E79' : '#DC2626'

  return (
    <html lang="en">
      <head>
        <title>{profile?.full_name ?? 'Graduate'} — Praxis Experience Certificate</title>
        <meta name="description" content={`Verified workplace experience portfolio for ${profile?.full_name} — ${careerDisplay?.label}`} />
        <meta property="og:title" content={`${profile?.full_name} — Praxis Verified Portfolio`} />
        <meta property="og:description" content={`Performance Index: ${pi}/100 · ${careerDisplay?.label} · Level ${entry.level_achieved}`} />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, sans-serif; background: #F8FAFC; color: #0F172A; }
        `}</style>
      </head>
      <body>
        <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>

            {/* Verified banner */}
            <div style={{ background: '#F0FDF4', border: '0.5px solid #86EFAC', borderRadius: 8, padding: '10px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#16A34A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 13, color: '#166534', fontWeight: 500 }}>Verified by Praxis Ltd · Certificate ID: {params.certificateId}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#4ADE80' }}>praxis-platform.com</span>
            </div>

            {/* Main certificate card */}
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
              {/* Navy header */}
              <div style={{ background: '#1F4E79', padding: '28px 32px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 10, background: '#2E74B5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {careerDisplay?.icon ?? '??'}
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{profile?.full_name ?? 'Graduate'}</div>
                    <div style={{ fontSize: 14, color: '#B5D4F4' }}>{careerDisplay?.label ?? entry.career_path} · Level {entry.level_achieved} — {LEVEL_TITLES[entry.level_achieved as keyof typeof LEVEL_TITLES]}</div>
                    <div style={{ fontSize: 12, color: '#7AAED6', marginTop: 4 }}>
                      {entry.organisation_name ?? 'Nexus Digital'} ·{' '}
                      {entry.start_date ? new Date(entry.start_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : ''}
                      {entry.end_date ? ` — ${new Date(entry.end_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}` : ''}
                    </div>
                  </div>
                  {/* PI badge */}
                  <div style={{ marginLeft: 'auto', textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{pi}</div>
                    <div style={{ fontSize: 10, color: '#B5D4F4', marginTop: 2 }}>Performance Index</div>
                    <div style={{ fontSize: 10, color: '#7AAED6' }}>out of 100</div>
                  </div>
                </div>
              </div>

              {/* Competency tags */}
              {competencyTags.length > 0 && (
                <div style={{ padding: '16px 32px', borderTop: '0.5px solid #2E74B5', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {competencyTags.map((tag: string) => (
                    <span key={tag} style={{ fontSize: 11, padding: '4px 12px', background: 'rgba(255,255,255,0.12)', color: '#B5D4F4', borderRadius: 99, fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
              )}

              {/* KPI grid */}
              <div style={{ padding: '24px 32px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verified KPI Scores</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: 'Reliability', desc: '% tasks completed on time', val: 92, color: '#1D9E75', weight: '25%' },
                    { label: 'Decision quality', desc: 'Under-pressure decision accuracy', val: 88, color: '#2E74B5', weight: '30%' },
                    { label: 'Responsiveness', desc: 'Speed handling urgent items', val: 81, color: '#EF9F27', weight: '20%' },
                    { label: 'Scope control', desc: 'Handling scope creep correctly', val: 94, color: '#7C3AED', weight: '10%' },
                  ].map(k => (
                    <div key={k.label} style={{ border: '0.5px solid #E2E8F0', borderRadius: 10, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{k.label}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{k.desc}</div>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: k.color }}>{k.val}%</div>
                      </div>
                      <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2 }}>
                        <div style={{ height: 4, borderRadius: 2, background: k.color, width: `${k.val}%` }} />
                      </div>
                      <div style={{ fontSize: 10, color: '#CBD5E1', marginTop: 4 }}>Weight: {k.weight} of PI score</div>
                    </div>
                  ))}
                </div>

                {/* Key achievements */}
                {achievements.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verified Achievements</div>
                    {achievements.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#EBF3FB', color: '#1F4E79', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                          {i + 1}
                        </div>
                        <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{a}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ background: '#F8FAFC', borderTop: '0.5px solid #E2E8F0', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Praxis Ltd · Verified workplace simulation · praxis-platform.com</div>
                <div style={{ fontSize: 11, color: '#CBD5E1' }}>Certificate: {params.certificateId}</div>
              </div>
            </div>

            {/* Employer CTA */}
            <div style={{ background: '#EBF3FB', border: '0.5px solid #BFDBFE', borderRadius: 12, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E40AF', marginBottom: 4 }}>Interested in hiring from Praxis?</div>
                <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                  Praxis graduates arrive with verified performance data — not just a degree. Request access to our employer portal to search candidates by KPI score, career path, and level.
                </div>
              </div>
              <a href="mailto:employers@praxis-platform.com?subject=Employer portal access request" style={{ padding: '10px 18px', background: '#1F4E79', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Contact us →
              </a>
            </div>

          </div>
        </div>
      </body>
    </html>
  )
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Praxis Portfolio — ${params.certificateId}`,
    description: 'Verified workplace experience certificate from Praxis',
  }
}
