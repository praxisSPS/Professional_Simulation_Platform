'use client'

import { useState, useCallback } from 'react'
import { TabBar, TaskBrief, SubmitBtn, ResultPanel, evalSubmit, ArtefactPanel, SubmissionModeBar, AlternateSubmitForm, SubmissionMode, inp, lbl, ta, row, col, D } from './shared'

interface Props { task: any; sessionId: string; onComplete: (result: any) => void; initialTab?: string; careerPath?: string }

const TABS = [
  { id: 'model',    label: 'Spreadsheet' },
  { id: 'variance', label: 'Variance' },
  { id: 'scenario', label: 'Scenarios' },
  { id: 'deck',     label: 'Exec Summary' },
]

// ── Spreadsheet Model ─────────────────────────────────────────

const ROWS = ['Revenue', 'COGS', 'Gross Profit', 'Operating Expenses', 'EBITDA', 'Net Profit']
type CellMap = Record<string, string>

function SpreadsheetModel({ task, onComplete }: Props) {
  const [cells, setCells] = useState<CellMap>(() => {
    const c: CellMap = {}
    ROWS.forEach(r => { c[`${r}_Budget`] = ''; c[`${r}_Actual`] = '' })
    return c
  })
  const [notes, setNotes] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const set = useCallback((key: string, v: string) => {
    setCells(c => ({ ...c, [key]: v }))
  }, [])

  function num(k: string) { return parseFloat(cells[k]) || 0 }

  function getVariance(rowName: string): { gbp: string; pct: string } {
    const b = num(`${rowName}_Budget`), a = num(`${rowName}_Actual`)
    if (!b && !a) return { gbp: '', pct: '' }
    const gbp = a - b
    const pct = b !== 0 ? ((a - b) / Math.abs(b) * 100) : 0
    return { gbp: gbp.toLocaleString('en-GB', { maximumFractionDigits: 0 }), pct: pct.toFixed(1) + '%' }
  }

  function varianceColor(rowName: string, col: 'gbp' | 'pct'): string {
    const { gbp } = getVariance(rowName)
    if (!gbp) return D.sub
    const v = parseFloat(gbp.replace(/,/g, ''))
    const positive = ['Revenue', 'Gross Profit', 'EBITDA', 'Net Profit']
    const good = positive.includes(rowName) ? v > 0 : v < 0
    return good ? '#4ADE80' : '#F43F5E'
  }

  function submit() {
    const lines = ROWS.map(r => {
      const { gbp, pct } = getVariance(r)
      return `  ${r.padEnd(22)} Budget: £${cells[`${r}_Budget`] || '—'}  Actual: £${cells[`${r}_Actual`] || '—'}  Variance: £${gbp || '—'} (${pct || '—'})`
    }).join('\n')

    const doc = `FINANCIAL MODEL — P&L VARIANCE ANALYSIS
========================================
${lines}

ANALYST NOTES:
${notes || '(none provided)'}`

    evalSubmit({
      taskId: task.id, content: doc, language: 'financial_model',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Budget and actual figures are populated for all key P&L lines',
        'Variance calculations are accurate (Actual minus Budget)',
        'Gross Profit and EBITDA correctly reflect the relationship between revenue and cost lines',
        'Analyst notes identify and explain the most significant variances',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const cellStyle = { ...inp, textAlign: 'right' as const, fontFamily: 'monospace', padding: '7px 8px' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>P&L Spreadsheet Model</div>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0A0A0F', borderBottom: `1px solid ${D.border}` }}>
              <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', width: '30%' }}>Line item</th>
              <th style={{ padding: '9px 10px', textAlign: 'right', fontSize: 10, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Budget (£)</th>
              <th style={{ padding: '9px 10px', textAlign: 'right', fontSize: 10, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actual (£)</th>
              <th style={{ padding: '9px 10px', textAlign: 'right', fontSize: 10, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Variance £</th>
              <th style={{ padding: '9px 10px', textAlign: 'right', fontSize: 10, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Var %</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => {
              const isCalc = ['Gross Profit', 'EBITDA', 'Net Profit'].includes(r)
              const { gbp, pct } = getVariance(r)
              return (
                <tr key={r} style={{ borderBottom: `1px solid ${D.border}`, background: isCalc ? '#0A0A0F' : 'transparent' }}>
                  <td style={{ padding: '7px 14px', fontSize: 12, color: isCalc ? D.accent : D.text, fontWeight: isCalc ? 600 : 400 }}>
                    {isCalc && <span style={{ fontSize: 9, marginRight: 6, color: D.muted }}>AUTO</span>}
                    {r}
                  </td>
                  <td style={{ padding: '5px 6px' }}>
                    <input style={cellStyle} value={cells[`${r}_Budget`]} onChange={e => set(`${r}_Budget`, e.target.value)} placeholder="0" />
                  </td>
                  <td style={{ padding: '5px 6px' }}>
                    <input style={cellStyle} value={cells[`${r}_Actual`]} onChange={e => set(`${r}_Actual`, e.target.value)} placeholder="0" />
                  </td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', fontSize: 12, fontFamily: 'monospace', color: gbp ? varianceColor(r, 'gbp') : D.muted }}>
                    {gbp ? (parseFloat(gbp.replace(/,/g, '')) >= 0 ? '+' : '') + gbp : '—'}
                  </td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', fontSize: 12, fontFamily: 'monospace', color: pct ? varianceColor(r, 'pct') : D.muted }}>
                    {pct || '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Analyst Notes — explain the key variances</label>
        <textarea style={{ ...ta, minHeight: 80 }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Revenue exceeded budget by… driven by… The main cost variance is… because…" />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Variance Analysis Writer ───────────────────────────────────

function wordCount(s: string) { return s.trim() ? s.trim().split(/\s+/).length : 0 }

function VarianceWriter({ task, onComplete }: Props) {
  const [exec, setExec] = useState('')
  const [drivers, setDrivers] = useState([{ desc: '', amount: '' }, { desc: '', amount: '' }])
  const [assumptions, setAssumptions] = useState('')
  const [recommendations, setRecommendations] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function addDriver() { setDrivers(d => [...d, { desc: '', amount: '' }]) }
  function setDriver(i: number, f: 'desc' | 'amount', v: string) {
    setDrivers(d => d.map((x, idx) => idx === i ? { ...x, [f]: v } : x))
  }

  const wc = (s: string, max: number) => {
    const n = wordCount(s)
    return <span style={{ fontSize: 10, color: n > max ? '#F43F5E' : D.muted }}>{n}/{max} words</span>
  }

  function submit() {
    const doc = `VARIANCE ANALYSIS REPORT
=========================

EXECUTIVE SUMMARY:
${exec}

KEY DRIVERS OF VARIANCE:
${drivers.filter(d => d.desc).map(d => `• ${d.desc}${d.amount ? ` — £${d.amount}` : ''}`).join('\n')}

ASSUMPTIONS AND RISKS:
${assumptions}

RECOMMENDED ACTIONS:
${recommendations}`

    evalSubmit({
      taskId: task.id, content: doc, language: 'variance_analysis',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Executive summary is concise and states the headline finding within 100 words',
        'Key drivers are quantified with £ values and explain the variance correctly',
        'Assumptions are clearly stated and risks are identified',
        'Recommendations are specific, actionable and linked to the identified drivers',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Variance Analysis Report</div>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <label style={lbl}>Executive Summary</label>
          {wc(exec, 100)}
        </div>
        <textarea style={{ ...ta, minHeight: 90 }} value={exec} onChange={e => setExec(e.target.value)} placeholder="Summarise the overall variance position and headline finding in under 100 words…" />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={lbl}>Key Drivers of Variance</label>
          <button onClick={addDriver} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Driver</button>
        </div>
        {drivers.map((d, i) => (
          <div key={i} style={{ ...row, marginBottom: 8 }}>
            <div style={{ ...col, flex: 3 }}>
              <input style={inp} value={d.desc} onChange={e => setDriver(i, 'desc', e.target.value)} placeholder={`Driver ${i + 1} — description`} />
            </div>
            <div style={{ ...col, flex: 1 }}>
              <input style={inp} value={d.amount} onChange={e => setDriver(i, 'amount', e.target.value)} placeholder="£ amount" />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <label style={lbl}>Assumptions & Risks</label>
            {wc(assumptions, 150)}
          </div>
          <textarea style={{ ...ta, minHeight: 90 }} value={assumptions} onChange={e => setAssumptions(e.target.value)} placeholder="State key assumptions underpinning the numbers and any risks to the outlook…" />
        </div>
        <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <label style={lbl}>Recommended Actions</label>
            {wc(recommendations, 150)}
          </div>
          <textarea style={{ ...ta, minHeight: 90 }} value={recommendations} onChange={e => setRecommendations(e.target.value)} placeholder="What actions should management take based on this analysis?" />
        </div>
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Scenario Modeller ─────────────────────────────────────────

const BASE_REVENUE = 5200000  // £5.2M default base

interface Scenario { revenueGrowth: string; costInflation: string; headcount: string }

function ScenarioModeller({ task, onComplete }: Props) {
  const [baseRev, setBaseRev] = useState('5200000')
  const [baseCost, setBaseCost] = useState('3900000')
  const [scenarios, setScenarios] = useState<Record<string, Scenario>>({
    base:     { revenueGrowth: '5',  costInflation: '3',  headcount: '0'  },
    upside:   { revenueGrowth: '15', costInflation: '3',  headcount: '5'  },
    downside: { revenueGrowth: '-5', costInflation: '8',  headcount: '-10' },
  })
  const [commentary, setCommentary] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function setField(sc: string, f: keyof Scenario, v: string) {
    setScenarios(s => ({ ...s, [sc]: { ...s[sc], [f]: v } }))
  }

  function calcPL(sc: Scenario) {
    const rev = parseFloat(baseRev) || BASE_REVENUE
    const cost = parseFloat(baseCost) || 3900000
    const rg = parseFloat(sc.revenueGrowth) || 0
    const ci = parseFloat(sc.costInflation) || 0
    const newRev = rev * (1 + rg / 100)
    const newCost = cost * (1 + ci / 100)
    const ebitda = newRev - newCost
    return { revenue: newRev, cost: newCost, ebitda, margin: newRev > 0 ? (ebitda / newRev * 100) : 0 }
  }

  function fmt(n: number) { return (n / 1000000).toFixed(2) + 'M' }

  function submit() {
    const sc = Object.entries(scenarios).map(([name, s]) => {
      const pl = calcPL(s)
      return `${name.toUpperCase()} CASE:
  Revenue growth: ${s.revenueGrowth}% | Cost inflation: ${s.costInflation}% | Headcount: ${s.headcount}%
  Revenue: £${fmt(pl.revenue)} | Costs: £${fmt(pl.cost)} | EBITDA: £${fmt(pl.ebitda)} (${pl.margin.toFixed(1)}% margin)`
    }).join('\n\n')

    // Sensitivity: ±5% and ±10% on revenue vs base EBITDA
    const baseEBITDA = calcPL(scenarios.base).ebitda
    const sensitivity = [-10, -5, 5, 10].map(delta => {
      const adjRev = (parseFloat(baseRev) || BASE_REVENUE) * (1 + delta / 100)
      const adjEBITDA = adjRev - (parseFloat(baseCost) || 3900000) * (1 + parseFloat(scenarios.base.costInflation) / 100)
      return `  Revenue ${delta > 0 ? '+' : ''}${delta}%: EBITDA £${fmt(adjEBITDA)} (${delta > 0 ? '+' : ''}${fmt(adjEBITDA - baseEBITDA)} vs base)`
    }).join('\n')

    const doc = `THREE-SCENARIO FINANCIAL MODEL
================================
Base Revenue: £${fmt(parseFloat(baseRev) || BASE_REVENUE)} | Base Costs: £${fmt(parseFloat(baseCost) || 3900000)}

SCENARIO OUTPUTS:
${sc}

REVENUE SENSITIVITY (vs Base EBITDA):
${sensitivity}

COMMENTARY:
${commentary || '(none provided)'}`

    evalSubmit({
      taskId: task.id, content: doc, language: 'scenario_model',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'The three scenarios are clearly differentiated with distinct assumptions',
        'Base case assumptions are reasonable and grounded in the task context',
        'Upside and downside scenarios represent realistic but stretching outcomes',
        'Commentary explains the key risks and which scenario is most likely',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const scenarioColors: Record<string, string> = { base: '#7C3AED', upside: '#16A34A', downside: '#F43F5E' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Three-Scenario Financial Model</div>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '12px 14px' }}>
          <label style={lbl}>Base Revenue (£)</label>
          <input style={inp} value={baseRev} onChange={e => setBaseRev(e.target.value)} placeholder="5200000" />
        </div>
        <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '12px 14px' }}>
          <label style={lbl}>Base Operating Costs (£)</label>
          <input style={inp} value={baseCost} onChange={e => setBaseCost(e.target.value)} placeholder="3900000" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {Object.entries(scenarios).map(([name, s]) => {
          const pl = calcPL(s)
          const c = scenarioColors[name]
          return (
            <div key={name} style={{ background: D.panel, border: `1px solid ${c}40`, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', background: `${c}15`, borderBottom: `1px solid ${c}40` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: c, textTransform: 'capitalize' }}>{name} Case</div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ marginBottom: 8 }}>
                  <label style={lbl}>Revenue growth (%)</label>
                  <input style={inp} value={s.revenueGrowth} onChange={e => setField(name, 'revenueGrowth', e.target.value)} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={lbl}>Cost inflation (%)</label>
                  <input style={inp} value={s.costInflation} onChange={e => setField(name, 'costInflation', e.target.value)} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={lbl}>Headcount change (%)</label>
                  <input style={inp} value={s.headcount} onChange={e => setField(name, 'headcount', e.target.value)} />
                </div>
                <div style={{ borderTop: `1px solid ${D.border}`, paddingTop: 10 }}>
                  <div style={{ fontSize: 10, color: D.sub, marginBottom: 4 }}>PROJECTED P&L</div>
                  <div style={{ fontSize: 11, color: D.text }}>Rev: £{fmt(pl.revenue)}</div>
                  <div style={{ fontSize: 11, color: D.text }}>Cost: £{fmt(pl.cost)}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: pl.ebitda >= 0 ? '#4ADE80' : '#F43F5E', marginTop: 4 }}>
                    EBITDA: £{fmt(pl.ebitda)}
                  </div>
                  <div style={{ fontSize: 10, color: D.sub }}>Margin: {pl.margin.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Commentary — key risks, most likely scenario, assumptions</label>
        <textarea style={{ ...ta, minHeight: 70 }} value={commentary} onChange={e => setCommentary(e.target.value)} placeholder="The base case assumes… The most significant risk is… The upside scenario would require…" />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Presentation / Exec Summary Builder ───────────────────────

function PresentationBuilder({ task, onComplete }: Props) {
  const LIMITS = { headline: 100, rec: 180, risk: 120 }
  const [headline, setHeadline] = useState('')
  const [drivers, setDrivers] = useState([{ desc: '', amount: '' }, { desc: '', amount: '' }, { desc: '', amount: '' }])
  const [recommendation, setRecommendation] = useState('')
  const [risk, setRisk] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function setDriver(i: number, f: 'desc' | 'amount', v: string) {
    setDrivers(d => d.map((x, idx) => idx === i ? { ...x, [f]: v } : x))
  }

  function charCount(s: string, max: number) {
    return <span style={{ fontSize: 10, color: s.length > max ? '#F43F5E' : D.muted }}>{s.length}/{max}</span>
  }

  function submit() {
    const doc = `BOARD-LEVEL EXECUTIVE SUMMARY
==============================

HEADLINE FINDING:
${headline}

TOP 3 DRIVERS:
${drivers.filter(d => d.desc).map((d, i) => `${i + 1}. ${d.desc}${d.amount ? ` (£${d.amount})` : ''}`).join('\n')}

RECOMMENDATION:
${recommendation}

RISK / CAVEAT:
${risk}`

    evalSubmit({
      taskId: task.id, content: doc, language: 'exec_presentation',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Headline finding is clear, specific and quantified where possible',
        'Top 3 drivers are the most significant ones with accurate £ values',
        'Recommendation is specific and actionable at board level',
        'Risk/caveat is honest and relevant to the recommendation',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Board Executive Summary</div>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>

      <div style={{ background: D.panel, border: `1px solid #7C3AED40`, borderRadius: 8, padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <label style={{ ...lbl, color: '#7C3AED' }}>Headline Finding</label>
          {charCount(headline, LIMITS.headline)}
        </div>
        <input style={{ ...inp, fontSize: 14, fontWeight: 500 }} value={headline} onChange={e => setHeadline(e.target.value)} placeholder="The headline number and what it means for the business…" maxLength={LIMITS.headline} />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Top 3 Drivers (with £ values)</label>
        {drivers.map((d, i) => (
          <div key={i} style={{ ...row, marginBottom: 8 }}>
            <div style={{ ...col, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#7C3AED', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            </div>
            <div style={{ ...col, flex: 4 }}>
              <input style={inp} value={d.desc} onChange={e => setDriver(i, 'desc', e.target.value)} placeholder="Driver description" />
            </div>
            <div style={{ ...col, flex: 1 }}>
              <input style={inp} value={d.amount} onChange={e => setDriver(i, 'amount', e.target.value)} placeholder="£ value" />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <label style={lbl}>Recommendation</label>
            {charCount(recommendation, LIMITS.rec)}
          </div>
          <textarea style={{ ...ta, minHeight: 90 }} value={recommendation} onChange={e => setRecommendation(e.target.value)} placeholder="What the board should do and why…" maxLength={LIMITS.rec} />
        </div>
        <div style={{ background: D.panel, border: `1px solid #F59E0B40`, borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <label style={{ ...lbl, color: '#F59E0B' }}>Risk / Caveat</label>
            {charCount(risk, LIMITS.risk)}
          </div>
          <textarea style={{ ...ta, minHeight: 90, borderColor: '#F59E0B40' }} value={risk} onChange={e => setRisk(e.target.value)} placeholder="What could make this wrong or create risk…" maxLength={LIMITS.risk} />
        </div>
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Workspace shell ────────────────────────────────────────────

export default function WorkspaceFA({ task, sessionId, onComplete, initialTab, careerPath }: Props) {
  const [tab, setTab] = useState(initialTab ?? 'model')
  const [subMode, setSubMode] = useState<SubmissionMode>('native')
  const props = { task, sessionId, onComplete }

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      {task.artefact_content && <ArtefactPanel task={task} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        <TaskBrief task={task} />
        <SubmissionModeBar mode={subMode} onChange={setSubMode} />
        {subMode === 'native' ? (
          <>
            <TabBar tabs={TABS} active={tab} onChange={setTab} />
            {tab === 'model'    && <SpreadsheetModel {...props} />}
            {tab === 'variance' && <VarianceWriter {...props} />}
            {tab === 'scenario' && <ScenarioModeller {...props} />}
            {tab === 'deck'     && <PresentationBuilder {...props} />}
          </>
        ) : (
          <AlternateSubmitForm mode={subMode} task={task} onComplete={onComplete} careerPath={careerPath} />
        )}
      </div>
    </div>
  )
}
