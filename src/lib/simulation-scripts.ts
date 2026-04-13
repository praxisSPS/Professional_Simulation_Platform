/**
 * Praxis Simulation Scripts — Level 1, Day 1
 * All 10 career paths. Each defines:
 *   - The organisation context
 *   - The day's task sequence
 *   - Decision points with options and scoring
 */

export interface DecisionOption {
  id: 'A' | 'B' | 'C'
  text: string
  quality: 'good' | 'medium' | 'bad'
  consequence: string
  kpi_impact: Record<string, number>  // e.g. { responsiveness: +10, scope_control: -5 }
  xp: number
}

export interface SimTask {
  id: string
  type: 'email_reply' | 'decision' | 'scope_decision' | 'document' | 'standup' | 'report'
  trigger_minutes_after_clockin: number  // when this fires
  title: string
  description: string
  urgency: 'urgent' | 'high' | 'normal' | 'low'
  from_persona?: string
  options?: DecisionOption[]
  free_text_prompt?: string   // if requires typed response
  scoring_rubric?: string[]   // what good looks like for free-text
}

export interface CareerScript {
  career_path: string
  display_name: string
  org_name: string
  org_type: string
  user_role_title: string
  day_context: string    // brief flavour text shown at start of day
  tasks: SimTask[]
}

// ─────────────────────────────────────────────────────────────
// 1. DATA & AI ENGINEERING
// ─────────────────────────────────────────────────────────────

