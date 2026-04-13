import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SimulateClient from '@/components/SimulateClient'

export const metadata = { title: 'Simulate' }

export default async function SimulatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: profile }, { data: session }, { data: tasks }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('simulation_sessions').select('*').eq('user_id', user.id).eq('status', 'active').order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('tasks').select('*').eq('user_id', user.id).order('assigned_at', { ascending: true }),
  ])

  const activeTasks = tasks?.filter((t: any) => !t.completed_at) ?? []
  const completedTasks = tasks?.filter((t: any) => t.completed_at) ?? []

  return (
    <SimulateClient
      profile={profile}
      activeSession={session ?? null}
      pendingTasks={activeTasks}
      completedTasks={completedTasks}
    />
  )
}
