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
  project_ref: string
  task: FollowupTask
}

export interface FeedbackTemplate {
  kind: 'feedback'
  subject: string
  body: string
  urgency: 'normal' | 'high'
  project_ref: string
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
        subject: 'Quick one — Vantage Dashboard project has stopped refreshing',
        body: `Hey,

Sorry to drop this on you but the Vantage Dashboard project stopped refreshing about 20 minutes ago. Priya's team noticed first — they're trying to pull data for a board presentation this afternoon.

I think it's the Nexus Pipeline v2 feed into the Vantage Dashboard project but I'm not sure where to start. Can you investigate and let me know your findings? Client expects a status update by 2pm.

Cheers
Marcus`,
        urgency: 'urgent',
        project_ref: 'vantage-dashboard',
        task: {
          title: 'Investigate Vantage Dashboard project data refresh failure',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'Marcus has pinged you directly. The Vantage Dashboard project stopped refreshing 20 minutes ago — likely a Nexus Pipeline v2 feed issue. Investigate and reply to Marcus with your initial findings, suspected root cause, and next steps. Client presentation is this afternoon.',
          xp: 35,
          due_offset_mins: 30,
          project_ref: 'vantage-dashboard',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Client wants new revenue chart on the Vantage Dashboard project this sprint',
        body: `Hey,

Just off the phone with Priya. She wants a revenue breakdown chart added to the Vantage Dashboard project — says it's critical for next week's board presentation.

I know we're mid-sprint on the Nexus Pipeline v2 work but she's a key account. Can you assess the effort and tell me if it's feasible? Need to come back to her by EOD.

Marcus`,
        urgency: 'high',
        project_ref: 'vantage-dashboard',
        task: {
          title: "Assess Priya's Vantage Dashboard revenue chart request — sprint impact",
          type: 'scope_decision',
          urgency: 'high',
          description: "Marcus has committed to assessing a new Vantage Dashboard project feature mid-sprint. Evaluate adding a revenue breakdown chart alongside the current Nexus Pipeline v2 work and respond: can it be done this sprint, or does it move to next? Include your rationale and any risks to pipeline delivery.",
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

Just wanted to say — the way you handled that decision was spot on. Priya came back to me happy and the Vantage Dashboard project team was satisfied with the explanation.

Marcus`,
        urgency: 'normal',
        project_ref: 'vantage-dashboard',
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
        subject: 'Board wants a data quality health summary by 4pm — Data Quality Beta programme',
        body: `FYI — board have asked for a one-page data health summary before their 4pm call. This is for the Data Quality Beta programme review. They want: current Nexus Pipeline v2 ingest status, Q4 data quality score across all feeds, and the three highest-priority known issues.

You are writing it.

SE`,
        urgency: 'urgent',
        project_ref: 'data-quality-beta',
        task: {
          title: 'Write data quality health summary for board — Data Quality Beta programme (4pm)',
          type: 'document',
          urgency: 'urgent',
          description: "Sarah needs a one-page data health summary for the board's 4pm call as part of the Data Quality Beta programme review. Include: (1) Nexus Pipeline v2 current ingest status, (2) Q4 data quality score across all feeds, (3) three highest-priority known issues and mitigations. Non-technical audience — keep it clear and honest.",
          xp: 40,
          due_offset_mins: 25,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Data Quality Beta: SQL query needed to surface customer record gaps',
        body: `For the record — as part of the Data Quality Beta programme I need a SQL query that identifies customer records with missing or malformed data in the core fields: customer_id, email, segment, and created_at. Flag the count per field and the affected date range.

Needed for the 3pm data quality review with Finance.

SE`,
        urgency: 'normal',
        project_ref: 'data-quality-beta',
        task: {
          title: 'Write SQL: identify customer record data quality gaps for Data Quality Beta programme',
          type: 'document',
          urgency: 'normal',
          description: 'Sarah needs a SQL query for the Data Quality Beta programme finance review: identify customer records with null or malformed values in customer_id, email, segment, and created_at. Return the count per field and affected date range. Add a brief comment explaining your approach and any assumptions.',
          xp: 25,
          due_offset_mins: 90,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'That Data Quality Beta report was solid',
        body: `For the record — the board was happy with the Data Quality Beta programme analysis. Figures were clear and the narrative made sense to non-technical people.

Keep that standard.

SE`,
        urgency: 'normal',
        project_ref: 'data-quality-beta',
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
        subject: 'Vantage Dashboard project data export is broken — urgent',
        body: `Hi,

Our team is trying to export last month's campaign data from the Vantage Dashboard project but the export keeps failing with a 500 error. We have a client presentation tomorrow morning and need this data tonight.

Can you resolve this as a priority please?

Priya Shah
Vantage Corp`,
        urgency: 'urgent',
        project_ref: 'vantage-dashboard',
        task: {
          title: 'Respond to Priya: Vantage Dashboard project data export failure',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'Priya Shah has reported that the Vantage Dashboard project data export is failing with a 500 error ahead of a client presentation. Draft a professional response acknowledging the issue, explaining your investigation approach (likely a Nexus Pipeline v2 connection issue), and providing a realistic resolution timeline.',
          xp: 35,
          due_offset_mins: 20,
          project_ref: 'vantage-dashboard',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'Q3 data discrepancy in the Vantage Dashboard project — can you investigate?',
        body: `Hi,

We are reviewing the Q3 revenue figures in the Vantage Dashboard project and there seems to be a GBP 45k discrepancy vs our internal system. Before we raise this with our CFO we wanted to check with you first.

Could you investigate this? It may be a Nexus Pipeline v2 data issue.

Priya Shah`,
        urgency: 'high',
        project_ref: 'vantage-dashboard',
        task: {
          title: 'Investigate Q3 revenue discrepancy in Vantage Dashboard project flagged by client',
          type: 'email_reply',
          urgency: 'high',
          description: 'Priya Shah has flagged a GBP 45k discrepancy between Vantage Dashboard project revenue figures and their internal system — likely a Nexus Pipeline v2 data issue. Respond professionally: acknowledge the query, explain your investigation approach, and commit to a timeframe. This will be seen by the client CFO.',
          xp: 30,
          due_offset_mins: 45,
          project_ref: 'vantage-dashboard',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Thank you for the quick turnaround on the Vantage Dashboard',
        body: `Hi,

Just a quick note — I appreciate how promptly you responded. The team was relieved to have a clear update on the Vantage Dashboard project.

This is exactly the kind of service we expect from Nexus.

Priya Shah`,
        urgency: 'normal',
        project_ref: 'vantage-dashboard',
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
        subject: 'Can you review my Q4 Nexus Pipeline v2 analysis before I send it to Sarah?',
        body: `Hi,

I've finished my first draft of the Q4 anomaly analysis for the Nexus Pipeline v2 project. Sarah said I should ask a senior analyst to check it before sending. Can you take a look?

---
Q4 DATA ANOMALY ANALYSIS — DRAFT v0.1
Analyst: James Obi | Nexus Pipeline v2 project
Date range analysed: Q4 (October – December 2024)
Data source: nexus_pipeline.sales_transactions

FINDING 1: REVENUE SPIKE — 14 December 2024
  Daily value: £2,347,891 (Q4 daily average: £156,000)
  Assessment: Data entry error — likely a manual test transaction or duplicate input.
  Recommended action: Flag to data ops team for deletion before Q4 close.

FINDING 2: NULL VALUES — customer_id field
  Count: 847 null records in November transactions (4.2% of Nov volume)
  Assessment: Low priority. Likely new customer records not yet linked to accounts.
  Recommended action: No action needed at this time.

FINDING 3: DUPLICATE TRANSACTION IDs
  Found: TX-4421, TX-4422, TX-4419 (combined value ~£61k)
  Assessment: Confirmed duplicates from the Dec pipeline ingestion run.
  Recommended action: Remove duplicates before Q4 close reporting.

Overall: Q4 revenue is overstated by approximately £61k (duplicates confirmed). The Dec spike appears to be a data entry error. No structural pipeline issues identified.
Confidence: Medium.
---

Anything I've missed? I want to send this to Sarah today.

James`,
        urgency: 'normal',
        project_ref: 'nexus-pipeline-v2',
        task: {
          title: "Review James's Q4 Nexus Pipeline v2 anomaly analysis — three errors to catch",
          type: 'document',
          urgency: 'normal',
          description: "James Obi has submitted a Q4 anomaly analysis for the Nexus Pipeline v2 project. His draft contains three significant errors. ERROR 1: The £2.3M revenue spike on 14 Dec is flagged as a 'data entry error' and marked for deletion — but this was a legitimate bulk order from Hartwell Group, clearly visible in the CRM system. Deleting it would understate Q4 revenue. ERROR 2: The 847 null values in customer_id for November transactions are flagged as 'no action needed' — but null customer_id values break the attribution pipeline downstream, causing revenue to go untracked in subsequent reporting. ERROR 3: The analysis covers 'Q4 October–December 2024' — but Q4 at Nexus Digital runs November–January, not October–December. James has analysed the wrong date range entirely. Write structured review feedback for James: identify all three errors specifically, explain why each matters and what the correct action is, and note what he has done well. Rubric: (1) did you identify all three errors with specifics?, (2) was feedback constructive and actionable for a junior analyst?, (3) was tone appropriate — supportive but clear?",
          xp: 25,
          due_offset_mins: 90,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'How do I write standup notes correctly for the Nexus Pipeline v2 daily?',
        body: `Hey,

Sorry to bother you — Sarah keeps saying my standup notes are too long and unfocused for the Nexus Pipeline v2 daily. Can you show me what a good standup update looks like for this project?

James`,
        urgency: 'normal',
        project_ref: 'nexus-pipeline-v2',
        task: {
          title: 'Coach James on standup format for Nexus Pipeline v2 daily',
          type: 'standup',
          urgency: 'normal',
          description: "James Obi's standup notes are too long and unfocused for the Nexus Pipeline v2 daily meeting. Write a brief coaching note: (1) what good standup notes look like for a data engineering team, (2) a simple template (yesterday / today / blockers), (3) a worked example relevant to pipeline work. Keep it practical, not patronising.",
          xp: 15,
          due_offset_mins: 90,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Your Nexus Pipeline v2 standup today was much clearer',
        body: `Hi,

Just wanted to say — your standup notes today on the Nexus Pipeline v2 daily were much better. Concise and clear. I took notes from how you structured it.

Thanks for the help earlier.

James`,
        urgency: 'normal',
        project_ref: 'nexus-pipeline-v2',
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
        subject: 'Cost report for Nexus Pipeline v2 infrastructure spend needed',
        body: `Hi,

I'm putting together the Q4 cost review and need a breakdown of the Nexus Pipeline v2 project infrastructure spend — cloud hosting, tooling licences, and API costs — by product line if possible.

Finance review is Friday.

Rachel Mensah
Finance BP`,
        urgency: 'normal',
        project_ref: 'nexus-pipeline-v2',
        task: {
          title: 'Prepare Nexus Pipeline v2 infra cost breakdown for Finance',
          type: 'report',
          urgency: 'normal',
          description: 'Rachel Mensah (Finance BP) needs a breakdown of Q4 Nexus Pipeline v2 project infrastructure spend by category: cloud hosting, tooling licences, and API costs. Break down by product line where possible. Note any unexpected cost spikes and flag savings opportunities.',
          xp: 25,
          due_offset_mins: 180,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Nexus Pipeline v2 cloud overspend — need explanation before I close the books',
        body: `Hi,

I've flagged a 23% overspend on cloud costs for the Nexus Pipeline v2 project vs Q4 budget. I need an explanation from the data team before I close the books. Can you give me a brief summary of what drove this?

Rachel`,
        urgency: 'high',
        project_ref: 'nexus-pipeline-v2',
        task: {
          title: 'Explain Nexus Pipeline v2 Q4 cloud overspend to Finance',
          type: 'report',
          urgency: 'high',
          description: 'Rachel from Finance has flagged a 23% overspend on Nexus Pipeline v2 project cloud costs vs Q4 budget. Write a brief explanation: (1) main drivers (was it the pipeline failures causing re-runs?), (2) one-off vs recurring costs, (3) proposed remediation or Q1 forecast adjustment. Be factual and clear.',
          xp: 30,
          due_offset_mins: 60,
          project_ref: 'nexus-pipeline-v2',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Nexus Pipeline v2 cost report received — thank you',
        body: `Hi,

Thanks for the Nexus Pipeline v2 report — it had everything I needed and was easy to follow. The cost breakdown by product line was particularly helpful.

I'll include it in the Q4 review pack.

Rachel`,
        urgency: 'normal',
        project_ref: 'nexus-pipeline-v2',
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
        subject: 'Need an explanation of the Line 2 stoppage (Compressor 2 maintenance issue) for ops meeting',
        body: `Hi,

I need a written explanation of today's Line 2 stoppage for my 3pm ops meeting. Production lost 2.5 hours and the ops director is going to ask me what happened. I understand it's related to the Compressor 2 maintenance programme.

I need: what failed, why, how long it took to fix, and what prevents a recurrence. Keep it factual — no jargon.

David`,
        urgency: 'urgent',
        project_ref: 'compressor-2-maint',
        task: {
          title: 'Write Line 2 stoppage explanation (Compressor 2 maintenance programme) for David',
          type: 'email_reply',
          urgency: 'urgent',
          description: "David Okafor (Production Manager) needs a factual explanation of today's Line 2 stoppage — linked to the Compressor 2 maintenance programme — for the ops meeting. Draft a clear response covering: what failed, root cause, resolution time, and preventive measures. Keep it non-technical — David is production, not maintenance.",
          xp: 30,
          due_offset_mins: 30,
          project_ref: 'compressor-2-maint',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'Production wants to run through the weekend — is the Compressor 2 kit safe?',
        body: `Hi,

We're being asked to run a weekend production shift due to a large order. Before I commit I need your assessment of whether the key equipment is fit to run for 16 hours Saturday.

Specifically Compressor 2 (given the ongoing Compressor 2 maintenance programme) and the Line 3 conveyor. Give me your honest view.

David`,
        urgency: 'high',
        project_ref: 'compressor-2-maint',
        task: {
          title: 'Equipment fitness-to-run assessment for weekend shift — Compressor 2 and Line 3',
          type: 'decision',
          urgency: 'high',
          description: 'David needs your engineering assessment of whether Compressor 2 (current Compressor 2 maintenance programme status) and the Line 3 conveyor are safe to run a 16-hour weekend shift. Review current equipment status, recent defect history, and outstanding work orders. Provide a clear go/no-go recommendation with your reasoning.',
          xp: 40,
          due_offset_mins: 45,
          project_ref: 'compressor-2-maint',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good response on the Compressor 2 stoppage',
        body: `Hi,

Thanks for the clear write-up on the Compressor 2 maintenance issue. The ops director was satisfied and it helped deflect some of the pressure from my team.

Keep communicating like that — it makes my job easier.

David`,
        urgency: 'normal',
        project_ref: 'compressor-2-maint',
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
        subject: 'Pasteuriser PM programme: backlog recovery report needed before Friday',
        body: `Hi,

I need a full PM backlog recovery report for the Pasteuriser PM programme before Friday's engineering review. Include all overdue work orders on Pasteuriser 1, age of each overdue task, and your proposed recovery schedule.

I need to show the plant manager we have a plan.

MK`,
        urgency: 'high',
        project_ref: 'pasteuriser-pm',
        task: {
          title: 'Write Pasteuriser PM programme backlog recovery report for Friday',
          type: 'report',
          urgency: 'high',
          description: 'Mike needs a PM backlog recovery report for the Pasteuriser PM programme for the engineering review. List all overdue Pasteuriser 1 work orders, their age, root cause of the backlog, and a realistic recovery schedule. The plant manager will see this — it needs to be credible, not optimistic.',
          xp: 35,
          due_offset_mins: 120,
          project_ref: 'pasteuriser-pm',
          kpi_tag: 'reliability',
        },
      },
      {
        kind: 'action',
        subject: 'Update the risk register — Compressor 2 oil leak and Pasteuriser 1 PM backlog',
        body: `Hi,

After today's events I need the risk register updated before end of shift. Add: Compressor 2 oil leak (risk level and monitoring plan from the Compressor 2 maintenance programme) and the Pasteuriser 1 PM backlog from the Pasteuriser PM programme (risk of failure if not cleared this week).

MK`,
        urgency: 'normal',
        project_ref: 'pasteuriser-pm',
        task: {
          title: 'Update risk register with Compressor 2 maintenance and Pasteuriser PM backlog',
          type: 'document',
          urgency: 'normal',
          description: 'Mike has asked you to update the maintenance risk register with two new entries: (1) Compressor 2 oil leak (Compressor 2 maintenance programme) — risk level, current status, and monitoring plan; (2) Pasteuriser 1 PM backlog (Pasteuriser PM programme) — failure risk if not cleared this week. Be specific and honest about severity.',
          xp: 20,
          due_offset_mins: 60,
          project_ref: 'pasteuriser-pm',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good shift today — Pasteuriser PM and Compressor sorted',
        body: `Hi,

Just to say — you handled today well. The Pasteuriser PM backlog was dealt with methodically and your documentation on the Compressor 2 maintenance programme was clear. David was happy with the communication too.

MK`,
        urgency: 'normal',
        project_ref: 'pasteuriser-pm',
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
        subject: 'Near-miss report required — Pasteuriser 1 gearbox overheat during PM inspection',
        body: `Hi,

During today's Pasteuriser PM programme inspection, the gearbox overheat event falls within our near-miss reporting threshold. I need a completed near-miss report form before end of shift — this is a regulatory requirement.

Template is on the H&S shared drive. Reference the Pasteuriser PM programme work order in your report.

Sandra`,
        urgency: 'urgent',
        project_ref: 'pasteuriser-pm',
        task: {
          title: 'Complete near-miss report for Pasteuriser 1 gearbox overheat',
          type: 'document',
          urgency: 'urgent',
          description: 'Sandra Nwosu (H&S Manager) has flagged that a Pasteuriser 1 gearbox overheat event during the Pasteuriser PM programme requires a near-miss report. Write the near-miss report covering: incident description, contributory factors (was PM overdue the contributing cause?), immediate actions taken, and preventive measures. This is a legal document — be thorough.',
          xp: 25,
          due_offset_mins: 40,
          project_ref: 'pasteuriser-pm',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'H&S review of the Pasteuriser 1 PM LOTO procedure — confirmation needed',
        body: `Hi,

Following today's Pasteuriser PM programme maintenance window, I need your confirmation that the LOTO procedure was followed correctly. Please write me a brief record of the safety steps taken.

This is for the Pasteuriser PM programme audit trail.

Sandra`,
        urgency: 'normal',
        project_ref: 'pasteuriser-pm',
        task: {
          title: 'Document LOTO compliance for Pasteuriser 1 PM maintenance window',
          type: 'decision',
          urgency: 'normal',
          description: "Sandra Nwosu needs a written record confirming the lockout/tagout (LOTO) procedure was correctly followed during today's Pasteuriser PM programme maintenance window. Document each step taken, who authorised the work, and how equipment was made safe. This is for the Pasteuriser PM programme regulatory audit trail.",
          xp: 20,
          due_offset_mins: 90,
          project_ref: 'pasteuriser-pm',
          kpi_tag: 'reliability',
        },
      },
      {
        kind: 'feedback',
        subject: 'Pasteuriser PM near-miss report was well completed',
        body: `Hi,

Thank you for submitting the Pasteuriser PM programme near-miss report on time and with the required level of detail. The corrective actions section was particularly thorough.

Sandra`,
        urgency: 'normal',
        project_ref: 'pasteuriser-pm',
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
        subject: 'Night shift handover notes for Line 2 Reliability programme — can you check before I submit to Mike?',
        body: `Hi,

Just finished my night shift. I've written up my handover notes for Mike but it's only my third solo shift on the Line 2 Reliability programme and I want to make sure I haven't missed anything. Can you check?

---
NIGHT SHIFT HANDOVER NOTES
Technician: Kwame Asante | 22:00–06:00 | Line 2 Reliability programme

Equipment readings and status:

Conveyor 3, Line 2:  Bearing replacement completed 23:15. Running normal. Oil temp 72°C. No issues. ✓
Pasteuriser 1:       PM tasks overdue — PM-1032 (gasket inspection) and PM-1033 (temp probe calibration). Flagged for morning shift. ✓
Compressor 2:        Oil leak contained, temporary shaft seal holding. Pressure 6.2 bar (normal range). Monitoring every 30 mins. ✓
Boiler Room:         Temperature 84°C, pressure nominal. No anomalies noted. ✓

Actions completed this shift:
— Line 2 bearing replacement log updated in CMMS (Work Order #WO-2841)
— Compressor 2 oil sample collected and labelled for analysis

Outstanding for morning shift:
— Pasteuriser 1 PM backlog tasks (PM-1032, PM-1033)
— Compressor 2 continuous monitoring until permanent seal repair

---

Looks complete to me. Anything I've missed?

Kwame`,
        urgency: 'normal',
        project_ref: 'line-2-reliability',
        task: {
          title: "Review Kwame's Line 2 Reliability programme night shift handover — identify missing entry",
          type: 'document',
          urgency: 'normal',
          description: "Kwame Asante (Junior Technician) has submitted his night shift handover notes for the Line 2 Reliability programme and asked you to review them before he submits to Mike. The notes look professional but are missing one significant item: at 05:30, steam trap ST-04 in the Boiler Room was making an unusual knocking noise that Kwame noticed but did not log. Unlogged equipment anomalies are a maintenance safety issue and a compliance risk — if the steam trap fails unannounced on the next shift, there is no audit trail. Review the handover notes, identify the missing entry, and respond with: (1) what is missing specifically (ST-04 steam trap noise at 05:30), (2) why logging equipment anomalies matters even when they seem minor, (3) what action to take now (log ST-04 anomaly in CMMS immediately and flag for inspection). Rubric: (1) did you identify the specific missing item?, (2) was feedback constructive and actionable?, (3) was tone appropriate for a junior technician on their third solo shift?",
          xp: 20,
          due_offset_mins: 60,
          project_ref: 'line-2-reliability',
          kpi_tag: 'reliability',
        },
      },
      {
        kind: 'action',
        subject: 'I found something on Conveyor 4 — should I report it to the Line 2 Reliability programme?',
        body: `Hi,

While I was checking Line 3 I noticed some unusual wear on the Conveyor 4 drive chain — looks similar to what happened on Conveyor 3 last week before the bearing failure on the Line 2 Reliability programme.

I'm not sure if it's serious enough to log. Can you have a look and tell me what to do?

Kwame`,
        urgency: 'normal',
        project_ref: 'line-2-reliability',
        task: {
          title: 'Assess Conveyor 4 drive chain wear — coach Kwame on escalation',
          type: 'decision',
          urgency: 'normal',
          description: "Kwame has flagged unusual wear on the Conveyor 4 drive chain, similar to the Conveyor 3 failure that triggered the Line 2 Reliability programme. Assess the severity and respond: (1) whether this warrants an immediate work order on the Line 2 Reliability programme, (2) what monitoring should be done, (3) coach Kwame on how to assess drive chain wear himself in future so he can make the call independently.",
          xp: 25,
          due_offset_mins: 90,
          project_ref: 'line-2-reliability',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good handover notes on the Line 2 Reliability programme shift',
        body: `Hi,

The Line 2 Reliability programme handover was clear this morning — I knew exactly what was outstanding and what had been done. That's the standard.

Kwame`,
        urgency: 'normal',
        project_ref: 'line-2-reliability',
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
        subject: 'Emergency bearing order for Line 2 Reliability programme — need your spec now',
        body: `Hi,

I can get a bearing delivered by 6am tomorrow for the Line 2 Reliability programme but I need your exact specification in the next 30 minutes or I'll miss the supplier's cut-off. Part number, tolerance grade, and quantity.

Tony`,
        urgency: 'urgent',
        project_ref: 'line-2-reliability',
        task: {
          title: 'Provide bearing specification to Tony for emergency Line 2 Reliability programme order',
          type: 'scope_decision',
          urgency: 'urgent',
          description: 'Tony Briggs (Procurement) needs the exact bearing specification within 30 minutes to place an emergency order for the Line 2 Reliability programme. Provide: part number, bearing type, tolerance grade, dimensions, and quantity. Also flag acceptable alternatives in case the exact spec is unavailable.',
          xp: 30,
          due_offset_mins: 25,
          project_ref: 'line-2-reliability',
          kpi_tag: 'reliability',
        },
      },
      {
        kind: 'action',
        subject: 'Should we dual-source bearings after the Line 2 Reliability programme emergency?',
        body: `Hi,

After today's scramble on the Line 2 Reliability programme I think we should look at dual-sourcing the main drive bearings so we're not dependent on one supplier for emergency orders. Can you give me your view on what we should hold as on-site spares vs what we order on-demand?

Tony`,
        urgency: 'normal',
        project_ref: 'line-2-reliability',
        task: {
          title: 'Write spares stockholding recommendation for Line 2 Reliability programme',
          type: 'scope_decision',
          urgency: 'normal',
          description: 'Tony Briggs has asked for your recommendation on spare parts stockholding strategy following the Line 2 Reliability programme emergency. Consider: cost of holding spares vs downtime risk (at GBP 4,200/hour), which bearings are most critical for Line 2, lead times from current suppliers. Write a clear recommendation with justification.',
          xp: 25,
          due_offset_mins: 120,
          project_ref: 'line-2-reliability',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good spec — Line 2 Reliability programme order is placed',
        body: `Hi,

Bearing spec was exactly what I needed for the Line 2 Reliability programme emergency. Order placed and confirmed for 6am delivery. Well done for having the detail to hand.

Tony`,
        urgency: 'normal',
        project_ref: 'line-2-reliability',
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
        subject: 'Q4 Close project board pack exec summary — I need it by 4pm',
        body: `Hi,

I need a one-page executive summary of your Q4 Close project variance analysis for the board pack. It must include: (1) headline finding, (2) top 3 drivers of the profit variance, (3) one recommendation.

Board pack locks at 4pm. Do not miss it.

AO`,
        urgency: 'urgent',
        project_ref: 'q4-close',
        task: {
          title: 'Write CFO exec summary for Q4 Close project board pack — 4pm deadline',
          type: 'document',
          urgency: 'urgent',
          description: 'Amara needs a one-page executive summary of your Q4 Close project variance analysis for the board pack. Include: (1) headline finding, (2) top 3 drivers of the profit variance, (3) one concrete recommendation. Board pack locks at 4pm — be concise, precise, and boardroom-ready.',
          xp: 45,
          due_offset_mins: 25,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Product Launch financial model: downside scenario needs refreshing — FX assumptions changed',
        body: `Hi,

The macro team have revised their FX assumptions for the Product Launch financial model. I need the downside scenario refreshed to reflect a 12% GBP/USD decline instead of 8%.

Board meeting is tomorrow. How quickly can you turn this around?

AO`,
        urgency: 'urgent',
        project_ref: 'q4-close',
        task: {
          title: 'Refresh Product Launch financial model downside scenario with revised FX assumptions',
          type: 'report',
          urgency: 'urgent',
          description: 'Amara needs the Product Launch financial model downside scenario refreshed: FX assumption changes from 8% to 12% GBP/USD decline. Update the model and document: (1) updated downside revenue and EBITDA, (2) sensitivity to the change, (3) any other assumptions you reviewed. Board meeting is tomorrow.',
          xp: 40,
          due_offset_mins: 60,
          project_ref: 'product-launch-fa',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'The board was pleased with the Q4 Close project analysis',
        body: `Hi,

The board found your Q4 Close project analysis clear and well-structured. The commentary on the drivers was particularly good — it saved me having to explain it myself.

AO`,
        urgency: 'normal',
        project_ref: 'q4-close',
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
        subject: 'Q4 Close project variance analysis — can you check my overhead section?',
        body: `Hi,

I've drafted the Q4 Close project variance analysis summary. Amara wants narrative commentary but before I send it can you check the overhead allocation section — I'm not confident I've used the right headcount number.

---
Q4 CLOSE PROJECT — VARIANCE ANALYSIS DRAFT v1
Prepared by: Daniel Yeboah, FP&A

                    Budget      Actual      Variance    % Var
Revenue             £4,200K     £4,800K     +£600K      +14.3%
  → Hartwell Group contract (Nov): £620K upfront revenue recognition

COGS                £1,900K     £2,400K     –£500K      –26.3%
  → Supplier raw material costs up 18%; expedited freight charges

Gross Margin        54.8%       50.0%       –4.8pp
  → Margin compression primarily due to supplier cost increases

Overheads           £890K       £920K       –£30K       –3.4%
  → Allocation basis: 142 FTE @ £6,268/FTE
  → I used last year's approved headcount from the Q4 Close budget model

Note: I believe someone mentioned we're now at 158 FTE but I wasn't sure which figure to use for the actuals. I defaulted to the budgeted headcount.

Gross Profit        £2,300K     £2,400K     +£100K      +4.3%
EBITDA: broadly in line with budget.
---

Does the overhead section look right to you?

Daniel`,
        urgency: 'high',
        project_ref: 'q4-close',
        task: {
          title: "Review Daniel's Q4 Close project variance analysis — headcount error to catch",
          type: 'report',
          urgency: 'high',
          description: "Daniel Yeboah has drafted a Q4 Close project variance analysis that contains a material error in the overhead allocation. He has used last year's budgeted headcount of 142 FTE instead of the current actual headcount of 158 FTE. At his own allocation rate of £6,268/FTE, this understates overhead by approximately £187K (16 additional FTE × £6,268). The correct overhead figure should be approximately £1,107K, not £920K — meaning gross profit is actually closer to £2,213K, not £2,400K, and gross margin is worse than his draft shows. Review Daniel's draft: (1) identify the headcount error specifically — name the incorrect number (142 FTE), the correct number (158 FTE), and the approximate financial impact (£187K understatement), (2) explain the correct approach (actuals analysis must use current actual headcount, not the prior year budget), (3) note what he has done well. Rubric: (1) did you identify the specific headcount error and quantify the impact?, (2) was feedback constructive and actionable?, (3) was tone appropriate for a junior FP&A colleague?",
          xp: 35,
          due_offset_mins: 90,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Product Launch financial model — your base case revenue assumption looks off',
        body: `Hi,

I noticed your Product Launch financial model base case assumes 8% revenue growth. Our latest pipeline data is tracking closer to 5–6%. I pulled the numbers:

---
PRODUCT LAUNCH FINANCIAL MODEL — BASE CASE REVIEW
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
        project_ref: 'q4-close',
        task: {
          title: 'Review and defend Product Launch financial model revenue growth assumption',
          type: 'report',
          urgency: 'normal',
          description: "Daniel has challenged the 8% revenue growth assumption in the Product Launch financial model base case, presenting pipeline data suggesting 5–6% is more realistic. His analysis shows a potential –£0.8M revenue and –£0.5M EBITDA impact if revised. Review the assumption, assess both positions, and write a clear response to Daniel (copying Amara) explaining your conclusion and rationale.",
          xp: 30,
          due_offset_mins: 120,
          project_ref: 'product-launch-fa',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Strong work on the Q4 Close project variance analysis',
        body: `Hi,

Just read through your Q4 Close project variance analysis — the waterfall bridge was clear and the commentary was honest about the shortfalls. Amara specifically mentioned it.

Good work.

Daniel`,
        urgency: 'normal',
        project_ref: 'q4-close',
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
        subject: 'Should we approve the marketing budget uplift for the Product Launch financial model?',
        body: `Hi,

Marketing have requested a GBP 180k budget uplift for Q1 paid media to support the Product Launch financial model. They're projecting a 3x return. Amara has asked me to get a second opinion before she signs it off.

What's your view?

Priya`,
        urgency: 'high',
        project_ref: 'product-launch-fa',
        task: {
          title: 'Analyse and recommend on marketing budget uplift for Product Launch financial model',
          type: 'decision',
          urgency: 'high',
          description: 'Amara has asked for a second opinion on a GBP 180k Q1 marketing budget uplift for the Product Launch financial model. Analyse the request: assess the credibility of the 3x return projection, identify risks, and provide a clear recommendation to Priya and Amara — approve, decline, or approve with conditions. Back your recommendation with numbers.',
          xp: 40,
          due_offset_mins: 60,
          project_ref: 'product-launch-fa',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'New commercial contract — financial terms need review before Q4 Close',
        body: `Hi,

We have a new enterprise contract that Legal has cleared. Before Amara signs, she wants a financial review of the terms — specifically the payment schedule, penalties, and revenue recognition treatment. This needs to be resolved before the Q4 Close project deadline.

Can you take a look?

Priya`,
        urgency: 'normal',
        project_ref: 'product-launch-fa',
        task: {
          title: 'Review financial terms of new enterprise contract before Q4 Close project deadline',
          type: 'decision',
          urgency: 'normal',
          description: 'Amara wants a financial review of a new enterprise contract before the Q4 Close project deadline. Review: (1) payment schedule and cash flow implications, (2) penalty clauses and downside risk, (3) revenue recognition treatment under IFRS 15. Write a clear summary with your recommendation — approve, flag concerns, or request amendments.',
          xp: 35,
          due_offset_mins: 90,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good analysis on the Product Launch financial model decision',
        body: `Hi,

Your analysis was thorough and Amara appreciated the clear recommendation on the Product Launch financial model. The revenue recognition point was particularly astute — she hadn't spotted that.

Priya`,
        urgency: 'normal',
        project_ref: 'product-launch-fa',
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
        subject: 'Q4 Close project audit request — revenue recognition workings',
        body: `Hello,

As part of our Q4 Close project year-end audit procedures I need to review the revenue recognition workings for your top 5 contracts by value. Please provide the relevant documentation and supporting schedules by Friday.

Fatima Al-Hassan
EY`,
        urgency: 'high',
        project_ref: 'q4-close',
        task: {
          title: 'Prepare Q4 Close project revenue recognition audit pack for EY',
          type: 'document',
          urgency: 'high',
          description: 'External auditor Fatima Al-Hassan has requested Q4 Close project revenue recognition workings for your top 5 contracts by value. Prepare a clear audit pack: (1) contract summary for each, (2) revenue recognition method applied, (3) key judgements and their basis, (4) supporting calculations. Audit documentation must be precise and defensible.',
          xp: 35,
          due_offset_mins: 90,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Q4 Close project audit query — bad debt provision methodology',
        body: `Hello,

We have a query on the methodology used for the bad debt provision in the Q4 Close project. The current provision appears below sector benchmarks. Please provide a written explanation of the methodology and key assumptions.

Fatima Al-Hassan
EY`,
        urgency: 'normal',
        project_ref: 'q4-close',
        task: {
          title: "Respond to EY's Q4 Close project bad debt provision query",
          type: 'document',
          urgency: 'normal',
          description: "EY have flagged that the Q4 Close project bad debt provision appears below sector benchmarks. Write a clear, defensible explanation of: (1) the methodology used, (2) the key assumptions and their basis, (3) why the provision is appropriate given the company's specific debtor profile. This is a formal audit response.",
          xp: 30,
          due_offset_mins: 120,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Q4 Close project documentation received — no further queries at this stage',
        body: `Hello,

Thank you for the Q4 Close project documentation. The revenue recognition workings were well-presented and the supporting schedules were complete. No further queries on this area at this stage.

Fatima Al-Hassan
EY`,
        urgency: 'normal',
        project_ref: 'q4-close',
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
        subject: 'Can we discount this contract to win the deal? Q4 Close project implications?',
        body: `Hi,

We're close to landing a major new contract but the client is asking for a 15% discount. At the current margin, Finance won't like it — and it will hit the Q4 Close project numbers. Can you model the impact and tell me what the minimum acceptable discount is?

Chris`,
        urgency: 'urgent',
        project_ref: 'product-launch-fa',
        task: {
          title: 'Model discount impact on proposed contract margin for Q4 Close project',
          type: 'scope_decision',
          urgency: 'urgent',
          description: "Chris Okafor wants to know the minimum acceptable discount on a major contract that would affect the Q4 Close project. Model the P&L impact of the requested 15% discount vs current pricing: (1) margin at each discount level, (2) break-even point, (3) your recommendation — whether to accept and at what conditions. Chris needs this before tomorrow's negotiation.",
          xp: 40,
          due_offset_mins: 45,
          project_ref: 'q4-close',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Product Launch financial model — do the numbers stack up before the board?',
        body: `Hi,

We're presenting the Product Launch financial model business case to the board next week. Can you give me your honest view on whether the financial projections are robust? I'd rather know now than be challenged in the boardroom.

Chris`,
        urgency: 'normal',
        project_ref: 'product-launch-fa',
        task: {
          title: 'Challenge Product Launch financial model projections before board',
          type: 'scope_decision',
          urgency: 'normal',
          description: "Chris wants an honest financial review of the Product Launch financial model business case before the board presentation. Critique: (1) revenue assumptions — are they realistic given the Q4 Close project data?, (2) cost base — what's missing?, (3) the key risks the board will challenge. Write a structured brief — be direct, not diplomatic.",
          xp: 30,
          due_offset_mins: 120,
          project_ref: 'product-launch-fa',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'The Product Launch model was exactly what I needed',
        body: `Hi,

Your analysis saved us from a bad deal on the Product Launch financial model. We ended up pushing back on the discount and the client accepted 8%. Your break-even analysis was the reason we held firm.

Chris`,
        urgency: 'normal',
        project_ref: 'product-launch-fa',
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
        subject: 'Nexus Platform v3: I need your sprint backlog recommendation — now',
        body: `Morning,

Three stakeholders, one slot on the Nexus Platform v3 roadmap. I want your recommendation by 10am with data to back it. Don't send me a summary of the three options — tell me which one we build and why.

JH`,
        urgency: 'urgent',
        project_ref: 'platform-v3',
        task: {
          title: 'Provide Nexus Platform v3 sprint priority recommendation to James',
          type: 'decision',
          urgency: 'urgent',
          description: "James wants a clear recommendation on which of the three competing Nexus Platform v3 sprint backlog items to build. Write a decision brief: (1) your recommended option, (2) the data or logic that supports it, (3) how you will communicate the decision to the stakeholders whose items weren't chosen. Do not hedge.",
          xp: 40,
          due_offset_mins: 30,
          project_ref: 'nexus-platform-q1',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Priya is escalating on the Vantage Integration project — I want a plan before she reaches the board',
        body: `Hi,

Priya has emailed again about the Vantage Integration project. If we don't act today she's going to the board. I want a plan from you before 12pm: what we're doing, when she will see results, and how we get in front of the narrative.

JH`,
        urgency: 'urgent',
        project_ref: 'platform-v3',
        task: {
          title: 'Write Vantage Integration project escalation management plan for Priya',
          type: 'scope_decision',
          urgency: 'urgent',
          description: "Priya Shah is threatening to escalate to the board about the delayed Vantage Integration project. Write a management plan for James: (1) what we commit to delivering and by when, (2) the message we proactively send to Priya today, (3) what we need internally to deliver on the commitment. Be realistic — do not over-promise.",
          xp: 45,
          due_offset_mins: 40,
          project_ref: 'vantage-integration',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'feedback',
        subject: 'Good decision under pressure on the Nexus Platform v3 roadmap',
        body: `Quick note — the way you handled the Nexus Platform v3 sprint backlog decision was professional. Clear reasoning, and you communicated it well to the stakeholders. That's the standard I expect.

JH`,
        urgency: 'normal',
        project_ref: 'platform-v3',
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
        subject: 'Nexus Platform v3: this user story is not ready for dev',
        body: `Hi,

I've read the reporting feature user story for the Nexus Platform v3 roadmap. There are gaps — the acceptance criteria don't cover edge cases and the data source is undefined. I can't start building from this.

Here's what I have so far:

---
USER STORY DRAFT v0.1 — Nexus Platform v3 Reporting Feature
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
        project_ref: 'platform-v3',
        task: {
          title: 'Rewrite Nexus Platform v3 reporting feature user story to dev-ready standard',
          type: 'document',
          urgency: 'high',
          description: "Sarah Chen (Senior Dev) has flagged that the Nexus Platform v3 reporting feature user story is incomplete. The draft has: vague acceptance criteria, undefined data source, no edge cases, no success metric. Rewrite it to a dev-ready standard: clear user need, full acceptance criteria covering edge cases (empty state, partial data, permissions), defined data source and API, and a worked example of the expected output. Sarah needs to estimate it — leave nothing ambiguous.",
          xp: 35,
          due_offset_mins: 60,
          project_ref: 'nexus-platform-q1',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'FYI — I am not available to build the extra Vantage Integration feature Marcus agreed',
        body: `FYI — I've just heard from Marcus that he told the Vantage Integration project client we'd add a bulk export feature by Friday. I have no capacity for this and it was never on the Nexus Platform v3 roadmap.

You need to sort this out. I'm not committing to something I wasn't consulted on.

SE`,
        urgency: 'urgent',
        project_ref: 'platform-v3',
        task: {
          title: 'Resolve capacity conflict between Marcus and Sarah on Vantage Integration project',
          type: 'scope_decision',
          urgency: 'urgent',
          description: "Marcus has committed the Vantage Integration project client to a bulk export feature by Friday without consulting the dev team. Sarah has no capacity and the work wasn't on the Nexus Platform v3 roadmap. Resolve this professionally: (1) assess whether Friday is feasible, (2) decide what to communicate to the client, (3) establish how to prevent Marcus making unilateral commitments in future.",
          xp: 40,
          due_offset_mins: 30,
          project_ref: 'vantage-integration',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'feedback',
        subject: 'Nexus Platform v3 user story was much better',
        body: `Hi,

The revised Nexus Platform v3 user story was clear enough to estimate. Acceptance criteria were specific and the edge cases were covered. That's the standard we need.

SE`,
        urgency: 'normal',
        project_ref: 'platform-v3',
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
        subject: 'Priya is escalating the Vantage Integration project (Enterprise Tier) — need your help',
        body: `Hi,

Just a heads up — Priya has emailed me again about the Vantage Integration project. She's not happy and mentioned going to the board about the Enterprise Tier feature delay.

I know this isn't ideal timing but can you draft a response to her? I'll review before it goes. We need to get ahead of this.

Marcus`,
        urgency: 'urgent',
        project_ref: 'enterprise-tier',
        task: {
          title: 'Draft response to Priya Shah — Vantage Integration (Enterprise Tier) escalation',
          type: 'email_reply',
          urgency: 'urgent',
          description: "Marcus needs you to draft a response to Priya Shah who is threatening to escalate to the board about the delayed Vantage Integration project Enterprise Tier feature. Draft a professional response that: (1) acknowledges her frustration honestly, (2) explains the delay without making excuses, (3) proposes a concrete next step with a realistic date. Marcus will review before it's sent.",
          xp: 40,
          due_offset_mins: 20,
          project_ref: 'vantage-integration',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'I may have over-promised a Nexus Platform v3 Enterprise Tier demo timeline',
        body: `Hey,

Okay so I may have told the prospect that we could have a live Nexus Platform v3 Enterprise Tier demo ready by Thursday. Is that possible? I know it's tight but it's a big deal.

Marcus`,
        urgency: 'high',
        project_ref: 'enterprise-tier',
        task: {
          title: 'Respond to Marcus about Nexus Platform v3 Enterprise Tier demo timeline feasibility',
          type: 'email_reply',
          urgency: 'high',
          description: "Marcus has committed to a Thursday Nexus Platform v3 Enterprise Tier demo without checking with the product team. Respond professionally: (1) assess whether Thursday is feasible given current sprint state, (2) if not, what is the earliest realistic date, (3) advise Marcus on what he should tell the prospect. Be direct — do not just say yes to make him feel better.",
          xp: 30,
          due_offset_mins: 40,
          project_ref: 'nexus-platform-q1',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Priya came back positively on the Vantage Integration (Enterprise Tier) response',
        body: `Hey,

Just heard from Priya — she was really happy with the response on the Vantage Integration Enterprise Tier delay. Said it was clear, honest, and gave her what she needed to brief her board.

Nice work!

Marcus`,
        urgency: 'normal',
        project_ref: 'enterprise-tier',
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
        subject: 'Churn Fix project — enterprise sign-up UX flow, can you check the logic before I start Figma?',
        body: `Hi,

I've mapped out the updated enterprise sign-up flow as part of the Churn Fix project. The idea is that a cleaner onboarding experience for enterprise users reduces early-stage churn. Before I go into Figma I want to check the logic — have I missed any edge cases?

---
CHURN FIX PROJECT — ENTERPRISE SIGN-UP FLOW v0.1
Designer: Yemi Adeyinka

Step 1: User lands on pricing page → clicks "Enterprise" plan CTA
Step 2: User fills in company details form (company name, team size, industry, name, email)
Step 3: User receives confirmation email: "Thank you — our enterprise team will be in touch within 2 business days"
Step 4: Sales team reviews submission in CRM and contacts the user within 2 business days

Success state: Demo booked, contract signed.
Failure state: No response within 5 days → automated follow-up email.

Edge cases covered:
— User submits form without a business email (e.g. gmail.com): form validation rejects, prompts business email ✓
— User submits duplicate email from a different company: "this email is already registered" error shown ✓
---

I think this covers the main scenarios. Does this look complete to you?

Yemi`,
        urgency: 'normal',
        project_ref: 'churn-fix',
        task: {
          title: "Review Yemi's Churn Fix project enterprise sign-up UX flow — identify missing edge case",
          type: 'document',
          urgency: 'normal',
          description: "Yemi Adeyinka (UX Designer) has mapped out an enterprise sign-up user flow for the Churn Fix project and asked for your review before she starts Figma designs. The flow has a significant missing edge case: there is no branch for users who are already logged in with a free account. A logged-in free-tier user who clicks the Enterprise CTA and fills out the form will hit a duplicate account creation error (their email is already in the system linked to their free account) instead of being routed to an upgrade flow. This is a common real-world pattern that breaks sign-up funnels. Review the flow: (1) identify the missing edge case for existing logged-in free-account users specifically, (2) propose a fix (add a branch: check session/auth state before showing the form; if logged in, redirect to account upgrade page instead), (3) note what Yemi has done well. Rubric: (1) did you identify the specific missing edge case (existing logged-in user → duplicate account error)?, (2) was your proposed fix actionable?, (3) was tone appropriate for a junior designer?",
          xp: 25,
          due_offset_mins: 90,
          project_ref: 'nexus-platform-q1',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Churn Fix project dashboard re-engagement design — feedback needed before next iteration',
        body: `Hi,

I've shared the first design mockups for the Churn Fix project re-engagement dashboard in Figma. I need written feedback before I progress to the next iteration — specifically on the notification design and the "pick up where you left off" module placement.

Yemi`,
        urgency: 'normal',
        project_ref: 'churn-fix',
        task: {
          title: 'Provide structured feedback on Churn Fix project re-engagement dashboard mockups',
          type: 'document',
          urgency: 'normal',
          description: "Yemi has shared design mockups for the Churn Fix project re-engagement dashboard and needs structured written feedback. Review from a product and user perspective: (1) does the notification design draw attention to the right actions for re-engaging users?, (2) is the 'pick up where you left off' module placement intuitive?, (3) three specific changes you'd prioritise before the next iteration.",
          xp: 20,
          due_offset_mins: 120,
          project_ref: 'nexus-platform-q1',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Churn Fix project feedback was exactly what I needed',
        body: `Hi,

Thank you for the Churn Fix project review — it was clear and gave me everything I needed to revise the flow. The edge case you spotted would have been a real problem in production.

Yemi`,
        urgency: 'normal',
        project_ref: 'churn-fix',
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
        subject: 'Vantage Integration Enterprise Tier feature still not live — I need answers',
        body: `Hi,

The Vantage Integration Enterprise Tier feature promised two weeks ago is still not live. My team is blocked and I am running out of patience. I need a clear explanation of what has happened and when I can expect this resolved.

Priya Shah
Vantage Corp`,
        urgency: 'urgent',
        project_ref: 'enterprise-tier',
        task: {
          title: 'Respond to Priya Shah — Vantage Integration Enterprise Tier feature delay escalation',
          type: 'email_reply',
          urgency: 'urgent',
          description: "Priya Shah is escalating about the Vantage Integration Enterprise Tier feature that is 2 weeks late. Draft a professional response that: (1) acknowledges the delay honestly, (2) explains what caused it without being defensive, (3) gives a clear, realistic delivery date, (4) proposes interim support. James Hargreaves is copied in.",
          xp: 40,
          due_offset_mins: 20,
          project_ref: 'vantage-integration',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'New requirement for the Vantage Integration Enterprise Tier — can we add this to the current sprint?',
        body: `Hi,

Following our last meeting I have a new requirement for the Vantage Integration Enterprise Tier that I believe is essential for our go-live. It should only take a day or two. Can this be added to the current sprint?

Priya Shah`,
        urgency: 'high',
        project_ref: 'enterprise-tier',
        task: {
          title: "Respond to Priya's mid-sprint Vantage Integration Enterprise Tier change request",
          type: 'email_reply',
          urgency: 'high',
          description: "Priya Shah has requested a mid-sprint change to the Vantage Integration Enterprise Tier, estimating 'a day or two'. Draft a professional response: (1) acknowledge the request, (2) explain the process for assessing mid-sprint changes and their impact on delivery, (3) either accept with clear conditions or defer to next sprint with a reason.",
          xp: 30,
          due_offset_mins: 40,
          project_ref: 'vantage-integration',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'feedback',
        subject: 'Thank you for the honest update on the Vantage Integration Enterprise Tier',
        body: `Hi,

I appreciate the transparency in your last response about the Vantage Integration Enterprise Tier. It was more honest than I expected and the proposed interim solution was helpful. We can work with this timeline.

Priya Shah`,
        urgency: 'normal',
        project_ref: 'enterprise-tier',
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
        subject: 'Nexus CRM rollout (CRM Implementation): I want a recovery plan before the board call',
        body: `Morning,

The Amber status on the Nexus CRM rollout RAG report is going to trigger questions. I want a draft recovery plan on my desk before the 2pm board call — covering what has slipped, why, and how we get back on track.

One page. Be honest.

JH`,
        urgency: 'urgent',
        project_ref: 'crm-impl',
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
        project_ref: 'crm-impl',
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
        project_ref: 'crm-impl',
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
        subject: 'Nexus CRM rollout (CRM Implementation) change request submitted — when can we discuss?',
        body: `Hi,

We've submitted a change request for the three additional features on the Nexus CRM rollout. I understand this has timeline implications but these features are critical for our board approval of phase 2.

When can we discuss?

Rachel Okonkwo
Client PMO Lead`,
        urgency: 'high',
        project_ref: 'crm-impl',
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
        project_ref: 'crm-impl',
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
        project_ref: 'crm-impl',
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
        subject: 'Nexus CRM rollout (CRM Implementation): technical risk — new scope will break the architecture',
        body: `Hi,

I need to flag a technical risk on the Nexus CRM rollout. The three features in the change request require changes to the core data model that will take 3 weeks, not the 2 days the client thinks. If we commit to the timeline without accounting for this, we will fail.

Ben`,
        urgency: 'urgent',
        project_ref: 'crm-impl',
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
        project_ref: 'crm-impl',
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
        project_ref: 'crm-impl',
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
        subject: 'EU Office project — work has started without a formal contract in place',
        body: `Hi,

I've been made aware that the external supplier on the EU Office project has begun work without a signed contract. This is a significant commercial and legal risk.

I need you to draft a formal Letter of Intent to bridge the gap while the full contract is finalised. It must cover: scope of work, agreed day rate, payment terms, and IP ownership. I will review before anything goes to the supplier.

Sandra`,
        urgency: 'urgent',
        project_ref: 'eu-office',
        task: {
          title: 'Draft Letter of Intent for EU Office project — work started without signed contract',
          type: 'document',
          urgency: 'urgent',
          description: "Sandra Nwosu (Legal & Contracts) has flagged that an external supplier on the EU Office project has begun work without a signed contract. Draft a formal Letter of Intent to bridge the gap: (1) scope of work being carried out, (2) agreed day rate and payment terms, (3) IP ownership and confidentiality, (4) that the LOI is interim and a full contract will supersede it. Sandra will review before it goes to the supplier.",
          xp: 30,
          due_offset_mins: 60,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'EU Office project email chain is creating contractual risk — clarification needed',
        body: `Hi,

I've been reviewing the email chain on the EU Office project and some of the language being used by the team is creating contractual ambiguity around deliverables and timelines. There are implied commitments that were never formally agreed.

I need you to write a formal clarification email to the supplier to reset expectations before we get further in.

Sandra`,
        urgency: 'high',
        project_ref: 'eu-office',
        task: {
          title: 'Write contractual clarification email to EU Office project supplier',
          type: 'document',
          urgency: 'high',
          description: "Sandra has identified that informal email communications on the EU Office project have created contractual ambiguity around deliverables and timelines. Write a professional clarification email that: (1) references the agreed scope, (2) clearly restates what is and is not committed, (3) corrects any implied commitments made in previous emails, (4) proposes a formal scope sign-off meeting. Must be approved by Sandra before sending.",
          xp: 35,
          due_offset_mins: 90,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'EU Office project Letter of Intent was well drafted',
        body: `Hi,

The Letter of Intent for the EU Office project covered all the necessary legal elements and was commercially sensible. Supplier has signed it. We're protected until the full contract is ready.

Sandra`,
        urgency: 'normal',
        project_ref: 'eu-office',
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
        subject: 'Not sure how to handle a tricky stakeholder on the Process Improvement project',
        body: `Hi,

I had a difficult conversation with one of the Process Improvement project department leads today. They pushed back on a deadline I gave them and I didn't know how to handle it. It got a bit awkward. Can you advise?

Kwame`,
        urgency: 'normal',
        project_ref: 'process-improvement',
        task: {
          title: 'Coach Kwame on stakeholder challenge management for Process Improvement project',
          type: 'standup',
          urgency: 'normal',
          description: 'Kwame Asante (Junior PM) is struggling to handle a Process Improvement project department lead who is pushing back on deadlines. Write a coaching response: (1) how to approach the conversation without getting defensive, (2) the difference between a legitimate concern and resistance, (3) how to document and escalate if the pushback continues.',
          xp: 15,
          due_offset_mins: 60,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'Can you review my Process Improvement project RAID log update before I send it to James?',
        body: `Hi,

James asked me to update the Process Improvement project RAID log. I've had a first attempt but I got stuck on R-002. Can you check it before I send?

---
PROCESS IMPROVEMENT PROJECT — RAID LOG UPDATE
Updated by: Kwame Asante, Junior PM | Week 4

RISKS:
R-001 | Process improvement scope larger than originally estimated
  Probability: HIGH | Impact: HIGH
  Mitigation: Phase the rollout — pilot with 2 departments in Month 1, full rollout Month 3
  Status: ASSESSED ✓

R-002 | Key process owner (Sales Ops lead) going on extended leave in Week 8
  Probability: HIGH | Impact: MEDIUM
  Mitigation: [TO BE ASSESSED — not sure what to put here]
  Status: NOT ASSESSED ←

ISSUES:
I-001 | External consultant delivery of process mapping documentation delayed by 1 week
  Owner: Ben Afolabi | Due: Week 5 | Status: IN PROGRESS ✓

ASSUMPTIONS:
A-001 | Department heads will sign off new processes within 5 working days — not yet confirmed

DEPENDENCIES:
D-001 | IT sign-off required before new workflow system is activated — received ✓
---

What should I put for R-002?

Kwame`,
        urgency: 'normal',
        project_ref: 'process-improvement',
        task: {
          title: "Review Kwame's Process Improvement project RAID log — identify R-002 gap",
          type: 'document',
          urgency: 'normal',
          description: "Kwame Asante (Junior PM) has drafted a RAID log update for the Process Improvement project and asked you to review it before he sends it to James. The log has one clear gap: R-002 (Sales Ops key person going on extended leave in Week 8) has no mitigation and has been left 'TO BE ASSESSED'. This is a HIGH probability risk — leaving it blank means the project has no plan if the primary sign-off authority becomes unavailable during a critical phase. Review the RAID log: (1) identify that R-002 has no mitigation — this is the primary gap and explain why it matters, (2) propose a concrete, realistic mitigation (e.g. identify and brief a deputy decision-maker now, hold a knowledge transfer session before Week 8, document all decisions requiring Sales Ops approval), (3) note what Kwame has done well in the rest of the log. Rubric: (1) did you identify R-002 as the specific gap and explain why it matters for the project?, (2) was your proposed mitigation realistic and actionable?, (3) was tone appropriate for a junior PM still learning RAID management?",
          xp: 20,
          due_offset_mins: 90,
          project_ref: 'nexus-crm-rollout',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Thanks for the coaching — Process Improvement project stakeholder sorted',
        body: `Hi,

I had the conversation with the Process Improvement project department lead today using your advice. It went much better. We agreed a revised deadline and I documented it properly this time.

Kwame`,
        urgency: 'normal',
        project_ref: 'process-improvement',
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
        subject: 'Demand Gen campaign: I need a recommendation, not a summary',
        body: `Morning,

I've read your Demand Gen campaign performance summary. What I actually need is a recommendation — what do we do next? Adjust the targeting? Kill one ad set? Shift budget?

Give me a decision with a rationale. 3pm.

JH`,
        urgency: 'urgent',
        project_ref: 'demand-gen',
        task: {
          title: 'Write Demand Gen campaign optimisation recommendation for James',
          type: 'decision',
          urgency: 'urgent',
          description: "James wants a clear Demand Gen campaign recommendation, not more data. Write a 1-page recommendation: (1) your recommended action (specific — e.g. kill ad set 2, increase budget on set 3 by 40%), (2) the data that supports this, (3) expected impact and how you'll measure success. No hedging.",
          xp: 40,
          due_offset_mins: 30,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Demand Gen campaign performance report template is weak — rewrite it',
        body: `Hi,

This quarter's Demand Gen campaign performance report is harder to read than it should be. The executive summary doesn't lead with the key insight and the data is buried.

Rewrite the template and apply it to this quarter's data. I want the new version to set the standard going forward.

JH`,
        urgency: 'normal',
        project_ref: 'demand-gen',
        task: {
          title: 'Rewrite Demand Gen campaign performance report template',
          type: 'report',
          urgency: 'normal',
          description: "James wants the Demand Gen campaign performance report template improved. Create a new version that: (1) leads with the key business insight (not data), (2) structures the report for executive readers, (3) makes recommendations prominent. Apply the new template to this quarter's campaign data to demonstrate the improvement.",
          xp: 30,
          due_offset_mins: 120,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: "Demand Gen campaign: good recommendation — we're moving on it",
        body: `Your Demand Gen campaign recommendation was clear and well-backed. We're reallocating the budget as you suggested. Let's see if the ROAS improves as predicted.

JH`,
        urgency: 'normal',
        project_ref: 'demand-gen',
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
        subject: 'Demand Gen campaign budget cut — how do we split it across the three ad sets?',
        body: `Hi,

With the 40% Demand Gen campaign budget cut, I need a decision on how to redistribute across the three active ad sets. My view is we should kill the worst performer and consolidate, but James said to check with you first.

What do you think?

Tom`,
        urgency: 'urgent',
        project_ref: 'demand-gen',
        task: {
          title: 'Decide how to redistribute Demand Gen campaign budget after 40% cut',
          type: 'decision',
          urgency: 'urgent',
          description: 'Tom needs a decision on redistributing the Demand Gen campaign budget after a 40% cut across three ad sets. Make a clear recommendation: which ad set(s) to pause, how to reallocate the remaining budget, and the rationale. Tom will implement your recommendation.',
          xp: 35,
          due_offset_mins: 30,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'scope_control',
        },
      },
      {
        kind: 'action',
        subject: 'Demand Gen campaign Q4 ROAS report — can you review my methodology before I send to James?',
        body: `Hi,

I've put together the Q4 ROAS report for the Demand Gen campaign but I'm not confident in the attribution model I've used. Here's what I've got so far:

---
DEMAND GEN CAMPAIGN — Q4 ROAS REPORT (DRAFT)
Prepared by: Tom Asiwe, Paid Media Specialist

Attribution model used: Last-click (GA4 default)

Results:
  Ad Set 1 (Paid Search): ROAS 4.2x | Spend: £12,400 | Revenue attributed: £52,080
  Ad Set 2 (Paid Social): ROAS 1.8x | Spend: £18,600 | Revenue attributed: £33,480
  Ad Set 3 (Display):     ROAS 0.9x | Spend: £6,200  | Revenue attributed: £5,580

Blended ROAS: 2.6x | Total spend: £37,200 | Total revenue: £91,140

Note: CRM shows only £68,400 total revenue from this period — there's a £22,740 discrepancy I can't explain.

My conclusion: Paid Search is clearly the best performer and Display should be cut.
---

Can you review the methodology and let me know if the numbers are defensible?

Tom`,
        urgency: 'normal',
        project_ref: 'demand-gen',
        task: {
          title: "Review Tom's Demand Gen campaign Q4 ROAS report methodology",
          type: 'report',
          urgency: 'normal',
          description: "Tom is uncertain about the attribution model in his Demand Gen campaign Q4 ROAS report. His draft uses last-click attribution and shows a £22,740 discrepancy between GA4 and CRM revenue. Review the methodology: (1) is last-click attribution appropriate for this campaign mix (paid search + social + display)?, (2) what is likely causing the GA4/CRM discrepancy (multi-touch overlap, attribution window mismatch, UTM tracking gaps)?, (3) are his conclusions about Paid Search and Display still correct given the attribution issue?, (4) what caveats should he include? Write a structured review he can use to strengthen the report.",
          xp: 25,
          due_offset_mins: 90,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Demand Gen campaign budget reallocation is performing well',
        body: `Hi,

Two days in and the consolidated budget on ad set 1 is already showing improved ROAS. Your call on killing ad set 3 was the right one for the Demand Gen campaign.

Tom`,
        urgency: 'normal',
        project_ref: 'demand-gen',
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
        subject: 'Brand Refresh project: landing page hero copy needed — design team is waiting',
        body: `Hi,

The design team needs the hero copy for the Brand Refresh project landing page. They're ready to start the layout but I can't give them anything without your approval.

Hero headline, subheadline, and CTA. Audience: mid-market B2B buyers discovering Nexus for the first time after the brand refresh. Can you write or approve something today?

Yemi`,
        urgency: 'high',
        project_ref: 'brand-refresh',
        task: {
          title: 'Write Brand Refresh project landing page hero copy for B2B audience',
          type: 'document',
          urgency: 'high',
          description: 'Yemi needs approved Brand Refresh project landing page hero copy for the design team. Write: (1) hero headline — max 8 words, benefit-led, reflects the new brand positioning, (2) subheadline — max 20 words, expands on the headline, (3) CTA button text — max 4 words. Audience: mid-market B2B buyers encountering Nexus after the brand refresh. Include a brief rationale for your copy choices.',
          xp: 25,
          due_offset_mins: 60,
          project_ref: 'nexus-product-launch',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Brand Refresh project: content brief needed for the 3-email welcome sequence',
        body: `Hi,

We're building a 3-email welcome sequence for new contacts generated by the Brand Refresh project campaign. I need a content brief before I start writing — what are the three core messages we want to land, and what tone should the Brand Refresh be conveying?

Yemi`,
        urgency: 'normal',
        project_ref: 'brand-refresh',
        task: {
          title: 'Write content brief for Brand Refresh project 3-email welcome sequence',
          type: 'document',
          urgency: 'normal',
          description: 'Yemi needs a content brief for a 3-email welcome sequence targeting new contacts from the Brand Refresh project campaign. Write a brief that covers: (1) the goal and audience for each email, (2) the core message and call-to-action, (3) tone — how does it reflect the new brand positioning?, (4) what outcome you want from each email (open, click, conversion or nurture?).',
          xp: 20,
          due_offset_mins: 120,
          project_ref: 'nexus-product-launch',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'feedback',
        subject: 'Brand Refresh project copy approved — design has started',
        body: `Hi,

Design team loved the headline for the Brand Refresh project — they said it was the clearest brief they'd been given in months. They've already started the layout.

Yemi`,
        urgency: 'normal',
        project_ref: 'brand-refresh',
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
        subject: 'Demand Gen campaign leads are not converting — I need answers',
        body: `Hi,

We've followed up on the last 80 leads from the Demand Gen campaign paid media and the close rate is 4%. The quality is not there. Can you investigate what's happening and tell me what you're going to do about it?

Rachel Mensah
Head of Sales`,
        urgency: 'urgent',
        project_ref: 'demand-gen',
        task: {
          title: 'Respond to Rachel: Demand Gen campaign paid media lead quality issue',
          type: 'email_reply',
          urgency: 'urgent',
          description: "Rachel Mensah (Head of Sales) has escalated that Demand Gen campaign paid media leads have a 4% close rate. Draft a professional response: (1) acknowledge the issue and take ownership, (2) outline what you will investigate (targeting, messaging, landing page, lead scoring), (3) propose a joint review with the sales team to align on ICP. Do not be defensive.",
          xp: 35,
          due_offset_mins: 25,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'communication',
        },
      },
      {
        kind: 'action',
        subject: 'Can the Demand Gen campaign support an accelerated Q1 pipeline push?',
        body: `Hi,

We're 22% behind on Q1 pipeline target and James has asked sales and marketing to come up with a joint plan. Can you put together a short campaign brief for an accelerated push using the existing Demand Gen campaign budget?

Rachel`,
        urgency: 'high',
        project_ref: 'demand-gen',
        task: {
          title: 'Write accelerated Demand Gen campaign pipeline push brief',
          type: 'email_reply',
          urgency: 'high',
          description: 'Rachel needs a marketing campaign brief to support the Q1 pipeline push (22% below target) using the Demand Gen campaign budget. Draft a campaign brief: (1) campaign objective and target pipeline contribution, (2) channels and tactics, (3) timeline, (4) budget requirement. The brief will be presented to James — make it action-ready.',
          xp: 30,
          due_offset_mins: 60,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Demand Gen campaign lead quality has improved',
        body: `Hi,

I don't normally send emails like this but the lead quality from the last Demand Gen campaign batch was noticeably better. The team has commented on it. Whatever you changed in the targeting worked.

Rachel Mensah`,
        urgency: 'normal',
        project_ref: 'demand-gen',
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
        subject: 'Demand Gen campaign Q4 performance report — can you check the conversion numbers?',
        body: `Hi,

I've drafted the Q4 performance summary for the Demand Gen campaign ahead of James's review. I want a second pair of eyes before I send it — I'm not 100% sure the conversion totals are right.

---
DEMAND GEN CAMPAIGN — Q4 PERFORMANCE SUMMARY (DRAFT)
Prepared by: Daniel Yeboah, Marketing Analyst

Channel               Clicks         Conversions    ROAS
Google Ads            12,400         847            3.8x  ✓
LinkedIn Ads          3,200          89             1.2x  ✓
Email Campaign        18,400 sends   156            n/a   ✓

Total attributed conversions: 1,092
Total revenue attributed:     £87,360

Attribution note: I noticed 43 users converted after touching both Google Ads AND an email campaign before converting. I attributed the conversion to both channels since both contributed — so Google Ads shows 847 conversions and Email shows 156, which includes those 43 people in both columns.

Overall conclusions:
  1. Google Ads is our best performing paid channel at 3.8x ROAS
  2. LinkedIn significantly underperforms — recommend cutting budget next quarter
  3. Email drives strong volume
  4. Total 1,092 conversions is our best Q4 performance to date ✓
---

The total feels higher than I expected. Does the methodology look right?

Daniel`,
        urgency: 'high',
        project_ref: 'demand-gen',
        task: {
          title: "Review Daniel's Demand Gen campaign Q4 performance report — identify attribution error",
          type: 'report',
          urgency: 'high',
          description: "Daniel Yeboah has drafted a Q4 performance summary for the Demand Gen campaign that contains a significant attribution error. He has double-counted 43 conversions that touched both Google Ads and Email — attributing them fully to both channels. The correct total should be 1,049 conversions, not 1,092 (a 43-conversion overcount). This error also inflates Google Ads' ROAS: the 847 figure includes those 43 shared conversions, so actual Google Ads-only conversions are 804, and ROAS should be closer to 3.6x, not 3.8x. Review Daniel's report: (1) identify the double-counting error specifically — explain that the 43 shared conversions should appear once, not twice across channels, (2) explain the correct approach (use a multi-touch attribution model that assigns fractional credit, or at minimum flag these as 'assisted' conversions in a separate column, not counted in both), (3) note whether his overall conclusion (Google Ads outperforms LinkedIn) still holds after correcting the error. Rubric: (1) did you identify the specific double-counting error and its numerical impact (43 conversions, ~0.2x ROAS inflation)?, (2) did you explain a correct attribution approach?, (3) was tone appropriate for a junior analyst colleague?",
          xp: 30,
          due_offset_mins: 60,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'action',
        subject: 'Demand Gen campaign competitor analysis needed for strategy review',
        body: `Hi,

James wants a competitor marketing analysis for next week's Demand Gen campaign strategy review. I can pull the data but I need guidance on what to include and how to structure it.

Daniel`,
        urgency: 'normal',
        project_ref: 'demand-gen',
        task: {
          title: 'Structure and commission Demand Gen campaign competitor marketing analysis',
          type: 'report',
          urgency: 'normal',
          description: "Daniel needs direction on structuring the competitor marketing analysis for the Demand Gen campaign strategy review. Write a brief for him: (1) which competitors to include and why, (2) what dimensions to analyse (channels, messaging, positioning, campaign cadence), (3) the format and length James expects, (4) the strategic question the analysis should answer for the Demand Gen campaign.",
          xp: 25,
          due_offset_mins: 120,
          project_ref: 'q1-growth-campaign',
          kpi_tag: 'quality',
        },
      },
      {
        kind: 'feedback',
        subject: 'Demand Gen campaign attribution framework was really helpful',
        body: `Hi,

The framework you gave me made the Demand Gen campaign attribution problem much clearer. I was able to explain the discrepancy to James and he was satisfied with the reasoning.

Daniel`,
        urgency: 'normal',
        project_ref: 'demand-gen',
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
