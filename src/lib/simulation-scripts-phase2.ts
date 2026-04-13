/**
 * Praxis Simulation Scripts — Careers 6-10
 * UX/Design, Sales & BD, HR & People, Operations, Customer Success
 * Level 1, Day 1 scenarios
 */

import { CareerScript } from './simulation-scripts'

// ─────────────────────────────────────────────────────────────
// 6. UX / PRODUCT DESIGN
// ─────────────────────────────────────────────────────────────

export const UX_DESIGN_DAY1: CareerScript = {
  career_path: 'ux_design',
  display_name: 'UX / Product Design',
  org_name: 'Apex Creative Agency',
  org_type: 'Full-service digital agency',
  user_role_title: 'Junior UX Designer',
  day_context: 'You are working on a mobile app redesign for a retail client. The first round of user research is back and the results challenge the client\'s assumptions.',
  tasks: [
    {
      id: 'ux_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'Design sprint standup — what are you working on?',
      description: 'Design lead asks: "Where are we with the retail client onboarding flow? I need to know if we\'re on track for the Thursday review." What do you say?',
      urgency: 'high',
      free_text_prompt: 'Give a clear, professional status update in 2-3 sentences.',
      scoring_rubric: [
        'States current progress clearly (what\'s done, what\'s in progress)',
        'Flags any blockers honestly without catastrophising',
        'Mentions Thursday deadline and whether it\'s achievable',
        'Professional tone — not vague or over-reassuring',
      ],
    },
    {
      id: 'ux_d1_research',
      type: 'decision',
      trigger_minutes_after_clockin: 90,
      title: 'User research contradicts what the client wants — what do you do?',
      description: 'User testing results show: 8 out of 10 users found the client\'s preferred "bold hero image" homepage layout confusing and hard to navigate. They preferred a simpler product-grid layout. The client has already signed off on the hero layout in the brief and is very attached to it. Your design lead says: "This is your call — present the findings however you think is right."',
      urgency: 'high',
      options: [
        {
          id: 'A',
          text: 'Present the research findings honestly to the client with clear data: "8/10 users preferred the grid layout. We recommend we test a hybrid approach — hero imagery above the fold with a product grid immediately below. This preserves your brand vision while improving conversion." Show both options side by side.',
          quality: 'good',
          consequence: 'Design lead: "That\'s exactly how you handle this. You backed your recommendation with data and gave them a path forward instead of just saying no." Client appreciates the evidence-based approach.',
          kpi_impact: { quality: 18, communication: 15, scope_control: 10 },
          xp: 35,
        },
        {
          id: 'B',
          text: 'Present only the designs the client approved. Don\'t mention the negative research — it\'ll just cause conflict and delay.',
          quality: 'bad',
          consequence: 'App launches. Conversion is 23% below benchmark. Client realises the research data existed and wasn\'t shared. "Why didn\'t you tell us?" Trust permanently damaged.',
          kpi_impact: { quality: -20, communication: -15, reliability: -10 },
          xp: 0,
        },
        {
          id: 'C',
          text: 'Tell the client the research is "mixed" and leave the decision entirely to them without making a recommendation.',
          quality: 'medium',
          consequence: 'Client chooses the hero layout anyway since no clear alternative was presented. Design lead: "You had the data. You should have led with a recommendation — that\'s what they\'re paying us for."',
          kpi_impact: { quality: -8, communication: -5 },
          xp: 8,
        },
      ],
    },
    {
      id: 'ux_d1_brief',
      type: 'document',
      trigger_minutes_after_clockin: 200,
      title: 'Write a design rationale for the onboarding flow',
      description: 'Your design lead wants a 3-point written rationale for your proposed onboarding redesign. It needs to explain the design decisions in terms the client (a non-designer) can understand.',
      urgency: 'normal',
      free_text_prompt: 'Write a 3-point design rationale for a mobile app onboarding flow redesign.',
      scoring_rubric: [
        'Exactly 3 points — not more, not less',
        'Each point links a design decision to a user benefit (not just aesthetics)',
        'Written in plain language — no jargon the client wouldn\'t understand',
        'References user research or evidence, not just opinion',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// 7. SALES & BUSINESS DEVELOPMENT
// ─────────────────────────────────────────────────────────────

export const SALES_BD_DAY1: CareerScript = {
  career_path: 'sales_bd',
  display_name: 'Sales & Business Development',
  org_name: 'Nexus Digital',
  org_type: 'B2B SaaS startup',
  user_role_title: 'Sales Development Representative (SDR)',
  day_context: 'You are building your first pipeline. A warm inbound lead just replied to your outreach. A cold outbound target has gone silent after two calls.',
  tasks: [
    {
      id: 'sales_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'Sales standup — pipeline update',
      description: 'Sales manager asks: "Where\'s your pipeline this week? What\'s moving and what\'s stuck?" This is in front of the whole team. Be specific.',
      urgency: 'high',
      free_text_prompt: 'Give your pipeline update to the team. Be honest and specific.',
      scoring_rubric: [
        'Names specific opportunities and their stage',
        'Distinguishes between what\'s moving and what\'s blocked',
        'States a clear next action for each deal',
        'Honest — doesn\'t inflate pipeline or hide problems',
      ],
    },
    {
      id: 'sales_d1_objection',
      type: 'decision',
      trigger_minutes_after_clockin: 70,
      title: 'Warm lead objects: "We already use a competitor — why should we switch?"',
      description: 'Your warm inbound lead, Kieran (Head of Operations at a logistics firm), has replied to your email: "We\'ve been with DataTrack for 3 years. It\'s not perfect but switching is a big hassle. Why should we bother?" This is your best lead this week.',
      urgency: 'urgent',
      options: [
        {
          id: 'A',
          text: 'Reply: "Totally fair — switching cost is real and I wouldn\'t ask you to do it without a clear reason. Can I ask: what\'s the one thing about DataTrack that frustrates you most? If we can solve that in a 20-minute demo, the conversation is worth having. If not, I\'ll tell you honestly and save us both the time."',
          quality: 'good',
          consequence: 'Kieran replies: "Ha — fair enough. The reporting is a nightmare, actually. 20 minutes, Tuesday." You\'ve booked a discovery call by turning his objection into a question. Manager notes it in the CRM.',
          kpi_impact: { quality: 18, communication: 15, responsiveness: 10 },
          xp: 35,
        },
        {
          id: 'B',
          text: 'Send a long email listing all of Nexus Digital\'s features and why it\'s better than DataTrack with a comparison table.',
          quality: 'medium',
          consequence: 'Kieran doesn\'t reply. Too much information, too early. You\'ve answered a question he didn\'t ask.',
          kpi_impact: { quality: -8, communication: -5 },
          xp: 8,
        },
        {
          id: 'C',
          text: 'Reply: "DataTrack has a lot of limitations — most of our customers switched from them. I can show you a demo on Monday."',
          quality: 'bad',
          consequence: 'Kieran replies: "Didn\'t ask you to trash our supplier. Not interested." Badmouthing competitors is a fatal sales error. Lead lost.',
          kpi_impact: { quality: -20, communication: -18, reliability: -5 },
          xp: 0,
        },
      ],
    },
    {
      id: 'sales_d1_coldlead',
      type: 'document',
      trigger_minutes_after_clockin: 180,
      title: 'Write a re-engagement email for a cold prospect',
      description: 'You had two good calls with Amelia (CFO, manufacturing firm). She seemed interested but has gone silent for 2 weeks. Your manager says: "Write a re-engagement email — one more shot before we move on." It needs to be short, direct, and give her a reason to reply.',
      urgency: 'normal',
      free_text_prompt: 'Write the re-engagement email to Amelia.',
      scoring_rubric: [
        'Under 80 words — long emails get ignored',
        'Does not grovel or apologise for following up',
        'Adds a new angle or piece of value (not just "checking in")',
        'Has one clear call to action — not three options',
        'Professional but human tone',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// 8. HR & PEOPLE OPERATIONS
// ─────────────────────────────────────────────────────────────

export const HR_PEOPLE_DAY1: CareerScript = {
  career_path: 'hr_people',
  display_name: 'HR & People Operations',
  org_name: 'Meridian FMCG',
  org_type: 'Global consumer goods manufacturer',
  user_role_title: 'HR Coordinator',
  day_context: 'You are supporting the HR business partner for the operations division. A performance issue has been escalated and a new starter\'s onboarding has hit a problem.',
  tasks: [
    {
      id: 'hr_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'HR team check-in — your priorities today',
      description: 'HR Business Partner asks: "What\'s on your plate today and is there anything I need to know about before I go into the leadership team meeting at 10?" What do you say?',
      urgency: 'high',
      free_text_prompt: 'Brief your HRBP on today\'s priorities and any issues they need to know.',
      scoring_rubric: [
        'Lists specific tasks, not vague categories',
        'Flags anything time-sensitive or risky before the 10am meeting',
        'Mentions the new starter situation if it\'s a risk',
        'Concise — under 4 sentences',
      ],
    },
    {
      id: 'hr_d1_performance',
      type: 'decision',
      trigger_minutes_after_clockin: 80,
      title: 'Line manager wants to dismiss an employee immediately — is this right?',
      description: 'A line manager, Dave, calls you. He\'s angry: "Tom has missed his third deadline this month. I\'ve had enough — I want him out. Can you process a dismissal today?" Tom is a permanent employee with 18 months of service. You have no documentation of previous formal warnings.',
      urgency: 'urgent',
      options: [
        {
          id: 'A',
          text: 'Tell Dave clearly: "I understand your frustration and this needs to be addressed urgently. However, we can\'t dismiss Tom today — we don\'t have the documented formal warnings required by employment law. Doing so creates significant legal risk for the company. Let\'s meet in the next hour to initiate a formal performance improvement process correctly. I\'ll walk you through the steps."',
          quality: 'good',
          consequence: 'Dave is frustrated but accepts the guidance. HRBP is relieved you caught this: "You just saved us a potential unfair dismissal claim. Well done." Correct process initiated.',
          kpi_impact: { quality: 20, communication: 15, reliability: 12 },
          xp: 40,
        },
        {
          id: 'B',
          text: 'Tell Dave you\'ll "look into it" and prepare the dismissal paperwork, planning to discuss documentation later.',
          quality: 'bad',
          consequence: 'HRBP sees the paperwork and stops it immediately. "This would have been an unfair dismissal. We could have faced tribunal. You must check the process before acting." Serious error.',
          kpi_impact: { quality: -22, reliability: -15, communication: -10 },
          xp: 0,
        },
        {
          id: 'C',
          text: 'Tell Dave you\'ll escalate to the HRBP and ask her to deal with it.',
          quality: 'medium',
          consequence: 'HRBP handles it. She gives you the correct process afterwards: "This is exactly the kind of thing you need to know how to handle — let\'s go through the procedure together." Missed learning opportunity.',
          kpi_impact: { quality: -5, reliability: 0 },
          xp: 10,
        },
      ],
    },
    {
      id: 'hr_d1_onboarding',
      type: 'document',
      trigger_minutes_after_clockin: 200,
      title: 'New starter\'s IT access hasn\'t arrived on their first day — write the escalation email',
      description: 'Sofia started today. Her laptop hasn\'t arrived and IT says they have no record of the request. She\'s been sitting without equipment for 2 hours. Write a professional escalation email to the IT manager and your HRBP.',
      urgency: 'high',
      free_text_prompt: 'Write the escalation email to IT and your HRBP.',
      scoring_rubric: [
        'States the problem clearly with specifics (who, what, how long)',
        'Does not assign blame — focuses on resolution',
        'Asks for a specific action and timeframe',
        'CC\'s the right people (IT manager + HRBP)',
        'Professional — no emotional language',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// 9. OPERATIONS & SUPPLY CHAIN
// ─────────────────────────────────────────────────────────────

export const OPERATIONS_DAY1: CareerScript = {
  career_path: 'operations',
  display_name: 'Operations & Supply Chain',
  org_name: 'Meridian FMCG',
  org_type: 'Global consumer goods manufacturer',
  user_role_title: 'Operations Analyst',
  day_context: 'A critical supplier is threatening to pause deliveries due to an overdue invoice. A production line is running at 72% efficiency and the cause is unclear.',
  tasks: [
    {
      id: 'ops_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'Ops daily standup — your operational status',
      description: 'Operations manager opens the standup: "Right, who\'s got issues this morning? What\'s the biggest risk on the floor today?" You have two — the supplier issue and the line efficiency drop. What do you say?',
      urgency: 'high',
      free_text_prompt: 'Give the operational status update. Prioritise the risks.',
      scoring_rubric: [
        'Names both risks — does not hide the supplier issue',
        'Prioritises correctly (supplier is more urgent — delivery stoppage)',
        'States what action is already being taken',
        'Asks for escalation support if needed',
      ],
    },
    {
      id: 'ops_d1_supplier',
      type: 'decision',
      trigger_minutes_after_clockin: 60,
      title: 'Supplier threatens to stop deliveries in 24 hours over unpaid invoice',
      description: 'You just got a call from Castlemere Packaging. Their account manager says they have a £42,000 invoice 45 days overdue and will pause all deliveries in 24 hours unless it\'s resolved. Your production line depends on their packaging materials. You escalate to your manager. She says: "Handle it. You have the authority to make a commitment on payment timing."',
      urgency: 'urgent',
      options: [
        {
          id: 'A',
          text: 'Call the supplier back: "I hear you — 45 days is too long and I apologise. I\'ve escalated this to our finance team as an emergency payment. I can confirm payment will be processed within 48 hours and deliveries should not stop. I\'ll email you written confirmation within the hour. Can we agree on that basis?" Then send the email and alert finance.',
          quality: 'good',
          consequence: 'Supplier agrees to hold deliveries pending payment confirmation. Finance processes it within 24 hours. Operations manager: "Good crisis management — you protected the line." No production disruption.',
          kpi_impact: { quality: 18, communication: 15, responsiveness: 12, reliability: 10 },
          xp: 38,
        },
        {
          id: 'B',
          text: 'Tell the supplier you\'ll "look into it" and escalate to finance by email, asking them to respond "when they can".',
          quality: 'medium',
          consequence: 'Finance doesn\'t see the email as urgent. Supplier stops deliveries the next morning. Production line halts. Manager: "Why wasn\'t this treated as a P1 incident?"',
          kpi_impact: { quality: -12, responsiveness: -15, reliability: -10 },
          xp: 5,
        },
        {
          id: 'C',
          text: 'Tell the supplier this isn\'t your problem — finance handles payments and they should chase that team directly.',
          quality: 'bad',
          consequence: 'Supplier is furious. They stop deliveries immediately. Production halts for 18 hours. Director is involved. Total cost: £85,000 in lost production. Your manager is very unhappy.',
          kpi_impact: { quality: -25, communication: -20, reliability: -18 },
          xp: 0,
        },
      ],
    },
    {
      id: 'ops_d1_efficiency',
      type: 'report',
      trigger_minutes_after_clockin: 220,
      title: 'Write a root cause hypothesis for the line efficiency drop',
      description: 'Line 3 has been running at 72% efficiency for 3 days (target: 88%). You have reviewed: shift logs (no reported breakdowns), maintenance records (last PM completed 2 weeks ago), output data (drop correlates with the introduction of new raw material batch last Tuesday). Write your root cause hypothesis and proposed next step.',
      urgency: 'normal',
      free_text_prompt: 'Write your root cause hypothesis and recommended next action.',
      scoring_rubric: [
        'Identifies the correlation with the raw material batch change',
        'States it as a hypothesis — not a confirmed cause',
        'Proposes a specific, testable next action (e.g. revert batch, test sample)',
        'Estimates the impact of continued underperformance if not resolved',
        'Professional, factual language — no speculation presented as fact',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// 10. CUSTOMER SUCCESS
// ─────────────────────────────────────────────────────────────

export const CUSTOMER_SUCCESS_DAY1: CareerScript = {
  career_path: 'customer_success',
  display_name: 'Customer Success',
  org_name: 'Nexus Digital',
  org_type: 'B2B SaaS startup',
  user_role_title: 'Junior Customer Success Manager',
  day_context: 'You have a portfolio of 12 accounts. One is threatening to churn at renewal next month. Another has been silent for 6 weeks — which is unusual.',
  tasks: [
    {
      id: 'cs_d1_standup',
      type: 'standup',
      trigger_minutes_after_clockin: 5,
      title: 'CS team standup — accounts at risk',
      description: 'CS lead asks: "Who has accounts at risk this week?" You have two potential issues. What do you say?',
      urgency: 'high',
      free_text_prompt: 'Report your at-risk accounts to the team.',
      scoring_rubric: [
        'Names both accounts with specific risk reasons',
        'Distinguishes between confirmed churn risk vs. unknown (silence)',
        'States planned action for each',
        'Honest about what you know and don\'t know',
      ],
    },
    {
      id: 'cs_d1_churn',
      type: 'decision',
      trigger_minutes_after_clockin: 65,
      title: 'Customer says they\'re cancelling at renewal: "We\'re going with a competitor"',
      description: 'Lena, Head of Ops at Brightfield Ltd, calls to say they\'re not renewing. "We\'ve been talking to Dataworx and their pricing is 30% lower. Unless you can match it, we\'re done." The account is worth £18,000/year. Your manager has authorised up to 15% discount without approval.',
      urgency: 'urgent',
      options: [
        {
          id: 'A',
          text: 'Say: "Lena, I hear you and I don\'t want to lose you. Before we talk pricing, can I ask — is it purely cost, or has there been something about the product or service that\'s frustrated you? I want to make sure we\'re solving the right problem. If it is purely cost, I have some flexibility I can discuss with you today."',
          quality: 'good',
          consequence: 'Lena says: "Honestly — the reporting module is a nightmare too." You discover a product issue is the real driver. You offer the 15% discount AND escalate the feature problem to product. Renewal saved. CS lead: "Textbook save."',
          kpi_impact: { quality: 20, communication: 18, responsiveness: 12 },
          xp: 40,
        },
        {
          id: 'B',
          text: 'Immediately offer the maximum 15% discount to try to match Dataworx\'s pricing.',
          quality: 'medium',
          consequence: 'Lena pauses but says "Still 15% short — I need to think about it." You\'ve used your entire discount budget without uncovering the real issue. CS lead: "Never lead with your maximum offer."',
          kpi_impact: { quality: -10, communication: -5 },
          xp: 10,
        },
        {
          id: 'C',
          text: 'Tell Lena you\'ll need to escalate to your manager and call back tomorrow.',
          quality: 'bad',
          consequence: 'Lena replies: "We\'re busy — we\'ll sign with Dataworx today." In churn conversations, delay equals loss. Account churns. £18,000 ARR lost.',
          kpi_impact: { quality: -18, responsiveness: -20, reliability: -10 },
          xp: 0,
        },
      ],
    },
    {
      id: 'cs_d1_silent',
      type: 'document',
      trigger_minutes_after_clockin: 190,
      title: 'Write a re-engagement email for a silent account',
      description: 'Thornton & Co have not logged into the platform in 6 weeks and haven\'t responded to your last two check-in emails. Renewal is in 8 weeks. Write a re-engagement email that will actually get a reply.',
      urgency: 'normal',
      free_text_prompt: 'Write the re-engagement email to Thornton & Co.',
      scoring_rubric: [
        'Under 80 words — concise re-engagement emails get better response rates',
        'Creates mild urgency without being pushy',
        'Offers concrete value (a useful insight, a quick win)',
        'Single clear call to action',
        'Doesn\'t mention the renewal or churn risk explicitly',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// Export additions to the main script registry
// ─────────────────────────────────────────────────────────────

export const ADDITIONAL_SCRIPTS = {
  ux_design: UX_DESIGN_DAY1,
  sales_bd: SALES_BD_DAY1,
  hr_people: HR_PEOPLE_DAY1,
  operations: OPERATIONS_DAY1,
  customer_success: CUSTOMER_SUCCESS_DAY1,
}
