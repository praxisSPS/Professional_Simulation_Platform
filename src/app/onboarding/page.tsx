'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type CustomerType = 'individual' | 'organisation' | 'university' | 'recruitment'

const CAREER_PATHS = [
  { id: 'data_engineering',   label: 'Data & AI Engineering',      icon: 'DE', desc: 'SQL, pipelines, stakeholder reporting, data storytelling',          color: '#1F4E79', bg: '#EBF3FB' },
  { id: 'product_management', label: 'Product Management',         icon: 'PM', desc: 'Roadmaps, sprint planning, stakeholder management, prioritisation', color: '#166534', bg: '#DCFCE7' },
  { id: 'project_management', label: 'Project Management',         icon: 'PJ', desc: 'Scope control, risk tracking, timelines, client communication',     color: '#7C3AED', bg: '#EEEDFE' },
  { id: 'digital_marketing',  label: 'Digital Marketing & Growth', icon: 'DM', desc: 'Campaign analysis, channel optimisation, performance reporting',     color: '#854D0E', bg: '#FEF9C3' },
  { id: 'financial_analysis', label: 'Financial Analysis',         icon: 'FA', desc: 'Variance analysis, modelling, FP&A, high-stakes decisions',         color: '#991B1B', bg: '#FEE2E2' },
]

const SENIORITY_LEVELS = [
  { id: 'intern',         label: 'Intern',          desc: 'First professional experience, learning fundamentals',   level: 1 },
  { id: 'junior',         label: 'Junior',           desc: '0–2 years, building core skills',                       level: 2 },
  { id: 'intermediate',   label: 'Intermediate',     desc: '2–5 years, working independently on complex tasks',      level: 3 },
  { id: 'manager',        label: 'Manager',          desc: '5–8 years, leading teams and projects',                 level: 4 },
  { id: 'senior_manager', label: 'Senior Manager',   desc: '8–12 years, cross-functional leadership',               level: 5 },
  { id: 'executive',      label: 'Executive / VP',   desc: '12+ years, strategic ownership and P&L responsibility', level: 6 },
  { id: 'c_suite',        label: 'C-Suite',          desc: 'Board-level leadership and organisational strategy',     level: 7 },
]

const SENIORITY_MAP: Record<string, number> = {
  intern: 1, junior: 2, intermediate: 3, manager: 4, senior_manager: 5, executive: 6, c_suite: 7
}

