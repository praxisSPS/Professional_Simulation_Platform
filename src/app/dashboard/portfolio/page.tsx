import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PortfolioClient from '@/components/PortfolioClient'

export const metadata = { title: 'Portfolio' }

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: profile }, { data: entries }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('portfolio_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return <PortfolioClient profile={profile} entries={entries ?? []} />
}
