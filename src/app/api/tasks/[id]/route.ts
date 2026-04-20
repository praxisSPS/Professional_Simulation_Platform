import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const updates = await req.json()
  const allowed = ['tool_used', 'submission_type', 'submission_url', 'user_response']
  const filtered = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)))

  const { error } = await adminSupabase
    .from('tasks')
    .update(filtered)
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
