// src/app/api/levelup/check/route.ts
// POST — checks if the user has met level-up conditions after a task completion.
// Called automatically by the task complete flow.
// If conditions met: upgrades level in DB, generates certificate, returns celebration data.

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { shouldLevelUp, LEVEL_TITLES, LEVEL_THRESHOLDS } from '@/lib/kpi-engine'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ leveled_up: false })

  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_level, experience_points')
    .eq('id', user.id)
    .single()

  if (!profile || profile.current_level >= 5) {
    return NextResponse.json({ leveled_up: false })
  }

  // Get latest KPIs
  const { data: kpi } = await supabase
    .from('kpi_metrics')
    .select('reliability_score, responsiveness_score, quality_score, communication_score, scope_control_score, performance_index')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single()

  if (!kpi) return NextResponse.json({ leveled_up: false })

  const kpis = {
    reliability:       kpi.reliability_score,
    responsiveness:    kpi.responsiveness_score,
    quality:           kpi.quality_score,
    communication:     kpi.communication_score,
    scope_control:     kpi.scope_control_score,
    performance_index: kpi.performance_index,
  }

  const qualifies = shouldLevelUp(profile.current_level, profile.experience_points, kpis)
  if (!qualifies) return NextResponse.json({ leveled_up: false })

  const newLevel = profile.current_level + 1

  // Upgrade level
  await supabase
    .from('profiles')
    .update({ current_level: newLevel })
    .eq('id', user.id)

  // Generate portfolio certificate for the completed level
  let certificateId: string | null = null
  let portfolioUrl: string | null = null

  try {
    const certRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/portfolio/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: req.headers.get('cookie') ?? '' },
      body: JSON.stringify({ level_achieved: profile.current_level }),
    })
    const certData = await certRes.json()
    certificateId = certData.certificate_id
    portfolioUrl = certData.portfolio_url
  } catch {
    // Non-critical — level still upgraded
  }

  const nextLevelXP = LEVEL_THRESHOLDS[(newLevel + 1) as keyof typeof LEVEL_THRESHOLDS] ?? null

  return NextResponse.json({
    leveled_up: true,
    old_level: profile.current_level,
    new_level: newLevel,
    new_level_title: LEVEL_TITLES[newLevel],
    certificate_id: certificateId,
    portfolio_url: portfolioUrl,
    next_level_xp: nextLevelXP,
    message: `Congratulations — you've been promoted to ${LEVEL_TITLES[newLevel]}. Your Level ${profile.current_level} Experience Certificate has been generated.`,
  })
}
