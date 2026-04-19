'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'
import { LEVEL_TITLES } from '@/lib/kpi-engine'

interface Profile {
  id: string
  full_name: string
  career_path: string
  current_level: number
  experience_points: number
  subscription_tier: string
}

interface KPI {
  reliability_score: number
  responsiveness_score: number
  quality_score: number
  performance_index: number
}

interface Props {
  profile: Profile
  kpi: KPI | null
  unreadCount: number
  children: React.ReactNode
}

// XP needed per level
const LEVEL_XP: Record<number, number> = { 1: 500, 2: 1500, 3: 3500, 4: 7000, 5: 9999 }

const NAV = [
  { href: '/dashboard',           label: 'Dashboard',  icon: 'grid' },
  { href: '/dashboard/inbox',     label: 'Inbox',      icon: 'mail',      badge: true },
  { href: '/dashboard/tasks',     label: 'Tasks',      icon: 'check' },
  { href: '/dashboard/projects',  label: 'Projects',   icon: 'layers' },
  { href: '/dashboard/simulate',  label: 'Simulate',   icon: 'play' },
  { href: '/dashboard/kpis',      label: 'My KPIs',    icon: 'bar' },
  { href: '/dashboard/portfolio', label: 'Portfolio',  icon: 'star' },
  { href: '/dashboard/jobs',      label: 'Job board',  icon: 'briefcase' },
]

// Simple SVG icons
function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const s = size
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 4l10 9 10-9" fill="none"/></>,
    check: <><path d="M9 11l3 3 7-7" fill="none" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="3" width="18" height="18" rx="3" fill="none"/></>,
    play: <polygon points="5,3 19,12 5,21"/>,
    bar: <><rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/></>,
    star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" fill="none"/></>,
    layers: <><polygon points="12,2 2,7 12,12 22,7" fill="none"/><polyline points="2,17 12,22 22,17" fill="none"/><polyline points="2,12 12,17 22,12" fill="none"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="none"/><polyline points="16,17 21,12 16,7" fill="none"/><line x1="21" y1="12" x2="9" y2="12" fill="none"/></>,
  }
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths[name]}
    </svg>
  )
}

export default function DashboardShell({ profile, kpi, unreadCount, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [toasts, setToasts] = useState<{ id: string; message: string; type: string }[]>([])
  const [simTime, setSimTime] = useState<Date | null>(null)

  // Expose a global toast function for child components
  useEffect(() => {
    (window as any).espToast = (message: string, type = 'info') => {
      const id = Math.random().toString(36).slice(2)
      setToasts(t => [...t, { id, message, type }])
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const levelTitle = LEVEL_TITLES[profile.current_level] ?? 'Intern'
  const careerLabel = CAREER_PATH_DISPLAY[profile.career_path]?.label ?? profile.career_path
  const careerIcon = CAREER_PATH_DISPLAY[profile.career_path]?.icon ?? '??'
  const xpMax = LEVEL_XP[profile.current_level] ?? 500
  const xpPct = Math.min(100, Math.round((profile.experience_points / xpMax) * 100))
  const initials = (profile.full_name ?? 'User').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>

      {/* ── Topbar ── */}
      <header className="esp-topbar">
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '0.02em' }}>PRAXIS</span>
        <span style={{ color: '#B5D4F4', fontSize: 12 }}>Nexus Digital</span>

        {/* Live KPI pills */}
        {kpi && (
          <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
            <KPIPill label={`Reliability ${kpi.reliability_score}%`} color="#5DCAA5" />
            <KPIPill label={`Quality ${kpi.quality_score}%`} color="#85B7EB" />
            <KPIPill label={`PI ${kpi.performance_index}`} color="#EF9F27" />
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* User avatar */}
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2E74B5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
            {initials}
          </div>
          <button onClick={signOut} style={{ background: 'transparent', border: 'none', color: '#7AAED6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <Icon name="logout" size={13} />
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Sidebar ── */}
        <nav className="esp-sidebar" style={{ width: 192, background: '#F8FAFC', borderRight: '0.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ flex: 1, paddingTop: 8, paddingBottom: 8 }}>
            {NAV.map(item => {
              const isActive = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} className={`esp-nav-item${isActive ? ' active' : ''}`}>
                  <Icon name={item.icon} size={14} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && unreadCount > 0 && (
                    <span style={{ background: '#DC2626', color: '#fff', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 99 }}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Career / level footer */}
          <div style={{ padding: '12px 14px', borderTop: '0.5px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: '#EBF3FB', color: '#1F4E79', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                {careerIcon}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#0F172A', lineHeight: 1.2 }}>{careerLabel}</div>
                <div style={{ fontSize: 10, color: '#64748B' }}>Level {profile.current_level} · {levelTitle}</div>
              </div>
            </div>
            {/* XP bar */}
            <div className="esp-bar-track">
              <div className="esp-bar-fill" style={{ width: `${xpPct}%`, background: '#1F4E79' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94A3B8', marginTop: 3 }}>
              <span>{profile.experience_points} XP</span>
              <span>{xpMax} XP</span>
            </div>
          </div>
        </nav>

        {/* ── Main content ── */}
        <main style={{ flex: 1, overflow: 'auto', background: '#F8FAFC' }}>
          {children}
        </main>
      </div>

      {/* ── Toast container ── */}
      <div className="esp-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`esp-toast esp-toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}

function KPIPill({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 99, padding: '3px 10px' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: '#fff', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
}
