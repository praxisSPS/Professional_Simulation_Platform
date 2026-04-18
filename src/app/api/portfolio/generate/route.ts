// POST — generates a portfolio entry when a task scores >= 75 or on end-of-day
// Also handles level-up certificate generation when level_achieved is passed

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { calcPerformanceIndex } from '@/lib/kpi-engine'
import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'

function generateCertId(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `PRX-${year}-${rand}`
}

const KPI_TAG_TO_COMPETENCY: Record<string, string[]> = {
  quality:        ['Analytical Thinking', 'Decision Making', 'Problem Solving'],
  communication:  ['Written Communication', 'Stakeholder Management', 'Professional Presence'],
  reliability:    ['Task Management', 'Attention to Detail', 'Dependability'],
  scope_control:  ['Negotiation', 'Boundary Setting', 'Scope Management'],
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { task_id, level_achieved } = body

  // Get profile
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: org } = await adminSupabase
    .from('organisations')
    .select('name')
    .eq('id', profile.organisation_id)
    .single()

  const orgName = org?.name ?? 'Nexus Digital'

  // ── Mode 1: Single task portfolio entry (triggered when score >= 75) ──
  if (task_id && !level_achieved) {
    const { data: task } = await adminSupabase
      .from('tasks')
      .select('*')
      .eq('id', task_id)
      .eq('user_id', user.id)
      .single()

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    const kpiTag = task.kpi_tag ?? 'quality'
    const competencyTags = KPI_TAG_TO_COMPETENCY[kpiTag] ?? ['Professional Skills']

    const { data: entry, error } = await adminSupabase
      .from('portfolio_entries')
      .insert({
        user_id: user.id,
        career_path: profile.career_path,
        level_achieved: profile.current_level,
        organisation_name: orgName,
        start_date: task.assigned_at ?? new Date().toISOString(),
        end_date: task.completed_at ?? new Date().toISOString(),
        final_pi_score: task.score ?? 0,
        key_achievements: [`Scored ${task.score}% on: ${task.title}`],
        certificate_id: null,
        is_public: false,
        entry_type: 'competency_evidence',
        evidence: task.ai_feedback ?? '',
        competency_tags: competencyTags,
        score: task.score ?? 0,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ entry })
  }

  // ── Mode 2: Level-up certificate ──
  const { data: tasks } = await adminSupabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)

  const kpis = calcPerformanceIndex(tasks ?? [])
  const achievements: string[] = []

  if (kpis.reliability >= 90) achievements.push(`Achieved ${kpis.reliability}% task reliability`)
  if (kpis.scope_control >= 80) achievements.push(`Handled ${kpis.scope_control}% of scope-creep scenarios professionally`)
  if (kpis.performance_index >= 85) achievements.push(`Performance Index of ${kpis.performance_index}/100 — exceeds Level ${level_achieved} benchmark`)

  const goodDecisions = (tasks ?? []).filter(t => t.decision_quality === 'good').length
  if (goodDecisions > 0) achievements.push(`Made ${goodDecisions} professionally-rated decisions under workplace pressure`)

  const { count: sessionsCount } = await adminSupabase
    .from('simulation_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')

  if (sessionsCount && sessionsCount > 0) achievements.push(`Completed ${sessionsCount} full simulation sessions`)

  // Derive competency tags from all kpi_tags across tasks
  const allKpiTags = [...new Set((tasks ?? []).map((t: any) => t.kpi_tag).filter(Boolean))]
  const allCompetencies = allKpiTags.flatMap((tag: string) => KPI_TAG_TO_COMPETENCY[tag] ?? [])
  const uniqueCompetencies = [...new Set(allCompetencies)]

  const certId = generateCertId()

  const { data: entry, error } = await adminSupabase
    .from('portfolio_entries')
    .insert({
      user_id: user.id,
      career_path: profile.career_path,
      level_achieved: level_achieved ?? profile.current_level,
      organisation_name: orgName,
      start_date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
      end_date: new Date().toISOString(),
      final_pi_score: kpis.performance_index,
      key_achievements: achievements,
      certificate_id: certId,
      is_public: true,
      entry_type: 'level_certificate',
      evidence: null,
      competency_tags: uniqueCompetencies.slice(0, 6),
      score: kpis.performance_index,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${certId}`

  return NextResponse.json({
    certificate_id: certId,
    portfolio_url: portfolioUrl,
    kpis,
    achievements,
    entry,
  })
}
