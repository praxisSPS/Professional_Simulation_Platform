'use client'

import { useState } from 'react'
import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'
import { LEVEL_TITLES } from '@/lib/kpi-engine'

interface Entry {
  id: string
  career_path: string
  level_achieved: number
  organisation_name: string
  final_pi_score: number
  key_achievements: string[]
  certificate_id: string | null
  created_at: string
  entry_type: string | null
  evidence: string | null
  competency_tags: string[] | null
  score: number | null
}

interface Props {
  profile: any
  entries: Entry[]
}

export default function PortfolioClient({ profile, entries }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://praxis.vercel.app'

  function copyLink(certId: string) {
    navigator.clipboard.writeText(`${appUrl}/portfolio/${certId}`)
    ;(window as any).espToast?.('Portfolio link copied to clipboard', 'success')
  }

  function shareLinkedIn(entry: Entry) {
    const url = encodeURIComponent(`${appUrl}/portfolio/${entry.certificate_id}`)
    const text = encodeURIComponent(`I just completed Level ${entry.level_achieved} (${LEVEL_TITLES[entry.level_achieved]}) in ${CAREER_PATH_DISPLAY[entry.career_path]?.label} on @Praxis_Platform — Performance Index: ${entry.final_pi_score}/100.`)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank')
  }

  const certificates = entries.filter(e => e.entry_type === 'level_certificate' || e.certificate_id)
  const evidenceEntries = entries.filter(e => e.entry_type === 'competency_evidence' && !e.certificate_id)

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EBF3FB', color: '#1F4E79', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
          {(profile?.full_name ?? 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{profile?.full_name ?? 'Your Portfolio'}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>
            Level {profile?.current_level} · {LEVEL_TITLES[profile?.current_level]} · {CAREER_PATH_DISPLAY[profile?.career_path]?.label}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#94A3B8' }}>
          {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} · {evidenceEntries.length} evidence entries
        </div>
      </div>

      {/* No entries yet */}
      {entries.length === 0 && (
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 8 }}>No portfolio entries yet</div>
          <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 16 }}>
            Complete tasks scoring 75%+ to build competency evidence. Reach Level 2 to earn your first verified certificate.
          </div>
          <a href="/dashboard/simulate" style={{ display: 'inline-block', padding: '9px 20px', background: '#1F4E79', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Start simulating →
          </a>
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verified Certificates</div>
          {certificates.map(entry => {
            const careerDisplay = CAREER_PATH_DISPLAY[entry.career_path]
            const publicUrl = `${appUrl}/portfolio/${entry.certificate_id}`
            return (
              <div key={entry.id} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: '#1F4E79', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#2E74B5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {careerDisplay?.icon ?? '??'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{careerDisplay?.label} · Level {entry.level_achieved}</div>
                    <div style={{ fontSize: 11, color: '#B5D4F4' }}>{LEVEL_TITLES[entry.level_achieved]} · {entry.organisation_name} · {new Date(entry.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{entry.final_pi_score}</div>
                    <div style={{ fontSize: 10, color: '#B5D4F4' }}>PI Score</div>
                  </div>
                </div>

                {/* Competency tags */}
                {entry.competency_tags && entry.competency_tags.length > 0 && (
                  <div style={{ padding: '12px 20px', borderBottom: '0.5px solid #F1F5F9', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {entry.competency_tags.map((tag: string) => (
                      <span key={tag} style={{ fontSize: 11, padding: '3px 10px', background: '#EBF3FB', color: '#1F4E79', borderRadius: 99, fontWeight: 500 }}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Achievements */}
                {entry.key_achievements?.length > 0 && (
                  <div style={{ padding: '14px 20px', borderBottom: '0.5px solid #F1F5F9' }}>
                    {entry.key_achievements.slice(0, 3).map((a: string, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start', fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
                        <span style={{ color: '#1F4E79', flexShrink: 0 }}>✓</span>
                        {a}
                      </div>
                    ))}
                  </div>
                )}

                {/* Certificate ID + share */}
                <div style={{ padding: '12px 20px', display: 'flex', gap: 8, alignItems: 'center', background: '#F8FAFC' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>Certificate ID</div>
                    <div style={{ fontSize: 11, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.certificate_id}</div>
                  </div>
                  <button onClick={() => copyLink(entry.certificate_id!)} style={{ padding: '6px 12px', background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 7, fontSize: 11, color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Copy link
                  </button>
                  <button onClick={() => shareLinkedIn(entry)} style={{ padding: '6px 12px', background: '#0A66C2', border: 'none', borderRadius: 7, fontSize: 11, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Share on LinkedIn
                  </button>
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', background: '#1F4E79', border: 'none', borderRadius: 7, fontSize: 11, color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    View public →
                  </a>
                </div>
              </div>
            )
          })}
        </>
      )}

      {/* Competency evidence timeline */}
      {evidenceEntries.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Competency Evidence</div>
          {evidenceEntries.map(entry => {
            const isOpen = expanded === entry.id
            const score = entry.score ?? entry.final_pi_score ?? 0
            const scoreColor = score >= 85 ? '#16A34A' : score >= 70 ? '#1F4E79' : '#D97706'
            return (
              <div key={entry.id} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
                <div
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                  style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: scoreColor, flexShrink: 0 }}>
                    {score}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.key_achievements?.[0] ?? 'Competency evidence'}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      {new Date(entry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {entry.competency_tags && entry.competency_tags.length > 0 && ` · ${entry.competency_tags[0]}`}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</div>
                </div>
                {isOpen && (
                  <div style={{ padding: '12px 16px', borderTop: '0.5px solid #F1F5F9', background: '#F8FAFC' }}>
                    {entry.evidence && (
                      <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 10 }}>
                        <span style={{ fontWeight: 500, color: '#64748B' }}>Manager feedback: </span>
                        {entry.evidence}
                      </div>
                    )}
                    {entry.competency_tags && entry.competency_tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {entry.competency_tags.map((tag: string) => (
                          <span key={tag} style={{ fontSize: 11, padding: '3px 10px', background: '#EBF3FB', color: '#1F4E79', borderRadius: 99 }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
