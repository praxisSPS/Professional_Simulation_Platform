'use client'

import { useState, useEffect } from 'react'

interface Props {
  clockInTime: string   // ISO string of when user clocked in
  simSpeedMultiplier?: number  // 1 real minute = N sim minutes (default 4)
}

function pad(n: number) { return String(n).padStart(2, '0') }

export default function SimClock({ clockInTime, simSpeedMultiplier = 4 }: Props) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!now) return (
    <div style={{ padding:'10px 18px', background:'#0D1117', border:'1px solid #1E2535', borderRadius:10, marginBottom:14 }}>
      <div style={{ fontSize:11, color:'#334155' }}>Loading sim clock...</div>
    </div>
  )

  const clockIn = new Date(clockInTime)
  const realElapsedMs = now.getTime() - clockIn.getTime()
  const realElapsedSecs = Math.floor(realElapsedMs / 1000)

  // Sim time: starts at 09:00 and advances at simSpeedMultiplier × real speed
  const simElapsedMins = Math.floor((realElapsedMs / 1000 / 60) * simSpeedMultiplier)
  const simStartMins = 9 * 60  // 09:00
  const simCurrentMins = simStartMins + simElapsedMins
  const simHour = Math.floor(simCurrentMins / 60)
  const simMin = simCurrentMins % 60

  // Real elapsed display
  const realMins = Math.floor(realElapsedSecs / 60)
  const realSecs = realElapsedSecs % 60
  const realHours = Math.floor(realMins / 60)
  const realMinsRemainder = realMins % 60

  const simTimeStr = `${pad(simHour)}:${pad(simMin)}`
  const elapsedStr = realHours > 0
    ? `${realHours}h ${pad(realMinsRemainder)}m`
    : `${realMins}m ${pad(realSecs)}s`

  // Colour clock based on sim time
  const isLate = simHour >= 17  // after 5pm
  const isLunch = simHour === 12 || simHour === 13
  const clockColor = isLate ? '#F43F5E' : isLunch ? '#F59E0B' : '#00C2A8'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '10px 18px',
      background: '#0D1117',
      border: '1px solid #1E2535',
      borderRadius: 10,
      marginBottom: 14,
    }}>
      {/* Sim clock */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: clockColor, flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
        <div>
          <div style={{ fontSize: 10, color: '#334155', marginBottom: 1 }}>Sim time</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: clockColor, letterSpacing: '0.05em', lineHeight: 1 }}>
            {simTimeStr}
          </div>
          {isLate && <div style={{ fontSize: 9, color: '#F43F5E', marginTop: 2 }}>After hours</div>}
          {isLunch && <div style={{ fontSize: 9, color: '#F59E0B', marginTop: 2 }}>Lunch hour</div>}
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 36, background: '#1E2535' }} />

      {/* Real elapsed */}
      <div>
        <div style={{ fontSize: 10, color: '#334155', marginBottom: 1 }}>Time in session</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#64748B', lineHeight: 1 }}>{elapsedStr}</div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 36, background: '#1E2535' }} />

      {/* Day progress bar */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: '#334155' }}>Day progress</span>
          <span style={{ fontSize: 10, color: '#334155' }}>09:00 → 17:30</span>
        </div>
        <div style={{ height: 4, background: '#1E2535', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: 4,
            borderRadius: 2,
            background: isLate ? '#F43F5E' : clockColor,
            width: `${Math.min(100, Math.max(0, ((simCurrentMins - 540) / (8.5 * 60)) * 100)).toFixed(1)}%`,
            transition: 'width 1s linear',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <span style={{ fontSize: 9, color: '#2D3748' }}>Start</span>
          <span style={{ fontSize: 9, color: '#2D3748' }}>End of day</span>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
