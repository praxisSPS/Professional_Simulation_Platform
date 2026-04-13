import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InboxClient from '@/components/InboxClient'

export const metadata = { title: 'Inbox' }

export default async function InboxPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <InboxClient messages={messages ?? []} />
}
