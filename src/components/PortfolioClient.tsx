'use client'

import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'
import { LEVEL_TITLES } from '@/lib/kpi-engine'

interface Entry {
  id: string
  career_path: string
  level_achieved: number
  organisation_name: string
  final_pi_score: number
  key_achievements: string[]
  certificate_id: string
  created_at: string
}

interface Props {
  profile: any
  entries: Entry[]
}

export default function PortfolioClient({ profile, entries }: Props) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://your-domain.vercel.app'

  function copyLink(certId: string) {
    navigator.clipboard.writeText(`${appUrl}/portfolio/${certId}`)
    ;(window as any).espToast?.('Portfolio link copied to clipboard', 'success')
  }

  function shareLinkedIn(entry: Entry) {
    const url = encodeURIComponent(`${appUrl}/portfolio/${entry.certificate_id}`)
    const text = encodeURIComponent(`I just completed Level ${entry.level_achieved} (${LEVEL_TITLES[entry.level_achieved]}) in ${CAREER_PATH_DISPLAY[entry.career_path]?.label} on @Praxis_Platform — Performance Index: ${entry.final_pi_score}/100. Verified workplace experience before employment.`)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank')
  }

  const piColor = (pi: number) => pi >= 85 ? '#16A34A' : pi >= 70 ? '#1F4E79' : '#DC2626'

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
          {entries.length} certificate{entries.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* No entries yet */}
      {entries.length === 0 && (
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 8 }}>No certificates yet</div>
          <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 16 }}>
            Complete Level 1 to earn your first verified Experience Certificate. You need {500 - (profile?.experience_points ?? 0)} more XP.
          </div>
          <a href="/dashboard/simulate" style={{ display: 'inline-block', padding: '9px 20px', background: '#1F4E79', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Start simulating →
          </a>
        </div>
      )}

      {/* Certificate cards */}
      {entries.map(entry => {
        const careerDisplay = CAREER_PATH_DISPLAY[entry.career_path]
        const publicUrl = `${appUrl}/portfolio/${entry.certificate_id}`

        return (
          <div key={entry.id} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
            {/* Card header */}
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
              <button
                onClick={() => copyLink(entry.certificate_id)}
                style={{ padding: '6px 12px', background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 7, fontSize: 11, color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Copy link
              </button>
              <button
                onClick={() => shareLinkedIn(entry)}
                style={{ padding: '6px 12px', background: '#0A66C2', border: 'none', borderRadius: 7, fontSize: 11, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Share on LinkedIn
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '6px 12px', background: '#1F4E79', border: 'none', borderRadius: 7, fontSize: 11, color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                View public →
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
