'use client'

import { useState } from 'react'
import { TabBar, TaskBrief, SubmitBtn, ResultPanel, evalSubmit, ArtefactPanel, SubmissionModeBar, AlternateSubmitForm, SubmissionMode, inp, lbl, ta, row, col, D } from './shared'

interface Props { task: any; sessionId: string; onComplete: (result: any) => void; initialTab?: string; careerPath?: string }

const TABS = [
  { id: 'rca',    label: 'RCA' },
  { id: 'fmea',   label: 'FMEA' },
  { id: 'sop',    label: 'SOP' },
  { id: 'cmms',   label: 'CMMS' },
  { id: 'shift',  label: 'Shift Report' },
]

// ── RCA Workbench ──────────────────────────────────────────────

function RCAWorkbench({ task, onComplete }: Props) {
  const [problem, setProblem] = useState(task.description || '')
  const [whys, setWhys] = useState(['', '', '', '', ''])
  const [fishbone, setFishbone] = useState({
    Man: '', Machine: '', Method: '', Material: '', Measurement: '', Environment: '',
  })
  const [rootCause, setRootCause] = useState('')
  const [corrective, setCorrective] = useState('')
  const [preventive, setPreventive] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function setWhy(i: number, v: string) { setWhys(w => w.map((x, idx) => idx === i ? v : x)) }
  function setFish(k: string, v: string) { setFishbone(f => ({ ...f, [k]: v })) }

  function submit() {
    const doc = `ROOT CAUSE ANALYSIS REPORT
===========================
Problem Statement:
${problem}

5 WHY ANALYSIS:
${whys.map((w, i) => `  Why ${i + 1}: ${w || '(not completed)'}`).join('\n')}

FISHBONE (ISHIKAWA) ANALYSIS:
${Object.entries(fishbone).map(([k, v]) => `  ${k}: ${v || '—'}`).join('\n')}

ROOT CAUSE CONCLUSION:
${rootCause || '(not stated)'}

CORRECTIVE ACTION:
${corrective || '(not stated)'}

PREVENTIVE ACTION:
${preventive || '(not stated)'}`

    evalSubmit({
      taskId: task.id, content: doc, language: 'rca_report',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'The 5 Why chain follows a logical causal sequence with no gaps',
        'Fishbone categories cover the relevant contributing factors',
        'Root cause conclusion follows logically from the analysis',
        'Corrective action addresses the root cause directly',
        'Preventive action will stop recurrence',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Root Cause Analysis Workbench</div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Problem Statement</label>
        <textarea style={{ ...ta, minHeight: 64 }} value={problem} onChange={e => setProblem(e.target.value)} />
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>5 WHY ANALYSIS</div>
        {whys.map((w, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <label style={{ ...lbl, color: i === 0 ? D.accent : D.sub }}>Why {i + 1}{i === 0 ? ' — Why did the problem occur?' : ''}</label>
            <input style={inp} value={w} onChange={e => setWhy(i, e.target.value)} placeholder={`Root driver at level ${i + 1}…`} />
          </div>
        ))}
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>FISHBONE (ISHIKAWA) DIAGRAM</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {Object.keys(fishbone).map(k => (
            <div key={k}>
              <label style={lbl}>{k}</label>
              <input style={inp} value={(fishbone as any)[k]} onChange={e => setFish(k, e.target.value)} placeholder={`Contributing factors — ${k.toLowerCase()}…`} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{ ...lbl, color: '#F59E0B' }}>Root Cause Conclusion</label>
            <textarea style={{ ...ta, borderColor: '#F59E0B40' }} value={rootCause} onChange={e => setRootCause(e.target.value)} placeholder="State the confirmed root cause…" />
          </div>
          <div style={row}>
            <div style={col}>
              <label style={lbl}>Corrective Action (immediate fix)</label>
              <textarea style={ta} value={corrective} onChange={e => setCorrective(e.target.value)} placeholder="What will you do to fix this now?" />
            </div>
            <div style={col}>
              <label style={lbl}>Preventive Action (stop recurrence)</label>
              <textarea style={ta} value={preventive} onChange={e => setPreventive(e.target.value)} placeholder="What will you do to prevent this happening again?" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── FMEA Tool ─────────────────────────────────────────────────

interface FMEARow {
  id: number; component: string; fn: string; failureMode: string
  effect: string; sev: string; occ: string; det: string; action: string
}

function rpn(r: FMEARow) {
  const s = parseInt(r.sev) || 0, o = parseInt(r.occ) || 0, d = parseInt(r.det) || 0
  return s * o * d
}

function FMEATool({ task, onComplete }: Props) {
  const [rows, setRows] = useState<FMEARow[]>([
    { id: 1, component: '', fn: '', failureMode: '', effect: '', sev: '', occ: '', det: '', action: '' },
  ])
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  let seq = rows.length + 1

  function addRow() {
    setRows(r => [...r, { id: seq++, component: '', fn: '', failureMode: '', effect: '', sev: '', occ: '', det: '', action: '' }])
  }
  function removeRow(id: number) { setRows(r => r.filter(x => x.id !== id)) }
  function setField(id: number, f: keyof FMEARow, v: string) {
    setRows(r => r.map(x => x.id === id ? { ...x, [f]: v } : x))
  }

  function submit() {
    const doc = `FAILURE MODE AND EFFECTS ANALYSIS (FMEA)
==========================================
${rows.map(r => {
  const v = rpn(r)
  return `Component: ${r.component}
  Function: ${r.fn}
  Failure Mode: ${r.failureMode}
  Effect: ${r.effect}
  Severity: ${r.sev}/10  Occurrence: ${r.occ}/10  Detection: ${r.det}/10  RPN: ${v}
  Recommended Action: ${r.action}`
}).join('\n\n')}`

    evalSubmit({
      taskId: task.id, content: doc, language: 'fmea',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Severity, occurrence and detection scores are justified and calibrated appropriately',
        'High RPN items (>100) have specific, actionable recommended actions',
        'All critical failure modes for the equipment are identified',
        'Effects are stated in terms of impact on production and safety',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const numInp = (id: number, f: keyof FMEARow, v: string) => (
    <input
      style={{ ...inp, width: 44, textAlign: 'center', padding: '7px 4px' }}
      value={v} maxLength={2}
      onChange={e => setField(id, f, e.target.value)}
      placeholder="1-10"
    />
  )

  const rpnColor = (v: number) => v >= 100 ? '#F43F5E' : v >= 50 ? '#F59E0B' : '#4ADE80'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>FMEA — Failure Mode & Effects Analysis</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={addRow} style={{ fontSize: 11, color: D.accent, background: 'none', border: `1px solid ${D.border}`, borderRadius: 5, padding: '4px 12px', cursor: 'pointer' }}>+ Row</button>
          <SubmitBtn onClick={submit} loading={loading} />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, fontSize: 10, color: D.sub }}>
        {[['RPN > 100', '#F43F5E', 'High risk'], ['RPN 50–100', '#F59E0B', 'Medium'], ['RPN < 50', '#4ADE80', 'Acceptable']].map(([l, c, v]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c as string }} />
            <span>{l} — {v}</span>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${D.border}` }}>
              {['Component', 'Function', 'Failure Mode', 'Effect', 'SEV', 'OCC', 'DET', 'RPN', 'Action', ''].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const v = rpn(r)
              return (
                <tr key={r.id} style={{ borderBottom: `1px solid ${D.border}` }}>
                  {(['component', 'fn', 'failureMode', 'effect'] as const).map(f => (
                    <td key={f} style={{ padding: '5px 4px' }}>
                      <input style={{ ...inp, minWidth: 90 }} value={r[f]} onChange={e => setField(r.id, f, e.target.value)} />
                    </td>
                  ))}
                  <td style={{ padding: '5px 4px' }}>{numInp(r.id, 'sev', r.sev)}</td>
                  <td style={{ padding: '5px 4px' }}>{numInp(r.id, 'occ', r.occ)}</td>
                  <td style={{ padding: '5px 4px' }}>{numInp(r.id, 'det', r.det)}</td>
                  <td style={{ padding: '5px 8px', fontWeight: 700, color: rpnColor(v), fontSize: 13 }}>{v || '—'}</td>
                  <td style={{ padding: '5px 4px' }}>
                    <input style={{ ...inp, minWidth: 120 }} value={r.action} onChange={e => setField(r.id, 'action', e.target.value)} placeholder="Recommended action" />
                  </td>
                  <td style={{ padding: '5px 4px' }}>
                    <button onClick={() => removeRow(r.id)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14 }}>×</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── SOP Builder ────────────────────────────────────────────────

interface SOPStep { action: string; responsible: string; time: string }

function SOPBuilder({ task, onComplete }: Props) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const [sopNum] = useState(`SOP-RE-${today}-001`)
  const [purpose, setPurpose] = useState('')
  const [scope, setScope] = useState('')
  const [ppe, setPpe] = useState('Safety glasses, gloves, steel-toe boots')
  const [coshh, setCoshh] = useState('')
  const [steps, setSteps] = useState<SOPStep[]>([{ action: '', responsible: '', time: '' }])
  const [preparedBy, setPreparedBy] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function addStep() { setSteps(s => [...s, { action: '', responsible: '', time: '' }]) }
  function removeStep(i: number) { setSteps(s => s.filter((_, idx) => idx !== i)) }
  function setStep(i: number, f: keyof SOPStep, v: string) {
    setSteps(s => s.map((x, idx) => idx === i ? { ...x, [f]: v } : x))
  }

  function submit() {
    const doc = `STANDARD OPERATING PROCEDURE
SOP Number: ${sopNum}
Date: ${new Date().toLocaleDateString('en-GB')}
Prepared by: ${preparedBy}

PURPOSE:
${purpose}

SCOPE:
${scope}

SAFETY REQUIREMENTS:
PPE Required: ${ppe}
COSHH Considerations: ${coshh || 'None identified'}
Regulatory references: PUWER 1998, COSHH 2002

PROCEDURE STEPS:
${steps.map((s, i) => `  Step ${i + 1}: ${s.action}
    Responsible: ${s.responsible || 'Technician'}
    Time estimate: ${s.time || 'TBC'}`).join('\n')}

SIGN-OFF:
Prepared by: ${preparedBy} | Reviewed by: ____________ | Approved by: ____________`

    evalSubmit({
      taskId: task.id, content: doc, language: 'sop_document',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'All safety requirements are identified including PPE, COSHH and regulatory references',
        'Steps are clear, sequential and actionable with no ambiguity',
        'Each step has an appropriate responsible person and time estimate',
        'The SOP covers the complete scope of the maintenance task',
      ],
      setResult, setLoading, onComplete,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>SOP Builder</div>
        <div style={{ fontSize: 12, color: D.accent, fontFamily: 'monospace' }}>{sopNum}</div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><label style={lbl}>Purpose</label><textarea style={ta} value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Why this procedure exists…" /></div>
          <div><label style={lbl}>Scope</label><textarea style={ta} value={scope} onChange={e => setScope(e.target.value)} placeholder="What equipment/processes this covers…" /></div>
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid #F43F5E40`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: '#F43F5E', fontWeight: 600, marginBottom: 10 }}>⚠ SAFETY REQUIREMENTS</div>
        <div style={row}>
          <div style={col}><label style={lbl}>PPE Required</label><input style={inp} value={ppe} onChange={e => setPpe(e.target.value)} /></div>
          <div style={col}><label style={lbl}>COSHH / Chemical Hazards</label><input style={inp} value={coshh} onChange={e => setCoshh(e.target.value)} placeholder="Lubricants, solvents, etc." /></div>
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>PROCEDURE STEPS</div>
          <button onClick={addStep} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Step</button>
        </div>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 120px 80px 28px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: D.accent, fontWeight: 700, textAlign: 'center' }}>{i + 1}</div>
            <input style={inp} value={s.action} onChange={e => setStep(i, 'action', e.target.value)} placeholder="Action to perform…" />
            <input style={inp} value={s.responsible} onChange={e => setStep(i, 'responsible', e.target.value)} placeholder="Responsible" />
            <input style={inp} value={s.time} onChange={e => setStep(i, 'time', e.target.value)} placeholder="Time" />
            <button onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14 }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <label style={lbl}>Prepared By</label>
        <input style={inp} value={preparedBy} onChange={e => setPreparedBy(e.target.value)} placeholder="Your name and title" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Mini CMMS ─────────────────────────────────────────────────

const ASSETS = [
  { id: 'CV3-L2', name: 'Conveyor 3, Line 2', criticality: 'A', lastPM: '2024-11-15', nextPM: '2025-02-15', status: 'FAULT' },
  { id: 'PA1',    name: 'Pasteuriser 1',       criticality: 'A', lastPM: '2024-10-01', nextPM: '2025-01-01', status: 'OVERDUE' },
  { id: 'CP2',    name: 'Compressor 2',         criticality: 'B', lastPM: '2024-12-01', nextPM: '2025-03-01', status: 'MONITOR' },
  { id: 'BLR',    name: 'Boiler Room',           criticality: 'A', lastPM: '2024-11-01', nextPM: '2025-02-01', status: 'OK' },
]

const BOMS: Record<string, string[]> = {
  'CV3-L2': ['Main drive bearing 6215-2RS', 'Drive belt B-type 1250mm', 'Coupling spider element', 'Gearbox oil ISO VG 220'],
  'PA1':    ['Seal kit PA1-SK-2024', 'Temperature probe PT100', 'CIP valve actuator', 'Cleaning agent TEGO 51'],
  'CP2':    ['Shaft seal set CP2-SS', 'Oil filter CF-100', 'Pressure relief valve 8bar', 'Compressor oil 46 ISO'],
  'BLR':    ['Boiler gasket set', 'Water treatment chemical', 'Pressure gauge 0-10bar', 'Blow-down valve'],
}

interface WorkOrder { id: number; woNum: string; type: string; desc: string; priority: string; assignedTo: string; hours: string; parts: string }

function MiniCMMS({ task, onComplete }: Props) {
  const [selectedAsset, setSelectedAsset] = useState('CV3-L2')
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [wo, setWo] = useState({ type: 'corrective', desc: '', priority: 'high', assignedTo: '', hours: '', parts: '' })
  const [showBOM, setShowBOM] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function addWO() {
    const woNum = `WO-${Date.now().toString().slice(-6)}`
    setWorkOrders(w => [...w, { id: Date.now(), woNum, ...wo }])
    setWo({ type: 'corrective', desc: '', priority: 'high', assignedTo: '', hours: '', parts: '' })
  }

  function submit() {
    const asset = ASSETS.find(a => a.id === selectedAsset)!
    const doc = `CMMS — MAINTENANCE WORK ORDERS
================================
Asset: ${asset.name} (${asset.id})
Criticality: ${asset.criticality} | Status: ${asset.status}
Last PM: ${asset.lastPM} | Next PM Due: ${asset.nextPM}

WORK ORDERS RAISED:
${workOrders.length === 0 ? '(No work orders created)' : workOrders.map(w =>
  `  WO# ${w.woNum}
   Type: ${w.type} | Priority: ${w.priority}
   Description: ${w.desc}
   Assigned to: ${w.assignedTo} | Est. hours: ${w.hours}h
   Spare parts: ${w.parts}`).join('\n\n')}`

    evalSubmit({
      taskId: task.id, content: doc, language: 'cmms_work_order',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'Work order priority is appropriate for the asset criticality and fault severity',
        'Description is clear and specific enough for a technician to act on',
        'Correct spare parts are identified for the work type',
        'Estimated hours are realistic for the scope of work',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const asset = ASSETS.find(a => a.id === selectedAsset)!
  const statusColor = (s: string) => s === 'FAULT' ? '#F43F5E' : s === 'OVERDUE' ? '#F59E0B' : s === 'MONITOR' ? '#7C3AED' : '#4ADE80'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Mini CMMS — Computerised Maintenance Management</div>

      {/* Asset hierarchy */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>ASSET REGISTER — Site › Production › Line 2</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {ASSETS.map(a => (
            <div
              key={a.id}
              onClick={() => setSelectedAsset(a.id)}
              style={{
                padding: '10px 12px', borderRadius: 7, cursor: 'pointer',
                border: `1px solid ${selectedAsset === a.id ? D.accent : D.border}`,
                background: selectedAsset === a.id ? 'rgba(0,194,168,0.06)' : '#0A0A0F',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: selectedAsset === a.id ? D.accent : D.text, marginBottom: 3 }}>{a.name}</div>
              <div style={{ fontSize: 10, color: D.muted }}>ID: {a.id} · Crit: {a.criticality}</div>
              <div style={{ fontSize: 10, marginTop: 3 }}>
                <span style={{ color: statusColor(a.status), fontWeight: 600 }}>{a.status}</span>
                <span style={{ color: D.muted }}> · PM due {a.nextPM}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOM viewer */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showBOM ? 10 : 0 }}>
          <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>BOM — {asset.name}</div>
          <button onClick={() => setShowBOM(!showBOM)} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>
            {showBOM ? 'Hide' : 'Show spare parts'}
          </button>
        </div>
        {showBOM && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(BOMS[selectedAsset] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: D.sub, padding: '4px 8px', background: '#0A0A0F', borderRadius: 4 }}>📦 {p}</div>
            ))}
          </div>
        )}
      </div>

      {/* Create work order */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>CREATE WORK ORDER</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div>
            <label style={lbl}>Type</label>
            <select style={{ ...inp }} value={wo.type} onChange={e => setWo(w => ({ ...w, type: e.target.value }))}>
              <option value="corrective">Corrective</option>
              <option value="preventive">Preventive</option>
              <option value="predictive">Predictive</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Priority</label>
            <select style={{ ...inp }} value={wo.priority} onChange={e => setWo(w => ({ ...w, priority: e.target.value }))}>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Assigned To</label>
            <input style={inp} value={wo.assignedTo} onChange={e => setWo(w => ({ ...w, assignedTo: e.target.value }))} placeholder="Technician name" />
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Description</label>
          <textarea style={{ ...ta, minHeight: 60 }} value={wo.desc} onChange={e => setWo(w => ({ ...w, desc: e.target.value }))} placeholder="Describe the work to be carried out…" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8, marginBottom: 10 }}>
          <div><label style={lbl}>Est. Hours</label><input style={inp} value={wo.hours} onChange={e => setWo(w => ({ ...w, hours: e.target.value }))} placeholder="e.g. 2.5" /></div>
          <div><label style={lbl}>Spare Parts Required</label><input style={inp} value={wo.parts} onChange={e => setWo(w => ({ ...w, parts: e.target.value }))} placeholder="List required parts from BOM above" /></div>
        </div>
        <button onClick={addWO} style={{ padding: '6px 16px', background: '#1E2535', color: D.accent, border: `1px solid ${D.border}`, borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          Create Work Order
        </button>
      </div>

      {workOrders.length > 0 && (
        <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '12px 16px' }}>
          <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 8 }}>WORK ORDERS ({workOrders.length})</div>
          {workOrders.map(w => (
            <div key={w.id} style={{ padding: '8px 10px', background: '#0A0A0F', borderRadius: 6, marginBottom: 6, fontSize: 11, color: D.sub }}>
              <span style={{ color: D.accent, fontFamily: 'monospace' }}>{w.woNum}</span>
              {' · '}<span style={{ color: D.text }}>{w.type}</span>
              {' · '}{w.priority}
              {' — '}{w.desc.slice(0, 60)}{w.desc.length > 60 ? '…' : ''}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubmitBtn onClick={submit} loading={loading} />
      </div>
      <ResultPanel result={result} />
    </div>
  )
}

// ── Shift Report ───────────────────────────────────────────────

function ShiftReport({ task, onComplete }: Props) {
  const statusOpts = ['OK', 'FAULT', 'MONITORING', 'SHUTDOWN', 'PM DUE']
  const [equipStatus, setEquipStatus] = useState<Record<string, string>>({
    'Conveyor 3, Line 2': 'FAULT',
    'Pasteuriser 1': 'PM DUE',
    'Compressor 2': 'MONITORING',
    'Boiler Room': 'OK',
  })
  const [completed, setCompleted] = useState('')
  const [outstanding, setOutstanding] = useState('')
  const [safety, setSafety] = useState('')
  const [actions, setActions] = useState('')
  const [shiftEnd, setShiftEnd] = useState('14:00')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function submit() {
    const doc = `SHIFT HANDOVER REPORT
=====================
Shift End: ${shiftEnd} — ${new Date().toLocaleDateString('en-GB')}

EQUIPMENT STATUS SUMMARY:
${Object.entries(equipStatus).map(([asset, status]) => `  ${asset}: ${status}`).join('\n')}

WORK COMPLETED THIS SHIFT:
${completed || '(none recorded)'}

OUTSTANDING WORK:
${outstanding || '(none)'}

SAFETY OBSERVATIONS:
${safety || '(none)'}

ACTIONS FOR NEXT SHIFT:
${actions || '(none)'}`

    evalSubmit({
      taskId: task.id, content: doc, language: 'shift_handover',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'All assets are accounted for with accurate status',
        'Work completed section is specific with times and outcomes',
        'Outstanding work is clearly described with enough detail for the incoming shift',
        'Safety observations are documented with actions assigned',
        'Actions for next shift are specific and prioritised',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const sc = (s: string) => ({ OK: '#4ADE80', FAULT: '#F43F5E', MONITORING: '#7C3AED', SHUTDOWN: '#94A3B8', 'PM DUE': '#F59E0B' } as any)[s] || D.sub

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Shift Handover Report</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ ...lbl, margin: 0 }}>Shift end:</label>
          <input style={{ ...inp, width: 80 }} type="time" value={shiftEnd} onChange={e => setShiftEnd(e.target.value)} />
        </div>
      </div>

      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>EQUIPMENT STATUS</div>
        {Object.keys(equipStatus).map(asset => (
          <div key={asset} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: D.text }}>{asset}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {statusOpts.map(s => (
                <button
                  key={s}
                  onClick={() => setEquipStatus(e => ({ ...e, [asset]: s }))}
                  style={{
                    padding: '3px 8px', border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    cursor: 'pointer',
                    background: equipStatus[asset] === s ? sc(s) + '33' : '#1E2535',
                    color: equipStatus[asset] === s ? sc(s) : D.muted,
                    outline: equipStatus[asset] === s ? `1px solid ${sc(s)}` : 'none',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {[
        ['Work completed this shift', completed, setCompleted, 'Describe tasks completed, times, and outcomes…'],
        ['Outstanding work', outstanding, setOutstanding, 'List what was not completed and why…'],
        ['Safety observations', safety, setSafety, 'Near-misses, hazards identified, actions taken…'],
        ['Actions for next shift', actions, setActions, 'Specific tasks the incoming shift must action…'],
      ].map(([label, val, set, placeholder]) => (
        <div key={label as string} style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
          <label style={lbl}>{label as string}</label>
          <textarea
            style={{ ...ta, minHeight: 80, borderColor: label === 'Safety observations' ? '#F43F5E40' : D.border }}
            value={val as string}
            onChange={e => (set as (v: string) => void)(e.target.value)}
            placeholder={placeholder as string}
          />
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

export default function WorkspaceRE({ task, sessionId, onComplete, initialTab, careerPath }: Props) {
  const [tab, setTab] = useState(initialTab ?? 'rca')
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
            {tab === 'rca'   && <RCAWorkbench {...props} />}
            {tab === 'fmea'  && <FMEATool {...props} />}
            {tab === 'sop'   && <SOPBuilder {...props} />}
            {tab === 'cmms'  && <MiniCMMS {...props} />}
            {tab === 'shift' && <ShiftReport {...props} />}
          </>
        ) : (
          <AlternateSubmitForm mode={subMode} task={task} onComplete={onComplete} careerPath={careerPath} />
        )}
      </div>
    </div>
  )
}
