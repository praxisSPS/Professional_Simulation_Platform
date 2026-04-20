// POST — end current simulation day, generate summary, increment sim_day
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Get active session
  const { data: session } = await adminSupabase
    .from('simulation_sessions')
    .select('id, sim_day, career_path, clock_in_time')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!session) return NextResponse.json({ error: 'No active session' }, { status: 404 })

  // Count tasks assigned and completed TODAY across ALL sessions
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)
  const todayStartISO = todayStart.toISOString()

  const [{ count: assignedTodayCount }, { data: completedTasks }, { data: redoTasks }] = await Promise.all([
    adminSupabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('assigned_at', todayStartISO),
    adminSupabase
      .from('tasks')
      .select('id, title, type, score, xp_earned, decision_quality, completed_at, kpi_tag')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('completed_at', todayStartISO),
    adminSupabase
      .from('tasks')
      .select('id, title')
      .eq('user_id', user.id)
      .eq('is_redo', true)
      .eq('status', 'pending'),
  ])

  const tasks = completedTasks ?? []
  const assignedToday = assignedTodayCount ?? 0
  const threshold = assignedToday > 0 ? Math.ceil(assignedToday * 0.4) : 0

  if (tasks.length < threshold) {
    const pct = Math.round((tasks.length / assignedToday) * 100)
    return NextResponse.json(
      { error: `Complete at least 40% of today's tasks before ending the day. You've completed ${tasks.length} of ${assignedToday} (${pct}%).` },
      { status: 400 }
    )
  }

  // Block end-day if any redo tasks are still incomplete
  if (redoTasks && redoTasks.length > 0) {
    const redoTitles = redoTasks.map((t: any) => t.title.replace(/^REDO: /, '')).join(', ')
    return NextResponse.json(
      { error: `You must complete your redo task${redoTasks.length !== 1 ? 's' : ''} before ending the day: ${redoTitles}` },
      { status: 400 }
    )
  }

  // Mark pending tasks as carry_forward before closing the session
  await adminSupabase
    .from('tasks')
    .update({ carry_forward: true })
    .eq('session_id', session.id)
    .eq('user_id', user.id)
    .is('completed_at', null)

  const xpEarned = tasks.reduce((sum, t) => sum + (t.xp_earned ?? 0), 0)
  const avgScore = tasks.length
    ? Math.round(tasks.reduce((sum, t) => sum + (t.score ?? 0), 0) / tasks.length)
    : 0
  const goodDecisions = tasks.filter(t => t.decision_quality === 'good').length

  // Get current profile
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('sim_day, experience_points, current_level, career_path, full_name, organisation_id')
    .eq('id', user.id)
    .single()

  const currentSimDay = profile?.sim_day ?? session.sim_day ?? 1
  const nextSimDay = currentSimDay + 1

  // Mark session as day_complete and clock out
  await adminSupabase
    .from('simulation_sessions')
    .update({
      status: 'completed',
      clock_out_time: new Date().toISOString(),
    })
    .eq('id', session.id)

  // Increment sim_day on profile
  await adminSupabase
    .from('profiles')
    .update({ sim_day: nextSimDay })
    .eq('id', user.id)

  // Get organisation name for portfolio entry
  const { data: org } = await adminSupabase
    .from('organisations')
    .select('name')
    .eq('id', profile?.organisation_id)
    .single()

  // Create portfolio entry for this day
  const kpiTags = [...new Set(tasks.map(t => t.kpi_tag).filter(Boolean))]
  const competencyTags = kpiTags.length > 0 ? kpiTags : ['communication', 'decision_making']

  try {
    await adminSupabase.from('portfolio_entries').insert({
      user_id: user.id,
      career_path: profile?.career_path ?? session.career_path,
      level_achieved: profile?.current_level ?? 1,
      organisation_name: org?.name ?? 'Nexus Digital',
      start_date: session.clock_in_time ?? new Date().toISOString(),
      end_date: new Date().toISOString(),
      final_pi_score: avgScore,
      key_achievements: [
        `Completed ${tasks.length} task${tasks.length !== 1 ? 's' : ''} on Day ${currentSimDay}`,
        `Earned ${xpEarned} XP`,
        ...(goodDecisions > 0 ? [`Made ${goodDecisions} strong decision${goodDecisions !== 1 ? 's' : ''}`] : []),
      ],
      certificate_id: null,
      is_public: false,
    })
  } catch { /* portfolio entry is non-blocking */ }

  const summary = {
    sim_day_completed: currentSimDay,
    next_sim_day: nextSimDay,
    tasks_completed: tasks.length,
    avg_score: avgScore,
    xp_earned: xpEarned,
    good_decisions: goodDecisions,
    task_breakdown: tasks.map(t => ({
      title: t.title,
      score: t.score ?? 0,
      xp: t.xp_earned ?? 0,
      quality: t.decision_quality ?? 'medium',
    })),
  }

  return NextResponse.json(summary)
}
