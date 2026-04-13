'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'
import { LEVEL_TITLES, LEVEL_THRESHOLDS } from '@/lib/kpi-engine'
import SimClock from '@/components/SimClock'

interface Props {
  profile: any
  kpi: any
  messages: any[]
  activeSession: any
  recentTasks: any[]
}

export default function DashboardHome({ profile, kpi, messages, activeSession, recentTasks }: Props) {
  const [clockedIn, setClockedIn] = useState(!!activeSession)
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(activeSession?.id ?? null)
  const [clockInTime, setClockInTime] = useState<string | null>(activeSession?.clock_in_time ?? null)
  const router = useRouter()
  const supabase = createClient()

  const urgent = messages.filter((m: any) => m.urgency === 'urgent' && !m.is_read)
  const unread = messages.filter((m: any) => !m.is_read)
  const pendingTasks = recentTasks.filter((t: any) => !t.completed_at)
  const completedToday = recentTasks.filter((t: any) => {
    if (!t.completed_at) return false
    return new Date(t.completed_at).toDateString() === new Date().toDateString()
  })

  const nextLevelXP = LEVEL_THRESHOLDS[(profile.current_level + 1) as keyof typeof LEVEL_THRESHOLDS] ?? 9999
  const xpPct = Math.min(100, Math.round((profile.experience_points / nextLevelXP) * 100))
  const xpToGo = Math.max(0, nextLevelXP - profile.experience_points)

  async function clockIn() {
    setLoading(true)
    try {
      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career_path: profile.career_path }),
      })
      const { session } = await res.json()
      setSessionId(session.id)
      setClockInTime(new Date().toISOString())
      setClockedIn(true)
      // Trigger Day 1 morning briefing
      await fetch('/api/ai/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          persona: 'boss',
          scenario: 'morning_briefing',
          context: {
            userName: profile.full_name,
            careerPath: profile.career_path,
            currentLevel: profile.current_level,
            dayNumber: 1,
            organisationName: 'Nexus Digital',
          },
        }),
      })
      ;(window as any).espToast?.('Clocked in — your AI coworkers have been notified.', 'success')
      router.refresh()
    } catch {
      ;(window as any).espToast?.('Failed to clock in. Try again.', 'error')
    }
    setLoading(false)
  }

  async function clockOut() {
    if (!sessionId) return
    setLoading(true)
    await supabase
      .from('simulation_sessions')
      .update({ status: 'completed', clock_out_time: new Date().toISOString() })
      .eq('id', sessionId)
    setClockedIn(false)
    setSessionId(null)
    ;(window as any).espToast?.('Clocked out. Your KPIs have been saved.', 'info')
    router.refresh()
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Clock-in bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: clockedIn ? '#16A34A' : '#94A3B8', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: clockedIn ? '#0F172A' : '#64748B', fontWeight: clockedIn ? 500 : 400 }}>
          {clockedIn ? 'You are clocked in' : 'You are not clocked in'}
        </span>
        <button
          onClick={clockedIn ? clockOut : clockIn}
          disabled={loading}
          style={{
            marginLeft: 'auto', padding: '7px 18px', border: 'none', borderRadius: 8,
            fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
            background: clockedIn ? '#FEE2E2' : '#1F4E79',
            color: clockedIn ? '#991B1B' : '#fff',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? '...' : clockedIn ? 'Clock out' : 'Clock in'}
        </button>
      </div>

      {/* Live sim clock — shows when clocked in */}
      {clockedIn && clockInTime && (
        <SimClock clockInTime={clockInTime} simSpeedMultiplier={4} />
      )}
      
      {/* Urgent alert */}
      {urgent.length > 0 && (
        <div
          onClick={() => router.push('/dashboard/inbox')}
          className="esp-urgent esp-fadein"
          style={{ padding: '12px 16px', background: '#FEF2F2', border: '0.5px solid #FCA5A5', borderRadius: 10, cursor: 'pointer' }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: '#991B1B' }}>
            {urgent.length} urgent message{urgent.length > 1 ? 's' : ''} — response timer running
          </div>
          <div style={{ fontSize: 12, color: '#DC2626', marginTop: 2 }}>{urgent[0]?.subject}</div>
        </div>
      )}

      {/* Level progress */}
      <div style={{ padding: '14px 16px', background: '#EBF3FB', border: '0.5px solid #BFDBFE', borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#1F4E79' }}>
            Level {profile.current_level} — {LEVEL_TITLES[profile.current_level]}
          </span>
          <span style={{ fontSize: 11, color: '#3B82F6' }}>{xpToGo} XP to Level {profile.current_level + 1}</span>
        </div>
        <div className="esp-bar-track">
          <div className="esp-bar-fill" style={{ width: `${xpPct}%`, background: '#1F4E79' }} />
        </div>
        <div style={{ fontSize: 11, color: '#3B82F6', marginTop: 4 }}>{profile.experience_points} / {nextLevelXP} XP</div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Unread messages', val: unread.length, color: '#1F4E79', link: '/dashboard/inbox' },
          { label: 'Pending tasks', val: pendingTasks.length, color: '#D97706', link: '/dashboard/tasks' },
          { label: 'Completed today', val: completedToday.length, color: '#16A34A', link: '/dashboard/tasks' },
          { label: 'Performance index', val: kpi?.performance_index ?? '—', color: '#7C3AED', link: '/dashboard/kpis' },
        ].map(s => (
          <div
            key={s.label}
            onClick={() => router.push(s.link)}
            style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'border-color 0.1s' }}
          >
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* KPI grid */}
      {kpi && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { label: 'Reliability', val: kpi.reliability_score, color: '#1D9E75' },
            { label: 'Responsiveness', val: kpi.responsiveness_score, color: '#EF9F27' },
            { label: 'Decision quality', val: kpi.quality_score, color: '#378ADD' },
            { label: 'Scope control', val: kpi.scope_control_score ?? 75, color: '#7C3AED' },
          ].map(k => (
            <div key={k.label} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>{k.label}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: k.color }}>{k.val}%</span>
              </div>
              <div className="esp-bar-track">
                <div className="esp-bar-fill" style={{ width: `${k.val}%`, background: k.color }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent messages */}
      {messages.length > 0 && (
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>Recent messages</span>
            <button onClick={() => router.push('/dashboard/inbox')} style={{ background: 'none', border: 'none', fontSize: 12, color: '#1F4E79', cursor: 'pointer' }}>View all →</button>
          </div>
          {messages.slice(0, 4).map((m: any) => (
            <div
              key={m.id}
              onClick={() => router.push('/dashboard/inbox')}
              style={{
                padding: '10px 16px', borderBottom: '0.5px solid #F1F5F9',
                cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start',
                borderLeft: m.urgency === 'urgent' ? '3px solid #DC2626' : m.is_read ? 'none' : '3px solid #1F4E79',
              }}
            >
              <Avatar name={m.sender_name} persona={m.sender_persona} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: m.is_read ? 400 : 600, color: '#0F172A' }}>{m.sender_name}</span>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{fmtTime(m.created_at)}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulate CTA if not clocked in */}
      {!clockedIn && (
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 6 }}>Ready to start your simulation day?</div>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 14 }}>Clock in to receive tasks from your AI coworkers and start building your performance portfolio.</div>
          <button
            onClick={clockIn}
            disabled={loading}
            style={{ padding: '10px 28px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            {loading ? 'Starting...' : 'Clock in and start →'}
          </button>
        </div>
      )}
    </div>
  )
}

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  boss:   { bg: '#EBF3FB', text: '#1F4E79' },
  marcus: { bg: '#EAF3DE', text: '#166534' },
  sarah:  { bg: '#FFF3CD', text: '#854D0E' },
  client: { bg: '#EEEDFE', text: '#3C3489' },
  hr:     { bg: '#F0FDFA', text: '#065F46' },
}

function Avatar({ name, persona }: { name: string; persona: string }) {
  const colors = AVATAR_COLORS[persona] ?? { bg: '#F1F5F9', text: '#64748B' }
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
  return (
    <div style={{ width: 30, height: 30, borderRadius: '50%', background: colors.bg, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
