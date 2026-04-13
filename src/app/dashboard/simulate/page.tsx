import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SimulateClient from '@/components/SimulateClient'

export const metadata = { title: 'Simulate' }

export default async function SimulatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: profile }, { data: session }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('simulation_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  return <SimulateClient profile={profile} activeSession={session ?? null} />
}
