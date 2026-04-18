// src/app/api/ai/score-response/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PERSONAS } from '@/lib/ai-coworkers'
import { findEligibleColleague, pickTemplate } from '@/lib/colleagues'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

async function triggerColleagueMessage(
  adminSupabase: any,
  userId: string,
  sessionId: string,
  careerPath: string,
  completedTaskType: string,
  completedTaskId: string
) {
  // Get colleague IDs that have already sent a message this session
  const { data: sentMessages } = await adminSupabase
    .from('messages')
    .select('sender_persona')
    .eq('session_id', sessionId)
    .eq('trigger_type', 'colleague')

  const alreadyMessagedIds = (sentMessages ?? [])
    .map((m: any) => m.sender_persona)
    .filter((p: string) => p?.startsWith(careerPath.slice(0, 2)))

  const colleague = findEligibleColleague(careerPath, completedTaskType, alreadyMessagedIds)
  if (!colleague) return

  const template = pickTemplate(colleague)

  // Insert colleague message
  const { data: insertedMsg, error: msgErr } = await adminSupabase
    .from('messages')
    .insert({
      session_id: sessionId,
      user_id: userId,
      sender_persona: colleague.id,
      sender_name: colleague.name,
      sender_role: colleague.role,
      subject: template.subject,
      body: template.body,
      urgency: template.urgency,
      requires_response: template.kind === 'action',
      response_deadline_minutes: template.kind === 'action' ? 30 : null,
      trigger_type: 'colleague',
      message_type: template.kind,
      feedback_for_task_id: template.kind === 'feedback' ? completedTaskId : null,
      is_read: false,
    })
    .select('id')
    .single()

  if (msgErr) {
    console.error('Colleague message insert error:', msgErr)
    return
  }

  // If action template, also create the follow-up task linked to this message
  if (template.kind === 'action') {
    const now = new Date()
    const { error: taskErr } = await adminSupabase.from('tasks').insert({
      user_id: userId,
      session_id: sessionId,
      title: template.task.title,
      type: template.task.type,
      description: template.task.description,
      urgency: template.task.urgency,
      xp_earned: template.task.xp,
      status: 'pending',
      assigned_at: now.toISOString(),
      due_at: new Date(now.getTime() + template.task.due_offset_mins * 60000).toISOString(),
      linked_message_id: insertedMsg?.id ?? null,
    })
    if (taskErr) console.error('Colleague follow-up task insert error:', taskErr)
  }

  console.log(`Colleague triggered: ${colleague.name} (${template.kind}) after ${completedTaskType} task`)
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

    // Generate portfolio entry for high-scoring tasks (fire and forget)
    if (parsed.score >= 75) {
      void adminSupabase.from('portfolio_entries').insert({
        user_id: user.id,
        career_path: profile?.career_path ?? career_path ?? 'data_engineering',
        level_achieved: 1,
        organisation_name: 'Nexus Digital',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        final_pi_score: parsed.score,
        key_achievements: [`Scored ${parsed.score}% on: task`],
        certificate_id: null,
        is_public: false,
        entry_type: 'competency_evidence',
        evidence: parsed.manager_comment ?? '',
        score: parsed.score,
      })
    }

    // Get active session
    const { data: activeSession } = await adminSupabase
      .from('simulation_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    // Trigger colleague message based on completed task type
    if (activeSession) {
      const effectiveCareerPath = profile?.career_path ?? career_path ?? 'data_engineering'
      const effectiveTaskType = task_type ?? 'document'
      await triggerColleagueMessage(
        adminSupabase,
        user.id,
        activeSession.id,
        effectiveCareerPath,
        effectiveTaskType,
        task_id
      )
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
