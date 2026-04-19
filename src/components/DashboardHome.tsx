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

interface DaySummary {
  sim_day_completed: number
  next_sim_day: number
  tasks_completed: number
  avg_score: number
  xp_earned: number
  good_decisions: number
  task_breakdown: { title: string; score: number; xp: number; quality: string }[]
}

export default function DashboardHome({ profile, kpi, messages, activeSession, recentTasks }: Props) {
  const [clockedIn, setClockedIn] = useState(!!activeSession)
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(activeSession?.id ?? null)
  const [clockInTime, setClockInTime] = useState<string | null>(activeSession?.clock_in_time ?? null)
  const [daySummary, setDaySummary] = useState<DaySummary | null>(null)
  const [showEndDayConfirm, setShowEndDayConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const urgent = messages.filter((m: any) => m.urgency === 'urgent' && !m.is_read)
  const unread = messages.filter((m: any) => !m.is_read)

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

  async function endDay() {
    setLoading(true)
    try {
      const res = await fetch('/api/session/end-day', { method: 'POST' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        ;(window as any).espToast?.(err.error ?? 'Failed to end day. Try again.', 'error')
        setLoading(false)
        return
      }
      const summary: DaySummary = await res.json()
      setDaySummary(summary)
      setClockedIn(false)
      setSessionId(null)
    } catch {
      ;(window as any).espToast?.('Failed to end day. Try again.', 'error')
    }
    setLoading(false)
  }

  async function requestMoreTasks() {
    setLoading(true)
    try {
      const res = await fetch('/api/session/request-tasks', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        ;(window as any).espToast?.(data.error ?? 'No tasks available right now.', 'error')
      } else {
        const count = data.count ?? data.tasks?.length ?? 0
        ;(window as any).espToast?.(`${count} new task${count !== 1 ? 's' : ''} assigned — check your task list`, 'success')
        router.refresh()
      }
    } catch {
      ;(window as any).espToast?.('Failed to request tasks. Try again.', 'error')
    }
    setLoading(false)
  }

  const pendingTasks = recentTasks.filter((t: any) => !t.completed_at)
  const completedToday = recentTasks.filter((t: any) => {
    if (!t.completed_at) return false
    return new Date(t.completed_at).toDateString() === new Date().toDateString()
  })
  const showEndDayButton = clockedIn && pendingTasks.length === 0 && completedToday.length > 0
  const showRequestMore = clockedIn && pendingTasks.length === 0 && completedToday.length > 0

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* End day confirmation modal */}
      {showEndDayConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', maxWidth: 400, width: '100%' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>End your simulation day?</div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 24, lineHeight: 1.6 }}>
              You have completed {completedToday.length} task{completedToday.length !== 1 ? 's' : ''} today. Once you end the day, you cannot add more completions to today's record.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowEndDayConfirm(false)}
                style={{ flex: 1, padding: '10px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowEndDayConfirm(false); endDay() }}
                style={{ flex: 1, padding: '10px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              >
                End day →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day summary modal */}
      {daySummary && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', maxWidth: 480, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ fontSize: 11, color: '#1F4E79', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Day {daySummary.sim_day_completed} complete</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Good work today</div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
              {daySummary.tasks_completed} tasks · {daySummary.xp_earned} XP · avg score {daySummary.avg_score}%
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Tasks done', val: daySummary.tasks_completed, color: '#1F4E79' },
                { label: 'XP earned', val: `+${daySummary.xp_earned}`, color: '#16A34A' },
                { label: 'Good decisions', val: daySummary.good_decisions, color: '#7C3AED' },
              ].map(s => (
                <div key={s.label} style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              {daySummary.task_breakdown.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #F1F5F9', fontSize: 12 }}>
                  <span style={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{t.title}</span>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <span style={{ color: t.quality === 'good' ? '#16A34A' : t.quality === 'bad' ? '#DC2626' : '#D97706', fontWeight: 500 }}>{t.score}%</span>
                    <span style={{ color: '#94A3B8' }}>+{t.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16, padding: '10px 14px', background: '#EBF3FB', borderRadius: 8 }}>
              Day {daySummary.next_sim_day} unlocked — clock in tomorrow to continue your simulation.
            </div>
            <button
              onClick={() => { setDaySummary(null); router.refresh() }}
              style={{ width: '100%', padding: '12px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Clock-in bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: clockedIn ? '#16A34A' : '#94A3B8', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: clockedIn ? '#0F172A' : '#64748B', fontWeight: clockedIn ? 500 : 400 }}>
          {clockedIn ? 'You are clocked in' : 'You are not clocked in'}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {showRequestMore && (
            <button
              onClick={requestMoreTasks}
              disabled={loading}
              style={{
                padding: '7px 18px', border: '1px solid #E2E8F0', borderRadius: 8,
                fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                background: '#fff', color: '#1F4E79', opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '...' : 'Request more tasks'}
            </button>
          )}
          {showEndDayButton && (
            <button
              onClick={() => setShowEndDayConfirm(true)}
              disabled={loading}
              style={{
                padding: '7px 18px', border: 'none', borderRadius: 8,
                fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                background: '#00C2A8', color: '#0A0A0F', opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '...' : 'End day →'}
            </button>
          )}
          <button
            onClick={clockedIn ? clockOut : clockIn}
            disabled={loading}
            style={{
              padding: '7px 18px', border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
              background: clockedIn ? '#FEE2E2' : '#1F4E79',
              color: clockedIn ? '#991B1B' : '#fff',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '...' : clockedIn ? 'Clock out' : 'Clock in'}
          </button>
        </div>
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
      {/* Pending tasks preview */}
      {clockedIn && pendingTasks.length > 0 && (
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>Your tasks</span>
            <button onClick={() => router.push('/dashboard/tasks')} style={{ background: 'none', border: 'none', fontSize: 12, color: '#1F4E79', cursor: 'pointer' }}>View all →</button>
          </div>
          {pendingTasks.slice(0, 4).map((t: any) => (
            <div key={t.id} onClick={() => router.push('/dashboard/tasks')}
              style={{ padding: '10px 16px', borderBottom: '0.5px solid #F1F5F9', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center',
                borderLeft: t.urgency === 'urgent' ? '3px solid #DC2626' : t.urgency === 'high' ? '3px solid #D97706' : '3px solid transparent' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#0F172A' }}>{t.title}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{t.xp_reward} XP · Due {fmtTime(t.due_at)}</div>
              </div>
              <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99,
                background: t.urgency === 'urgent' ? '#FEE2E2' : t.urgency === 'high' ? '#FEF3C7' : '#F1F5F9',
                color: t.urgency === 'urgent' ? '#991B1B' : t.urgency === 'high' ? '#92400E' : '#64748B' }}>
                {t.urgency}
              </div>
            </div>
          ))}
        </div>
      )}
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
