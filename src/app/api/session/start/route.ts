// POST - clock in, create session, seed Day 1 tasks and morning briefing
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateCoworkerMessage, PERSONAS } from '@/lib/ai-coworkers'

// ── Boss persona per career path ──────────────────────────────
const BOSS_PERSONA: Record<string, { name: string; role: string; sign: string }> = {
  data_engineering:        { name: 'James Hargreaves', role: 'Head of Data & Analytics',       sign: 'JH' },
  product_management:      { name: 'James Hargreaves', role: 'VP Product',                      sign: 'JH' },
  project_management:      { name: 'James Hargreaves', role: 'Programme Director',              sign: 'JH' },
  digital_marketing:       { name: 'James Hargreaves', role: 'Head of Growth & Marketing',      sign: 'JH' },
  financial_analysis:      { name: 'James Hargreaves', role: 'CFO',                             sign: 'JH' },
  reliability_engineering: { name: 'Mike Kowalski',    role: 'Maintenance Manager',             sign: 'MK' },
}

// ── Day 1 tasks per career path ───────────────────────────────
const DAY1_TASKS: Record<string, any[]> = {
  data_engineering: [
    { title: 'Review yesterday\'s pipeline failure report', type: 'document', urgency: 'high', description: 'Sarah flagged that the nightly ETL job failed twice last week. Review the error logs and write a short summary of root cause and proposed fix.', xp: 25, due_offset_mins: 60 },
    { title: 'Scope creep decision - client wants new dashboard features', type: 'scope_decision', urgency: 'urgent', description: 'Marcus has promised Priya Shah two new dashboard features by Friday. Current sprint ends Thursday. You need to respond to Marcus professionally.', xp: 40, due_offset_mins: 30 },
    { title: 'Daily standup notes', type: 'standup', urgency: 'normal', description: 'Write your standup update: what you did yesterday, what you are doing today, any blockers.', xp: 15, due_offset_mins: 90 },
    { title: 'Data quality audit - Q4 sales table', type: 'report', urgency: 'normal', description: 'James has asked for a data quality report on the Q4 sales table before it goes to the board. Check for nulls, duplicates, and anomalies.', xp: 35, due_offset_mins: 240 },
  ],
  product_management: [
    { title: 'Prioritise sprint backlog - 3 urgent items, 1 slot', type: 'decision', urgency: 'urgent', description: 'Three stakeholders have each marked their feature as the top priority for this sprint. You have capacity for one. Decide which to build and communicate the decision.', xp: 40, due_offset_mins: 45 },
    { title: 'Write user story for the new reporting feature', type: 'document', urgency: 'normal', description: 'The reporting feature has been approved. Write a complete user story with acceptance criteria before the dev team\'s planning session at 2pm.', xp: 30, due_offset_mins: 120 },
    { title: 'Daily standup', type: 'standup', urgency: 'normal', description: 'Write your standup update covering yesterday, today, and blockers.', xp: 15, due_offset_mins: 90 },
    { title: 'Respond to client escalation', type: 'email_reply', urgency: 'urgent', description: 'Priya Shah has emailed asking why the feature promised last week is not live. Your manager James is copied in. Respond professionally.', xp: 35, due_offset_mins: 30 },
  ],
  project_management: [
    { title: 'Project status report - RAG update', type: 'report', urgency: 'high', description: 'Your weekly RAG status report is due to the board by 10am. The project is currently Amber. Update the report with this week\'s progress and risks.', xp: 35, due_offset_mins: 60 },
    { title: 'Scope change request - client wants to add features', type: 'scope_decision', urgency: 'urgent', description: 'The client has submitted a change request adding 3 new features to a project that is 75% complete. Assess the impact and respond.', xp: 40, due_offset_mins: 30 },
    { title: 'Daily standup', type: 'standup', urgency: 'normal', description: 'Write your standup: yesterday, today, blockers.', xp: 15, due_offset_mins: 90 },
    { title: 'Risk register update', type: 'document', urgency: 'normal', description: 'Review the RAID log and update the risk register with two new risks identified in this week\'s team meeting.', xp: 25, due_offset_mins: 180 },
  ],
  digital_marketing: [
    { title: 'Campaign performance review - email vs paid social', type: 'report', urgency: 'high', description: 'Last week\'s email campaign had a 35% open rate but 1.2% CTR. Paid social ROAS dropped 22%. Write a performance summary and recommendations.', xp: 35, due_offset_mins: 90 },
    { title: 'Budget cut response - 40% reduction mid-campaign', type: 'decision', urgency: 'urgent', description: 'Finance has cut the paid social budget by 40% effective immediately. You have 3 active ad sets running. Decide how to redistribute.', xp: 40, due_offset_mins: 30 },
    { title: 'Daily standup', type: 'standup', urgency: 'normal', description: 'Write your standup: yesterday, today, blockers.', xp: 15, due_offset_mins: 90 },
    { title: 'A/B test plan - landing page headline', type: 'document', urgency: 'normal', description: 'Set up an A/B test plan for the new landing page headline. Define the hypothesis, sample size, duration, and success metric.', xp: 30, due_offset_mins: 180 },
  ],
  reliability_engineering: [
    { title: 'URGENT: Bearing failure - Conveyor 3, Line 2', type: 'decision', urgency: 'urgent', description: 'You arrive on shift at 06:00. Outgoing technician reports unusual noise on Conveyor 3 since 04:30. Production is running. You identify a failing main drive bearing. No spare on site. Line produces 800 units/hour. Downtime costs GBP4,200/hour. What do you do?', xp: 40, due_offset_mins: 30 },
    { title: 'Write your shift handover notes', type: 'document', urgency: 'normal', description: 'End of shift at 14:00. During your shift: Line 2 was stopped 2.5 hours for bearing replacement (now resolved). 3 of 5 PM tasks completed. 2 overdue PM tasks remain on Pasteuriser 1. Minor oil leak spotted on Compressor 2 - not critical, needs monitoring. Write your handover notes.', xp: 25, due_offset_mins: 90 },
    { title: 'Production manager asking why Line 2 stopped', type: 'email_reply', urgency: 'urgent', description: 'David Okafor (Production Manager) has emailed asking for an explanation of the Line 2 stoppage for his 15:00 ops meeting. He needs to know what happened, why, and what was done about it. Reply professionally - David is production, not maintenance.', xp: 30, due_offset_mins: 45 },
    { title: 'Overdue PM decision - Pasteuriser 1', type: 'decision', urgency: 'normal', description: 'Two PM tasks on Pasteuriser 1 are 1 week overdue. Each takes 45 minutes. Production can only offer a 30-minute CIP break tomorrow morning. Your maintenance lead wants them done. What do you recommend?', xp: 35, due_offset_mins: 180 },
  ],
  financial_analysis: [
    { title: 'Variance analysis - Q4 actuals vs budget', type: 'report', urgency: 'high', description: 'Q4 actuals are in. Revenue is up 15% YoY but net profit has fallen. Write a variance analysis identifying the key drivers.', xp: 40, due_offset_mins: 90 },
    { title: 'Three-scenario model for board presentation', type: 'document', urgency: 'urgent', description: 'The CFO needs three financial scenarios (base, upside, downside) for a new product launch. Board meeting is tomorrow 9am. You have 4 hours.', xp: 45, due_offset_mins: 240 },
    { title: 'Daily standup', type: 'standup', urgency: 'normal', description: 'Write your standup: yesterday, today, blockers.', xp: 15, due_offset_mins: 90 },
    { title: 'EBITDA bridge - explain the gap', type: 'report', urgency: 'normal', description: 'The business unit leader wants to understand why EBITDA is GBP2.3M below plan. Build a waterfall bridge analysis.', xp: 35, due_offset_mins: 180 },
  ],
}

