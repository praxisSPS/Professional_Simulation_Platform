'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  sender_name: string
  sender_role: string
  sender_persona: string
  subject: string
  body: string
  urgency: string
  is_read: boolean
  requires_response: boolean
  created_at: string
}

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  boss:   { bg: '#EBF3FB', text: '#1F4E79' },
  marcus: { bg: '#EAF3DE', text: '#166534' },
  sarah:  { bg: '#FFF3CD', text: '#854D0E' },
  client: { bg: '#EEEDFE', text: '#3C3489' },
  hr:     { bg: '#F0FDFA', text: '#065F46' },
}

export default function InboxClient({ messages: initial }: { messages: Message[] }) {
  const [messages, setMessages] = useState(initial)
  const [selected, setSelected] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function openMessage(msg: Message) {
    setSelected(msg)
    setReplyText('')
    if (!msg.is_read) {
      await supabase.from('messages').update({ is_read: true }).eq('id', msg.id)
      setMessages(msgs => msgs.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
      router.refresh()
    }
  }

  async function submitReply() {
    if (!replyText.trim() || !selected) return
    setSubmitting(true)
    // Score the reply via AI
    const res = await fetch('/api/ai/score-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_type: 'email_reply',
        rubric: ['Professional tone', 'Addresses the sender\'s concern directly', 'Clear and concise — under 100 words', 'Appropriate next action stated'],
        response: replyText,
      }),
    })
    const scored = await res.json()
    ;(window as any).espToast?.(
      scored.score >= 75
        ? `Reply sent — scored ${scored.score}/100. ${scored.summary}`
        : `Reply sent — ${scored.score}/100. ${scored.improvements?.[0] ?? 'Review your communication KPI.'}`,
      scored.score >= 75 ? 'success' : 'info'
    )
    setSelected(null)
    setReplyText('')
    setSubmitting(false)
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Message list */}
      <div style={{ width: selected ? 320 : '100%', borderRight: selected ? '0.5px solid #E2E8F0' : 'none', overflow: 'auto', background: '#fff', transition: 'width 0.2s' }}>
        <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>Inbox</span>
          {unreadCount > 0 && (
            <span style={{ fontSize: 11, background: '#EBF3FB', color: '#1F4E79', padding: '2px 8px', borderRadius: 99, fontWeight: 500 }}>
              {unreadCount} unread
            </span>
          )}
        </div>

        {messages.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
            No messages yet. Clock in to start receiving them.
          </div>
        )}

        {messages.map(msg => {
          const colors = AVATAR_COLORS[msg.sender_persona] ?? { bg: '#F1F5F9', text: '#64748B' }
          const initials = msg.sender_name.split(' ').map(n => n[0]).join('').slice(0, 2)
          const isSelected = selected?.id === msg.id

          return (
            <div
              key={msg.id}
              onClick={() => openMessage(msg)}
              style={{
                padding: '12px 16px',
                borderBottom: '0.5px solid #F1F5F9',
                cursor: 'pointer',
                background: isSelected ? '#F8FAFC' : '#fff',
                borderLeft: msg.urgency === 'urgent' ? '3px solid #DC2626' : !msg.is_read ? '3px solid #1F4E79' : '3px solid transparent',
                transition: 'background 0.1s',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: colors.bg, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: msg.is_read ? 400 : 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.sender_name}
                  </span>
                  <span style={{ fontSize: 10, color: '#94A3B8', flexShrink: 0 }}>
                    {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</div>
                {msg.urgency === 'urgent' && (
                  <span style={{ fontSize: 10, background: '#FEE2E2', color: '#991B1B', padding: '1px 6px', borderRadius: 99, fontWeight: 500, marginTop: 3, display: 'inline-block' }}>
                    Needs response
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Thread view */}
      {selected && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Thread header */}
          <div style={{ padding: '14px 20px', borderBottom: '0.5px solid #E2E8F0', display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 12, color: '#64748B', cursor: 'pointer', padding: '4px 8px' }}>← Back</button>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected.subject}</div>
          </div>

          {/* Message body */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
            {/* Sender info */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
              {(() => {
                const colors = AVATAR_COLORS[selected.sender_persona] ?? { bg: '#F1F5F9', text: '#64748B' }
                const initials = selected.sender_name.split(' ').map(n => n[0]).join('').slice(0, 2)
                return (
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.bg, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                    {initials}
                  </div>
                )
              })()}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{selected.sender_name}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>{selected.sender_role}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>
                  {new Date(selected.created_at).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Message body */}
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 24 }}>
              {selected.body}
            </div>

            {/* Urgency note */}
            {selected.urgency === 'urgent' && (
              <div style={{ background: '#FEF2F2', border: '0.5px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#991B1B' }}>
                This message requires a response. Delayed replies affect your Responsiveness KPI.
              </div>
            )}
          </div>

          {/* Reply box */}
          {selected.requires_response && (
            <div style={{ padding: '16px 20px', borderTop: '0.5px solid #E2E8F0', background: '#fff' }}>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>
                Your reply is scored on: professional tone · addresses the concern · concise · clear next action
              </div>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Reply to ${selected.sender_name}...`}
                rows={4}
                style={{ width: '100%', resize: 'vertical', padding: '10px 12px', border: '0.5px solid #CBD5E1', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', lineHeight: 1.6, outline: 'none', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{replyText.split(/\s+/).filter(Boolean).length} words</span>
                <button
                  onClick={submitReply}
                  disabled={!replyText.trim() || submitting}
                  style={{ padding: '8px 20px', background: replyText.trim() ? '#1F4E79' : '#E2E8F0', color: replyText.trim() ? '#fff' : '#94A3B8', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: replyText.trim() ? 'pointer' : 'not-allowed' }}
                >
                  {submitting ? 'Sending...' : 'Send reply →'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
