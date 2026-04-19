'use client'

import { useState } from 'react'
import { TabBar, TaskBrief, SubmitBtn, ResultPanel, evalSubmit, ArtefactPanel, inp, lbl, ta, row, col, D } from './shared'

interface Props {
  task: any
  sessionId: string
  onComplete: (result: any) => void
  initialTab?: string
}

const TABS = [
  { id: 'dashboard',  label: 'Campaign Dashboard' },
  { id: 'copy',       label: 'Copy Editor' },
  { id: 'abtest',     label: 'A/B Test Planner' },
  { id: 'builder',    label: 'Campaign Builder' },
  { id: 'analytics',  label: 'Analytics Interpreter' },
]

// ── Campaign Performance Dashboard ────────────────────────────

interface ChannelData {
  id: number
  channel: string
  budget: number
  spend: number
  impressions: number
  clicks: number
  conversions: number
  revenue: number
}

function CampaignDashboard({ task, onComplete }: Props) {
  const [campaignName, setCampaignName] = useState('')
  const [period, setPeriod] = useState('')
  const [channels, setChannels] = useState<ChannelData[]>([
    { id: 1, channel: 'Paid Search', budget: 5000, spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
    { id: 2, channel: 'Social Media', budget: 3000, spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
    { id: 3, channel: 'Email', budget: 1000, spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
  ])
  const [insights, setInsights] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const nextId = () => Math.max(0, ...channels.map(c => c.id)) + 1
  function addChannel() {
    setChannels(p => [...p, { id: nextId(), channel: '', budget: 0, spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }])
  }
  function removeChannel(id: number) { setChannels(p => p.filter(c => c.id !== id)) }
  function updateChannel(id: number, field: keyof ChannelData, value: string) {
    setChannels(p => p.map(c => c.id === id ? { ...c, [field]: field === 'channel' ? value : parseFloat(value) || 0 } : c))
  }

  const totalBudget = channels.reduce((s, c) => s + c.budget, 0)
  const totalSpend = channels.reduce((s, c) => s + c.spend, 0)
  const totalImpressions = channels.reduce((s, c) => s + c.impressions, 0)
  const totalClicks = channels.reduce((s, c) => s + c.clicks, 0)
  const totalConversions = channels.reduce((s, c) => s + c.conversions, 0)
  const totalRevenue = channels.reduce((s, c) => s + c.revenue, 0)
  const overallCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : '0.00'
  const overallCVR = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : '0.00'
  const overallROAS = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00'
  const budgetUtilisation = totalBudget > 0 ? Math.min(totalSpend / totalBudget * 100, 100) : 0

  function submit() {
    const channelRows = channels.map(c => {
      const ctr = c.impressions > 0 ? (c.clicks / c.impressions * 100).toFixed(2) : '0.00'
      const cvr = c.clicks > 0 ? (c.conversions / c.clicks * 100).toFixed(2) : '0.00'
      const roas = c.spend > 0 ? (c.revenue / c.spend).toFixed(2) : '0.00'
      const pacing = c.budget > 0 ? (c.spend / c.budget * 100).toFixed(0) : '0'
      return `  ${c.channel}: Budget £${c.budget.toLocaleString()} | Spend £${c.spend.toLocaleString()} (${pacing}% pacing) | CTR ${ctr}% | CVR ${cvr}% | ROAS ${roas}x | Conversions ${c.conversions}`
    })

    const doc = `CAMPAIGN PERFORMANCE DASHBOARD
==================
Campaign: ${campaignName}
Period: ${period}

OVERALL METRICS:
  Total Budget: £${totalBudget.toLocaleString()} | Total Spend: £${totalSpend.toLocaleString()} (${budgetUtilisation.toFixed(0)}% utilised)
  Impressions: ${totalImpressions.toLocaleString()} | Clicks: ${totalClicks.toLocaleString()} | Conversions: ${totalConversions.toLocaleString()}
  Overall CTR: ${overallCTR}% | CVR: ${overallCVR}% | ROAS: ${overallROAS}x | Total Revenue: £${totalRevenue.toLocaleString()}

CHANNEL BREAKDOWN:
${channelRows.join('\n')}

INSIGHTS & COMMENTARY:
${insights || '(empty)'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'campaign_dashboard',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Key metrics (CTR, CVR, ROAS) are accurately calculated and reported',
        'Budget pacing is assessed and commentary provided',
        'Channel performance is compared to identify best performers',
        'Insights are actionable and data-driven',
        'Recommendations for optimisation are clear and specific',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const metricCard = (label: string, value: string, sub?: string) => (
    <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: D.muted, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: D.accent }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: D.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Campaign Performance Dashboard</div>

      <div style={row}>
        <div style={col}>
          <label style={lbl}>Campaign Name</label>
          <input style={inp} value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="Campaign name" />
        </div>
        <div style={col}>
          <label style={lbl}>Period</label>
          <input style={inp} value={period} onChange={e => setPeriod(e.target.value)} placeholder="e.g. Q1 2026, Jan Week 2" />
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {metricCard('ROAS', `${overallROAS}x`, `£${totalRevenue.toLocaleString()} revenue`)}
        {metricCard('CTR', `${overallCTR}%`, `${totalClicks.toLocaleString()} clicks`)}
        {metricCard('CVR', `${overallCVR}%`, `${totalConversions.toLocaleString()} conversions`)}
        {metricCard('Budget', `${budgetUtilisation.toFixed(0)}%`, `£${totalSpend.toLocaleString()} / £${totalBudget.toLocaleString()}`)}
      </div>

      {/* Budget bar */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '12px 16px' }}>
        <div style={{ fontSize: 10, color: D.sub, fontWeight: 600, marginBottom: 8 }}>BUDGET UTILISATION</div>
        <div style={{ height: 8, background: D.border, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${budgetUtilisation}%`, background: budgetUtilisation > 95 ? '#F43F5E' : budgetUtilisation > 80 ? '#F59E0B' : D.accent, borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: D.muted }}>
          <span>£0</span>
          <span>£{totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Channel table */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>CHANNEL PERFORMANCE</div>
          <button onClick={addChannel} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add channel</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 90px 90px 90px 28px', gap: 6, marginBottom: 6 }}>
          {['Channel', 'Budget', 'Spend', 'Impressions', 'Clicks', 'Conversions', 'Revenue £', ''].map(h => (
            <div key={h} style={{ fontSize: 10, color: D.muted, fontWeight: 600, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {channels.map(c => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 90px 90px 90px 28px', gap: 6, marginBottom: 6 }}>
            <input style={inp} value={c.channel} onChange={e => updateChannel(c.id, 'channel', e.target.value)} placeholder="Channel name" />
            <input type="number" style={inp} value={c.budget || ''} onChange={e => updateChannel(c.id, 'budget', e.target.value)} placeholder="0" />
            <input type="number" style={inp} value={c.spend || ''} onChange={e => updateChannel(c.id, 'spend', e.target.value)} placeholder="0" />
            <input type="number" style={inp} value={c.impressions || ''} onChange={e => updateChannel(c.id, 'impressions', e.target.value)} placeholder="0" />
            <input type="number" style={inp} value={c.clicks || ''} onChange={e => updateChannel(c.id, 'clicks', e.target.value)} placeholder="0" />
            <input type="number" style={inp} value={c.conversions || ''} onChange={e => updateChannel(c.id, 'conversions', e.target.value)} placeholder="0" />
            <input type="number" style={inp} value={c.revenue || ''} onChange={e => updateChannel(c.id, 'revenue', e.target.value)} placeholder="0" />
            <button onClick={() => removeChannel(c.id)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14 }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Insights & Commentary</label>
        <textarea style={{ ...ta, minHeight: 90 }} value={insights} onChange={e => setInsights(e.target.value)} placeholder="What are the key findings? Which channels are over/under-performing? What optimisations do you recommend?" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Copy Editor ───────────────────────────────────────────────

type CopyFormat = 'ad' | 'email' | 'social' | 'landing_page' | 'sms'

interface CopyVariant {
  id: number
  label: string
  headline: string
  body: string
  cta: string
}

const COPY_LIMITS: Record<CopyFormat, { headline: number; body: number; cta: number }> = {
  ad: { headline: 30, body: 90, cta: 20 },
  email: { headline: 60, body: 500, cta: 40 },
  social: { headline: 0, body: 280, cta: 25 },
  landing_page: { headline: 80, body: 1000, cta: 30 },
  sms: { headline: 0, body: 160, cta: 0 },
}

const FORMAT_LABELS: Record<CopyFormat, string> = {
  ad: 'Display / Search Ad',
  email: 'Email',
  social: 'Social Post',
  landing_page: 'Landing Page',
  sms: 'SMS',
}

function CopyEditor({ task, onComplete }: Props) {
  const [format, setFormat] = useState<CopyFormat>('ad')
  const [audience, setAudience] = useState('')
  const [objective, setObjective] = useState('')
  const [variants, setVariants] = useState<CopyVariant[]>([
    { id: 1, label: 'Variant A', headline: '', body: '', cta: '' },
    { id: 2, label: 'Variant B', headline: '', body: '', cta: '' },
  ])
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const limits = COPY_LIMITS[format]

  const nextId = () => Math.max(0, ...variants.map(v => v.id)) + 1
  function addVariant() {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F']
    setVariants(p => [...p, { id: nextId(), label: `Variant ${labels[p.length] ?? p.length + 1}`, headline: '', body: '', cta: '' }])
  }
  function removeVariant(id: number) { setVariants(p => p.filter(v => v.id !== id)) }
  function updateVariant(id: number, field: keyof CopyVariant, value: string) {
    setVariants(p => p.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const charCounter = (current: number, max: number) => {
    const pct = max > 0 ? current / max : 0
    return (
      <span style={{ fontSize: 10, color: pct > 1 ? '#F43F5E' : pct > 0.85 ? '#F59E0B' : D.muted }}>
        {current}{max > 0 ? `/${max}` : ''}
      </span>
    )
  }

  function submit() {
    const variantDocs = variants.map(v => `  ${v.label}:\n    Headline: ${v.headline || '(empty)'}\n    Body: ${v.body || '(empty)'}\n    CTA: ${v.cta || '(empty)'}`).join('\n\n')
    const doc = `COPY VARIANTS — ${FORMAT_LABELS[format].toUpperCase()}
==================
Format: ${FORMAT_LABELS[format]}
Target Audience: ${audience || 'Not specified'}
Objective: ${objective || 'Not specified'}

VARIANTS:
${variantDocs}

CHARACTER LIMITS: Headline ${limits.headline || 'N/A'} | Body ${limits.body} | CTA ${limits.cta || 'N/A'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'marketing_copy',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Copy is within character limits for the chosen format',
        'Headline grabs attention and communicates value clearly',
        'Body copy is persuasive and audience-appropriate',
        'CTA is clear, action-oriented, and creates urgency',
        'Variants are meaningfully differentiated to enable valid A/B testing',
        'Tone is consistent with the target audience and objective',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Copy Editor</div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(Object.keys(FORMAT_LABELS) as CopyFormat[]).map(f => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            style={{
              padding: '5px 12px', fontSize: 11, fontWeight: 500,
              background: format === f ? 'rgba(0,194,168,0.12)' : D.panel,
              border: `1px solid ${format === f ? D.accent : D.border}`,
              color: format === f ? D.accent : D.sub,
              borderRadius: 6, cursor: 'pointer',
            }}
          >
            {FORMAT_LABELS[f]}
          </button>
        ))}
      </div>

      <div style={row}>
        <div style={col}>
          <label style={lbl}>Target Audience</label>
          <input style={inp} value={audience} onChange={e => setAudience(e.target.value)} placeholder="Who is this copy for?" />
        </div>
        <div style={col}>
          <label style={lbl}>Campaign Objective</label>
          <input style={inp} value={objective} onChange={e => setObjective(e.target.value)} placeholder="Awareness / Consideration / Conversion" />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>COPY VARIANTS</div>
        <button onClick={addVariant} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add variant</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: variants.length > 1 ? `repeat(${Math.min(variants.length, 2)}, 1fr)` : '1fr', gap: 12 }}>
        {variants.map(v => (
          <div key={v.id} style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <input
                style={{ ...inp, width: 120, padding: '4px 8px', fontSize: 12, fontWeight: 600 }}
                value={v.label}
                onChange={e => updateVariant(v.id, 'label', e.target.value)}
              />
              <button onClick={() => removeVariant(v.id)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14 }}>×</button>
            </div>

            {limits.headline > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Headline</label>
                  {charCounter(v.headline.length, limits.headline)}
                </div>
                <input style={inp} value={v.headline} onChange={e => updateVariant(v.id, 'headline', e.target.value)} placeholder="Compelling headline..." maxLength={limits.headline * 1.5} />
              </div>
            )}

            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ ...lbl, marginBottom: 0 }}>Body Copy</label>
                {charCounter(v.body.length, limits.body)}
              </div>
              <textarea
                style={{ ...ta, minHeight: format === 'landing_page' ? 140 : 80 }}
                value={v.body}
                onChange={e => updateVariant(v.id, 'body', e.target.value)}
                placeholder="Main message..."
              />
            </div>

            {limits.cta > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Call to Action</label>
                  {charCounter(v.cta.length, limits.cta)}
                </div>
                <input style={inp} value={v.cta} onChange={e => updateVariant(v.id, 'cta', e.target.value)} placeholder="Shop now · Learn more · Get started..." />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── A/B Test Planner ──────────────────────────────────────────

function ABTestPlanner({ task, onComplete }: Props) {
  const [testName, setTestName] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [metric, setMetric] = useState('')
  const [baseline, setBaseline] = useState('')
  const [mde, setMde] = useState('10')
  const [confidence, setConfidence] = useState('95')
  const [power, setPower] = useState('80')
  const [controlName, setControlName] = useState('Control')
  const [variantName, setVariantName] = useState('Variant')
  const [controlDesc, setControlDesc] = useState('')
  const [variantDesc, setVariantDesc] = useState('')
  const [duration, setDuration] = useState('')
  const [trafficSplit, setTrafficSplit] = useState('50')
  const [risks, setRisks] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Simplified sample size estimate
  const zAlpha: Record<string, number> = { '90': 1.645, '95': 1.96, '99': 2.576 }
  const zBeta: Record<string, number> = { '80': 0.842, '85': 1.036, '90': 1.282 }
  const za = zAlpha[confidence] ?? 1.96
  const zb = zBeta[power] ?? 0.842
  const baselineRate = parseFloat(baseline) / 100 || 0.05
  const mdeVal = parseFloat(mde) / 100 || 0.1
  const p2 = baselineRate * (1 + mdeVal)
  const pbar = (baselineRate + p2) / 2
  const sampleSize = pbar > 0 && pbar < 1
    ? Math.ceil(2 * (za + zb) ** 2 * pbar * (1 - pbar) / (p2 - baselineRate) ** 2)
    : null

  function submit() {
    const doc = `A/B TEST PLAN
==================
Test Name: ${testName}
Hypothesis: ${hypothesis}
Primary Metric: ${metric}

TEST DESIGN:
  Control: ${controlName} — ${controlDesc || 'Current experience'}
  Variant: ${variantName} — ${variantDesc || 'New experience'}
  Traffic Split: ${trafficSplit}% / ${100 - parseInt(trafficSplit)}%

STATISTICAL PARAMETERS:
  Baseline Rate: ${baseline}%
  Minimum Detectable Effect: ${mde}%
  Confidence Level: ${confidence}%
  Statistical Power: ${power}%
  Estimated Sample Size per Variant: ${sampleSize ? sampleSize.toLocaleString() : 'N/A (check inputs)'}

PLANNED DURATION: ${duration || 'TBD'}

RISKS & CONSIDERATIONS:
${risks || 'None identified'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'ab_test_plan',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Hypothesis is clear, specific, and falsifiable',
        'Primary metric is well-chosen and directly measurable',
        'Statistical parameters (confidence, power, MDE) are appropriate',
        'Sample size is realistic given traffic levels',
        'Control and variant are clearly differentiated with one variable changed',
        'Duration is sufficient to capture weekly patterns and avoid novelty effects',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>A/B Test Planner</div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>Test Name</label>
          <input style={inp} value={testName} onChange={e => setTestName(e.target.value)} placeholder="Descriptive test name" />
        </div>
        <div>
          <label style={lbl}>Hypothesis</label>
          <textarea style={{ ...ta, minHeight: 60 }} value={hypothesis} onChange={e => setHypothesis(e.target.value)} placeholder="We believe that [change] will [outcome] because [rationale]..." />
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>VARIANTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#0A1A0F', border: `1px solid #1E3528`, borderRadius: 6, padding: '12px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4ADE80', marginBottom: 8 }}>CONTROL</div>
            <div style={{ marginBottom: 8 }}>
              <label style={lbl}>Name</label>
              <input style={inp} value={controlName} onChange={e => setControlName(e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <textarea style={{ ...ta, minHeight: 60 }} value={controlDesc} onChange={e => setControlDesc(e.target.value)} placeholder="Current experience..." />
            </div>
          </div>
          <div style={{ background: '#0A0F1A', border: `1px solid #1E2535`, borderRadius: 6, padding: '12px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#60A5FA', marginBottom: 8 }}>VARIANT</div>
            <div style={{ marginBottom: 8 }}>
              <label style={lbl}>Name</label>
              <input style={inp} value={variantName} onChange={e => setVariantName(e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <textarea style={{ ...ta, minHeight: 60 }} value={variantDesc} onChange={e => setVariantDesc(e.target.value)} placeholder="What's being changed..." />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>STATISTICAL SETUP</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={lbl}>Primary Metric</label>
            <input style={inp} value={metric} onChange={e => setMetric(e.target.value)} placeholder="e.g. Click-through rate" />
          </div>
          <div>
            <label style={lbl}>Baseline Rate (%)</label>
            <input type="number" style={inp} value={baseline} onChange={e => setBaseline(e.target.value)} placeholder="e.g. 3.5" />
          </div>
          <div>
            <label style={lbl}>Min. Detectable Effect (%)</label>
            <input type="number" style={inp} value={mde} onChange={e => setMde(e.target.value)} placeholder="10" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div>
            <label style={lbl}>Confidence Level</label>
            <select style={inp} value={confidence} onChange={e => setConfidence(e.target.value)}>
              {['90', '95', '99'].map(v => <option key={v} value={v}>{v}%</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Statistical Power</label>
            <select style={inp} value={power} onChange={e => setPower(e.target.value)}>
              {['80', '85', '90'].map(v => <option key={v} value={v}>{v}%</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Traffic Split (%)</label>
            <input type="range" min={10} max={90} value={trafficSplit} onChange={e => setTrafficSplit(e.target.value)} style={{ width: '100%', marginTop: 8 }} />
            <div style={{ fontSize: 11, color: D.sub, textAlign: 'center' }}>{trafficSplit}% / {100 - parseInt(trafficSplit)}%</div>
          </div>
        </div>

        {sampleSize && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(0,194,168,0.06)', border: `1px solid rgba(0,194,168,0.2)`, borderRadius: 6 }}>
            <span style={{ fontSize: 12, color: D.accent, fontWeight: 600 }}>
              Estimated sample size: ~{sampleSize.toLocaleString()} per variant
            </span>
            <span style={{ fontSize: 11, color: D.muted, marginLeft: 8 }}>({(sampleSize * 2).toLocaleString()} total)</span>
          </div>
        )}
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={row}>
          <div style={col}>
            <label style={lbl}>Planned Duration</label>
            <input style={inp} value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 2 weeks, min 1 full week" />
          </div>
        </div>
        <div>
          <label style={lbl}>Risks & Considerations</label>
          <textarea style={{ ...ta, minHeight: 60 }} value={risks} onChange={e => setRisks(e.target.value)} placeholder="Seasonality, novelty effect, contamination, other running tests..." />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Campaign Builder ──────────────────────────────────────────

type CampaignObjective = 'awareness' | 'consideration' | 'conversion' | 'retention' | 'reactivation'

const OBJECTIVE_ICONS: Record<CampaignObjective, string> = {
  awareness: '📣',
  consideration: '🔍',
  conversion: '💰',
  retention: '🔄',
  reactivation: '🔋',
}

interface CampaignChannel {
  id: number
  name: string
  format: string
  budget: number
  audience: string
  message: string
}

function CampaignBuilder({ task, onComplete }: Props) {
  const [name, setName] = useState('')
  const [objective, setObjective] = useState<CampaignObjective>('conversion')
  const [targetAudience, setTargetAudience] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalBudget, setTotalBudget] = useState('')
  const [kpi1, setKpi1] = useState('')
  const [kpi2, setKpi2] = useState('')
  const [kpi3, setKpi3] = useState('')
  const [channels, setChannels] = useState<CampaignChannel[]>([
    { id: 1, name: '', format: '', budget: 0, audience: '', message: '' },
  ])
  const [creativeTheme, setCreativeTheme] = useState('')
  const [approvals, setApprovals] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const nextId = () => Math.max(0, ...channels.map(c => c.id)) + 1
  function addChannel() { setChannels(p => [...p, { id: nextId(), name: '', format: '', budget: 0, audience: '', message: '' }]) }
  function removeChannel(id: number) { setChannels(p => p.filter(c => c.id !== id)) }
  function updateChannel(id: number, field: keyof CampaignChannel, value: string | number) {
    setChannels(p => p.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const allocatedBudget = channels.reduce((s, c) => s + (c.budget || 0), 0)
  const remaining = parseFloat(totalBudget || '0') - allocatedBudget

  function submit() {
    const doc = `CAMPAIGN BRIEF
==================
Campaign Name: ${name}
Objective: ${objective.toUpperCase()} ${OBJECTIVE_ICONS[objective]}
Target Audience: ${targetAudience}
Duration: ${startDate} → ${endDate}
Total Budget: £${totalBudget} | Allocated: £${allocatedBudget} | Remaining: £${remaining}

KPIs:
  • ${kpi1 || '(empty)'}
  • ${kpi2 || '(empty)'}
  • ${kpi3 || '(empty)'}

CHANNELS:
${channels.map(c => `  ${c.name || '(unnamed)'} — Format: ${c.format || 'TBD'}, Budget: £${c.budget}, Audience: ${c.audience || 'TBD'}\n  Message: ${c.message || 'TBD'}`).join('\n\n')}

CREATIVE THEME:
${creativeTheme || '(empty)'}

APPROVALS REQUIRED:
${approvals || 'Standard sign-off'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'campaign_brief',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Campaign objective is clear and all channels align to it',
        'Target audience is well-defined with relevant segments',
        'Budget allocation reflects channel priorities and expected ROI',
        'KPIs are measurable and directly tied to the objective',
        'Creative theme is consistent across all channels',
        'Channel mix is appropriate for the audience and objective',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Campaign Builder</div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={row}>
          <div style={col}>
            <label style={lbl}>Campaign Name</label>
            <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Campaign name" />
          </div>
          <div style={col}>
            <label style={lbl}>Total Budget (£)</label>
            <input type="number" style={inp} value={totalBudget} onChange={e => setTotalBudget(e.target.value)} placeholder="0" />
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>Objective</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(Object.keys(OBJECTIVE_ICONS) as CampaignObjective[]).map(obj => (
              <button
                key={obj}
                onClick={() => setObjective(obj)}
                style={{
                  padding: '6px 14px', fontSize: 11, fontWeight: 500, borderRadius: 6, cursor: 'pointer',
                  background: objective === obj ? 'rgba(0,194,168,0.12)' : D.panel,
                  border: `1px solid ${objective === obj ? D.accent : D.border}`,
                  color: objective === obj ? D.accent : D.sub,
                }}
              >
                {OBJECTIVE_ICONS[obj]} {obj.charAt(0).toUpperCase() + obj.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div style={row}>
          <div style={col}>
            <label style={lbl}>Start Date</label>
            <input type="date" style={inp} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div style={col}>
            <label style={lbl}>End Date</label>
            <input type="date" style={inp} value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label style={lbl}>Target Audience</label>
          <textarea style={{ ...ta, minHeight: 60 }} value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="Demographics, psychographics, segments, lookalike audiences..." />
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>KPIs</div>
        {[kpi1, kpi2, kpi3].map((kpi, i) => {
          const setters = [setKpi1, setKpi2, setKpi3]
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: D.muted, width: 20 }}>{i + 1}.</span>
              <input style={inp} value={kpi} onChange={e => setters[i](e.target.value)} placeholder={`KPI ${i + 1} — e.g. CTR > 2%, £50 CPA, 1000 new signups`} />
            </div>
          )
        })}
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>CHANNELS</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {parseFloat(totalBudget || '0') > 0 && (
              <span style={{ fontSize: 11, color: remaining < 0 ? '#F43F5E' : remaining === 0 ? '#4ADE80' : D.muted }}>
                £{remaining.toLocaleString()} remaining
              </span>
            )}
            <button onClick={addChannel} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add channel</button>
          </div>
        </div>
        {channels.map(c => (
          <div key={c.id} style={{ background: '#111827', border: `1px solid ${D.border}`, borderRadius: 6, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 28px', gap: 8, marginBottom: 8 }}>
              <div>
                <label style={lbl}>Channel</label>
                <input style={inp} value={c.name} onChange={e => updateChannel(c.id, 'name', e.target.value)} placeholder="e.g. Google Search, Facebook" />
              </div>
              <div>
                <label style={lbl}>Ad Format</label>
                <input style={inp} value={c.format} onChange={e => updateChannel(c.id, 'format', e.target.value)} placeholder="e.g. Responsive Search Ad" />
              </div>
              <div>
                <label style={lbl}>Budget (£)</label>
                <input type="number" style={inp} value={c.budget || ''} onChange={e => updateChannel(c.id, 'budget', parseFloat(e.target.value) || 0)} placeholder="0" />
              </div>
              <button onClick={() => removeChannel(c.id)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14, paddingTop: 20 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={lbl}>Audience Segment</label>
                <input style={inp} value={c.audience} onChange={e => updateChannel(c.id, 'audience', e.target.value)} placeholder="Audience for this channel" />
              </div>
              <div>
                <label style={lbl}>Key Message</label>
                <input style={inp} value={c.message} onChange={e => updateChannel(c.id, 'message', e.target.value)} placeholder="Channel-specific message" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Creative Theme</label>
        <textarea style={{ ...ta, minHeight: 70 }} value={creativeTheme} onChange={e => setCreativeTheme(e.target.value)} placeholder="Visual style, tone of voice, key creative direction across all channels..." />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Analytics Interpreter ─────────────────────────────────────

interface FunnelStage {
  id: number
  name: string
  users: number
}

function AnalyticsInterpreter({ task, onComplete }: Props) {
  const [period, setPeriod] = useState('')
  const [channel, setChannel] = useState('')
  const [funnel, setFunnel] = useState<FunnelStage[]>([
    { id: 1, name: 'Impressions', users: 0 },
    { id: 2, name: 'Clicks', users: 0 },
    { id: 3, name: 'Landing Page Views', users: 0 },
    { id: 4, name: 'Sign-ups / Add to Cart', users: 0 },
    { id: 5, name: 'Conversions', users: 0 },
  ])
  const [anomalies, setAnomalies] = useState('')
  const [rootCause, setRootCause] = useState('')
  const [recommendations, setRecommendations] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const nextId = () => Math.max(0, ...funnel.map(f => f.id)) + 1
  function addStage() { setFunnel(p => [...p, { id: nextId(), name: '', users: 0 }]) }
  function removeStage(id: number) { setFunnel(p => p.filter(f => f.id !== id)) }
  function updateStage(id: number, field: keyof FunnelStage, value: string | number) {
    setFunnel(p => p.map(f => f.id === id ? { ...f, [field]: field === 'name' ? value : parseInt(value as string) || 0 } : f))
  }

  const maxUsers = Math.max(...funnel.map(f => f.users), 1)

  function submit() {
    const funnelRows = funnel.map((stage, i) => {
      const prev = i > 0 ? funnel[i - 1].users : stage.users
      const dropPct = prev > 0 ? ((1 - stage.users / prev) * 100).toFixed(1) : '0.0'
      const barPct = maxUsers > 0 ? (stage.users / maxUsers * 100).toFixed(0) : '0'
      return `  ${stage.name}: ${stage.users.toLocaleString()} users (${barPct}% of top) — drop from prev: ${i > 0 ? `${dropPct}%` : 'N/A'}`
    }).join('\n')

    const doc = `ANALYTICS INTERPRETATION REPORT
==================
Period: ${period}
Channel / Campaign: ${channel}

CONVERSION FUNNEL:
${funnelRows}

Overall Conversion Rate: ${funnel[0].users > 0 ? ((funnel[funnel.length - 1].users / funnel[0].users) * 100).toFixed(2) : '0.00'}%

ANOMALIES / OBSERVATIONS:
${anomalies || '(empty)'}

ROOT CAUSE ANALYSIS:
${rootCause || '(empty)'}

RECOMMENDATIONS:
${recommendations || '(empty)'}
`
    evalSubmit({
      taskId: task.id, content: doc, language: 'analytics_report',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Funnel analysis correctly identifies the biggest drop-off points',
        'Anomalies are identified and contextualised (not just listed)',
        'Root cause analysis goes beyond surface observations',
        'Recommendations are specific, prioritised, and actionable',
        'Overall conversion rate and key drop-off rates are correctly calculated',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Analytics Interpreter</div>

      <div style={row}>
        <div style={col}>
          <label style={lbl}>Period</label>
          <input style={inp} value={period} onChange={e => setPeriod(e.target.value)} placeholder="e.g. Jan 2026, Last 30 days" />
        </div>
        <div style={col}>
          <label style={lbl}>Channel / Campaign</label>
          <input style={inp} value={channel} onChange={e => setChannel(e.target.value)} placeholder="e.g. Paid Social, Summer Sale Campaign" />
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>CONVERSION FUNNEL</div>
          <button onClick={addStage} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add stage</button>
        </div>

        {funnel.map((stage, i) => {
          const prev = i > 0 ? funnel[i - 1].users : stage.users
          const dropPct = prev > 0 && i > 0 ? ((1 - stage.users / prev) * 100).toFixed(1) : null
          const barWidth = maxUsers > 0 ? (stage.users / maxUsers * 100) : 0
          return (
            <div key={stage.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 10, color: D.muted, width: 20, textAlign: 'right' }}>{i + 1}</div>
                <input
                  style={{ ...inp, width: 200 }}
                  value={stage.name}
                  onChange={e => updateStage(stage.id, 'name', e.target.value)}
                  placeholder="Stage name"
                />
                <input
                  type="number"
                  style={{ ...inp, width: 100 }}
                  value={stage.users || ''}
                  onChange={e => updateStage(stage.id, 'users', e.target.value)}
                  placeholder="Users"
                />
                {dropPct && (
                  <span style={{ fontSize: 11, color: parseFloat(dropPct) > 60 ? '#F43F5E' : parseFloat(dropPct) > 30 ? '#F59E0B' : '#4ADE80', minWidth: 70 }}>
                    ↓ {dropPct}% drop
                  </span>
                )}
                <button onClick={() => removeStage(stage.id)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14 }}>×</button>
              </div>
              <div style={{ marginLeft: 30, height: 8, background: D.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${barWidth}%`,
                  background: barWidth > 60 ? D.accent : barWidth > 30 ? '#F59E0B' : '#F43F5E',
                  borderRadius: 4, transition: 'width 0.3s',
                }} />
              </div>
            </div>
          )
        })}

        {funnel[0].users > 0 && funnel[funnel.length - 1].users > 0 && (
          <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(0,194,168,0.06)', border: `1px solid rgba(0,194,168,0.2)`, borderRadius: 6, fontSize: 12, color: D.accent }}>
            Overall conversion: {((funnel[funnel.length - 1].users / funnel[0].users) * 100).toFixed(2)}%
          </div>
        )}
      </div>

      {[
        ['ANOMALIES & OBSERVATIONS', anomalies, setAnomalies, 'What stands out? Unexpected spikes or drops? Segment differences?'],
        ['ROOT CAUSE ANALYSIS', rootCause, setRootCause, 'Why do you think this is happening? What data supports your hypothesis?'],
        ['RECOMMENDATIONS', recommendations, setRecommendations, 'Prioritised actions with expected impact...'],
      ].map(([label, value, set, placeholder]) => (
        <div key={label as string} style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
          <label style={lbl}>{label as string}</label>
          <textarea style={{ ...ta, minHeight: 80 }} value={value as string} onChange={e => (set as any)(e.target.value)} placeholder={placeholder as string} />
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Workspace shell ────────────────────────────────────────────

export default function WorkspaceDM({ task, sessionId, onComplete, initialTab }: Props) {
  const [tab, setTab] = useState(initialTab ?? 'dashboard')

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      {task.artefact_content && <ArtefactPanel task={task} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        <TaskBrief task={task} />
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        {tab === 'dashboard' && <CampaignDashboard   task={task} sessionId={sessionId} onComplete={onComplete} />}
        {tab === 'copy'      && <CopyEditor          task={task} sessionId={sessionId} onComplete={onComplete} />}
        {tab === 'abtest'    && <ABTestPlanner        task={task} sessionId={sessionId} onComplete={onComplete} />}
        {tab === 'builder'   && <CampaignBuilder      task={task} sessionId={sessionId} onComplete={onComplete} />}
        {tab === 'analytics' && <AnalyticsInterpreter task={task} sessionId={sessionId} onComplete={onComplete} />}
      </div>
    </div>
  )
}