// ── Morning briefings per career path ────────────────────────
const MORNING_BRIEFINGS: Record<string, { subject: string; body: string }> = {
  data_engineering: {
    subject: 'Good morning - here are your priorities for today',
    body: `Morning,

Quick rundown for today:

1. I need the pipeline failure summary on my desk by 10am - Sarah flagged it twice last week and I want to understand the root cause before it happens again.

2. Marcus has apparently promised Priya two new dashboard features by Friday. I only just found out. Speak to him this morning and manage expectations - we cannot keep committing the team without checking capacity.

3. Standup is at 9:30. Be ready with your update.

4. If you get time this afternoon, the Q4 sales table audit is overdue. Board needs it clean before month end.

Let's make it a productive one.

JH`,
  },
  product_management: {
    subject: 'Today\'s priorities - action needed on sprint backlog',
    body: `Morning,

Three things need your attention today:

1. Sprint planning clash - Priya, Marcus, and Finance all want their feature first. We only have one slot. I need you to make the call by 10am and communicate it clearly to all three. Use data to back the decision.

2. Dev team needs the reporting feature user story before their 2pm session. Don't let them sit idle.

3. Priya has escalated about the feature from last week. I'm copied in - handle this professionally and loop me in on your response before you send.

JH`,
  },
  project_management: {
    subject: 'Morning - status report and change request to deal with',
    body: `Morning,

Two things need dealing with before lunch:

1. RAG report is due to the board by 10. We are Amber. Be honest about where we are - boards respect honesty, not spin.

2. Change request came in overnight from the client. Three new features at 75% completion. You know what that means for the timeline. Assess and respond - do not just say yes.

Standup at 9:30. RAID log needs updating this afternoon.

JH`,
  },
  digital_marketing: {
    subject: 'This week\'s priorities - budget cut and campaign review needed',
    body: `Morning,

Heads up on two things:

1. Finance cut the paid social budget by 40% this morning - effective immediately. I know it's bad timing. You need to decide how to redistribute across the three active ad sets. Come to me with a recommendation, not a complaint.

2. Last week's campaign numbers need reviewing. 35% open rate is strong but 1.2% CTR tells me the email content isn't landing. Write it up with your recommendations before end of day.

JH`,
  },
  reliability_engineering: {
    subject: 'Morning brief - bearing failure on Line 2, PM backlog to clear',
    body: `Morning,

Heads up on what needs your attention today:

1. Line 2 - Conveyor 3 has a bearing issue flagged from nights. Inspect it first thing. If it's as bad as the handover suggests, you know what to do. Safety first, then get me a picture on downtime and recovery timeline.

2. The PM backlog on Pasteuriser 1 is now 1 week overdue. I need a plan to clear it this week. Talk to production today - not tomorrow.

3. David in production will want answers on any downtime. Keep your communication clear and factual. He's not technical but he's reasonable.

4. Compressor 2 oil leak - keep an eye on it. Log it properly so we have a record if it develops.

Good shift.

MK`,
  },
  financial_analysis: {
    subject: 'Q4 actuals are in - urgent analysis needed',
    body: `Morning,

Q4 actuals landed overnight. Revenue is up 15% but net profit is down. The CFO is going to want answers before the board call.

Two things from me:

1. Variance analysis - I need the key drivers identified by mid-morning. Don't just report the numbers, explain them.

2. The CFO also needs three scenarios modelled for the new product launch. Board meeting is tomorrow 9am. I know that's tight. Prioritise the most sensitive assumptions and get me something solid.

JH`,
  },
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { career_path, sim_day = 1 } = await req.json()

  // End any active sessions
  await supabase
    .from('simulation_sessions')
    .update({ status: 'abandoned', clock_out_time: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('status', 'active')

  // Create new session
  const { data: session, error } = await supabase
    .from('simulation_sessions')
    .insert({
      user_id: user.id,
      career_path,
      sim_day,
      clock_in_time: new Date().toISOString(),
      status: 'active',
    })
    .select()
    .single()

  if (error || !session) return NextResponse.json({ error: error?.message }, { status: 500 })

  // Guard: check if messages already seeded today for this sim_day
  // Uses calendar day so clock out + clock in on same day doesn't re-seed
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { count: msgCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('sender_persona', 'boss')
    .gte('created_at', todayStart.toISOString())

  if ((msgCount ?? 0) > 0) {
    // Already seeded today — re-attach existing pending tasks to new session
    await supabase
      .from('tasks')
      .update({ session_id: session.id })
      .eq('user_id', user.id)
      .is('completed_at', null)

    return NextResponse.json({ session, tasks_seeded: 0, resumed: true })
  }

  // ── Fresh session — seed tasks and messages ──────────────────
  const now = new Date()
  const boss = BOSS_PERSONA[career_path] ?? BOSS_PERSONA.data_engineering

  let taskSource = DAY1_TASKS[career_path] ?? DAY1_TASKS.data_engineering
  let briefingSource = MORNING_BRIEFINGS[career_path] ?? MORNING_BRIEFINGS.data_engineering

  if (sim_day >= 2) {
    const dayData = await getDayTasksAndBriefing(career_path, sim_day)
    if (dayData?.tasks?.length) {
      taskSource = dayData.tasks.map((t: any) => ({
        title: t.title, type: t.type, urgency: t.urgency,
        description: t.description, xp: t.xp_reward, due_offset_mins: t.due_offset_mins,
      }))
    }
    if (dayData?.briefing) briefingSource = dayData.briefing
  }

  // Insert tasks
  const taskInserts = taskSource.map((t: any, i: number) => ({
    user_id: user.id,
    session_id: session.id,
    title: t.title,
    type: t.type,
    description: t.description,
    urgency: t.urgency,
    xp_reward: t.xp,
    status: 'pending',
    assigned_at: new Date(now.getTime() + i * 2 * 60000).toISOString(),
    due_at: new Date(now.getTime() + t.due_offset_mins * 60000).toISOString(),
  }))

  const { error: taskError } = await supabase.from('tasks').insert(taskInserts)
  if (taskError) console.error('Task insert error:', taskError)

  // Insert morning briefing from correct boss persona
  await supabase.from('messages').insert({
    session_id: session.id,
    user_id: user.id,
    sender_persona: 'boss',
    sender_name: boss.name,
    sender_role: boss.role,
    subject: briefingSource.subject,
    body: briefingSource.body,
    urgency: 'normal',
    requires_response: false,
    trigger_type: 'scheduled',
    is_read: false,
  })

  // Dynamic Marcus message (non-blocking)
  try {
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    const generated = await generateCoworkerMessage({
      persona: 'marcus',
      scenario: 'morning_briefing',
      context: {
        userName: profile?.full_name ?? 'there',
        careerPath: career_path,
        organisationName: 'Nexus Digital',
        currentLevel: 1,
        dayNumber: sim_day,
      },
    })
    const p = PERSONAS.marcus
    await supabase.from('messages').insert({
      session_id: session.id,
      user_id: user.id,
      sender_persona: 'marcus',
      sender_name: p.name,
      sender_role: p.role,
      subject: generated.subject,
      body: generated.body,
      urgency: 'urgent',
      requires_response: true,
      response_deadline_minutes: 20,
      trigger_type: 'scheduled',
      is_read: false,
    })
  } catch {
    // Gemini unavailable - briefing + tasks already seeded, simulation still works
  }

  return NextResponse.json({ session, tasks_seeded: taskInserts.length })
}

async function getDayTasksAndBriefing(careerPath: string, simDay: number) {
  if (simDay <= 1) return null
  try {
    const { getDayTasks, DAILY_BRIEFINGS } = await import('@/lib/simulation-scripts-days2to5')
    const day = Math.min(simDay, 5) as 2|3|4|5
    const tasks = getDayTasks(careerPath, day)
    const briefing = DAILY_BRIEFINGS[careerPath]?.[day]
    return { tasks, briefing }
  } catch {
    return null
  }
}
