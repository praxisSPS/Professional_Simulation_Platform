import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardHome from '@/components/DashboardHome'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [
    { data: profile },
    { data: kpi },
    { data: messages },
    { data: session },
    { data: tasks },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('kpi_metrics').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(1).single(),
    supabase.from('messages').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
    supabase.from('simulation_sessions').select('*').eq('user_id', user.id).eq('status', 'active').order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('tasks').select('*').eq('user_id', user.id).order('assigned_at', { ascending: false }).limit(20),
  ])

  if (!profile?.career_path) redirect('/onboarding')

  return (
    <DashboardHome
      profile={profile}
      kpi={kpi ?? null}
      messages={messages ?? []}
      activeSession={session ?? null}
      recentTasks={tasks ?? []}
    />
  )
}
