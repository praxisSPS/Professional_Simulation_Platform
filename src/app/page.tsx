'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) { setError(error.message); setLoading(false); return }
      // After signup go to onboarding to pick career path
      router.push('/onboarding')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/dashboard')
    }
    setLoading(false)
  }

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
                onClick={() => setMode(m)}
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

            {error && (
              <div style={{ background: '#FEF2F2', border: '0.5px solid #FCA5A5', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#DC2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '10px', background: '#1F4E79', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4,
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {mode === 'signup' && (
            <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
              By creating an account you agree to our terms of service. Your simulation data is never shared without consent.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
