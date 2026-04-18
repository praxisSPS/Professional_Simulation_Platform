// src/app/api/ai/score-response/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PERSONAS } from '@/lib/ai-coworkers'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// ── Follow-up tasks per career path ──────────────────────────
const FOLLOWUP_TASKS: Record<string, any[]> = {
  data_engineering: [
    { title: 'Marcus needs help: dashboard data not refreshing', type: 'email_reply', urgency: 'urgent', description: 'Marcus has pinged you directly. The client dashboard stopped refreshing 20 minutes ago. He thinks it\'s a pipeline issue but isn\'t sure. Investigate and reply to Marcus with your initial findings and next steps.', xp: 35, due_offset_mins: 30 },
    { title: 'Write SQL query to find top 10 customers by revenue', type: 'document', urgency: 'normal', description: 'Sarah wants a quick analysis for the board pack. Write a SQL query that returns the top 10 customers by total revenue for Q4, including customer name, total spend, and number of orders. Add a brief comment explaining your approach.', xp: 25, due_offset_mins: 120 },
  ],
  product_management: [
    { title: 'Priya escalating — feature still not live', type: 'email_reply', urgency: 'urgent', description: 'Priya Shah has emailed again. The feature promised 2 weeks ago still isn\'t live. She\'s threatening to escalate to the board. Draft a response that manages expectations, explains the delay honestly, and proposes a concrete next step.', xp: 40, due_offset_mins: 20 },
    { title: 'Write release notes for v2.4 deployment', type: 'document', urgency: 'normal', description: 'The v2.4 release goes out tonight. Write release notes for the three features shipped: (1) export to CSV, (2) dark mode toggle, (3) improved search. Keep it clear and user-facing — not technical.', xp: 20, due_offset_mins: 90 },
  ],
  project_management: [
    { title: 'Client wants an emergency call — how do you respond?', type: 'email_reply', urgency: 'urgent', description: 'The client\'s project sponsor has emailed requesting an emergency call today. They\'ve heard the project is behind. Draft a response that acknowledges their concern, proposes a call time, and briefly sets the agenda. Do not be defensive.', xp: 35, due_offset_mins: 25 },
    { title: 'Update project timeline in writing', type: 'document', urgency: 'normal', description: 'Following the scope change request, update the project timeline summary. Show the original end date, the new end date, and the reason for the change. Keep it to one page — this goes to the board.', xp: 30, due_offset_mins: 120 },
  ],
  digital_marketing: [
    { title: 'Competitor launched a campaign — how do you respond?', type: 'decision', urgency: 'urgent', description: 'A competitor has just launched a large paid social campaign targeting your key audience. Your budget is already cut by 40%. What is your recommended response? Consider creative, channel, and timing options.', xp: 40, due_offset_mins: 30 },
    { title: 'Write copy for the new landing page hero section', type: 'document', urgency: 'normal', description: 'The design team needs hero copy for the new product landing page. Write a headline (max 8 words), subheadline (max 20 words), and CTA button text (max 4 words). Audience: mid-market B2B buyers.', xp: 25, due_offset_mins: 90 },
  ],
  reliability_engineering: [
    { title: 'Compressor 2 oil leak has worsened — decision needed', type: 'decision', urgency: 'urgent', description: 'The Compressor 2 oil leak you logged this morning has worsened. Output pressure is dropping. Production wants to keep running. You have two options: (A) stop and investigate now, or (B) monitor and plan a controlled shutdown for tonight\'s break. What do you recommend and why?', xp: 45, due_offset_mins: 20 },
    { title: 'Update the maintenance log for today\'s events', type: 'document', urgency: 'normal', description: 'End of shift maintenance log update required. Record: (1) Line 2 bearing replacement — cause, action taken, outcome. (2) Compressor 2 oil leak — current status and monitoring plan. (3) Pasteuriser 1 PM backlog — current plan. Keep entries factual and timestamped.', xp: 20, due_offset_mins: 60 },
  ],
  financial_analysis: [
    { title: 'CFO needs a one-page exec summary by 4pm', type: 'document', urgency: 'urgent', description: 'Amara needs a one-page executive summary of your variance analysis for the board pack. It must include: (1) headline finding, (2) top 3 drivers of the profit decline, (3) one recommendation. Write it now — board pack locks at 4pm.', xp: 45, due_offset_mins: 25 },
    { title: 'Sense-check a colleague\'s assumption in the model', type: 'decision', urgency: 'normal', description: 'A colleague has assumed 8% revenue growth in the base case scenario. Your data suggests 5-6% is more realistic given Q4 trends. Do you challenge this assumption? If so, how? Write your response — you will need to send this to the colleague and copy Amara.', xp: 30, due_offset_mins: 90 },
  ],
}

