import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import KPIsClient from '@/components/KPIsClient'

export const metadata = { title: 'My KPIs' }

export default async function KPIsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: history }, { data: profile }] = await Promise.all([
    supabase
      .from('kpi_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: true }),
    supabase.from('profiles').select('current_level, experience_points, career_path').eq('id', user.id).single(),
  ])

  const latest = history && history.length > 0 ? history[history.length - 1] : null

  return <KPIsClient history={history ?? []} latest={latest} profile={profile} />
}
