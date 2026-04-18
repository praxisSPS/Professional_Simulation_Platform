import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import KPIDashboard from '@/components/KPIDashboard'

export const metadata = { title: 'My KPIs' }

export default async function KPIsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: history }, { data: profile }, { data: recentTasks }] = await Promise.all([
    supabase
      .from('kpi_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: true }),
    supabase
      .from('profiles')
      .select('current_level, experience_points, career_path')
      .eq('id', user.id)
      .single(),
    supabase
      .from('tasks')
      .select('id, title, type, score, decision_quality, xp_earned, completed_at, kpi_tag, session_id')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(10),
  ])

  const latest = history && history.length > 0 ? history[history.length - 1] : null

  return (
    <KPIDashboard
      history={history ?? []}
      latest={latest}
      profile={profile}
      recentTasks={recentTasks ?? []}
    />
  )
}
