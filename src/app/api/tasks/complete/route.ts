// Updated task complete route — now calls levelup/check after every completion

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { calcPerformanceIndex, XP } from '@/lib/kpi-engine'
import { generateDecisionFeedback } from '@/lib/ai-coworkers'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { task_id, session_id, user_response, decision_choice, decision_quality, task_type } = await req.json()
  const now = new Date().toISOString()
  const xp_earned = decision_quality
    ? (XP[('decision_' + decision_quality) as keyof typeof XP] ?? 10)
    : XP.task_on_time

  await supabase.from('tasks').update({ completed_at: now, user_response, decision_choice, decision_quality, xp_earned }).eq('id', task_id).eq('user_id', user.id)

  const { data: profile } = await supabase.from('profiles').select('experience_points').eq('id', user.id).single()
  await supabase.from('profiles').update({ experience_points: (profile?.experience_points ?? 0) + xp_earned }).eq('id', user.id)

  const { data: allTasks } = await supabase.from('tasks').select('*').eq('session_id', session_id)
  const kpis = calcPerformanceIndex(allTasks ?? [])

  await supabase.from('kpi_metrics').upsert({
    user_id: user.id, session_id, recorded_at: now,
    reliability_score: kpis.reliability, responsiveness_score: kpis.responsiveness,
    quality_score: kpis.quality, communication_score: kpis.communication,
    scope_control_score: kpis.scope_control, performance_index: kpis.performance_index,
    tasks_total: (allTasks ?? []).length,
    tasks_on_time: (allTasks ?? []).filter(t => t.completed_at && t.due_at && new Date(t.completed_at) <= new Date(t.due_at)).length,
    decisions_made: (allTasks ?? []).filter(t => t.decision_quality).length,
    decisions_good: (allTasks ?? []).filter(t => t.decision_quality === 'good').length,
  }, { onConflict: 'user_id,session_id' })

  let ai_feedback: string | null = null
  if (decision_quality && (task_type === 'decision' || task_type === 'scope_decision')) {
    try {
      ai_feedback = await generateDecisionFeedback({ scenario: user_response ?? '', userChoice: decision_choice ?? '', decisionQuality: decision_quality, careerPath: 'data_engineering', personaReacting: 'boss' })
      await supabase.from('messages').insert({ session_id, user_id: user.id, sender_persona: 'boss', sender_name: 'James Hargreaves', sender_role: 'Your Manager', subject: 'Re: your decision just now', body: ai_feedback, urgency: 'normal', requires_response: false, trigger_type: 'consequence' })
      await supabase.from('tasks').update({ ai_feedback }).eq('id', task_id)
    } catch (_) {}
  }

  let level_up = null
  try {
    const luRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/levelup/check`, { method: 'POST', headers: { Cookie: req.headers.get('cookie') ?? '' } })
    const lu = await luRes.json()
    if (lu.leveled_up) level_up = lu
  } catch (_) {}

  return NextResponse.json({ kpis, xp_earned, ai_feedback, level_up })
}
