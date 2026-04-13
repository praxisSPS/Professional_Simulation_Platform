// src/app/api/ai/message/route.ts
// POST — generate an AI coworker message and store it in the inbox

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateCoworkerMessage, PersonaKey, ScenarioType, PERSONAS } from '@/lib/ai-coworkers'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const {
    session_id,
    persona,
    scenario,
    context,
  }: {
    session_id: string
    persona: PersonaKey
    scenario: ScenarioType
    context: Record<string, unknown>
  } = await req.json()

  const p = PERSONAS[persona]

  const generated = await generateCoworkerMessage({
    persona,
    scenario,
    context: context as Parameters<typeof generateCoworkerMessage>[0]['context'],
  })

  const { data: message } = await supabase
    .from('messages')
    .insert({
      session_id,
      user_id: user.id,
      sender_persona: persona,
      sender_name: p.name,
      sender_role: p.role,
      subject: generated.subject,
      body: generated.body,
      urgency: generated.urgency,
      requires_response: true,
      response_deadline_minutes: generated.urgency === 'urgent' ? 15 : 30,
      trigger_type: 'scheduled',
    })
    .select()
    .single()

  return NextResponse.json({ message })
}
