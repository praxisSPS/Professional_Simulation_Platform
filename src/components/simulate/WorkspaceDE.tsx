'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { TabBar, TaskBrief, SubmitBtn, ResultPanel, evalSubmit, ArtefactPanel, SubmissionModeBar, AlternateSubmitForm, SubmissionMode, inp, lbl, ta, row, col, D } from './shared'

const SQLEditor = dynamic(() => import('./SQLEditor'), { ssr: false })
const PythonEditor = dynamic(() => import('./PythonEditor'), { ssr: false })
const DiagramEditor = dynamic(() => import('./DiagramEditor'), { ssr: false })

interface Props {
  task: any
  sessionId: string
  onComplete: (result: any) => void
  initialTab?: string
  careerPath?: string
}

const TABS = [
  { id: 'sql',     label: 'SQL' },
  { id: 'python',  label: 'Python' },
  { id: 'arch',    label: 'Architecture' },
  { id: 'dq',      label: 'Data Quality' },
]

// ── Data Quality Checker ───────────────────────────────────────

interface DQColumn { name: string; nullCount: string; uniqueCount: string; dataType: string }
interface DQRule   { column: string; rule: string; action: string }

function DataQualityChecker({ task, onComplete }: Props) {
  const [tableName, setTableName] = useState('')
  const [rowCount, setRowCount] = useState('')
  const [duplicateCount, setDuplicateCount] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [columns, setColumns] = useState<DQColumn[]>([
    { name: '', nullCount: '', uniqueCount: '', dataType: 'varchar' },
  ])
  const [rules, setRules] = useState<DQRule[]>([
    { column: '', rule: 'must not be null', action: '' },
  ])
  const [anomalies, setAnomalies] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function addCol() { setColumns(c => [...c, { name: '', nullCount: '', uniqueCount: '', dataType: 'varchar' }]) }
  function removeCol(i: number) { setColumns(c => c.filter((_, idx) => idx !== i)) }
  function setColField(i: number, f: keyof DQColumn, v: string) {
    setColumns(c => c.map((col, idx) => idx === i ? { ...col, [f]: v } : col))
  }
  function addRule() { setRules(r => [...r, { column: '', rule: 'must not be null', action: '' }]) }
  function removeRule(i: number) { setRules(r => r.filter((_, idx) => idx !== i)) }
  function setRuleField(i: number, f: keyof DQRule, v: string) {
    setRules(r => r.map((rule, idx) => idx === i ? { ...rule, [f]: v } : rule))
  }

  function submit() {
    const doc = `DATA QUALITY PROFILE REPORT
============================
Table: ${tableName}
Row Count: ${rowCount}
Duplicate Rows: ${duplicateCount}
Date Range: ${dateFrom} → ${dateTo}

COLUMN PROFILING:
${columns.map(c => `  ${c.name} (${c.dataType}) — Nulls: ${c.nullCount}, Unique values: ${c.uniqueCount}`).join('\n')}

ANOMALIES / OBSERVATIONS:
${anomalies || 'None noted'}

VALIDATION RULES:
${rules.map(r => `  [${r.column}] ${r.rule} → Action: ${r.action}`).join('\n')}`

    evalSubmit({
      taskId: task.id, content: doc, language: 'data_quality_report',
      taskDescription: task.description,
      rubric: task.rubric ?? [
        'All required columns are profiled with accurate null and uniqueness counts',
        'Date range and row count are correctly identified',
        'Validation rules are appropriate and cover the most critical data quality issues',
        'Anomalies are clearly identified and explained',
      ],
      setResult, setLoading, onComplete,
    })
  }

  const s = (field: string, value: string, set: (v: string) => void) => (
    <div style={col}>
      <label style={lbl}>{field}</label>
      <input style={inp} value={value} onChange={e => set(e.target.value)} placeholder={field} />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Data Quality Profiler
      </div>

      {/* Table metadata */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 10 }}>TABLE METADATA</div>
        <div style={{ ...row, flexWrap: 'wrap' }}>
          {s('Table name', tableName, setTableName)}
          {s('Row count', rowCount, setRowCount)}
          {s('Duplicate rows', duplicateCount, setDuplicateCount)}
        </div>
        <div style={row}>
          {s('Data from (date)', dateFrom, setDateFrom)}
          {s('Data to (date)', dateTo, setDateTo)}
        </div>
      </div>

      {/* Column profiling */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>COLUMN PROFILING</div>
          <button onClick={addCol} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add column</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 28px', gap: 6, marginBottom: 6 }}>
          {['Column', 'Nulls', 'Unique', 'Type', ''].map(h => (
            <div key={h} style={{ fontSize: 10, color: D.muted, fontWeight: 600, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {columns.map((c, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 28px', gap: 6, marginBottom: 6 }}>
            <input style={inp} value={c.name} onChange={e => setColField(i, 'name', e.target.value)} placeholder="column_name" />
            <input style={inp} value={c.nullCount} onChange={e => setColField(i, 'nullCount', e.target.value)} placeholder="0" />
            <input style={inp} value={c.uniqueCount} onChange={e => setColField(i, 'uniqueCount', e.target.value)} placeholder="0" />
            <select style={{ ...inp }} value={c.dataType} onChange={e => setColField(i, 'dataType', e.target.value)}>
              {['varchar', 'integer', 'numeric', 'date', 'timestamp', 'boolean', 'uuid'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button onClick={() => removeCol(i)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14 }}>×</button>
          </div>
        ))}
      </div>

      {/* Anomalies */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: D.sub, fontWeight: 600, marginBottom: 8 }}>ANOMALIES & OBSERVATIONS</div>
        <textarea
          style={{ ...ta, minHeight: 70 }}
          value={anomalies}
          onChange={e => setAnomalies(e.target.value)}
          placeholder="Describe any anomalies, unexpected values, outliers, or data integrity concerns..."
        />
      </div>

      {/* Validation rules */}
      <div style={{ background: D.panel, border: `1px solid ${D.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: D.sub, fontWeight: 600 }}>VALIDATION RULES</div>
          <button onClick={addRule} style={{ fontSize: 11, color: D.accent, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add rule</button>
        </div>
        {rules.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 28px', gap: 6, marginBottom: 6 }}>
            <input style={inp} value={r.column} onChange={e => setRuleField(i, 'column', e.target.value)} placeholder="Column" />
            <select style={{ ...inp }} value={r.rule} onChange={e => setRuleField(i, 'rule', e.target.value)}>
              {['must not be null', 'must be unique', 'must be positive', 'must be a valid date', 'must match regex', 'must be in set', 'must be within range'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <input style={inp} value={r.action} onChange={e => setRuleField(i, 'action', e.target.value)} placeholder="Action if fails" />
            <button onClick={() => removeRule(i)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 14 }}>×</button>
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

// ── Workspace shell ────────────────────────────────────────────

export default function WorkspaceDE({ task, sessionId, onComplete, initialTab, careerPath }: Props) {
  const [tab, setTab] = useState(initialTab ?? 'sql')
  const [subMode, setSubMode] = useState<SubmissionMode>('native')

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      {task.artefact_content && <ArtefactPanel task={task} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        <TaskBrief task={task} />
        <SubmissionModeBar mode={subMode} onChange={setSubMode} />
        {subMode === 'native' ? (
          <>
            <TabBar tabs={TABS} active={tab} onChange={setTab} />
            {tab === 'sql'    && <SQLEditor task={task} sessionId={sessionId} onComplete={onComplete} />}
            {tab === 'python' && <PythonEditor task={task} sessionId={sessionId} onComplete={onComplete} />}
            {tab === 'arch'   && <DiagramEditor task={task} sessionId={sessionId} onComplete={onComplete} />}
            {tab === 'dq'     && <DataQualityChecker task={task} sessionId={sessionId} onComplete={onComplete} />}
          </>
        ) : (
          <AlternateSubmitForm mode={subMode} task={task} onComplete={onComplete} careerPath={careerPath} />
        )}
      </div>
    </div>
  )
}
