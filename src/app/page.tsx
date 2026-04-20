'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Mode = 'login' | 'signup'

const DATA_POLICY = `PRAXIS PROFESSIONAL SIMULATION PLATFORM
DATA POLICY

Last updated: April 2026

1. WHO WE ARE
Praxis SPS Ltd ("we", "us", "our") operates the Praxis Professional Simulation Platform. We are committed to protecting your personal data in accordance with UK GDPR and the Data Protection Act 2018.

2. DATA WE COLLECT
When you create an account and use the platform, we collect:
• Account data: your name and email address
• Simulation data: task responses, scores, decisions, and performance metrics generated during simulation sessions
• Usage data: session timestamps, login activity, and feature interactions
• Portfolio data: evidence entries and competency records you choose to save

We do not collect payment information, browsing history outside the platform, or any sensitive personal data.

3. HOW WE USE YOUR DATA
Your data is used solely to:
• Operate and personalise your simulation experience
• Track your learning progress across sessions
• Generate your performance portfolio and competency evidence
• Improve the quality of the simulation curriculum

We do not sell, rent, or share your personal data with third parties for marketing purposes. Aggregated, anonymised data may be used for platform improvement.

4. DATA RETENTION AND DELETION
Accounts that have not been accessed for 60 consecutive days will be automatically and permanently deleted, including all associated simulation data, messages, performance records, and portfolio entries. This deletion is irreversible.

You may request deletion of your account and all associated data at any time by contacting us at privacy@praxissps.com. Deletion requests are processed within 7 days.

5. YOUR RIGHTS
Under UK GDPR, you have the right to:
• Access the personal data we hold about you
• Correct inaccurate data
• Request erasure of your data
• Restrict or object to processing
• Data portability

To exercise any of these rights, contact privacy@praxissps.com.

6. DATA SECURITY
All data is stored on Supabase infrastructure hosted in EU data centres. Data is encrypted in transit (TLS) and at rest. Access is restricted to authorised personnel only.

7. COOKIES
We use only essential session cookies required for authentication. No advertising or tracking cookies are used.

8. CHANGES TO THIS POLICY
We may update this policy from time to time. Material changes will be notified via email or in-platform notification. Continued use of the platform after notice constitutes acceptance of the updated policy.

9. CONTACT
For data protection queries: privacy@praxissps.com`

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) { setError(error.message); setLoading(false); return }

      // Record policy agreement timestamp on profile
      if (data.user) {
        await supabase
          .from('profiles')
          .update({ data_policy_agreed_at: new Date().toISOString() })
          .eq('id', data.user.id)
      }

      window.location.href = '/onboarding'
      return
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const submitDisabled = loading || (mode === 'signup' && !agreed)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ width: 400, background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
        {/* Header bar */}
        <div style={{ background: '#1F4E79', padding: '24px 32px' }}>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 600, marginBottom: 4 }}>PRAXIS</div>
          <div style={{ color: '#B5D4F4', fontSize: 13 }}>Professional Simulation Platform</div>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Mode toggle */}
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 8, padding: 3, marginBottom: 24 }}>
            {(['login', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setAgreed(false) }}
                style={{
                  flex: 1, padding: '7px 0', border: 'none', borderRadius: 6, fontSize: 13,
                  cursor: 'pointer', fontWeight: mode === m ? 500 : 400,
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#1F4E79' : '#64748B',
                  boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 12, color: '#64748B', marginBottom: 5, display: 'block' }}>Full name</label>
                <input
                  type="text" required value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your name"
                  style={{ width: '100%', padding: '9px 12px', border: '0.5px solid #CBD5E1', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: '#64748B', marginBottom: 5, display: 'block' }}>Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '9px 12px', border: '0.5px solid #CBD5E1', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#64748B', marginBottom: 5, display: 'block' }}>Password</label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min. 8 characters' : ''}
                style={{ width: '100%', padding: '9px 12px', border: '0.5px solid #CBD5E1', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {mode === 'signup' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {agreed && (
                  <span style={{ fontSize: 11, color: '#00875A', fontWeight: 500 }}>✓ Data policy agreed</span>
                )}
                <button
                  type="button"
                  onClick={() => setPolicyOpen(true)}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: 12, color: '#1F4E79', textDecoration: 'underline',
                    marginLeft: agreed ? 'auto' : 0,
                  }}
                >
                  {agreed ? 'Review data policy' : 'Read our data policy'}
                </button>
              </div>
            )}

            {error && (
              <div style={{ background: '#FEF2F2', border: '0.5px solid #FCA5A5', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#DC2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitDisabled}
              title={mode === 'signup' && !agreed ? 'You must agree to the data policy to create an account' : undefined}
              style={{
                width: '100%', padding: '10px',
                background: submitDisabled ? '#E2E8F0' : '#1F4E79',
                color: submitDisabled ? '#94A3B8' : '#fff',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: submitDisabled ? 'not-allowed' : 'pointer',
                marginTop: 4, transition: 'background 0.15s',
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>

      {/* Data policy modal */}
      {policyOpen && (
        <div
          onClick={() => setPolicyOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 12, width: '100%', maxWidth: 560,
              maxHeight: '80vh', display: 'flex', flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            }}
          >
            {/* Modal header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid #E2E8F0', flexShrink: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>Data Policy</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Please read before creating your account</div>
            </div>

            {/* Scrollable policy text */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              <pre style={{
                fontSize: 12, color: '#374151', lineHeight: 1.75,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                margin: 0, fontFamily: "'Segoe UI',system-ui,sans-serif",
              }}>
                {DATA_POLICY}
              </pre>
            </div>

            {/* Modal footer buttons */}
            <div style={{
              padding: '16px 24px', borderTop: '0.5px solid #E2E8F0',
              display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0,
            }}>
              <button
                onClick={() => { setAgreed(false); setPolicyOpen(false) }}
                style={{
                  padding: '9px 20px', background: 'transparent',
                  color: '#374151', border: '0.5px solid #CBD5E1',
                  borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}
              >
                I do not agree
              </button>
              <button
                onClick={() => { setAgreed(true); setPolicyOpen(false) }}
                style={{
                  padding: '9px 20px', background: '#00875A',
                  color: '#fff', border: 'none',
                  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                I agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
