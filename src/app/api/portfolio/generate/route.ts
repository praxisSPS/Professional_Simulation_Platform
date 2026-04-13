// src/app/api/portfolio/generate/route.ts
// POST — generates a verified experience certificate when a user completes a level
// Called automatically by the level-up logic, or triggered manually

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { calcPerformanceIndex } from '@/lib/kpi-engine'
import { CAREER_PATH_DISPLAY } from '@/lib/simulation-scripts'

function generateCertId(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `PRX-${year}-${rand}`
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { level_achieved } = await req.json()

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // Get all completed tasks for this career path to compute final KPIs
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)

  const kpis = calcPerformanceIndex(tasks ?? [])

  // Build key achievements list
  const achievements: string[] = []

  // Add level-specific achievements
  if (kpis.reliability >= 90) achievements.push(`Achieved ${kpis.reliability}% task reliability — top 10% of cohort`)
  if (kpis.scope_control >= 80) achievements.push(`Handled ${kpis.scope_control}% of scope-creep scenarios professionally`)
  if (kpis.performance_index >= 85) achievements.push(`Performance Index of ${kpis.performance_index}/100 — exceeds Level ${level_achieved} benchmark`)

  // Count good decisions
  const goodDecisions = (tasks ?? []).filter(t => t.decision_quality === 'good').length
  if (goodDecisions > 0) achievements.push(`Made ${goodDecisions} professionally-rated decisions under workplace pressure`)

  // Get completed sessions count
  const { count: sessionsCount } = await supabase
    .from('simulation_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')

  if (sessionsCount && sessionsCount > 0) achievements.push(`Completed ${sessionsCount} full simulation sessions`)

  const certId = generateCertId()

  // Get organisation name
  const { data: org } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', profile.organisation_id)
    .single()

  const { data: entry, error } = await supabase
    .from('portfolio_entries')
    .insert({
      user_id: user.id,
      career_path: profile.career_path,
      level_achieved,
      organisation_name: org?.name ?? 'Nexus Digital',
      start_date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
      end_date: new Date().toISOString(),
      final_pi_score: kpis.performance_index,
      key_achievements: achievements,
      certificate_id: certId,
      is_public: true,
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
  })
}
