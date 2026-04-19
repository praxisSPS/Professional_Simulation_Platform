// src/lib/colleagues.ts
// Full colleague roster for all 6 career paths.
// Each colleague has 2 action templates (70%) and 1 feedback template (30%).

export interface FollowupTask {
  title: string
  type: string
  urgency: 'urgent' | 'high' | 'normal'
  description: string
  xp: number
  due_offset_mins: number
  project_ref: string
  kpi_tag: string
}

export interface ActionTemplate {
  kind: 'action'
  subject: string
  body: string
  urgency: 'urgent' | 'high' | 'normal'
  task: FollowupTask
}

export interface FeedbackTemplate {
  kind: 'feedback'
  subject: string
  body: string
  urgency: 'normal' | 'high'
}

export type MessageTemplate = ActionTemplate | FeedbackTemplate

export interface Colleague {
  id: string
  name: string
  role: string
  persona_key: string
  trigger_types: string[]
  templates: [ActionTemplate, ActionTemplate, FeedbackTemplate]
}

// ── DATA ENGINEERING ──────────────────────────────────────────

const DATA_ENGINEERING: Colleague[] = [
  {
    id: 'de_marcus',
    name: 'Marcus Adeyemi',
    role: 'Senior PM',
    persona_key: 'marcus',
    trigger_types: ['scope_decision', 'decision'],
    templates: [
      {
        kind: 'action',
        subject: 'Quick one — Vantage Corp dashboard has stopped refreshing',
        body: `Hey,

Sorry to drop this on you but the Vantage Corp dashboard stopped refreshing about 20 minutes ago. Priya's team noticed first — they're trying to pull data for a board presentation this afternoon.

I think it's the Nexus Pipeline v2 but I'm not sure where to start. Can you investigate and let me know your findings? Client expects a status update by 2pm.

Cheers
Marcus`,
        urgency: 'urgent',
        task: {
          title: 'Marcus needs help: Vantage Corp dashboard not refreshing',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'Marcus has pinged you directly. The Vantage Corp dashboard stopped refreshing 20 minutes ago — likely a Nexus Pipeline v2 issue. Investigate and reply to Marcus with your initial findings, suspected root cause, and next steps. Client presentation is this afternoon.',
          xp: 35,
          due_offset_mins: 30,
          project_ref: 'vantage-dashboard',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Client wants new revenue chart on the Vantage dashboard this sprint',
        body: `Hey,

Just off the phone with Priya. She wants a revenue breakdown chart added to the Vantage Corp dashboard — says it's critical for next week's board presentation.

I know we're mid-sprint on the Nexus Pipeline v2 work but she's a key account. Can you assess the effort and tell me if it's feasible? Need to come back to her by EOD.

Marcus`,
        urgency: 'high',
        task: {
          title: "Assess Priya's Vantage dashboard revenue chart request — sprint impact",
          type: 'scope_decision',
          urgency: 'high',
          description: "Marcus has committed to assessing a new Vantage Corp dashboard feature mid-sprint. Evaluate adding a revenue breakdown chart alongside the current Nexus Pipeline v2 work and respond: can it be done this sprint, or does it move to next? Include your rationale and any risks to pipeline delivery.",
          xp: 30,
          due_offset_mins: 60,
          project_ref: 'vantage-dashboard',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good call on that earlier',
        body: `Hey,

Just wanted to say — the way you handled that decision was spot on. Priya came back to me happy and the Vantage Corp team was satisfied with the explanation.

Marcus`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'de_sarah',
    name: 'Sarah Edwards',
    role: 'Head of Data & Analytics',
    persona_key: 'boss',
    trigger_types: ['report', 'document'],
    templates: [
      {
        kind: 'action',
        subject: 'Board wants a Nexus Pipeline v2 health summary by 4pm',
        body: `FYI — board have asked for a one-page data health summary before their 4pm call. They want: current Nexus Pipeline v2 status, Q4 data quality score, and known issues.

You are writing it.

SE`,
        urgency: 'urgent',
        task: {
          title: 'Write Nexus Pipeline v2 health summary for board — 4pm deadline',
          type: 'document',
          urgency: 'urgent',
          description: "Sarah needs a one-page data health summary for the board's 4pm call. Include: (1) Nexus Pipeline v2 current status, (2) Q4 data quality score, (3) known issues and mitigations. Non-technical audience — keep it clear and honest.",
          xp: 40,
          due_offset_mins: 25,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'SQL query needed for Vantage Corp revenue analysis',
        body: `For the record — I need a SQL query returning the top 10 customers by total revenue this quarter for the Vantage Corp dashboard. Include customer name, total spend, order count, and MoM growth %.

Needed for the 3pm finance review.

SE`,
        urgency: 'normal',
        task: {
          title: 'Write SQL: top 10 customers by Q4 revenue for Vantage Corp dashboard',
          type: 'document',
          urgency: 'normal',
          description: 'Sarah needs a SQL query for the Vantage Corp dashboard finance review: top 10 customers by revenue this quarter — customer name, total spend, order count, and MoM growth %. Add a brief comment explaining your approach and assumptions.',
          xp: 25,
          due_offset_mins: 90,
          project_ref: 'vantage-dashboard',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'That report was solid',
        body: `For the record — the board was happy with the analysis quality. Figures were clear and the narrative made sense to non-technical people.

Keep that standard.

SE`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'de_priya',
    name: 'Priya Shah',
    role: 'Client — Vantage Corp',
    persona_key: 'client',
    trigger_types: ['email_reply'],
    templates: [
      {
        kind: 'action',
        subject: 'Vantage Corp data export is broken — urgent',
        body: `Hi,

Our team is trying to export last month's campaign data from the Vantage Corp dashboard but the export keeps failing with a 500 error. We have a client presentation tomorrow morning and need this data tonight.

Can you resolve this as a priority please?

Priya Shah
Vantage Corp`,
        urgency: 'urgent',
        task: {
          title: 'Respond to Priya: Vantage Corp dashboard data export failure',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'Priya Shah has reported that the Vantage Corp dashboard data export is failing with a 500 error ahead of a client presentation. Draft a professional response acknowledging the issue, explaining your investigation approach (likely a Nexus Pipeline v2 connection), and providing a realistic resolution timeline.',
          xp: 35,
          due_offset_mins: 20,
          project_ref: 'vantage-dashboard',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'Question about Q3 data discrepancy in Vantage dashboard',
        body: `Hi,

We are reviewing the Q3 revenue figures in the Vantage Corp dashboard and there seems to be a GBP 45k discrepancy vs our internal system. Before we raise this with our CFO we wanted to check with you first.

Could you investigate this in the Nexus Pipeline v2 data?

Priya Shah`,
        urgency: 'high',
        task: {
          title: 'Investigate Q3 revenue discrepancy in Vantage dashboard flagged by client',
          type: 'email_reply',
          urgency: 'high',
          description: 'Priya Shah has flagged a GBP 45k discrepancy between Vantage Corp dashboard revenue figures and their internal system — likely a Nexus Pipeline v2 data issue. Respond professionally: acknowledge the query, explain your investigation approach, and commit to a timeframe. This will be seen by the client CFO.',
          xp: 30,
          due_offset_mins: 45,
          project_ref: 'vantage-dashboard',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Thank you for the quick turnaround',
        body: `Hi,

Just a quick note — I appreciate how promptly you responded. The team was relieved to have a clear update.

This is exactly the kind of service we expect from Nexus.

Priya Shah`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'de_james',
    name: 'James Obi',
    role: 'Junior Data Analyst',
    persona_key: 'marcus',
    trigger_types: ['standup', 'document'],
    templates: [
      {
        kind: 'action',
        subject: 'Can you review my Q4 analysis before I send it to Sarah?',
        body: `Hi,

I've finished my first draft of the Q4 anomaly analysis for the Vantage Corp dashboard. Sarah said I should ask a senior analyst to sense-check before sending to the team.

Here's my draft summary:

---
Q4 DATA ANOMALY ANALYSIS — DRAFT v0.1
Analyst: James Obi | Vantage Corp dashboard

Key findings:
1. Revenue uplift concentrated in final 3 days of quarter (31 Dec spike: +£178k vs daily avg of £42k) — possible year-end pull-forward by sales team
2. Customer segment "Enterprise" shows zero orders for weeks 3–4 of December — possible Nexus Pipeline v2 ingestion gap for this segment
3. Three duplicate transaction IDs identified in the raw sales table: TX-4421, TX-4422, TX-4419 (combined value ~£61k)

My conclusion: Q4 revenue is overstated by approximately £61k due to duplicates. The Enterprise segment data gap in weeks 3–4 requires further investigation before this goes to the board.

Recommendation: Rerun the Nexus Pipeline v2 ingestion for December Enterprise data and remove duplicate transactions before the Q4 close.

Confidence level: Medium. The duplicate issue is definite. The Enterprise gap could be legitimate (no orders) or a pipeline issue — I can't tell yet.
---

Could you take a quick look and let me know if the logic holds? I'm not sure whether to flag the £61k overstatement directly to Sarah or handle it differently.

James`,
        urgency: 'normal',
        task: {
          title: "Review James's Q4 Vantage dashboard anomaly analysis",
          type: 'document',
          urgency: 'normal',
          description: "James Obi (Junior Analyst) has submitted a Q4 anomaly analysis for the Vantage Corp dashboard. His draft identifies: £61k duplicate transactions, an Enterprise segment data gap in weeks 3-4 of December, and a year-end revenue spike. Write a structured review: (1) assess whether his methodology and conclusions are sound, (2) what he's done well, (3) 2-3 specific improvements, (4) advise on how to escalate the £61k finding to Sarah.",
          xp: 20,
          due_offset_mins: 120,
          project_ref: 'vantage-dashboard',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'How do I write standup notes correctly for the Nexus Pipeline team?',
        body: `Hey,

Sorry to bother you — Sarah keeps saying my standup notes are too long and unfocused for the Nexus Pipeline v2 daily. Can you show me what a good standup update looks like for this team?

James`,
        urgency: 'normal',
        task: {
          title: 'Coach James on standup format for Nexus Pipeline v2 daily',
          type: 'standup',
          urgency: 'normal',
          description: "James Obi's standup notes are too long and unfocused for the Nexus Pipeline v2 daily meeting. Write a brief coaching note: (1) what good standup notes look like for a data engineering team, (2) a simple template, (3) a worked example. Keep it practical, not patronising.",
          xp: 15,
          due_offset_mins: 90,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Your standup today was much clearer',
        body: `Hi,

Just wanted to say — your standup notes today were much better. Concise and clear. I took notes from how you structured it.

Thanks for the help earlier.

James`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'de_rachel',
    name: 'Rachel Mensah',
    role: 'Finance Business Partner',
    persona_key: 'hr',
    trigger_types: ['report'],
    templates: [
      {
        kind: 'action',
        subject: 'Cost report for Nexus Pipeline v2 infra spend needed',
        body: `Hi,

I'm putting together the Q4 cost review and need a breakdown of the Nexus Pipeline v2 infrastructure spend — cloud hosting, tooling licences, and API costs — by product line if possible.

Finance review is Friday.

Rachel Mensah
Finance BP`,
        urgency: 'normal',
        task: {
          title: 'Prepare Nexus Pipeline v2 infra cost breakdown for Finance',
          type: 'report',
          urgency: 'normal',
          description: 'Rachel Mensah (Finance BP) needs a breakdown of Q4 Nexus Pipeline v2 infrastructure spend by category: cloud hosting, tooling licences, and API costs. Break down by product line where possible. Note any unexpected cost spikes and flag savings opportunities.',
          xp: 25,
          due_offset_mins: 180,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Nexus Pipeline v2 cloud overspend — need explanation',
        body: `Hi,

I've flagged a 23% overspend on cloud costs for the Nexus Pipeline v2 vs Q4 budget. I need an explanation from the data team before I close the books. Can you give me a brief summary of what drove this?

Rachel`,
        urgency: 'high',
        task: {
          title: 'Explain Nexus Pipeline v2 Q4 cloud overspend to Finance',
          type: 'report',
          urgency: 'high',
          description: 'Rachel from Finance has flagged a 23% overspend on Nexus Pipeline v2 cloud costs vs Q4 budget. Write a brief explanation: (1) main drivers (was it the pipeline failures causing re-runs?), (2) one-off vs recurring costs, (3) proposed remediation or Q1 forecast adjustment. Be factual and clear.',
          xp: 30,
          due_offset_mins: 60,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Report received — thank you',
        body: `Hi,

Thanks for the report — it had everything I needed and was easy to follow. The cost breakdown by product line was particularly helpful.

I'll include it in the Q4 review pack.

Rachel`,
        urgency: 'normal',
      },
    ],
  },
]

// ── RELIABILITY ENGINEERING ────────────────────────────────────

const RELIABILITY_ENGINEERING: Colleague[] = [
  {
    id: 're_david',
    name: 'David Okafor',
    role: 'Production Manager',
    persona_key: 'client',
    trigger_types: ['decision', 'email_reply'],
    templates: [
      {
        kind: 'action',
        subject: 'Need an explanation of the Line 2 stoppage for the ops meeting',
        body: `Hi,

I need a written explanation of today's Line 2 stoppage for my 3pm ops meeting. Production lost 2.5 hours on the Line 2 reliability programme and the ops director is going to ask me what happened.

I need: what failed, why, how long it took to fix, and what prevents a recurrence. Keep it factual — no jargon.

David`,
        urgency: 'urgent',
        task: {
          title: 'Write Line 2 stoppage explanation for David',
          type: 'email_reply',
          urgency: 'urgent',
          description: "David Okafor (Production Manager) needs a factual explanation of today's Line 2 stoppage for the ops meeting. Draft a clear response covering: what failed, root cause, resolution time, and preventive measures. Keep it non-technical — David is production, not maintenance.",
          xp: 30,
          due_offset_mins: 30,
          project_ref: 'line-2-reliability',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'Production wants to run through the weekend — is the Line 2 kit safe?',
        body: `Hi,

We're being asked to run a weekend production shift due to a large order. Before I commit I need your assessment of whether the key equipment is fit to run for 16 hours Saturday.

Specifically Compressor 2 and the Line 3 conveyor — given everything that's happened on the Line 2 reliability programme this week. Give me your honest view.

David`,
        urgency: 'high',
        task: {
          title: 'Equipment fitness-to-run assessment for weekend shift — Line 2 and Compressor 2',
          type: 'decision',
          urgency: 'high',
          description: 'David needs your engineering assessment of whether Compressor 2 and the Line 3 conveyor are safe to run a 16-hour weekend shift. Review current equipment status from the Line 2 reliability programme, recent defect history, and outstanding work orders. Provide a clear go/no-go recommendation with your reasoning.',
          xp: 40,
          due_offset_mins: 45,
          project_ref: 'line-2-reliability',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good response on the Line 2 stoppage',
        body: `Hi,

Thanks for the clear write-up. The ops director was satisfied and it helped deflect some of the pressure from my team.

Keep communicating like that — it makes my job easier.

David`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 're_mike',
    name: 'Mike Kowalski',
    role: 'Maintenance Manager',
    persona_key: 'boss',
    trigger_types: ['document', 'report'],
    templates: [
      {
        kind: 'action',
        subject: 'Line 2 reliability programme: PM backlog report needed before Friday',
        body: `Hi,

I need a full PM backlog report for the Line 2 reliability programme before Friday's engineering review. Include all overdue work orders, age of each overdue task, and your proposed recovery schedule.

I need to show the plant manager we have a plan.

MK`,
        urgency: 'high',
        task: {
          title: 'Write Line 2 PM backlog recovery report for Friday',
          type: 'report',
          urgency: 'high',
          description: 'Mike needs a PM backlog report for the Line 2 reliability programme for the engineering review. List all overdue work orders, their age, root cause of the backlog, and a realistic recovery schedule. The plant manager will see this — it needs to be credible, not optimistic.',
          xp: 35,
          due_offset_mins: 120,
          project_ref: 'line-2-reliability',
          kpi_tag: 'reliability',
        },
      },
      {
        kind: 'action',
        subject: 'Update the risk register with Compressor 2 and Pasteuriser 1 issues',
        body: `Hi,

After today's events I need the risk register updated before end of shift. Add: Compressor 2 oil leak (risk level and monitoring plan) and the Pasteuriser 1 PM backlog (risk of failure if not cleared this week).

MK`,
        urgency: 'normal',
        task: {
          title: 'Update risk register with Compressor 2 maintenance and Pasteuriser 1 PM backlog',
          type: 'document',
          urgency: 'normal',
          description: 'Mike has asked you to update the maintenance risk register with two new entries: (1) Compressor 2 oil leak — risk level, current status from the compressor-2-maint programme, and monitoring plan; (2) Pasteuriser 1 PM backlog — failure risk if not cleared this week. Be specific and honest about severity.',
          xp: 20,
          due_offset_mins: 60,
          project_ref: 'compressor-2-maint',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good shift today',
        body: `Hi,

Just to say — you handled today well. The Line 2 bearing was dealt with quickly and your documentation was clear. David was happy with the communication too.

MK`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 're_sandra',
    name: 'Sandra Nwosu',
    role: 'Health & Safety Manager',
    persona_key: 'hr',
    trigger_types: ['decision'],
    templates: [
      {
        kind: 'action',
        subject: 'Near miss report required — Compressor 2 oil leak',
        body: `Hi,

The Compressor 2 oil leak falls within our near-miss reporting threshold under the compressor-2-maint programme. I need a completed near-miss report form before end of shift. This is a regulatory requirement.

Template is on the H&S shared drive.

Sandra`,
        urgency: 'urgent',
        task: {
          title: 'Complete near-miss report for Compressor 2 oil leak',
          type: 'document',
          urgency: 'urgent',
          description: 'Sandra Nwosu (H&S Manager) has flagged that the Compressor 2 oil leak requires a near-miss report under regulatory requirements. Write the near-miss report covering: incident description, contributory factors, immediate actions taken, and preventive measures. Be thorough — this is a legal document.',
          xp: 25,
          due_offset_mins: 40,
          project_ref: 'compressor-2-maint',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'H&S review of the Line 2 bearing replacement LOTO procedure',
        body: `Hi,

Following today's bearing replacement on Line 2, I need your confirmation that the LOTO procedure was followed correctly. Please write me a brief record of the safety steps taken.

This is for the Line 2 reliability programme audit trail.

Sandra`,
        urgency: 'normal',
        task: {
          title: 'Document LOTO compliance for Line 2 bearing replacement',
          type: 'decision',
          urgency: 'normal',
          description: "Sandra Nwosu needs a written record confirming the lockout/tagout (LOTO) procedure was correctly followed during today's Line 2 bearing replacement. Document each step taken, who authorised the work, and how equipment was made safe. This is for the Line 2 reliability programme regulatory audit trail.",
          xp: 20,
          due_offset_mins: 90,
          project_ref: 'line-2-reliability',
          kpi_tag: 'reliability',
        },
      },
      {
        kind: 'feedback',
        subject: 'Near-miss report was well completed',
        body: `Hi,

Thank you for submitting the near-miss report on time and with the required level of detail. The corrective actions section was particularly thorough.

Sandra`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 're_kwame',
    name: 'Kwame Asante',
    role: 'Junior Maintenance Technician',
    persona_key: 'marcus',
    trigger_types: ['standup'],
    templates: [
      {
        kind: 'action',
        subject: 'Confused about the Pasteuriser 1 PM plan — which tasks first?',
        body: `Hi,

Mike asked me to start on the Pasteuriser 1 PM work tomorrow morning as part of the PM backlog recovery. But I'm not sure which tasks to prioritise within the 30-minute window. Can you tell me what to do first?

Kwame`,
        urgency: 'normal',
        task: {
          title: 'Give Kwame clear instructions for Pasteuriser 1 PM window',
          type: 'standup',
          urgency: 'normal',
          description: 'Kwame Asante (Junior Technician) needs clear prioritisation for the 30-minute Pasteuriser 1 PM window tomorrow morning as part of the pasteuriser-pm backlog recovery. Write brief instructions: which tasks to complete first, what tools he will need, safety precautions, and how to report completion. Be clear — he is junior.',
          xp: 15,
          due_offset_mins: 60,
          project_ref: 'pasteuriser-pm',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'I found something on Conveyor 4 — should I report it to the Line 2 programme?',
        body: `Hi,

While I was checking Line 3 I noticed some unusual wear on the Conveyor 4 drive chain — looks similar to what happened on Conveyor 3 last week. I'm not sure if it's serious enough to log on the Line 2 reliability programme.

Can you have a look and tell me what to do?

Kwame`,
        urgency: 'normal',
        task: {
          title: 'Assess Conveyor 4 drive chain wear — coach Kwame',
          type: 'decision',
          urgency: 'normal',
          description: "Kwame has flagged unusual wear on the Conveyor 4 drive chain, similar to the Conveyor 3 failure that triggered the Line 2 reliability programme. Assess the severity and respond: (1) whether this warrants an immediate work order on the Line 2 programme, (2) what monitoring should be done, (3) coach Kwame on how to assess drive chain wear himself in future.",
          xp: 25,
          due_offset_mins: 90,
          project_ref: 'line-2-reliability',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Thanks for the clear instructions earlier',
        body: `Hi,

The Pasteuriser 1 PM went well this morning — I knew exactly what to do because of your instructions. Completed both tasks within the 30-minute window.

Kwame`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 're_tony',
    name: 'Tony Briggs',
    role: 'Procurement Manager',
    persona_key: 'hr',
    trigger_types: ['scope_decision'],
    templates: [
      {
        kind: 'action',
        subject: 'Emergency bearing order for Line 2 — need your spec now',
        body: `Hi,

I can get a bearing delivered by 6am tomorrow for the Line 2 reliability programme but I need your exact specification in the next 30 minutes or I'll miss the supplier's cut-off. Part number, tolerance grade, and quantity.

Tony`,
        urgency: 'urgent',
        task: {
          title: 'Provide bearing specification to Tony for emergency Line 2 order',
          type: 'scope_decision',
          urgency: 'urgent',
          description: 'Tony Briggs (Procurement) needs the exact bearing specification within 30 minutes to place an emergency order for the Line 2 reliability programme. Provide: part number, bearing type, tolerance grade, dimensions, and quantity. Also flag acceptable alternatives in case the exact spec is unavailable.',
          xp: 30,
          due_offset_mins: 25,
          project_ref: 'line-2-reliability',
          kpi_tag: 'reliability',
        },
      },
      {
        kind: 'action',
        subject: 'Should we dual-source the bearing supplier after this Line 2 emergency?',
        body: `Hi,

After today's scramble on the Line 2 reliability programme I think we should look at dual-sourcing the main drive bearings so we're not dependent on one supplier for emergency orders. Can you give me your view on what we should hold as on-site spares vs what we order on-demand?

Tony`,
        urgency: 'normal',
        task: {
          title: 'Write spares stockholding recommendation for Line 2 and Procurement',
          type: 'scope_decision',
          urgency: 'normal',
          description: 'Tony Briggs has asked for your recommendation on spare parts stockholding strategy for the Line 2 reliability programme. Consider: cost of holding spares vs downtime risk (at GBP 4,200/hour), which bearings are most critical for Line 2, lead times. Write a clear recommendation with justification.',
          xp: 25,
          due_offset_mins: 120,
          project_ref: 'line-2-reliability',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good spec — order is placed',
        body: `Hi,

Bearing spec was exactly what I needed. Order placed and confirmed for 6am delivery. Well done for having the detail to hand.

Tony`,
        urgency: 'normal',
      },
    ],
  },
]

// ── FINANCIAL ANALYSIS ─────────────────────────────────────────

const FINANCIAL_ANALYSIS: Colleague[] = [
  {
    id: 'fa_amara',
    name: 'Amara Osei',
    role: 'CFO',
    persona_key: 'boss',
    trigger_types: ['report', 'document'],
    templates: [
      {
        kind: 'action',
        subject: 'Q4 close board pack exec summary — I need it by 4pm',
        body: `Hi,

I need a one-page executive summary of your Q4 close variance analysis for the board pack. It must include: (1) headline finding, (2) top 3 drivers of the profit decline, (3) one recommendation.

Board pack locks at 4pm. Do not miss it.

AO`,
        urgency: 'urgent',
        task: {
          title: 'Write CFO exec summary for Q4 close board pack — 4pm deadline',
          type: 'document',
          urgency: 'urgent',
          description: 'Amara needs a one-page executive summary of your Q4 close variance analysis for the board pack. Include: (1) headline finding, (2) top 3 drivers of the profit decline, (3) one concrete recommendation. Board pack locks at 4pm — be concise, precise, and boardroom-ready.',
          xp: 45,
          due_offset_mins: 25,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Product launch model: downside scenario needs refreshing — FX assumptions changed',
        body: `Hi,

The macro team have revised their FX assumptions for the product launch financial model. I need the downside scenario refreshed to reflect a 12% GBP/USD decline instead of 8%.

Board meeting is tomorrow. How quickly can you turn this around?

AO`,
        urgency: 'urgent',
        task: {
          title: 'Refresh product launch downside scenario with revised FX assumptions',
          type: 'report',
          urgency: 'urgent',
          description: 'Amara needs the product launch financial model downside scenario refreshed: FX assumption changes from 8% to 12% GBP/USD decline. Update the model and document: (1) updated downside revenue and EBITDA, (2) sensitivity to the change, (3) any other assumptions you reviewed. Board meeting is tomorrow.',
          xp: 40,
          due_offset_mins: 60,
          project_ref: 'product-launch-fa',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'The board was pleased with the Q4 close analysis',
        body: `Hi,

The board found your Q4 close analysis clear and well-structured. The commentary on the drivers was particularly good — it saved me having to explain it myself.

AO`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'fa_daniel',
    name: 'Daniel Yeboah',
    role: 'FP&A Manager',
    persona_key: 'marcus',
    trigger_types: ['report'],
    templates: [
      {
        kind: 'action',
        subject: 'Q4 close: month-end actuals need your narrative commentary',
        body: `Hi,

I've loaded the Q4 close month-end actuals into the system but Amara wants narrative commentary on the key variances by tomorrow morning. Can you draft the commentary for the three biggest line items?

Daniel`,
        urgency: 'high',
        task: {
          title: 'Write Q4 close month-end variance commentary for Amara',
          type: 'report',
          urgency: 'high',
          description: 'Daniel has loaded Q4 close month-end actuals and Amara wants narrative commentary on the three largest variances. Write clear, concise commentary for each: what drove the variance, whether it is one-off or recurring, and the implication for the full-year forecast. This goes to the CFO.',
          xp: 35,
          due_offset_mins: 90,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Product launch model — your base case revenue assumption looks off',
        body: `Hi,

I noticed your product launch model base case assumes 8% revenue growth. Our latest pipeline data is tracking closer to 5–6%. I pulled the numbers:

---
PRODUCT LAUNCH MODEL — BASE CASE REVIEW
Prepared by: Daniel Yeboah, FP&A

Current base case assumption: 8.0% revenue growth
Latest pipeline tracking (as of Dec close): 5.4% growth implied
Key drivers of the gap:
  - Enterprise segment: 3 deals slipped to Q2 (combined ARR: £340k)
  - SME segment: on track (+6.1%)
  - International: below target by 18%

If revised to 5.5% growth:
  - Base case revenue: £18.4M → £17.6M (–£0.8M)
  - EBITDA impact: approx. –£0.5M (at current cost base)
  - NPV of product launch: £4.2M → £3.7M
---

I think the assumption needs revisiting before it goes to the board. Worth a second look?

Daniel`,
        urgency: 'normal',
        task: {
          title: 'Review and defend product launch model revenue growth assumption',
          type: 'report',
          urgency: 'normal',
          description: "Daniel has challenged the 8% revenue growth assumption in the product launch model base case, presenting pipeline data suggesting 5–6% is more realistic. His analysis shows a potential –£0.8M revenue and –£0.5M EBITDA impact if revised. Review the assumption, assess both positions, and write a clear response to Daniel (copying Amara) explaining your conclusion and rationale.",
          xp: 30,
          due_offset_mins: 120,
          project_ref: 'product-launch-fa',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Strong work on the Q4 variance analysis',
        body: `Hi,

Just read through your Q4 close variance analysis — the waterfall bridge was clear and the commentary was honest about the shortfalls. Amara specifically mentioned it.

Good work.

Daniel`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'fa_priya',
    name: 'Priya Chandrasekaran',
    role: 'Commercial Finance BP',
    persona_key: 'client',
    trigger_types: ['decision'],
    templates: [
      {
        kind: 'action',
        subject: 'Should we approve the marketing budget uplift for the product launch?',
        body: `Hi,

Marketing have requested a GBP 180k budget uplift for Q1 paid media to support the product launch financial model. They're projecting a 3x return. Amara has asked me to get a second opinion before she signs it off.

What's your view?

Priya`,
        urgency: 'high',
        task: {
          title: 'Analyse and recommend on marketing budget uplift for product launch model',
          type: 'decision',
          urgency: 'high',
          description: 'Amara has asked for a second opinion on a GBP 180k Q1 marketing budget uplift for the product launch model. Analyse the request: assess the credibility of the 3x return projection, identify risks, and provide a clear recommendation to Priya and Amara — approve, decline, or approve with conditions. Back your recommendation with numbers.',
          xp: 40,
          due_offset_mins: 60,
          project_ref: 'product-launch-fa',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'New commercial contract — financial terms need review before Q4 close',
        body: `Hi,

We have a new enterprise contract that Legal has cleared. Before Amara signs, she wants a financial review of the terms — specifically the payment schedule, penalties, and revenue recognition treatment. This needs to be resolved before the Q4 close.

Can you take a look?

Priya`,
        urgency: 'normal',
        task: {
          title: 'Review financial terms of new enterprise contract before Q4 close',
          type: 'decision',
          urgency: 'normal',
          description: 'Amara wants a financial review of a new enterprise contract before the Q4 close. Review: (1) payment schedule and cash flow implications, (2) penalty clauses and downside risk, (3) revenue recognition treatment under IFRS 15. Write a clear summary with your recommendation — approve, flag concerns, or request amendments.',
          xp: 35,
          due_offset_mins: 90,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good analysis on that decision',
        body: `Hi,

Your analysis was thorough and Amara appreciated the clear recommendation. The revenue recognition point was particularly astute — she hadn't spotted that.

Priya`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'fa_fatima',
    name: 'Fatima Al-Hassan',
    role: 'External Auditor — EY',
    persona_key: 'hr',
    trigger_types: ['document'],
    templates: [
      {
        kind: 'action',
        subject: 'Q4 close audit request — revenue recognition workings',
        body: `Hello,

As part of our Q4 close year-end audit procedures I need to review the revenue recognition workings for your top 5 contracts by value. Please provide the relevant documentation and supporting schedules by Friday.

Fatima Al-Hassan
EY`,
        urgency: 'high',
        task: {
          title: 'Prepare Q4 close revenue recognition audit pack for EY',
          type: 'document',
          urgency: 'high',
          description: 'External auditor Fatima Al-Hassan has requested Q4 close revenue recognition workings for your top 5 contracts by value. Prepare a clear audit pack: (1) contract summary for each, (2) revenue recognition method applied, (3) key judgements and their basis, (4) supporting calculations. Audit documentation must be precise and defensible.',
          xp: 35,
          due_offset_mins: 90,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Q4 close audit query — bad debt provision methodology',
        body: `Hello,

We have a query on the methodology used for the bad debt provision in the Q4 close. The current provision appears below sector benchmarks. Please provide a written explanation of the methodology and key assumptions.

Fatima Al-Hassan
EY`,
        urgency: 'normal',
        task: {
          title: "Respond to EY's Q4 close bad debt provision query",
          type: 'document',
          urgency: 'normal',
          description: "EY have flagged that the Q4 close bad debt provision appears below sector benchmarks. Write a clear, defensible explanation of: (1) the methodology used, (2) the key assumptions and their basis, (3) why the provision is appropriate given the company's specific debtor profile. This is a formal audit response.",
          xp: 30,
          due_offset_mins: 120,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Q4 close documentation received — no further queries at this stage',
        body: `Hello,

Thank you for the documentation. The revenue recognition workings were well-presented and the supporting schedules were complete. No further queries on this area at this stage.

Fatima Al-Hassan
EY`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'fa_chris',
    name: 'Chris Okafor',
    role: 'Commercial Director',
    persona_key: 'marcus',
    trigger_types: ['scope_decision'],
    templates: [
      {
        kind: 'action',
        subject: 'Can we discount this contract to win the deal? Q4 close implications?',
        body: `Hi,

We're close to landing a major new contract but the client is asking for a 15% discount. At the current margin, Finance won't like it — and it will hit the Q4 close numbers. Can you model the impact and tell me what the minimum acceptable discount is?

Chris`,
        urgency: 'urgent',
        task: {
          title: 'Model discount impact on proposed contract margin for Q4 close',
          type: 'scope_decision',
          urgency: 'urgent',
          description: "Chris Okafor wants to know the minimum acceptable discount on a major contract that would affect the Q4 close. Model the P&L impact of the requested 15% discount vs current pricing: (1) margin at each discount level, (2) break-even point, (3) your recommendation — whether to accept and at what conditions. Chris needs this before tomorrow's negotiation.",
          xp: 40,
          due_offset_mins: 45,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Product launch financials — do the numbers stack up before the board?',
        body: `Hi,

We're presenting the product launch financial model business case to the board next week. Can you give me your honest view on whether the financial projections are robust? I'd rather know now than be challenged in the boardroom.

Chris`,
        urgency: 'normal',
        task: {
          title: 'Challenge product launch financial model projections before board',
          type: 'scope_decision',
          urgency: 'normal',
          description: "Chris wants an honest financial review of the product launch financial model business case before the board presentation. Critique: (1) revenue assumptions — are they realistic given the Q4 close data?, (2) cost base — what's missing?, (3) the key risks the board will challenge. Write a structured brief — be direct, not diplomatic.",
          xp: 30,
          due_offset_mins: 120,
          project_ref: 'product-launch-fa',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'The model was exactly what I needed',
        body: `Hi,

Your analysis saved us from a bad deal. We ended up pushing back on the discount and the client accepted 8%. Your break-even analysis was the reason we held firm.

Chris`,
        urgency: 'normal',
      },
    ],
  },
]

// ── PRODUCT MANAGEMENT ─────────────────────────────────────────

const PRODUCT_MANAGEMENT: Colleague[] = [
  {
    id: 'pm_james',
    name: 'James Hargreaves',
    role: 'VP Product',
    persona_key: 'boss',
    trigger_types: ['decision', 'scope_decision'],
    templates: [
      {
        kind: 'action',
        subject: 'Nexus Platform Q1: I need your sprint backlog recommendation — now',
        body: `Morning,

Three stakeholders, one slot on the Nexus Platform Q1 roadmap. I want your recommendation by 10am with data to back it. Don't send me a summary of the three options — tell me which one we build and why.

JH`,
        urgency: 'urgent',
        task: {
          title: 'Provide Nexus Platform Q1 sprint priority recommendation to James',
          type: 'decision',
          urgency: 'urgent',
          description: "James wants a clear recommendation on which of the three competing Nexus Platform Q1 sprint backlog items to build. Write a decision brief: (1) your recommended option, (2) the data or logic that supports it, (3) how you will communicate the decision to the stakeholders whose items weren't chosen. Do not hedge.",
          xp: 40,
          due_offset_mins: 30,
          project_ref: 'nexus-platform-q1',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Priya is escalating on the Vantage integration — I want a plan before she reaches the board',
        body: `Hi,

Priya has emailed again about the Vantage Corp integration. If we don't act today she's going to the board. I want a plan from you before 12pm: what we're doing, when she will see results, and how we get in front of the narrative.

JH`,
        urgency: 'urgent',
        task: {
          title: 'Write Vantage integration escalation management plan for Priya',
          type: 'scope_decision',
          urgency: 'urgent',
          description: "Priya Shah is threatening to escalate to the board about the delayed Vantage Corp integration feature. Write a management plan for James: (1) what we commit to delivering and by when, (2) the message we proactively send to Priya today, (3) what we need internally to deliver on the commitment. Be realistic — do not over-promise.",
          xp: 45,
          due_offset_mins: 40,
          project_ref: 'vantage-integration',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good decision under pressure on the Q1 roadmap',
        body: `Quick note — the way you handled the Nexus Platform Q1 sprint backlog decision was professional. Clear reasoning, and you communicated it well to the stakeholders. That's the standard I expect.

JH`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'pm_sarah',
    name: 'Sarah Chen',
    role: 'Senior Developer',
    persona_key: 'sarah',
    trigger_types: ['document', 'scope_decision'],
    templates: [
      {
        kind: 'action',
        subject: 'Nexus Platform Q1: this user story is not ready for dev',
        body: `Hi,

I've read the reporting feature user story for the Nexus Platform Q1 roadmap. There are gaps — the acceptance criteria don't cover edge cases and the data source is undefined. I can't start building from this.

Here's what I have so far:

---
USER STORY DRAFT v0.1 — Reporting Feature
Written by: James (PM)

As a: dashboard user
I want to: see a revenue summary report
So that: I can understand performance

Acceptance criteria:
  - Report loads on the reports page
  - Shows revenue data
  - Has a date filter

Notes: Uses the main database. Design TBC.
---

This is not sufficient. I need edge cases (empty state, partial data, permissions), a defined data source (which table? which API?), and a success metric. I can't estimate it from this.

Can you rewrite it to a level where I can actually estimate it?

SE`,
        urgency: 'high',
        task: {
          title: 'Rewrite Nexus Platform Q1 reporting feature user story to dev-ready standard',
          type: 'document',
          urgency: 'high',
          description: "Sarah Chen (Senior Dev) has flagged that the Nexus Platform Q1 reporting feature user story is incomplete. Her draft has: vague acceptance criteria, undefined data source, no edge cases, no success metric. Rewrite it to a dev-ready standard: clear user need, full acceptance criteria covering edge cases, defined data source and API, and a worked example of the expected output. Sarah needs to estimate it — leave nothing ambiguous.",
          xp: 35,
          due_offset_mins: 60,
          project_ref: 'nexus-platform-q1',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'FYI — I am not available to build the extra Vantage integration feature Marcus agreed',
        body: `FYI — I've just heard from Marcus that he told the Vantage Corp client we'd add a bulk export feature to the integration by Friday. I have no capacity for this and it was never on the roadmap.

You need to sort this out. I'm not committing to something I wasn't consulted on.

SE`,
        urgency: 'urgent',
        task: {
          title: 'Resolve capacity conflict between Marcus and Sarah on Vantage integration',
          type: 'scope_decision',
          urgency: 'urgent',
          description: "Marcus has committed the Vantage Corp client to a bulk export feature by Friday without consulting the dev team. Sarah has no capacity. Resolve this professionally: (1) assess whether Friday is feasible, (2) decide what to communicate to the Vantage Corp client, (3) establish how to prevent Marcus making unilateral commitments on the integration in future.",
          xp: 40,
          due_offset_mins: 30,
          project_ref: 'vantage-integration',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'feedback',
        subject: 'Nexus Platform Q1 user story was much better',
        body: `Hi,

The revised user story was clear enough to estimate. Acceptance criteria were specific and the edge cases were covered. That's the standard we need.

SE`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'pm_marcus',
    name: 'Marcus Adeyemi',
    role: 'Sales Lead',
    persona_key: 'marcus',
    trigger_types: ['email_reply'],
    templates: [
      {
        kind: 'action',
        subject: 'Priya is escalating the Vantage integration — need your help',
        body: `Hi,

Just a heads up — Priya has emailed me again about the Vantage Corp integration feature. She's not happy and mentioned going to the board.

I know this isn't ideal timing but can you draft a response to her? I'll review before it goes. We need to get ahead of this.

Marcus`,
        urgency: 'urgent',
        task: {
          title: 'Draft response to Priya Shah Vantage integration escalation',
          type: 'email_reply',
          urgency: 'urgent',
          description: "Marcus needs you to draft a response to Priya Shah who is threatening to escalate to the board about the delayed Vantage Corp integration feature. Draft a professional response that: (1) acknowledges her frustration honestly, (2) explains the delay without making excuses, (3) proposes a concrete next step with a realistic date. Marcus will review before it's sent.",
          xp: 40,
          due_offset_mins: 20,
          project_ref: 'vantage-integration',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'I may have over-promised a Nexus Platform demo timeline',
        body: `Hey,

Okay so I may have told the prospect that we could have a live Nexus Platform Q1 demo ready by Thursday. Is that possible? I know it's tight but it's a big deal.

Marcus`,
        urgency: 'high',
        task: {
          title: 'Respond to Marcus about Nexus Platform demo timeline feasibility',
          type: 'email_reply',
          urgency: 'high',
          description: "Marcus has committed to a Thursday Nexus Platform Q1 demo without checking with the product team. Respond professionally: (1) assess whether Thursday is feasible given current sprint state, (2) if not, what is the earliest realistic date, (3) advise Marcus on what he should tell the prospect. Be direct — do not just say yes to make him feel better.",
          xp: 30,
          due_offset_mins: 40,
          project_ref: 'nexus-platform-q1',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Priya came back positively on the Vantage integration response',
        body: `Hey,

Just heard from Priya — she was really happy with the response. Said it was clear, honest, and gave her what she needed to brief her board on the Vantage integration.

Nice work!

Marcus`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'pm_yemi',
    name: 'Yemi Adeyinka',
    role: 'UX Designer',
    persona_key: 'hr',
    trigger_types: ['document'],
    templates: [
      {
        kind: 'action',
        subject: 'Need a brief before I start the Nexus Platform onboarding UX',
        body: `Hi,

I'm ready to start the UX for the new Nexus Platform Q1 onboarding flow but I don't have a clear brief. I need: target user, the key actions they need to complete, and what success looks like. Can you write this up for me?

Yemi`,
        urgency: 'normal',
        task: {
          title: 'Write UX brief for Nexus Platform Q1 onboarding flow',
          type: 'document',
          urgency: 'normal',
          description: 'Yemi Adeyinka (UX Designer) needs a brief before starting the Nexus Platform Q1 onboarding flow designs. Write a clear UX brief: (1) target user persona and context, (2) key actions the user must complete in onboarding, (3) definition of success — what does a good onboarding completion look like?, (4) any constraints or non-negotiables.',
          xp: 25,
          due_offset_mins: 90,
          project_ref: 'nexus-platform-q1',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Vantage integration dashboard design review — quick turnaround needed',
        body: `Hi,

I've shared the first design mockups for the Vantage Corp integration dashboard in Figma. I need written feedback before I progress to the next iteration — specifically on the navigation structure and the data visualisation choices.

Yemi`,
        urgency: 'normal',
        task: {
          title: 'Provide structured feedback on Vantage integration dashboard design mockups',
          type: 'document',
          urgency: 'normal',
          description: "Yemi has shared design mockups for the Vantage Corp integration dashboard and needs structured written feedback. Review from a product and user perspective: (1) does the navigation structure match Priya's team's mental models?, (2) are the data visualisation choices appropriate for the target audience?, (3) three specific changes you'd prioritise.",
          xp: 20,
          due_offset_mins: 120,
          project_ref: 'vantage-integration',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Brief was exactly what I needed for the Nexus Platform onboarding',
        body: `Hi,

Thank you for the UX brief — it was clear and gave me everything I needed to start. The user persona context was particularly helpful. Designs for the Nexus Platform onboarding are underway.

Yemi`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'pm_priya',
    name: 'Priya Shah',
    role: 'Enterprise Client — Vantage Corp',
    persona_key: 'client',
    trigger_types: ['email_reply'],
    templates: [
      {
        kind: 'action',
        subject: 'Vantage Corp integration feature still not live — I need answers',
        body: `Hi,

The Vantage Corp integration feature promised two weeks ago is still not live. My team is blocked and I am running out of patience. I need a clear explanation of what has happened and when I can expect this resolved.

Priya Shah
Vantage Corp`,
        urgency: 'urgent',
        task: {
          title: 'Respond to Priya Shah Vantage integration feature delay escalation',
          type: 'email_reply',
          urgency: 'urgent',
          description: "Priya Shah is escalating about a Vantage Corp integration feature that is 2 weeks late. Draft a professional response that: (1) acknowledges the delay honestly, (2) explains what caused it without being defensive, (3) gives a clear, realistic delivery date, (4) proposes interim support. James Hargreaves is copied in.",
          xp: 40,
          due_offset_mins: 20,
          project_ref: 'vantage-integration',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'New requirement for the Vantage integration — can we add this to the current sprint?',
        body: `Hi,

Following our last meeting I have a new requirement for the Vantage Corp integration that I believe is essential for our go-live. It should only take a day or two. Can this be added to the current sprint?

Priya Shah`,
        urgency: 'high',
        task: {
          title: "Respond to Priya's mid-sprint Vantage integration change request",
          type: 'email_reply',
          urgency: 'high',
          description: "Priya Shah has requested a mid-sprint change to the Vantage Corp integration, estimating 'a day or two'. Draft a professional response: (1) acknowledge the request, (2) explain the process for assessing mid-sprint changes and their impact on delivery, (3) either accept with clear conditions or defer to next sprint with a reason.",
          xp: 30,
          due_offset_mins: 40,
          project_ref: 'vantage-integration',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'feedback',
        subject: 'Thank you for the honest update on the Vantage integration',
        body: `Hi,

I appreciate the transparency in your last response about the Vantage Corp integration. It was more honest than I expected and the proposed interim solution was helpful. We can work with this timeline.

Priya Shah`,
        urgency: 'normal',
      },
    ],
  },
]

// ── PROJECT MANAGEMENT ─────────────────────────────────────────

const PROJECT_MANAGEMENT: Colleague[] = [
  {
    id: 'pjm_james',
    name: 'James Hargreaves',
    role: 'Programme Director',
    persona_key: 'boss',
    trigger_types: ['report', 'document'],
    templates: [
      {
        kind: 'action',
        subject: 'Nexus CRM rollout: I want a recovery plan before the board call',
        body: `Morning,

The Amber status on the Nexus CRM rollout RAG report is going to trigger questions. I want a draft recovery plan on my desk before the 2pm board call — covering what has slipped, why, and how we get back on track.

One page. Be honest.

JH`,
        urgency: 'urgent',
        task: {
          title: 'Write Nexus CRM rollout recovery plan for board call',
          type: 'document',
          urgency: 'urgent',
          description: "James needs a one-page Nexus CRM rollout recovery plan before the 2pm board call: (1) what has slipped and why, (2) revised timeline with milestones, (3) resources needed to recover, (4) risks if recovery plan isn't approved. Be direct — the board will challenge vague plans.",
          xp: 45,
          due_offset_mins: 30,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Nexus CRM rollout RAID log needs updating — board will ask',
        body: `Hi,

The Nexus CRM rollout RAID log hasn't been updated in two weeks. The board will want to see it and it needs to reflect current status. Update it today — all four quadrants. Pay particular attention to the new risks from the scope change.

JH`,
        urgency: 'high',
        task: {
          title: 'Update Nexus CRM rollout RAID log with current risks',
          type: 'report',
          urgency: 'high',
          description: 'James needs the Nexus CRM rollout RAID log updated across all four quadrants (Risks, Assumptions, Issues, Dependencies). Ensure the risk register reflects: (1) new risks introduced by the scope change request, (2) current status of all open issues, (3) updated dependency timeline. The board will review this.',
          xp: 30,
          due_offset_mins: 60,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'reliability',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good Nexus CRM rollout report — honest and clear',
        body: `The Nexus CRM rollout RAG status report was the best I've seen from this project team. Honest about where we are, clear on the actions. That's how you build trust with a board.

JH`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'pjm_rachel',
    name: 'Rachel Okonkwo',
    role: 'Client PMO Lead',
    persona_key: 'client',
    trigger_types: ['scope_decision', 'email_reply'],
    templates: [
      {
        kind: 'action',
        subject: 'Nexus CRM rollout change request submitted — when can we discuss?',
        body: `Hi,

We've submitted a change request for the three additional features on the Nexus CRM rollout. I understand this has timeline implications but these features are critical for our board approval of phase 2.

When can we discuss?

Rachel Okonkwo
Client PMO Lead`,
        urgency: 'high',
        task: {
          title: 'Respond to Nexus CRM rollout client change request — impact assessment',
          type: 'scope_decision',
          urgency: 'high',
          description: "Rachel Okonkwo has submitted a change request for three new features at 75% through the Nexus CRM rollout. Respond professionally: (1) acknowledge the request, (2) provide a preliminary impact assessment (timeline, cost, resource), (3) propose a formal change control meeting. Do not accept or reject without a proper assessment.",
          xp: 40,
          due_offset_mins: 45,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'action',
        subject: 'Nexus CRM rollout: emergency call requested by client sponsor',
        body: `Hi,

The client sponsor has heard the Nexus CRM rollout is behind and has requested an emergency call today. She wants to understand the situation directly.

Can you arrange this and confirm with me?

Rachel Okonkwo`,
        urgency: 'urgent',
        task: {
          title: 'Arrange and prepare for emergency Nexus CRM rollout sponsor call',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'The Nexus CRM rollout client sponsor wants an emergency call today. Respond to Rachel: (1) propose a call time (2pm or 4pm today), (2) set a brief agenda, (3) confirm who should attend from your side. Also write a 3-point internal brief to prepare your team.',
          xp: 35,
          due_offset_mins: 25,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Nexus CRM rollout: sponsor was reassured',
        body: `Hi,

The call went well. The sponsor said she felt properly briefed about the Nexus CRM rollout for the first time. Your status update was clear and the recovery plan gave her confidence.

Rachel Okonkwo`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'pjm_ben',
    name: 'Ben Afolabi',
    role: 'Technical Architect',
    persona_key: 'sarah',
    trigger_types: ['decision'],
    templates: [
      {
        kind: 'action',
        subject: 'Nexus CRM rollout: technical risk — new scope will break the architecture',
        body: `Hi,

I need to flag a technical risk on the Nexus CRM rollout. The three features in the change request require changes to the core data model that will take 3 weeks, not the 2 days the client thinks. If we commit to the timeline without accounting for this, we will fail.

Ben`,
        urgency: 'urgent',
        task: {
          title: 'Address technical architecture risk in Nexus CRM rollout change request',
          type: 'decision',
          urgency: 'urgent',
          description: "Ben Afolabi has flagged a critical technical risk: the Nexus CRM rollout change request requires 3 weeks of data model work, not 2 days. You need to decide: (1) how to incorporate this into the change control impact assessment, (2) how to communicate this to the client without losing the relationship, (3) your recommended approach.",
          xp: 40,
          due_offset_mins: 30,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Nexus CRM rollout build vs buy — I need a PM view',
        body: `Hi,

We need to decide whether to build the reporting module for the Nexus CRM rollout in-house or use a third-party tool. I have a technical view but James wants your perspective on the project risk and commercial implications.

Ben`,
        urgency: 'normal',
        task: {
          title: 'Build vs buy recommendation for Nexus CRM rollout reporting module',
          type: 'decision',
          urgency: 'normal',
          description: "Ben needs your project management perspective on a build vs buy decision for the Nexus CRM rollout reporting module. Evaluate from a PM lens: (1) build — timeline risk, team capacity, long-term maintenance; (2) buy — integration risk, cost, vendor dependency; (3) your recommendation with rationale.",
          xp: 30,
          due_offset_mins: 90,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good call on the Nexus CRM rollout architecture decision',
        body: `Hi,

The decision you made on the Nexus CRM rollout architecture issue was the right one. You managed the client expectation professionally while protecting the integrity of the delivery.

Ben`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'pjm_sandra',
    name: 'Sandra Nwosu',
    role: 'Legal & Contracts',
    persona_key: 'hr',
    trigger_types: ['document'],
    templates: [
      {
        kind: 'action',
        subject: 'Nexus CRM rollout change request needs a formal Variation Order',
        body: `Hi,

Any change to the Nexus CRM rollout scope needs to be formalised in a Variation Order before work begins. Without it, the client can dispute the additional cost.

Can you draft the Variation Order for the three new features? I can review before it goes to the client.

Sandra`,
        urgency: 'high',
        task: {
          title: 'Draft Variation Order for Nexus CRM rollout client change request',
          type: 'document',
          urgency: 'high',
          description: "Sandra needs a formal Variation Order drafted for the Nexus CRM rollout three-feature change request. Include: (1) description of the additional scope, (2) additional timeline (in working days), (3) additional cost (outline estimate), (4) impact on project completion date, (5) client approval signature block. Sandra will review before it goes to the client.",
          xp: 30,
          due_offset_mins: 90,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Nexus CRM rollout client communications creating contractual risk',
        body: `Hi,

I've been reviewing the email chain on the Nexus CRM rollout and some of the language being used is creating contractual ambiguity around deliverables. I need you to write a formal clarification email to the client to reset expectations.

Sandra`,
        urgency: 'high',
        task: {
          title: 'Write contractual clarification email to Nexus CRM rollout client',
          type: 'document',
          urgency: 'high',
          description: "Sandra has identified that informal email communications on the Nexus CRM rollout have created contractual ambiguity around project deliverables. Write a professional clarification email that: (1) references the contract, (2) clearly restates the agreed scope, (3) corrects any implied commitments, (4) proposes a formal sign-off of agreed scope. Must be approved by Sandra before sending.",
          xp: 35,
          due_offset_mins: 60,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Nexus CRM rollout Variation Order was well drafted',
        body: `Hi,

The Variation Order for the Nexus CRM rollout was well structured and covered all the necessary contractual elements. Client has signed it. We're protected.

Sandra`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'pjm_kwame',
    name: 'Kwame Asante',
    role: 'Junior Project Manager',
    persona_key: 'marcus',
    trigger_types: ['standup'],
    templates: [
      {
        kind: 'action',
        subject: 'Not sure how to handle a tricky stakeholder situation on the Nexus CRM rollout',
        body: `Hi,

I had a difficult conversation with one of the Nexus CRM rollout workstream leads today. They pushed back on a deadline I gave them and I didn't know how to handle it. Can you advise?

Kwame`,
        urgency: 'normal',
        task: {
          title: 'Coach Kwame on stakeholder challenge management for Nexus CRM rollout',
          type: 'standup',
          urgency: 'normal',
          description: 'Kwame Asante (Junior PM) is struggling to handle a Nexus CRM rollout workstream lead who is pushing back on deadlines. Write a coaching response: (1) how to approach the conversation, (2) the difference between a legitimate concern and resistance, (3) how to document and escalate if needed.',
          xp: 15,
          due_offset_mins: 60,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'Can you review my Nexus CRM rollout status update before I send it to James?',
        body: `Hi,

I've written my first Nexus CRM rollout project status update for James and I want to make sure it's in the right format and tone. Can you take a quick look before I send it?

Here's my draft:

---
NEXUS CRM ROLLOUT — WEEK 2 STATUS UPDATE
Author: Kwame Asante, Junior PM

Overall status: GREEN

Progress this week:
- Had a meeting with the client on Tuesday
- The dev team is working on things
- Some stakeholders are happy, some not so much
- We talked about the scope change

Risks: There might be some risks with the timeline
Actions: Need to follow up with some people

Next week: More meetings and development work
---

I'm not sure if it's at the right level for James. Can you give me feedback?

Kwame`,
        urgency: 'normal',
        task: {
          title: "Review Kwame's draft Nexus CRM rollout status update",
          type: 'document',
          urgency: 'normal',
          description: "Kwame has drafted his first Nexus CRM rollout status update for the Programme Director. His draft has significant issues: the RAG status is unsupported (project is Amber, not Green), progress notes are vague, risks are unspecific, and actions have no owners or dates. Review it and write structured feedback: (1) identify the specific problems, (2) what RAG status it should actually be and why, (3) what a proper status update looks like, (4) what he should do differently next time.",
          xp: 20,
          due_offset_mins: 90,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Thanks for the coaching — stakeholder conversation went well',
        body: `Hi,

I had the conversation with the Nexus CRM rollout workstream lead today using your advice. It went much better. We agreed a revised deadline and I documented it properly.

Kwame`,
        urgency: 'normal',
      },
    ],
  },
]

// ── DIGITAL MARKETING ──────────────────────────────────────────

const DIGITAL_MARKETING: Colleague[] = [
  {
    id: 'dm_james',
    name: 'James Hargreaves',
    role: 'Head of Growth & Marketing',
    persona_key: 'boss',
    trigger_types: ['report', 'decision'],
    templates: [
      {
        kind: 'action',
        subject: 'Q1 growth campaign: I need a recommendation, not a summary',
        body: `Morning,

I've read your Q1 growth campaign performance summary. What I actually need is a recommendation — what do we do next? Adjust the targeting? Kill one ad set? Shift budget?

Give me a decision with a rationale. 3pm.

JH`,
        urgency: 'urgent',
        task: {
          title: 'Write Q1 growth campaign optimisation recommendation for James',
          type: 'decision',
          urgency: 'urgent',
          description: "James wants a clear Q1 growth campaign recommendation, not more data. Write a 1-page recommendation: (1) your recommended action (specific — e.g. kill ad set 2, increase budget on set 3 by 40%), (2) the data that supports this, (3) expected impact and how you'll measure success. No hedging.",
          xp: 40,
          due_offset_mins: 30,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Q1 growth campaign performance report template is weak — rewrite it',
        body: `Hi,

This quarter's Q1 growth campaign performance report is harder to read than it should be. The executive summary doesn't lead with the key insight and the data is buried.

Rewrite the template and apply it to this quarter's data. I want the new version to set the standard going forward.

JH`,
        urgency: 'normal',
        task: {
          title: 'Rewrite Q1 growth campaign performance report template',
          type: 'report',
          urgency: 'normal',
          description: "James wants the Q1 growth campaign performance report template improved. Create a new version that: (1) leads with the key business insight (not data), (2) structures the report for executive readers, (3) makes recommendations prominent. Apply the new template to this quarter's campaign data to demonstrate the improvement.",
          xp: 30,
          due_offset_mins: 120,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: "Q1 growth campaign: good recommendation — we're moving on it",
        body: `Your Q1 growth campaign recommendation was clear and well-backed. We're reallocating the budget as you suggested. Let's see if the ROAS improves as predicted.

JH`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'dm_tom',
    name: 'Tom Asiwe',
    role: 'Paid Media Specialist',
    persona_key: 'marcus',
    trigger_types: ['decision', 'report'],
    templates: [
      {
        kind: 'action',
        subject: 'Q1 growth campaign budget cut — how do we split it across the three ad sets?',
        body: `Hi,

With the 40% Q1 growth campaign budget cut, I need a decision on how to redistribute across the three active ad sets. My view is we should kill the worst performer and consolidate, but James said to check with you first.

What do you think?

Tom`,
        urgency: 'urgent',
        task: {
          title: 'Decide how to redistribute Q1 growth campaign budget after 40% cut',
          type: 'decision',
          urgency: 'urgent',
          description: 'Tom needs a decision on redistributing the Q1 growth campaign budget after a 40% cut across three ad sets. Make a clear recommendation: which ad set(s) to pause, how to reallocate the remaining budget, and the rationale. Tom will implement your recommendation.',
          xp: 35,
          due_offset_mins: 30,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'action',
        subject: 'Q1 growth campaign Q4 ROAS report — can you review my methodology before I send to James?',
        body: `Hi,

I've put together the Q4 ROAS report for the Q1 growth campaign but I'm not confident in the attribution model I've used. Here's what I've got so far:

---
Q4 ROAS REPORT — DRAFT
Q1 Growth Campaign | Prepared by: Tom Asiwe

Attribution model used: Last-click (GA4 default)

Results:
  Ad Set 1 (Paid Search): ROAS 4.2x | Spend: £12,400 | Revenue attributed: £52,080
  Ad Set 2 (Paid Social): ROAS 1.8x | Spend: £18,600 | Revenue attributed: £33,480
  Ad Set 3 (Display): ROAS 0.9x | Spend: £6,200 | Revenue attributed: £5,580

Blended ROAS: 2.6x | Total spend: £37,200 | Total revenue: £91,140

Note: CRM shows only £68,400 total revenue from this period — there's a £22,740 discrepancy I can't explain.

My conclusion: Paid Search is clearly the best performer and Display should be cut.
---

Can you review the methodology and let me know if the numbers are defensible?

Tom`,
        urgency: 'normal',
        task: {
          title: "Review Tom's Q4 ROAS report methodology for the Q1 growth campaign",
          type: 'report',
          urgency: 'normal',
          description: "Tom is uncertain about the attribution model in his Q4 ROAS report for the Q1 growth campaign. His draft uses last-click attribution and shows a £22,740 discrepancy between GA4 and CRM revenue. Review the methodology: (1) is last-click attribution appropriate for this campaign mix?, (2) what is causing the GA4/CRM discrepancy?, (3) are his conclusions about Paid Search and Display correct given the attribution issue?, (4) what caveats should he include? Write a structured review he can use to strengthen the report before it goes to James.",
          xp: 25,
          due_offset_mins: 90,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Q1 growth campaign budget reallocation is performing well',
        body: `Hi,

Two days in and the consolidated budget on ad set 1 is already showing improved ROAS. Your call on killing ad set 3 was the right one.

Tom`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'dm_yemi',
    name: 'Yemi Adeyinka',
    role: 'Content Strategist',
    persona_key: 'hr',
    trigger_types: ['document'],
    templates: [
      {
        kind: 'action',
        subject: 'Need landing page copy for Nexus product launch — design team is waiting',
        body: `Hi,

The design team needs the hero copy for the new Nexus product launch landing page. They're ready to start but I can't give them anything without your approval.

Hero headline, subheadline, and CTA. Audience: mid-market B2B buyers. Can you write or approve something today?

Yemi`,
        urgency: 'high',
        task: {
          title: 'Write Nexus product launch landing page hero copy for B2B audience',
          type: 'document',
          urgency: 'high',
          description: 'Yemi needs approved Nexus product launch landing page hero copy for the design team. Write: (1) hero headline — max 8 words, benefit-led, (2) subheadline — max 20 words, expands on the headline, (3) CTA button text — max 4 words. Audience: mid-market B2B buyers. Include a brief rationale for your copy choices.',
          xp: 25,
          due_offset_mins: 60,
          project_ref: 'nexus-product-launch',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Content brief for Nexus product launch email nurture sequence',
        body: `Hi,

We're building a 3-email nurture sequence for new Nexus product launch trial sign-ups. I need a content brief before I start writing. What are the three core messages we want to land in each email?

Yemi`,
        urgency: 'normal',
        task: {
          title: 'Write content brief for Nexus product launch 3-email nurture sequence',
          type: 'document',
          urgency: 'normal',
          description: 'Yemi needs a content brief for a 3-email nurture sequence targeting new Nexus product launch trial sign-ups. Write a brief that covers: (1) the goal and audience for each email, (2) the core message or call-to-action, (3) tone — product-led, educational, or social proof-focused?, (4) what outcome you want from each email (open, click, conversion).',
          xp: 20,
          due_offset_mins: 120,
          project_ref: 'nexus-product-launch',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Nexus product launch copy approved — design has started',
        body: `Hi,

Design team loved the headline for the Nexus product launch — they said it was the clearest brief they'd been given in months. They've already started the layout.

Yemi`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'dm_rachel',
    name: 'Rachel Mensah',
    role: 'Head of Sales',
    persona_key: 'client',
    trigger_types: ['email_reply'],
    templates: [
      {
        kind: 'action',
        subject: 'Q1 growth campaign leads are not converting — I need answers',
        body: `Hi,

We've followed up on the last 80 leads from the Q1 growth campaign paid media and the close rate is 4%. The quality is not there. Can you investigate what's happening and tell me what you're going to do about it?

Rachel Mensah
Head of Sales`,
        urgency: 'urgent',
        task: {
          title: 'Respond to Rachel: Q1 growth campaign paid media lead quality issue',
          type: 'email_reply',
          urgency: 'urgent',
          description: "Rachel Mensah (Head of Sales) has escalated that Q1 growth campaign paid media leads have a 4% close rate. Draft a professional response: (1) acknowledge the issue and take ownership, (2) outline what you will investigate (targeting, messaging, landing page, lead scoring), (3) propose a joint review with the sales team to align on ICP. Do not be defensive.",
          xp: 35,
          due_offset_mins: 25,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'Can the Q1 growth campaign support a Q1 pipeline push?',
        body: `Hi,

We're 22% behind on Q1 pipeline target and James has asked sales and marketing to come up with a joint plan. Can you put together a short campaign brief for an accelerated Q1 push using the existing Q1 growth campaign budget?

Rachel`,
        urgency: 'high',
        task: {
          title: 'Write accelerated Q1 growth campaign pipeline push brief',
          type: 'email_reply',
          urgency: 'high',
          description: 'Rachel needs a marketing campaign brief to support the Q1 pipeline push (22% below target) using the Q1 growth campaign budget. Draft a campaign brief: (1) campaign objective and target pipeline contribution, (2) channels and tactics, (3) timeline, (4) budget requirement. The brief will be presented to James — make it action-ready.',
          xp: 30,
          due_offset_mins: 60,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Q1 growth campaign lead quality has improved',
        body: `Hi,

I don't normally send emails like this but the lead quality from the last Q1 growth campaign batch was noticeably better. The team has commented on it. Whatever you changed in the targeting worked.

Rachel Mensah`,
        urgency: 'normal',
      },
    ],
  },
  {
    id: 'dm_daniel',
    name: 'Daniel Yeboah',
    role: 'Marketing Analyst',
    persona_key: 'marcus',
    trigger_types: ['report'],
    templates: [
      {
        kind: 'action',
        subject: 'Q1 growth campaign attribution model is giving conflicting results — help needed',
        body: `Hi,

I'm getting very different revenue attribution numbers from GA4 and our CRM for the Q1 growth campaign. GA4 says email is driving 42% of revenue; CRM says 18%. I can't present conflicting data to James.

How should I approach this?

Daniel`,
        urgency: 'high',
        task: {
          title: 'Help Daniel resolve Q1 growth campaign GA4 vs CRM attribution discrepancy',
          type: 'report',
          urgency: 'high',
          description: "Daniel Yeboah is struggling with a major Q1 growth campaign attribution discrepancy between GA4 (42% email revenue) and CRM (18%). Help him resolve this: (1) explain the likely causes (attribution windows, model differences, UTM tracking gaps), (2) recommend which figure to use for reporting and why, (3) advise on how to present the limitation to James.",
          xp: 30,
          due_offset_mins: 60,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Competitor analysis needed for Q1 growth campaign strategy review',
        body: `Hi,

James wants a competitor marketing analysis for next week's Q1 growth campaign strategy review. I can pull the data but I need guidance on what to include and how to structure it.

Daniel`,
        urgency: 'normal',
        task: {
          title: 'Structure and commission Q1 growth campaign competitor marketing analysis',
          type: 'report',
          urgency: 'normal',
          description: "Daniel needs direction on structuring the competitor marketing analysis for the Q1 growth campaign strategy review. Write a brief for him: (1) which competitors to include and why, (2) what dimensions to analyse (channels, messaging, positioning, campaign cadence), (3) the format and length James expects, (4) the strategic question the analysis should answer.",
          xp: 25,
          due_offset_mins: 120,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Q1 growth campaign attribution framework was really helpful',
        body: `Hi,

The framework you gave me made the Q1 growth campaign attribution problem much clearer. I was able to explain the discrepancy to James and he was satisfied with the reasoning.

Daniel`,
        urgency: 'normal',
      },
    ],
  },
]

// ── Master lookup ──────────────────────────────────────────────

export const COLLEAGUES: Record<string, Colleague[]> = {
  data_engineering: DATA_ENGINEERING,
  reliability_engineering: RELIABILITY_ENGINEERING,
  financial_analysis: FINANCIAL_ANALYSIS,
  product_management: PRODUCT_MANAGEMENT,
  project_management: PROJECT_MANAGEMENT,
  digital_marketing: DIGITAL_MARKETING,
}

/**
 * Find an eligible colleague to message after a task completion.
 * Matches on trigger_types. Excludes colleagues who have already sent a message this session.
 */
export function findEligibleColleague(
  careerPath: string,
  completedTaskType: string,
  alreadyMessagedIds: string[]
): Colleague | null {
  const roster = COLLEAGUES[careerPath] ?? []
  const eligible = roster.filter(c =>
    c.trigger_types.includes(completedTaskType) &&
    !alreadyMessagedIds.includes(c.id)
  )
  if (eligible.length === 0) return null
  return eligible[Math.floor(Math.random() * eligible.length)]
}

/**
 * Pick a template from a colleague using 70/30 action/feedback split.
 */
export function pickTemplate(colleague: Colleague): MessageTemplate {
  const roll = Math.random()
  if (roll < 0.7) {
    const actionIdx = Math.random() < 0.5 ? 0 : 1
    return colleague.templates[actionIdx]
  }
  return colleague.templates[2]
}
