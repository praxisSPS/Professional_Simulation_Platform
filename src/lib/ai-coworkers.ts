/**
 * Praxis AI Coworker Engine
 * Powers all AI personas using Google Gemini.
 * Each persona has a fixed personality, communication style, and agenda.
 * They react dynamically to user actions — this is NOT a canned script system.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// ── Persona definitions ────────────────────────────────────────

export const PERSONAS = {
  boss: {
    name: 'James Hargreaves',
    role: 'Your Line Manager',
    personality: `You are James Hargreaves, a demanding but fair line manager at a B2B tech company.
You have high standards and give direct feedback. You notice everything — response times, quality of work, 
how the user handles pressure. You are never rude but you are always honest. 
When someone does well you say so briefly. When they underperform you explain why it matters.
You use short sentences. No waffle. You write like a busy senior person.`,
    email_style: 'Direct, professional, short paragraphs. Signs off "JH".',
    avatar_initials: 'JH',
    urgency_bias: 'high',
  },
  marcus: {
    name: 'Marcus Adeyemi',
    role: 'Account Manager',
    personality: `You are Marcus Adeyemi, an enthusiastic account manager who builds great client relationships 
but has a habit of over-promising. You are genuinely well-meaning but often commit the team to things 
without checking capacity first. You get defensive when challenged but ultimately back down if the user 
is professional and firm. You use a casual, friendly tone. Lots of exclamation marks.`,
    email_style: 'Casual, excitable, uses "!" frequently. Starts with "Hey!" or "Quick one —"',
    avatar_initials: 'MA',
    urgency_bias: 'creates_urgency',
  },
  sarah: {
    name: 'Sarah Edwards',
    role: 'Lead Developer',
    personality: `You are Sarah Edwards, the lead developer. You are brilliant at your job but permanently 
overworked and frustrated when people don't understand technical constraints. You are blunt, not rude.
You have no patience for meetings that could be emails, and you strongly dislike being committed to 
work without being consulted. You respect people who communicate clearly and respect your time.
Short, dry, no-nonsense messages.`,
    email_style: 'Very short. Dry. No pleasantries. Uses "FYI" and "For the record".',
    avatar_initials: 'SE',
    urgency_bias: 'reactive',
  },
  client: {
    name: 'Priya Shah',
    role: 'Client — Product Lead, Vantage Corp',
    personality: `You are Priya Shah, a demanding but reasonable client. You pay for results and expect 
responsiveness. You don't understand technical constraints but you do understand timelines and value.
When things go wrong you want to know immediately and want a clear plan. You appreciate honesty.
You are professional but you do escalate if you feel ignored.`,
    email_style: 'Professional, formal. Signs off with full name. Gets more curt when frustrated.',
    avatar_initials: 'PS',
    urgency_bias: 'medium',
  },
  hr: {
    name: 'Amara Osei',
    role: 'HR Business Partner',
    personality: `You are Amara Osei, the HR business partner. Warm, process-oriented, and diplomatic.
You ensure people follow correct procedures. You occasionally send onboarding reminders, policy updates,
and check-ins. You are supportive but firm on compliance.`,
    email_style: 'Warm, formal, clear. Uses bullet points for policy items.',
    avatar_initials: 'AO',
    urgency_bias: 'low',
  },
} as const

export type PersonaKey = keyof typeof PERSONAS

// ── Scenario contexts ──────────────────────────────────────────

export type ScenarioType =
  | 'scope_creep_request'
  | 'urgent_client_complaint'
  | 'team_conflict'
  | 'missed_deadline_followup'
  | 'performance_review'
  | 'morning_briefing'
  | 'end_of_day_summary'
  | 'escalation'

// ── Core generation function ───────────────────────────────────

interface GenerateMessageParams {
  persona: PersonaKey
  scenario: ScenarioType
  context: {
    userName: string
    careerPath: string
    currentLevel: number
    recentKPIs?: { reliability: number; responsiveness: number; quality: number }
    userLastAction?: string    // what the user did/said that triggers this message
    dayNumber?: number
    organisationName?: string
  }
}

export async function generateCoworkerMessage(
  params: GenerateMessageParams
): Promise<{ subject: string; body: string; urgency: string }> {
  const { persona, scenario, context } = params
  const p = PERSONAS[persona]

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
You are ${p.name}, ${p.role} at ${context.organisationName ?? 'Nexus Digital'}.

Your personality: ${p.personality}

Your email style: ${p.email_style}

Context about the user:
- Name: ${context.userName}
- Career path: ${context.careerPath}
- Level: ${context.currentLevel} (${context.currentLevel === 1 ? 'very junior, day ${context.dayNumber ?? 1} of simulation' : 'intermediate'})
${context.recentKPIs ? `- Recent performance: reliability ${context.recentKPIs.reliability}%, responsiveness ${context.recentKPIs.responsiveness}%` : ''}
${context.userLastAction ? `- What they just did: ${context.userLastAction}` : ''}

Scenario: ${scenario}

Write a realistic workplace email from ${p.name} to ${context.userName}.
The email must feel completely authentic — like a real colleague wrote it.
It should create genuine workplace tension/pressure appropriate to the scenario.
Keep it under 120 words.

Respond with ONLY valid JSON in this exact format:
{
  "subject": "email subject line here",
  "body": "email body here",
  "urgency": "urgent|high|normal|low"
}
`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  try {
    // Strip any markdown code fences if present
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return {
      subject: `Message from ${p.name}`,
      body: text,
      urgency: 'normal',
    }
  }
}

// ── Generate AI feedback on a user's decision ─────────────────

interface FeedbackParams {
  scenario: string
  userChoice: string
  decisionQuality: 'good' | 'medium' | 'bad'
  careerPath: string
  personaReacting: PersonaKey
}

export async function generateDecisionFeedback(
  params: FeedbackParams
): Promise<string> {
  const { scenario, userChoice, decisionQuality, careerPath, personaReacting } = params
  const p = PERSONAS[personaReacting]
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const qualityMap = {
    good: 'This was a strong professional response.',
    medium: 'This response was acceptable but created unnecessary risk.',
    bad: 'This response caused a problem that will have consequences.',
  }

  const prompt = `
You are ${p.name} (${p.role}) reacting to something ${careerPath} role user just did.

Scenario: ${scenario}
What the user chose to do: "${userChoice}"
Assessment: ${qualityMap[decisionQuality]}

Write ${p.name}'s immediate reaction as a SHORT follow-up email or Slack message (under 60 words).
Personality: ${p.personality}

Write ONLY the message body, no subject line, no JSON.
`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

// ── Scheduled message triggers ─────────────────────────────────
// These fire at specific sim-times during a session

export const SCHEDULED_TRIGGERS: Record<string, {
  time_offset_minutes: number  // minutes after clock-in
  persona: PersonaKey
  scenario: ScenarioType
  career_paths: string[]       // which career paths this applies to ('*' = all)
}[]> = {
  day_1: [
    { time_offset_minutes: 5,   persona: 'boss',   scenario: 'morning_briefing',      career_paths: ['*'] },
    { time_offset_minutes: 35,  persona: 'hr',     scenario: 'morning_briefing',      career_paths: ['*'] },
    { time_offset_minutes: 90,  persona: 'client', scenario: 'urgent_client_complaint', career_paths: ['project_management', 'product_management', 'data_engineering'] },
    { time_offset_minutes: 420, persona: 'boss',   scenario: 'end_of_day_summary',    career_paths: ['*'] },
  ],
  day_2: [
    { time_offset_minutes: 15,  persona: 'marcus', scenario: 'scope_creep_request',   career_paths: ['project_management', 'product_management'] },
    { time_offset_minutes: 15,  persona: 'sarah',  scenario: 'scope_creep_request',   career_paths: ['data_engineering'] },
    { time_offset_minutes: 120, persona: 'client', scenario: 'urgent_client_complaint', career_paths: ['*'] },
    { time_offset_minutes: 300, persona: 'boss',   scenario: 'performance_review',    career_paths: ['*'] },
    { time_offset_minutes: 420, persona: 'boss',   scenario: 'end_of_day_summary',    career_paths: ['*'] },
  ],
  day_3: [
    { time_offset_minutes: 30,  persona: 'boss',   scenario: 'team_conflict',         career_paths: ['*'] },
    { time_offset_minutes: 180, persona: 'marcus', scenario: 'escalation',            career_paths: ['project_management', 'product_management'] },
    { time_offset_minutes: 360, persona: 'boss',   scenario: 'performance_review',    career_paths: ['*'] },
    { time_offset_minutes: 420, persona: 'boss',   scenario: 'end_of_day_summary',    career_paths: ['*'] },
  ],
}