const QUESTIONS: Record<string, any[]> = {
  data_engineering: [
    { id:'de1', type:'mcq', q:'A stakeholder asks you to pull numbers from the database for a board meeting in 2 hours. You notice data inconsistencies. What do you do?', opts:[{l:'Pull what you can and send it, noting it is unverified',v:'a',p:2},{l:'Flag the inconsistencies immediately and agree a realistic scope for 2 hours',v:'b',p:4},{l:'Spend the full 2 hours cleaning the data before sending anything',v:'c',p:1},{l:'Tell them it cannot be done in 2 hours',v:'d',p:0}] },
    { id:'de2', type:'mcq', q:'Which best describes a data pipeline?', opts:[{l:'A chart showing data flow between departments',v:'a',p:0},{l:'An automated sequence that extracts, transforms and loads data between systems',v:'b',p:4},{l:'A database schema design document',v:'c',p:1},{l:'A real-time KPI dashboard',v:'d',p:1}] },
    { id:'de3', type:'scenario', q:'Scenario: Your pipeline fails at 3am Monday. Your manager asks at 7am why the weekly report is missing. Another team changed the schema with no notice. How do you respond?', opts:[{l:'Apologise and say you are investigating, without mentioning the other team',v:'a',p:2},{l:'Explain what failed, why, what you are doing to fix it, and a realistic ETA — without blaming anyone',v:'b',p:4},{l:'Tell your manager the other team broke it',v:'c',p:0},{l:'Fix it silently and send the report without explanation',v:'d',p:1}] },
  ],
  product_management: [
    { id:'pm1', type:'mcq', q:'A developer estimates a feature takes 3 weeks. Sales has promised it in 1 week. What is your first action?', opts:[{l:'Tell the developer to work faster',v:'a',p:0},{l:'Tell sales they overpromised',v:'b',p:0},{l:'Facilitate a conversation to agree realistic scope or phased delivery',v:'c',p:4},{l:'Deliver a reduced version in 1 week without telling the client',v:'d',p:1}] },
    { id:'pm2', type:'scenario', q:'Scenario: 3 features are all marked urgent by different stakeholders. You only have capacity for 1 this sprint. How do you decide?', opts:[{l:'Build what the most senior stakeholder wants',v:'a',p:1},{l:'Score each by impact, effort, and strategic alignment — present the decision with data',v:'b',p:4},{l:'Ask the team to vote',v:'c',p:1},{l:'Build all three partially',v:'d',p:0}] },
    { id:'pm3', type:'mcq', q:'What is a north star metric?', opts:[{l:'The KPI that best reflects the core value your product delivers to users',v:'a',p:4},{l:'The monthly revenue target set by the CEO',v:'b',p:0},{l:'The metric used to benchmark against competitors',v:'c',p:1},{l:'The KPI with the highest growth rate',v:'d',p:1}] },
  ],
  project_management: [
    { id:'pj1', type:'mcq', q:'A client asks to add a significant new feature to a project that is 80% complete. What is your first step?', opts:[{l:'Say yes immediately to maintain the relationship',v:'a',p:0},{l:'Say no — the scope is fixed',v:'b',p:1},{l:'Acknowledge, assess the impact on timeline and budget, and present options',v:'c',p:4},{l:'Add it to the backlog for review after delivery',v:'d',p:2}] },
    { id:'pj2', type:'scenario', q:'Scenario: Your project is 2 weeks behind. Your sponsor expects a completed demo in 3 weeks for a board presentation. What do you do?', opts:[{l:'Work weekends to catch up and say nothing',v:'a',p:1},{l:'Immediately escalate with a clear picture of the delay, its cause, and three options with trade-offs',v:'b',p:4},{l:'Reduce scope without telling anyone',v:'c',p:0},{l:'Push the demo date unilaterally',v:'d',p:0}] },
    { id:'pj3', type:'mcq', q:'What is a RAID log?', opts:[{l:'Tracking Risks, Assumptions, Issues and Dependencies',v:'a',p:4},{l:'Recording daily standup minutes',v:'b',p:0},{l:'Monitoring budget variance',v:'c',p:1},{l:'Logging IT security incidents',v:'d',p:0}] },
  ],
  digital_marketing: [
    { id:'dm1', type:'mcq', q:'Your email campaign has a 35% open rate but 1.2% click-through. What does this tell you?', opts:[{l:'Subject line is working but content or CTA is not compelling',v:'a',p:4},{l:'The campaign is performing poorly overall',v:'b',p:1},{l:'Your list quality is poor',v:'c',p:0},{l:'The send time needs optimising',v:'d',p:1}] },
    { id:'dm2', type:'scenario', q:'Scenario: Your paid social budget is cut 40% mid-campaign. You have 3 active ad sets. How do you respond?', opts:[{l:'Pause all campaigns equally',v:'a',p:1},{l:'Analyse ROAS per ad set, pause worst performers, concentrate budget on highest-converting audience',v:'b',p:4},{l:'Ask for the budget to be restored first',v:'c',p:0},{l:'Reduce spend across all ad sets proportionally',v:'d',p:2}] },
    { id:'dm3', type:'mcq', q:'What is the primary purpose of A/B testing?', opts:[{l:'Isolate a single variable and measure its impact on a specific outcome',v:'a',p:4},{l:'Test two different products simultaneously',v:'b',p:0},{l:'Compare performance across two channels',v:'c',p:1},{l:'Benchmark against competitors',v:'d',p:1}] },
  ],
  financial_analysis: [
    { id:'fa1', type:'mcq', q:'Revenue is up 15% YoY but net profit has fallen. What is your first area of investigation?', opts:[{l:'Cost of goods sold and operating expenses — looking for margin erosion',v:'a',p:4},{l:'Tax rate changes',v:'b',p:1},{l:'Revenue recognition timing',v:'c',p:2},{l:'Headcount changes',v:'d',p:1}] },
    { id:'fa2', type:'scenario', q:'Scenario: A business leader needs three financial scenarios for a board meeting tomorrow. You have 12 assumptions and 4 hours. What do you prioritise?', opts:[{l:'Build all three fully, even if it takes all night',v:'a',p:1},{l:'Identify 3–4 most sensitive assumptions, build clean scenario logic, present with explicit caveats',v:'b',p:4},{l:'Tell her the timeline is unrealistic',v:'c',p:0},{l:'Build one scenario well and note others are directional only',v:'d',p:2}] },
    { id:'fa3', type:'mcq', q:'What does EBITDA measure?', opts:[{l:'Earnings Before Interest, Tax, Depreciation and Amortisation — proxy for operating cash generation',v:'a',p:4},{l:'Total revenue minus total costs',v:'b',p:1},{l:'Net profit after all deductions',v:'c',p:0},{l:'Gross profit before operating expenses',v:'d',p:1}] },
  ],
}

