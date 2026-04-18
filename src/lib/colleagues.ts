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
        subject: 'Quick one — dashboard has stopped refreshing',
        body: `Hey,\n\nSorry to drop this on you but the client dashboard stopped refreshing about 20 minutes ago. Priya's team noticed first.\n\nI think it's the pipeline but I'm not sure where to start. Can you investigate and let me know your findings? Client expects a status update by 2pm.\n\nCheers\nMarcus`,
        urgency: 'urgent',
        task: {
          title: 'Marcus needs help: dashboard not refreshing',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'Marcus has pinged you directly. The client dashboard stopped refreshing 20 minutes ago. Investigate the pipeline issue and reply to Marcus with your initial findings and next steps.',
          xp: 35,
          due_offset_mins: 30,
        },
      },
      {
        kind: 'action',
        subject: 'Client wants new revenue chart this sprint',
        body: `Hey,\n\nJust off the phone with Priya. She wants a revenue breakdown chart added to the dashboard — says it's critical for next week's board presentation.\n\nI know we're mid-sprint but she's a key account. Can you assess the effort and tell me if it's feasible? Need to come back to her by EOD.\n\nMarcus`,
        urgency: 'high',
        task: {
          title: 'Assess Priya\'s revenue chart request — sprint impact',
          type: 'scope_decision',
          urgency: 'high',
          description: 'Marcus has committed to assessing a new feature request. Evaluate adding a revenue breakdown chart mid-sprint and respond: can it be done this sprint, or does it move to next? Include your rationale and any risks.',
          xp: 30,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'feedback',
        subject: 'Good call on that earlier',
        body: `Hey,\n\nJust wanted to say — the way you handled that decision was spot on. Priya came back to me happy and James was pleased too.\n\nMarcus`,
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
        subject: 'Board wants a data health summary by 4pm',
        body: `FYI — board have asked for a one-page data health summary before their 4pm call. They want: current pipeline status, Q4 data quality score, and known issues.\n\nYou are writing it.\n\nSE`,
        urgency: 'urgent',
        task: {
          title: 'Write data health summary for board — 4pm deadline',
          type: 'document',
          urgency: 'urgent',
          description: 'Sarah needs a one-page data health summary for the board\'s 4pm call. Include: (1) pipeline status, (2) Q4 data quality score, (3) known issues and mitigations. Non-technical audience — keep it clear.',
          xp: 40,
          due_offset_mins: 25,
        },
      },
      {
        kind: 'action',
        subject: 'SQL query needed for revenue analysis',
        body: `For the record — I need a SQL query returning the top 10 customers by total revenue this quarter. Include customer name, total spend, order count, and MoM growth %.\n\nNeeded for the 3pm finance review.\n\nSE`,
        urgency: 'normal',
        task: {
          title: 'Write SQL: top 10 customers by Q4 revenue',
          type: 'document',
          urgency: 'normal',
          description: 'Sarah needs a SQL query for the finance review returning top 10 customers by revenue this quarter: customer name, total spend, order count, and MoM growth %. Add a brief comment explaining your approach and assumptions.',
          xp: 25,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'feedback',
        subject: 'That report was solid',
        body: `For the record — the board was happy with the analysis quality. Figures were clear and the narrative made sense to non-technical people.\n\nKeep that standard.\n\nSE`,
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
        subject: 'Data export is broken — urgent',
        body: `Hi,\n\nOur team is trying to export last month's campaign data but the export keeps failing. We have a client presentation tomorrow morning and need this data tonight.\n\nCan you resolve this as a priority please?\n\nPriya Shah\nVantage Corp`,
        urgency: 'urgent',
        task: {
          title: 'Respond to Priya: data export failure',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'Priya Shah has reported that the data export function is failing ahead of a client presentation. Draft a professional response acknowledging the issue, explaining your investigation approach, and providing a realistic timeline for resolution.',
          xp: 35,
          due_offset_mins: 20,
        },
      },
      {
        kind: 'action',
        subject: 'Question about Q3 data discrepancy',
        body: `Hi,\n\nWe are reviewing the Q3 revenue figures in the dashboard and there seems to be a GBP 45k discrepancy vs our internal system. Before we raise this with our CFO we wanted to check with you first.\n\nCould you investigate?\n\nPriya Shah`,
        urgency: 'high',
        task: {
          title: 'Investigate Q3 revenue discrepancy flagged by client',
          type: 'email_reply',
          urgency: 'high',
          description: 'Priya Shah has flagged a GBP 45k discrepancy between dashboard revenue figures and their internal system. Respond professionally: acknowledge the query, explain your investigation approach, and commit to a timeframe. This will be seen by the client CFO.',
          xp: 30,
          due_offset_mins: 45,
        },
      },
      {
        kind: 'feedback',
        subject: 'Thank you for the quick turnaround',
        body: `Hi,\n\nJust a quick note — I appreciate how promptly you responded. The team was relieved to have a clear update.\n\nThis is exactly the kind of service we expect from Nexus.\n\nPriya Shah`,
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
        subject: 'Can you review my analysis before I send it?',
        body: `Hi,\n\nI've finished my first draft of the Q4 anomaly analysis. Sarah said I should ask a senior analyst to sense-check before sending to the team.\n\nCould you take a quick look and let me know if the logic holds?\n\nJames`,
        urgency: 'normal',
        task: {
          title: 'Review James\'s Q4 anomaly analysis',
          type: 'document',
          urgency: 'normal',
          description: 'James Obi (Junior Analyst) has asked you to review his Q4 anomaly analysis. Write a structured review: (1) logical gaps or errors, (2) what is done well, (3) 2-3 specific improvements. Be constructive — this is his first major piece of analysis.',
          xp: 20,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'action',
        subject: 'How do I write standup notes correctly?',
        body: `Hey,\n\nSorry to bother you — Sarah keeps saying my standup notes are too long. Can you show me what a good standup update looks like?\n\nJames`,
        urgency: 'normal',
        task: {
          title: 'Coach James on standup format',
          type: 'standup',
          urgency: 'normal',
          description: 'James Obi\'s standup notes are too long and unfocused. Write a brief coaching note: (1) what good standup notes look like, (2) a simple template, (3) a worked example. Keep it practical, not patronising.',
          xp: 15,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'feedback',
        subject: 'Your standup today was much clearer',
        body: `Hi,\n\nJust wanted to say — your standup notes today were much better. Concise and clear. I took notes from how you structured it.\n\nThanks for the help earlier.\n\nJames`,
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
        subject: 'Cost report for data infra spend needed',
        body: `Hi,\n\nI'm putting together the Q4 cost review and need a breakdown of the data infrastructure spend — cloud hosting, tooling licences, and API costs — by product line if possible.\n\nFinance review is Friday.\n\nRachel Mensah\nFinance BP`,
        urgency: 'normal',
        task: {
          title: 'Prepare data infra cost breakdown for Finance',
          type: 'report',
          urgency: 'normal',
          description: 'Rachel Mensah (Finance BP) needs a breakdown of Q4 data infrastructure spend by category: cloud hosting, tooling licences, and API costs. Break down by product line where possible. Note any unexpected cost spikes and flag savings opportunities.',
          xp: 25,
          due_offset_mins: 180,
        },
      },
      {
        kind: 'action',
        subject: 'Overspend on cloud — need explanation',
        body: `Hi,\n\nI've flagged a 23% overspend on cloud costs vs Q4 budget. I need an explanation from the data team before I close the books. Can you give me a brief summary of what drove this?\n\nRachel`,
        urgency: 'high',
        task: {
          title: 'Explain Q4 cloud overspend to Finance',
          type: 'report',
          urgency: 'high',
          description: 'Rachel from Finance has flagged a 23% overspend on cloud costs vs Q4 budget. Write a brief explanation: (1) main drivers, (2) one-off vs recurring costs, (3) proposed remediation or Q1 forecast adjustment. Be factual and clear.',
          xp: 30,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'feedback',
        subject: 'Report received — thank you',
        body: `Hi,\n\nThanks for the report — it had everything I needed and was easy to follow. The cost breakdown by product line was particularly helpful.\n\nI'll include it in the Q4 review pack.\n\nRachel`,
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
        subject: 'Need an explanation of the Line 2 stoppage',
        body: `Hi,\n\nI need a written explanation of today's Line 2 stoppage for my 3pm ops meeting. Production lost 2.5 hours and the ops director is going to ask me what happened.\n\nI need: what failed, why, how long it took to fix, and what prevents a recurrence. Keep it factual.\n\nDavid`,
        urgency: 'urgent',
        task: {
          title: 'Write Line 2 stoppage explanation for David',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'David Okafor (Production Manager) needs a factual explanation of today\'s Line 2 stoppage for the ops meeting. Draft a clear response covering: what failed, root cause, resolution time, and preventive measures. Keep it non-technical — David is production, not maintenance.',
          xp: 30,
          due_offset_mins: 30,
        },
      },
      {
        kind: 'action',
        subject: 'Production wants to run through the weekend — is the kit safe?',
        body: `Hi,\n\nWe're being asked to run a weekend production shift due to a large order. Before I commit I need your assessment of whether the key equipment is fit to run for 16 hours Saturday.\n\nSpecifically Compressor 2 and the Line 3 conveyor. Give me your honest view.\n\nDavid`,
        urgency: 'high',
        task: {
          title: 'Equipment fitness-to-run assessment for weekend shift',
          type: 'decision',
          urgency: 'high',
          description: 'David needs your engineering assessment of whether Compressor 2 and Line 3 conveyor are safe to run a 16-hour weekend shift. Review current equipment status, recent defect history, and outstanding work orders. Provide a clear go/no-go recommendation with your reasoning.',
          xp: 40,
          due_offset_mins: 45,
        },
      },
      {
        kind: 'feedback',
        subject: 'Good response on the stoppage',
        body: `Hi,\n\nThanks for the clear write-up. The ops director was satisfied and it helped deflect some of the pressure from my team.\n\nKeep communicating like that — it makes my job easier.\n\nDavid`,
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
        subject: 'PM backlog report needed before Friday',
        body: `Hi,\n\nI need a full PM backlog report before Friday's engineering review. Include all overdue work orders, age of each overdue task, and your proposed recovery schedule.\n\nI need to show the plant manager we have a plan.\n\nMK`,
        urgency: 'high',
        task: {
          title: 'Write PM backlog recovery report for Friday',
          type: 'report',
          urgency: 'high',
          description: 'Mike needs a PM backlog report for the engineering review. List all overdue work orders, their age, root cause of the backlog, and a realistic recovery schedule. The plant manager will see this — it needs to be credible, not optimistic.',
          xp: 35,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'action',
        subject: 'Update the risk register with today\'s issues',
        body: `Hi,\n\nAfter today's events I need the risk register updated before end of shift. Add: Compressor 2 oil leak (risk level and monitoring plan) and the Pasteuriser 1 PM backlog (risk of failure if not cleared this week).\n\nMK`,
        urgency: 'normal',
        task: {
          title: 'Update risk register with Compressor 2 and Pasteuriser 1',
          type: 'document',
          urgency: 'normal',
          description: 'Mike has asked you to update the maintenance risk register with two new entries: (1) Compressor 2 oil leak — risk level, current status, and monitoring plan; (2) Pasteuriser 1 PM backlog — failure risk if not cleared this week. Be specific and honest about severity.',
          xp: 20,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'feedback',
        subject: 'Good shift today',
        body: `Hi,\n\nJust to say — you handled today well. The Line 2 bearing was dealt with quickly and your documentation was clear. David was happy with the communication too.\n\nMK`,
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
        body: `Hi,\n\nThe Compressor 2 oil leak falls within our near-miss reporting threshold. I need a completed near-miss report form before end of shift. This is a regulatory requirement.\n\nTemplate is on the H&S shared drive.\n\nSandra`,
        urgency: 'urgent',
        task: {
          title: 'Complete near-miss report for Compressor 2 oil leak',
          type: 'document',
          urgency: 'urgent',
          description: 'Sandra Nwosu (H&S Manager) has flagged that the Compressor 2 oil leak requires a near-miss report under regulatory requirements. Write the near-miss report covering: incident description, contributory factors, immediate actions taken, and preventive measures. Be thorough — this is a legal document.',
          xp: 25,
          due_offset_mins: 40,
        },
      },
      {
        kind: 'action',
        subject: 'H&S review of the bearing replacement procedure',
        body: `Hi,\n\nFollowing today's bearing replacement on Line 2, I need your confirmation that the LOTO procedure was followed correctly. Please write me a brief record of the safety steps taken.\n\nThis is for the audit trail.\n\nSandra`,
        urgency: 'normal',
        task: {
          title: 'Document LOTO compliance for Line 2 bearing replacement',
          type: 'decision',
          urgency: 'normal',
          description: 'Sandra Nwosu needs a written record confirming the lockout/tagout (LOTO) procedure was correctly followed during today\'s Line 2 bearing replacement. Document each step taken, who authorised the work, and how equipment was made safe. This is for the regulatory audit trail.',
          xp: 20,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'feedback',
        subject: 'Near-miss report was well completed',
        body: `Hi,\n\nThank you for submitting the near-miss report on time and with the required level of detail. The corrective actions section was particularly thorough.\n\nSandra`,
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
        subject: 'Confused about the Pasteuriser 1 PM plan',
        body: `Hi,\n\nMike asked me to start on the Pasteuriser 1 PM work tomorrow morning. But I'm not sure which tasks to prioritise within the 30-minute window. Can you tell me what to do first?\n\nKwame`,
        urgency: 'normal',
        task: {
          title: 'Give Kwame clear instructions for Pasteuriser 1 PM',
          type: 'standup',
          urgency: 'normal',
          description: 'Kwame Asante (Junior Technician) needs clear prioritisation for the 30-minute Pasteuriser 1 PM window tomorrow morning. Write brief instructions: which tasks to complete first, what tools he will need, any safety precautions, and how to report completion. Be clear — he is junior.',
          xp: 15,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'action',
        subject: 'I found something on Conveyor 4 — should I report it?',
        body: `Hi,\n\nWhile I was checking Line 3 I noticed some unusual wear on the Conveyor 4 drive chain. I'm not sure if it's serious enough to flag. Can you have a look and tell me what to do?\n\nKwame`,
        urgency: 'normal',
        task: {
          title: 'Assess Conveyor 4 drive chain wear — coach Kwame',
          type: 'decision',
          urgency: 'normal',
          description: 'Kwame has flagged unusual wear on the Conveyor 4 drive chain. Assess the severity based on his description and respond: (1) whether this warrants an immediate work order, (2) what monitoring should be done, (3) coach him on how to assess drive chain wear in future. This is a development opportunity.',
          xp: 25,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'feedback',
        subject: 'Thanks for the clear instructions earlier',
        body: `Hi,\n\nThe PM went well this morning — I knew exactly what to do because of your instructions. Completed both tasks within the 30-minute window.\n\nKwame`,
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
        subject: 'Emergency bearing order — need your spec now',
        body: `Hi,\n\nI can get a bearing delivered by 6am tomorrow but I need your exact specification in the next 30 minutes or I'll miss the supplier's cut-off. Part number, tolerance grade, and quantity.\n\nTony`,
        urgency: 'urgent',
        task: {
          title: 'Provide bearing specification to Tony for emergency order',
          type: 'scope_decision',
          urgency: 'urgent',
          description: 'Tony Briggs (Procurement) needs the exact bearing specification within 30 minutes to place an emergency order for 6am delivery. Provide the complete specification: part number, bearing type, tolerance grade, dimensions, and quantity needed. Also flag if there are acceptable alternatives in case the exact spec is unavailable.',
          xp: 30,
          due_offset_mins: 25,
        },
      },
      {
        kind: 'action',
        subject: 'Should we dual-source the bearing supplier?',
        body: `Hi,\n\nAfter today's scramble I think we should look at dual-sourcing the main drive bearings so we're not dependent on one supplier for emergency orders. Can you give me your view on what we should hold as on-site spares vs what we order on-demand?\n\nTony`,
        urgency: 'normal',
        task: {
          title: 'Write spares stockholding recommendation for Procurement',
          type: 'scope_decision',
          urgency: 'normal',
          description: 'Tony Briggs has asked for your recommendation on spare parts stockholding strategy vs on-demand ordering for drive bearings. Consider: cost of holding spares vs downtime risk, which bearings are most critical, lead times. Write a clear recommendation with justification.',
          xp: 25,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'feedback',
        subject: 'Good spec — order is placed',
        body: `Hi,\n\nBearing spec was exactly what I needed. Order placed and confirmed for 6am delivery. Well done for having the detail to hand.\n\nTony`,
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
        subject: 'Board pack exec summary — I need it by 4pm',
        body: `Hi,\n\nI need a one-page executive summary of your variance analysis for the board pack. It must include: (1) headline finding, (2) top 3 drivers of the profit decline, (3) one recommendation.\n\nBoard pack locks at 4pm. Do not miss it.\n\nAO`,
        urgency: 'urgent',
        task: {
          title: 'Write CFO exec summary for board pack — 4pm deadline',
          type: 'document',
          urgency: 'urgent',
          description: 'Amara needs a one-page executive summary of your variance analysis for the board pack. Include: (1) headline finding, (2) top 3 drivers of the profit decline, (3) one concrete recommendation. Board pack locks at 4pm — be concise, precise, and boardroom-ready.',
          xp: 45,
          due_offset_mins: 25,
        },
      },
      {
        kind: 'action',
        subject: 'I need the downside scenario refreshed — assumptions changed',
        body: `Hi,\n\nThe macro team have revised their FX assumptions. I need the downside scenario refreshed to reflect a 12% GBP/USD decline instead of 8%.\n\nBoard meeting is tomorrow. How quickly can you turn this around?\n\nAO`,
        urgency: 'urgent',
        task: {
          title: 'Refresh downside scenario model with revised FX assumptions',
          type: 'report',
          urgency: 'urgent',
          description: 'Amara needs the downside financial scenario refreshed: FX assumption changes from 8% to 12% GBP/USD decline. Update the model and document: (1) updated downside revenue and EBITDA, (2) sensitivity to the change, (3) any other assumptions you reviewed while you were in the model. Board meeting is tomorrow.',
          xp: 40,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'feedback',
        subject: 'The board was pleased with the analysis',
        body: `Hi,\n\nThe board found your analysis clear and well-structured. The commentary on the drivers was particularly good — it saved me having to explain it myself.\n\nAO`,
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
        subject: 'Month-end actuals need your narrative commentary',
        body: `Hi,\n\nI've loaded the month-end actuals into the system but Amara wants narrative commentary on the key variances by tomorrow morning. Can you draft the commentary for the three biggest line items?\n\nDaniel`,
        urgency: 'high',
        task: {
          title: 'Write month-end variance commentary for Amara',
          type: 'report',
          urgency: 'high',
          description: 'Daniel has loaded month-end actuals and Amara wants narrative commentary on the three largest variances. Write clear, concise commentary for each: what drove the variance, whether it is one-off or recurring, and the implication for the full-year forecast. This goes to the CFO.',
          xp: 35,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'action',
        subject: 'Your budget assumptions look off — worth checking',
        body: `Hi,\n\nI noticed your base case assumes 8% revenue growth. Our latest pipeline data is tracking closer to 5-6%. I think the assumption needs revisiting before it goes to the board.\n\nWorth a second look?\n\nDaniel`,
        urgency: 'normal',
        task: {
          title: 'Review and defend budget growth assumption',
          type: 'report',
          urgency: 'normal',
          description: 'Daniel has challenged your 8% revenue growth assumption in the base case, suggesting 5-6% is more realistic. Review the assumption: assess the evidence for both positions, decide whether to revise, and write a clear response to Daniel (and copy Amara) explaining your conclusion and rationale.',
          xp: 30,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'feedback',
        subject: 'Strong work on the variance analysis',
        body: `Hi,\n\nJust read through your variance analysis — the waterfall bridge was clear and the commentary was honest about the shortfalls. Amara specifically mentioned it.\n\nGood work.\n\nDaniel`,
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
        subject: 'Should we approve the marketing budget uplift?',
        body: `Hi,\n\nMarketing have requested a GBP 180k budget uplift for Q1 paid media. They're projecting a 3x return. Amara has asked me to get a second opinion before she signs it off.\n\nWhat's your view?\n\nPriya`,
        urgency: 'high',
        task: {
          title: 'Analyse and recommend on marketing budget uplift request',
          type: 'decision',
          urgency: 'high',
          description: 'Amara has asked for a second opinion on a GBP 180k Q1 marketing budget uplift. Analyse the request: assess the credibility of the 3x return projection, identify risks, and provide a clear recommendation to Priya and Amara — approve, decline, or approve with conditions. Back your recommendation with numbers.',
          xp: 40,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'action',
        subject: 'New commercial contract — financial terms need review',
        body: `Hi,\n\nWe have a new enterprise contract that Legal has cleared. Before Amara signs, she wants a financial review of the terms — specifically the payment schedule, penalties, and revenue recognition treatment.\n\nCan you take a look?\n\nPriya`,
        urgency: 'normal',
        task: {
          title: 'Review financial terms of new enterprise contract',
          type: 'decision',
          urgency: 'normal',
          description: 'Amara wants a financial review of a new enterprise contract before she signs. Review: (1) payment schedule and cash flow implications, (2) penalty clauses and downside risk, (3) revenue recognition treatment under IFRS 15. Write a clear summary with your recommendation — approve, flag concerns, or request amendments.',
          xp: 35,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'feedback',
        subject: 'Good analysis on that decision',
        body: `Hi,\n\nYour analysis was thorough and Amara appreciated the clear recommendation. The revenue recognition point was particularly astute — she hadn't spotted that.\n\nPriya`,
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
        subject: 'Audit documentation request — revenue recognition workings',
        body: `Hello,\n\nAs part of our year-end audit procedures I need to review the revenue recognition workings for your top 5 contracts by value. Please provide the relevant documentation and supporting schedules by Friday.\n\nFatima Al-Hassan\nEY`,
        urgency: 'high',
        task: {
          title: 'Prepare revenue recognition audit pack for EY',
          type: 'document',
          urgency: 'high',
          description: 'External auditor Fatima Al-Hassan has requested revenue recognition workings for your top 5 contracts by value. Prepare a clear audit pack: (1) contract summary for each, (2) revenue recognition method applied, (3) key judgements and their basis, (4) supporting calculations. Audit documentation must be precise and defensible.',
          xp: 35,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'action',
        subject: 'Audit query — provision calculation methodology',
        body: `Hello,\n\nWe have a query on the methodology used for the bad debt provision. The current provision appears below sector benchmarks. Please provide a written explanation of the methodology and key assumptions.\n\nFatima Al-Hassan\nEY`,
        urgency: 'normal',
        task: {
          title: 'Respond to auditor\'s bad debt provision query',
          type: 'document',
          urgency: 'normal',
          description: 'EY have flagged that the bad debt provision appears below sector benchmarks. Write a clear, defensible explanation of: (1) the methodology used, (2) the key assumptions and their basis, (3) why you believe the provision is appropriate given the company\'s specific debtor profile. This is a formal audit response.',
          xp: 30,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'feedback',
        subject: 'Documentation received — no further queries at this stage',
        body: `Hello,\n\nThank you for the documentation. The revenue recognition workings were well-presented and the supporting schedules were complete. No further queries on this area at this stage.\n\nFatima Al-Hassan\nEY`,
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
        subject: 'Can we discount this contract to win the deal?',
        body: `Hi,\n\nWe're close to landing a major new contract but the client is asking for a 15% discount. At the current margin, Finance won't like it. Can you model the impact and tell me what the minimum acceptable discount is?\n\nChris`,
        urgency: 'urgent',
        task: {
          title: 'Model discount impact on proposed contract margin',
          type: 'scope_decision',
          urgency: 'urgent',
          description: 'Chris Okafor wants to know the minimum acceptable discount on a major contract. Model the P&L impact of the requested 15% discount vs current pricing: (1) margin at each discount level, (2) break-even point, (3) your recommendation — whether to accept and at what conditions. Chris needs this before tomorrow\'s negotiation.',
          xp: 40,
          due_offset_mins: 45,
        },
      },
      {
        kind: 'action',
        subject: 'New product launch financials — do the numbers stack up?',
        body: `Hi,\n\nWe're presenting the new product launch business case to the board next week. Can you give me your honest view on whether the financial projections are robust? I'd rather know now than be challenged in the boardroom.\n\nChris`,
        urgency: 'normal',
        task: {
          title: 'Challenge new product launch financial projections',
          type: 'scope_decision',
          urgency: 'normal',
          description: 'Chris wants an honest financial review of the new product launch business case before the board presentation. Critique: (1) revenue assumptions — are they realistic?, (2) cost base — what\'s missing?, (3) the key risks the board will challenge. Write a structured brief — be direct, not diplomatic.',
          xp: 30,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'feedback',
        subject: 'The model was exactly what I needed',
        body: `Hi,\n\nYour analysis saved us from a bad deal. We ended up pushing back on the discount and the client accepted 8%. Your break-even analysis was the reason we held firm.\n\nChris`,
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
        subject: 'I need your recommendation on the sprint backlog — now',
        body: `Morning,\n\nThree stakeholders, one slot. I want your recommendation by 10am with data to back it. Don't send me a summary of the three options — tell me which one we build and why.\n\nJH`,
        urgency: 'urgent',
        task: {
          title: 'Provide sprint priority recommendation to James',
          type: 'decision',
          urgency: 'urgent',
          description: 'James wants a clear recommendation on which of the three competing sprint backlog items to build. Write a decision brief: (1) your recommended option, (2) the data or logic that supports it, (3) how you will communicate the decision to the stakeholders whose items weren\'t chosen. Do not hedge.',
          xp: 40,
          due_offset_mins: 30,
        },
      },
      {
        kind: 'action',
        subject: 'Priya is escalating — I want a plan before she reaches the board',
        body: `Hi,\n\nPriya has emailed again. If we don't act today she's going to the board. I want a plan from you before 12pm: what we're doing, when she will see results, and how we get in front of the narrative.\n\nJH`,
        urgency: 'urgent',
        task: {
          title: 'Write escalation management plan for Priya',
          type: 'scope_decision',
          urgency: 'urgent',
          description: 'Priya Shah is threatening to escalate to the board about the delayed feature. Write a management plan for James: (1) what we commit to delivering and by when, (2) the message we proactively send to Priya today, (3) what we need internally to deliver on the commitment. Be realistic — do not over-promise to buy time.',
          xp: 45,
          due_offset_mins: 40,
        },
      },
      {
        kind: 'feedback',
        subject: 'Good decision under pressure',
        body: `Quick note — the way you handled the sprint backlog decision was professional. Clear reasoning, and you communicated it well to the stakeholders. That's the standard I expect.\n\nJH`,
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
        subject: 'This user story is not ready for dev',
        body: `Hi,\n\nI've read the reporting feature user story. There are gaps — the acceptance criteria don't cover edge cases and the data source is undefined. I can't start building from this.\n\nCan you rewrite it to a level where I can actually estimate it?\n\nSE`,
        urgency: 'high',
        task: {
          title: 'Rewrite reporting feature user story to dev-ready standard',
          type: 'document',
          urgency: 'high',
          description: 'Sarah Chen (Senior Dev) has flagged that the reporting feature user story is incomplete. Rewrite it to a dev-ready standard: clear user need, full acceptance criteria covering edge cases, defined data source, and a worked example of the expected output. Sarah needs to estimate it — leave nothing ambiguous.',
          xp: 35,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'action',
        subject: 'FYI — I am not available to build the extra feature Marcus agreed',
        body: `FYI — I've just heard from Marcus that he told the client we'd add a bulk export feature by Friday. I have no capacity for this and it was never on the roadmap.\n\nYou need to sort this out. I\'m not committing to something I wasn\'t consulted on.\n\nSE`,
        urgency: 'urgent',
        task: {
          title: 'Resolve capacity conflict between Marcus and Sarah',
          type: 'scope_decision',
          urgency: 'urgent',
          description: 'Marcus has committed the client to a bulk export feature by Friday without consulting the dev team. Sarah has no capacity. Resolve this professionally: (1) assess whether Friday is feasible, (2) decide what to communicate to the client, (3) establish how to prevent this happening again. You will need to manage both Marcus and Sarah.',
          xp: 40,
          due_offset_mins: 30,
        },
      },
      {
        kind: 'feedback',
        subject: 'User story was much better',
        body: `Hi,\n\nThe revised user story was clear enough to estimate. Acceptance criteria were specific and the edge cases were covered. That\'s the standard we need.\n\nSE`,
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
        subject: 'Priya is escalating — need your help',
        body: `Hi,\n\nJust a heads up — Priya has emailed me again about the feature. She's not happy and mentioned going to the board.\n\nI know this isn't ideal timing but can you draft a response to her? I'll review before it goes. We need to get ahead of this.\n\nMarcus`,
        urgency: 'urgent',
        task: {
          title: 'Draft response to Priya Shah escalation',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'Marcus needs you to draft a response to Priya Shah who is threatening to escalate to the board about the delayed feature. Draft a professional response that: (1) acknowledges her frustration honestly, (2) explains the delay without making excuses, (3) proposes a concrete next step with a realistic date. Marcus will review before it\'s sent.',
          xp: 40,
          due_offset_mins: 20,
        },
      },
      {
        kind: 'action',
        subject: 'I may have over-promised on the demo timeline',
        body: `Hey,\n\nOkay so I may have told the prospect that we could have a live demo ready by Thursday. Is that possible? I know it's tight but it's a big deal.\n\nMarcus`,
        urgency: 'high',
        task: {
          title: 'Respond to Marcus about demo timeline feasibility',
          type: 'email_reply',
          urgency: 'high',
          description: 'Marcus has committed to a Thursday demo without checking with the product team. Respond professionally: (1) assess whether Thursday is feasible, (2) if not, what is the earliest realistic date, (3) advise Marcus on what he should tell the prospect. Be direct — do not just say yes to make him feel better.',
          xp: 30,
          due_offset_mins: 40,
        },
      },
      {
        kind: 'feedback',
        subject: 'Priya came back positively',
        body: `Hey,\n\nJust heard from Priya — she was really happy with the response. Said it was clear, honest, and gave her what she needed to brief her board.\n\nNice work!\n\nMarcus`,
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
        subject: 'I need a brief before I start the UX designs',
        body: `Hi,\n\nI\'m ready to start the UX for the new onboarding flow but I don\'t have a clear brief. I need: target user, the key actions they need to complete, and what success looks like. Can you write this up for me?\n\nYemi`,
        urgency: 'normal',
        task: {
          title: 'Write UX brief for new onboarding flow',
          type: 'document',
          urgency: 'normal',
          description: 'Yemi Adeyinka (UX Designer) needs a brief before starting the onboarding flow designs. Write a clear UX brief covering: (1) target user persona and context, (2) key actions the user must complete in onboarding, (3) definition of success — what does a good onboarding completion look like?, (4) any constraints or non-negotiables.',
          xp: 25,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'action',
        subject: 'Design review feedback needed — quick turnaround',
        body: `Hi,\n\nI've shared the first design mockups for the dashboard in Figma. I need written feedback before I progress to the next iteration. Specifically on the navigation structure and the data visualisation choices.\n\nYemi`,
        urgency: 'normal',
        task: {
          title: 'Provide structured feedback on dashboard design mockups',
          type: 'document',
          urgency: 'normal',
          description: 'Yemi has shared design mockups for the dashboard and needs structured written feedback before the next iteration. Review from a product and user perspective: (1) does the navigation structure match user mental models?, (2) are the data visualisation choices appropriate for the target audience?, (3) three specific changes you\'d prioritise.',
          xp: 20,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'feedback',
        subject: 'Brief was exactly what I needed',
        body: `Hi,\n\nThank you for the UX brief — it was clear and gave me everything I needed to start. The user persona context was particularly helpful. Designs are underway.\n\nYemi`,
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
        subject: 'Feature still not live — I need answers',
        body: `Hi,\n\nThe feature promised two weeks ago is still not live. My team is blocked and I am running out of patience. I need a clear explanation of what has happened and when I can expect this resolved.\n\nPriya Shah\nVantage Corp`,
        urgency: 'urgent',
        task: {
          title: 'Respond to Priya Shah feature delay escalation',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'Priya Shah is escalating about a feature that is 2 weeks late. Draft a professional response that: (1) acknowledges the delay honestly, (2) explains what caused it without being defensive, (3) gives a clear, realistic delivery date, (4) proposes interim support if possible. James Hargreaves is copied in.',
          xp: 40,
          due_offset_mins: 20,
        },
      },
      {
        kind: 'action',
        subject: 'New requirement — can we add this to the current sprint?',
        body: `Hi,\n\nFollowing our last meeting I have a new requirement that I believe is essential for our go-live. It should only take a day or two. Can this be added to the current sprint?\n\nPriya Shah`,
        urgency: 'high',
        task: {
          title: 'Respond to Priya\'s mid-sprint change request',
          type: 'email_reply',
          urgency: 'high',
          description: 'Priya Shah has requested a mid-sprint change, estimating "a day or two". Draft a professional response: (1) acknowledge the request, (2) explain the process for assessing mid-sprint changes and their impact on delivery, (3) either accept with clear conditions or defer to next sprint with a reason. Manage expectations without being dismissive.',
          xp: 30,
          due_offset_mins: 40,
        },
      },
      {
        kind: 'feedback',
        subject: 'Thank you for the honest update',
        body: `Hi,\n\nI appreciate the transparency in your last response. It was more honest than I expected and the proposed interim solution was helpful. We can work with this timeline.\n\nPriya Shah`,
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
        subject: 'I want a recovery plan before the board call',
        body: `Morning,\n\nThe Amber status in the RAG report is going to trigger questions. I want a draft recovery plan on my desk before the 2pm board call — covering what has slipped, why, and how we get back on track.\n\nOne page. Be honest.\n\nJH`,
        urgency: 'urgent',
        task: {
          title: 'Write project recovery plan for board call',
          type: 'document',
          urgency: 'urgent',
          description: 'James needs a one-page recovery plan before the 2pm board call, covering: (1) what has slipped and why, (2) revised timeline with milestones, (3) resources needed to recover, (4) risks if recovery plan isn\'t approved. Be direct — the board will challenge vague plans.',
          xp: 45,
          due_offset_mins: 30,
        },
      },
      {
        kind: 'action',
        subject: 'RAID log update needed — board will ask',
        body: `Hi,\n\nThe RAID log hasn\'t been updated in two weeks. The board will want to see it and it needs to reflect current status. Update it today — all four quadrants. Pay particular attention to the new risks from the scope change.\n\nJH`,
        urgency: 'high',
        task: {
          title: 'Update RAID log with current project risks',
          type: 'report',
          urgency: 'high',
          description: 'James needs the RAID log updated across all four quadrants (Risks, Assumptions, Issues, Dependencies). Ensure the risk register reflects: (1) new risks introduced by the scope change request, (2) current status of all open issues, (3) updated dependency timeline. The board will review this.',
          xp: 30,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'feedback',
        subject: 'Good report — honest and clear',
        body: `The RAG status report was the best I've seen from this project team. Honest about where we are, clear on the actions. That's how you build trust with a board.\n\nJH`,
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
        subject: 'Change request submitted — when can we discuss?',
        body: `Hi,\n\nWe've submitted a change request for the three additional features. I understand this has timeline implications but these features are critical for our board approval of phase 2.\n\nWhen can we discuss?\n\nRachel Okonkwo\nClient PMO Lead`,
        urgency: 'high',
        task: {
          title: 'Respond to client change request — impact assessment',
          type: 'scope_decision',
          urgency: 'high',
          description: 'Rachel Okonkwo has submitted a change request for three new features at 75% project completion. Respond professionally: (1) acknowledge the request, (2) provide a preliminary impact assessment (timeline, cost, resource), (3) propose a formal change control meeting. Do not just accept or reject without a proper assessment.',
          xp: 40,
          due_offset_mins: 45,
        },
      },
      {
        kind: 'action',
        subject: 'Emergency call requested — how do you respond?',
        body: `Hi,\n\nThe client sponsor has heard the project is behind and has requested an emergency call today. She wants to understand the situation directly.\n\nCan you arrange this and confirm with me?\n\nRachel Okonkwo`,
        urgency: 'urgent',
        task: {
          title: 'Arrange and prepare for emergency client sponsor call',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'The client sponsor wants an emergency call today. Respond to Rachel: (1) propose a call time (2pm or 4pm today), (2) set a brief agenda — what the call will cover, (3) confirm who should attend from your side. Also write a 3-point internal brief to prepare your team for the call.',
          xp: 35,
          due_offset_mins: 25,
        },
      },
      {
        kind: 'feedback',
        subject: 'The sponsor was reassured',
        body: `Hi,\n\nThe call went well. The sponsor said she felt properly briefed for the first time. Your status update was clear and the recovery plan gave her confidence.\n\nRachel Okonkwo`,
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
        subject: 'Technical risk — new scope will break the architecture',
        body: `Hi,\n\nI need to flag a technical risk. The three features in the change request require changes to the core data model that will take 3 weeks, not the 2 days the client thinks. If we commit to the timeline without accounting for this, we will fail.\n\nBen`,
        urgency: 'urgent',
        task: {
          title: 'Address technical architecture risk in change request',
          type: 'decision',
          urgency: 'urgent',
          description: 'Ben Afolabi has flagged a critical technical risk: the change request requires 3 weeks of data model work, not 2 days. You need to make a decision: (1) how do you incorporate this into the change control impact assessment, (2) how do you communicate this to the client without losing the relationship, (3) what is your recommended approach?',
          xp: 40,
          due_offset_mins: 30,
        },
      },
      {
        kind: 'action',
        subject: 'Build vs buy decision — I need a PM view',
        body: `Hi,\n\nWe need to decide whether to build the reporting module in-house or use a third-party tool. I have a technical view but James wants your perspective on the project risk and commercial implications.\n\nBen`,
        urgency: 'normal',
        task: {
          title: 'Build vs buy recommendation for reporting module',
          type: 'decision',
          urgency: 'normal',
          description: 'Ben needs your project management perspective on a build vs buy decision for the reporting module. Evaluate from a PM lens: (1) build — timeline risk, team capacity, long-term maintenance; (2) buy — integration risk, cost, vendor dependency; (3) your recommendation with rationale. James will use this to make the final call.',
          xp: 30,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'feedback',
        subject: 'Good call on the architecture decision',
        body: `Hi,\n\nThe decision you made on the architecture issue was the right one. You managed the client expectation professionally while protecting the integrity of the delivery.\n\nBen`,
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
        subject: 'Change request needs a formal variation order',
        body: `Hi,\n\nAny change to the project scope needs to be formalised in a Variation Order before work begins. Without it, the client can dispute the additional cost.\n\nCan you draft the Variation Order for the three new features? I can review before it goes to the client.\n\nSandra`,
        urgency: 'high',
        task: {
          title: 'Draft Variation Order for client change request',
          type: 'document',
          urgency: 'high',
          description: 'Sandra needs a formal Variation Order drafted for the client\'s three-feature change request. Include: (1) description of the additional scope, (2) additional timeline (in working days), (3) additional cost (outline estimate), (4) impact on project completion date, (5) client approval signature block. Sandra will review before it goes to the client.',
          xp: 30,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'action',
        subject: 'Client communications are creating contractual risk',
        body: `Hi,\n\nI've been reviewing the email chain with the client and some of the language being used is creating contractual ambiguity around deliverables. I need you to write a formal clarification email to the client to reset expectations.\n\nSandra`,
        urgency: 'high',
        task: {
          title: 'Write contractual clarification email to client',
          type: 'document',
          urgency: 'high',
          description: 'Sandra has identified that informal email communications have created contractual ambiguity around project deliverables. Write a professional clarification email to the client that: (1) references the contract, (2) clearly restates the agreed scope, (3) corrects any implied commitments, (4) proposes a formal sign-off of agreed scope. Must be approved by Sandra before sending.',
          xp: 35,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'feedback',
        subject: 'Variation Order was well drafted',
        body: `Hi,\n\nThe Variation Order was well structured and covered all the necessary contractual elements. Client has signed it. We\'re protected.\n\nSandra`,
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
        subject: 'Not sure how to handle a tricky stakeholder situation',
        body: `Hi,\n\nI had a difficult conversation with one of the workstream leads today. They pushed back on a deadline I gave them and I didn't know how to handle it. Can you advise?\n\nKwame`,
        urgency: 'normal',
        task: {
          title: 'Coach Kwame on stakeholder challenge management',
          type: 'standup',
          urgency: 'normal',
          description: 'Kwame Asante (Junior PM) is struggling to handle a workstream lead who is pushing back on deadlines. Write a coaching response: (1) how to approach the conversation, (2) the difference between a legitimate concern and resistance, (3) how to document and escalate if needed. Use a concrete example or framework.',
          xp: 15,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'action',
        subject: 'Can you review my project status update?',
        body: `Hi,\n\nI've written my first project status update for James and I want to make sure it's in the right format and tone. Can you take a quick look before I send it?\n\nKwame`,
        urgency: 'normal',
        task: {
          title: 'Review Kwame\'s draft project status update',
          type: 'document',
          urgency: 'normal',
          description: 'Kwame has drafted his first project status update for the Programme Director. Review it and write structured feedback: (1) is the status assessment (RAG) well-supported with evidence?, (2) is the language appropriate for senior stakeholders?, (3) what is missing?, (4) what should he do differently next time?',
          xp: 20,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'feedback',
        subject: 'Thanks for the coaching — it worked',
        body: `Hi,\n\nI had the conversation with the workstream lead today using your advice. It went much better. We agreed a revised deadline and I documented it properly.\n\nKwame`,
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
        subject: 'I need a recommendation, not a summary',
        body: `Morning,\n\nI've read your campaign performance summary. What I actually need is a recommendation — what do we do next? Adjust the targeting? Kill one ad set? Shift budget?\n\nGive me a decision with a rationale. 3pm.\n\nJH`,
        urgency: 'urgent',
        task: {
          title: 'Write campaign optimisation recommendation for James',
          type: 'decision',
          urgency: 'urgent',
          description: 'James wants a clear campaign recommendation, not more data. Write a 1-page recommendation: (1) your recommended action (specific — e.g. kill ad set 2, increase budget on set 3 by 40%), (2) the data that supports this, (3) expected impact and how you\'ll measure success. No hedging.',
          xp: 40,
          due_offset_mins: 30,
        },
      },
      {
        kind: 'action',
        subject: 'Marketing reporting template needs updating — this quarter\'s is weak',
        body: `Hi,\n\nThis quarter's performance report is harder to read than it should be. The executive summary doesn't lead with the key insight and the data is buried.\n\nRewrite the template and apply it to this quarter's data. I want the new version to set the standard going forward.\n\nJH`,
        urgency: 'normal',
        task: {
          title: 'Rewrite marketing performance report template',
          type: 'report',
          urgency: 'normal',
          description: 'James wants the marketing performance report template improved. Create a new version that: (1) leads with the key business insight (not data), (2) structures the report for executive readers, (3) makes recommendations prominent. Apply the new template to this quarter\'s campaign data to demonstrate the improvement.',
          xp: 30,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'feedback',
        subject: 'Good recommendation — we\'re moving on it',
        body: `Your recommendation was clear and well-backed. We're reallocating the budget as you suggested. Let's see if the ROAS improves as predicted.\n\nJH`,
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
        subject: 'Budget cut across the three ad sets — how do we split it?',
        body: `Hi,\n\nWith the 40% budget cut, I need a decision on how to redistribute across the three active ad sets. My view is we should kill the worst performer and consolidate, but James said to check with you first.\n\nWhat do you think?\n\nTom`,
        urgency: 'urgent',
        task: {
          title: 'Decide how to redistribute paid media budget after 40% cut',
          type: 'decision',
          urgency: 'urgent',
          description: 'Tom needs a decision on redistributing the paid media budget after a 40% cut across three ad sets. Make a clear recommendation: which ad set(s) to pause, how to reallocate the remaining budget, and the rationale. Base the decision on ROAS and audience performance data. Tom will implement your recommendation.',
          xp: 35,
          due_offset_mins: 30,
        },
      },
      {
        kind: 'action',
        subject: 'ROAS report for Q4 — can you review before I send to James?',
        body: `Hi,\n\nI've put together the Q4 ROAS report but I'm not confident in the attribution model I've used. Can you review the methodology and let me know if the numbers are defensible?\n\nTom`,
        urgency: 'normal',
        task: {
          title: 'Review Tom\'s Q4 ROAS report methodology',
          type: 'report',
          urgency: 'normal',
          description: 'Tom is uncertain about the attribution model in his Q4 ROAS report. Review the methodology: (1) is the attribution approach appropriate for the campaign mix?, (2) are there any gaps or double-counting risks?, (3) what caveats should he include? Write a structured review he can use to strengthen the report before it goes to James.',
          xp: 25,
          due_offset_mins: 90,
        },
      },
      {
        kind: 'feedback',
        subject: 'Budget reallocation is performing well',
        body: `Hi,\n\nTwo days in and the consolidated budget on ad set 1 is already showing improved ROAS. Your call on killing set 3 was the right one.\n\nTom`,
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
        subject: 'Need landing page copy — design team is waiting',
        body: `Hi,\n\nThe design team needs the hero copy for the new product landing page. They\'re ready to start but I can't give them anything without your approval.\n\nHero headline, subheadline, and CTA. Audience: mid-market B2B buyers. Can you write or approve something today?\n\nYemi`,
        urgency: 'high',
        task: {
          title: 'Write landing page hero copy for B2B product',
          type: 'document',
          urgency: 'high',
          description: 'Yemi needs approved landing page hero copy for the design team. Write: (1) hero headline — max 8 words, benefit-led, (2) subheadline — max 20 words, expands on the headline, (3) CTA button text — max 4 words. Audience: mid-market B2B buyers. Include a brief rationale for your copy choices.',
          xp: 25,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'action',
        subject: 'Content brief for email nurture sequence',
        body: `Hi,\n\nWe\'re building a 3-email nurture sequence for new trial sign-ups. I need a content brief before I start writing. What are the three core messages we want to land in each email?\n\nYemi`,
        urgency: 'normal',
        task: {
          title: 'Write content brief for 3-email nurture sequence',
          type: 'document',
          urgency: 'normal',
          description: 'Yemi needs a content brief for a 3-email nurture sequence targeting new trial sign-ups. Write a brief that covers: (1) the goal and audience for each email, (2) the core message or call-to-action, (3) the tone — is this product-led, educational, or social proof-focused?, (4) what outcome you want from each email (open, click, conversion).',
          xp: 20,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'feedback',
        subject: 'Copy approved — design has started',
        body: `Hi,\n\nDesign team loved the headline — they said it was the clearest brief they\'d been given in months. They\'ve already started the layout.\n\nYemi`,
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
        subject: 'Marketing leads are not converting — I need answers',
        body: `Hi,\n\nWe\'ve followed up on the last 80 leads from the paid campaign and the close rate is 4%. The quality is not there. Can you investigate what\'s happening and tell me what you\'re going to do about it?\n\nRachel Mensah\nHead of Sales`,
        urgency: 'urgent',
        task: {
          title: 'Respond to Rachel: paid media lead quality issue',
          type: 'email_reply',
          urgency: 'urgent',
          description: 'Rachel Mensah (Head of Sales) has escalated that paid media leads have a 4% close rate. Draft a professional response: (1) acknowledge the issue and take ownership, (2) outline what you will investigate (targeting, messaging, landing page, lead scoring), (3) propose a joint review with the sales team to align on ICP. Do not be defensive.',
          xp: 35,
          due_offset_mins: 25,
        },
      },
      {
        kind: 'action',
        subject: 'Can marketing support the Q1 pipeline push?',
        body: `Hi,\n\nWe\'re 22% behind on Q1 pipeline target and James has asked sales and marketing to come up with a joint plan. Can you put together a short campaign brief for an accelerated Q1 push?\n\nRachel`,
        urgency: 'high',
        task: {
          title: 'Write accelerated Q1 pipeline campaign brief',
          type: 'email_reply',
          urgency: 'high',
          description: 'Rachel needs a marketing campaign brief to support the Q1 pipeline push (22% below target). Draft a campaign brief covering: (1) campaign objective and target pipeline contribution, (2) channels and tactics, (3) timeline, (4) budget requirement. The brief will be presented to James — make it action-ready.',
          xp: 30,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'feedback',
        subject: 'The lead quality has improved',
        body: `Hi,\n\nI don\'t normally send emails like this but the lead quality from the last campaign was noticeably better. The team has commented on it. Whatever you changed in the targeting worked.\n\nRachel Mensah`,
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
        subject: 'Attribution model is giving conflicting results — help needed',
        body: `Hi,\n\nI\'m getting very different revenue attribution numbers from GA4 and our CRM. GA4 says email is driving 42% of revenue; CRM says 18%. I can\'t present conflicting data to James.\n\nHow should I approach this?\n\nDaniel`,
        urgency: 'high',
        task: {
          title: 'Help Daniel resolve GA4 vs CRM attribution discrepancy',
          type: 'report',
          urgency: 'high',
          description: 'Daniel Yeboah is struggling with a major attribution discrepancy between GA4 (42% email revenue) and CRM (18%). Help him resolve this: (1) explain the likely causes of the discrepancy (attribution windows, model differences), (2) recommend which figure to use for reporting and why, (3) advise on how to present the limitation to James. Write this as a clear brief for Daniel.',
          xp: 30,
          due_offset_mins: 60,
        },
      },
      {
        kind: 'action',
        subject: 'Competitor analysis needed for the strategy review',
        body: `Hi,\n\nJames wants a competitor marketing analysis for next week\'s strategy review. I can pull the data but I need guidance on what to include and how to structure it.\n\nDaniel`,
        urgency: 'normal',
        task: {
          title: 'Structure and commission competitor marketing analysis',
          type: 'report',
          urgency: 'normal',
          description: 'Daniel needs direction on structuring the competitor marketing analysis for the strategy review. Write a brief for him covering: (1) which competitors to include and why, (2) what dimensions to analyse (channels, messaging, positioning, campaign cadence), (3) the format and length James expects, (4) the strategic question the analysis should answer.',
          xp: 25,
          due_offset_mins: 120,
        },
      },
      {
        kind: 'feedback',
        subject: 'Attribution framework was really helpful',
        body: `Hi,\n\nThe framework you gave me made the attribution problem much clearer. I was able to explain the discrepancy to James and he was satisfied with the reasoning.\n\nDaniel`,
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
    // Pick one of the two action templates at random
    const actionIdx = Math.random() < 0.5 ? 0 : 1
    return colleague.templates[actionIdx]
  }
  return colleague.templates[2] // feedback
}
