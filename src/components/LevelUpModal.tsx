'use client'

import { useEffect, useState } from 'react'

interface LevelUpData {
  new_level: number
  new_level_title: string
  certificate_id: string | null
  portfolio_url: string | null
  message: string
}

interface Props {
  data: LevelUpData
  onDismiss: () => void
}

// Attach to window so any component can trigger it
export function useLevelUpModal() {
  return {
    show: (data: LevelUpData) => {
      const event = new CustomEvent('esp:levelup', { detail: data })
      window.dispatchEvent(event)
    }
  }
}

export default function LevelUpModal({ data, onDismiss }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999, padding: '20px',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '32px',
        maxWidth: 440, width: '100%', textAlign: 'center',
        animation: 'esp-fadein 0.25s ease',
      }}>
        {/* Badge */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: '#EBF3FB',
          border: '3px solid #1F4E79', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px', fontSize: 28,
        }}>
          ★
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          Level up
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
          {data.new_level_title}
        </div>
        <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>
          {data.message}
        </div>

        {data.portfolio_url && (
          <div style={{ background: '#F0FDF4', border: '0.5px solid #86EFAC', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#166534', marginBottom: 4 }}>
              Experience Certificate generated
            </div>
            <div style={{ fontSize: 11, color: '#16A34A', wordBreak: 'break-all' }}>{data.portfolio_url}</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          {data.portfolio_url && (
            <a
              href={data.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, padding: '10px', background: '#1F4E79', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'block' }}
            >
              View certificate →
            </a>
          )}
          <button
            onClick={onDismiss}
            style={{ flex: 1, padding: '10px', background: '#F1F5F9', color: '#374151', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// Global listener component — mount once in DashboardShell
export function LevelUpListener() {
  const [modalData, setModalData] = useState<LevelUpData | null>(null)

  useEffect(() => {
    function handler(e: Event) {
      setModalData((e as CustomEvent).detail)
    }
    window.addEventListener('esp:levelup', handler)
    return () => window.removeEventListener('esp:levelup', handler)
  }, [])

  if (!modalData) return null
  return <LevelUpModal data={modalData} onDismiss={() => setModalData(null)} />
}
