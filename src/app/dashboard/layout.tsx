import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/components/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  // Get profile — if no career_path set, send to onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.career_path) redirect('/onboarding')

  // Get latest KPIs for topbar display
  const { data: kpi } = await supabase
    .from('kpi_metrics')
    .select('reliability_score, responsiveness_score, quality_score, performance_index')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single()

  // Count unread messages
  const { count: unreadCount } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return (
    <DashboardShell
      profile={profile}
      kpi={kpi ?? null}
      unreadCount={unreadCount ?? 0}
    >
      {children}
    </DashboardShell>
  )
}
