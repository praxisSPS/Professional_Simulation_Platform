// POST — assign 2 additional tasks to the current session when the user runs out
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { getTasks } from '@/lib/curriculum/index'

// Ad-hoc colleague requests used as fallback when no curriculum tasks remain
const ADHOC_TASKS: Record<string, Array<{ colleague: string; title: string; description: string; project_ref: string; xp: number }>> = {
  data_engineering: [
    { colleague: 'Marcus Chen', title: 'Quick sanity check on my dashboard query', description: 'Marcus has been struggling with a slow Redshift query on the sales dashboard. He\'s asked if you can take a look at the execution plan and suggest an optimisation. Should take about 30 minutes.', project_ref: 'analytics-platform', xp: 20 },
    { colleague: 'Sarah Edwards', title: 'Update the pipeline monitoring runbook', description: 'Sarah wants the monitoring runbook updated to include the new alert thresholds agreed last week. The current version is in Confluence and needs two sections rewritten.', project_ref: 'data-quality-beta', xp: 15 },
    { colleague: 'Marcus Chen', title: 'Review draft data schema for new feature', description: 'Marcus is designing the schema for the new user events table and wants a second opinion before it goes to the team review. Can you check normalisation and index strategy?', project_ref: 'analytics-platform', xp: 25 },
  ],
  product_management: [
    { colleague: 'Marcus Chen', title: 'Give feedback on my feature spec draft', description: 'Marcus has written a rough feature spec for the new notifications system and wants your input before it goes to engineering. Focus on the acceptance criteria and edge cases.', project_ref: 'platform-v3', xp: 20 },
    { colleague: 'Priya Shah', title: 'Help me prioritise these three backlog items', description: 'Priya has three backlog items with similar story points but different stakeholder urgency. She wants a framework-based recommendation on what goes in the next sprint.', project_ref: 'enterprise-tier', xp: 20 },
    { colleague: 'Sarah Edwards', title: 'Review user research summary before it goes to the board', description: 'Sarah has synthesised last month\'s user interviews into a two-pager. She needs another PM to review for clarity and missing insights before the board sees it.', project_ref: 'churn-fix', xp: 25 },
  ],
  project_management: [
    { colleague: 'Marcus Chen', title: 'Help me document the integration dependency', description: 'Marcus has identified a new dependency with the third-party integration team that needs documenting in the RAID log and communicating to the steering group. He needs help framing it.', project_ref: 'crm-impl', xp: 20 },
    { colleague: 'Sarah Edwards', title: 'Review my draft stakeholder update', description: 'Sarah has written a stakeholder update for the EU office rollout and wants a second opinion on tone and completeness before it goes out.', project_ref: 'eu-office', xp: 15 },
    { colleague: 'James Hargreaves', title: 'Prepare notes for tomorrow\'s steering group', description: 'James needs a one-page summary of open actions from the last three steering group meetings for the agenda review tomorrow morning.', project_ref: 'process-improvement', xp: 25 },
  ],
  digital_marketing: [
    { colleague: 'Marcus Chen', title: 'Review ad copy for the retargeting campaign', description: 'Marcus has drafted three ad copy variants for the retargeting push. He wants your view on which performs best before it goes into the testing queue.', project_ref: 'demand-gen', xp: 20 },
    { colleague: 'Sarah Edwards', title: 'Check UTM parameter structure for new landing pages', description: 'Sarah is setting up tracking for four new landing pages and wants to make sure the UTM structure is consistent with the existing naming convention before launch.', project_ref: 'brand-refresh', xp: 15 },
    { colleague: 'Marcus Chen', title: 'Help me interpret this attribution report', description: 'Marcus pulled a multi-touch attribution report and isn\'t sure how to read the data-driven vs last-click comparison. He needs a quick interpretation and recommendation.', project_ref: 'demand-gen', xp: 25 },
  ],
  reliability_engineering: [
    { colleague: 'Marcus Chen', title: 'Help me complete the FMEA for Pump 4', description: 'Marcus is working on the FMEA for the new centrifugal pump installation. He\'s stuck on the detection ratings for three failure modes and needs your experience to sense-check them.', project_ref: 'maintenance-optimisation', xp: 20 },
    { colleague: 'Sarah Edwards', title: 'Write up the near-miss incident from this morning', description: 'Sarah witnessed a near-miss on Line 3 involving a forklift and a pedestrian walkway. As the shift engineer you need to write the incident report before end of shift.', project_ref: 'safety-compliance', xp: 25 },
    { colleague: 'Mike Kowalski', title: 'Update the spare parts list for Q2 stock review', description: 'Mike needs the critical spares register updated with the new OEM part numbers received this week before the Q2 stock review with procurement.', project_ref: 'maintenance-optimisation', xp: 15 },
  ],
  financial_analysis: [
    { colleague: 'Marcus Chen', title: 'Sanity check my DCF assumptions', description: 'Marcus has built a DCF model for the new market entry proposal but is uncertain about the terminal growth rate and WACC assumptions. Can you review and comment?', project_ref: 'strategic-planning', xp: 25 },
    { colleague: 'Sarah Edwards', title: 'Help me reconcile the cost centre variances', description: 'Sarah is preparing the management accounts and has three cost centres with unexplained variances totalling £47k. She needs help tracing them back to source transactions.', project_ref: 'monthly-close', xp: 20 },
    { colleague: 'Amara Osei', title: 'Prepare the bridge analysis for the ops review', description: 'Amara needs a clean EBITDA bridge from last month\'s ops review updated with this month\'s actuals before the 4pm call with the CEO.', project_ref: 'board-reporting', xp: 30 },
  ],
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Get profile and active session in parallel
  const [{ data: profile }, { data: session }] = await Promise.all([
    adminSupabase
      .from('profiles')
      .select('career_path, current_level, sim_day')
      .eq('id', user.id)
      .single(),
    adminSupabase
      .from('simulation_sessions')
      .select('id, sim_day')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single(),
  ])

  if (!session) return NextResponse.json({ error: 'No active session' }, { status: 404 })
  if (!profile?.career_path) return NextResponse.json({ error: 'Profile incomplete' }, { status: 400 })

  const { career_path, current_level, sim_day } = profile

  // Get titles of tasks already assigned to this user (to avoid duplicates)
  const { data: existingTasks } = await adminSupabase
    .from('tasks')
    .select('title')
    .eq('user_id', user.id)

  const assignedTitles = new Set((existingTasks ?? []).map((t: any) => t.title.toLowerCase().trim()))

  const now = new Date()
  const newTaskInserts: any[] = []

  // ── Try curriculum tasks for current sim_day first, then next day ──
  const daysToTry = [sim_day, sim_day + 1]
  for (const day of daysToTry) {
    if (newTaskInserts.length >= 2) break
    try {
      const candidates = await getTasks(career_path, day, current_level ?? 1)
      for (const t of candidates) {
        if (newTaskInserts.length >= 2) break
        if (assignedTitles.has(t.title.toLowerCase().trim())) continue
        newTaskInserts.push({
          user_id: user.id,
          session_id: session.id,
          title: t.title,
          type: t.type,
          description: t.description,
          urgency: 'normal',
          xp_earned: t.xp,
          status: 'pending',
          project_ref: t.project_ref ?? null,
          kpi_tag: t.kpi_tag ?? null,
          assigned_at: new Date(now.getTime() + newTaskInserts.length * 60000).toISOString(),
          due_at: new Date(now.getTime() + (t.due_offset_mins + newTaskInserts.length * 10) * 60000).toISOString(),
        })
        assignedTitles.add(t.title.toLowerCase().trim())
      }
    } catch { /* continue to next day */ }
  }

  // ── Fallback: ad-hoc colleague tasks ──────────────────────────
  if (newTaskInserts.length < 2) {
    const pool = (ADHOC_TASKS[career_path] ?? ADHOC_TASKS.data_engineering)
      .filter(t => !assignedTitles.has(t.title.toLowerCase().trim()))

    // Shuffle for variety
    const shuffled = pool.sort(() => Math.random() - 0.5)

    for (const t of shuffled) {
      if (newTaskInserts.length >= 2) break
      newTaskInserts.push({
        user_id: user.id,
        session_id: session.id,
        title: t.title,
        type: 'document',
        description: t.description,
        urgency: 'normal',
        xp_earned: t.xp,
        status: 'pending',
        project_ref: t.project_ref,
        kpi_tag: 'communication',
        assigned_at: new Date(now.getTime() + newTaskInserts.length * 60000).toISOString(),
        due_at: new Date(now.getTime() + (120 + newTaskInserts.length * 30) * 60000).toISOString(),
      })

      // Insert a colleague message alongside the task
      try {
        await adminSupabase.from('messages').insert({
          session_id: session.id,
          user_id: user.id,
          sender_persona: 'colleague',
          sender_name: t.colleague,
          sender_role: 'Colleague',
          subject: `Since you've got some bandwidth — ${t.title}`,
          body: `Hey,\n\nSince things have quieted down a bit on your end, I was hoping you could help me out.\n\n${t.description}\n\nNo rush if you're busy, but it would really help if you could get to it today.\n\nThanks,\n${t.colleague.split(' ')[0]}`,
          urgency: 'normal',
          requires_response: false,
          trigger_type: 'ad_hoc',
          is_read: false,
        })
      } catch { /* non-blocking */ }
    }
  }

  if (newTaskInserts.length === 0) {
    return NextResponse.json(
      { error: 'No additional tasks available for today. Try again tomorrow.' },
      { status: 404 }
    )
  }

  const { data: inserted, error } = await adminSupabase
    .from('tasks')
    .insert(newTaskInserts)
    .select('id, title, urgency, xp_earned')

  if (error) {
    console.error('[request-tasks] insert error:', error)
    return NextResponse.json({ error: 'Failed to assign tasks' }, { status: 500 })
  }

  return NextResponse.json({ tasks: inserted, count: inserted?.length ?? 0 })
}