const COLLEAGUE_MESSAGES: Record<string, { persona: string; subject: string; body: string }> = {
  data_engineering: {
    persona: 'marcus',
    subject: 'Quick one — dashboard has stopped refreshing',
    body: `Hey,

Sorry to drop this on you but the client dashboard stopped refreshing about 20 minutes ago. Priya's team noticed it first and pinged me.

I think it might be the pipeline but I'm not sure where to start. Can you take a look and let me know what you find? Client's expecting a status update by 2pm.

Cheers
Marcus`,
  },
  product_management: {
    persona: 'marcus',
    subject: 'Priya is escalating — need your help',
    body: `Hi,

Just a heads up — Priya has emailed me again about the feature. She's not happy and mentioned going to the board.

I know this isn't ideal timing but can you draft a response to her? I'll review before it goes. We need to get ahead of this.

Marcus`,
  },
  project_management: {
    persona: 'marcus',
    subject: 'Client sponsor wants a call today',
    body: `Hi,

Just had a message from the client's project sponsor. She's heard the project is behind and wants an emergency call today.

I said you'd be in touch to arrange it. Can you respond to her and copy me in? Keep it calm — she's reasonable but she's nervous.

Marcus`,
  },
  digital_marketing: {
    persona: 'marcus',
    subject: 'Competitor campaign just launched — thoughts?',
    body: `Hey,

Have you seen this? A competitor just dropped a big paid social push targeting exactly our audience. Timing is terrible given the budget cut.

What's your take? Should we respond or hold our position? James will ask me about it in the 3pm catch-up.

Marcus`,
  },
  reliability_engineering: {
    persona: 'marcus',
    subject: 'Compressor 2 — situation has changed',
    body: `Hi,

Just walked past Compressor 2. The oil leak looks worse than this morning. Output pressure gauge is reading lower than normal.

Production supervisor knows and is asking whether we stop or monitor. I said I'd check with you first.

What's your call?

Marcus`,
  },
  financial_analysis: {
    persona: 'marcus',
    subject: 'Board pack exec summary — Amara needs it by 4',
    body: `Hi,

Amara just messaged me — she needs a one-page exec summary of your variance analysis for the board pack. Pack locks at 4pm today.

She wants: headline finding, top 3 drivers, one recommendation. I can help format it if you draft the content.

Marcus`,
  },
}