function scoreToSuggestedLevel(score: number, selfSelected: string): number {
  const base = SENIORITY_MAP[selfSelected] ?? 2
  const pct = score / 12
  if (pct >= 0.85) return Math.min(base + 2, 7)
  if (pct >= 0.65) return Math.min(base + 1, 7)
  if (pct >= 0.45) return base
  if (pct >= 0.25) return Math.max(base - 1, 1)
  return Math.max(base - 2, 1)
}

function generateUserId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'PRX-'
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display:'flex', gap:5, marginBottom:28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i < current ? '#00C2A8' : i === current ? '#004D43' : '#1E2535', transition:'background 0.3s' }} />
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [customerType, setCustomerType] = useState<CustomerType | ''>('')
  const [orgCode, setOrgCode] = useState('')
  const [orgLookup, setOrgLookup] = useState<any>(null)
  const [orgLookupLoading, setOrgLookupLoading] = useState(false)
  const [orgError, setOrgError] = useState('')
  const [careerPath, setCareerPath] = useState('')
  const [seniority, setSeniority] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvParsed, setCvParsed] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [suggestedLevel, setSuggestedLevel] = useState(0)
  const [finalLevel, setFinalLevel] = useState(0)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [uniqueId, setUniqueId] = useState('')
  const [memberId, setMemberId] = useState('')
  const [userName, setUserName] = useState('')

  const questions = careerPath ? (QUESTIONS[careerPath] ?? []) : []
  const needsOrgCode = customerType === 'organisation' || customerType === 'university'

  // Live org code lookup — triggers after 500ms pause in typing
  useEffect(() => {
    if (!needsOrgCode || orgCode.length < 5) {
      setOrgLookup(null); setOrgError(''); return
    }
    const timer = setTimeout(async () => {
      setOrgLookupLoading(true); setOrgError('')
      const { data } = await supabase
        .from('organisations')
        .select('id, name, sector_name, org_number, sector_code')
        .eq('access_code', orgCode.toUpperCase())
        .single()
      setOrgLookupLoading(false)
      if (data) { setOrgLookup(data) }
      else { setOrgLookup(null); if (orgCode.length >= 7) setOrgError('Code not recognised. Check with your administrator.') }
    }, 500)
    return () => clearTimeout(timer)
  }, [orgCode, needsOrgCode])

  const canProceed = () => {
    if (step === 0) {
      if (!customerType) return false
      if (needsOrgCode && !orgLookup) return false
      return true
    }
    if (step === 1) return careerPath !== ''
    if (step === 2) return seniority !== ''
    if (step === 3) return true
    if (step === 4) return questions.every((q: any) => answers[q.id])
    return true
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setCvFile(file); setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setCvParsed(true); setLoading(false)
  }

  function handleAssessmentSubmit() {
    const score = questions.reduce((t: number, q: any) => {
      const sel = answers[q.id]
      return t + (q.opts.find((o: any) => o.v === sel)?.p ?? 0)
    }, 0)
    const suggested = scoreToSuggestedLevel(score, seniority)
    const selfLevel = SENIORITY_MAP[seniority] ?? 2
    setSuggestedLevel(suggested)
    setFinalLevel(suggested)
    if (suggested !== selfLevel) {
      setShowSuggestion(true)
    } else {
      handleFinish(suggested)
    }
  }

  async function handleFinish(level: number) {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }

    const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there'
    const uid = generateUserId()
    setUserName(name); setUniqueId(uid)

    // 7-digit member ID: [sector 1][org 2][serial 4]
    let mid = ''
    if (orgLookup) {
      const serial = String(Math.floor(Math.random() * 9000) + 1000)
      mid = `${orgLookup.sector_code}${String(orgLookup.org_number).padStart(2,'0')}${serial}`
      setMemberId(mid)
    }

    const score = questions.reduce((t: number, q: any) => {
      const sel = answers[q.id]
      return t + (q.opts.find((o: any) => o.v === sel)?.p ?? 0)
    }, 0)

    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: name,
      email: user.email,
      career_path: careerPath,
      current_level: level,
      experience_points: 0,
      subscription_tier: 'free',
      customer_type: customerType,
      organisation_id: orgLookup?.id ?? null,
      unique_user_id: uid,
      member_id: mid || null,
      assessment_score: score,
      assessment_suggested_level: suggestedLevel || level,
      self_selected_seniority: seniority,
      onboarding_complete: true,
    })

    setLoading(false); setStep(5)
  }

  // ── Shared styles ──────────────────────────────────────────
  const S = {
    page:  { minHeight:'100vh', background:'#0A0A0F', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', fontFamily:"'Segoe UI',system-ui,sans-serif" } as const,
    card:  { background:'#0D1117', border:'1px solid #1E2535', borderRadius:16, padding:'36px', width:'100%', maxWidth:660 } as const,
    logo:  { fontSize:12, fontWeight:700, color:'#00C2A8', letterSpacing:'0.12em', marginBottom:20 } as const,
    eyebrow: { fontSize:10, color:'#334155', textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:6 },
    h1:    { fontSize:24, fontWeight:700, color:'#E2E8F0', marginBottom:8 } as const,
    sub:   { fontSize:13, color:'#64748B', marginBottom:24, lineHeight:1.65 } as const,
    label: { fontSize:11, fontWeight:500, color:'#94A3B8', marginBottom:5, display:'block' as const },
    inp:   { width:'100%', padding:'10px 13px', background:'#141420', border:'1px solid #2D3748', borderRadius:8, color:'#E2E8F0', fontSize:13, outline:'none', boxSizing:'border-box' as const },
    btn:   { width:'100%', padding:'12px', background:'#00C2A8', color:'#0A0A0F', border:'none', borderRadius:9, fontSize:13, fontWeight:600 as const, cursor:'pointer' as const },
    ghost: { width:'100%', padding:'12px', background:'transparent', color:'#4A5568', border:'1px solid #2D3748', borderRadius:9, fontSize:13, cursor:'pointer' as const },
  }

  const TypeCard = ({ id, icon, lbl, desc }: any) => {
    const active = customerType === id
    return (
      <div onClick={() => { setCustomerType(id); setOrgCode(''); setOrgLookup(null); setOrgError('') }}
        style={{ padding:'12px 14px', background:active?'rgba(0,194,168,0.08)':'#141420', border:`1px solid ${active?'#00C2A8':'#2D3748'}`, borderRadius:10, cursor:'pointer', display:'flex', gap:12, alignItems:'flex-start', marginBottom:8 }}>
        <div style={{ fontSize:18, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:active?'#00C2A8':'#E2E8F0', marginBottom:2 }}>{lbl}</div>
          <div style={{ fontSize:11, color:'#4A5568', lineHeight:1.4 }}>{desc}</div>
        </div>
        {active && <div style={{ width:16, height:16, borderRadius:'50%', background:'#00C2A8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#0A0A0F', fontWeight:700, flexShrink:0, marginTop:2 }}>✓</div>}
      </div>
    )
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logo}>PRAXIS</div>
        <StepBar current={step} total={6} />

        {/* ── STEP 0: Account type ── */}
        {step === 0 && !showSuggestion && <>
          <div style={S.eyebrow}>Step 1 of 6 — Account type</div>
          <div style={S.h1}>How are you using Praxis?</div>
          <div style={S.sub}>This determines how your profile, data, and content are configured.</div>

          <TypeCard id="individual"    icon="👤" lbl="Individual"              desc="Developing my own career — self-paced, flexible schedule" />
          <TypeCard id="university"    icon="🎓" lbl="University student"      desc="My university has a Praxis licence — I need an access code" />
          <TypeCard id="organisation"  icon="🏢" lbl="Part of an organisation" desc="My employer is using Praxis — I have a company access code" />
          <TypeCard id="recruitment"   icon="🔍" lbl="Recruitment platform"    desc="I am placing candidates and assessing talent" />

          {needsOrgCode && (
            <div style={{ marginTop:14 }}>
              <label style={S.label}>Organisation access code</label>
              <input
                style={{ ...S.inp, borderColor: orgLookup ? '#00C2A8' : orgError ? '#F43F5E' : '#2D3748' }}
                value={orgCode}
                onChange={e => setOrgCode(e.target.value.toUpperCase())}
                placeholder="e.g. PALLY-2026 or NEXUS-2026"
                maxLength={20}
              />
              {/* Live feedback */}
              {orgLookupLoading && (
                <div style={{ fontSize:11, color:'#4A5568', marginTop:6 }}>Looking up organisation...</div>
              )}
              {orgLookup && (
                <div style={{ marginTop:8, padding:'10px 14px', background:'rgba(0,194,168,0.08)', border:'1px solid #004D43', borderRadius:8 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#00C2A8' }}>✓ {orgLookup.name}</div>
                  <div style={{ fontSize:11, color:'#4A5568', marginTop:2 }}>{orgLookup.sector_name} · Your progress will be linked to this organisation</div>
                </div>
              )}
              {orgError && (
                <div style={{ fontSize:11, color:'#F43F5E', marginTop:6 }}>{orgError}</div>
              )}
            </div>
          )}

          <button
            style={{ ...S.btn, marginTop:18, opacity:canProceed()?1:0.4 }}
            disabled={!canProceed()}
            onClick={() => setStep(1)}
          >
            Continue →
          </button>
        </>}

        {/* ── STEP 1: Career path ── */}
        {step === 1 && <>
          <div style={S.eyebrow}>Step 2 of 6 — Career path</div>
          <div style={S.h1}>Choose your career path</div>
          <div style={S.sub}>You will simulate real professional scenarios at Nexus Digital in your chosen field.</div>

          {CAREER_PATHS.map(p => (
            <div key={p.id} onClick={() => setCareerPath(p.id)}
              style={{ padding:'12px 14px', background:careerPath===p.id?'rgba(0,194,168,0.07)':'#141420', border:`1px solid ${careerPath===p.id?'#00C2A8':'#2D3748'}`, borderRadius:10, cursor:'pointer', display:'flex', gap:11, alignItems:'center', marginBottom:7 }}>
              <div style={{ width:40, height:40, borderRadius:8, background:careerPath===p.id?'#004D43':p.bg+'22', color:careerPath===p.id?'#00C2A8':p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{p.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:careerPath===p.id?'#00C2A8':'#E2E8F0' }}>{p.label}</div>
                <div style={{ fontSize:11, color:'#4A5568', marginTop:2 }}>{p.desc}</div>
              </div>
              {careerPath===p.id && <div style={{ width:16, height:16, borderRadius:'50%', background:'#00C2A8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#0A0A0F', fontWeight:700 }}>✓</div>}
            </div>
          ))}

          <div style={{ padding:'9px 13px', background:'#0D1117', border:'1px solid #1E2535', borderRadius:9, marginTop:4, marginBottom:14 }}>
            <div style={{ fontSize:11, color:'#334155', fontWeight:500 }}>Coming in Phase 2: UX/Design · Sales & BD · HR · Operations · Customer Success</div>
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button style={S.ghost} onClick={() => setStep(0)}>← Back</button>
            <button style={{ ...S.btn, opacity:canProceed()?1:0.4 }} disabled={!canProceed()} onClick={() => setStep(2)}>Continue →</button>
          </div>
        </>}

        {/* ── STEP 2: Seniority ── */}
        {step === 2 && <>
          <div style={S.eyebrow}>Step 3 of 6 — Experience level</div>
          <div style={S.h1}>Where are you in your career?</div>
          <div style={S.sub}>Select your current level. A short calibration assessment follows — this personalises your simulation, it is not pass/fail.</div>

          {SENIORITY_LEVELS.map(lv => (
            <div key={lv.id} onClick={() => setSeniority(lv.id)}
              style={{ padding:'11px 13px', background:seniority===lv.id?'rgba(0,194,168,0.08)':'#141420', border:`1px solid ${seniority===lv.id?'#00C2A8':'#2D3748'}`, borderRadius:10, cursor:'pointer', display:'flex', alignItems:'center', gap:11, marginBottom:7 }}>
              <div style={{ width:28, height:28, borderRadius:6, background:seniority===lv.id?'#004D43':'#1E2535', color:seniority===lv.id?'#00C2A8':'#4A5568', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>L{lv.level}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:seniority===lv.id?'#00C2A8':'#E2E8F0' }}>{lv.label}</div>
                <div style={{ fontSize:11, color:'#4A5568' }}>{lv.desc}</div>
              </div>
              {seniority===lv.id && <div style={{ width:16, height:16, borderRadius:'50%', background:'#00C2A8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#0A0A0F', fontWeight:700 }}>✓</div>}
            </div>
          ))}

          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button style={S.ghost} onClick={() => setStep(1)}>← Back</button>
            <button style={{ ...S.btn, opacity:canProceed()?1:0.4 }} disabled={!canProceed()} onClick={() => setStep(3)}>Continue →</button>
          </div>
        </>}

        {/* ── STEP 3: CV upload ── */}
        {step === 3 && <>
          <div style={S.eyebrow}>Step 4 of 6 — CV upload (optional)</div>
          <div style={S.h1}>Upload your CV</div>
          <div style={S.sub}>We use your CV as context to personalise your simulation scenarios. The calibration assessment still runs — your CV makes the experience more relevant, not decides your level.</div>

          <div onClick={() => fileRef.current?.click()}
            style={{ border:`2px dashed ${cvFile?'#00C2A8':'#2D3748'}`, borderRadius:12, padding:'28px', textAlign:'center', cursor:'pointer', background:cvFile?'rgba(0,194,168,0.05)':'#141420', marginBottom:16 }}>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display:'none' }} onChange={handleCvUpload} />
            {loading
              ? <div style={{ color:'#00C2A8', fontSize:13 }}>Parsing your CV...</div>
              : cvFile
                ? <><div style={{ fontSize:22, marginBottom:6 }}>✓</div><div style={{ fontSize:13, color:'#00C2A8', fontWeight:500 }}>{cvFile.name}</div>{cvParsed && <div style={{ fontSize:11, color:'#4A5568', marginTop:4 }}>CV parsed — experience noted as context</div>}</>
                : <><div style={{ fontSize:28, marginBottom:6 }}>📄</div><div style={{ fontSize:13, color:'#64748B' }}>Click to upload your CV</div><div style={{ fontSize:11, color:'#334155', marginTop:3 }}>PDF, DOC or DOCX · Max 5MB</div></>
            }
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button style={S.ghost} onClick={() => setStep(2)}>← Back</button>
            <button style={S.btn} onClick={() => setStep(4)}>{cvFile ? 'Continue →' : 'Skip and continue →'}</button>
          </div>
        </>}

        {/* ── STEP 4: Assessment ── */}
        {step === 4 && !showSuggestion && <>
          <div style={S.eyebrow}>Step 5 of 6 — Calibration assessment</div>
          <div style={S.h1}>Quick skills assessment</div>
          <div style={S.sub}>3 questions — knowledge and real-world scenarios. Answer honestly for the most accurate calibration. Your answers help us set the right simulation difficulty for you.</div>

          {questions.map((q: any, i: number) => (
            <div key={q.id} style={{ marginBottom:20 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10 }}>
                <div style={{ fontSize:9, padding:'2px 8px', borderRadius:99, background:q.type==='scenario'?'rgba(124,58,237,0.15)':'rgba(0,194,168,0.12)', color:q.type==='scenario'?'#A78BFA':'#00C2A8', fontWeight:500 }}>
                  {q.type === 'scenario' ? 'Scenario' : 'Knowledge'}
                </div>
                <div style={{ fontSize:10, color:'#334155' }}>Question {i+1} of {questions.length}</div>
              </div>
              <div style={{ fontSize:13, color:'#E2E8F0', lineHeight:1.65, marginBottom:12 }}>{q.q}</div>
              {q.opts.map((opt: any) => {
                const sel = answers[q.id] === opt.v
                return (
                  <div key={opt.v} onClick={() => setAnswers(prev => ({...prev, [q.id]: opt.v}))}
                    style={{ padding:'10px 13px', background:sel?'rgba(0,194,168,0.08)':'#141420', border:`1px solid ${sel?'#00C2A8':'#2D3748'}`, borderRadius:8, cursor:'pointer', fontSize:12, color:sel?'#E2E8F0':'#64748B', marginBottom:6, display:'flex', gap:9, alignItems:'flex-start', lineHeight:1.45 }}>
                    <div style={{ width:15, height:15, borderRadius:'50%', border:`1.5px solid ${sel?'#00C2A8':'#2D3748'}`, background:sel?'#00C2A8':'transparent', flexShrink:0, marginTop:1, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#0A0A0F', fontWeight:700 }}>{sel?'✓':''}</div>
                    <span>{opt.l}</span>
                  </div>
                )
              })}
            </div>
          ))}

          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button style={S.ghost} onClick={() => setStep(3)}>← Back</button>
            <button
              style={{ ...S.btn, opacity:canProceed()&&!loading?1:0.4 }}
              disabled={!canProceed() || loading}
              onClick={handleAssessmentSubmit}
            >
              {loading ? 'Calculating your profile...' : 'See my results →'}
            </button>
          </div>
        </>}

        {/* ── SUGGESTION SCREEN: Assessment suggests different level ── */}
        {showSuggestion && step === 4 && <>
          <div style={S.eyebrow}>Step 5 of 6 — Assessment result</div>
          <div style={S.h1}>We have a suggestion</div>
          <div style={S.sub}>
            Based on your assessment answers, your responses align more closely with a different level than you selected. You choose — this is your profile.
          </div>

          {/* Self-selected */}
          <div style={{ padding:'14px 16px', background:'#141420', border:'1px solid #2D3748', borderRadius:10, marginBottom:10 }}>
            <div style={{ fontSize:10, color:'#4A5568', marginBottom:4 }}>You selected</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#E2E8F0' }}>
              Level {SENIORITY_MAP[seniority]} — {SENIORITY_LEVELS.find(l => l.id === seniority)?.label}
            </div>
            <div style={{ fontSize:11, color:'#334155', marginTop:2 }}>{SENIORITY_LEVELS.find(l => l.id === seniority)?.desc}</div>
          </div>

          {/* Suggested */}
          <div style={{ padding:'14px 16px', background:'rgba(0,194,168,0.08)', border:'1px solid #00C2A8', borderRadius:10, marginBottom:20 }}>
            <div style={{ fontSize:10, color:'#00C2A8', marginBottom:4 }}>
              {suggestedLevel > (SENIORITY_MAP[seniority] ?? 2) ? '↑ Praxis suggests a higher level' : '↓ Praxis suggests a lower level'}
            </div>
            <div style={{ fontSize:14, fontWeight:600, color:'#00C2A8' }}>
              Level {suggestedLevel} — {SENIORITY_LEVELS.find(l => l.level === suggestedLevel)?.label}
            </div>
            <div style={{ fontSize:11, color:'#4A5568', marginTop:2 }}>{SENIORITY_LEVELS.find(l => l.level === suggestedLevel)?.desc}</div>
            <div style={{ fontSize:11, color:'#334155', marginTop:6, lineHeight:1.5 }}>
              {suggestedLevel > (SENIORITY_MAP[seniority] ?? 2)
                ? 'Your answers suggest stronger professional judgement than your selected level. Starting higher means more challenging scenarios from day one.'
                : 'Your answers suggest you may benefit from building foundational skills first. Starting lower ensures the simulation is genuinely useful rather than frustrating.'}
            </div>
          </div>

          <div style={{ fontSize:12, color:'#64748B', marginBottom:14 }}>Choose which level to start at — you can always progress through levels as you complete simulations.</div>

          <div style={{ display:'flex', gap:10 }}>
            <button
              style={{ ...S.ghost, flex:1 }}
              onClick={() => { setFinalLevel(SENIORITY_MAP[seniority] ?? 2); setShowSuggestion(false); handleFinish(SENIORITY_MAP[seniority] ?? 2) }}
            >
              Keep my choice (L{SENIORITY_MAP[seniority]})
            </button>
            <button
              style={{ ...S.btn, flex:1, marginTop:0 }}
              onClick={() => { setFinalLevel(suggestedLevel); setShowSuggestion(false); handleFinish(suggestedLevel) }}
            >
              Accept suggestion (L{suggestedLevel})
            </button>
          </div>
        </>}

        {/* ── STEP 5: Welcome ── */}
        {step === 5 && <>
          <div style={{ textAlign:'center', padding:'12px 0' }}>
            <div style={{ width:68, height:68, borderRadius:'50%', background:'rgba(0,194,168,0.1)', border:'2px solid #00C2A8', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', fontSize:26 }}>★</div>
            <div style={{ fontSize:10, color:'#00C2A8', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>Welcome to Praxis</div>
            <div style={{ fontSize:22, fontWeight:700, color:'#E2E8F0', marginBottom:6 }}>
              You are all set, {userName}!
            </div>
            <div style={{ fontSize:13, color:'#64748B', lineHeight:1.65, marginBottom:22 }}>
              Starting at <span style={{ color:'#00C2A8', fontWeight:600 }}>Level {finalLevel} — {SENIORITY_LEVELS.find(l => l.level === finalLevel)?.label}</span>. Your simulation scenarios are now calibrated for your experience level.
            </div>

            <div style={{ background:'#141420', border:'1px solid #1E2535', borderRadius:12, padding:'14px 18px', marginBottom:18, textAlign:'left' }}>
              <div style={{ fontSize:10, color:'#334155', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>Your Praxis profile</div>
              {[
                ['Your Praxis ID', uniqueId],
                ...(memberId ? [['Organisation member ID', memberId]] : []),
                ...(orgLookup ? [['Organisation', orgLookup.name]] : []),
                ['Career path', CAREER_PATHS.find(p => p.id === careerPath)?.label ?? ''],
                ['Starting level', `Level ${finalLevel} — ${SENIORITY_LEVELS.find(l => l.level === finalLevel)?.label}`],
                ['Account type', customerType],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #1E2535', fontSize:12 }}>
                  <span style={{ color:'#4A5568' }}>{k}</span>
                  <span style={{ color:'#E2E8F0', fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize:11, color:'#334155', marginBottom:20, lineHeight:1.6 }}>
              {memberId
                ? `Your organisation member ID (${memberId}) links your performance data to ${orgLookup?.name}. Your Praxis ID (${uniqueId}) is your personal portable identifier — share it with any employer.`
                : `Your Praxis ID is your verified portable identifier. Share it with employers or organisations to link your verified performance portfolio.`
              }
            </div>

            <button style={S.btn} onClick={() => router.push('/dashboard')}>
              Enter your workspace →
            </button>
          </div>
        </>}
      </div>
    </div>
  )
}