export const DATA_ENGINEERING_DAY1: CareerScript = {
  career_path: 'data_engineering',
  display_name: 'Data & AI Engineering',
  org_name: 'Nexus Digital',
  org_type: 'B2B SaaS startup',
  user_role_title: 'Junior Data Analyst',
  day_context: 'Your first full day on the data team. The pipeline broke yesterday and Sarah is fixing it. The client wants a new dashboard by Friday.',
  tasks: [
    {
      id: 'de_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'Morning standup — state your priority for today',
      description: 'The team standup has started. James (your manager) asks: "What are you working on today and what do you need from us?" Type your response.',
      urgency: 'high',
      free_text_prompt: 'What is your priority today? What support do you need?',
      scoring_rubric: [
        'States a clear, single priority (not a list of everything)',
        'Mentions awareness of the pipeline issue without catastrophising',
        'Asks a specific, useful question if needs support',
        'Under 3 sentences',
      ],
    },
    {
      id: 'de_d1_scope',
      type: 'scope_decision',
      trigger_minutes_after_clockin: 90,
      title: 'Marcus: client wants two new features by Friday',
      description: 'Marcus just called. He has told the client they can have a user cohort chart AND a CSV export added to the dashboard — by Friday. Sarah is in the middle of fixing the broken pipeline. Marcus has just sent you an email asking you to "let Sarah know".',
      urgency: 'urgent',
      from_persona: 'marcus',
      options: [
        {
          id: 'A',
          text: 'Reply to Marcus: "I need to check with Sarah on capacity before we commit. She\'s currently fixing the pipeline. I\'ll confirm a realistic timeline in the next hour."',
          quality: 'good',
          consequence: 'Marcus is slightly frustrated but appreciates the professionalism. Sarah is relieved you didn\'t pile on. James notes "good scope management" in your performance log.',
          kpi_impact: { scope_control: 15, responsiveness: 10, quality: 12 },
          xp: 30,
        },
        {
          id: 'B',
          text: 'Forward Marcus\'s email to Sarah with: "Hey Sarah, Marcus says the client wants these two features by Friday. Can you fit them in?"',
          quality: 'medium',
          consequence: 'Sarah replies: "Are you serious? I\'m fixing the pipeline that broke production. No." James follows up: "Why did you commit before checking capacity?"',
          kpi_impact: { scope_control: -15, quality: -8, reliability: -5 },
          xp: 5,
        },
        {
          id: 'C',
          text: 'Reply to Marcus directly: "Marcus, you can\'t keep promising things without checking with the technical team. This is the second time this week."',
          quality: 'bad',
          consequence: 'Marcus escalates to James. James pulls you aside: "Your frustration is valid but that tone isn\'t acceptable to a colleague. We need to talk about professional communication."',
          kpi_impact: { communication: -20, scope_control: -5, quality: -10 },
          xp: 0,
        },
      ],
    },
    {
      id: 'de_d1_analysis',
      type: 'document',
      trigger_minutes_after_clockin: 180,
      title: 'Analyse Q3 pipeline data — write a 3-point summary',
      description: 'James has shared a CSV with Q3 data. He wants "a 3-point summary of the most important patterns — no more, no less" by 14:00. The data shows: conversion rate dropped 12% in July, recovered 8% in August, and volume grew 34% overall.',
      urgency: 'normal',
      free_text_prompt: 'Write your 3-point summary of the Q3 pipeline data.',
      scoring_rubric: [
        'Exactly 3 points (not 2, not 4)',
        'Each point is a specific insight with a number',
        'Does not include obvious observations ("volume went up")',
        'Clear and readable — no jargon',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// 2. PRODUCT MANAGEMENT
// ─────────────────────────────────────────────────────────────

export const PRODUCT_MANAGEMENT_DAY1: CareerScript = {
  career_path: 'product_management',
  display_name: 'Product Management',
  org_name: 'Nexus Digital',
  org_type: 'B2B SaaS startup',
  user_role_title: 'Associate Product Manager',
  day_context: 'Sprint planning is tomorrow. The engineering team is stretched. The CEO just hinted she wants a "big feature" shipped this quarter.',
  tasks: [
    {
      id: 'pm_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'Sprint standup — your priorities',
      description: 'The product standup. The lead engineer asks: "What are we committing to this sprint? I need a clear list." How do you respond?',
      urgency: 'high',
      free_text_prompt: 'State the sprint priorities. Be specific.',
      scoring_rubric: ['Clear prioritised list', 'Acknowledges capacity constraints', 'No vague commitments'],
    },
    {
      id: 'pm_d1_roadmap',
      type: 'scope_decision',
      trigger_minutes_after_clockin: 75,
      title: 'CEO wants a new feature added to this sprint',
      description: 'You just got a Slack from the CEO: "Can we add the AI recommendations feature to this sprint? The board loved it." Engineering capacity is already at 95%. Sprint planning is tomorrow morning.',
      urgency: 'urgent',
      from_persona: 'boss',
      options: [
        {
          id: 'A',
          text: 'Reply: "I love the board\'s enthusiasm for it. To add it to this sprint we\'d need to remove something of equal size. Can we meet for 15 minutes today to decide what comes out?"',
          quality: 'good',
          consequence: 'CEO responds: "Smart. Let\'s talk at 3pm." Engineering lead is relieved. This is textbook product management — you controlled scope while staying solution-focused.',
          kpi_impact: { scope_control: 15, quality: 15, communication: 10 },
          xp: 35,
        },
        {
          id: 'B',
          text: 'Reply: "Sure, I\'ll add it to the sprint." Then tell engineering to "figure it out".',
          quality: 'bad',
          consequence: 'Engineering lead calls you immediately: "We\'re already at 95% capacity. You just burned the team\'s trust." Sprint fails to deliver. James flags this in your review.',
          kpi_impact: { scope_control: -20, reliability: -10, quality: -15 },
          xp: 0,
        },
        {
          id: 'C',
          text: 'Reply: "We don\'t have capacity. That\'s not possible this sprint."',
          quality: 'medium',
          consequence: 'CEO is taken aback by the bluntness. She\'s not wrong to want it — you just needed to offer a path forward. James notes: "Right decision, wrong delivery."',
          kpi_impact: { scope_control: 5, communication: -10, quality: 0 },
          xp: 10,
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// 3. PROJECT MANAGEMENT
// ─────────────────────────────────────────────────────────────

export const PROJECT_MANAGEMENT_DAY1: CareerScript = {
  career_path: 'project_management',
  display_name: 'Project & Programme Management',
  org_name: 'Meridian FMCG',
  org_type: 'Global consumer goods manufacturer',
  user_role_title: 'Junior Project Coordinator',
  day_context: 'You are coordinating a product launch project. There are 6 workstreams and the launch date is fixed. A key supplier has just flagged a risk.',
  tasks: [
    {
      id: 'pjm_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'Project standup — RAG status update',
      description: 'Weekly project meeting. Programme manager asks: "What\'s the RAG status across your workstreams and what risks should I know about?" What do you say?',
      urgency: 'high',
      free_text_prompt: 'Give your RAG status update. Be precise.',
      scoring_rubric: ['Uses RAG terminology correctly', 'Names specific risks', 'Has a mitigation plan or asks for one'],
    },
    {
      id: 'pjm_d1_risk',
      type: 'decision',
      trigger_minutes_after_clockin: 120,
      title: 'Supplier has flagged a 2-week delay risk',
      description: 'The packaging supplier has emailed to say they "might" be 2 weeks late with the new packaging design approval. The product launch is in 8 weeks. If packaging is late, you cannot ship. What do you do?',
      urgency: 'urgent',
      options: [
        {
          id: 'A',
          text: 'Immediately escalate to the programme manager with a written risk assessment: probability (medium), impact (critical), and two mitigation options (accelerate approval, identify backup supplier).',
          quality: 'good',
          consequence: 'Programme manager: "This is exactly how risks should be managed. Good catch." You\'ve protected the timeline by surfacing the issue early.',
          kpi_impact: { quality: 15, reliability: 10, communication: 10 },
          xp: 30,
        },
        {
          id: 'B',
          text: 'Send a chasing email to the supplier asking for a firm date. Wait for their response before doing anything else.',
          quality: 'medium',
          consequence: 'The supplier takes 3 days to reply. You\'ve lost the early warning window. Programme manager: "Why wasn\'t this escalated immediately?"',
          kpi_impact: { quality: -5, responsiveness: -10, reliability: -8 },
          xp: 8,
        },
        {
          id: 'C',
          text: 'Note it in the risk log and wait to see if the supplier confirms the delay before raising it.',
          quality: 'bad',
          consequence: 'Supplier confirms 2 weeks late. Launch is now at risk. The team had to scramble for a backup supplier — something that would have been much easier to set up 2 weeks ago.',
          kpi_impact: { quality: -20, reliability: -15, scope_control: -10 },
          xp: 0,
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// 4. DIGITAL MARKETING
// ─────────────────────────────────────────────────────────────

export const DIGITAL_MARKETING_DAY1: CareerScript = {
  career_path: 'digital_marketing',
  display_name: 'Digital Marketing & Growth',
  org_name: 'Apex Creative Agency',
  org_type: 'Full-service marketing agency',
  user_role_title: 'Junior Digital Marketing Executive',
  day_context: 'A client\'s Q4 paid social campaign launches in 3 days. Initial test results are underperforming.',
  tasks: [
    {
      id: 'dm_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'Campaign status standup',
      description: 'Account lead asks: "Give me a one-minute status on the Henderson client campaign. We go live in 3 days." What do you say?',
      urgency: 'high',
      free_text_prompt: 'Give the campaign status update.',
      scoring_rubric: ['States current performance vs benchmark', 'Identifies the specific problem', 'Proposes next action'],
    },
    {
      id: 'dm_d1_decision',
      type: 'decision',
      trigger_minutes_after_clockin: 90,
      title: 'Test results show CPC 40% above target — what do you recommend?',
      description: 'The A/B test results are in: Creative Set A has a £3.40 CPC vs target of £2.40. Creative Set B has a £2.80 CPC. The client\'s brief specified £2.40 max. Campaign goes live in 3 days. What do you recommend to the account lead?',
      urgency: 'urgent',
      options: [
        {
          id: 'A',
          text: 'Present a clear recommendation: go with Creative Set B (closest to target), tighten audience targeting to reduce CPC, and flag to the client that initial results suggest £2.60 is a more realistic target. Include the data.',
          quality: 'good',
          consequence: 'Account lead: "Good analysis. I\'ll take this to the client meeting." Client appreciates the honesty and approves Set B with the revised benchmark.',
          kpi_impact: { quality: 15, communication: 12, reliability: 10 },
          xp: 30,
        },
        {
          id: 'B',
          text: 'Recommend going live anyway with Set B and hoping the CPC improves once the algorithm optimises.',
          quality: 'medium',
          consequence: 'Campaign launches. CPC stays at £2.80. Client asks why you launched outside the brief without flagging it first.',
          kpi_impact: { quality: -10, communication: -5, reliability: -8 },
          xp: 8,
        },
        {
          id: 'C',
          text: 'Delay the launch and run more tests until you hit the £2.40 target.',
          quality: 'bad',
          consequence: 'Launch is delayed by a week. Client is unhappy. Account lead: "The Q4 window doesn\'t wait. You should have recommended an optimisation path, not a full stop."',
          kpi_impact: { quality: -15, reliability: -20, scope_control: -5 },
          xp: 0,
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// 5. FINANCIAL ANALYSIS
// ─────────────────────────────────────────────────────────────

export const FINANCIAL_ANALYSIS_DAY1: CareerScript = {
  career_path: 'financial_analysis',
  display_name: 'Financial Analysis & FinTech',
  org_name: 'GlobalBank Advisory',
  org_type: 'Investment bank',
  user_role_title: 'Junior Financial Analyst',
  day_context: 'You are supporting a client presentation on M&A due diligence. The VP needs a variance analysis by 11am.',
  tasks: [
    {
      id: 'fa_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'Morning check-in with VP',
      description: 'VP asks: "What\'s the status on the Hartwell variance analysis? I need it before the 11am client call." It\'s 9am. What do you say?',
      urgency: 'urgent',
      free_text_prompt: 'Respond to the VP.',
      scoring_rubric: ['Gives a clear timeline commitment', 'Flags any blockers immediately', 'Does not over-promise'],
    },
    {
      id: 'fa_d1_error',
      type: 'decision',
      trigger_minutes_after_clockin: 60,
      title: 'You\'ve found an error in last week\'s model — do you fix it quietly or flag it?',
      description: 'While preparing the variance analysis, you notice the revenue projection model from last week has a formula error in row 47. It\'s out by about £200k. This model was already sent to the client. The client presentation is in 2 hours. What do you do?',
      urgency: 'urgent',
      options: [
        {
          id: 'A',
          text: 'Immediately flag the error to the VP with a one-line summary: what\'s wrong, the magnitude, and how long it will take you to fix. Offer to call the client before the meeting if needed.',
          quality: 'good',
          consequence: 'VP: "Good catch. Fix it now and I\'ll send a revised version to the client before the call. This is exactly the right behaviour." Integrity scored highly.',
          kpi_impact: { quality: 20, communication: 15, reliability: 10 },
          xp: 40,
        },
        {
          id: 'B',
          text: 'Fix the error quietly and update the presentation without mentioning it to anyone.',
          quality: 'medium',
          consequence: 'VP notices the numbers changed between versions and asks why. "You should have told me immediately. Now I look like I don\'t know my own models in front of the client."',
          kpi_impact: { quality: -10, communication: -15, reliability: -5 },
          xp: 5,
        },
        {
          id: 'C',
          text: 'The meeting is only 2 hours away. Don\'t risk raising it now — it might not matter.',
          quality: 'bad',
          consequence: 'The client spots the inconsistency during the meeting. £200k is not "might not matter" in M&A due diligence. The VP is furious.',
          kpi_impact: { quality: -25, reliability: -20, communication: -10 },
          xp: 0,
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// Export all scripts as a registry
// ─────────────────────────────────────────────────────────────

export const SIMULATION_SCRIPTS: Record<string, CareerScript> = {
  data_engineering: DATA_ENGINEERING_DAY1,
  product_management: PRODUCT_MANAGEMENT_DAY1,
  project_management: PROJECT_MANAGEMENT_DAY1,
  digital_marketing: DIGITAL_MARKETING_DAY1,
  financial_analysis: FINANCIAL_ANALYSIS_DAY1,
  // Remaining 5 paths added in Phase 2:
  // ux_design, sales_bd, hr_people, operations, customer_success
}

export const CAREER_PATH_DISPLAY: Record<string, { label: string; icon: string }> = {
  data_engineering:    { label: 'Data & AI Engineering',   icon: 'DE' },
  product_management:  { label: 'Product Management',      icon: 'PM' },
  project_management:  { label: 'Project Management',      icon: 'PJ' },
  digital_marketing:   { label: 'Digital Marketing',       icon: 'DM' },
  financial_analysis:  { label: 'Financial Analysis',      icon: 'FA' },
  ux_design:           { label: 'UX / Product Design',     icon: 'UX' },
  sales_bd:            { label: 'Sales & Business Dev',    icon: 'SD' },
  hr_people:           { label: 'HR & People Operations',  icon: 'HR' },
  operations:          { label: 'Operations & Supply Chain', icon: 'OP' },
  customer_success:    { label: 'Customer Success',        icon: 'CS' },
}