async function seedFollowupTasks(adminSupabase: any, userId: string, sessionId: string, careerPath: string) {
  const followupTasks = FOLLOWUP_TASKS[careerPath] ?? FOLLOWUP_TASKS.data_engineering
  const colleagueMsg = COLLEAGUE_MESSAGES[careerPath] ?? COLLEAGUE_MESSAGES.data_engineering
  const now = new Date()

  const taskInserts = followupTasks.map((t: any, i: number) => ({
    user_id: userId,
    session_id: sessionId,
    title: t.title,
    type: t.type,
    description: t.description,
    urgency: t.urgency,
    xp_earned: t.xp,
    status: 'pending',
    assigned_at: new Date(now.getTime() + i * 60000).toISOString(),
    due_at: new Date(now.getTime() + t.due_offset_mins * 60000).toISOString(),
  }))

  const { error: taskErr } = await adminSupabase.from('tasks').insert(taskInserts)
  if (taskErr) console.error('Followup task insert error:', taskErr)

  const p = PERSONAS[colleagueMsg.persona as keyof typeof PERSONAS]
  const { error: msgErr } = await adminSupabase.from('messages').insert({
    session_id: sessionId,
    user_id: userId,
    sender_persona: colleagueMsg.persona,
    sender_name: p?.name ?? 'Marcus Adeyemi',
    sender_role: p?.role ?? 'Senior Colleague',
    subject: colleagueMsg.subject,
    body: colleagueMsg.body,
    urgency: 'urgent',
    requires_response: true,
    response_deadline_minutes: 20,
    trigger_type: 'followup',
    is_read: false,
  })
  if (msgErr) console.error('Followup message insert error:', msgErr)

  console.log('Follow-up seeded:', taskInserts.length, 'tasks + 1 message')
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { task_id, rubric, response, career_path, task_type } = await req.json()

  if (!response?.trim()) {
    return NextResponse.json({
      score: 0, grade: 'F',
      feedback: ['No response provided.'],
      strengths: [],
      improvements: ['You must submit a response to receive a score.'],
      summary: 'No response submitted.',
      manager_comment: 'Nothing was submitted for this task.',
    })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
You are an expert assessor for a professional workplace simulation platform.
A junior ${career_path?.replace(/_/g, ' ') ?? 'professional'} has submitted a response to this task type: ${task_type ?? 'workplace task'}.

Scoring rubric (what a good response must include):
${(rubric ?? ['Clear and professional communication', 'Appropriate workplace tone', 'Addresses the task directly']).map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

The user's response:
"${response}"

Score this response strictly and professionally. Be honest — if it's weak, say so clearly.

Respond ONLY with valid JSON in this exact format (no markdown, no preamble):
{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<one sentence overall assessment>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>"],
  "manager_comment": "<what a real manager would say in a 1:1 about this response — direct, professional, 1-2 sentences>"
}

Scoring guide:
90-100 (A): Exceeds expectations
75-89  (B): Meets expectations with minor gaps
60-74  (C): Partially meets expectations
40-59  (D): Below expectations
0-39   (F): Does not meet expectations
`

  let parsed: any = null

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim().replace(/```json\n?|\n?```/g, '')
    parsed = JSON.parse(text)
    parsed.score = Math.max(0, Math.min(100, parseInt(parsed.score) || 0))
  } catch {
    const wordCount = response.trim().split(/\s+/).length
    const fallbackScore = Math.min(70, Math.max(30, wordCount * 3))
    parsed = {
      score: fallbackScore,
      grade: fallbackScore >= 75 ? 'B' : fallbackScore >= 60 ? 'C' : 'D',
      summary: 'Response received and scored.',
      strengths: ['Response submitted on time'],
      improvements: ['Ensure your response addresses all rubric points'],
      manager_comment: 'I have reviewed your response. Let\'s discuss it in our next 1:1.',
    }
  }

  const quality = parsed.score >= 75 ? 'good' : parsed.score >= 55 ? 'medium' : 'bad'
  const xpEarned = task_id ? Math.round(40 * (parsed.score / 100)) : 0

  if (task_id) {
    // Update task
    await adminSupabase
      .from('tasks')
      .update({
        completed_at: new Date().toISOString(),
        status: 'completed',
        score: parsed.score,
        ai_feedback: parsed.manager_comment,
        decision_quality: quality,
        xp_earned: xpEarned,
      })
      .eq('id', task_id)
      .eq('user_id', user.id)

    // Update profile XP
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('experience_points, career_path')
      .eq('id', user.id)
      .single()

    if (profile) {
      await adminSupabase
        .from('profiles')
        .update({ experience_points: (profile.experience_points ?? 0) + xpEarned })
        .eq('id', user.id)
    }

    // Get active session
    const { data: activeSession } = await adminSupabase
      .from('simulation_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    // Check remaining pending tasks (excluding current one)
    const { data: remainingTasks } = await adminSupabase
      .from('tasks')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .neq('id', task_id)

    const remaining = (remainingTasks ?? []).length
    console.log('Remaining pending tasks after this submission:', remaining)

    // If no more pending tasks — seed follow-ups inline
    if (remaining === 0 && activeSession) {
      const careerPathToUse = profile?.career_path ?? career_path ?? 'data_engineering'
      await seedFollowupTasks(adminSupabase, user.id, activeSession.id, careerPathToUse)
    }

    // Write KPI snapshot
    const { data: allTasks } = await adminSupabase
      .from('tasks')
      .select('score, decision_quality, completed_at, due_at, type')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)

    if (allTasks && allTasks.length > 0) {
      const scores = allTasks.filter((t: any) => t.score != null).map((t: any) => t.score as number)
      const avgScore = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0
      const goodDecisions = allTasks.filter((t: any) => t.decision_quality === 'good').length
      const onTime = allTasks.filter((t: any) => t.completed_at && t.due_at && new Date(t.completed_at) <= new Date(t.due_at)).length
      const emailTasks = allTasks.filter((t: any) => t.type === 'email_reply')
      const emailScores = emailTasks.filter((t: any) => t.score != null).map((t: any) => t.score as number)
      const avgEmailScore = emailScores.length ? Math.round(emailScores.reduce((a: number, b: number) => a + b, 0) / emailScores.length) : avgScore

      await adminSupabase.from('kpi_metrics').insert({
        user_id: user.id,
        session_id: activeSession?.id ?? null,
        recorded_at: new Date().toISOString(),
        reliability_score: Math.min(100, Math.round((onTime / allTasks.length) * 100)),
        responsiveness_score: avgEmailScore,
        quality_score: avgScore,
        communication_score: avgEmailScore,
        scope_control_score: Math.min(100, Math.round((goodDecisions / Math.max(allTasks.length, 1)) * 100) + 50),
        performance_index: Math.round((avgScore + Math.min(100, (onTime / allTasks.length) * 100)) / 2),
        tasks_total: allTasks.length,
        tasks_on_time: onTime,
        decisions_made: allTasks.filter((t: any) => ['decision', 'scope_decision'].includes(t.type ?? '')).length,
        decisions_good: goodDecisions,
      })
    }
  }

  return NextResponse.json({ ...parsed, xp_earned: xpEarned })
}
