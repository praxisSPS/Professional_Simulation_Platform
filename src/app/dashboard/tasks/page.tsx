import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TasksClient from '@/components/TasksClient'

export const metadata = { title: 'Tasks' }

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: tasks }, { data: session }, { data: profile }] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('assigned_at', { ascending: false }),
    supabase
      .from('simulation_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase.from('profiles').select('career_path, current_level').eq('id', user.id).single(),
  ])

  return (
    <TasksClient
      tasks={tasks ?? []}
      activeSession={session ?? null}
      profile={profile ?? null}
    />
  )
}
