/**
 * Praxis KPI Engine
 * Calculates all performance scores from raw task/session data.
 * This is the heart of the platform — every metric employers see
 * flows through these functions.
 */

export interface TaskRecord {
  id: string
  type: string
  assigned_at: string
  completed_at: string | null
  due_at: string | null
  decision_quality: 'good' | 'medium' | 'bad' | null
  urgency: string
}

export interface KPIScores {
  reliability: number      // % tasks completed on time
  responsiveness: number   // inverse of average response time (normalised)
  quality: number          // average decision quality score
  communication: number    // tone/clarity score (AI-analysed)
  scope_control: number    // % scope creep decisions handled correctly
  performance_index: number // weighted composite
}

// ── Weights ────────────────────────────────────────────────────
const WEIGHTS = {
  reliability: 0.25,
  quality: 0.30,
  responsiveness: 0.20,
  communication: 0.15,
  scope_control: 0.10,
}

// ── Decision quality → numeric score ──────────────────────────
const DECISION_SCORES: Record<string, number> = {
  good: 95,
  medium: 55,
  bad: 15,
}

// ── XP per action ──────────────────────────────────────────────
export const XP = {
  task_on_time: 20,
  task_late: 5,
  decision_good: 30,
  decision_medium: 10,
  decision_bad: 0,
  clock_in_on_time: 15,
  standup_completed: 20,
  level_up: 200,
}

// ── XP thresholds per level ────────────────────────────────────
export const LEVEL_THRESHOLDS = {
  1: 0,
  2: 500,
  3: 1500,
  4: 3500,
  5: 7000,
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Junior Intern',
  2: 'Graduate Analyst',
  3: 'Associate / Coordinator',
  4: 'Executive / Manager',
  5: 'Senior Manager',
}

/**
 * Calculate reliability score from task completion data.
 * = (tasks completed on time) / (total tasks) * 100
 */
export function calcReliability(tasks: TaskRecord[]): number {
  const completable = tasks.filter(t => t.due_at)
  if (completable.length === 0) return 100

  const onTime = completable.filter(t => {
    if (!t.completed_at || !t.due_at) return false
    return new Date(t.completed_at) <= new Date(t.due_at)
  })

  return Math.round((onTime.length / completable.length) * 100)
}

/**
 * Calculate responsiveness from urgent email/task response times.
 * Benchmarks: <15 min = 100, 15-30 min = 80, 30-60 min = 60, >60 min = 30
 */
export function calcResponsiveness(tasks: TaskRecord[]): number {
  const urgent = tasks.filter(t =>
    (t.urgency === 'urgent' || t.urgency === 'high') && t.completed_at
  )
  if (urgent.length === 0) return 75 // neutral default

  const scores = urgent.map(t => {
    const assigned = new Date(t.assigned_at).getTime()
    const completed = new Date(t.completed_at!).getTime()
    const minutes = (completed - assigned) / 60000

    if (minutes <= 15) return 100
    if (minutes <= 30) return 80
    if (minutes <= 60) return 60
    if (minutes <= 120) return 40
    return 20
  })

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

/**
 * Calculate decision quality score from all decision tasks.
 */
export function calcQuality(tasks: TaskRecord[]): number {
  const decisions = tasks.filter(t => t.type === 'decision' && t.decision_quality)
  if (decisions.length === 0) return 75

  const scores = decisions.map(t => DECISION_SCORES[t.decision_quality!] ?? 50)
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

/**
 * Calculate scope control specifically — decisions where scope creep was involved.
 * Uses decision_quality on tasks tagged type='scope_decision'
 */
export function calcScopeControl(tasks: TaskRecord[]): number {
  const scoped = tasks.filter(t => t.type === 'scope_decision' && t.decision_quality)
  if (scoped.length === 0) return null as unknown as number // no data yet

  const good = scoped.filter(t => t.decision_quality === 'good').length
  return Math.round((good / scoped.length) * 100)
}

/**
 * Compute the overall Performance Index.
 * communication_score passed in separately (from AI analysis or default).
 */
export function calcPerformanceIndex(
  tasks: TaskRecord[],
  communicationScore: number = 75
): KPIScores {
  const reliability = calcReliability(tasks)
  const responsiveness = calcResponsiveness(tasks)
  const quality = calcQuality(tasks)
  const scope = calcScopeControl(tasks) ?? 75

  const pi = Math.round(
    reliability     * WEIGHTS.reliability +
    quality         * WEIGHTS.quality +
    responsiveness  * WEIGHTS.responsiveness +
    communicationScore * WEIGHTS.communication +
    scope           * WEIGHTS.scope_control
  )

  return {
    reliability,
    responsiveness,
    quality,
    communication: communicationScore,
    scope_control: scope,
    performance_index: Math.min(100, pi),
  }
}

/**
 * Determine if a user should level up based on XP and KPI conditions.
 */
export function shouldLevelUp(
  currentLevel: number,
  xp: number,
  kpis: KPIScores
): boolean {
  const nextLevel = currentLevel + 1
  const threshold = LEVEL_THRESHOLDS[nextLevel as keyof typeof LEVEL_THRESHOLDS]
  if (!threshold || xp < threshold) return false

  // Each level has additional KPI requirements
  const requirements: Record<number, () => boolean> = {
    2: () => kpis.reliability >= 80,
    3: () => kpis.reliability >= 85 && kpis.scope_control >= 70,
    4: () => kpis.performance_index >= 85,
    5: () => kpis.performance_index >= 92,
  }

  const req = requirements[nextLevel]
  return req ? req() : false
}

/**
 * Generate KPI feedback message for the AI boss to send.
 */
export function generateKPIMessage(kpis: KPIScores, userName: string): string {
  const { performance_index: pi, reliability, responsiveness } = kpis

  if (pi >= 90) {
    return `${userName}, outstanding performance today. Your PI is ${pi} — keep this up and Level 2 is imminent.`
  }
  if (pi >= 75) {
    const weakest = reliability < responsiveness ? 'reliability' : 'responsiveness'
    return `Good day overall, ${userName}. PI at ${pi}. Your ${weakest} score is the main thing holding you back — focus there tomorrow.`
  }
  return `${userName}, your PI today is ${pi}, which is below target. Let's talk about what got in the way. Response time in particular needs improvement — I noticed the Marcus email sat for over 20 minutes.`
}
